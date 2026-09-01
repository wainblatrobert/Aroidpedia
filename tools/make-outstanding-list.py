# -*- coding: utf-8 -*-
"""The definitive list of blocks that are not current on the site.

TWO tests, because neither alone is sufficient:

  A. Are this block's CURRENT sentences all live?
     Catches added and changed text. BLIND TO DELETIONS - if an edit only
     removes a line, every remaining sentence still matches and the block
     looks current. The permission sweep was entirely deletions, so all ten
     of those blocks passed test A.

  B. Is text the block NO LONGER CONTAINS still on the page?
     Catches deletions. Run against the specific phrases the permission
     sweep removed.

The union is the answer.
"""
import os, re, glob, sys, io, html, unicodedata, urllib.request, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"
BASE = "https://www.aroidpedia.com"

SEC = {
 "AROID MORPHOLOGY": {"": "/aroid-morphology", "ALOCASIA": "/alocasia-morphology",
   "ANTHURIUM": "/anthurium-morphology", "MONSTERA": "/monstera-morphology",
   "PHILODENDRON": "/philodendron-morphology"},
 "AROID REPRODUCTION": {"": "/aroid-reproduction",
   "CHROMOSOMES AND CROSSING": "/chromosomes-and-crossing"},
}
for g in ["ALOCASIA", "AMORPHOPHALLUS", "ANTHURIUM", "ARISAEMA", "ARUM",
          "DIEFFENBACHIA", "DRACUNCULUS", "HELICODICEROS", "HOMALOMENA",
          "MONSTERA", "PHILODENDRON", "SCHISMATOGLOTTIS", "SPATHIPHYLLUM"]:
    SEC["AROID REPRODUCTION"][g + " REPRODUCTION"] = "/%s-reproduction" % g.lower()

REMOVED = ["Reproduced by permission", "used with permission",
           "reuse be cleared first", "reproduced by permission"]


def norm(t):
    t = html.unescape(t)
    t = unicodedata.normalize("NFKD", t)
    for a, b in [("\u2019", "'"), ("\u2018", "'"), ("\u201c", '"'),
                 ("\u201d", '"'), ("\u2014", "-"), ("\u2013", "-"), ("\u00a0", " ")]:
        t = t.replace(a, b)
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]+", " ", t.lower())).strip()


def visible(s):
    s = re.sub(r"(?s)<!--.*?-->", "", s)
    s = re.sub(r"(?is)<(style|script)\b.*?</\1>", " ", s)
    return re.sub(r"<[^>]+>", " ", s)


pages = {}
def page(u):
    if u not in pages:
        rq = urllib.request.Request(BASE + u, headers={"User-Agent": "Mozilla/5.0"})
        raw = urllib.request.urlopen(rq, timeout=90).read().decode("utf-8", "replace")
        pages[u] = norm(visible(raw))
    return pages[u]


SKIP = ("backup", "_spelling backup", "literature", "_index", "stopgap",
        "photos", "digests")
found = collections.defaultdict(list)
for sec, fmap in SEC.items():
    for f in sorted(glob.glob(ROOT + "/" + sec + "/**/*.txt", recursive=True)):
        rel = os.path.relpath(f, ROOT + "/" + sec)
        low = f.lower()
        if any(os.sep + d + os.sep in low for d in SKIP):
            continue
        if any(k in low for k in ("style kit", "addendum", "paste sheet",
                                  "session handoff", "next session", "readme")):
            continue
        url = fmap.get(os.path.dirname(rel))
        if url is None:
            continue
        raw = open(f, encoding="utf-8", errors="replace").read()
        if 'class="apol' not in raw and 'class="apoh' not in raw:
            continue
        cur = visible(raw)
        sents = [norm(x) for x in re.split(r"(?<=[.!?])\s+", cur)]
        sents = [x for x in sents if len(x.split()) >= 9]
        if not sents:
            continue
        live = page(url)
        miss = [x for x in sents if x not in live]

        why = []
        if miss and len(miss) == len(sents):
            why.append("NOT LIVE - block is not on the page")
        elif miss:
            why.append("out of date - %d/%d sentences missing" % (len(miss), len(sents)))
        # test B: did THIS block lose a permission phrase that is still live?
        # \u26a0 "the block lacks it and the page has it" flags every block on the
        # page, including the dozen that never carried the phrase. The phrase
        # must have been in THIS block's own earlier version, so compare
        # against the pre-sweep backup rather than against absence.
        # ⚠ MATCH THE BACKUP BY STEM, NOT BY FILENAME. Renaming a block to
        # today's date and a new version (which the house rule requires
        # after any edit) changes the filename, so an exact-path lookup
        # silently finds nothing and the deletion check is skipped - the
        # list then UNDER-reports. Strip the trailing "<date> vN.txt".
        bk = os.path.join(ROOT, "_SPELLING BACKUP 8.27.26", sec, rel)
        if not os.path.exists(bk):
            stem = re.sub(r"\s+\d{1,2}\.\d{1,2}\.\d{2} v\d+\.txt$", "",
                          os.path.basename(rel))
            d = os.path.join(ROOT, "_SPELLING BACKUP 8.27.26", sec,
                             os.path.dirname(rel))
            if os.path.isdir(d):
                for cand in os.listdir(d):
                    if cand.startswith(stem):
                        bk = os.path.join(d, cand); break
        if os.path.exists(bk):
            was = norm(visible(open(bk, encoding="utf-8", errors="replace").read()))
            now = norm(cur)
            for phrase in set(REMOVED):
                p = norm(phrase)
                if p in was and p not in now and p in live:
                    why.append("permission line removed, still live: \u201c%s\u201d" % phrase)
                    break
        if why:
            found[url].append((sec, rel, "; ".join(why)))

print("=" * 96)
n = sum(len(v) for v in found.values())
print("BLOCKS NOT CURRENT ON THE SITE: %d" % n)
print("=" * 96)
for url in sorted(found):
    print("\n%s" % url)
    for sec, rel, why in sorted(found[url]):
        print("   [ ] %s" % rel.replace("/", "\\"))
        print("       %s" % why)
print("\n(section root: %s\\<SECTION>\\)" % ROOT.replace("/", "\\"))
