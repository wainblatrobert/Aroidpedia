# -*- coding: utf-8 -*-
"""Triage the 26 newly-ingested papers.

Which are they, what did the classifier make of them, and which have no
extractable text (so they need a VISUAL read rather than a text one)?
"""
import json, os, sys, io, re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

LIT = "G:/My Drive/PlantsV2/Aroidpedia/LITERATURE"
BEFORE = ("C:/Users/nli0490/AppData/Local/Temp/claude/"
          "C--Users-nli0490-Claude/f35a1d61-1b66-4fc0-be7b-d93b45b553e9/"
          "scratchpad/CATALOG-before.json")


def entries(o):
    return o if isinstance(o, list) else o.get("papers", list(o.values()))


old = {e.get("file") or e.get("filename") or e.get("path")
       for e in entries(json.load(open(BEFORE, encoding="utf-8")))}
cur = entries(json.load(open(LIT + "/_INDEX/CATALOG.json", encoding="utf-8")))

new = [e for e in cur if (e.get("file") or e.get("filename") or e.get("path")) not in old]
print("new entries: %d\n" % len(new))
if new:
    print("catalogue fields available: %s\n" % ", ".join(sorted(new[0].keys())))

TEXT = LIT + "/_INDEX/TEXT"
rows = []
for e in new:
    fn = e.get("file") or e.get("filename") or e.get("path") or "?"
    base = os.path.splitext(os.path.basename(fn))[0]
    # find the extracted text
    tp = None
    for cand in (os.path.join(TEXT, base + ".txt"),):
        if os.path.exists(cand):
            tp = cand
    if tp is None:
        hits = [p for p in os.listdir(TEXT) if p.startswith(base[:40])] if os.path.isdir(TEXT) else []
        tp = os.path.join(TEXT, hits[0]) if hits else None
    chars = os.path.getsize(tp) if tp and os.path.exists(tp) else 0
    pdf = os.path.join(LIT, os.path.basename(fn))
    mb = os.path.getsize(pdf) / 1e6 if os.path.exists(pdf) else 0
    rows.append((chars, mb, os.path.basename(fn), e))

rows.sort()
print("%-9s %7s  %s" % ("TEXT", "MB", "FILE"))
print("-" * 96)
for chars, mb, fn, e in rows:
    flag = "  << IMAGE-ONLY" if chars < 1500 else ""
    print("%9s %6.1f  %-62s%s" % ("{:,}".format(chars), mb, fn[:62], flag))

img = [r for r in rows if r[0] < 1500]
print("\n%d of %d have (almost) no extractable text - these need a VISUAL read."
      % (len(img), len(rows)))
