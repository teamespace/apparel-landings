#!/usr/bin/env python3
"""
Generate the two extra VOX product images (4:5 / 1024x1280) using gpt-image-2.
Usage: python generate-vox-products-extra.py <filename> "<prompt>"
"""
import os
import sys
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

OUT_DIR = Path(__file__).parent / "generated-assets" / "vox"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def generate_image(filename: str, prompt: str, size: str = "1024x1280") -> Path:
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


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit("Usage: python generate-vox-products-extra.py <filename> '<prompt>'")
    filename = sys.argv[1]
    prompt = sys.argv[2]
    out = generate_image(filename, prompt)
    print(f"Saved: {out}")
