"""
V-Guard Website Scraper
-----------------------
Two modes:

  MODE 1 — Manual (default):
      Scrape only the URLs listed in URLS below.
      python website_scraper.py

  MODE 2 — Crawl (auto-discover all pages):
      Start from CRAWL_SEED_URL, follow every internal link automatically.
      python website_scraper.py --crawl
      python website_scraper.py --crawl --max-pages 200

Output → knowledge-base/scraped_data/
"""

import os
import re
import time
import argparse
from collections import deque
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

# ── Manual URL list ───────────────────────────────────────────────────────────
URLS = [
    "https://www.vguard.in/product-categories/ceiling-fans-4",
    "https://www.vguard.in/product-categories/table-fans-4",
    "https://www.vguard.in/product-categories/pedestal-fans-4",
    "https://www.vguard.in/product-categories/wall-fans-4",
    "https://www.vguard.in/product-categories/ventilating-exhaust-fans-4",
    "https://www.vguard.in/product-categories/others-4",
]

# ── Crawl config ──────────────────────────────────────────────────────────────
CRAWL_SEED_URL = "https://www.vguard.in/fans"   # start page for crawl mode
MAX_PAGES      = 100                             # safety cap (override with --max-pages)
REQUEST_DELAY  = 2                               # seconds between requests

# Only follow links that contain these path patterns (fans-related pages only)
# Leave empty [] to crawl the entire domain with no path filter
CRAWL_PATH_FILTER = [
    "/fans",
    "/product-categories",
    "/product/",
    "/bldc",
]

BASE_OUTPUT_DIR = os.path.join(
    os.path.dirname(__file__), "..", "..", "knowledge-base", "scraped_data"
)


# ── Scraper ───────────────────────────────────────────────────────────────────

class VGuardScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(
            {"User-Agent": "Mozilla/5.0 (compatible; VGuardBot/1.0)"}
        )

    def scrape_page(self, url: str) -> dict:
        """Fetch a page and extract clean text content."""
        print(f"  Scraping: {url}")
        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"  ✗ Failed: {e}")
            return {}

        soup = BeautifulSoup(response.text, "lxml")

        # Remove noise
        for tag in soup(["nav", "footer", "script", "style", "header", "aside", "iframe"]):
            tag.decompose()

        title = soup.title.string.strip() if soup.title else url

        specs = []
        for table in soup.find_all("table"):
            for row in table.find_all("tr"):
                cells = [c.get_text(strip=True) for c in row.find_all(["th", "td"])]
                if cells:
                    specs.append(" | ".join(cells))

        features = []
        for ul in soup.find_all("ul"):
            for li in ul.find_all("li"):
                text = li.get_text(strip=True)
                if text:
                    features.append(text)

        price = ""
        for tag in soup.find_all(class_=lambda c: c and "price" in c.lower()):
            price = tag.get_text(strip=True)
            if price:
                break

        content = soup.get_text(separator=" ", strip=True)

        # Extract internal links for crawl mode
        links = []
        for a in soup.find_all("a", href=True):
            links.append(a["href"])

        return {
            "url": url,
            "title": title,
            "content": content,
            "specifications": specs,
            "features": features,
            "price": price,
            "_links": links,   # internal use for crawler
        }

    def save_to_text_files(self, data: list[dict]) -> None:
        os.makedirs(BASE_OUTPUT_DIR, exist_ok=True)
        for i, page in enumerate(data):
            if not page:
                continue
            filename = f"page_{i+1:03d}.txt"
            path = os.path.join(BASE_OUTPUT_DIR, filename)
            with open(path, "w", encoding="utf-8") as f:
                f.write(f"URL: {page.get('url', '')}\n")
                f.write(f"Title: {page.get('title', '')}\n")
                if page.get("price"):
                    f.write(f"Price: {page['price']}\n")
                f.write("\n--- Features ---\n")
                f.write("\n".join(page.get("features", [])))
                f.write("\n\n--- Specifications ---\n")
                f.write("\n".join(page.get("specifications", [])))
                f.write("\n\n--- Content ---\n")
                f.write(page.get("content", ""))
            print(f"  Saved: {filename}")


# ── Crawl mode ────────────────────────────────────────────────────────────────

