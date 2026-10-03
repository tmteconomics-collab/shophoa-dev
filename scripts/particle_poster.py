"""Render the static particle portraits used when WebGL is off.

The live hero draws the portrait as particles (src/stage). Visitors with reduced
motion, no WebGL or a low-power device get this pre-rendered still instead, made
with the same sampling and colour grade, so the site never shows the soft photo.
It also feeds the blur-up posters and the Open Graph image.

Writes public/portrait/particles-{desktop,mobile}.webp and poster-{desktop,mobile}.webp.
Usage: pip install pillow numpy && python3 scripts/particle_poster.py
"""
import json

import numpy as np
from PIL import Image, ImageDraw

cfg = json.load(open("character.config.json"))
NIGHT = np.array([7, 11, 58], np.float32) / 255
COUNT = {"desktop": 150_000, "mobile": 120_000}
SS = 2  # supersampling for smooth dot edges
rng = np.random.default_rng(20260415)


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


for v in ["desktop", "mobile"]:
    var = cfg["variants"][v]
    crop = var["cropPx"]
    W, H = crop["w"], crop["h"]
    photo = np.asarray(Image.open(var["image"]).convert("RGB")).astype(np.float32) / 255
    dm = Image.open(var["depth"]).convert("RGB").resize((W, H), Image.BILINEAR)
    mask = np.asarray(dm).astype(np.float32)[..., 1] / 255

    fb = cfg["faceBoxPx"]
    face = (
        (fb["x"] + fb["w"] / 2 - crop["x"]) / W,
        (fb["hairTopY"] + (fb["y"] + fb["h"] - fb["hairTopY"]) / 2 - crop["y"]) / H,
        fb["w"] * 0.62 / W,
        (fb["y"] + fb["h"] - fb["hairTopY"]) * 0.58 / H,
    )
    eyes = [var["landmarks"]["leftEye"], var["landmarks"]["rightEye"]]
    erx, ery = var["eyeRadius"]

    # Same weights as fillPortrait in src/stage/shapes.ts.
    n = COUNT[v]
    us, vs, ws = [], [], []
    while sum(len(a) for a in us) < n:
        u = rng.random(n * 4)
        q = rng.random(n * 4)
        px = np.minimum(W - 1, (u * W).astype(int))
        py = np.minimum(H - 1, (q * H).astype(int))
        m = mask[py, px]
        in_face = (((u - face[0]) / face[2]) ** 2 + ((q - face[1]) / face[3]) ** 2 < 1).astype(np.float32)
        near_eye = np.zeros_like(u)
        for ex, ey in eyes:
            near_eye = np.maximum(
                near_eye, (((u - ex) / (erx * 2.2)) ** 2 + ((q - ey) / (ery * 3.2)) ** 2 < 1).astype(np.float32)
            )
        w = 0.28 + 0.92 * m + 1.6 * in_face + 2.5 * near_eye
        keep = rng.random(len(u)) * 5.3 < w
        us.append(u[keep])
        vs.append(q[keep])
        ws.append(w[keep])
    u = np.concatenate(us)[:n]
    q = np.concatenate(vs)[:n]
    w = np.concatenate(ws)[:n]

    # Same colour grade as the particle shader (src/stage/particles.ts).
    size_factor = np.minimum(2.2, np.sqrt(1 / w))
    bg = smoothstep(1.05, 1.75, size_factor)
    col = photo[np.minimum(H - 1, (q * H).astype(int)), np.minimum(W - 1, (u * W).astype(int))]
    lum = (col * [0.299, 0.587, 0.114]).sum(1, keepdims=True)
    graded = lum * [0.24, 0.28, 0.66] + [0.01, 0.02, 0.07]
    col = col + (graded - col) * (bg[:, None] * 0.9)
    col = np.maximum(col, np.array([0.07, 0.09, 0.26]) * (1 - bg[:, None] * 0.5)) * 1.05
    alpha = 0.95 * (1 - 0.55 * bg)
    col = NIGHT + (col - NIGHT) * alpha[:, None]
    rgb = (np.clip(col, 0, 1) * 255).astype(np.uint8)

    base = np.sqrt(W * H / n)
    diam = base * np.clip(size_factor, 0.75, 1.55) * 1.6 * 0.8 * SS
    img = Image.new("RGB", (W * SS, H * SS), tuple(int(c * 255) for c in NIGHT))
    d = ImageDraw.Draw(img)
    xs = u * W * SS
    ys = q * H * SS
    for i in rng.permutation(n):
        r = diam[i] / 2
        d.ellipse((xs[i] - r, ys[i] - r, xs[i] + r, ys[i] + r), fill=tuple(rgb[i]))
    img = img.resize((W, H), Image.LANCZOS)
    img.save(f"public/portrait/particles-{v}.webp", quality=72, method=6)
    tiny = (48, 32) if v == "desktop" else (40, 50)
    img.resize(tiny, Image.LANCZOS).save(f"public/portrait/poster-{v}.webp", quality=60)
    print("wrote", v, W, H, n)
