#!/usr/bin/env python3
"""
Generate images for the 5 apparel landing pages using OpenAI GPT-Image-2.
Usage:
  python3 generate-images.py
Requires OPENAI_API_KEY in .env file.
"""
import os
import sys
import base64
import requests
from pathlib import Path

# Load .env manually and override any existing env vars (no external deps)
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        if line.strip() and "=" in line and not line.startswith("#"):
            key, value = line.split("=", 1)
            os.environ[key.strip()] = value.strip()

API_KEY = os.environ.get("OPENAI_API_KEY", "")
if not API_KEY or API_KEY == "sk-...":
    print("Error: OPENAI_API_KEY belum diisi di .env")
    sys.exit(1)

OUT_DIR = Path(__file__).parent / "generated-assets"
OUT_DIR.mkdir(exist_ok=True)

IMAGES = [
    # ARLO
    ("arlo-hero", "Editorial fashion portrait, woman in oversized minimalist linen coat, soft natural window light, off-white and charcoal palette, clean background, high-end fashion photography, muted tones"),
    ("arlo-story", "Close-up detail of luxurious natural linen fabric draped elegantly, soft shadows, minimalist composition, warm bone tones, premium textile photography"),
    ("arlo-category-women", "Minimalist fashion editorial, woman in tailored beige trousers and silk blouse, neutral studio background, soft light, luxury womenswear"),
    ("arlo-category-men", "Minimalist menswear editorial, man in charcoal wool overcoat, clean studio background, soft light, luxury menswear"),
    ("arlo-category-accessories", "Still life of premium leather bag, silk scarf and gold jewelry on marble surface, minimalist luxury accessories, soft shadows"),

    # VOX
    ("vox-hero", "Streetwear editorial, young model in oversized black hoodie and cargo pants, urban concrete background, neon lime green accent light, night city vibe, gritty fashion photography"),
    ("vox-category-mens", "Streetwear youth in black bomber jacket and beanie, urban environment, neon green details, premium streetwear campaign"),
    ("vox-category-womens", "Streetwear editorial, woman in oversized hoodie and biker shorts, urban concrete wall, neon lime accents, confident pose"),
    ("vox-category-accessories", "Streetwear accessories flatlay, black crossbody bag, neon green socks, caps, urban backdrop"),
    ("vox-lookbook-1", "Group of young models in coordinated black streetwear, urban rooftop at dusk, neon green light streaks, editorial campaign"),

    # LUMA
    ("luma-hero-linen", "Lifestyle fashion, woman in relaxed linen set sitting in sunlit minimalist living room, cream and sage tones, warm natural light, cozy editorial"),
    ("luma-hero-knit", "Close-up of soft cashmere knit sweater in warm oatmeal color, natural light, lifestyle product photography, terracotta accents"),
    ("luma-hero-lounge", "Woman in cream loungewear on linen sofa, morning light, soft lifestyle editorial, sage and cream palette"),
    ("luma-story", "Hands touching natural linen fabric in warm sunlight, lifestyle detail shot, cream and sage tones"),

    # KILT
    ("kilt-hero", "Brutalist streetwear campaign, model in all-black outfit against raw concrete wall, electric lime green graphic elements, harsh flash photography, raw energy"),
    ("kilt-category-tees", "Close-up of black graphic t-shirt with lime green abstract print, brutalist concrete background"),
    ("kilt-category-outerwear", "Model in oversized black technical jacket, industrial warehouse, lime green accent lighting"),
    ("kilt-category-accessories", "Brutalist accessories still life, black cap, lime green belt, chains on concrete"),

    # ÉLAN
    ("elan-hero", "Cinematic dark fashion, woman in sculptural black evening gown, dramatic low-key lighting, deep navy and champagne tones, luxury couture editorial"),
    ("elan-story", "Close-up of atelier work, hands sewing black silk fabric, candlelight, intimate craftsmanship photography, dark moody tones"),
    ("elan-category-evening", "Woman in flowing black evening dress, dark studio, dramatic side light, luxury eveningwear campaign"),
    ("elan-category-tailoring", "Sharp black tailored blazer on model, dark moody studio, champagne light accent, luxury tailoring"),
    ("elan-category-accessories", "Luxury accessories still life, gold earrings, black velvet clutch, champagne glass, dark moody background"),
    ("elan-film", "Cinematic film still of fashion atelier, woman in black gown by window, dark moody lighting, champagne highlights"),
]


def generate_image(prompt: str, filename: str) -> Path:
    print(f"Generating {filename}...")
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "gpt-image-2",
        "prompt": prompt,
        "size": "1024x1536",
    }
    resp = requests.post(
        "https://api.openai.com/v1/images/generations",
        headers=headers,
        json=payload,
        timeout=180,
    )
    resp.raise_for_status()
    data = resp.json()
    b64 = data["data"][0]["b64_json"]
    out_path = OUT_DIR / f"{filename}.png"
    out_path.write_bytes(base64.b64decode(b64))
    print(f"  Saved {out_path}")
    return out_path


def main():
    for filename, prompt in IMAGES:
        try:
            generate_image(prompt, filename)
        except Exception as e:
            print(f"  Failed {filename}: {e}")


if __name__ == "__main__":
    main()
