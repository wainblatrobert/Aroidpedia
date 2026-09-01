# -*- coding: utf-8 -*-
"""Which images referenced by the guide blocks are NOT in the repo?

A block can reference a perfectly good photograph that was never copied out
of its PHOTOS/ folder and pushed - the page then shows a broken image and
nothing warns anybody. Dieffenbachia and Dracunculus both turned out to be
in that state, so check every guide rather than fix them one at a time.

Also locates the missing file in the authoring tree, so the fix is a copy
rather than a hunt.
"""
import os, re, glob, sys, io, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

WEB = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"
DOCS = "C:/Users/nli0490/Claude/Aroidpedia/docs"
HOST = "https://wainblatrobert.github.io/Aroidpedia/"

# every image file anywhere in the authoring tree, by basename
onhand = collections.defaultdict(list)
for root, dirs, files in os.walk(WEB):
    if os.sep + "Backup" in root or "_SPELLING BACKUP" in root:
        continue
    for fn in files:
        if fn.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".gif")):
            onhand[fn].append(os.path.join(root, fn))

refs = collections.defaultdict(set)      # folder -> set of (file, blockpath)
for f in glob.glob(WEB + "/**/*.txt", recursive=True):
    low = f.lower()
    if any(k in low for k in ("backup", "_spelling backup", "literature",
                              "_index", "stopgap", "session handoff",
                              "next session", "paste sheet")):
        continue
    s = open(f, encoding="utf-8", errors="replace").read()
    if 'class="apol' not in s and 'class="apoh' not in s:
        continue
    body = re.sub(r"(?s)<!--.*?-->", "", s)
    for src in re.findall(r'<img[^>]*src="([^"]+)"', body):
        if not src.startswith(HOST):
            refs["(EXTERNAL)"].add((src, f))
            continue
        rel = src[len(HOST):]
        folder = rel.rsplit("/", 1)[0] if "/" in rel else ""
        refs[folder].add((rel.rsplit("/", 1)[-1], f))

print("%-34s %5s %7s   %s" % ("HOST FOLDER", "refs", "MISSING", "status"))
print("-" * 84)
missing = []
for folder in sorted(refs):
    if folder == "(EXTERNAL)":
        continue
    items = sorted(refs[folder])
    gone = [(fn, blk) for fn, blk in items
            if not os.path.exists(os.path.join(DOCS, folder, fn))]
    flag = "OK" if not gone else "*** %d NOT IN REPO ***" % len(gone)
    print("%-34s %5d %7d   %s" % (folder, len(items), len(gone), flag))
    for fn, blk in gone:
        missing.append((folder, fn, blk))

if refs.get("(EXTERNAL)"):
    print("\nnon-Pages image sources: %d" % len(refs["(EXTERNAL)"]))
    for src, blk in sorted(refs["(EXTERNAL)"])[:6]:
        print("   %s" % src[:96])

print("\n=== MISSING FILES, and where they are on disk ===")
if not missing:
    print("  none")
for folder, fn, blk in missing:
    here = onhand.get(fn, [])
    where = here[0].replace(WEB, "WEBSITE") if here else "!! NOT FOUND ANYWHERE"
    print("\n  %s/%s" % (folder, fn))
    print("     block : %s" % os.path.basename(blk)[:70])
    print("     source: %s" % where)
    if len(here) > 1:
        print("     (%d copies on disk)" % len(here))
