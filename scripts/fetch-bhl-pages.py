# -*- coding: utf-8 -*-
"""
AROIDPEDIA - FETCH BHL PAGES   (v1, 2026-09-06)
Path in repo: scripts/fetch-bhl-pages.py

Gets protologue pages out of the Biodiversity Heritage Library WITHOUT a
browser, an API key or the Playwright harness (tools/bhl-fetch.mjs).

    python scripts/fetch-bhl-pages.py resolve 86826-1                 # IPNI id -> BHL page -> scan leaf
    python scripts/fetch-bhl-pages.py resolve --journal "Nova Guinea" --volume 8 --page 249 --year 1910
    python scripts/fetch-bhl-pages.py search mobot31753002757398 "Cyrtosperma"     # leaves that mention a term
    python scripts/fetch-bhl-pages.py fetch mobot31753002757398 62 63 --out scans/Schott-1857-Wochenbl-7
    python scripts/fetch-bhl-pages.py fetch --ipni 86826-1 --spread 1 --out scans/merkusii-protologue

------------------------------------------------------------------
THE ROUTE (measured 2026-09-05/06)
------------------------------------------------------------------
BHL's pages sit behind a Cloudflare browser challenge: /page/, /item/,
/api2, /api3 (without a key) and even /openurl for a bad request all
answer 403 to scripts. Two doors are open:

  1. /openurl?...   the resolver IPNI links to for every protologue. Given
                    a bibliography id, or a journal title with volume, page
                    and year, it answers 302 -> /page/<BHL page id>.
  2. /pageimage/<id>   answers 302 -> an OPEN Amazon S3 bucket
                    (bhl-open-data.s3.us-east-2.amazonaws.com/web/<IA id>/
                    <IA id>_<leaf>_full.webp), keyed by the Internet Archive
                    identifier of the scan and the 4-digit leaf number.

Once the identifier and one leaf are known, every leaf of that volume can
be read from the bucket, and Internet Archive's own services supply the
OCR text (BookReader text API) and a full-text search inside the item.

/!\ THE OCR TEXT API RUNS ONE LEAF BEHIND THE IMAGES: the text for image
leaf L is fetched with page=L-1 (measured on 20 volumes from six
contributors, wrong on none). The search-inside service numbers pages the
same as the image leaves. A strip of page headers is still worth a glance.

Not every journal is on BHL. IPNI's record says so: a publication with no
`bhlLink` (the Tuscan horticultural bulletin that holds Cyrtosperma
macrotum, for one) is not there, and the resolver answers openurlnone.

Requires: requests pillow
"""
import argparse, io, json, os, re, sys, time, urllib.parse

try:
    import requests
    from PIL import Image
except ImportError:
    sys.exit("pip install requests pillow")

UA = "Aroidpedia protologue fetch (github.com/wainblatrobert/Aroidpedia)"
S3 = "https://bhl-open-data.s3.us-east-2.amazonaws.com/web/{id}/{id}_{leaf:04d}_full.webp"
LSID = re.compile(r"names:(\d+-\d+)")
KEY = re.compile(r"/web/([^/]+)/\1_(\d{4})_")
sess = requests.Session()
sess.headers["User-Agent"] = UA


def get(url, **kw):
    r = sess.get(url, timeout=120, **kw)
    r.raise_for_status()
    return r


def redirect_of(url):
    r = sess.get(url, timeout=60, allow_redirects=False)
    return r.headers.get("Location", "")


# ------------------------------------------------------------- resolve
def resolve_ipni(ipni_id):
    """IPNI id -> (openurl, BHL page id, IA identifier, leaf)."""
    rec = get("https://www.ipni.org/api/1/n/" + ipni_id).json()
    link = (rec.get("bhlLink") or "").replace("http://", "https://")
    if not link:
        return {"ipni": ipni_id, "name": rec.get("name"), "reference": rec.get("reference"),
                "error": "IPNI carries no BHL link for this publication"}
    out = {"ipni": ipni_id, "name": rec.get("name"), "reference": rec.get("reference"), "openurl": link}
    out.update(resolve_openurl(link))
    return out


def resolve_openurl(url):
    loc = redirect_of(url)
    m = re.search(r"/page/(\d+)", loc)
    if not m:
        m2 = re.search(r"openurlmultiple\.aspx\?id=p(\d+)", loc)
        if m2:
            m = m2
        else:
            return {"error": "resolver answered " + (loc or "nothing")}
    page = m.group(1)
    s3 = redirect_of("https://www.biodiversitylibrary.org/pageimage/" + page)
    k = KEY.search(s3)
    return {"bhl_page": page, "bhl_url": "https://www.biodiversitylibrary.org/page/" + page,
            "ia_identifier": k.group(1) if k else None, "leaf": int(k.group(2)) if k else None, "s3": s3}


def openurl_journal(journal, volume, page, year=None):
    p = {"ctx_ver": "Z39.88-2004", "url_ver": "z39.88-2004", "rft_val_fmt": "info:ofi/fmt:kev:mtx:journal",
         "rft.jtitle": journal, "rft.volume": str(volume), "rft.spage": str(page)}
    if year:
        p["rft.date"] = str(year)
    return "https://www.biodiversitylibrary.org/openurl?" + urllib.parse.urlencode(p)


# ------------------------------------------------------------- IA helpers
def ia_meta(ident):
    return get("https://archive.org/metadata/" + ident).json()


