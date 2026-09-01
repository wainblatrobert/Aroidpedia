# -*- coding: utf-8 -*-
"""
Convert plate files to real JPEGs and copy them into docs/diagrams/.

    python scripts/prepare-plates.py

Image generators hand back PNGs even when the file is named .jpg. The four
existing Amorphophallus/Alocasia plates are real JPEGs at 171-509 KB; a PNG of
the same picture runs 2.4-2.5 MB. On a genus page that already loads a hero
video that is worth fixing, and the extension should not lie about the payload.

Re-encodes at quality 90, 4:4:4 chroma (the call-out text is thin dark-green
serif on cream - subsampling smears it), and strips metadata. Idempotent: a
file already stored as JPEG is copied through untouched.
"""
import io, os, shutil, sys
from PIL import Image

SRC = os.environ.get(
    "AROIDPEDIA_PLATES",
    r"G:\My Drive\PlantsV2\Aroidpedia\WEBSITE\Squarespace CSS\GENERA PAGES\Arum")
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DST = os.path.join(REPO, "docs", "diagrams")

PLATES = [
    ("arum-tuber-types.jpg",             1122, 1402),
    ("arum-flowering-modes.jpg",         1448, 1086),
    ("arum-inflorescence-dissection.jpg", 1122, 1402),
    ("arum-infructescence.jpg",          1448, 1086),
]

def main():
    os.makedirs(DST, exist_ok=True)
    missing, done = [], 0
    for name, want_w, want_h in PLATES:
        src = os.path.join(SRC, name)
        if not os.path.exists(src):
            missing.append(name)
            continue

        im = Image.open(src)
        was = im.format
        before = os.path.getsize(src) / 1024.0

        portrait_wanted = want_h > want_w
        portrait_got = im.height > im.width
        note = ""
        if portrait_wanted != portrait_got:
            note = "  !! ORIENTATION LOOKS WRONG (want %dx%d)" % (want_w, want_h)

        out = os.path.join(DST, name)
        if was == "JPEG":
            shutil.copyfile(src, out)
            after = os.path.getsize(out) / 1024.0
        else:
            im.convert("RGB").save(out, "JPEG", quality=90, subsampling=0,
                                   optimize=True, progressive=True)
            after = os.path.getsize(out) / 1024.0

        print("%-38s %4dx%-5d %-4s -> JPEG  %6.0f KB -> %5.0f KB%s"
              % (name, im.width, im.height, was, before, after, note))
        done += 1

    print("\n%d plate(s) prepared -> %s" % (done, DST))
    if missing:
        print("not yet saved:")
        for m in missing:
            print("  . " + m)

if __name__ == "__main__":
    main()
