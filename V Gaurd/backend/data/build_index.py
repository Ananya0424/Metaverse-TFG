"""
Upload processed knowledge chunks to Pinecone as vector embeddings.

Deduplication strategy:
  - Each chunk gets a deterministic ID = MD5(text + source + language)
  - A local manifest (chunks/uploaded_ids.json) tracks what's already in Pinecone
  - On re-run, only NEW or CHANGED chunks are embedded and uploaded
  - Deleted chunks (removed from knowledge_chunks.json) are optionally purged

Usage:
    python build_index.py            # upload new/changed chunks only
    python build_index.py --full     # re-upload everything (ignore manifest)
"""

import os
import sys
import json
import time
import hashlib
import argparse

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

PINECONE_API_KEY   = os.getenv("PINECONE_API_KEY", "")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT", "us-east-1")
PINECONE_INDEX_NAME  = os.getenv("PINECONE_INDEX_NAME", "vguard-fan-assistant")
OPENAI_API_KEY     = os.getenv("OPENAI_API_KEY", "")

CHUNKS_FILE   = os.path.join(os.path.dirname(__file__), "chunks", "knowledge_chunks.json")
MANIFEST_FILE = os.path.join(os.path.dirname(__file__), "chunks", "uploaded_ids.json")
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIM   = 1536
BATCH_SIZE      = 100


# ── Helpers ───────────────────────────────────────────────────────────────────

def chunk_id(chunk: dict) -> str:
    """Deterministic ID from content — same text always = same ID."""
    key = chunk.get("text", "") + chunk.get("source", "") + chunk.get("language", "")
    return "c_" + hashlib.md5(key.encode("utf-8")).hexdigest()


def load_manifest() -> set:
    """Load set of already-uploaded vector IDs from local manifest."""
    if os.path.exists(MANIFEST_FILE):
        with open(MANIFEST_FILE, "r", encoding="utf-8") as f:
            return set(json.load(f))
    return set()


def save_manifest(uploaded_ids: set) -> None:
    os.makedirs(os.path.dirname(MANIFEST_FILE), exist_ok=True)
    with open(MANIFEST_FILE, "w", encoding="utf-8") as f:
        json.dump(sorted(uploaded_ids), f, indent=2)


# ── Index creation ────────────────────────────────────────────────────────────

def create_index(pc: Pinecone) -> None:
    existing = [idx.name for idx in pc.list_indexes()]
    if PINECONE_INDEX_NAME in existing:
        print(f"  Index '{PINECONE_INDEX_NAME}' already exists — skipping.")
        return
    print(f"  Creating index '{PINECONE_INDEX_NAME}'...")
    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=EMBEDDING_DIM,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=PINECONE_ENVIRONMENT),
    )
    while not pc.describe_index(PINECONE_INDEX_NAME).status["ready"]:
        print("  Waiting for index to be ready...")
        time.sleep(2)
    print("  ✅ Index ready.")


# ── Upload ────────────────────────────────────────────────────────────────────

