# -*- coding: utf-8 -*-
"""
Split a 2x2 composite of plate options into four quadrant files.

    python scripts/split-plates.py plates-A.png A
    python scripts/split-plates.py plates-B.png B

Writes A1..A4 (or B1..B4) beside the source, reading-order:
    1 = top-left    2 = top-right
    3 = bottom-left 4 = bottom-right

Quadrants are cropped with a small inward inset so the thin card border and
the gutter between panels do not survive into the cut file.
"""
import os, sys
from PIL import Image

INSET = 0.006          # 0.6% off each edge; kills the border, keeps the art

def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    src, letter = sys.argv[1], sys.argv[2].strip().upper()
    if not os.path.exists(src):
        sys.exit("not found: %s" % src)

    im = Image.open(src).convert("RGB")
    W, H = im.size
    dx, dy = int(W * INSET), int(H * INSET)
    halfw, halfh = W // 2, H // 2

    boxes = {
        1: (dx,           dy,           halfw - dx, halfh - dy),
        2: (halfw + dx,   dy,           W - dx,     halfh - dy),
        3: (dx,           halfh + dy,   halfw - dx, H - dy),
        4: (halfw + dx,   halfh + dy,   W - dx,     H - dy),
    }
    out_dir = os.path.dirname(os.path.abspath(src))
    for n, box in boxes.items():
        q = im.crop(box)
        path = os.path.join(out_dir, "%s%d.png" % (letter, n))
        q.save(path)
        print("%-8s %4d x %4d  ->  %s" % ("%s%d" % (letter, n), q.width, q.height, path))
    print("\nsource %d x %d, quadrants inset %d/%dpx" % (W, H, dx, dy))


if __name__ == "__main__":
    main()
