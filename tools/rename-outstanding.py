# -*- coding: utf-8 -*-
"""Bump the filename date + version on every block I edited that is still
outstanding.

USER RULING 8.28.26: "if you modify you always need to save with the latest
date and increase the version number." I edited blocks IN PLACE during the
spelling sweep, the permission sweep, the colophon fix and the hero line
breaks - so files still carrying 8.19.26 / 8.13.26 names contain 8.27-8.28
content, and the paste list was quoting those stale names back at the user.

SCOPE: the blocks still to paste, plus the four heroes just synced. Those
are the ones being worked from, where a wrong date actively misleads. The
~150 already-pasted spelling files are left alone and reported instead -
renaming them is churn with no reader.

Old file moves to Backup/ as usual.
"""
import os, re, glob, shutil, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
APPLY = "--apply" in sys.argv
R = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID REPRODUCTION/"
NEW = "8.28.26"

TARGETS = [
 # still outstanding, edited by one of this session's sweeps
 ("ALOCASIA REPRODUCTION", "14 SOURCES"),
 ("AMORPHOPHALLUS REPRODUCTION", "11 PART X FRUIT AND SEED"),
 ("AMORPHOPHALLUS REPRODUCTION", "14 SOURCES"),
 ("DRACUNCULUS REPRODUCTION", "04 PART III WHO COMES"),
 ("DRACUNCULUS REPRODUCTION", "08 SOURCES"),
 ("MONSTERA REPRODUCTION", "13 SOURCES"),
 ("PHILODENDRON REPRODUCTION", "02 PART I ANATOMY"),
 ("PHILODENDRON REPRODUCTION", "04 PART III THE CLOCK"),
 ("PHILODENDRON REPRODUCTION", "05 PART IV THE FURNACE"),
 ("PHILODENDRON REPRODUCTION", "07 PART VI WHAT THE BEETLE GETS"),
 ("PHILODENDRON REPRODUCTION", "08 PART VII WHO COMES"),
 ("PHILODENDRON REPRODUCTION", "09 PART VIII READING IT"),
 ("PHILODENDRON REPRODUCTION", "10 PART IX POLLEN"),
 ("PHILODENDRON REPRODUCTION", "14 SOURCES"),
 ("SPATHIPHYLLUM REPRODUCTION", "09 PART VIII SELF AND CROSS"),
 # heroes synced to the live line breaks today
 ("ARUM REPRODUCTION", "00 HERO"),
 ("DIEFFENBACHIA REPRODUCTION", "00 HERO"),
 ("DRACUNCULUS REPRODUCTION", "00 HERO"),
 ("HELICODICEROS REPRODUCTION", "00 HERO"),
]

ok = fail = 0
for folder, part in TARGETS:
    cands = [f for f in glob.glob(R + folder + "/*.txt")
             if part in os.path.basename(f) and "Backup" not in f]
    if len(cands) != 1:
        print("  !! %-30s %-32s %d matches" % (folder[:30], part[:32], len(cands)))
        fail += 1; continue
    src = cands[0]
    base = os.path.basename(src)
    m = re.search(r"^(.*?)\s+\d{1,2}\.\d{1,2}\.\d{2} v(\d+)\.txt$", base)
    if not m:
        print("  !! unparseable name: %s" % base); fail += 1; continue
    stem, ver = m.group(1), int(m.group(2))
    if NEW in base:
        print("  already dated: %s" % base[:56]); continue
    newname = "%s %s v%d.txt" % (stem, NEW, ver + 1)
    dst = os.path.join(os.path.dirname(src), newname)
    if os.path.exists(dst):
        print("  !! destination exists: %s" % newname); fail += 1; continue
    print("  %-46s -> %s" % (base[:46], newname[-26:]))
    ok += 1
    if APPLY:
        shutil.copy2(src, dst)
        bk = os.path.join(os.path.dirname(src), "Backup")
        os.makedirs(bk, exist_ok=True)
        shutil.move(src, os.path.join(bk, base))

print("\n%d renamed, %d problem(s)   [%s]"
      % (ok, fail, "APPLIED" if APPLY else "DRY RUN"))
