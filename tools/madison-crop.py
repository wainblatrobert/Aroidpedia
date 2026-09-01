# -*- coding: utf-8 -*-
"""Crop figure pages out of Madison 1977 the same way the Mayo plates were
cropped: figure + its printed caption, running head dropped, scan gutter
ignored, 1200px wide, greyscale, levels, q90 progressive.

Madison differs from Mayo in two ways and both are handled here: the caption
begins 'FIG'/'FIGs' rather than 'Plate', and the running head is at the TOP
of the page rather than the foot.
"""
import fitz, numpy as np, os, sys, re
from PIL import Image

PDF = "G:/My Drive/PlantsV2/Aroidpedia/LITERATURE/Gibernau/1979/Monstera revision - Madison 1977.pdf"
SP = "C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/f35a1d61-1b66-4fc0-be7b-d93b45b553e9/scratchpad/"
doc = fitz.open(PDF)
GUT, INK = 0.035, 190
HEAD = re.compile(r"REVISION OF MONSTERA|MICHAEL MADISON", re.I)
CAP  = re.compile(r"^\s*FIG", re.I)

def crop_box(pno):
    pg = doc[pno]; R = pg.rect
    S = 150 / 72.0
    pm = pg.get_pixmap(matrix=fitz.Matrix(S, S), colorspace=fitz.csGRAY)
    a = np.frombuffer(pm.samples, dtype=np.uint8).reshape(pm.height, pm.width)
    H, W = a.shape

    blocks = pg.get_text("blocks")
    cap_y1 = cap_x0 = cap_x1 = None
    for b in blocks:
        if CAP.match(b[4] or ""):
            cap_y1 = max(cap_y1 or 0, b[3])
            cap_x0 = b[0] if cap_x0 is None else min(cap_x0, b[0])
            cap_x1 = b[2] if cap_x1 is None else max(cap_x1, b[2])
    head_y1 = R.y0
    for b in blocks:
        if HEAD.search(b[4] or "") and (b[3] - R.y0) < R.height * 0.14:
            head_y1 = max(head_y1, b[3])
    if cap_y1 is None:                       # figure page with no text caption
        cap_y1 = R.y1 - R.height * 0.04

    top_px = int((head_y1 - R.y0) * S) + 4
    bot_px = min(H, int((cap_y1 - R.y0) * S) + 6)
    gx = int(W * GUT)
    win = (a[top_px:bot_px, gx:W - gx] < INK)
    rows, cols = win.sum(1), win.sum(0)
    tr = max(4, int(win.shape[1] * 0.004)); tc = max(4, int(win.shape[0] * 0.004))
    nr = np.nonzero(rows >= tr)[0]; nc = np.nonzero(cols >= tc)[0]
    if not len(nr) or not len(nc): return None
    m = 9
    x0 = R.x0 + (gx + nc[0]) / S - m
    x1 = R.x0 + (gx + nc[-1]) / S + m
    y0 = R.y0 + (top_px + nr[0]) / S - m
    y1 = cap_y1 + m
    if cap_x0 is not None:
        x0, x1 = min(x0, cap_x0 - m), max(x1, cap_x1 + m)
    return fitz.Rect(max(R.x0, x0), max(R.y0, y0), min(R.x1, x1), min(R.y1, y1))

def build(pno, out):
    box = crop_box(pno)
    if box is None: print("  p%d FAILED" % pno); return
    S = 1200.0 / box.width
    pm = doc[pno].get_pixmap(matrix=fitz.Matrix(S, S), clip=box, colorspace=fitz.csGRAY)
    im = Image.frombytes("L", (pm.width, pm.height), pm.samples)
    f = np.asarray(im).astype(np.float32)
    lo, hi = np.percentile(f, 0.5), np.percentile(f, 99.5)
    f = np.clip((f - lo) * (255.0 / max(1.0, hi - lo)), 0, 255)
    rgb = Image.fromarray(f.astype(np.uint8)).convert("RGB")
    if rgb.size[0] != 1200:
        rgb = rgb.resize((1200, round(rgb.size[1] * 1200 / rgb.size[0])), Image.LANCZOS)
    p = SP + out
    rgb.save(p, "JPEG", quality=90, progressive=True, optimize=True)
    print("  p%-4d %-40s %dx%d  %.0f KB" % (pno, out, rgb.size[0], rgb.size[1],
                                            os.path.getsize(p) / 1024))

JOBS = [
    (22, "fig-madison-shoot-architectures.jpg"),   # FIGs 26-32, the spine
    (11, "fig-madison-adult-leaves.jpg"),          # FIGs 2-23, 22 spp to scale
    (49, "fig-madison-siltepecana-variation.jpg"), # FIG 37
    (68, "fig-madison-obliqua-variation.jpg"),     # FIG 48
    (94, "fig-madison-deliciosa-variation.jpg"),   # FIG 67
]
for pno, out in JOBS:
    build(pno, out)
doc.close()
