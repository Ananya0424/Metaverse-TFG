"""
Dashboard API router — knowledge base management.

Endpoints:
  URL Config  : GET/POST/PUT/DELETE /api/dashboard/urls
  Scraping    : POST /api/dashboard/scrape          (SSE)
  Process     : POST /api/dashboard/process         (SSE)
  Chunks      : GET/PUT/DELETE /api/dashboard/chunks
  Translation : POST /api/dashboard/translate       (SSE)
  Pinecone    : GET/POST/DELETE /api/dashboard/pinecone/*
"""

import os
import re
import sys
import json
import time
import io
import asyncio
import threading
import queue as sync_queue
from typing import Optional, List

from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# ── Paths ─────────────────────────────────────────────────────────────────────
_DIR     = os.path.dirname(__file__)
_DATA_DIR = os.path.normpath(os.path.join(_DIR, "..", "data"))
_ROOT_DIR = os.path.normpath(os.path.join(_DATA_DIR, "..", ".."))

URL_CONFIG_FILE = os.path.join(_DATA_DIR, "url_config.json")
CHUNKS_FILE     = os.path.join(_DATA_DIR, "chunks", "knowledge_chunks.json")
SCRAPED_DIR     = os.path.join(_ROOT_DIR, "knowledge-base", "scraped_data")
KB_DIR          = os.path.join(_ROOT_DIR, "knowledge-base")

DEFAULT_URL_CONFIGS = [
    {"url": "https://www.vguard.in/product-categories/ceiling-fans-4",            "mode": "exact", "max_pages": 1},
    {"url": "https://www.vguard.in/product-categories/table-fans-4",              "mode": "exact", "max_pages": 1},
    {"url": "https://www.vguard.in/product-categories/pedestal-fans-4",           "mode": "exact", "max_pages": 1},
    {"url": "https://www.vguard.in/product-categories/wall-fans-4",               "mode": "exact", "max_pages": 1},
    {"url": "https://www.vguard.in/product-categories/ventilating-exhaust-fans-4","mode": "exact", "max_pages": 1},
    {"url": "https://www.vguard.in/product-categories/others-4",                  "mode": "exact", "max_pages": 1},
]

TARGET_LANG_NAMES = {"en": "english", "ta": "tamil", "hi": "hindi", "ml": "malayalam"}
TRANSLATE_DELAY   = 0.4
MAX_CHARS         = 4500


# ── Models ────────────────────────────────────────────────────────────────────

class UrlConfig(BaseModel):
    url: str
    mode: str = "exact"       # "exact" or "crawl"
    max_pages: int = 100

class ChunkUpdate(BaseModel):
    text: str

class TranslateRequest(BaseModel):
    languages: List[str] = ["en", "ta", "hi", "ml"]

class PineconeFilterRequest(BaseModel):
    language: Optional[str] = None
    source: Optional[str] = None
    source_type: Optional[str] = None


# ── SSE helper ────────────────────────────────────────────────────────────────

def _start_stream(fn, *args, **kwargs) -> sync_queue.Queue:
    """Run fn in a thread; stdout lines go into a Queue. None = sentinel."""
    q: sync_queue.Queue = sync_queue.Queue()

    class _Capture(io.TextIOBase):
        def write(self, s: str) -> int:
            if s and s.strip():
                q.put(s.rstrip("\n\r"))
            return len(s)
        def flush(self): pass

    def _runner():
        old = sys.stdout
        sys.stdout = _Capture()
        try:
            fn(*args, **kwargs)
        except Exception as exc:
            q.put(f"ERROR: {exc}")
        finally:
            sys.stdout = old
            q.put(None)

    threading.Thread(target=_runner, daemon=True).start()
    return q


async def _drain_sse(q: sync_queue.Queue):
    """Async generator: yield SSE lines until sentinel."""
    loop = asyncio.get_event_loop()
    while True:
        try:
            msg = await loop.run_in_executor(None, lambda: q.get(timeout=60))
        except Exception:
            yield "data: [DONE]\n\n"
            return
        if msg is None:
            yield "data: [DONE]\n\n"
            return
        safe = msg.replace("\n", " ").replace("\r", "")
        yield f"data: {safe}\n\n"


# ── URL config helpers ────────────────────────────────────────────────────────

