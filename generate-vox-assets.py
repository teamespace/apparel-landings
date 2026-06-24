#!/usr/bin/env python3
"""
Generate VOX assets using OpenAI GPT-Image-2.
Dark athletic streetwear direction: black/olive/carbon tones,
performance fabrics, concrete/urban backgrounds, dramatic moody light,
male and female models, premium sportswear campaign aesthetic.
"""
import os
import sys
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

OUT_DIR = Path(__file__).parent / "generated-assets" / "vox"
OUT_DIR.mkdir(parents=True, exist_ok=True)

BASE_STYLE = (
    "Dark athletic streetwear fashion photography, moody cinematic lighting, "
    "black olive and carbon grey color palette, premium performance fabrics, "
    "raw concrete or industrial urban background, sharp editorial style, "
    "high contrast shadows, contemporary sportswear campaign"
)

IMAGES = [
    # Hero
    ("vox-hero", f"{BASE_STYLE}, group of three athletic young men in oversized black jackets, hoodies and cargo pants, walking through a neon-lit urban street at night, Amsterdam energy, dramatic backlight, cinematic wide shot"),

    # Categories
    ("vox-cat-menswear", f"{BASE_STYLE}, full body male model in oversized black bomber jacket, black tech tee and black cargo pants, concrete wall background, moody side light"),
    ("vox-cat-womenswear", f"{BASE_STYLE}, full body female model in oversized black parka, black crop top and baggy cargo pants, concrete wall background, moody side light, athletic stance"),
    ("vox-cat-accessories", f"Dark streetwear accessories flat lay, black beanie, black sunglasses, silver chain, black crossbody bag, olive cargo belt, concrete surface, moody product photography"),

    # Products
    ("vox-product-1", f"{BASE_STYLE}, product shot of male model wearing black oversized bomber jacket with utility pockets, black t-shirt, grey concrete background, half body", "1024x1280"),
    ("vox-product-2", f"{BASE_STYLE}, male model wearing black stencil-print hoodie with drawstrings, hands in pocket, grey concrete background, half body", "1024x1280"),
    ("vox-product-3", f"{BASE_STYLE}, male model from waist down in black tag utility cargo pants with side pockets, black sneakers, concrete background", "1024x1280"),
    ("vox-product-4", f"{BASE_STYLE}, male model wearing black oversized drop shoulder t-shirt, muscular build, grey concrete background, half body", "1024x1280"),
    ("vox-product-5", f"Dark streetwear product still life, black ribbed beanie on concrete surface, minimal, moody light", "1024x1280"),
    ("vox-product-6", f"{BASE_STYLE}, male model from waist down in black cargo shorts with utility pockets, white socks and black sneakers, concrete background", "1024x1280"),
    ("vox-product-7", f"Dark streetwear product still life, black crossbody bag with silver zippers and utility straps on raw concrete surface, moody cinematic light, black olive and carbon grey palette, premium accessories photography", "1024x1280"),
    ("vox-product-8", f"{BASE_STYLE}, male model wearing black tactical utility vest with multiple pockets over a black hoodie, half body shot, grey concrete background", "1024x1280"),

    # Lookbook
    ("vox-look-1", f"{BASE_STYLE}, male model in black bomber jacket standing in urban stairwell, looking up, dramatic overhead light", "1024x1536"),
    ("vox-look-2", f"{BASE_STYLE}, close-up portrait of male model against raw concrete wall, wearing black hoodie, intense gaze, street lighting", "1024x1536"),
    ("vox-look-3", f"{BASE_STYLE}, group of two male models in black streetwear on a city bridge at dusk, Amsterdam skyline vibe, cinematic", "1024x1536"),
    ("vox-look-4", f"{BASE_STYLE}, male model in oversized black jacket and cargo pants walking through neon-lit street at night, backlit", "1024x1536"),
    ("vox-look-5", f"{BASE_STYLE}, male model leaning against concrete corridor wall, wearing black parka, moody side light, full body", "1024x1536"),
    ("vox-look-6", f"{BASE_STYLE}, close-up editorial portrait of male model with short hair, black athletic top, urban night lighting, shallow depth of field", "1024x1536"),

    # Friends
    ("vox-friend-1", f"{BASE_STYLE}, portrait of young woman with short hair, skater style, black streetwear, holding vintage film camera, concrete background", "1024x1024"),
    ("vox-friend-2", f"{BASE_STYLE}, portrait of young man with headphones around neck, producer DJ vibe, black hoodie, dim neon light", "1024x1024"),
    ("vox-friend-3", f"{BASE_STYLE}, portrait of young woman visual artist, paint smudge on cheek, black oversized jacket, industrial background", "1024x1024"),
    ("vox-friend-4", f"{BASE_STYLE}, portrait of young male bike courier, athletic build, black windbreaker, city night background", "1024x1024"),
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
    if len(item) == 3:
        filename, prompt, size = item
    else:
        filename, prompt = item
        size = "1024x1536"
    try:
        path = generate_image(prompt, filename, size=size)
        return (filename, "ok", str(path))
    except Exception as e:
        return (filename, "failed", str(e))


def main():
    prefix = sys.argv[1] if len(sys.argv) > 1 else None
    items = [item for item in IMAGES if prefix is None or item[0].startswith(prefix)]
    if not items:
        print(f"No images match prefix '{prefix}'")
        return
    print(f"Generating {len(items)} VOX assets...\n")
    results = []
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = {executor.submit(generate_one, item): item for item in items}
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
