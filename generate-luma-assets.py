#!/usr/bin/env python3
"""
Generate LUMA assets using OpenAI GPT-Image-2.
Italian country club / tennis-golf lifestyle aesthetic:
warm vintage film photography, soft golden hour light,
cream/ivory/navy/olive/burgundy tones, male and female models,
outdoor resort settings, premium resort wear campaign.
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

OUT_DIR = Path(__file__).parent / "generated-assets" / "luma"
OUT_DIR.mkdir(parents=True, exist_ok=True)

BASE_STYLE = (
    "Italian country club lifestyle fashion photography, warm vintage film look, "
    "soft golden hour sunlight, cream ivory navy olive and burgundy color palette, "
    "outdoor resort setting, relaxed elegant pose, subtle film grain, "
    "desaturated warm color grading, high-end apparel campaign"
)

IMAGES = [
    # Hero — landscape 1536x1024
    ("luma-hero-1", f"{BASE_STYLE}, wide cinematic landscape shot, male and female models in tennis whites and navy knit sweaters walking beside a vintage red convertible on a crushed gravel country club drive, umbrella pines, golden hour", "1536x1024"),
    ("luma-hero-2", f"{BASE_STYLE}, wide landscape shot, two women in ivory tennis dresses and one man in a burgundy polo leaning against a classic stone clubhouse terrace, green shutters, terracotta pots, late afternoon light", "1536x1024"),
    ("luma-hero-3", f"{BASE_STYLE}, wide landscape shot, couple playing tennis on a clay court surrounded by cypress trees, vintage wooden rackets, cream cable-knit sweaters draped over a bench, warm haze", "1536x1024"),

    # Categories — portrait 1024x1536
    ("luma-cat-tops", f"{BASE_STYLE}, female model in a cream cotton polo shirt and tailored ivory shorts, standing on a country club lawn, tennis racket under arm, soft portrait", "1024x1536"),
    ("luma-cat-shop1", f"{BASE_STYLE}, male model in a navy tennis sweater with cream trim and white pleated shorts, leaning on a vintage wooden tennis net post, golden hour portrait", "1024x1536"),
    ("luma-cat-bottoms", f"{BASE_STYLE}, female model in high-waisted olive tailored shorts and a tucked-in ivory knit top, standing on a garden path, relaxed elegant pose", "1024x1536"),
    ("luma-cat-shop2", f"{BASE_STYLE}, male model in burgundy merino polo shirt and cream tailored trousers, seated on a weathered garden chair, warm vintage film portrait", "1024x1536"),
    ("luma-cat-jackets", f"{BASE_STYLE}, female model in a navy quilted jacket layered over a cream cashmere polo, holding a tennis bag over one shoulder, country club entrance background", "1024x1536"),

    # Featured — landscape 1536x1024
    ("luma-featured", f"{BASE_STYLE}, wide landscape shot, group of four friends gathered at an outdoor country club bar, men in polo shirts and knit sweaters, women in dresses and tennis whites, laughter, citrus cocktails, late afternoon sun", "1536x1024"),

    # Products — portrait 1024x1536
    ("luma-product-1a", f"{BASE_STYLE}, male model wearing a cream cable-knit tennis sweater over a white collared polo, tailored navy shorts, standing on a clay tennis court", "1024x1536"),
    ("luma-product-1b", f"{BASE_STYLE}, female model wearing a cream cable-knit tennis sweater over a white collared dress, navy headband, standing on a clay tennis court", "1024x1536"),
    ("luma-product-2a", f"{BASE_STYLE}, male model wearing a burgundy pique polo shirt with ivory tailored shorts, leaning against a vintage car door", "1024x1536"),
    ("luma-product-2b", f"{BASE_STYLE}, female model wearing a burgundy sleeveless knit top with an ivory pleated tennis skirt, standing beside a vintage car", "1024x1536"),
    ("luma-product-3a", f"{BASE_STYLE}, male model wearing an olive quarter-zip knit sweater and cream tailored trousers, seated on a stone wall in a country club garden", "1024x1536"),
    ("luma-product-3b", f"{BASE_STYLE}, female model wearing an olive cashmere cardigan over an ivory sundress, standing among clipped boxwood hedges", "1024x1536"),
    ("luma-product-4a", f"{BASE_STYLE}, male model wearing a navy blazer over a cream polo shirt and white tailored shorts, on a clubhouse terrace", "1024x1536"),
    ("luma-product-4b", f"{BASE_STYLE}, female model wearing a navy tailored jacket over an ivory knit top and white pleated skirt, holding a woven straw tote, clubhouse terrace", "1024x1536"),
    ("luma-product-5a", f"{BASE_STYLE}, male model wearing a cream linen button-down shirt with rolled sleeves and olive tailored shorts, walking down a garden allée", "1024x1536"),
    ("luma-product-5b", f"{BASE_STYLE}, female model wearing a cream linen shirt dress with a thin tan leather belt, walking down a garden allée, straw hat in hand", "1024x1536"),
    ("luma-product-6a", f"{BASE_STYLE}, male model wearing an ivory tennis vest layered over a navy long-sleeve polo, cream trousers, on a grass court", "1024x1536"),
    ("luma-product-6b", f"{BASE_STYLE}, female model wearing an ivory tennis sweater vest over a navy pleated dress, standing at the net on a grass court", "1024x1536"),
]


def generate_image(prompt: str, filename: str, size: str = "1024x1536") -> Path:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "gpt-image-2",
        "prompt": prompt,
        "size": size,
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
    filename, prompt, size = item
    try:
        path = generate_image(prompt, filename, size)
        return (filename, "ok", str(path))
    except Exception as e:
        return (filename, "failed", str(e))


def main():
    print(f"Generating {len(IMAGES)} LUMA assets...\n")
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