def _load_urls() -> list:
    if os.path.exists(URL_CONFIG_FILE):
        with open(URL_CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return list(DEFAULT_URL_CONFIGS)


def _save_urls(configs: list) -> None:
    os.makedirs(os.path.dirname(URL_CONFIG_FILE), exist_ok=True)
    with open(URL_CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(configs, f, indent=2)


# ── Chunks helpers ────────────────────────────────────────────────────────────

def _load_chunks() -> list:
    if os.path.exists(CHUNKS_FILE):
        with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def _save_chunks(chunks: list) -> None:
    os.makedirs(os.path.dirname(CHUNKS_FILE), exist_ok=True)
    with open(CHUNKS_FILE, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)


# ── URL Config endpoints ──────────────────────────────────────────────────────

@router.get("/urls")
def get_urls():
    return _load_urls()


@router.post("/urls")
def add_url(cfg: UrlConfig):
    configs = _load_urls()
    configs.append(cfg.model_dump())
    _save_urls(configs)
    return {"ok": True, "total": len(configs)}


@router.put("/urls/{idx}")
def update_url(idx: int, cfg: UrlConfig):
    configs = _load_urls()
    if idx < 0 or idx >= len(configs):
        raise HTTPException(status_code=404, detail="URL index out of range")
    configs[idx] = cfg.model_dump()
    _save_urls(configs)
    return {"ok": True}


@router.delete("/urls/{idx}")
def delete_url(idx: int):
    configs = _load_urls()
    if idx < 0 or idx >= len(configs):
        raise HTTPException(status_code=404, detail="URL index out of range")
    configs.pop(idx)
    _save_urls(configs)
    return {"ok": True, "total": len(configs)}


# ── Scrape endpoint (SSE) ─────────────────────────────────────────────────────

def _do_smart_scrape():
    """Smart scrape: fetch pages → Groq LLaMA → structured JSON → chunks."""
    import importlib.util
    from dotenv import load_dotenv
    load_dotenv(os.path.join(_ROOT_DIR, ".env"))

    ss_path = os.path.join(_DATA_DIR, "smart_scraper.py")
    spec = importlib.util.spec_from_file_location("smart_scraper", ss_path)
    ss = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(ss)

    configs = _load_urls()
    if not configs:
        print("No URL configs found.")
        return

    client, model = ss.make_llm_client()
    ss.scrape_and_extract(configs, client, model)

    print("\nBuilding chunks from extracted JSON...")
    smart_chunks = ss.build_chunks_from_raw_json()
    if not smart_chunks:
        print("No chunks built.")
        return

    # Save to smart_chunks.json
    os.makedirs(os.path.dirname(ss.CHUNKS_FILE), exist_ok=True)
    with open(ss.CHUNKS_FILE, "w", encoding="utf-8") as f:
        import json as _json
        _json.dump(smart_chunks, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(smart_chunks)} smart chunks → smart_chunks.json")

    # Merge into main knowledge_chunks.json (remove old smart entries, add new)
    existing = _load_chunks()
    non_smart = [c for c in existing if c.get("source_type") != "website_structured"]
    merged = non_smart + smart_chunks
    _save_chunks(merged)
    print(f"Merged into knowledge_chunks.json — total {len(merged)} chunks")
    print(f"  ({len(non_smart)} existing + {len(smart_chunks)} smart)")


@router.post("/smart-scrape")
async def smart_scrape_urls():
    q = _start_stream(_do_smart_scrape)
    return StreamingResponse(_drain_sse(q), media_type="text/event-stream")


def _do_scrape():
    """Scrape all configured URLs; print progress captured by SSE."""
    # Import here to avoid circular issues
    import importlib.util, sys as _sys

    scraper_path = os.path.join(_DATA_DIR, "website_scraper.py")
    spec = importlib.util.spec_from_file_location("website_scraper", scraper_path)
    ws = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(ws)

    configs = _load_urls()
    if not configs:
        print("No URL configs found.")
        return

    os.makedirs(SCRAPED_DIR, exist_ok=True)
    scraper = ws.VGuardScraper()
    all_pages = []

    for entry in configs:
        url  = entry["url"]
        mode = entry.get("mode", "exact")
        maxp = entry.get("max_pages", 100)

        print(f"\n[{mode.upper()}] {url}")

        if mode == "crawl":
            pages = ws.crawl(url, maxp)
        else:
            data = scraper.scrape_page(url)
            pages = [data] if data else []
            time.sleep(ws.REQUEST_DELAY)

        all_pages.extend(pages)
        print(f"  → {len(pages)} page(s) scraped")

    if not all_pages:
        print("No pages scraped.")
        return

    # Save individual + combined files
    scraper.save_to_text_files(all_pages)
    ws.save_combined(all_pages)
    print(f"\nTotal: {len(all_pages)} pages saved to knowledge-base/scraped_data/")


@router.post("/scrape")
async def scrape_urls():
    q = _start_stream(_do_scrape)
    return StreamingResponse(_drain_sse(q), media_type="text/event-stream")


# ── Process knowledge endpoint (SSE) ─────────────────────────────────────────

def _do_process():
    """Run process_knowledge.py logic."""
    import importlib.util
    proc_path = os.path.join(_DATA_DIR, "process_knowledge.py")
    spec = importlib.util.spec_from_file_location("process_knowledge", proc_path)
    pk = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(pk)
    pk.main()


@router.post("/process")
async def process_knowledge():
    q = _start_stream(_do_process)
    return StreamingResponse(_drain_sse(q), media_type="text/event-stream")


# ── Chunks endpoints ──────────────────────────────────────────────────────────

@router.get("/chunks/sources")
def get_sources():
    chunks = _load_chunks()
    sources: dict = {}
    for i, c in enumerate(chunks):
        src  = c.get("source", "unknown")
        lang = c.get("language", "?")
        stype = c.get("source_type", "?")
        if src not in sources:
            sources[src] = {"source": src, "source_type": stype, "languages": set(), "count": 0}
        sources[src]["languages"].add(lang)
        sources[src]["count"] += 1

    result = []
    for v in sorted(sources.values(), key=lambda x: x["source"]):
        result.append({**v, "languages": sorted(v["languages"])})
    return result


@router.get("/chunks")
def get_chunks(
    source: Optional[str]   = Query(default=None),
    language: Optional[str] = Query(default=None),
    limit: int              = Query(default=100),
    offset: int             = Query(default=0),
):
    chunks = _load_chunks()
    filtered = []
    for i, c in enumerate(chunks):
        if source   and c.get("source")   != source:   continue
        if language and c.get("language") != language: continue
        filtered.append({"idx": i, **c})

    total = len(filtered)
    page  = filtered[offset: offset + limit]
    return {"total": total, "offset": offset, "limit": limit, "chunks": page}


@router.put("/chunks/{idx}")
def update_chunk(idx: int, body: ChunkUpdate):
    chunks = _load_chunks()
    if idx < 0 or idx >= len(chunks):
        raise HTTPException(status_code=404, detail="Chunk index out of range")
    chunks[idx]["text"] = body.text
    _save_chunks(chunks)
    return {"ok": True}


@router.delete("/chunks/{idx}")
def delete_chunk(idx: int):
    chunks = _load_chunks()
    if idx < 0 or idx >= len(chunks):
        raise HTTPException(status_code=404, detail="Chunk index out of range")
    chunks.pop(idx)
    _save_chunks(chunks)
    return {"ok": True, "total": len(chunks)}


# ── Scraped file endpoints ────────────────────────────────────────────────────

class ScrapedFileUpdate(BaseModel):
    content: str


@router.get("/scraped/{filename}")
def get_scraped_file(filename: str):
    """Return the full content of a scraped .txt file."""
    safe = os.path.basename(filename)   # prevent path traversal
    path = os.path.join(SCRAPED_DIR, safe)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    return {"filename": safe, "content": content, "size_kb": round(len(content) / 1024, 1)}


@router.put("/scraped/{filename}")
def update_scraped_file(filename: str, body: ScrapedFileUpdate):
    """Overwrite a scraped .txt file with new content."""
    safe = os.path.basename(filename)
    path = os.path.join(SCRAPED_DIR, safe)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    with open(path, "w", encoding="utf-8") as f:
        f.write(body.content)
    return {"ok": True, "size_kb": round(len(body.content) / 1024, 1)}


@router.delete("/scraped/{filename}")
def delete_scraped_file(filename: str):
    """Delete a scraped .txt file."""
    safe = os.path.basename(filename)
    path = os.path.join(SCRAPED_DIR, safe)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    os.remove(path)
    return {"ok": True}


# ── PDF upload & extraction ───────────────────────────────────────────────────

PDF_DIR = os.path.join(KB_DIR, "pdf_uploads")


@router.post("/pdf/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    language: str    = Form(default="en"),
):
    """
    Accept a PDF upload, extract text page-by-page with pdfplumber,
    and save as a .txt file in knowledge-base/scraped_data/.
    Returns per-page stats and the saved filename.
    """
    try:
        import pdfplumber
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="pdfplumber not installed. Run: pip install pdfplumber==0.11.4",
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    raw_bytes = await file.read()
    if not raw_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    import io as _io
    pages_text   = []
    failed_pages = []

    try:
        with pdfplumber.open(_io.BytesIO(raw_bytes)) as pdf:
            total_pages = len(pdf.pages)
            for i, page in enumerate(pdf.pages, start=1):
                try:
                    # Extract plain text
                    text = page.extract_text() or ""

                    # Extract tables and format as pipe-delimited rows
                    for table in (page.extract_tables() or []):
                        for row in table:
                            cells = [str(c).strip() if c else "" for c in row]
                            line  = " | ".join(cells)
                            if line.strip(" |"):
                                text += "\n" + line

                    pages_text.append((i, text.strip()))
                except Exception as e:
                    failed_pages.append(i)
                    pages_text.append((i, ""))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not read PDF: {e}")

    # Build output text
    base_name  = os.path.splitext(file.filename)[0]
    safe_name  = re.sub(r"[^\w\-. ]", "_", base_name).strip()
    out_name   = f"pdf_{safe_name}.txt"
    out_path   = os.path.join(SCRAPED_DIR, out_name)

    os.makedirs(SCRAPED_DIR, exist_ok=True)

    total_chars = 0
    total_words = 0

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"Source: {file.filename}\n")
        f.write(f"Language: {language}\n")
        f.write(f"Pages: {total_pages}\n")
        f.write("=" * 60 + "\n\n")
        for page_num, text in pages_text:
            if text:
                f.write(f"--- Page {page_num} ---\n")
                f.write(text)
                f.write("\n\n")
                total_chars += len(text)
                total_words += len(text.split())

    return {
        "ok":           True,
        "filename":     out_name,
        "original":     file.filename,
        "language":     language,
        "total_pages":  total_pages,
        "extracted":    len([pg for pg, t in pages_text if t]),
        "failed_pages": failed_pages,
        "total_chars":  total_chars,
        "total_words":  total_words,
        "size_kb":      round(os.path.getsize(out_path) / 1024, 1),
    }


# ── Direct JSON upload → chunks ───────────────────────────────────────────────

@router.post("/json/upload")
async def upload_json_as_chunks(
    file:        UploadFile = File(...),
    language:    str        = Form(default="en"),
    source_name: str        = Form(default=""),
):
    """
    Accept a JSON file, convert each item to a chunk, merge into knowledge_chunks.json.

    Accepted formats:
      - Array of objects with a "text" field  → use text directly
      - Array of objects without "text"       → build text from all string fields
      - Array of strings                      → each string is a chunk text
      - Smart-scraper format {url, products:[...]} → each product becomes a chunk
    """
    if not file.filename.lower().endswith(".json"):
        raise HTTPException(status_code=400, detail="Only .json files accepted")

    raw_bytes = await file.read()
    if not raw_bytes:
        raise HTTPException(status_code=400, detail="File is empty")

    try:
        data = json.loads(raw_bytes.decode("utf-8"))
    except json.JSONDecodeError as e:
        # Try to fix common issues: wrap bare array/object fragments
        try:
            text = raw_bytes.decode("utf-8").strip()
            # If starts with a key like "company": { ... } wrap it
            if not text.startswith(("{", "[")):
                text = "{" + text + "}"
            data = json.loads(text)
        except Exception:
            raise HTTPException(status_code=422, detail=f"Invalid JSON: {e}")

    # ── Flatten ANY JSON structure into chunks — no restrictions ──────────────
    items = []

    # Language codes that may appear as keys in bilingual JSON structures
    _LANG_CODES = {"en", "ta", "hi", "ml", "te", "kn", "bn", "mr", "gu", "fr", "es"}

    def obj_to_text(obj) -> str:
        """Recursively convert any object to readable text."""
        parts = []
        if isinstance(obj, str):
            return obj.strip()
        elif isinstance(obj, (int, float, bool)):
            return str(obj)
        elif isinstance(obj, list):
            for item in obj:
                t = obj_to_text(item)
                if t:
                    parts.append(t)
            return ". ".join(parts)
        elif isinstance(obj, dict):
            for k, v in obj.items():
                if k.startswith("_") or v is None:
                    continue
                label = k.replace("_", " ").title()
                val   = obj_to_text(v)
                if val:
                    parts.append(f"{label}: {val}" if not isinstance(v, str) or len(v) < 80 else val)
            return ". ".join(parts)
        return ""

    def extract_all(node, section="data", depth=0, forced_lang=None):
        """
        Walk any JSON node and emit chunks.
        - Bilingual nodes with lang-code keys (en/ta/hi/ml…) → process each
          subtree with that language tag automatically (single-upload bilingual support)
        - dicts with 'text' field → direct chunk
        - dicts without 'text'   → build text from ALL content, then recurse
        - lists of dicts         → recurse each dict
        - lists of strings       → join into parent (not individual chunks)
        forced_lang: language code detected from a parent bilingual key; overrides
                     the form-level `language` for this subtree.
        """
        if isinstance(node, list):
            for item in node:
                if isinstance(item, dict):
                    extract_all(item, section, depth, forced_lang)

        elif isinstance(node, dict):
            # ── Bilingual node detection ──────────────────────────────────────
            # If this dict contains language-code keys whose values are dicts
            # (e.g. {"en": {...}, "ta": {...}}), process each subtree with the
            # matching language, then recurse structural keys normally.
            lang_subkeys = [k for k in node if k in _LANG_CODES and isinstance(node[k], dict)]
            if lang_subkeys:
                for lk in lang_subkeys:
                    extract_all(node[lk], section=section, depth=depth, forced_lang=lk)
                # Recurse into non-language structural keys (subcategories, products, types…)
                for k, v in node.items():
                    if k not in _LANG_CODES:
                        if isinstance(v, list) and any(isinstance(i, dict) for i in v):
                            extract_all(v, section=k, depth=depth + 1, forced_lang=forced_lang)
                        elif isinstance(v, dict):
                            extract_all(v, section=k, depth=depth + 1, forced_lang=forced_lang)
                return

            # Already has a text field → use it directly as chunk
            if "text" in node and isinstance(node["text"], str) and node["text"].strip():
                chunk = {"_section": section, "_lang": forced_lang}
                for k, v in node.items():
                    if not isinstance(v, (list, dict)) and v is not None:
                        chunk[k] = v
                chunk["text"] = node["text"].strip()
                items.append(chunk)
                # Still recurse into any nested lists of dicts
                for k, v in node.items():
                    if isinstance(v, list) and any(isinstance(i, dict) for i in v):
                        extract_all(v, section=k, depth=depth + 1, forced_lang=forced_lang)
                    elif isinstance(v, dict):
                        extract_all(v, section=k, depth=depth + 1, forced_lang=forced_lang)
                return

            # Build text from everything in this node
            # Skip depth=0 (entire JSON root) — too large, not a meaningful chunk
            if depth > 0:
                text = obj_to_text(node).strip()
                if text:
                    chunk = {"text": text, "_section": section, "_lang": forced_lang}
                    # Carry scalar fields as metadata
                    for k, v in node.items():
                        if not isinstance(v, (list, dict)) and v is not None:
                            chunk[k] = v
                    items.append(chunk)

            # Recurse into ALL nested dicts and lists-of-dicts
            for k, v in node.items():
                if isinstance(v, dict):
                    extract_all(v, section=k, depth=depth + 1, forced_lang=forced_lang)
                elif isinstance(v, list) and any(isinstance(i, dict) for i in v):
                    extract_all(v, section=k, depth=depth + 1, forced_lang=forced_lang)

    extract_all(data)

    if not items:
        raise HTTPException(status_code=422, detail="No content could be extracted from JSON")

    # Determine source name
    src = source_name.strip() or os.path.splitext(file.filename)[0]

    new_chunks = []
    skipped    = 0

    for item in items:
        if isinstance(item, str):
            text = item.strip()
        elif isinstance(item, dict):
            # Use explicit text field if present
            text = (item.get("text") or "").strip()
            if not text:
                # Build text from all meaningful string/number fields
                parts = []
                for k, v in item.items():
                    if k in ("text", "url", "scraped_at"):
                        continue
                    if isinstance(v, (str, int, float)) and str(v).strip():
                        parts.append(f"{k}: {v}")
                    elif isinstance(v, list) and v:
                        parts.append(f"{k}: {', '.join(str(x) for x in v[:5])}")
                text = ". ".join(parts)
        else:
            skipped += 1
            continue

        if not text:
            skipped += 1
            continue

        section    = item.get("_section", "product") if isinstance(item, dict) else "product"
        # Use auto-detected language (from bilingual en/ta keys) if present,
        # otherwise fall back to the language selected in the upload form.
        item_lang  = (item.get("_lang") if isinstance(item, dict) else None) or language
        chunk = {
            "text":        text,
            "source":      src,
            "source_type": f"json_{section}",
            "language":    item_lang,
        }
        # Carry over useful metadata fields if present
        if isinstance(item, dict):
            for field in ("product_name", "category", "price", "warranty",
                          "wattage", "sweep_or_size", "motor_type", "url"):
                if item.get(field):
                    chunk[field] = item[field]

        new_chunks.append(chunk)

    if not new_chunks:
        raise HTTPException(status_code=422, detail="No valid chunks could be built from the file")

    # Remove existing chunks from same source, add new ones
    existing = _load_chunks()
    kept     = [c for c in existing if c.get("source") != src]
    merged   = kept + new_chunks
    _save_chunks(merged)

    return {
        "ok":         True,
        "source":     src,
        "language":   language,
        "imported":   len(new_chunks),
        "skipped":    skipped,
        "total_chunks": len(merged),
    }


# ── Smart JSON file endpoints ─────────────────────────────────────────────────

SMART_JSON_DIR = os.path.join(KB_DIR, "smart_data", "raw_json")


@router.get("/smart-json/{filename}")
def get_smart_json(filename: str):
    safe  = os.path.basename(filename)
    path  = os.path.join(SMART_JSON_DIR, safe)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


@router.put("/smart-json/{filename}")
def update_smart_json(filename: str, body: dict):
    safe = os.path.basename(filename)
    path = os.path.join(SMART_JSON_DIR, safe)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(body, f, ensure_ascii=False, indent=2)
    return {"ok": True}


@router.delete("/smart-json/{filename}")
def delete_smart_json(filename: str):
    safe = os.path.basename(filename)
    path = os.path.join(SMART_JSON_DIR, safe)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    os.remove(path)
    return {"ok": True}


# ── Knowledge stats endpoint ──────────────────────────────────────────────────

@router.get("/stats")
def get_stats():
    """
    Returns overall and per-file stats about scraped data and chunks.
    Reads the URL from the first line of each scraped .txt file.
    """
    stats = {
        "scraped_files": [],
        "chunks_by_source": {},
        "chunks_by_source_type": {},
        "chunks_by_language": {},
        "total_scraped_chars": 0,
        "total_scraped_words": 0,
        "total_chunks": 0,
    }

    # ── Build chunk counts per source ─────────────────────────────────────────
    chunks = _load_chunks()
    stats["total_chunks"] = len(chunks)

    for c in chunks:
        src   = c.get("source", "unknown")
        stype = c.get("source_type", "unknown")
        lang  = c.get("language", "?")
        stats["chunks_by_source"][src]        = stats["chunks_by_source"].get(src, 0) + 1
        stats["chunks_by_source_type"][stype] = stats["chunks_by_source_type"].get(stype, 0) + 1
        stats["chunks_by_language"][lang]     = stats["chunks_by_language"].get(lang, 0) + 1

    # ── Scraped text files (.txt) ──────────────────────────────────────────────
    if os.path.isdir(SCRAPED_DIR):
        for fname in sorted(os.listdir(SCRAPED_DIR)):
            if not fname.endswith(".txt") or fname == "vguard_website_data.txt":
                continue
            fpath = os.path.join(SCRAPED_DIR, fname)
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    raw = f.read()
            except Exception:
                continue

            url = ""
            title = ""
            for line in raw.splitlines()[:5]:
                if line.startswith("URL:"):
                    url = line[4:].strip()
                elif line.startswith("Title:"):
                    title = line[6:].strip()

            char_count = len(raw)
            word_count = len(raw.split())
            stats["total_scraped_chars"] += char_count
            stats["total_scraped_words"] += word_count

            stats["scraped_files"].append({
                "filename":   fname,
                "url":        url,
                "title":      title,
                "chars":      char_count,
                "words":      word_count,
                "chunks":     stats["chunks_by_source"].get(fname, 0),
                "size_kb":    round(char_count / 1024, 1),
                "file_type":  "raw_txt",
            })

    # ── Smart JSON files (from smart scraper) ──────────────────────────────────
    smart_json_dir = os.path.join(KB_DIR, "smart_data", "raw_json")
    if os.path.isdir(smart_json_dir):
        for fname in sorted(os.listdir(smart_json_dir)):
            if not fname.endswith(".json"):
                continue
            fpath = os.path.join(smart_json_dir, fname)
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    data = json.load(f)
            except Exception:
                continue

            url      = data.get("url", "")
            products = data.get("products", [])
            raw_str  = json.dumps(data, ensure_ascii=False)
            char_count = len(raw_str)

            # Count product names for title
            names = [p.get("product_name", "") for p in products if p.get("product_name")]
            title = ", ".join(names[:3]) + ("..." if len(names) > 3 else "") if names else "No products"

            stats["total_scraped_chars"] += char_count
            stats["total_scraped_words"] += len(raw_str.split())

            # Source slug used in chunks matches url slug
            slug = re.sub(r"[^\w]", "-", re.sub(r"https?://[^/]+", "", url))[:40].strip("-")
            chunk_count = stats["chunks_by_source"].get(slug or fname, 0)

            stats["scraped_files"].append({
                "filename":    fname,
                "url":         url,
                "title":       title,
                "chars":       char_count,
                "words":       len(products),   # show product count as "words" for JSON
                "chunks":      chunk_count,
                "size_kb":     round(char_count / 1024, 1),
                "file_type":   "smart_json",
                "product_count": len(products),
            })

    return stats


@router.delete("/chunks/source/{source_name}")
def delete_chunks_by_source(source_name: str):
    chunks = _load_chunks()
    before = len(chunks)
    chunks = [c for c in chunks if c.get("source") != source_name]
    _save_chunks(chunks)
    return {"ok": True, "deleted": before - len(chunks), "remaining": len(chunks)}


# ── Translation endpoint (SSE) ────────────────────────────────────────────────

def _do_translate(languages: list):
    if not os.path.exists(CHUNKS_FILE):
        print("ERROR: knowledge_chunks.json not found. Run Process first.")
        return

    from deep_translator import GoogleTranslator

    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        all_saved_chunks: list = json.load(f)

    # Only translate from originals — never re-translate already-translated chunks
    original_chunks = [c for c in all_saved_chunks if "translated_from" not in c]

    print(f"Loaded {len(original_chunks)} original chunks (total in file: {len(all_saved_chunks)})")
    print(f"Translating to: {', '.join(languages)}")

    # Build dedup set: (text_prefix, orig_lang, target_lang) already translated
    # Use text content (not source name) so each chunk is tracked individually
    translated_existing = set()
    for c in all_saved_chunks:
        if "translated_from" in c:
            translated_existing.add((
                c.get("text", "")[:120],
                c.get("translated_from", ""),
                c.get("language", ""),
            ))

    all_chunks = list(all_saved_chunks)  # keep originals + existing translations
    success = 0
    failed  = 0
    total_needed = sum(
        1 for c in original_chunks
        for lang in languages
        if lang != c.get("language")
        and (c.get("text", "")[:120], c.get("language", ""), lang) not in translated_existing
    )
    done = 0

    print(f"Need to create: {total_needed} translations")

    for chunk in original_chunks:
        orig_lang = chunk.get("language", "en")
        text      = chunk.get("text", "").strip()
        if not text:
            continue

        for lang_code in languages:
            if lang_code == orig_lang:
                continue
            # Skip if already translated (keyed on text content, not source name)
            key = (text[:120], orig_lang, lang_code)
            if key in translated_existing:
                continue

            done += 1
            label = f"[{done}/{total_needed}] {orig_lang}→{lang_code} | chunk {done}"
            print(label)

            try:
                translated_text = GoogleTranslator(
                    source=orig_lang, target=lang_code
                ).translate(text[:MAX_CHARS])
                time.sleep(TRANSLATE_DELAY)
            except Exception as e:
                print(f"  FAILED: {e}")
                failed += 1
                translated_existing.add(key)
                continue

            if translated_text:
                new_chunk = {
                    **chunk,
                    "text":             translated_text,
                    "language":         lang_code,
                    "source_type":      chunk.get("source_type", "") + "_translated",
                    "translated_from":  orig_lang,
                }
                all_chunks.append(new_chunk)
                translated_existing.add(key)
                success += 1
                print(f"  OK ({len(translated_text)} chars)")
            else:
                failed += 1
                translated_existing.add(key)

    _save_chunks(all_chunks)
    print(f"\nDone: {success} translated, {failed} failed")
    print(f"Total chunks now: {len(all_chunks)}")


@router.post("/translate")
async def translate_chunks(body: TranslateRequest):
    langs = [l for l in body.languages if l in TARGET_LANG_NAMES]
    if not langs:
        raise HTTPException(status_code=400, detail="No valid languages provided")
    q = _start_stream(_do_translate, langs)
    return StreamingResponse(_drain_sse(q), media_type="text/event-stream")


# ── Pinecone endpoints ────────────────────────────────────────────────────────

def _get_pinecone_index():
    from pinecone import Pinecone
    from dotenv import load_dotenv
    load_dotenv(os.path.join(_ROOT_DIR, ".env"))
    api_key    = os.getenv("PINECONE_API_KEY", "")
    index_name = os.getenv("PINECONE_INDEX_NAME", "vguard-fan-assistant")
    if not api_key:
        raise HTTPException(status_code=500, detail="PINECONE_API_KEY not set")
    pc = Pinecone(api_key=api_key)
    return pc.Index(index_name), index_name


@router.get("/pinecone/stats")
def pinecone_stats():
    try:
        index, index_name = _get_pinecone_index()
        stats = index.describe_index_stats()
        return {
            "index_name":    index_name,
            "total_vectors": stats.total_vector_count,
            "namespaces":    {k: v.vector_count for k, v in (stats.namespaces or {}).items()},
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _do_upload():
    import importlib.util
    from dotenv import load_dotenv
    load_dotenv(os.path.join(_ROOT_DIR, ".env"))

    bi_path = os.path.join(_DATA_DIR, "build_index.py")
    spec = importlib.util.spec_from_file_location("build_index", bi_path)
    bi = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(bi)
    bi.main()


@router.post("/pinecone/upload")
async def pinecone_upload():
    q = _start_stream(_do_upload)
    return StreamingResponse(_drain_sse(q), media_type="text/event-stream")


@router.delete("/pinecone/all")
def pinecone_delete_all():
    try:
        index, _ = _get_pinecone_index()
        index.delete(delete_all=True)
        # Clear manifest
        manifest_file = os.path.join(_DATA_DIR, "chunks", "uploaded_ids.json")
        if os.path.exists(manifest_file):
            with open(manifest_file, "w") as f:
                json.dump([], f)
        return {"ok": True, "message": "All vectors deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/pinecone/filter")
def pinecone_delete_filter(body: PineconeFilterRequest):
    try:
        index, _ = _get_pinecone_index()

        if body.language:
            filter_meta = {"language": {"$eq": body.language}}
        elif body.source:
            filter_meta = {"source": {"$eq": body.source}}
        elif body.source_type:
            filter_meta = {"source_type": {"$eq": body.source_type}}
        else:
            raise HTTPException(status_code=400, detail="Provide language, source, or source_type")

        dummy = [0.0] * 1536
        results = index.query(vector=dummy, filter=filter_meta, top_k=10000, include_metadata=False)
        ids = [m.id for m in results.matches]

        if not ids:
            return {"ok": True, "deleted": 0}

        BATCH = 1000
        total = 0
        for i in range(0, len(ids), BATCH):
            index.delete(ids=ids[i: i + BATCH])
            total += len(ids[i: i + BATCH])

        return {"ok": True, "deleted": total}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
