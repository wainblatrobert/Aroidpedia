# -*- coding: utf-8 -*-
"""Measured paste queue for the US-spelling sweep, either section.

    python spelling-worklist.py repro [--fresh]
    python spelling-worklist.py morph [--fresh]
    python spelling-worklist.py both  [--fresh]

A block only needs re-pasting if the LIVE page still carries the old
spelling, so this fetches each page and checks. Re-run after pasting and a
block drops off - it is the verification pass as well as the work list.

⚠ THREE OUTCOMES, not two. A block can also be OUT OF DATE on the page
entirely - its current text was never pasted - in which case the old
spelling will not be found simply because none of that prose is live. That
must not be scored as "done". Alocasia Part VII is exactly this case: the
live page still shows the v5 wording, so its v8 spelling fix cannot show up
either. Those are reported separately.
"""
import os, re, glob, sys, io, html, urllib.request, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"
BK = ROOT + "/_SPELLING BACKUP 8.27.26"
BASE = "https://www.aroidpedia.com"
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_live_pages")
os.makedirs(CACHE, exist_ok=True)
FRESH = "--fresh" in sys.argv
WHICH = ([a for a in sys.argv[1:] if not a.startswith("-")] or ["both"])[0]

REPRO = {"": "/aroid-reproduction", "CHROMOSOMES AND CROSSING": "/chromosomes-and-crossing"}
for g in ["ALOCASIA", "AMORPHOPHALLUS", "ANTHURIUM", "ARISAEMA", "ARUM",
          "DIEFFENBACHIA", "DRACUNCULUS", "HELICODICEROS", "HOMALOMENA",
          "MONSTERA", "PHILODENDRON", "SCHISMATOGLOTTIS", "SPATHIPHYLLUM"]:
    REPRO[g + " REPRODUCTION"] = "/" + g.lower() + "-reproduction"

MORPH = {"": "/aroid-morphology"}
for g in ["ALOCASIA", "ANTHURIUM", "MONSTERA", "PHILODENDRON"]:
    MORPH[g] = "/" + g.lower() + "-morphology"

SECTIONS = []
if WHICH in ("repro", "both"):
    SECTIONS.append(("AROID REPRODUCTION", REPRO))
if WHICH in ("morph", "both"):
    SECTIONS.append(("AROID MORPHOLOGY", MORPH))


