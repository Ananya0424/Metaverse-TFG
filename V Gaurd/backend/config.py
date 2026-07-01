from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Groq
    groq_api_key: str = ""

    # OpenAI
    openai_api_key: str = ""

    # Pinecone
    pinecone_api_key: str = ""
    pinecone_environment: str = "us-west1-gcp"
    pinecone_index_name: str = "vguard-fan-assistant"

    # Google TTS
    google_tts_api_key: str = ""

    # Google Gemini (LLM)
    gemini_api_key: str = ""

    # Smart Scraper (local Ollama or Groq)
    smart_scraper_backend: str = "ollama"
    ollama_url: str = "http://localhost:11434"
    ollama_model: str = "qwen3.5:9b"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