def should_follow(url: str, base_domain: str, visited: set) -> bool:
    """Decide whether to follow a link during crawl."""
    if url in visited:
        return False
    parsed = urlparse(url)
    # Must be same domain
    if parsed.netloc and parsed.netloc != base_domain:
        return False
    # Skip non-page URLs
    if re.search(r'\.(pdf|jpg|jpeg|png|gif|svg|css|js|zip|xml|json)$', parsed.path, re.I):
        return False
    # Apply path filter if configured
    if CRAWL_PATH_FILTER:
        return any(f in parsed.path for f in CRAWL_PATH_FILTER)
    return True


def crawl(seed_url: str, max_pages: int) -> list[dict]:
    """BFS crawl starting from seed_url, return all scraped pages."""
    scraper  = VGuardScraper()
    parsed   = urlparse(seed_url)
    domain   = parsed.netloc
    queue    = deque([seed_url])
    visited  = set()
    scraped  = []

    print(f"\n  Domain   : {domain}")
    print(f"  Seed URL : {seed_url}")
    print(f"  Max pages: {max_pages}")
    if CRAWL_PATH_FILTER:
        print(f"  Path filter: {CRAWL_PATH_FILTER}")
    else:
        print("  Path filter: none (full site)")
    print()

    while queue and len(scraped) < max_pages:
        url = queue.popleft()
        if url in visited:
            continue
        visited.add(url)

        page = scraper.scrape_page(url)
        if not page:
            time.sleep(REQUEST_DELAY)
            continue

        scraped.append(page)
        print(f"  [{len(scraped)}/{max_pages}] {page.get('title', url)[:60]}")

        # Discover links
        for href in page.get("_links", []):
            abs_url = urljoin(url, href).split("#")[0].rstrip("/")
            if should_follow(abs_url, domain, visited):
                queue.append(abs_url)

        time.sleep(REQUEST_DELAY)

    print(f"\n  Crawl complete: {len(scraped)} pages, {len(visited)} visited")
    return scraped


# ── Manual mode ───────────────────────────────────────────────────────────────

def scrape_manual() -> list[dict]:
    if not URLS:
        print("⚠️  No URLs in URLS list. Add some or use --crawl mode.")
        return []

    scraper = VGuardScraper()
    scraped = []
    print(f"Scraping {len(URLS)} URL(s)...\n")
    for url in URLS:
        data = scraper.scrape_page(url)
        if data:
            scraped.append(data)
        time.sleep(REQUEST_DELAY)
    return scraped


# ── Save combined file ────────────────────────────────────────────────────────

def save_combined(data: list[dict]) -> None:
    os.makedirs(BASE_OUTPUT_DIR, exist_ok=True)
    combined_path = os.path.join(BASE_OUTPUT_DIR, "vguard_website_data.txt")
    with open(combined_path, "w", encoding="utf-8") as f:
        for page in data:
            f.write(f"\n\n{'='*60}\n")
            f.write(f"URL: {page.get('url', '')}\n")
            f.write(f"Title: {page.get('title', '')}\n")
            f.write("="*60 + "\n")
            f.write(page.get("content", ""))
    print(f"\n  Combined file → {combined_path}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--crawl", action="store_true",
                        help="Auto-crawl from CRAWL_SEED_URL instead of manual URLS list")
    parser.add_argument("--max-pages", type=int, default=MAX_PAGES,
                        help=f"Max pages to crawl (default: {MAX_PAGES})")
    args, _ = parser.parse_known_args()

    print("=" * 50)
    print("  V-Guard Website Scraper")
    print("=" * 50)

    if args.crawl:
        print(f"  Mode: CRAWL from {CRAWL_SEED_URL}\n")
        scraped = crawl(CRAWL_SEED_URL, args.max_pages)
    else:
        print(f"  Mode: MANUAL ({len(URLS)} URLs)\n")
        scraped = scrape_manual()

    if not scraped:
        print("No pages scraped.")
        return

    scraper = VGuardScraper()
    scraper.save_to_text_files(scraped)
    save_combined(scraped)

    print(f"\n✅ Done. {len(scraped)} pages saved to knowledge-base/scraped_data/")
    print("   Next: python process_knowledge.py")


if __name__ == "__main__":
    main()
