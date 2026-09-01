# -*- coding: utf-8 -*-
"""The bisexual / unisexual inflorescence plates: who uses them, who shows them.

Two shared diagrams live at docs/diagrams/:
    plate-bisexual-dark.jpg    plate-unisexual-dark.jpg

Nine blocks reference one or both. The question is three-part:
  1. which guides reference a plate, and which one
  2. is that plate actually on the live page
  3. is the plate the RIGHT one for that genus

⚠ This is a blind spot in paste-state.py: that tool compares SENTENCES, so a
block that gained a figure without gaining prose reads as current. A figure
is content too.
"""
import os, re, glob, sys, io, html, urllib.request, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID REPRODUCTION"
BASE = "https://www.aroidpedia.com"

URL = {"": "/aroid-reproduction", "CHROMOSOMES AND CROSSING": "/chromosomes-and-crossing"}
for g in ["ALOCASIA", "AMORPHOPHALLUS", "ANTHURIUM", "ARISAEMA", "ARUM",
          "DIEFFENBACHIA", "DRACUNCULUS", "HELICODICEROS", "HOMALOMENA",
          "MONSTERA", "PHILODENDRON", "SCHISMATOGLOTTIS", "SPATHIPHYLLUM"]:
    URL[g + " REPRODUCTION"] = "/%s-reproduction" % g.lower()

pages = {}
def page(u):
    if u not in pages:
        rq = urllib.request.Request(BASE + u, headers={"User-Agent": "Mozilla/5.0"})
        raw = urllib.request.urlopen(rq, timeout=90).read().decode("utf-8", "replace")
        # ⚠ STRIP COMMENTS. Squarespace keeps each block's authoring header
        # in the page source, and those headers NAME the plate files - so a
        # raw substring test reports a plate as live when only its upload
        # note is present. This is what hid the real answer.
        pages[u] = re.sub(r"(?s)<!--.*?-->", "", raw)
    return pages[u]


rows = []
for f in sorted(glob.glob(ROOT + "/**/*.txt", recursive=True)):
    low = f.lower()
    if any(k in low for k in ("backup", "_spelling backup", "literature",
                              "_index", "stopgap", "style kit", "addendum")):
        continue
    s = open(f, encoding="utf-8", errors="replace").read()
    body = re.sub(r"(?s)<!--.*?-->", "", s)
    used = sorted(set(re.findall(r"plate-(bisexual|unisexual)-dark", body)))
    if not used:
        continue
    rel = os.path.relpath(f, ROOT)
    folder = os.path.dirname(rel)
    url = URL.get(folder)
    # the caption that goes with each plate
    caps = []
    for m in re.finditer(r"(?is)<figure.*?</figure>", body):
        blk = m.group(0)
        k = re.findall(r"plate-(bisexual|unisexual)-dark", blk)
        if not k:
            continue
        c = re.search(r"(?is)<figcaption[^>]*>(.*?)</figcaption>", blk)
        cap = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", c.group(1)))).strip() if c else ""
        caps.append((k[0], cap))
    live = None
    if url:
        p = page(url)
        live = {kind: ("plate-%s-dark" % kind) in p for kind in used}
    rows.append((folder or "(hub)", os.path.basename(rel), url, used, live, caps))

print("%-30s %-11s %-11s %s" % ("GUIDE", "PLATE(S)", "LIVE?", "BLOCK"))
print("-" * 104)
for folder, fn, url, used, live, caps in rows:
    ls = "n/a" if live is None else ", ".join(
        "%s=%s" % (k, "YES" if v else "**NO**") for k, v in live.items())
    print("%-30s %-11s %-11s %s" % (folder[:30], ",".join(used), ls, fn[:44]))

print("\n=== CAPTIONS ===")
for folder, fn, url, used, live, caps in rows:
    for kind, cap in caps:
        print("\n  %s  [%s]" % (folder or "(hub)", kind))
        print("    %s" % cap[:300])

print("\n=== GUIDES WITH NO PLATE AT ALL ===")
have = {r[0] for r in rows}
for folder, url in sorted(URL.items()):
    if folder and folder not in have:
        print("   %-32s %s" % (folder, url))
