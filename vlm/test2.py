from datasets import Dataset
from PIL import Image
from transformers import Blip2Processor, Blip2ForConditionalGeneration
from sentence_transformers import SentenceTransformer, util
from google import genai
from google.genai import types
from dotenv import load_dotenv
from pathlib import Path
import os, json, io, torch, requests, re

dotenv_path = Path('config') / '.env'
load_dotenv(dotenv_path=dotenv_path)

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_KEY:
    raise ValueError("Cannot load the GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_KEY)

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f" Using device: {device}")

processor = Blip2Processor.from_pretrained("Salesforce/blip2-opt-2.7b")
model = Blip2ForConditionalGeneration.from_pretrained(
    "Salesforce/blip2-opt-2.7b",
    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
    device_map="auto" 
).eval()

sbert = SentenceTransformer("all-MiniLM-L6-v2")

def predict_mcc_from_gemini(caption: str):
    prompt = f"""
Caption: {caption}

Identify the 4-digit MCC (Merchant Category Code) that best fits this description.
It should match the product/service type, not a generic store.
Return only one 4-digit number, no explanation.
If unsure, infer the closest possible MCC.
"""
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.0,
                max_output_tokens=8,
                top_p=0.1,
                top_k=1,
            ),
        )

        text = (response.text or "").strip()

        # Extract strict 4-digit code
        m = re.search(r"\b(\d{4})\b", text)
        if m:
            return m.group(1)

        # Fallback if model includes MCC: prefix
        m = re.search(r"MCC[: ]+(\d{4})", text, re.IGNORECASE)
        if m:
            return m.group(1)

        # Default fallback
        return "5699"

    except Exception as e:
        print(f"⚠️ Error predicting MCC (Gemini): {e}")
        return "5699"

def load_image(source):
    if isinstance(source, bytes):
        return Image.open(io.BytesIO(source)).convert("RGB")
    elif isinstance(source, str):
        if source.startswith("http"):
            return Image.open(requests.get(source, stream=True).raw).convert("RGB")
        return Image.open(source).convert("RGB")
    elif isinstance(source, Image.Image):
        return source.convert("RGB")
    else:
        raise ValueError("Unsupported image format")

def get_mcc_from_image(
    image,
    sbert,
    processor,
    model,
    device="cuda",
    num_captions=3,
):
    """
    Generates multiple captions for an image and uses Gemini API to predict MCC.
    Returns: (best_caption, predicted_mcc_code, description_from_caption, best_caption)
    """
    img = load_image(image)

    # Ensure tensors are moved to correct device + dtype
    inputs = processor(images=img, return_tensors="pt").to(device)

    # Generate multiple captions
    output_ids = model.generate(
        **inputs,
        max_new_tokens=30,
        num_return_sequences=num_captions,
        do_sample=True,
        top_p=0.9,
        temperature=0.7
    )

    captions = [processor.decode(oid, skip_special_tokens=True).strip().lower() for oid in output_ids]

    best_caption = None
    predicted_code = None

    for caption in captions:
        code = predict_mcc_from_gemini(caption)
        if code:
            best_caption = caption
            predicted_code = code
            break

    if not predicted_code:
        best_caption = captions[0]
        predicted_code = "Unknown"

    return best_caption, predicted_code, best_caption, best_caption
