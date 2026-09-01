# -*- coding: utf-8 -*-
"""Which images with a white edge band are PHOTOGRAPHS, not scanned plates?

The raw edge scan over-reports badly. Most morphology figures are scans of
printed plates - Hay, Mayo, Croat, Madison - and a white margin on those is
the PAPER. They render inside `.apol-fig`, whose wrapper sets a cream
background and `mix-blend-mode: multiply` for exactly that reason.

A white band is only a defect on the Nadine Hafke photographs, which are
shot on black and render inside `.apol-photo` on the dark page ground.
So: read the blocks, work out which wrapper each src is used in, and only
report bands on the `.apol-photo` ones.
"""
import os, re, glob
from PIL import Image

BLOCKS = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID MORPHOLOGY"
DOCS = "C:/Users/nli0490/Claude/Aroidpedia/docs"
THRESH, FRAC = 200, 0.90

# ---- which src sits inside which wrapper ------------------------------
photo, fig = set(), set()
for path in glob.glob(BLOCKS + "/**/*.txt", recursive=True):
    if os.sep + "Backup" + os.sep in path:
        continue
    s = open(path, encoding="utf-8", errors="replace").read()
    s = re.sub(r"(?s)<!--.*?-->", "", s)           # rendered markup only
    for m in re.finditer(r'(?is)<figure class="apol-(photo|fig)"(.*?)</figure>', s):
        kind, body = m.group(1), m.group(2)
        for src in re.findall(r'<img[^>]*src="([^"]+)"', body):
            (photo if kind == "photo" else fig).add(src.rsplit("/", 1)[-1])

both = photo & fig
print("images used as .apol-photo : %d" % len(photo))
print("images used as .apol-fig   : %d" % len(fig))
if both:
    print("!! used BOTH ways: %s" % sorted(both))
print()


def bands(f):
    im = Image.open(f).convert("RGB")
    w, h = im.size
    px = im.load()
    wr = lambda y: sum(1 for x in range(0, w, 3) if min(px[x, y]) > THRESH) / len(range(0, w, 3))
    wc = lambda x: sum(1 for y in range(0, h, 3) if min(px[x, y]) > THRESH) / len(range(0, h, 3))
    b = {}
    k = 0
    while k < h // 4 and wr(k) >= FRAC: k += 1
    b["top"] = k
    k = 0
    while k < h // 4 and wr(h - 1 - k) >= FRAC: k += 1
    b["bottom"] = k
    k = 0
    while k < w // 4 and wc(k) >= FRAC: k += 1
    b["left"] = k
    k = 0
    while k < w // 4 and wc(w - 1 - k) >= FRAC: k += 1
    b["right"] = k
    return im.size, b


print("=== PHOTOGRAPHS (.apol-photo) WITH A WHITE EDGE BAND ===")
hits = 0
for name in sorted(photo):
    cand = glob.glob(DOCS + "/*/" + name)
    if not cand:
        print("   %-34s FILE NOT FOUND locally" % name); continue
    sz, b = bands(cand[0])
    if any(b.values()):
        hits += 1
        print("   %-34s %-11s t%-4d b%-4d l%-4d r%-4d   <-- DEFECT"
              % (name, "%dx%d" % sz, b["top"], b["bottom"], b["left"], b["right"]))
print("   (%d of %d photographs affected)" % (hits, len(photo)))
