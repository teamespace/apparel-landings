#!/usr/bin/env python3
"""Remove near-white/clean-studio backgrounds from model images and save as PNG."""
from PIL import Image
from pathlib import Path
import numpy as np

ASSETS = Path(__file__).parent / "05-elan-moody" / "assets"
MODELS = [f"elan-model-{i:02d}.jpg" for i in range(1, 9)]

TOLERANCE = 32  # color distance tolerance


def remove_bg(path: Path) -> Path:
    img = Image.open(path).convert("RGBA")
    data = np.array(img)
    r, g, b, a = data.T

    # Sample background color from the 4 corners (average)
    corners = [
        data[0, 0, :3],
        data[0, -1, :3],
        data[-1, 0, :3],
        data[-1, -1, :3],
    ]
    bg = np.mean(corners, axis=0)

    # Compute Euclidean distance to background color
    diff = np.sqrt(np.sum((data[:, :, :3].astype(float) - bg) ** 2, axis=2))

    # Pixels close to background become transparent
    mask = diff < TOLERANCE
    data[mask] = [255, 255, 255, 0]

    out = Image.fromarray(data)
    out_path = path.with_suffix(".png")
    out.save(out_path)
    print(f"  -> {out_path}")
    return out_path


def main():
    print("Removing backgrounds from model images...\n")
    for fn in MODELS:
        path = ASSETS / fn
        if path.exists():
            remove_bg(path)
        else:
            print(f"  MISSING: {path}")
    print("\nDone.")


if __name__ == "__main__":
    main()