def upload_chunks(pc: Pinecone, openai_client: OpenAI, full: bool = False) -> None:
    if not os.path.exists(CHUNKS_FILE):
        print(f"❌ {CHUNKS_FILE} not found. Run process_knowledge.py first.")
        return

    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        all_chunks = json.load(f)

    print(f"  Total chunks in file : {len(all_chunks)}")

    # Assign deterministic IDs to every chunk
    for chunk in all_chunks:
        chunk["_id"] = chunk_id(chunk)

    # Detect duplicates within the file itself
    seen_ids: dict[str, int] = {}
    unique_chunks = []
    skipped_dupes = 0
    for chunk in all_chunks:
        cid = chunk["_id"]
        if cid in seen_ids:
            skipped_dupes += 1
        else:
            seen_ids[cid] = 1
            unique_chunks.append(chunk)

    if skipped_dupes:
        print(f"  Duplicate chunks removed : {skipped_dupes}")
    print(f"  Unique chunks            : {len(unique_chunks)}")

    # Load manifest of already-uploaded IDs (fast local cache)
    if full:
        uploaded_ids = set()
        print("  Mode: FULL re-upload (manifest ignored)")
    else:
        uploaded_ids = load_manifest()
        print(f"  Manifest cache           : {len(uploaded_ids)} IDs")

    # Find IDs not covered by the manifest — check Pinecone directly
    index = pc.Index(PINECONE_INDEX_NAME)
    all_ids = {c["_id"] for c in unique_chunks}
    unchecked_ids = list(all_ids - uploaded_ids)

    if unchecked_ids and not full:
        print(f"  Checking Pinecone for {len(unchecked_ids)} uncached IDs...", end="", flush=True)
        already_in_pinecone = set()
        fetch_batch = 100  # Pinecone fetch limit per call
        for i in range(0, len(unchecked_ids), fetch_batch):
            batch_ids = unchecked_ids[i: i + fetch_batch]
            try:
                result = index.fetch(ids=batch_ids)
                already_in_pinecone.update(result.vectors.keys())
            except Exception as e:
                print(f"\n  ⚠  Pinecone fetch error: {e}")
        print(f" found {len(already_in_pinecone)} already there.")
        # Merge into uploaded_ids so they're skipped
        uploaded_ids.update(already_in_pinecone)
        # Update manifest with what we learned from Pinecone
        if already_in_pinecone:
            save_manifest(uploaded_ids)

    # Filter to only new/changed chunks
    new_chunks = [c for c in unique_chunks if c["_id"] not in uploaded_ids]
    print(f"  New chunks to upload     : {len(new_chunks)}")

    if not new_chunks:
        print("\n  ✅ Nothing to upload — knowledge base is up to date.")
        return

    total_uploaded = 0

    for batch_start in range(0, len(new_chunks), BATCH_SIZE):
        batch = new_chunks[batch_start: batch_start + BATCH_SIZE]
        batch_num   = batch_start // BATCH_SIZE + 1
        total_batches = (len(new_chunks) + BATCH_SIZE - 1) // BATCH_SIZE
        print(f"\n  Batch {batch_num}/{total_batches} — embedding {len(batch)} chunks...")

        texts = [c["text"] for c in batch]
        try:
            response = openai_client.embeddings.create(
                model=EMBEDDING_MODEL,
                input=texts,
            )
            embeddings = [item.embedding for item in response.data]
        except Exception as e:
            print(f"  ✗ Embedding failed: {e}")
            continue

        vectors = []
        for chunk, embedding in zip(batch, embeddings):
            metadata = {
                "text":        chunk["text"],
                "source":      chunk.get("source", ""),
                "source_type": chunk.get("source_type", ""),
                "language":    chunk.get("language", "en"),
            }
            # Dynamically add all other keys (like category, product_name, etc.)
            for k, v in chunk.items():
                if k not in ["_id", "text", "source", "source_type", "language"] and v is not None:
                    metadata[k] = v
                    
            vectors.append({
                "id": chunk["_id"],
                "values": embedding,
                "metadata": metadata
            })

        try:
            index.upsert(vectors=vectors)
            total_uploaded += len(vectors)
            # Update manifest after each successful batch
            for chunk in batch:
                uploaded_ids.add(chunk["_id"])
            save_manifest(uploaded_ids)
            print(f"  ✅ Uploaded {len(vectors)} vectors (total this run: {total_uploaded})")
        except Exception as e:
            print(f"  ✗ Pinecone upsert failed: {e}")

    print(f"\n  ✅ Done. {total_uploaded} new vectors uploaded to '{PINECONE_INDEX_NAME}'.")
    print(f"  Manifest saved → {MANIFEST_FILE}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--full", action="store_true",
                        help="Re-upload all chunks, ignoring the manifest")
    args, _ = parser.parse_known_args()

    if not PINECONE_API_KEY:
        print("❌ PINECONE_API_KEY not set in .env"); return
    if not OPENAI_API_KEY:
        print("❌ OPENAI_API_KEY not set in .env"); return

    print("\n🔗 Connecting to Pinecone...")
    pc = Pinecone(api_key=PINECONE_API_KEY)

    print("\n📦 Index check...")
    create_index(pc)

    print("\n⬆️  Uploading chunks...")
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    upload_chunks(pc, openai_client, full=args.full)


if __name__ == "__main__":
    main()
