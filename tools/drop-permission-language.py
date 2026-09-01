# -*- coding: utf-8 -*-
"""Drop "reproduced by permission" language across morphology and reproduction.

USER RULING 8.28.26: "we do not need to say reproduced by permission or
anything along that lines for anything. just crediting the journal or
source is enough."

WHAT GOES:
  · 8 Philodendron figure captions ending "Reproduced by permission."
  · the Philodendron Sources "Images" paragraph, reworded
  · Monstera Sources, "used with permission"
  · Amorphophallus Part X, "used with permission" on the RustyExotics film
The journal / photographer credit is untouched in every case - that is the
part the ruling says to keep.

WHAT STAYS, and why:
  · "CC BY 4.0" (4 places). That is a LICENCE statement, not a courtesy
    one. CC BY compliance requires indicating the licence, so removing it
    would be a different act from dropping a permission line. Flagged for
    the user rather than swept.
  · "Plate reproduced from ... , ResearchGate" (Alocasia, 2 places). That
    is the source credit itself, which the ruling says to keep.
  · The site-wide rights notice in the footer - not part of these sections.

Run with --apply to write.
"""
import os, re, glob, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
APPLY = "--apply" in sys.argv
R = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID REPRODUCTION/"

edits = []          # (path, old, new, label)

# ---- 1. the eight Philodendron captions ------------------------------
for f in sorted(glob.glob(R + "PHILODENDRON REPRODUCTION/*.txt")):
    if "Backup" in f:
        continue
    s = open(f, encoding="utf-8", errors="replace").read()
    n = s.count(" Reproduced by permission.")
    if n:
        edits.append((f, " Reproduced by permission.", "",
                      "%d caption credit(s)" % n))

# ---- 2. the Philodendron Sources "Images" paragraph ------------------
P_SRC = R + "PHILODENDRON REPRODUCTION/PHILODENDRON POLLINATION \u2014 14 SOURCES 8.17.26 v5.txt"
old_img = (
 "    <p>Photographs and figures on this page are reproduced <strong>by permission\n"
 "    and credited to their original sources</strong> &mdash; to the paper where\n"
 "    they were published, or to the photographer or website that made them. Facts\n"
 "    are not copyrightable; wording and photographs are, and both are attributed\n"
 "    here. Where a source&rsquo;s own notice asks that reuse be cleared first, it\n"
 "    was.</p>\n")
new_img = (
 "    <p>Photographs and figures on this page are <strong>credited to their\n"
 "    original sources</strong> &mdash; to the paper where they were published, or\n"
 "    to the photographer or website that made them. Facts are not copyrightable;\n"
 "    wording and photographs are, and both are attributed here.</p>\n")
edits.append((P_SRC, old_img, new_img, "Sources 'Images' paragraph reworded"))

# ---- 3. Monstera Sources ---------------------------------------------
M_SRC = R + "MONSTERA REPRODUCTION/MONSTERA POLLINATION \u2014 13 SOURCES 8.16.26 v5.txt"
edits.append((M_SRC,
 "          Also the source of Part XII&rsquo;s photographs, used with\n"
 "          permission. <b>Grade:",
 "          Also the source of Part XII&rsquo;s photographs. <b>Grade:",
 "Monstera Sources credit"))

# ---- 4. Amorphophallus Part X, the film credit -----------------------
A_X = R + "AMORPHOPHALLUS REPRODUCTION/AMORPHOPHALLUS POLLINATION \u2014 11 PART X FRUIT AND SEED 8.22.26 v7.txt"
edits.append((A_X,
 "      Nursery</a>, used with permission. A grower",
 "      Nursery</a>. A grower",
 "RustyExotics film credit"))
# and the authoring note that describes the removed wording
edits.append((A_X,
 'links to their page, and says "used with permission" \u2014 the\n'
 "     same standard as ",
 'links to their page \u2014 the same\n'
 "     standard as ",
 "authoring note kept truthful"))

ok = fail = 0
for path, old, new, label in edits:
    if not os.path.exists(path):
        print("  !! missing file: %s" % os.path.basename(path)); fail += 1; continue
    s = open(path, encoding="utf-8", newline="").read()
    n = s.count(old)
    if n == 0:
        print("  !! NOT FOUND  %-38s %s" % (label, os.path.basename(path)[:40]))
        fail += 1; continue
    print("  ok  %-38s x%-2d %s" % (label, n, os.path.basename(path)[:44]))
    ok += 1
    if APPLY:
        open(path, "w", encoding="utf-8", newline="").write(s.replace(old, new))

print("\n%d edit group(s) applied, %d problem(s)   [%s]"
      % (ok, fail, "APPLIED" if APPLY else "DRY RUN"))
