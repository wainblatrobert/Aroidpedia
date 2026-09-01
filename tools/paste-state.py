# -*- coding: utf-8 -*-
"""What is on disk that is not on the site?

One question, asked of every block: is the CURRENT version of this block
live? That single test catches all four reasons a block can be outstanding -
never pasted, content edited, permission line removed, spelling corrected -
without needing to know which applies.

Method: take the block's current long sentences, normalise hard (entities,
quotes, dashes, whitespace, case), and count how many appear in the live
page's normalised text.

  0 matched            NOT LIVE          the block is not on the page
  some missing         OUT OF DATE       an older version is on the page
  all matched          current

⚠ Normalisation has to be aggressive. Squarespace re-encodes entities and
curly quotes, so a literal comparison reports healthy blocks as stale - the
mistake that made an earlier tool over-report the whole morphology section.
Anything under 9 words is skipped: short lines collide across blocks.
"""
import os, re, glob, sys, io, html, unicodedata, urllib.request, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"
BASE = "https://www.aroidpedia.com"
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_paste_pages")
os.makedirs(CACHE, exist_ok=True)
FRESH = "--fresh" in sys.argv

SEC = {
 "AROID MORPHOLOGY": ({"": "/aroid-morphology"},
   {g: "/%s-morphology" % g.lower() for g in
    ["ALOCASIA", "ANTHURIUM", "MONSTERA", "PHILODENDRON"]}),
 "AROID REPRODUCTION": ({"": "/aroid-reproduction",
                         "CHROMOSOMES AND CROSSING": "/chromosomes-and-crossing"},
   {g + " REPRODUCTION": "/%s-reproduction" % g.lower() for g in
    ["ALOCASIA", "AMORPHOPHALLUS", "ANTHURIUM", "ARISAEMA", "ARUM",
     "DIEFFENBACHIA", "DRACUNCULUS", "HELICODICEROS", "HOMALOMENA",
     "MONSTERA", "PHILODENDRON", "SCHISMATOGLOTTIS", "SPATHIPHYLLUM"]}),
}


def norm(t):
    t = html.unescape(t)
    t = unicodedata.normalize("NFKD", t)
    t = (t.replace("\u2019", "'").replace("\u2018", "'")
          .replace("\u201c", '"').replace("\u201d", '"')
          .replace("\u2014", "-").replace("\u2013", "-")
          .replace("\u00a0", " "))
    t = re.sub(r"[^a-z0-9 ]+", " ", t.lower())
    return re.sub(r"\s+", " ", t).strip()


def visible(s):
    s = re.sub(r"(?s)<!--.*?-->", "", s)
    s = re.sub(r"(?is)<(style|script)\b.*?</\1>", " ", s)
    return re.sub(r"<[^>]+>", " ", s)


def page(url):
    cf = os.path.join(CACHE, url.strip("/") + ".txt")
    if os.path.exists(cf) and not FRESH:
        return open(cf, encoding="utf-8").read()
    rq = urllib.request.Request(BASE + url, headers={"User-Agent": "Mozilla/5.0"})
    raw = urllib.request.urlopen(rq, timeout=90).read().decode("utf-8", "replace")
    t = norm(visible(raw))
    open(cf, "w", encoding="utf-8").write(t)
    return t


SKIP = ("backup", "_spelling backup", "literature", "_index", "stopgap",
        "photos", "digests")
rows = collections.defaultdict(list)
for sec, (roots, subs) in SEC.items():
    fmap = dict(roots); fmap.update(subs)
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
        s = open(f, encoding="utf-8", errors="replace").read()
        if 'class="apol' not in s and 'class="apoh' not in s:
            continue
        cur = visible(s)
        sents = [x.strip() for x in re.split(r"(?<=[.!?])\s+", cur)]
        sents = [norm(x) for x in sents]
        sents = [x for x in sents if len(x.split()) >= 9]
        if not sents:
            continue
        live = page(url)
        # ⚠ COMPARE THE WHOLE SENTENCE, NOT A PREFIX. A 90-character
        # prefix stops before the changed word in most edits - which is how
        # the Spathiphyllum block, still showing "fertilise" live, was
        # reported current. Normalisation already absorbs the encoding
        # differences a prefix was there to dodge.
        miss = [x for x in sents if x not in live]
        rows[url].append((rel, len(sents), len(miss)))

print("%-32s %-46s %6s %s" % ("PAGE", "BLOCK", "sent", "STATE"))
print("-" * 108)
out = collections.Counter()
todo = collections.defaultdict(list)
for url in sorted(rows):
    for rel, n, m in sorted(rows[url]):
        if m == 0:
            state = "current"
        elif m == n:
            state = "*** NOT LIVE ***"
        else:
            state = "OUT OF DATE  (%d/%d sentences missing)" % (m, n)
        out[state.split("(")[0].strip()] += 1
        if m:
            todo[url].append((rel, n, m, state))
print()
for url in sorted(todo):
    print("%s" % url)
    for rel, n, m, state in todo[url]:
        print("   [ ] %-62s %s" % (rel.replace("/", "\\")[:62], state))
    print()
print("-" * 108)
tot = sum(out.values())
print("blocks checked: %d" % tot)
for k, v in out.most_common():
    print("   %-22s %d" % (k, v))