def strip(s):
    """Visible prose only.

    ⚠ MUST DROP <style> AND <script>. Removing HTML comments is not enough:
    a hero block carries a CSS comment reading "the accent word never
    italicizes", which the sweep duly rewrote and this tool then reported as
    a block needing a re-paste. A code comment is invisible to a reader and
    a CSS comment cannot affect rendering, so neither belongs in a paste
    queue.
    """
    s = re.sub(r"(?s)<!--.*?-->", "", s)
    s = re.sub(r"(?is)<style\b.*?</style>", " ", s)
    s = re.sub(r"(?is)<script\b.*?</script>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s)))


def page_text(url):
    cf = os.path.join(CACHE, url.strip("/") + ".txt")
    if os.path.exists(cf) and not FRESH:
        return open(cf, encoding="utf-8").read()
    req = urllib.request.Request(BASE + url, headers={"User-Agent": "Mozilla/5.0"})
    raw = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")
    body = re.sub(r"(?s)<!--.*?-->", "", raw)
    body = re.sub(r"(?s)<(script|style)\b.*?</\1>", " ", body)
    txt = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", body)))
    open(cf, "w", encoding="utf-8").write(txt)
    return txt


def on_page(cur_text, live):
    """Is this block's CURRENT prose actually live?

    Returns None when there is not enough to measure. A HERO block is a
    title and a subtitle: it may hold one long sentence, and calling a
    block dead on a single miss is worse than saying nothing. Callers
    treat None as 'paste it' - the conservative direction.
    """
    sents = [s.strip() for s in re.split(r"(?<=[.!?]) ", cur_text) if len(s.split()) >= 9]
    if len(sents) < 3:
        return None
    sample = sents[:6]
    return sum(1 for s in sample if s[:70] in live) / len(sample)


def is_block(rel):
    """Published page blocks only - style kits and addenda are authoring
    material that never gets pasted anywhere."""
    low = rel.lower()
    return not any(k in low for k in ("style kit", "addendum", "style addendum"))


stale, notlive, done = collections.defaultdict(list), collections.defaultdict(list), 0
for sec, fmap in SECTIONS:
    for f in sorted(glob.glob(BK + "/" + sec + "/**/*.txt", recursive=True)):
        rel = os.path.relpath(f, BK + "/" + sec)
        if not is_block(rel):
            continue
        url = fmap.get(os.path.dirname(rel))
        if url is None:
            print("  ?? unmapped: %s\\%s" % (sec, rel)); continue
        cur_path = os.path.join(ROOT, sec, rel)
        if not os.path.exists(cur_path):
            print("  !! source gone: %s" % rel); continue
        old = strip(open(f, encoding="utf-8", errors="replace").read())
        cur = strip(open(cur_path, encoding="utf-8", errors="replace").read())
        words = [w for w in (re.sub(r"[^A-Za-z-]", "", x)
                             for x, y in zip(old.split(), cur.split()) if x != y) if w]
        if not words:
            continue
        # ATTRIBUTE AT SENTENCE LEVEL. Searching the page for a bare word
        # flags a block because some OTHER block on the same page still
        # carries that word. Take the OLD sentence each change sat in and
        # look for that instead.
        try:
            live = page_text(url)
        except Exception as e:
            print("  !! %s : %s" % (url, e)); continue

        # ⚠⚠ THE PAGE IS THE AUTHORITY. An earlier version matched the first
        # 70 characters of the sentence a change sat in - but the changed
        # word is usually NOT in the first 70 characters, so a correctly
        # pasted block still matched its own old prefix and was reported
        # stale. Every morphology page came back clean by direct word search
        # while the tool still listed 20 blocks. If the OLD WORD is not on
        # the page at all, nothing on that page needs that word fixed, and
        # no amount of sentence matching can change that.
        hits = sorted({w for w in set(words)
                       if re.search(r"\b" + re.escape(w) + r"\b", live, re.I)})
        # Attribution is then best-effort: among the blocks that lost this
        # word, the one whose own old sentence is still live is the culprit.
        if hits:
            own = []
            for w in hits:
                for t in re.split(r"(?<=[.!?]) ", old):
                    if re.search(r"\b" + re.escape(w) + r"\b", t) and len(t.split()) >= 6:
                        if t.strip()[:70] in live:
                            own.append(w)
                        break
            hits = sorted(set(own)) or hits
        if hits:
            stale[url].append((sec, rel, hits))
        else:
            frac = on_page(cur, live)
            if frac is None:
                # too short to judge - list it rather than silently drop it
                stale[url].append((sec, rel, ["(short block - verify by eye)"]))
            elif frac < 0.5:
                notlive[url].append((sec, rel, words[:5], frac))
            else:
                done += 1

print("\n%-34s %7s %8s" % ("PAGE", "PASTE", "not-live"))
print("-" * 52)
allurls = sorted(set(list(stale) + list(notlive)))
for u in allurls:
    print("%-34s %7d %8d" % (u, len(stale[u]), len(notlive[u])))
print("-" * 52)
print("%-34s %7d %8d   (%d already clean)"
      % ("TOTAL", sum(len(v) for v in stale.values()),
         sum(len(v) for v in notlive.values()), done))

print("\n=== TO PASTE (old spelling still showing live) ===")
for u in allurls:
    if not stale[u]:
        continue
    print("\n%s" % u)
    for sec, rel, hits in sorted(stale[u]):
        print("   [ ] %-56s %s" % (rel.replace("/", "\\")[:56], ", ".join(hits[:6])))

if any(notlive.values()):
    print("\n=== BLOCK TEXT IS NOT LIVE AT ALL (paste for its own sake) ===")
    for u in allurls:
        for sec, rel, words, frac in sorted(notlive[u]):
            print("   [ ] %-40s %-22s only %d%% of its prose is on %s"
                  % (rel.replace("/", "\\")[:40], ",".join(words[:3]), round(frac * 100), u))
