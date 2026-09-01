# -*- coding: utf-8 -*-
"""Copy the 13 never-published guide photographs into the repo.

Five guides from the 8.19-8.21 batch reference photographs that were
finished, dropped in a PHOTOS/ folder, and never copied into docs/ - so
every one of those pages has been showing a broken image with nothing to
warn anybody.

⚠ THE HOST FOLDER KEEPS THE OLD "-pollination" SPELLING. The pages were
renamed to /<genus>-reproduction on 8.20.26 but the image paths were ruled
to stay put, so the destination is docs/dieffenbachia-pollination/ and not
-reproduction. Copying to the new spelling would leave the pages just as
broken.

Verifies each copy byte-for-byte before reporting it.
"""
import os, shutil, sys, io, hashlib

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
APPLY = "--apply" in sys.argv

WEB = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID REPRODUCTION"
DOCS = "C:/Users/nli0490/Claude/Aroidpedia/docs"

JOBS = [
 ("DIEFFENBACHIA REPRODUCTION", "dieffenbachia-pollination", ["seguine-foliage.jpg"]),
 ("DRACUNCULUS REPRODUCTION", "dracunculus-pollination",
  ["whole-plant-maroon.jpg", "wild-cream-form.jpg"]),
 ("HELICODICEROS REPRODUCTION", "helicodiceros-pollination",
  ["inflorescence-open-and-bud.jpg", "infructescence.jpg", "spathe-from-above.jpg"]),
 ("HOMALOMENA REPRODUCTION", "homalomena-pollination",
  ["borneensis-spadix.jpg", "debilicrista-plate.jpg", "pendula-voucher.jpg",
   "punctulata-unopened.jpg", "rostrata-type-sheet.jpg",
   "velutipedunculata-beetles.jpg"]),
 ("SCHISMATOGLOTTIS REPRODUCTION", "schismatoglottis-pollination",
  ["wallichii-inflorescences.jpg"]),
]

md5 = lambda p: hashlib.md5(open(p, "rb").read()).hexdigest()
n_ok = n_bad = 0
total = 0
for folder, dest, files in JOBS:
    dd = os.path.join(DOCS, dest)
    print("\n%s  ->  docs/%s/" % (folder, dest))
    if APPLY:
        os.makedirs(dd, exist_ok=True)
    for fn in files:
        src = os.path.join(WEB, folder, "PHOTOS", fn)
        dst = os.path.join(dd, fn)
        if not os.path.exists(src):
            print("   !! SOURCE MISSING  %s" % fn); n_bad += 1; continue
        mb = os.path.getsize(src) / 1e6
        total += os.path.getsize(src)
        if not APPLY:
            print("   would copy  %-34s %5.2f MB" % (fn, mb)); n_ok += 1; continue
        shutil.copy2(src, dst)
        if md5(src) == md5(dst):
            print("   copied      %-34s %5.2f MB  verified" % (fn, mb)); n_ok += 1
        else:
            print("   !! COPY MISMATCH %s" % fn); n_bad += 1

print("\n%d file(s), %.1f MB total   [%s]"
      % (n_ok, total / 1e6, "APPLIED" if APPLY else "DRY RUN"))
if n_bad:
    print("%d PROBLEM(S)" % n_bad)
