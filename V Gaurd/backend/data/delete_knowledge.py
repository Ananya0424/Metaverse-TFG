"""
Delete vectors from Pinecone by source file, language, or source type.

Usage:
    python delete_knowledge.py                        # interactive menu
    python delete_knowledge.py --language ta          # delete all Tamil vectors
    python delete_knowledge.py --source "page_001.txt"
    python delete_knowledge.py --source-type website
    python delete_knowledge.py --all                  # wipe entire index
"""

import os
import sys
import json
import argparse

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

PINECONE_API_KEY    = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "vguard-fan-assistant")
MANIFEST_FILE       = os.path.join(os.path.dirname(__file__), "chunks", "uploaded_ids.json")
CHUNKS_FILE         = os.path.join(os.path.dirname(__file__), "chunks", "knowledge_chunks.json")


# ── Manifest helpers ──────────────────────────────────────────────────────────

def load_manifest() -> set:
    if os.path.exists(MANIFEST_FILE):
        with open(MANIFEST_FILE, "r", encoding="utf-8") as f:
            return set(json.load(f))
    return set()


def save_manifest(ids: set) -> None:
    with open(MANIFEST_FILE, "w", encoding="utf-8") as f:
        json.dump(sorted(ids), f, indent=2)


# ── Find matching vectors ─────────────────────────────────────────────────────

def find_matching_ids(index, filter_meta: dict) -> list[str]:
    """
    Query Pinecone with a metadata filter to find matching vector IDs.
    Uses a zero-vector query with large top_k to scan all matches.
    """
    try:
        # Dummy zero vector to do a metadata-only filter scan
        dummy_vector = [0.0] * 1536
        results = index.query(
            vector=dummy_vector,
            filter=filter_meta,
            top_k=10000,
            include_metadata=True,
        )
        return [m.id for m in results.matches]
    except Exception as e:
        print(f"  ✗ Query failed: {e}")
        return []


def preview_matches(index, filter_meta: dict) -> list[str]:
    """Show a preview of what will be deleted."""
    print(f"\n  Scanning Pinecone with filter: {filter_meta}")
    ids = find_matching_ids(index, filter_meta)

    if not ids:
        print("  No matching vectors found.")
        return []

    # Fetch a few to show source info
    sample = index.fetch(ids=ids[:5])
    print(f"\n  Found {len(ids)} vector(s) to delete. Sample:")
    for vid, vec in sample.vectors.items():
        meta = vec.metadata
        print(f"    [{meta.get('language','?')}] {meta.get('source','?')} "
              f"({meta.get('source_type','?')}) — \"{meta.get('text','')[:60]}...\"")
    if len(ids) > 5:
        print(f"    ... and {len(ids) - 5} more")

    return ids


# ── Delete ────────────────────────────────────────────────────────────────────

def delete_ids(index, ids: list[str], manifest: set) -> None:
    """Delete vectors from Pinecone and remove from manifest."""
    BATCH = 1000
    total = 0
    for i in range(0, len(ids), BATCH):
        batch = ids[i: i + BATCH]
        try:
            index.delete(ids=batch)
            total += len(batch)
            print(f"  ✅ Deleted {len(batch)} vectors (total: {total})")
        except Exception as e:
            print(f"  ✗ Delete failed: {e}")

    # Remove from manifest
    before = len(manifest)
    manifest -= set(ids)
    save_manifest(manifest)
    print(f"  Manifest updated: {before} → {len(manifest)} IDs")


def confirm_and_delete(index, filter_meta: dict, manifest: set) -> None:
    ids = preview_matches(index, filter_meta)
    if not ids:
        return

    ans = input(f"\n  Delete these {len(ids)} vector(s)? (y/n): ").strip().lower()
    if ans == "y":
        delete_ids(index, ids, manifest)
        print(f"\n  ✅ Deleted {len(ids)} vectors.")
    else:
        print("  Cancelled.")


# ── Interactive menu ──────────────────────────────────────────────────────────

def interactive_menu(index, manifest: set) -> None:
    # Show current index stats
    try:
        stats = index.describe_index_stats()
        total_vectors = stats.total_vector_count
    except Exception:
        total_vectors = "?"

    print("\n" + "=" * 50)
    print("  Delete Knowledge from Pinecone")
    print("=" * 50)
    print(f"  Index : {PINECONE_INDEX_NAME}")
    print(f"  Total vectors in Pinecone : {total_vectors}")
    print(f"  Manifest IDs              : {len(manifest)}")
    print()
    print("  What do you want to delete?")
    print()
    print("  1. By language     (e.g. ta / hi / ml / en)")
    print("  2. By source file  (e.g. Fan Basics - Tamil.pptx)")
    print("  3. By source type  (pptx / website / manual / pptx_translated)")
    print("  4. Wipe entire index")
    print("  5. Exit")
    print()

    choice = input("  Enter choice (1-5): ").strip()

    if choice == "1":
        lang = input("  Language code (ta/hi/ml/en): ").strip()
        confirm_and_delete(index, {"language": {"$eq": lang}}, manifest)

    elif choice == "2":
        src = input("  Source filename: ").strip()
        confirm_and_delete(index, {"source": {"$eq": src}}, manifest)

    elif choice == "3":
        print("  Types: pptx | website | manual | pptx_translated | website_translated | manual_translated")
        stype = input("  Source type: ").strip()
        confirm_and_delete(index, {"source_type": {"$eq": stype}}, manifest)

    elif choice == "4":
        print(f"\n  ⚠️  This will delete ALL {total_vectors} vectors from '{PINECONE_INDEX_NAME}'.")
        ans = input("  Type 'DELETE ALL' to confirm: ").strip()
        if ans == "DELETE ALL":
            try:
                index.delete(delete_all=True)
                manifest.clear()
                save_manifest(manifest)
                print(f"  ✅ Index wiped. Manifest cleared.")
            except Exception as e:
                print(f"  ✗ Failed: {e}")
        else:
            print("  Cancelled.")

    elif choice == "5":
        print("  Bye.")
    else:
        print("  Invalid choice.")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if not PINECONE_API_KEY:
        print("❌ PINECONE_API_KEY not set in .env")
        return

    parser = argparse.ArgumentParser()
    parser.add_argument("--language",    help="Delete by language code, e.g. ta")
    parser.add_argument("--source",      help="Delete by source filename")
    parser.add_argument("--source-type", help="Delete by source type")
    parser.add_argument("--all",         action="store_true", help="Wipe entire index")
    args, _ = parser.parse_known_args()

    print("\n🔗 Connecting to Pinecone...")
    pc      = Pinecone(api_key=PINECONE_API_KEY)
    index   = pc.Index(PINECONE_INDEX_NAME)
    manifest = load_manifest()

    if args.language:
        confirm_and_delete(index, {"language": {"$eq": args.language}}, manifest)
    elif args.source:
        confirm_and_delete(index, {"source": {"$eq": args.source}}, manifest)
    elif getattr(args, "source_type", None):
        confirm_and_delete(index, {"source_type": {"$eq": args.source_type}}, manifest)
    elif args.all:
        print(f"  ⚠️  Wiping entire index '{PINECONE_INDEX_NAME}'...")
        ans = input("  Type 'DELETE ALL' to confirm: ").strip()
        if ans == "DELETE ALL":
            index.delete(delete_all=True)
            manifest.clear()
            save_manifest(manifest)
            print("  ✅ Done.")
    else:
        interactive_menu(index, manifest)


if __name__ == "__main__":
    main()
