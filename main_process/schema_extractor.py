import requests
import json
from bs4 import BeautifulSoup as bf

def extract_schema(url):
    try:
        res = requests.get(url,timeout = 10)
        soup = bf(res.text,'html.parser')
        scripts = soup.find_all('script',type = 'application/ld+json')
        data = []

        for script in scripts:
            try:
                json_obj = json.loads(script.string)
                if isinstance(json_obj,list):
                    data.extend(json_obj)
                else:
                    data.append(json_obj)
            except:
                continue
        return data
    except Exception as e:
        return []