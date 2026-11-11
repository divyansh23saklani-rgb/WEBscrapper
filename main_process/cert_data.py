import ssl
import socket
import whois
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from urllib.parse import urlparse

def get_ssl_info(url: str):
    host_name = urlparse(url).netloc or urlparse(url).path
    ctx = ssl.create_default_context()
    with ctx.wrap_socket(socket.socket(), server_hostname=host_name) as s:
        s.settimeout(5.0)
        s.connect((host_name, 443))
        cert = s.getpeercert()
    return {
        'issuer': dict(x[0] for x in cert['issuer']),
        "valid_from": cert['notBefore'],
        "valid_to": cert['notAfter'],
        'sucject': dict(x[0] for x in cert['subject']),  # keeping original key
    }

def get_whois_info(url: str):
    w = whois.whois(url)
    creation_date = w.creation_date

    # handle lists
    if isinstance(creation_date, list):
        creation_date = creation_date[0]

    # handle timezone-aware dates
    if creation_date is None:
        age = None
    else:
        if creation_date.tzinfo is not None:
            now = datetime.now(creation_date.tzinfo)
        else:
            now = datetime.utcnow()
            creation_date = creation_date.replace(tzinfo=None)
        age = (now - creation_date).days

    return {
        'domain_name': w.domain_name,
        "registrar": w.registrar,
        "creation_date": creation_date,
        "domain_age": age
    }

def find_legal_pages(url: str):
    legal_paths = ["privacy-policy", "terms", "terms-of-service", "disclaimer", 'cookie-ploicy']
    results = {}

    for path in legal_paths:
        try:
            full_url = f"{url.rstrip('/')}/{path}"  # fix f-string syntax
            res = requests.get(full_url, timeout=10)
            if res.status_code == 200:
                soup = BeautifulSoup(res.text, 'html.parser')  # fix parser typo
                title = soup.title.string.strip() if soup.title else "No title"
                results[path] = {"url": full_url, "title": title}  # keep same dict structure
        except:
            continue

    return results
