import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin

def extract_links_from_page(url: str) -> list[str]:
    """Extract all valid links from a single page."""
    try:
        response = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        links = []
        for tag in soup.find_all("a", href=True):
            href = tag["href"]
            if href.startswith("#") or href.startswith("javascript:") or href.startswith("mailto:"):
                continue
            full_url = urljoin(url, href)
            links.append(full_url)

        return list(set(links))
    except Exception:
        return []

def crawl_site(base_url: str, max_pages: int = 200) -> list[str]:
    """Recursively crawl a site and collect links."""
    visited = set()
    to_visit = [base_url]
    all_links = []

    base_domain = urlparse(base_url).netloc

    while to_visit and len(visited) < max_pages:
        current_url = to_visit.pop(0)
        if current_url in visited:
            continue
        visited.add(current_url)

        print(f"🔎 Visiting: {current_url}")

        page_links = extract_links_from_page(current_url)
        all_links.extend(page_links)

        for link in page_links:
            if urlparse(link).netloc == base_domain and link not in visited and link not in to_visit:
                to_visit.append(link)

    return list(set(all_links))
