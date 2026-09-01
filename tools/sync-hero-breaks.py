# -*- coding: utf-8 -*-
"""Copy the user's hand-inserted hero line breaks from the live site to disk.

Three hero titles carry a <br> on the site that the source file lacks:
Arum, Dieffenbachia and Dracunculus. Everything else already matches.

SURGICAL, NOT WHOLESALE. Only the <br> is inserted, at the position the
live title puts it. The block's own formatting, comments and entities are
untouched.

⚠ THE LIVE MARKUP IS NOT CLEAN AND MUST NOT BE COPIED VERBATIM. The Arum
title comes back from Squarespace as

    THE <span class="apar-accent">ARUM</span><br> INFLORESCENCE</br>

with a stray closing </br> the editor added. `<br>` is void - there is no
closing form - so copying that would put invalid markup into the source.
The insertion below writes `<br>` only.
"""
import os, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
APPLY = "--apply" in sys.argv
R = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID REPRODUCTION/"

JOBS = [
 # (file, exact text on disk, replacement, what the break does)
 (R + "ARUM REPRODUCTION/ARUM POLLINATION \u2014 00 HERO 8.11.26 v2.txt",
  '<span class="apar-accent">ARUM</span> INFLORESCENCE',
  '<span class="apar-accent">ARUM</span><br> INFLORESCENCE',
  "breaks after ARUM, so INFLORESCENCE drops to line two"),

 (R + "DIEFFENBACHIA REPRODUCTION/DIEFFENBACHIA POLLINATION \u2014 00 HERO 8.19.26 v1.txt",
  'THE <span class="apdi-accent">DUMB CANE</span>',
  'THE <br> <span class="apdi-accent">DUMB CANE</span>',
  "breaks after THE, so DUMB CANE drops to line two"),

 (R + "DRACUNCULUS REPRODUCTION/DRACUNCULUS POLLINATION \u2014 00 HERO 8.19.26 v1.txt",
  'THE <span class="apdr-accent">DRAGON ARUM</span>',
  'THE <br> <span class="apdr-accent">DRAGON ARUM</span>',
  "breaks after THE, so DRAGON ARUM drops to line two"),
]

ok = fail = 0
for path, old, new, why in JOBS:
    if not os.path.exists(path):
        import glob
        cand = glob.glob(os.path.dirname(path) + "/*HERO*.txt")
        cand = [c for c in cand if "Backup" not in c]
        if len(cand) == 1:
            path = cand[0]
        else:
            print("  !! not found: %s" % os.path.basename(path)); fail += 1; continue
    s = open(path, encoding="utf-8", newline="").read()
    if new in s:
        print("  already synced: %s" % os.path.basename(path)[:44]); continue
    n = s.count(old)
    if n != 1:
        print("  !! %s: anchor found %d times" % (os.path.basename(path)[:44], n))
        fail += 1; continue
    print("  ok  %-46s %s" % (os.path.basename(path)[:46], why))
    ok += 1
    if APPLY:
        open(path, "w", encoding="utf-8", newline="").write(s.replace(old, new, 1))

print("\n%d synced, %d problem(s)   [%s]"
      % (ok, fail, "APPLIED" if APPLY else "DRY RUN"))

if APPLY:
    print("\nverify:")
    for path, old, new, why in JOBS:
        import glob
        cand = [c for c in glob.glob(os.path.dirname(path) + "/*HERO*.txt") if "Backup" not in c]
        p = cand[0] if cand else path
        b = re.sub(r"(?s)<!--.*?-->", "", open(p, encoding="utf-8").read())
        m = re.search(r'(?is)<h1[^>]*class="[^"]*title[^"]*"[^>]*>(.*?)</h1>', b)
        t = re.sub(r"\s+", " ", m.group(1)).strip() if m else "(no h1)"
        closing = "</br>" in b
        print("   %-30s %s" % (os.path.basename(os.path.dirname(p))[:30], t[:74]))
        if closing:
            print("      !! stray </br> present")
