# -*- coding: utf-8 -*-
"""THE definitive stale-block audit for the morphology pages.

Heading order alone is not enough: it cannot see a figure or a sentence added
inside a block that did not move. This takes every disk block's visible text,
splits it into sentences, and asks how many of them the live page actually
contains. A block at 100% is published as written. Anything less is stale.

Also reports figures present on disk and absent live, which is the same
question asked of the markup rather than the prose.
"""
import re, glob, os, urllib.request, html as htmlmod

BASE = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID MORPHOLOGY"
GROUPS = [("HUB",       BASE,               "AROID MORPHOLOGY \u2014 *.txt",     "/aroid-morphology"),
          ("ALOCASIA",  BASE + "/ALOCASIA", "ALOCASIA MORPHOLOGY \u2014 *.txt",  "/alocasia-morphology"),
          ("ANTHURIUM", BASE + "/ANTHURIUM","ANTHURIUM MORPHOLOGY \u2014 *.txt", "/anthurium-morphology"),
          ("MONSTERA",  BASE + "/MONSTERA", "MONSTERA MORPHOLOGY \u2014 *.txt",  "/monstera-morphology"),
          ("PHILODENDRON", BASE + "/PHILODENDRON", "PHILODENDRON MORPHOLOGY \u2014 *.txt", "/philodendron-morphology")]

def norm(t):
    t = htmlmod.unescape(t)
    t = t.replace("\u2019", "'").replace("\u2018", "'")
    t = t.replace("\u201c", '"').replace("\u201d", '"')
    t = t.replace("\u2014", " ").replace("\u2013", " ").replace("\u00a0", " ")
    t = re.sub(r"[^a-z0-9 ]+", " ", t.lower())
    return re.sub(r"\s+", " ", t).strip()

def visible(markup):
    b = re.sub(r"<!--[\s\S]*?-->", " ", markup)
    b = re.sub(r"<(script|style)[\s\S]*?</\1>", " ", b, flags=re.I)
    b = re.sub(r"<[^>]+>", " ", b)
    return b

def fetch(slug):
    req = urllib.request.Request("https://www.aroidpedia.com" + slug,
                                 headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")

for label, d, pat, slug in GROUPS:
    raw = fetch(slug)
    live_txt = norm(visible(raw))
    live_imgs = set(re.findall(r"([a-z0-9][a-z0-9-]*\.jpe?g)", raw))
    print("\n================ %s  %s" % (label, slug))
    print("   %-52s %6s  %s" % ("block", "match", "what is missing"))
    for f in sorted(glob.glob(os.path.join(d, pat))):
        name = os.path.basename(f)
        if "PASTE SHEET" in name or "source text" in name.lower():
            continue
        s = open(f, encoding="utf-8", errors="replace").read()
        body = re.sub(r"<!--[\s\S]*?-->", " ", s)
        imgs = [m.rsplit("/", 1)[-1] for m in re.findall(r'<img[^>]*src="([^"]+)"', body)]
        miss_img = [i for i in imgs if i not in live_imgs]

        # sentences of at least 6 words, so boilerplate does not dilute the score
        txt = visible(body)
        sents = [norm(x) for x in re.split(r"(?<=[.!?])\s+", txt)]
        sents = [x for x in sents if len(x.split()) >= 6]
        if not sents:
            continue
        missing = [x for x in sents if x not in live_txt]
        pct = 100.0 * (len(sents) - len(missing)) / len(sents)
        block = name.split("\u2014 ")[-1].replace(".txt", "")
        notes = []
        if miss_img:
            notes.append("FIGURE not live: " + ", ".join(miss_img))
        if missing:
            notes.append("%d/%d sentences not on the page" % (len(missing), len(sents)))
        flag = "   " if (pct == 100.0 and not miss_img) else ">> "
        print("%s%-52s %5.0f%%  %s" % (flag, block, pct, "; ".join(notes)))
        if missing and pct < 100.0:
            for x in missing[:2]:
                print("       - \"%s\u2026\"" % x[:96])
