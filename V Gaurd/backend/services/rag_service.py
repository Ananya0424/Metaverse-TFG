from pinecone import Pinecone
from openai import OpenAI
from backend.config import get_settings
from backend.utils.logger import logger


def _get_clients():
    settings = get_settings()
    pc = Pinecone(api_key=settings.pinecone_api_key)
    index = pc.Index(settings.pinecone_index_name)
    openai_client = OpenAI(api_key=settings.openai_api_key)
    return index, openai_client


def retrieve(query: str, language: str, top_k: int = 5) -> list:
    """Retrieve top_k relevant chunks from Pinecone.

    Searches ALL languages — multilingual embeddings match Tamil/Hindi/Malayalam
    queries against English product data correctly. Language filtering is NOT used
    so every language gets access to the full product knowledge base.
    The LLM is responsible for responding in the user's language.
    """
    try:
        index, openai_client = _get_clients()

        # Create query embedding
        embedding_response = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=query,
        )
        query_vector = embedding_response.data[0].embedding

        # No language filter — search all 166 vectors
        results = index.query(
            vector=query_vector,
            top_k=top_k,
            include_metadata=True,
        )

        chunks = []
        for match in results.matches:
            chunks.append({
                "text": match.metadata.get("text", ""),
                "source": match.metadata.get("source", ""),
                "source_type": match.metadata.get("source_type", ""),
                "language": match.metadata.get("language", ""),
                "score": match.score,
            })

        logger.info(f"RAG: {len(chunks)} chunks retrieved for lang={language}")
        return chunks

    except Exception as e:
        logger.error(f"RAG retrieval failed: {e}")
        return []
