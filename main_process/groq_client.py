import os
from dotenv import load_dotenv
from pathlib import Path
from groq import Groq

client = Groq(api_key="groq_api_key")

def predict_mcc(caption: str):
    """
    Uses Groq LLM to predict MCC code and description from caption text.
    Returns: (mcc_code, mcc_description)
    """
    prompt = f"""
    You are an expert in identifying Merchant Category Codes (MCC).
    Given a caption that describes a business or activity, return:
    - The most suitable MCC code (4-digit)
    - A short MCC description.

    Caption: "{caption}"

    Respond in JSON format:
    {{
      "mcc_code": "XXXX",
      "description": "..."
    }}
    """

    response = client.chat.completions.create(
        model="llama-3.1-70b-versatile",  # can switch to smaller model if needed
        messages=[
            {"role": "system", "content": "You are a precise MCC prediction assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    try:
        content = response.choices[0].message.content.strip()
        # try to extract JSON safely
        import json
        data = json.loads(content)
        return data.get("mcc_code", "Unknown"), data.get("description", "No description found")
    except Exception:
        return "Unknown", "Unable to parse MCC prediction."
