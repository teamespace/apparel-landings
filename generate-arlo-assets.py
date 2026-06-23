#!/usr/bin/env python3
"""
Generate ARLO assets using OpenAI GPT-Image-2.
All male models, mix studio + outdoor, clean minimalist menswear direction.
"""
import os
import base64
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# Load .env and override any existing env vars
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        if line.strip() and "=" in line and not line.startswith("#"):
            key, value = line.split("=", 1)
            os.environ[key.strip()] = value.strip()

API_KEY = os.environ.get("OPENAI_API_KEY", "")
if not API_KEY or API_KEY == "sk-...":
    raise SystemExit("Error: OPENAI_API_KEY belum diisi di .env")

OUT_DIR = Path(__file__).parent / "generated-assets" / "arlo"
OUT_DIR.mkdir(parents=True, exist_ok=True)

BASE_STYLE = (
    "Clean minimalist menswear fashion photography, male model, "
    "neutral off-white beige and black clothing, natural soft light, "
    "premium editorial style, sharp focus, subtle shadows, "
    "relaxed confident pose, high-end apparel campaign"
)

IMAGES = [
    # Hero
    ("arlo-hero", f"{BASE_STYLE}, full body shot, young man wearing oversized beige linen overshirt over white t-shirt and black wide-leg trousers, hands in pockets, light gray studio background, sunglasses"),

    # Categories
    ("arlo-cat-shirting", f"{BASE_STYLE}, half body shot, young man in crisp white t-shirt layered under cream overshirt, light gray studio background"),
    ("arlo-cat-tailoring", f"{BASE_STYLE}, half body shot, young man in unstructured black blazer over white t-shirt with black tailored trousers, light gray studio background"),
    ("arlo-cat-accessories", f"Minimalist menswear accessories still life, black leather bag, black sunglasses, gold chain necklace, folded beige overshirt, light gray background, premium product photography"),

    # Feature products
    ("arlo-product-1", f"{BASE_STYLE}, full body, young man in long beige linen trench coat over white t-shirt and black trousers, light gray studio background"),
    ("arlo-product-2", f"{BASE_STYLE}, half body, young man in oatmeal cashmere knit sweater, light gray studio background, soft light"),
    ("arlo-product-3", f"{BASE_STYLE}, lower body detail, young man in pleated cream wide-leg trousers with hands in pockets, light gray studio background"),
    ("arlo-product-4", f"{BASE_STYLE}, half body, young man in off-white silk button-up shirt, light gray studio background"),
    ("arlo-product-5", f"Minimalist product still life, folded oatmeal merino wool scarf on light gray surface, premium textile photography"),
    ("arlo-product-6", f"{BASE_STYLE}, half body, young man in charcoal tailored blazer over black t-shirt, light gray studio background"),

    # Lookbook
    ("arlo-look-1", f"{BASE_STYLE}, full body outdoor shot, young man in all beige outfit with overshirt and wide trousers, clear blue sky, concrete architecture background, sunglasses"),
    ("arlo-look-2", f"{BASE_STYLE}, full body studio shot, young man in black hoodie and black shorts with white sneakers, light gray background"),
    ("arlo-look-3", f"{BASE_STYLE}, half body outdoor shot, young man in black blazer over white tank top, clear blue sky, looking away, sunglasses"),
    ("arlo-look-4", f"{BASE_STYLE}, detail shot, beige overshirt fabric and pocket close-up, natural light"),

    # Craft
    ("arlo-craft", f"Close-up of natural linen and cashmere fabric textures layered together, soft natural light, warm bone tones, premium textile detail photography"),

    # Journal
    ("arlo-journal-1", f"{BASE_STYLE}, full body outdoor shot, young man in beige linen set standing against white concrete wall, blue sky, sunglasses, editorial campaign"),
    ("arlo-journal-2", f"{BASE_STYLE}, half body shot, young man in white linen shirt, natural window light, lifestyle editorial"),
    ("arlo-journal-3", f"{BASE_STYLE}, half body shot, young man in crisp white button-up shirt, light gray studio background, clean portrait"),
]


def generate_image(prompt: str, filename: str) -> Path:
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
    return out_path


def generate_one(item):
    filename, prompt = item
    try:
        path = generate_image(prompt, filename)
        return (filename, "ok", str(path))
    except Exception as e:
        return (filename, "failed", str(e))


def main():
    print(f"Generating {len(IMAGES)} ARLO assets...\n")
    results = []
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {executor.submit(generate_one, item): item for item in IMAGES}
        for future in as_completed(futures):
            filename, status, detail = future.result()
            results.append((filename, status, detail))
            if status == "ok":
                print(f"  {filename}: saved")
            else:
                print(f"  {filename}: FAILED - {detail}")
            time.sleep(0.2)

    ok = sum(1 for r in results if r[1] == "ok")
    failed = len(results) - ok
    print(f"\nDone: {ok} OK, {failed} failed")
    print(f"Assets saved to: {OUT_DIR}")


if __name__ == "__main__":
    main()
