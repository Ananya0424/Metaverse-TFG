"""
V-Guard Smart Scraper
─────────────────────
Scrapes product pages → sends raw HTML to Groq LLaMA → extracts
structured JSON → saves clean chunks ready for Pinecone.

Output files:
  knowledge-base/smart_data/raw_json/   ← one JSON per URL (LLM output)
  knowledge-base/smart_data/chunks.json ← flat list of Pinecone-ready chunks

Usage:
  python smart_scraper.py                    # scrape all URLs in url_config.json
  python smart_scraper.py --url <url>        # scrape single URL
  python smart_scraper.py --build-only       # skip scraping, rebuild chunks from saved JSON
"""

import os
import sys
import json
import time
import re
import argparse
from datetime import datetime

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# ── Paths ─────────────────────────────────────────────────────────────────────
_DIR      = os.path.dirname(__file__)
ROOT_DIR  = os.path.normpath(os.path.join(_DIR, "..", ".."))

load_dotenv(os.path.join(ROOT_DIR, ".env"))

URL_CONFIG_FILE = os.path.join(_DIR, "url_config.json")
OUT_DIR         = os.path.join(ROOT_DIR, "knowledge-base", "smart_data")
RAW_JSON_DIR    = os.path.join(OUT_DIR, "raw_json")
CHUNKS_FILE     = os.path.join(OUT_DIR, "smart_chunks.json")

# ── LLM backend config ────────────────────────────────────────────────────────
# "ollama" uses local Ollama (free, no API key needed)
# "groq"   uses Groq cloud API
LLM_BACKEND     = os.getenv("SMART_SCRAPER_BACKEND", "ollama")

OLLAMA_URL      = os.getenv("OLLAMA_URL",   "http://localhost:11434")
OLLAMA_MODEL    = os.getenv("OLLAMA_MODEL", "llama3.1:8b")

GROQ_API_KEY    = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL      = "llama-3.3-70b-versatile"

REQUEST_DELAY   = 1.5   # seconds between web requests
LLM_DELAY       = 0.2   # seconds between LLM calls (local = almost 0)

# ── Groq extraction prompt ────────────────────────────────────────────────────

EXTRACT_PROMPT = """
You are a product data extractor for V-Guard, an Indian electrical appliance brand.
Extract ALL products from the page text below and return a JSON array.

Rules:
- Return ONLY valid JSON. No explanation, no markdown, no code fences.
- Each item in the array = one product.
- If the page has no products (FAQ, about us, etc.), return an empty array [].
- Use null for any field you cannot find.
- "text" field must be a clean 1-3 sentence summary combining all key facts — suitable for a search engine.

JSON schema for each product:
{
  "product_name": "string",
  "category": "string (e.g. Ceiling Fan, Table Fan, Exhaust Fan)",
  "sweep_or_size": "string (e.g. 1200mm, 400mm)",
  "wattage": "string (e.g. 28W, 75W)",
  "price": "string (e.g. ₹2499, null if not found)",
  "warranty": "string (e.g. 2 years)",
  "motor_type": "string (e.g. BLDC, Induction, null)",
  "features": ["list", "of", "key", "features"],
  "specifications": {"key": "value"},
  "available_colors": ["list or null"],
  "energy_rating": "string or null",
  "model_numbers": ["list or null"],
  "text": "Clean summary sentence for search. Include product name, category, key specs, price and warranty."
}

Page text:
"""

# ── Web scraper ───────────────────────────────────────────────────────────────

def scrape_page(url: str) -> str:
    """Fetch page and return clean text (no nav/footer/scripts)."""
    headers = {"User-Agent": "Mozilla/5.0 (compatible; VGuardBot/2.0)"}
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ✗ Fetch failed: {e}")
        return ""

    soup = BeautifulSoup(resp.text, "lxml")
    for tag in soup(["nav", "footer", "script", "style", "header", "aside",
                     "iframe", "noscript", "meta", "link"]):
        tag.decompose()

    # Keep structured content
    text_parts = []

    # Title
    if soup.title:
        text_parts.append(f"PAGE TITLE: {soup.title.string.strip()}")

    # Headings
    for h in soup.find_all(["h1", "h2", "h3"]):
        t = h.get_text(strip=True)
        if t:
            text_parts.append(f"HEADING: {t}")

    # Tables (specs)
    for table in soup.find_all("table"):
        rows = []
        for row in table.find_all("tr"):
            cells = [c.get_text(strip=True) for c in row.find_all(["th", "td"])]
            if any(cells):
                rows.append(" | ".join(cells))
        if rows:
            text_parts.append("TABLE:\n" + "\n".join(rows))

    # Lists (features)
    for ul in soup.find_all(["ul", "ol"]):
        items = [li.get_text(strip=True) for li in ul.find_all("li") if li.get_text(strip=True)]
        if items:
            text_parts.append("LIST:\n" + "\n".join(f"- {i}" for i in items))

    # Paragraphs
    for p in soup.find_all("p"):
        t = p.get_text(strip=True)
        if len(t) > 20:
            text_parts.append(t)

    full_text = "\n\n".join(text_parts)
    # Limit to ~6000 chars to stay within token budget
    return full_text[:6000]


