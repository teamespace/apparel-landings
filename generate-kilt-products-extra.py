#!/usr/bin/env python3
import os
import base64
import requests
from pathlib import Path

env_path = Path(__file__).parent / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        if line.strip() and "=" in line and not line.startswith("#"):
            key, value = line.split("=", 1)
            os.environ[key.strip()] = value.strip()

API_KEY = os.environ.get("OPENAI_API_KEY", "")
if not API_KEY or API_KEY == "sk-...":
    raise SystemExit("Error: OPENAI_API_KEY belum diisi di .env")

OUT_DIR = Path(__file__).parent / "generated-assets" / "kilt"
OUT_DIR.mkdir(parents=True, exist_ok=True)

BASE_STYLE = (
    "Technical apparel fashion photography, pure black studio background, "
    "moody directional lighting from above-left, cyberpunk urban techwear aesthetic, "
    "monochrome black gunmetal grey and silver metallic color palette, "
    "premium technical fabrics, waterproof membranes, matte and metallic finishes, "
    "sharp editorial style, high contrast, Japanese techwear influence"
)

IMAGES = [
    ("kilt-product-7", f"{BASE_STYLE}, product shot of black technical balaclava face mask with seam taping and breathable mesh panel, matte technical fabric, hanging against pure black background, studio product photography, portrait orientation"),
    ("kilt-product-8", f"{BASE_STYLE}, product shot of black tactical crossbody sling bag with multiple compartments and buckle straps, matte technical fabric, hanging against pure black background, studio product photography, portrait orientation"),
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

def main():
    print(f"Generating {len(IMAGES)} KILT product assets...\n")
    for filename, prompt in IMAGES:
        try:
            path = generate_image(prompt, filename)
            print(f"  {filename}: saved -> {path}")
        except Exception as e:
            print(f"  {filename}: FAILED - {e}")
    print(f"\nDone. Assets saved to: {OUT_DIR}")

if __name__ == "__main__":
    main()
