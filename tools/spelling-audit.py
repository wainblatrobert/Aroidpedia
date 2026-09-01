# -*- coding: utf-8 -*-
"""US vs UK spelling across the site's published blocks.

The user spotted "neighbouring" in the Alocasia Part VII rewrite. Before
changing anything, work out what the site's actual convention IS - counting
both variants across everything published, rather than assuming.

Only VISIBLE text is counted: HTML comments are stripped first, because the
authoring banners are full of my own prose and would swamp the signal.
"""
import os, re, glob, sys, io, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"

PAIRS = [
    ("color", "colour"), ("behavior", "behaviour"), ("neighbor", "neighbour"),
    ("favor", "favour"), ("odor", "odour"), ("vapor", "vapour"),
    ("center", "centre"), ("meter", "metre"), ("fiber", "fibre"),
    ("millimeter", "millimetre"), ("centimeter", "centimetre"),
    ("labeled", "labelled"), ("labeling", "labelling"),
    ("modeling", "modelling"), ("traveling", "travelling"),
    ("organize", "organise"), ("recognize", "recognise"),
    ("characterize", "characterise"), ("specialize", "specialise"),
    ("emphasize", "emphasise"), ("minimize", "minimise"),
    ("maximize", "maximise"), ("optimize", "optimise"),
    ("summarize", "summarise"), ("analyze", "analyse"),
    ("generalize", "generalise"), ("gray", "grey"),
    ("defense", "defence"), ("catalog", "catalogue"),
    ("program", "programme"), ("skeptic", "sceptic"),
    ("mold", "mould"), ("toward", "towards"), ("among", "amongst"),
    ("while", "whilst"),
]

us_tot = collections.Counter()
uk_tot = collections.Counter()
where = collections.defaultdict(list)

SKIP = ("Backup", "LITERATURE", "_INDEX", "TEXT", "DIGESTS", "STOPGAP")
def ok(f):
    low = f.lower()
    if any(os.sep + s.lower() + os.sep in low for s in SKIP): return False
    if any(k in low for k in ("session handoff", "next session", "custom css",
                              "source text", "addendum", "paste sheet",
                              "authoring rules", " css ", "readme")): return False
    return True
files = [f for f in glob.glob(ROOT + "/**/*.txt", recursive=True) if ok(f)]

for f in files:
    try:
        s = open(f, encoding="utf-8", errors="replace").read()
    except Exception:
        continue
    if 'class="apol' not in s and 'class="apoh' not in s and 'apol-prose' not in s:
        continue                       # not a published block
    body = re.sub(r"(?s)<!--.*?-->", "", s)      # visible text only
    body = re.sub(r"(?s)<(script|style)\b.*?</\1>", "", body)
    txt = re.sub(r"<[^>]+>", " ", body).lower()
    for us, uk in PAIRS:
        nu = len(re.findall(r"\b" + us + r"(s|ed|ing)?\b", txt))
        nk = len(re.findall(r"\b" + uk + r"(s|d|ing)?\b", txt))
        if nu: us_tot[us] += nu
        if nk:
            uk_tot[uk] += nk
            where[uk].append((os.path.relpath(f, ROOT), nk))

print("=== UK forms found in VISIBLE text ===")
if not uk_tot:
    print("   none")
for uk, n in uk_tot.most_common():
    us = dict((b, a) for a, b in PAIRS)[uk]
    print("\n  %-14s %3d   (US '%s': %d site-wide)" % (uk, n, us, us_tot.get(us, 0)))
    for p, c in where[uk][:6]:
        print("       %s  x%d" % (p, c))

print("\n=== overall ===")
print("  US-form hits: %d   UK-form hits: %d   over %d block files"
      % (sum(us_tot.values()), sum(uk_tot.values()), len(files)))
print("  top US forms:", ", ".join("%s:%d" % kv for kv in us_tot.most_common(8)))
