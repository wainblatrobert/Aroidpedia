# -*- coding: utf-8 -*-
"""Compare each hero's <h1> title markup, live against the source file.

The user hand-inserted <br> into the live titles so each runs on two lines.
Those breaks exist only on the site. This reports, per guide, the live title
markup and the disk title markup so the difference is visible before
anything is written.

⚠ DO NOT plan to overwrite the block wholesale with live markup. Squarespace
re-encodes entities and leaves editor artifacts (the Arum title comes back
with a stray closing </br>). Only the <br> positions should move.
"""
import os, re, glob, sys, io, urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID REPRODUCTION"

U = {"": "/aroid-reproduction", "CHROMOSOMES AND CROSSING": "/chromosomes-and-crossing"}
for g in ["ALOCASIA", "AMORPHOPHALLUS", "ANTHURIUM", "ARISAEMA", "ARUM",
          "DIEFFENBACHIA", "DRACUNCULUS", "HELICODICEROS", "HOMALOMENA",
          "MONSTERA", "PHILODENDRON", "SCHISMATOGLOTTIS", "SPATHIPHYLLUM"]:
    U[g + " REPRODUCTION"] = "/%s-reproduction" % g.lower()

pages = {}
def page(u):
    if u not in pages:
        rq = urllib.request.Request("https://www.aroidpedia.com" + u,
                                    headers={"User-Agent": "Mozilla/5.0"})
        raw = urllib.request.urlopen(rq, timeout=90).read().decode("utf-8", "replace")
        pages[u] = re.sub(r"(?s)<!--.*?-->", "", raw)
    return pages[u]


def title_of(markup):
    """The hero <h1>, whatever its class is called on that page."""
    m = re.search(r'(?is)<h1[^>]*class="[^"]*title[^"]*"[^>]*>(.*?)</h1>', markup)
    return m.group(1).strip() if m else None


rows = []
for f in sorted(glob.glob(ROOT + "/*/*HERO*.txt")) + sorted(glob.glob(ROOT + "/*HERO*.txt")):
    if "Backup" in f:
        continue
    rel = os.path.relpath(f, ROOT)
    url = U.get(os.path.dirname(rel))
    if not url:
        continue
    disk_raw = re.sub(r"(?s)<!--.*?-->", "", open(f, encoding="utf-8", errors="replace").read())
    d = title_of(disk_raw)
    l = title_of(page(url))
    rows.append((os.path.dirname(rel) or "(hub)", f, d, l))

print("%-30s %-6s %s" % ("GUIDE", "state", "titles"))
print("-" * 96)
need = 0
for guide, f, d, l in rows:
    if d is None or l is None:
        print("%-30s %-6s disk:%s  live:%s" % (guide[:30], "??",
              "found" if d else "MISSING", "found" if l else "MISSING"))
        continue
    dbr, lbr = len(re.findall(r"<br", d, re.I)), len(re.findall(r"<br", l, re.I))
    state = "same" if dbr == lbr else ("ADD %d" % (lbr - dbr))
    if dbr != lbr:
        need += 1
    print("\n%-30s %s" % (guide[:30], state))
    print("   disk: %s" % re.sub(r"\s+", " ", d)[:110])
    print("   live: %s" % re.sub(r"\s+", " ", l)[:110])

print("\n%d hero(es) whose live title carries breaks the file lacks" % need)
