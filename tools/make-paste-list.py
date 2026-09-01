# -*- coding: utf-8 -*-
"""Write the combined US-spelling paste checklist for both sections.

Supersedes the reproduction-only list: the attribution was tightened after
that one was written (sentence-level, not bare-word), which moved several
blocks off the queue, and style kits / addenda were dropped because they
are authoring material that is never pasted anywhere.
"""
import os, re, glob, sys, io, html, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"
BK = ROOT + "/_SPELLING BACKUP 8.27.26"
CACHE = "C:/Users/nli0490/Claude/aroidpedia-climate/_live_pages"
WIN = ROOT.replace("/", "\\")

REPRO = {"": "/aroid-reproduction", "CHROMOSOMES AND CROSSING": "/chromosomes-and-crossing"}
for g in ["ALOCASIA", "AMORPHOPHALLUS", "ANTHURIUM", "ARISAEMA", "ARUM",
          "DIEFFENBACHIA", "DRACUNCULUS", "HELICODICEROS", "HOMALOMENA",
          "MONSTERA", "PHILODENDRON", "SCHISMATOGLOTTIS", "SPATHIPHYLLUM"]:
    REPRO[g + " REPRODUCTION"] = "/" + g.lower() + "-reproduction"
MORPH = {"": "/aroid-morphology"}
for g in ["ALOCASIA", "ANTHURIUM", "MONSTERA", "PHILODENDRON"]:
    MORPH[g] = "/" + g.lower() + "-morphology"

def strip(s):
    """Visible prose only - <style> and <script> must go too.

    A hero block carries the CSS comment "the accent word never italicizes".
    The sweep rewrote it and this tool then queued the hero for a re-paste,
    for a change no reader can see and that cannot affect rendering.
    """
    s = re.sub(r"(?s)<!--.*?-->", "", s)
    s = re.sub(r"(?is)<style\b.*?</style>", " ", s)
    s = re.sub(r"(?is)<script\b.*?</script>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s)))


def collect(sec, fmap):
    pages = collections.defaultdict(list)
    for f in sorted(glob.glob(BK + "/" + sec + "/**/*.txt", recursive=True)):
        rel = os.path.relpath(f, BK + "/" + sec)
        if any(k in rel.lower() for k in ("style kit", "addendum")):
            continue
        url = fmap.get(os.path.dirname(rel))
        if url is None:
            continue
        cur_p = os.path.join(ROOT, sec, rel)
        if not os.path.exists(cur_p):
            continue
        old = strip(open(f, encoding="utf-8", errors="replace").read())
        cur = strip(open(cur_p, encoding="utf-8", errors="replace").read())
        words = [w for w in (re.sub(r"[^A-Za-z-]", "", x)
                             for x, y in zip(old.split(), cur.split()) if x != y) if w]
        if not words:
            continue
        cf = os.path.join(CACHE, url.strip("/") + ".txt")
        live = open(cf, encoding="utf-8").read() if os.path.exists(cf) else ""
        # THE LIVE PAGE IS THE AUTHORITY. Matching a sentence prefix
        # reported correctly-pasted blocks as stale: the changed word is
        # usually not inside the first 70 characters of its sentence.
        hits = sorted({w for w in set(words)
                       if re.search(r"\b" + re.escape(w) + r"\b", live, re.I)})
        if not hits:
            sents = [s.strip() for s in re.split(r"(?<=[.!?]) ", cur) if len(s.split()) >= 9]
            if len(sents) >= 3 and sum(1 for s in sents[:6] if s[:70] in live) / len(sents[:6]) >= 0.5:
                continue                      # genuinely already clean
            hits = ["(verify by eye)"]
        pages[url].append((rel.replace("/", "\\"), hits))
    return pages


mo = collect("AROID MORPHOLOGY", MORPH)
re_ = collect("AROID REPRODUCTION", REPRO)

L = ["# US SPELLING - PASTE CHECKLIST (BOTH SECTIONS)", "",
     "Generated 8.27.26. **Every file below is already corrected on disk.**",
     "Each block was checked against its LIVE page and only appears here if the",
     "old spelling is still showing. Re-run to verify after pasting - a block",
     "drops off once it is live:", "",
     "    python spelling-worklist.py both --fresh", "",
     "Paths are relative to:", "", "    " + WIN + "\\", "", "---", ""]

for title, data, sec in [("MORPHOLOGY", mo, "AROID MORPHOLOGY"),
                         ("REPRODUCTION", re_, "AROID REPRODUCTION")]:
    n = sum(len(v) for v in data.values())
    L += ["# %s &mdash; %d blocks" % (title, n), "",
          "Under `%s\\`" % sec, ""]
    for url in sorted(data, key=lambda u: -len(data[u])):
        L += ["## %s  (%d)" % (url, len(data[url])), ""]
        for rel, hits in sorted(data[url]):
            L.append("- [ ] `%s`" % rel)
            L.append("      <br>*still live:* %s" % ", ".join(hits[:8]))
        L.append("")
    L += ["---", ""]

L += ["# Found while checking - NOT a spelling problem", "",
      "**`/helicodiceros-reproduction` is missing Part V entirely.** The live",
      "page runs Part IV straight into Part VI, and the page's own Sources",
      "block cites a Part V grade line for an experiment that is not there.",
      "The block exists and is finished on disk:", "",
      "    HELICODICEROS REPRODUCTION\\HELICODICEROS POLLINATION \u2014 06 PART V WHAT THE HEAT IS FOR 8.19.26 v1.txt", "",
      "None of its six sampled sentences appear on the page. It needs pasting",
      "on its own account, not for the spelling.", "",
      "---", "",
      "## What was deliberately left British", "",
      "- **Paper titles** in reference lists - respelling one misquotes the source.",
      "- **Quoted passages** - not ours to respell.",
      "- **Authoring comments** - internal notes, several of which quote the old",
      "  spelling while explaining a change.", "",
      "Originals: `" + WIN + "\\_SPELLING BACKUP 8.27.26\\`"]

p = ROOT + "/US SPELLING - PASTE CHECKLIST 8.27.26.md"
open(p, "w", encoding="utf-8", newline="\r\n").write("\n".join(L))
print("wrote %s" % os.path.basename(p))
print("morphology  %3d blocks" % sum(len(v) for v in mo.values()))
print("reproduction %3d blocks" % sum(len(v) for v in re_.values()))
