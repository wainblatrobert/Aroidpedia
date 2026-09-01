# -*- coding: utf-8 -*-
"""Find British spellings the sweep's word list MISSED.

"division of labour" survived the sweep because `labour` was never in the
map. A hand-written list of pairs is exactly the kind of thing that is
quietly incomplete, so stop guessing: scan the corpus for the PATTERNS
British spellings take, list the distinct words actually present, and
decide from real data.

Visible prose only - comments, tags, cite titles and quotes are skipped
the same way the sweep skips them.
"""
import os, re, glob, sys, io, html, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"

# words that merely LOOK British but are not, or are correct in both
OK = set("""our four hour tour your pour sour flour scour devour velour
are here there where were more score before core store shore spore genre
figure nature feature mature future picture structure culture measure sure
pure secure obscure literature temperature signature aperture curvature
capture rupture texture posture gesture creature acre ogre metre-long
centre-of centimetre-scale severe sphere adhere entire acquire require
desire wire fire hire spire tire mire empire umpire vampire
advertise surprise exercise supervise comprise enterprise franchise
compromise devise revise arise rise wise otherwise likewise crosswise
promise premise demise expertise merchandise improvise disguise chastise
excise incise despise televise apprise""".split())

PATTERNS = [
    ("-our",  re.compile(r"\b[a-z]{3,}our(s|ed|ing|able)?\b")),
    ("-ise",  re.compile(r"\b[a-z]{4,}is(e|es|ed|ing|ation|ations)\b")),
    ("-re",   re.compile(r"\b[a-z]{3,}(tre|bre|cre|vre)(s|d)?\b")),
    ("-ogue", re.compile(r"\b[a-z]{3,}ogue(s)?\b")),
    ("-lled", re.compile(r"\b[a-z]{3,}ll(ed|ing|er|ers)\b")),
    ("-yse",  re.compile(r"\b[a-z]{3,}ys(e|es|ed|ing)\b")),
    ("ae/oe", re.compile(r"\b(ha?em|oe|foet|paed|anae|diarrh)[a-z]{2,}\b")),
    ("-ence", re.compile(r"\b(defen|offen|preten|licen)ce(s)?\b")),
]

strip = lambda s: re.sub(r"\s+", " ", html.unescape(
    re.sub(r"<[^>]+>", " ", re.sub(r"(?s)<!--.*?-->", "", s))))

SKIP = ("backup", "literature", "_index", "digests", "stopgap",
        "_spelling backup 8.27.26")
found = collections.defaultdict(collections.Counter)
where = collections.defaultdict(set)

for f in glob.glob(ROOT + "/**/*.txt", recursive=True):
    low = f.lower()
    if any(os.sep + d + os.sep in low for d in SKIP):
        continue
    if any(k in low for k in ("session handoff", "next session", "custom css",
                              "source text", "paste sheet", "readme", "manifest",
                              "style kit", "addendum")):
        continue
    s = open(f, encoding="utf-8", errors="replace").read()
    if 'class="apol' not in s and 'class="apoh' not in s:
        continue
    body = s
    for rx in (r'(?is)<cite.*?</cite>', r"(?s)&ldquo;.*?&rdquo;", r"(?s)\u201c.*?\u201d"):
        body = re.sub(rx, " ", body)
    txt = strip(body).lower()
    for label, rx in PATTERNS:
        for m in rx.finditer(txt):
            w = m.group(0)
            if w in OK or any(w.startswith(o) and len(w) - len(o) <= 3 for o in OK):
                continue
            found[label][w] += 1
            where[w].add(os.path.relpath(f, ROOT))

for label, rx in PATTERNS:
    c = found[label]
    if not c:
        continue
    print("\n=== %s ===" % label)
    for w, n in c.most_common(40):
        print("   %-22s x%-4d  %s" % (w, n, sorted(where[w])[0][:62]))