def ia_search(ident, term):
    m = ia_meta(ident)
    url = "https://%s/fulltext/inside.php?%s" % (m["server"], urllib.parse.urlencode(
        {"item_id": ident, "doc": ident, "path": m["dir"], "q": term}))
    hits = {}
    for mt in get(url).json().get("matches", []):
        text = re.sub(r"\s+", " ", mt.get("text", "")).replace("<IA_FTS_MATCH>", "[").replace("</IA_FTS_MATCH>", "]")
        for p in mt.get("par", []):
            hits.setdefault(int(p["page"]), text[:160])          # search page N = image leaf N
    return m, hits


def ia_text(ident, leaf, m):
    url = "https://%s/BookReader/BookReaderGetTextWrapper.php?%s" % (m["server"], urllib.parse.urlencode(
        {"path": "%s/%s_djvu.xml" % (m["dir"], ident), "mode": "djvu_xml", "page": leaf - 1, "callback": "cb"}))
    x = get(url).text
    lines = [" ".join(w.strip() for w in re.findall(r"<WORD[^>]*>(.*?)</WORD>", ln, re.S))
             for ln in re.findall(r"<LINE>(.*?)</LINE>", x, re.S)]
    return "\n".join(lines)


def fetch_leaf(ident, leaf, out_dir, label, m=None):
    os.makedirs(out_dir, exist_ok=True)
    jp = os.path.join(out_dir, "%s-leaf%04d.jpg" % (label, leaf))
    tp = jp[:-4] + ".txt"
    if not os.path.exists(jp):
        b = None
        for url in (S3.format(id=ident, leaf=leaf),
                    "https://archive.org/download/%s/page/leaf%d_w2500.jpg" % (ident, leaf)):
            try:
                b = get(url).content
                break
            except Exception:
                continue
        if b is None:
            print("  leaf %d: no image" % leaf)
            return
        im = Image.open(io.BytesIO(b)); im.load()
        im.convert("RGB").save(jp, "JPEG", quality=88, optimize=True)
        print("  leaf %d: %dx%d -> %s" % (leaf, im.width, im.height, os.path.basename(jp)))
    if not os.path.exists(tp):
        try:
            m = m or ia_meta(ident)
            t = ia_text(ident, leaf, m)
            io.open(tp, "w", encoding="utf-8").write(t)
            print("  leaf %d: text | %s" % (leaf, re.sub(r"\s+", " ", t)[:90]))
        except Exception as e:
            print("  leaf %d: no OCR text (%s)" % (leaf, str(e)[:50]))
    time.sleep(0.3)


# ------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__.split("----")[0], formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("resolve", help="IPNI id, or --journal/--volume/--page, to BHL page and scan leaf")
    r.add_argument("ipni", nargs="?")
    r.add_argument("--journal"); r.add_argument("--volume"); r.add_argument("--page"); r.add_argument("--year")
    s = sub.add_parser("search", help="leaves of an Internet Archive item that mention a term")
    s.add_argument("identifier"); s.add_argument("term")
    f = sub.add_parser("fetch", help="page images + OCR text for leaves of an item")
    f.add_argument("identifier", nargs="?"); f.add_argument("leaves", nargs="*", type=int)
    f.add_argument("--ipni", help="resolve this IPNI id and fetch its leaf")
    f.add_argument("--spread", type=int, default=0, help="also fetch this many leaves either side")
    f.add_argument("--out", default="bhl-pages"); f.add_argument("--label")
    a = ap.parse_args()

    if a.cmd == "resolve":
        if a.ipni:
            print(json.dumps(resolve_ipni(a.ipni), indent=1))
        elif a.journal and a.volume and a.page:
            print(json.dumps(resolve_openurl(openurl_journal(a.journal, a.volume, a.page, a.year)), indent=1))
        else:
            ap.error("give an IPNI id or --journal --volume --page")
    elif a.cmd == "search":
        m, hits = ia_search(a.identifier, a.term)
        print("%s | %s | vol %s" % (a.identifier, str(m.get("metadata", {}).get("title"))[:60], m.get("metadata", {}).get("volume")))
        for leaf in sorted(hits):
            print("  leaf %4d | %s" % (leaf, hits[leaf]))
    elif a.cmd == "fetch":
        ident, leaves = a.identifier, list(a.leaves)
        if a.ipni:
            res = resolve_ipni(a.ipni)
            if res.get("error"):
                sys.exit(res["error"])
            ident, leaves = res["ia_identifier"], [res["leaf"]]
            print("%s -> BHL page %s -> %s leaf %d" % (res["name"], res["bhl_page"], ident, res["leaf"]))
        if not ident or not leaves:
            ap.error("give an identifier and leaves, or --ipni")
        want = sorted({l + d for l in leaves for d in range(-a.spread, a.spread + 1) if l + d >= 0})
        label = a.label or ident
        m = ia_meta(ident)
        json.dump({"identifier": ident, "title": m.get("metadata", {}).get("title"), "volume": m.get("metadata", {}).get("volume"),
                   "leaves": want, "ia_url": "https://archive.org/details/" + ident},
                  open(os.path.join(a.out if os.path.isdir(a.out) else (os.makedirs(a.out, exist_ok=True) or a.out), "source.json"), "w"), indent=1)
        for leaf in want:
            fetch_leaf(ident, leaf, a.out, label, m)
        print("->", a.out)


if __name__ == "__main__":
    main()
