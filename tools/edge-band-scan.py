# -*- coding: utf-8 -*-
"""Scan every morphology figure for a baked-in white edge band.

leaf-costae.jpg shipped with a 26px white band across the top and a 10px
band down the right edge - an export artifact, invisible in a downscaled
preview and obvious on the page against the dark ground. If one export did
it, others may have. This finds them all before anything is fixed.

A band counts only if the edge rows/cols are >=90% near-white, which is the
signature of a border rather than of bright content reaching the edge.
"""
import os, glob
from PIL import Image

ROOT = "C:/Users/nli0490/Claude/Aroidpedia/docs"
DIRS = ["alocasia-morphology", "anthurium-morphology", "monstera-morphology",
        "philodendron-morphology", "aroid-morphology", "diagrams"]
THRESH, FRAC = 200, 0.90


def band(im, side):
    w, h = im.size
    px = im.load()

    def white_row(y):
        n = sum(1 for x in range(0, w, 3) if min(px[x, y]) > THRESH)
        return n / len(range(0, w, 3))

    def white_col(x):
        n = sum(1 for y in range(0, h, 3) if min(px[x, y]) > THRESH)
        return n / len(range(0, h, 3))

    k = 0
    if side == "top":
        while k < h // 4 and white_row(k) >= FRAC: k += 1
    elif side == "bottom":
        while k < h // 4 and white_row(h - 1 - k) >= FRAC: k += 1
    elif side == "left":
        while k < w // 4 and white_col(k) >= FRAC: k += 1
    else:
        while k < w // 4 and white_col(w - 1 - k) >= FRAC: k += 1
    return k


rows = []
for d in DIRS:
    p = os.path.join(ROOT, d)
    if not os.path.isdir(p):
        continue
    for f in sorted(glob.glob(p + "/*.jpg") + glob.glob(p + "/*.jpeg") +
                    glob.glob(p + "/*.png") + glob.glob(p + "/*.webp")):
        try:
            im = Image.open(f).convert("RGB")
        except Exception as e:
            print("  !! %s: %s" % (os.path.basename(f), e)); continue
        b = {s: band(im, s) for s in ("top", "bottom", "left", "right")}
        if any(b.values()):
            rows.append((d, os.path.basename(f), im.size, b))

if not rows:
    print("no white edge bands found")
else:
    print("%-24s %-34s %-11s %s" % ("folder", "file", "size", "band px (t/b/l/r)"))
    print("-" * 92)
    for d, f, sz, b in rows:
        print("%-24s %-34s %-11s t%-4d b%-4d l%-4d r%-4d"
              % (d, f, "%dx%d" % sz, b["top"], b["bottom"], b["left"], b["right"]))
print("\n%d file(s) affected" % len(rows))
