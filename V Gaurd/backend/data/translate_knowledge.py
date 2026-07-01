"""
Translate knowledge chunks to all required languages and upload to Pinecone.

Pipeline:
    1. Reads  chunks/knowledge_chunks.json  (output of process_knowledge.py)
    2. Translates each chunk → en, ta, hi, ml  (skips if already in that language)
    3. Shows a full summary
    4. Asks confirmation before saving + uploading

Run order:
    python process_knowledge.py
    python translate_knowledge.py      ← this file
    (build_index.py is called automatically after confirmation)
"""

import os
import sys
import json
import time

from deep_translator import GoogleTranslator

# ── Config ────────────────────────────────────────────────────────────────────

# Only translate into these languages
TARGET_LANGUAGES = {
    "en": "english",
    "ta": "tamil",
    "hi": "hindi",
    "ml": "malayalam",
}

CHUNKS_FILE   = os.path.join(os.path.dirname(__file__), "chunks", "knowledge_chunks.json")
OUTPUT_FILE   = os.path.join(os.path.dirname(__file__), "chunks", "knowledge_chunks.json")  # overwrite
DELAY_SECONDS = 0.4   # between Google Translate calls (avoid rate limit)
MAX_CHARS     = 4500  # Google Translate hard limit


# ── Translation ───────────────────────────────────────────────────────────────

def translate_text(text: str, target_code: str, source_code: str = "auto") -> str | None:
    """Translate text to target language. Returns None on failure."""
    try:
        text = text[:MAX_CHARS]
        translated = GoogleTranslator(source=source_code, target=target_code).translate(text)
        return translated
    except Exception as e:
        print(f"    ⚠  Translation failed ({source_code}→{target_code}): {e}")
        return None


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    # ── Load chunks ──────────────────────────────────────────────────────────
    if not os.path.exists(CHUNKS_FILE):
        print("❌  chunks/knowledge_chunks.json not found.")
        print("    Run process_knowledge.py first.")
        sys.exit(1)

    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        original_chunks: list[dict] = json.load(f)

    print("=" * 55)
    print("  V-Guard Knowledge Base — Translation Pipeline")
    print("=" * 55)
    print(f"  Source file : {CHUNKS_FILE}")
    print(f"  Chunks      : {len(original_chunks)}")
    print(f"  Translating → {', '.join(TARGET_LANGUAGES.keys())}")
    print()

    # ── Preview original breakdown ────────────────────────────────────────────
    orig_by_lang: dict[str, int] = {}
    for c in original_chunks:
        l = c.get("language", "?")
        orig_by_lang[l] = orig_by_lang.get(l, 0) + 1
    print("  Original breakdown:", orig_by_lang)

    # ── Estimate work ─────────────────────────────────────────────────────────
    needed = sum(
        1
        for c in original_chunks
        for lang in TARGET_LANGUAGES
        if lang != c.get("language")
    )
    est_seconds = needed * DELAY_SECONDS
    print(f"  Translation calls needed : {needed}")
    print(f"  Estimated time           : ~{int(est_seconds)}s ({int(est_seconds/60)+1} min)\n")

    go = input("  Start translation? (y/n): ").strip().lower()
    if go != "y":
        print("  Aborted.")
        sys.exit(0)

    print()

    # ── Translate ─────────────────────────────────────────────────────────────
    all_chunks = list(original_chunks)   # keep originals untouched
    success = 0
    failed  = 0

    for idx, chunk in enumerate(original_chunks):
        orig_lang = chunk.get("language", "en")
        text      = chunk.get("text", "").strip()
        if not text:
            continue

        for lang_code in TARGET_LANGUAGES:
            if lang_code == orig_lang:
                continue   # already in this language

            label = f"[{idx+1}/{len(original_chunks)}] {orig_lang}→{lang_code}"
            preview = text[:60].replace("\n", " ")
            print(f"  {label}  \"{preview}...\"", end="", flush=True)

            translated = translate_text(text, lang_code, source_code=orig_lang)
            time.sleep(DELAY_SECONDS)

            if translated:
                new_chunk = {
                    **chunk,
                    "text"            : translated,
                    "language"        : lang_code,
                    "source_type"     : chunk.get("source_type", "") + "_translated",
                    "translated_from" : orig_lang,
                }
                all_chunks.append(new_chunk)
                success += 1
                print(f"  ✓")
            else:
                failed += 1
                print(f"  ✗ skipped")

    # ── Summary ───────────────────────────────────────────────────────────────
    print()
    print("=" * 55)
    print("  Translation Summary")
    print("=" * 55)
    print(f"  Original chunks    : {len(original_chunks)}")
    print(f"  Translated chunks  : {success}")
    print(f"  Failed / skipped   : {failed}")
    print(f"  Total chunks       : {len(all_chunks)}")
    print()

    final_by_lang: dict[str, int] = {}
    for c in all_chunks:
        l = c.get("language", "?")
        final_by_lang[l] = final_by_lang.get(l, 0) + 1
    print("  Final breakdown by language:")
    for lang, count in sorted(final_by_lang.items()):
        bar = "█" * (count // 5)
        print(f"    {lang:4s}  {count:4d}  {bar}")

    print()
    confirm = input("  Save & upload to Pinecone? (y/n): ").strip().lower()
    if confirm != "y":
        print("  Saved cancelled — no changes made.")
        sys.exit(0)

    # ── Save ──────────────────────────────────────────────────────────────────
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, ensure_ascii=False, indent=2)
    print(f"\n  ✅ Saved {len(all_chunks)} chunks → {OUTPUT_FILE}")

    # ── Upload ────────────────────────────────────────────────────────────────
    print("\n  Uploading to Pinecone...")
    import build_index
    build_index.main()

    print("\n  ✅ Done. Knowledge base is multilingual and ready.")


if __name__ == "__main__":
    main()
