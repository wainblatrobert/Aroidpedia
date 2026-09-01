# -*- coding: utf-8 -*-
"""Are the guide images actually LIVE, not merely in the repo?

image-audit.py answers "is the file in docs/". That is a weaker question
than it looks: the morphology folders have a documented history of being
present in the repo and 404 from Pages, because the deploy workflow did not
fire on docs/*-morphology/** until filter v11. A file can be committed,
pushed, and still not served.

So: take every image the guide blocks reference, and ask GitHub Pages.

    python image-live-check.py            all folders
    python image-live-check.py morphology only folders matching a substring
"""
import os, re, glob, sys, io, collections, urllib.request, urllib.error

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

WEB = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"
DOCS = "C:/Users/nli0490/Claude/Aroidpedia/docs"
HOST = "https://wainblatrobert.github.io/Aroidpedia/"
FILTER = ([a for a in sys.argv[1:] if not a.startswith("-")] or [""])[0]

ATTR = re.compile(r'(?:src|poster|href|data-src|srcset)="([^"]+)"')
ASSET = re.compile(r'[.](jpg|jpeg|png|webp|gif|mp4|webm|svg|pdf)$', re.I)

refs = collections.defaultdict(set)
for f in glob.glob(WEB + "/**/*.txt", recursive=True):
    low = f.lower()
    if any(k in low for k in ("backup", "_spelling backup", "literature",
                              "_index", "stopgap", "session handoff",
                              "next session", "paste sheet")):
        continue
    s = open(f, encoding="utf-8", errors="replace").read()
    if 'class="apol' not in s and 'class="apoh' not in s:
        continue
    body = re.sub(r"(?s)<!--.*?-->", "", s)
    # ⚠ NOT JUST <img src>. A video's poster= and a <source src> are hosted
    # assets too, and an <img>-only scan reports them as orphans while never
    # checking whether they are live. The Amorphophallus seed video and its
    # poster are exactly that case. href= catches linked PDFs.
    for v in ATTR.findall(body):
        for u in v.split(","):                     # srcset is comma-separated
            u = u.strip().split(" ")[0]
            if u.startswith(HOST) and ASSET.search(u):
                rel = u[len(HOST):]
                # a root-level asset has NO folder. rsplit on a bare
                # "X.pdf" returns the filename as the folder, which built
                # the URL "X.pdf/X.pdf" and reported eight perfectly live
                # quick-guide PDFs as 404s. Keep the full path instead.
                folder, _, name = rel.rpartition("/")
                refs[folder or "(root)"].add((name, f))


def head(url):
    rq = urllib.request.Request(url, method="HEAD",
                                headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(rq, timeout=45) as r:
            return r.status, int(r.headers.get("Content-Length") or 0)
    except urllib.error.HTTPError as e:
        return e.code, 0
    except Exception as e:
        return str(e)[:28], 0


folders = sorted(k for k in refs if FILTER.lower() in k.lower())
if not folders:
    print("no folders match %r" % FILTER); raise SystemExit

print("%-30s %5s %6s %6s %7s" % ("FOLDER", "imgs", "inrepo", "live", "bytes~"))
print("-" * 62)
bad = []
for folder in folders:
    items = sorted(refs[folder])
    inrepo = live = 0
    tot = 0
    for fn, blk in items:
        here = os.path.exists(os.path.join(DOCS, "" if folder == "(root)" else folder, fn))
        inrepo += here
        code, n = head(HOST + (folder + "/" if folder != "(root)" else "") + fn)
        if code == 200:
            live += 1; tot += n
        else:
            bad.append((folder, fn, code, here, blk))
    print("%-30s %5d %6d %6d %6.1fMB%s"
          % (folder, len(items), inrepo, live, tot / 1e6,
             "" if live == len(items) else "   <<< PROBLEM"))

print("\n=== NOT SERVED BY PAGES ===")
if not bad:
    print("  none - every referenced image is live")
for folder, fn, code, here, blk in bad:
    print("  %s/%s" % (folder, fn))
    print("     HTTP %s | in repo: %s | block: %s"
          % (code, here, os.path.basename(blk)[:60]))
