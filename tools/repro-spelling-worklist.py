# -*- coding: utf-8 -*-
"""Which reproduction blocks still show British spellings LIVE?

The 161 changed files are a list of what changed on disk. That is not the
same as a work list: a block only needs re-pasting if the LIVE page still
carries the old spelling. This fetches each reproduction page once, works
out from the backup-vs-current diff exactly which words changed in each
block, and reports only the blocks whose old words are still on the page.

Re-run it after pasting - it doubles as the verification pass.
"""
import os, re, glob, sys, io, html, json, urllib.request, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"
BK = ROOT + "/_SPELLING BACKUP 8.27.26"
SECTION = "AROID REPRODUCTION"

FOLDER_URL = {
    "": "/aroid-reproduction",
    "ALOCASIA REPRODUCTION": "/alocasia-reproduction",
    "AMORPHOPHALLUS REPRODUCTION": "/amorphophallus-reproduction",
    "ANTHURIUM REPRODUCTION": "/anthurium-reproduction",
    "ARISAEMA REPRODUCTION": "/arisaema-reproduction",
    "ARUM REPRODUCTION": "/arum-reproduction",
    "CHROMOSOMES AND CROSSING": "/chromosomes-and-crossing",
    "DIEFFENBACHIA REPRODUCTION": "/dieffenbachia-reproduction",
    "DRACUNCULUS REPRODUCTION": "/dracunculus-reproduction",
    "HELICODICEROS REPRODUCTION": "/helicodiceros-reproduction",
    "HOMALOMENA REPRODUCTION": "/homalomena-reproduction",
    "MONSTERA REPRODUCTION": "/monstera-reproduction",
    "PHILODENDRON REPRODUCTION": "/philodendron-reproduction",
    "SCHISMATOGLOTTIS REPRODUCTION": "/schismatoglottis-reproduction",
    "SPATHIPHYLLUM REPRODUCTION": "/spathiphyllum-reproduction",
}
BASE = "https://www.aroidpedia.com"
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_repro_pages")
os.makedirs(CACHE, exist_ok=True)
FRESH = "--fresh" in sys.argv


def page_text(url):
    """Visible text of a live page, normalised, comments stripped."""
    cf = os.path.join(CACHE, url.strip("/") + ".txt")
    if os.path.exists(cf) and not FRESH:
        return open(cf, encoding="utf-8").read()
    req = urllib.request.Request(BASE + url, headers={"User-Agent": "Mozilla/5.0"})
    raw = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")
    body = re.sub(r"(?s)<!--.*?-->", "", raw)
    body = re.sub(r"(?s)<(script|style)\b.*?</\1>", " ", body)
    txt = html.unescape(re.sub(r"<[^>]+>", " ", body))
    txt = re.sub(r"\s+", " ", txt)
    open(cf, "w", encoding="utf-8").write(txt)
    return txt


def changed_words(old, new):
    """The British words this block actually lost, from the real diff."""
    strip = lambda s: re.sub(r"\s+", " ", html.unescape(
        re.sub(r"<[^>]+>", " ", re.sub(r"(?s)<!--.*?-->", "", s))))
    a, b = strip(old).split(), strip(new).split()
    out = []
    for x, y in zip(a, b):
        if x != y:
            out.append(re.sub(r"[^A-Za-z-]", "", x))
    return [w for w in out if w]


rows = collections.defaultdict(list)
for f in glob.glob(BK + "/" + SECTION + "/**/*.txt", recursive=True):
    rel = os.path.relpath(f, BK + "/" + SECTION)
    folder = os.path.dirname(rel)
    if folder not in FOLDER_URL:
        print("  ?? unmapped folder: %s" % folder); continue
    cur = os.path.join(ROOT, SECTION, rel)
    if not os.path.exists(cur):
        print("  !! current file missing: %s" % rel); continue
    words = changed_words(open(f, encoding="utf-8", errors="replace").read(),
                          open(cur, encoding="utf-8", errors="replace").read())
    rows[FOLDER_URL[folder]].append((os.path.basename(rel), words))

print("fetching %d live pages...\n" % len(rows))
need = done = 0
report = []
for url in sorted(rows):
    try:
        live = page_text(url)
    except Exception as e:
        print("  !! %s : %s" % (url, e)); continue
    stale, ok = [], 0
    for name, words in sorted(rows[url]):
        hits = sorted({w for w in words if re.search(r"\b" + re.escape(w) + r"\b", live)})
        if hits:
            stale.append((name, hits)); need += 1
        else:
            ok += 1; done += 1
    report.append((url, stale, ok))

print("%-34s %6s %6s" % ("PAGE", "PASTE", "done"))
print("-" * 50)
for url, stale, ok in report:
    print("%-34s %6d %6d" % (url, len(stale), ok))
print("-" * 50)
print("%-34s %6d %6d" % ("TOTAL", need, done))

print("\n=== BLOCKS TO PASTE, with the words still showing live ===")
for url, stale, ok in report:
    if not stale:
        continue
    print("\n%s" % url)
    for name, hits in stale:
        print("   [ ] %-58s %s" % (name[:58], ", ".join(hits[:6])))
