import os
import json
import requests
import logging
import language_tool_python
import torch
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
from pydantic import BaseModel
from urllib.parse import urljoin
from fastapi import APIRouter, HTTPException, FastAPI, Request
from fastapi import UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer, util
from transformers import Blip2Processor , Blip2ForConditionalGeneration

from main_process.web_scrapper import scrape_website
from main_process.schema_extractor import extract_schema
from main_process.schema_flattener import flatten_schema
from main_process.summarize import summarize_products
from main_process.groq_client import predict_mcc
from main_process.link_check import crawl_site
from main_process.cert_data import get_ssl_info, get_whois_info, find_legal_pages
#from vlm.testy import get_mcc_from_image
from vlm.test2 import get_mcc_from_image

app = FastAPI()
logger = logging.getLogger("uvicorn.error")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sbert = SentenceTransformer("all-MiniLM-L6-v2", device="cuda")
processor = Blip2Processor.from_pretrained("Salesforce/blip2-opt-2.7b")
model = Blip2ForConditionalGeneration.from_pretrained(
    "Salesforce/blip2-opt-2.7b",
    torch_dtype=torch.float16,
    device_map="auto"
).eval()


class MerchantInput(BaseModel):
    name: str
    website: str
    email: Optional[str] = None
    description: Optional[str] = None
 
with  open("mcc_codes(1).json","r",encoding = "utf-8") as f:
  mcc_data: Dict[str,str] = json.load(f)
mcc_codes: List[str] = list(mcc_data.keys())
mcc_descs: List[str] = list(mcc_data.values())


request_cache: Dict[str, Dict[str, any]] = {}

def get_cached_or_scrape(website: str):
    cache = request_cache.get(website)
    if cache is None:
        cache = {}
        raw_text, descriptions = scrape_website(website)
        soup = BeautifulSoup(requests.get(website, timeout=10).text, "html.parser")
        cache["raw_text"] = raw_text
        cache["descriptions"] = descriptions
        cache["soup"] = soup
        cache["schema_data"] = extract_schema(website)
        cache["schema_text"] = flatten_schema(cache["schema_data"])
        cache["internal_links"] = [
            urljoin(website, a['href'])
            for a in soup.find_all("a", href=True)
            if any(k in a['href'].lower() for k in ["product", "collection", "course", "service", "pricing", "plan", "feature"])
        ]
        request_cache[website] = cache
    return cache

@app.post("/predict")
async def predict(images: List[UploadFile] = File(...)):
    """
    Accept multiple image files, generate captions using BLIP2,
    and predict MCC codes using Groq API.
    Returns same format as original version.
    """
    results = []

    for img_file in images:
        img_bytes = await img_file.read()

        caption, code, desc, _ = get_mcc_from_image(
            image=img_bytes,     
            sbert=None,           
            processor=processor,
            model=model,
            device="cuda",             
            num_captions=3
        )

        result_str = (
            f"{img_file.filename}: {caption} → {code} ({desc})"
            if code and code != "Unknown"
            else f"{img_file.filename}: {caption} → No relevant MCC found"
        )

        results.append(result_str)

    return {"predictions": results}
    
@app.post("/grmr")
async def scan_grammar_issue(merchant: MerchantInput):
    base_url = merchant.website
    tool = language_tool_python.LanguageTool("en-US")
    results = []

    raw_text,_ = scrape_website(base_url)
    soup = BeautifulSoup(requests.get(base_url,timeout = 5).text,'html.parser')
    keywords = ["product","collection","course","service","pricing","plan"]
    internal_links = [urljoin(base_url,a['href']) for a in soup.findAll("a",href = True)
                      if any(k in a['href'].lower() for k in keywords)]
    pages_to_check = [base_url] +list(set(internal_links))

    for url in pages_to_check:
        try:
            text,_ = scrape_website(url)
            if not text.strip(): 

                results.append({"url":url,"errors":"Failed to extract data"})
                continue
            matches = tool.check(text)
            if matches:
                errors = [
                    {
                    "message": m.message,
                    "context": m.context,   
                    "suggestions ": m.replacements,
                    "offset": m.offset,
                    "length": m.errorLength
                    }
                    for m in matches
                ]
                results.append({"url":url,"errors":errors})
            else:
                results.append({"url":url,"errors":"No Grammatical Mistakes were found"})
        except Exception as e:
            results.append({"url":url,"errors":f"Error processing the page:{str(e)}"})
    return results

@app.post("/linkcheck")
async def check_links(merchant: MerchantInput, depth: int = 200):
    try:
        base_url = merchant.website
        urls = crawl_site(base_url, max_pages=depth)

        # Convert list of strings -> list of objects
        results = [{"url": u, "status_code": 200, "redirected_to": None} for u in urls]

        return {"results": results, "total_links": len(results), "error": None}
    except Exception as e:
        return {"results": [], "total_links": 0, "error": str(e)}


@app.post("/download_data")
async def data_download(merchant: MerchantInput):
    try:
        ssl_cert = get_ssl_info(merchant.website)
        legal_pages = find_legal_pages(merchant.website)
        whois_cert = get_whois_info(merchant.website)
        return {
            "ssl_cert": ssl_cert,
            "whois_cert": whois_cert,
            "legal_pages": legal_pages,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))