import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_website(url):
    visited = set()
    descriptions = []
    raw_texts = []

    def scrape_page(page_url):
        try:
            res = requests.get(page_url,timeout = 10)
            soup = BeautifulSoup(res.text,'html.parser')
            text_blocks = soup.find_all(['p', 'h1', 'h2', 'li', 'div', 'span', 'article', 'section'])
            raw_text = " ".join(el.get_text(strip=True) for el in text_blocks)
            descs = [el.get_text(strip=True) for el in text_blocks if len(el.get_text()) > 50]
            return raw_text,descs
        except:
            return "",[]
    raw,desc = scrape_page(url)
    raw_texts.append(raw)
    descriptions.extend(desc)
    visited.add(url)

    soup = BeautifulSoup(requests.get(url).text,"html.parser")
    keywords = ["product","collection","course","service","pricing","plan","feature"]
    internal_links = [urljoin(url, a['href']) for a in soup.find_all("a",href=True)
                    if any(k in a['href'].lower() for k in keywords)]
    
    for link in internal_links[:5]:
        if link not in visited:
            raw,desc = scrape_page(link)
            raw_texts.append(raw)
            descriptions.extend(desc)
            visited.add(link)
            
    return " ".join(raw_texts),descriptions