# ── LLM client factory ───────────────────────────────────────────────────────

def make_llm_client():
    """
    Returns (client, model_name) for the configured backend.
    Ollama uses OpenAI-compatible API at localhost:11434.
    Groq uses the Groq cloud API.
    """
    from openai import OpenAI

    if LLM_BACKEND == "ollama":
        client = OpenAI(
            base_url=f"{OLLAMA_URL}/v1",
            api_key="ollama",          # Ollama ignores the key but requires it
        )
        return client, OLLAMA_MODEL

    elif LLM_BACKEND == "groq":
        if not GROQ_API_KEY:
            print("❌ GROQ_API_KEY not set in .env")
            sys.exit(1)
        client = OpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=GROQ_API_KEY,
        )
        return client, GROQ_MODEL

    else:
        print(f"❌ Unknown SMART_SCRAPER_BACKEND: '{LLM_BACKEND}'. Use 'ollama' or 'groq'.")
        sys.exit(1)


# ── LLM extraction ────────────────────────────────────────────────────────────

def extract_with_llm(page_text: str, client, model: str) -> list:
    """Send page text to local/cloud LLM, get back list of product dicts."""
    if not page_text.strip():
        print("  ⚠  Empty page — skipping LLM call")
        return []

    prompt = EXTRACT_PROMPT + page_text

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,   # low temp = consistent structured output
            max_tokens=4096,
        )
        raw = response.choices[0].message.content.strip()
    except Exception as e:
        print(f"  ✗ LLM error: {e}")
        return []

    # Strip accidental markdown fences (```json ... ```)
    raw = re.sub(r"^```[a-z]*\n?", "", raw, flags=re.MULTILINE)
    raw = re.sub(r"\n?```$",        "", raw, flags=re.MULTILINE)
    raw = raw.strip()

    # Some models (qwen) wrap output in <think>...</think> — strip that
    raw = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL).strip()

    try:
        products = json.loads(raw)
        if isinstance(products, dict):
            products = [products]
        if not isinstance(products, list):
            print(f"  ⚠  Unexpected LLM output type: {type(products)}")
            return []
        return products
    except json.JSONDecodeError as e:
        print(f"  ✗ JSON parse error: {e}")
        print(f"  Raw (first 300 chars): {raw[:300]}")
        return []


# ── Save raw JSON ─────────────────────────────────────────────────────────────

def url_to_filename(url: str) -> str:
    """Convert URL to a safe filename."""
    slug = re.sub(r"https?://[^/]+", "", url)
    slug = re.sub(r"[^\w\-]", "_", slug).strip("_")
    return (slug or "index")[:80] + ".json"


