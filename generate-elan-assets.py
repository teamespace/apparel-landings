#!/usr/bin/env python3
"""Generate ÉLAN retro jersey assets with GPT-Image-2 (medium quality).
Usage: OPENAI_API_KEY=xxx python generate-elan-assets.py
"""
import os, sys, time, base64, requests
from pathlib import Path

API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    sys.exit("Set OPENAI_API_KEY env var")

OUT_DIR = Path(__file__).parent / "05-elan-moody" / "assets"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PRODUCTS = [
    ("elan-product-01.jpg", "A white retro football jersey with navy collar and cuffs, 'MARINO' printed across chest, small crest on left chest, laid flat on clean light gray background, studio product photography, soft even lighting, minimal shadows"),
    ("elan-product-02.jpg", "A royal blue retro football jersey with white collar, 'PIONEER' printed across chest, small crest on left chest, laid flat on clean light gray background, studio product photography, soft even lighting"),
    ("elan-product-03.jpg", "A forest green retro football jersey with cream collar, 'FJORD' printed across chest, small crest on left chest, laid flat on clean light gray background, studio product photography, soft even lighting"),
    ("elan-product-04.jpg", "A black retro football jersey with gold accents, 'AURELIA' printed across chest, small crest on left chest, laid flat on clean light gray background, studio product photography, soft even lighting"),
    ("elan-product-05.jpg", "A cream retro football jersey with burgundy collar and cuffs, 'NORDIC' printed across chest, small crest on left chest, laid flat on clean light gray background, studio product photography, soft even lighting"),
    ("elan-product-06.jpg", "A navy and white horizontal striped retro football jersey, 'HARBOUR' printed across chest, small crest on left chest, laid flat on clean light gray background, studio product photography, soft even lighting"),
    ("elan-product-07.jpg", "A burgundy retro football jersey with cream collar, 'SOVRANO' printed across chest, small crest on left chest, laid flat on clean light gray background, studio product photography, soft even lighting"),
    ("elan-product-08.jpg", "A white and green vertical striped retro football jersey, 'CIRRUS' printed across chest, small crest on left chest, laid flat on clean light gray background, studio product photography, soft even lighting"),
]

LIFESTYLES = [
    ("elan-hero-lifestyle.jpg", "A young male model with short curly hair wearing a cream retro football jersey and black shorts, standing with back to camera in an urban park with modern white apartment buildings in background, overcast daylight, editorial fashion photography, muted tones, cinematic composition, full body shot"),
    ("elan-editorial-lifestyle.jpg", "A young female model with wavy brown hair wearing a green retro football jersey and vintage denim shorts, leaning against a white stucco wall near the beach, Mediterranean coastal town, golden hour sunlight, editorial fashion photography, warm tones, mid-shot"),
]

HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
URL = "https://api.openai.com/v1/images/generations"


def generate(filename: str, prompt: str, size: str = "1024x1024") -> Path:
    payload = {
        "model": "gpt-image-2",
        "prompt": prompt,
        "n": 1,
        "size": size,
        "quality": "medium",
    }
    r = requests.post(URL, headers=HEADERS, json=payload, timeout=180)
    r.raise_for_status()
    data = r.json()
    b64 = data["data"][0]["b64_json"]
    out_path = OUT_DIR / filename
    out_path.write_bytes(base64.b64decode(b64))
    print(f"  OK -> {out_path} ({out_path.stat().st_size//1024}KB)")
    return out_path


def main():
    print("Generating ÉLAN assets with GPT-Image-2 (medium quality)...\n")

    for filename, prompt in PRODUCTS:
        print(f"Product: {filename}")
        try:
            generate(filename, prompt, size="1024x1024")
        except Exception as e:
            print(f"  ERROR: {e}")
        time.sleep(0.5)

    for filename, prompt in LIFESTYLES:
        print(f"Lifestyle: {filename}")
        try:
            generate(filename, prompt, size="1536x1024")
        except Exception as e:
            print(f"  ERROR: {e}")
        time.sleep(0.5)

    print(f"\nDone. Assets saved to {OUT_DIR}")


if __name__ == "__main__":
    main()
