# -*- coding: utf-8 -*-
"""Write the reproduction-section paste checklist.

Absolute paths, because a handoff that names a file without its full path
is a file the next person has to go hunting for.
"""
import os, re, glob, sys, io, html, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"
SEC = "AROID REPRODUCTION"
BK = ROOT + "/_SPELLING BACKUP 8.27.26"
CACHE = "C:/Users/nli0490/Claude/aroidpedia-climate/_repro_pages"
WIN = ROOT.replace("/", "\\")

FOLDER_URL = {"": "/aroid-reproduction", "CHROMOSOMES AND CROSSING": "/chromosomes-and-crossing"}
for g in ["ALOCASIA", "AMORPHOPHALLUS", "ANTHURIUM", "ARISAEMA", "ARUM",
          "DIEFFENBACHIA", "DRACUNCULUS", "HELICODICEROS", "HOMALOMENA",
          "MONSTERA", "PHILODENDRON", "SCHISMATOGLOTTIS", "SPATHIPHYLLUM"]:
    FOLDER_URL[g + " REPRODUCTION"] = "/" + g.lower() + "-reproduction"


def strip(s):
    return re.sub(r"\s+", " ", html.unescape(
        re.sub(r"<[^>]+>", " ", re.sub(r"(?s)<!--.*?-->", "", s))))


pages = collections.defaultdict(list)
for f in glob.glob(BK + "/" + SEC + "/**/*.txt", recursive=True):
    rel = os.path.relpath(f, BK + "/" + SEC)
    url = FOLDER_URL.get(os.path.dirname(rel))
    if not url:
        continue
    cur = os.path.join(ROOT, SEC, rel)
    a = strip(open(f, encoding="utf-8", errors="replace").read()).split()
    b = strip(open(cur, encoding="utf-8", errors="replace").read()).split()
    words = [w for w in (re.sub(r"[^A-Za-z-]", "", x) for x, y in zip(a, b) if x != y) if w]
    cf = os.path.join(CACHE, url.strip("/") + ".txt")
    live = open(cf, encoding="utf-8").read() if os.path.exists(cf) else ""
    hits = sorted({w for w in words if re.search(r"\b" + re.escape(w) + r"\b", live)})
    if hits:
        pages[url].append((rel.replace("/", "\\"), hits, len(words)))

L = []
L.append("# US SPELLING - REPRODUCTION SECTION PASTE LIST")
L.append("")
L.append("Generated 8.27.26. **Every file below is already corrected on disk.**")
L.append("This is the paste queue: each block was checked against its LIVE page,")
L.append("and only blocks whose old spellings are *still showing live* are listed.")
L.append("")
L.append("All paths are under:")
L.append("")
L.append("    " + WIN + "\\" + SEC + "\\")
L.append("")
tot = sum(len(v) for v in pages.values())
L.append("**%d blocks across %d pages.** Pages are ordered largest first, so the"
         % (tot, len(pages)))
L.append("biggest reductions land early; within a page, blocks are in page order.")
L.append("")
L.append("Re-run the check any time with:")
L.append("")
L.append("    python repro-spelling-worklist.py --fresh")
L.append("")
L.append("It reads the live pages, so a block drops off the list once it is pasted.")
L.append("")
L.append("---")
L.append("")

for url in sorted(pages, key=lambda u: -len(pages[u])):
    rows = sorted(pages[url])
    L.append("## %s  &mdash; %d blocks" % (url, len(rows)))
    L.append("")
    for rel, hits, n in rows:
        L.append("- [ ] `%s`" % rel)
        L.append("      <br>*still live:* %s" % ", ".join(hits[:8]))
    L.append("")

L.append("---")
L.append("")
L.append("## Not in this list, and why")
L.append("")
L.append("- **2 blocks already read US live** while their source file was still")
L.append("  British - `CHROMOSOMES AND CROSSING - 03 PART II THE FAMILY` and")
L.append("  `ARISAEMA POLLINATION - 01 OPENING`. The source has been corrected to")
L.append("  match; nothing to paste.")
L.append("- **Paper titles and quoted passages** keep their British spelling")
L.append("  everywhere. Respelling a title misquotes the source.")
L.append("- **The morphology section** (20 blocks) is corrected on disk too and")
L.append("  has its own entries in the full sweep list.")
L.append("")
L.append("Originals: `" + WIN + "\\_SPELLING BACKUP 8.27.26\\`")

p = ROOT + "/US SPELLING - REPRODUCTION PASTE LIST 8.27.26.md"
open(p, "w", encoding="utf-8", newline="\r\n").write("\n".join(L))
print("wrote %s" % os.path.basename(p))
print("%d blocks across %d pages" % (tot, len(pages)))
