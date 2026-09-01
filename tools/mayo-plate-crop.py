# -*- coding: utf-8 -*-
"""Crop a Mayo plate: whole plate + printed caption, running foot dropped,
scan gutter ignored. Everything is done in PAGE POINTS, so the only mapping
is MuPDF's own render scale.

Calibrated against Plate 1, whose published figure is on disk at 1200x1699.
"""
import fitz, numpy as np, os, sys
from PIL import Image

PDF = "G:/My Drive/PlantsV2/Aroidpedia/LITERATURE/Mayo et al 1997 ARACEAE.pdf"
SP = "C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/f35a1d61-1b66-4fc0-be7b-d93b45b553e9/scratchpad/"
doc = fitz.open(PDF)
GUT = 0.030          # ignore this fraction at each edge: scan gutter, not content
INK = 190

def probe(pno, verbose=False):
    pg = doc[pno]
    R = pg.rect
    S = 150 / 72.0                                   # cheap probe render
    pm = pg.get_pixmap(matrix=fitz.Matrix(S, S), colorspace=fitz.csGRAY)
    a = np.frombuffer(pm.samples, dtype=np.uint8).reshape(pm.height, pm.width)
    H, W = a.shape

    cap = [b for b in pg.get_text("blocks") if b[4].strip().startswith("Plate ")]
    if not cap:
        print("  p%d: no caption block" % pno); return None
    cap_y1 = max(b[3] for b in cap)                  # page pt
    cap_x0 = min(b[0] for b in cap)
    cap_x1 = max(b[2] for b in cap)
    cut = int((cap_y1 - R.y0) * S) + 6               # px, just under the caption

    gx, gy = int(W * GUT), int(H * GUT)
    win = (a[gy:min(cut, H - gy), gx:W - gx] < INK)
    rows, cols = win.sum(1), win.sum(0)
    tr = max(4, int(win.shape[1] * 0.004))
    tc = max(4, int(win.shape[0] * 0.004))
    nr = np.nonzero(rows >= tr)[0]
    nc = np.nonzero(cols >= tc)[0]
    # back to page points, with a small breathing margin
    m = 8
    x0 = R.x0 + (gx + nc[0]) / S - m
    x1 = R.x0 + (gx + nc[-1]) / S + m
    y0 = R.y0 + (gy + nr[0]) / S - m
    y1 = cap_y1 + m
    # the caption defines the column: never crop inside it
    x0, x1 = min(x0, cap_x0 - m), max(x1, cap_x1 + m)
    box = fitz.Rect(max(R.x0, x0), max(R.y0, y0), min(R.x1, x1), min(R.y1, y1))
    if verbose:
        print("     caption y1=%.1f  box=%.0f,%.0f,%.0f,%.0f pt" % (cap_y1, box.x0, box.y0, box.x1, box.y1))
    return box

def build(pno, out_name, ref=None):
    box = probe(pno, verbose=True)
    ratio = box.height / box.width
    line = "  p%d: crop %.0fx%.0f pt  ratio %.4f" % (pno, box.width, box.height, ratio)
    if ref:
        r = Image.open(ref)
        line += "   published ratio %.4f   DELTA %.4f" % (r.size[1] / r.size[0],
                                                          abs(ratio - r.size[1] / r.size[0]))
    print(line)
    S = 1200.0 / box.width                            # exactly 1200 px wide
    pm = doc[pno].get_pixmap(matrix=fitz.Matrix(S, S), clip=box, colorspace=fitz.csGRAY)
    im = Image.frombytes("L", (pm.width, pm.height), pm.samples)
    f = np.asarray(im).astype(np.float32)
    lo, hi = np.percentile(f, 0.4), np.percentile(f, 99.5)
    f = np.clip((f - lo) * (255.0 / max(1.0, hi - lo)), 0, 255)
    out = Image.fromarray(f.astype(np.uint8)).convert("RGB")
    p = SP + out_name
    out.save(p, "JPEG", quality=90, progressive=True, optimize=True)
    print("     wrote %s  %dx%d  %.0f KB" % (out_name, out.size[0], out.size[1], os.path.getsize(p) / 1024))

print("CALIBRATION - Plate 1:")
build(101, "cal-plate1.jpg", "C:/Users/nli0490/Claude/Aroidpedia/docs/aroid-morphology/fig-mayo-gymnostachys.jpg")
print("\nTHE TWO NEW PLATES:")
build(133, "fig-mayo-monstera-venation.jpg")
build(233, "fig-mayo-aglaonema-venation.jpg")
doc.close()