def save_raw_json(url: str, products: list) -> str:
    """Save LLM output JSON for a URL. Returns saved filepath."""
    os.makedirs(RAW_JSON_DIR, exist_ok=True)
    fname = url_to_filename(url)
    path  = os.path.join(RAW_JSON_DIR, fname)
    data  = {
        "url":        url,
        "scraped_at": datetime.utcnow().isoformat(),
        "products":   products,
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return path


# ── Build Pinecone chunks ─────────────────────────────────────────────────────

def product_to_chunk(product: dict, url: str, source_slug: str) -> dict:
    """
    Convert a structured product dict to a flat Pinecone-ready chunk.
    The 'text' field is what gets embedded — everything else is metadata.
    """
    # Use LLM-generated text if present and non-empty, otherwise build one
    text = (product.get("text") or "").strip()
    if not text:
        parts = []
        if product.get("product_name"):
            parts.append(product["product_name"])
        if product.get("category"):
            parts.append(product["category"])
        if product.get("sweep_or_size"):
            parts.append(f"Size: {product['sweep_or_size']}")
        if product.get("wattage"):
            parts.append(f"Wattage: {product['wattage']}")
        if product.get("motor_type"):
            parts.append(f"Motor: {product['motor_type']}")
        if product.get("price"):
            parts.append(f"Price: {product['price']}")
        if product.get("warranty"):
            parts.append(f"Warranty: {product['warranty']}")
        if product.get("features"):
            parts.append("Features: " + ", ".join(product["features"][:5]))
        if product.get("specifications"):
            specs = ", ".join(f"{k}: {v}" for k, v in list(product["specifications"].items())[:5])
            parts.append(f"Specifications: {specs}")
        text = ". ".join(parts) + "."

    return {
        # ── Embedding text (what Pinecone searches) ──
        "text": text,

        # ── Metadata (what gets returned with results) ──
        "source":       source_slug,
        "source_type":  "website_structured",
        "language":     "en",
        "url":          url,
        "product_name": product.get("product_name") or "",
        "category":     product.get("category") or "",
        "price":        product.get("price") or "",
        "warranty":     product.get("warranty") or "",
        "wattage":      product.get("wattage") or "",
        "sweep":        product.get("sweep_or_size") or "",
        "motor_type":   product.get("motor_type") or "",
    }


def build_chunks_from_raw_json() -> list:
    """Read all saved raw JSON files and produce flat chunk list."""
    if not os.path.isdir(RAW_JSON_DIR):
        print("  No raw JSON directory found. Run scraping first.")
        return []

    all_chunks = []
    files = sorted(f for f in os.listdir(RAW_JSON_DIR) if f.endswith(".json"))

    for fname in files:
        path = os.path.join(RAW_JSON_DIR, fname)
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        url      = data.get("url", "")
        products = data.get("products", [])
        slug     = re.sub(r"[^\w]", "-", re.sub(r"https?://[^/]+", "", url))[:40].strip("-")

        for p in products:
            if not p:
                continue
            chunk = product_to_chunk(p, url, slug or fname)
            all_chunks.append(chunk)

    return all_chunks


# ── Main pipeline ─────────────────────────────────────────────────────────────

def load_url_configs() -> list:
    if os.path.exists(URL_CONFIG_FILE):
        with open(URL_CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    # Fallback defaults
    return [
        {"url": "https://www.vguard.in/product-categories/ceiling-fans-4",            "mode": "exact"},
        {"url": "https://www.vguard.in/product-categories/table-fans-4",              "mode": "exact"},
        {"url": "https://www.vguard.in/product-categories/pedestal-fans-4",           "mode": "exact"},
        {"url": "https://www.vguard.in/product-categories/wall-fans-4",               "mode": "exact"},
        {"url": "https://www.vguard.in/product-categories/ventilating-exhaust-fans-4","mode": "exact"},
        {"url": "https://www.vguard.in/product-categories/others-4",                  "mode": "exact"},
    ]


def scrape_and_extract(urls: list, client=None, model: str = ""):
    """Scrape each URL, extract products with LLM, save raw JSON."""
    if client is None:
        client, model = make_llm_client()

    total_products = 0

    for i, entry in enumerate(urls, 1):
        url = entry if isinstance(entry, str) else entry["url"]
        print(f"\n[{i}/{len(urls)}] {url}")

        print("  Fetching page...", end="", flush=True)
        page_text = scrape_page(url)
        if not page_text:
            print(" skipped (empty)")
            continue
        print(f" {len(page_text)} chars")

        time.sleep(REQUEST_DELAY)

        print("  Extracting with LLaMA...", end="", flush=True)
        products = extract_with_llm(page_text, client, model)
        time.sleep(LLM_DELAY)

        if not products:
            print(" no products found")
            save_raw_json(url, [])
            continue

        print(f" {len(products)} product(s) found")
        for p in products:
            name = p.get("product_name", "?")
            cat  = p.get("category", "")
            print(f"    • {name} [{cat}]")

        save_raw_json(url, products)
        total_products += len(products)

    print(f"\n  Total products extracted: {total_products}")
    return total_products


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url",        help="Scrape a single URL")
    parser.add_argument("--build-only", action="store_true",
                        help="Skip scraping; rebuild chunks from saved JSON")
    args, _ = parser.parse_known_args()

    print("=" * 55)
    print("  V-Guard Smart Scraper")
    print("=" * 55)

    if not args.build_only:
        client, model = make_llm_client()
        backend_label = f"Ollama ({OLLAMA_URL})" if LLM_BACKEND == "ollama" else "Groq (cloud)"
        print(f"  Backend : {backend_label}")
        print(f"  Model   : {model}\n")

        if args.url:
            urls = [{"url": args.url}]
        else:
            urls = load_url_configs()
            print(f"  URLs loaded: {len(urls)}")

        scrape_and_extract(urls, client, model)

    # Build chunks from all saved JSON
    print("\n  Building Pinecone chunks from saved JSON...")
    chunks = build_chunks_from_raw_json()

    if not chunks:
        print("  No chunks built.")
        return

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(CHUNKS_FILE, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    # Summary
    by_category: dict = {}
    for c in chunks:
        cat = c.get("category") or "Unknown"
        by_category[cat] = by_category.get(cat, 0) + 1

    print(f"\n✅ {len(chunks)} chunks saved → {CHUNKS_FILE}")
    print("\n  By category:")
    for cat, count in sorted(by_category.items(), key=lambda x: -x[1]):
        bar = "█" * count
        print(f"    {cat:<25} {count:>3}  {bar}")

    print(f"\n  Next: run build_index.py pointing to {CHUNKS_FILE}")
    print("  Or use the dashboard Upload button.")


if __name__ == "__main__":
    main()
