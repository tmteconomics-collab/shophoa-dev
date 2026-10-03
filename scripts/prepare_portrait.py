"""Rebuild the packed depth + mask textures used by the stage.

Reads the first-pass depth maps and the subject mask in assets/portrait/ and
writes public/portrait/depthmask-{desktop,mobile}.png (R = depth, G = mask).

What it fixes: the first-pass depth maps have a hard step across the chest
(shoulders stepped back) and a hard vertical seam on the right leg. Both tear
the photo at strong parallax. Outside the head, the depth is blurred; the face
ellipsoid is kept as it was.

Usage: pip install pillow numpy && python3 scripts/prepare_portrait.py
"""
import json

import numpy as np
from PIL import Image, ImageFilter

cfg = json.load(open("character.config.json"))
mask = Image.open("assets/portrait/subject-mask.png")  # source coords, half resolution
fc = cfg["sourceLandmarksPx"]["faceCenter"]
fb = cfg["faceBoxPx"]

for v in ["desktop", "mobile"]:
    c = cfg["variants"][v]["cropPx"]
    d = Image.open(f"assets/portrait/depth-{v}.png")
    W, H = d.size
    a = np.asarray(d).astype(np.float32) / 255
    b = np.asarray(d.filter(ImageFilter.GaussianBlur(14))).astype(np.float32) / 255

    yy, xx = np.mgrid[0:H, 0:W]
    cx = (fc[0] - c["x"]) / 2
    rx = fb["w"] * 0.62 / 2
    ry = (fb["y"] + fb["h"] - fb["hairTopY"]) * 0.62 / 2
    cy = ((fb["hairTopY"] + fb["y"] + fb["h"]) / 2 - c["y"]) / 2
    e = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    w = np.clip((1.6 - e) / 0.8, 0, 1)  # 1 on the head, fading out
    depth = a * w + b * (1 - w)

    m = mask.crop((c["x"] // 2, c["y"] // 2, c["x"] // 2 + W, c["y"] // 2 + H))
    m = np.asarray(m).astype(np.float32) / 255

    rgb = np.zeros((H, W, 3), np.uint8)
    rgb[..., 0] = np.clip(depth * 255 + 0.5, 0, 255).astype(np.uint8)
    rgb[..., 1] = np.clip(m * 255 + 0.5, 0, 255).astype(np.uint8)
    Image.fromarray(rgb).save(f"public/portrait/depthmask-{v}.png", optimize=True)
    print("wrote", v, W, H)
