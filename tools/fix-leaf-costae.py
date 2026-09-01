# -*- coding: utf-8 -*-
"""Remove the white export band from leaf-costae.jpg.

The file ships with a 26px pure-white band across the top and a 10px band
down the right edge. Its pair, leaf-lobes.jpg, is clean black on all four
edges - same shoot, same treatment - so this is an export slip, not the
photograph. On the page the two sit side by side inside `.apol-photo`,
whose ground is #050806, so the band reads as a white L around one panel.

FILL, DO NOT CROP. Cropping would make it 1190x1574 while its pair stays
1200x1600, so the two would render at different sizes and the declared
width/height attributes in the block would become false. Filling keeps the
geometry and the attributes honest.

Both bands are 100% near-white across their whole extent, so nothing is
lost by painting them: there is no image content inside them to destroy.
"""
import os, shutil
from PIL import Image

P = "C:/Users/nli0490/Claude/Aroidpedia/docs/alocasia-morphology/leaf-costae.jpg"
TOP, RIGHT = 26, 10
THRESH = 200

im = Image.open(P)
orig_fmt = im.format
qtables = getattr(im, "quantization", None)
subsampling = None
try:
    from PIL import JpegImagePlugin
    subsampling = JpegImagePlugin.get_sampling(im)
except Exception:
    pass
print("original: %s %dx%d  subsampling=%s  %d bytes"
      % (orig_fmt, im.width, im.height, subsampling, os.path.getsize(P)))

im = im.convert("RGB")
w, h = im.size
px = im.load()

# ---- refuse if the bands are not actually blank ------------------------
def blank(pixels):
    return all(min(p) > THRESH for p in pixels)

top_px = [px[x, y] for y in range(TOP) for x in range(0, w, 3)]
right_px = [px[x, y] for x in range(w - RIGHT, w) for y in range(0, h, 3)]
if not blank(top_px) or not blank(right_px):
    raise SystemExit("ABORT: a band contains non-white pixels - it is not a border")
print("both bands verified 100%% white (%d + %d sampled px)" % (len(top_px), len(right_px)))

# ---- what colour is the real background right beside them? ------------
near = [px[x, y] for y in range(TOP + 2, TOP + 30) for x in range(0, w, 7)]
near = [p for p in near if max(p) < 40]
fill = tuple(sorted(c)[len(c) // 2] for c in zip(*near)) if near else (0, 0, 0)
print("fill colour sampled from the adjacent ground: %s" % (fill,))

for y in range(TOP):
    for x in range(w):
        px[x, y] = fill
for x in range(w - RIGHT, w):
    for y in range(h):
        px[x, y] = fill

save = dict(format="JPEG", quality=95, optimize=True, progressive=True)
if subsampling is not None:
    save["subsampling"] = subsampling
im.save(P, **save)
print("saved: %d bytes" % os.path.getsize(P))

# ---- verify ------------------------------------------------------------
im2 = Image.open(P).convert("RGB")
p2 = im2.load()
w2, h2 = im2.size


def wr(y): return sum(1 for x in range(0, w2, 3) if min(p2[x, y]) > THRESH) / len(range(0, w2, 3))
def wc(x): return sum(1 for y in range(0, h2, 3) if min(p2[x, y]) > THRESH) / len(range(0, h2, 3))


t = 0
while t < h2 // 4 and wr(t) >= 0.9: t += 1
r = 0
while r < w2 // 4 and wc(w2 - 1 - r) >= 0.9: r += 1
b = 0
while b < h2 // 4 and wr(h2 - 1 - b) >= 0.9: b += 1
l = 0
while l < w2 // 4 and wc(l) >= 0.9: l += 1
print("after: %dx%d  bands t%d b%d l%d r%d  %s"
      % (w2, h2, t, b, l, r, "CLEAN" if not (t or b or l or r) else "*** STILL BANDED ***"))
print("dimensions preserved:", (w2, h2) == (1200, 1600))
