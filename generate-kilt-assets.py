#!/usr/bin/env python3
"""
Generate KILT techwear assets using OpenAI GPT-Image-2.
Dark technical apparel direction: black, gunmetal grey, silver metallic tones,
modular utility systems, MOLLE panels, waterproof membranes, urban cyberpunk aesthetic.
All shots on pure black background, moody directional lighting.
"""
import os
import base64
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# Load .env
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
    # Hero model
    ("kilt-hero-model", f"{BASE_STYLE}, full body male model wearing black technical hard shell jacket with high collar and hidden zipper, black tactical cargo pants with MOLLE webbing, black combat boots, standing straight facing camera, pure black background, dramatic top lighting, slightly desaturated, editorial campaign shot"),

    # Products
    ("kilt-product-1", f"{BASE_STYLE}, product shot of black technical shell bomber jacket with waterproof membrane, matte black finish, subtle seam taping details, hanging on invisible hanger against pure black background, studio product photography"),
    ("kilt-product-2", f"{BASE_STYLE}, product shot of long black hard shell parka with sealed seams, high collar, matte technical fabric, asymmetric front zipper, hanging against pure black background, studio product photography"),
    ("kilt-product-3", f"{BASE_STYLE}, product shot of grey utility modular vest with multiple tactical pockets, MOLLE-compatible webbing, matte grey and black fabric, hanging against pure black background, studio product photography"),
    ("kilt-product-4", f"{BASE_STYLE}, product shot of black tech hoodie with articulated sleeves, hidden zipper pockets, matte technical fleece fabric, hanging against pure black background, studio product photography"),
    ("kilt-product-5", f"{BASE_STYLE}, product shot of black merino-blend base layer tee, slim fit, matte technical fabric texture, hanging against pure black background, studio product photography"),
    ("kilt-product-6", f"{BASE_STYLE}, product shot of black technical cargo pants with articulated knees, taped pockets, drawstring cuffs, matte fabric, flat lay against pure black background, studio product photography"),

    # Gallery
    ("kilt-gallery-1", f"{BASE_STYLE}, male model wearing black technical jacket with hood up, face partially shadowed, hands in pockets, three-quarter view, pure black background, moody side lighting"),
    ("kilt-gallery-2", f"{BASE_STYLE}, close-up detail shot of black technical fabric texture, waterproof membrane surface, subtle seam taping, macro product detail, pure black background"),
    ("kilt-gallery-3", f"{BASE_STYLE}, male model from back wearing black technical shell with hood, adjustable straps and MOLLE panel visible, walking away, pure black background, rim lighting from behind"),

    # Lookbook
    ("kilt-look-1", f"{BASE_STYLE}, full body male model in complete techwear kit: black hard shell jacket, tactical vest layered over, cargo pants, combat boots, standing in wide stance, pure black background, dramatic overhead lighting"),
    ("kilt-look-2", f"{BASE_STYLE}, male model crouching down wearing black techwear outfit with hood up and face mask, silver metallic accent on jacket shoulder, pure black background, moody cinematic lighting"),
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
    filename, prompt = item
    try:
        path = generate_image(prompt, filename)
        return (filename, "ok", str(path))
    except Exception as e:
        return (filename, "failed", str(e))


def main():
    print(f"Generating {len(IMAGES)} KILT techwear assets...\n")
    results = []
    with ThreadPoolExecutor(max_workers=2) as executor:
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
