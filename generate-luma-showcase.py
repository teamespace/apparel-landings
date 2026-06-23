#!/usr/bin/env python3
"""
Generate LUMA showcase product images using OpenAI GPT-Image-2.
Clean studio e-commerce style: neutral light gray background, soft even lighting,
minimal shadow, high-end fashion catalog photography.
"""
import os
import base64
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

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
    "Clean high-end fashion e-commerce photography, neutral light gray studio backdrop, "
    "soft even diffused lighting, minimal shadow, crisp fabric detail, "
    "premium apparel campaign, centered composition, portrait orientation"
)

IMAGES = [
    ("luma-showcase-1", f"{BASE_STYLE}, male model wearing a cream cable-knit cotton tennis sweater over a white collared polo shirt, navy tailored shorts, full body standing pose, country club preppy look", "1024x1536"),
    ("luma-showcase-2", f"{BASE_STYLE}, female model wearing high-waisted ivory pleated linen trousers with a tucked-in cream knit top, belted waist, full body standing pose, relaxed elegant summer tailoring", "1024x1536"),
    ("luma-showcase-3", f"{BASE_STYLE}, male model wearing an ivory cable-knit sweater vest layered over a navy long-sleeve polo shirt, cream trousers, full body standing pose, vintage tennis club style", "1024x1536"),
    ("luma-showcase-4", f"{BASE_STYLE}, neatly folded navy silk bandana with cream geometric border print, placed on light gray surface, luxury accessory product shot, top-down angle", "1024x1536"),
    ("luma-showcase-5", f"{BASE_STYLE}, male model wearing a cream relaxed knit polo shirt with an open collar, ivory tailored shorts, full body standing pose, effortless summer resort look", "1024x1536"),
    ("luma-showcase-6", f"{BASE_STYLE}, female model wearing an oversized sage green vintage cardigan over an ivory slip dress, full body standing pose, soft cozy country club layering", "1024x1536"),
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
    out_path = OUT_DIR / f"{filename}.png"
    if out_path.exists():
        return (filename, "ok", f"skipped (exists): {out_path}")
    try:
        path = generate_image(prompt, filename, size)
        return (filename, "ok", str(path))
    except Exception as e:
        return (filename, "failed", str(e))


def main():
    print(f"Generating {len(IMAGES)} LUMA showcase assets...\n")
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
