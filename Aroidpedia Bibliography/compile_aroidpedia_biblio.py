#!/usr/bin/env python3
"""
Aroidpedia - multi-genus bibliography compiler.

For each genus listed in GENERA, enumerates every taxon page in the /journal
collection, extracts the numbered REFERENCES list at the end of each, dedupes
by URL, and emits into docs/:

    <slug>-biblio.json                       (consumed by the site code block)
    <slug>-biblio.csv                        (flat data)
    Aroidpedia-<Genus>-Bibliography.pdf      (comprehensive download)
    aroidpedia-biblio-index.json             (manifest of all built genera)

DISCOVERY NOTE
--------------
The genus page (/alocasia) CANNOT be used as an index: its Summary Blocks only
render a first batch of links server-side and load the rest via JavaScript.
Scraping it found 67 of 310 Alocasia pages. We therefore enumerate the journal
collection directly, from two independent sources that we union together:

  1. Squarespace collection JSON  /journal?format=json&nested=true (paginated)
     -> gives urlId, title, categories AND the full body HTML in one pass,
        so individual pages usually never need fetching.
  2. /sitemap.xml  -> a safety net that catches anything the API misses.

ADD A NEW GENUS: append one line to GENERA. Nothing else changes.

Requires: requests beautifulsoup4 reportlab
Run from the REPO ROOT:
    python "Aroidpedia Bibliography/compile_aroidpedia_biblio.py"
Optionally limit to certain genera:
    python "Aroidpedia Bibliography/compile_aroidpedia_biblio.py" alocasia
"""

import csv
import json
import os
import re
import sys
import time
import xml.etree.ElementTree as ET
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from urllib.parse import urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup

# ------------------------------- GENERA --------------------------------------
# "slug" must match BOTH the genus page path (/alocasia) and the taxon page
# prefix (/journal/alocasia-...). Add new genera here as they are built.
GENERA = [
    {"name": "Alocasia",       "slug": "alocasia"},
    {"name": "Amorphophallus", "slug": "amorphophallus"},
]

SITE    = "https://www.aroidpedia.com"
OUT_DIR = "docs"

# Kew POWO links are a per-taxon database lookup, not literature. They are kept
# against each taxon (and shown in PDF Part II) but never become bibliography
# entries in their own right.
KEW_HOSTS          = {"powo.science.kew.org", "www.kew.org", "kew.org"}
INCLUDE_KEW_IN_PDF = True
INCLUDE_KEW_IN_WEB = False

# Coverage reporting. Most cultivar/hybrid pages currently carry no REFERENCES
# section. Listing them inline would pad Part II with hundreds of dead entries,
# so by default they are collected into a "Part III - Taxa Awaiting References"
# appendix instead, which doubles as a citation to-do list.
OMIT_EMPTY_FROM_PART_II = True
INCLUDE_PART_III        = True

WORKERS = 6
DELAY   = 0.15          # politeness pause between requests
TIMEOUT = 25
UA      = "AroidpediaBiblioBot/1.0 (+https://www.aroidpedia.com)"

LEADING_ARTICLE = re.compile(r"^(the|a|an|die|der|das|le|la|les|l['\u2019])\s*", re.I)

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": UA})


# ------------------------------- HELPERS -------------------------------------
def get(url):
    """GET with retries. Returns text, or "" on failure."""
    for attempt in range(3):
        try:
            r = SESSION.get(url, timeout=TIMEOUT)
            if r.status_code == 200:
                time.sleep(DELAY)
                return r.text
        except requests.RequestException:
            pass
        time.sleep(1.5 * (attempt + 1))
    print(f"  ! failed: {url}", file=sys.stderr)
    return ""


def canon(url):
    """Normalized dedup key: scheme+host+path+query, no trailing slash, no fragment."""
    p = urlparse(url)
    return urlunparse(
        (p.scheme.lower(), p.netloc.lower(), p.path.rstrip("/"), "", p.query, "")
    ).lower()


def sort_key(title):
    return LEADING_ARTICLE.sub("", title.strip()).lower()


# ------------------- DISCOVERY (collection JSON + sitemap) --------------------
_JOURNAL_CACHE = None
_SITEMAP_CACHE = None


def journal_items():
    """Every post in /journal via the Squarespace JSON API, paginated."""
    global _JOURNAL_CACHE
    if _JOURNAL_CACHE is not None:
        return _JOURNAL_CACHE

    items, offset, page = [], None, 0
    while page < 80:                                   # safety stop
        url = f"{SITE}/journal?format=json&nested=true"
        if offset:
            url += f"&offset={offset}"
        try:
            r = SESSION.get(url, timeout=TIMEOUT)
            if r.status_code != 200:
                print(f"  ! journal JSON HTTP {r.status_code}", file=sys.stderr)
                break
            d = r.json()
        except Exception as ex:                        # noqa: BLE001
            print(f"  ! journal JSON unavailable ({ex})", file=sys.stderr)
            break

        batch = d.get("items", [])
        if not batch:
            break
        items += batch

        pg = d.get("pagination") or {}
        if not pg.get("nextPage"):
            break
        offset = pg.get("nextPageOffset")
        if not offset:
            break
        page += 1
        time.sleep(DELAY)

    print(f"  journal API: {len(items)} posts")
    _JOURNAL_CACHE = items
    return items


def sitemap_paths():
    """All /journal/ paths from sitemap.xml (handles sitemap-index files)."""
    global _SITEMAP_CACHE
    if _SITEMAP_CACHE is not None:
        return _SITEMAP_CACHE

    def locs(xml):
        if not xml:
            return []
        try:
            root = ET.fromstring(xml)
        except ET.ParseError:
            return []
        out = []
        for e in root.iter():
            tag = e.tag.split("}")[-1]
            if tag == "loc" and e.text:
                out.append(e.text.strip())
        return out

    found = locs(get(f"{SITE}/sitemap.xml"))
    subs = [u for u in found if u.endswith(".xml")]
    urls = []
    if subs:
        for s in subs:
            urls += locs(get(s))
    else:
        urls = found

    paths = sorted({urlparse(u).path.rstrip("/") for u in urls if "/journal/" in u})
    print(f"  sitemap: {len(paths)} journal paths")
    _SITEMAP_CACHE = paths
    return paths


def discover_taxa(genus):
    """Union of JSON API + sitemap. Carries body HTML and category when known."""
    slug   = genus["slug"]
    prefix = f"/journal/{slug}-"
    found  = {}                                        # path -> taxon dict

    # (a) collection JSON - title, category and full body in one shot
    for it in journal_items():
        uid = (it.get("urlId") or "").strip()
        if not uid.startswith(slug + "-"):
            continue
        path = f"/journal/{uid}"
        cats = it.get("categories") or []
        found[path] = {
            "url":       SITE + path,
            "slug":      uid,
            "name":      " ".join((it.get("title") or uid.replace("-", " ")).split()),
            "kind_hint": cats[0] if cats else None,
            "body":      it.get("body") or None,       # None -> fetch the page
        }

    # (b) sitemap - catches anything the API missed
    for path in sitemap_paths():
        if not path.startswith(prefix) or path in found:
            continue
        uid = path.rsplit("/", 1)[-1]
        found[path] = {
            "url": SITE + path, "slug": uid,
            "name": uid.replace("-", " ").upper(),
            "kind_hint": None, "body": None,
        }

    taxa   = sorted(found.values(), key=lambda t: t["name"].lower())
    n_body = sum(1 for t in taxa if t["body"])
    print(f"  {len(taxa)} {genus['name']} pages "
          f"({n_body} parsed from API, {len(taxa) - n_body} need fetching)")
    return taxa


# ------------------ EXTRACT ONE TAXON'S REFERENCES ---------------------------
def refs_from_html(html, base_url):
    """Pull the numbered REFERENCES list out of a post's HTML."""
    soup = BeautifulSoup(html, "html.parser")

    label = None
    for el in soup.find_all(["p", "strong", "b", "h1", "h2", "h3",
                             "h4", "h5", "h6", "span", "div"]):
        txt = el.get_text(" ", strip=True)
        if len(txt) < 40 and re.match(r"^references\b", txt, re.I):
            label = el
            break
    if label is None:
        return None, []

    ref_list = label.find_next(["ol", "ul"])
    if ref_list is None:
        return None, []

    kew, refs = None, []
    for a in ref_list.select("a[href]"):
        title = " ".join(a.get_text(strip=True).split())
        href  = (a.get("href") or "").strip()
        if not title or not href or href.startswith(("#", "mailto:", "javascript:")):
            continue
        url = urljoin(base_url, href)
        if urlparse(url).netloc.lower() in KEW_HOSTS:
            kew = url
            continue
        refs.append({"title": title, "url": url, "key": canon(url)})
    return kew, refs


def parse_taxon(taxon):
    out = dict(taxon, kind=taxon.get("kind_hint") or "Unclassified", kew=None, refs=[])

    html = taxon.get("body")
    if not html:                                       # no body from API -> fetch page
        page = get(taxon["url"])
        if not page:
            out.pop("body", None)
            out.pop("kind_hint", None)
            return out
        if not taxon.get("kind_hint"):
            soup = BeautifulSoup(page, "html.parser")
            cat = soup.select_one('a[href*="/journal/category/"]')
            if cat:
                out["kind"] = cat.get_text(strip=True) or "Unclassified"
        html = page

    kew, refs = refs_from_html(html, taxon["url"])
    out["kew"], out["refs"] = kew, refs

    # body HTML is bulky - keep it out of the JSON/PDF output
    out.pop("body", None)
    out.pop("kind_hint", None)
    return out


# ------------------------------ AGGREGATE ------------------------------------
def build_genus(genus):
    print(f"\n=== {genus['name']} ===")
    taxa = discover_taxa(genus)
    if not taxa:
        print("  ! no taxon pages found - skipping.")
        return None

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        parsed = list(pool.map(parse_taxon, taxa))

    biblio = {}
    for t in parsed:
        for r in t["refs"]:
            e = biblio.setdefault(r["key"],
                                  {"title": r["title"], "url": r["url"], "taxa": []})
            if len(r["title"]) > len(e["title"]):      # prefer the fullest label seen
                e["title"] = r["title"]
            if not any(x["url"] == t["url"] for x in e["taxa"]):
                e["taxa"].append({"name": t["name"], "url": t["url"], "kind": t["kind"]})

    entries = sorted(biblio.values(), key=lambda e: sort_key(e["title"]))
    for e in entries:
        e["taxa"].sort(key=lambda x: x["name"])
        e["count"] = len(e["taxa"])
        e["host"]  = urlparse(e["url"]).netloc.lower().replace("www.", "")

    parsed.sort(key=lambda t: (t["kind"], t["name"]))
    cited = [t for t in parsed if t["refs"]]
    gaps  = [t for t in parsed if not t["refs"]]

    print(f"  {len(entries)} unique sources | "
          f"{len(cited)}/{len(parsed)} taxa carry references")

    return {
        "genus":        genus["name"],
        "slug":         genus["slug"],
        "compiled":     date.today().isoformat(),
        "source":       f"{SITE}/{genus['slug']}",
        "taxon_count":  len(parsed),
        "source_count": len(entries),
        "cited_count":  len(cited),
        "gap_count":    len(gaps),
        "pdf":          f"Aroidpedia-{genus['name']}-Bibliography.pdf",
        "kew_excluded_from_bibliography": not INCLUDE_KEW_IN_WEB,
        "bibliography": entries,
        "taxa":         parsed,
    }


# ------------------------------- WRITERS -------------------------------------
def write_json(d):
    p = os.path.join(OUT_DIR, f"{d['slug']}-biblio.json")
    with open(p, "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
    print(f"  -> {p}")


def write_csv(d):
    p = os.path.join(OUT_DIR, f"{d['slug']}-biblio.csv")
    with open(p, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["title", "url", "repository", "cited_by_count", "cited_by_taxa"])
        for e in d["bibliography"]:
            w.writerow([e["title"], e["url"], e["host"], e["count"],
                        "; ".join(t["name"] for t in e["taxa"])])
    print(f"  -> {p}")


def write_pdf(d):
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER
    from reportlab.lib.pagesizes import LETTER
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.platypus import (BaseDocTemplate, Frame, HRFlowable, PageBreak,
                                    PageTemplate, Paragraph, Spacer)

    CREAM   = colors.HexColor("#F6F1E7")
    SAGE    = colors.HexColor("#8A9A7B")
    SAGE_DK = colors.HexColor("#5F6F52")
    INK     = colors.HexColor("#2F2A24")
    MUTED   = colors.HexColor("#8A8172")

    path = os.path.join(OUT_DIR, d["pdf"])
    ss   = getSampleStyleSheet()

    def S(name, **kw):
        base = dict(parent=ss["Normal"], fontName="Times-Roman", fontSize=10,
                    leading=13.5, textColor=INK)
        base.update(kw)
        return ParagraphStyle(name, **base)

    st = {
        "title": S("t", fontName="Times-Bold", fontSize=30, leading=34,
                   alignment=TA_CENTER, textColor=SAGE_DK, spaceAfter=6),
        "sub":   S("s", fontName="Courier", fontSize=8.5, leading=12,
                   alignment=TA_CENTER, textColor=MUTED, spaceAfter=4),
        "part":  S("p", fontName="Courier-Bold", fontSize=10, leading=14,
                   textColor=SAGE_DK, spaceBefore=6, spaceAfter=10),
        "group": S("g", fontName="Courier-Bold", fontSize=8.5, leading=12,
                   textColor=SAGE_DK, spaceBefore=14, spaceAfter=6),
        "entry": S("e", fontSize=10.5, leading=14, spaceAfter=1,
                   leftIndent=18, firstLineIndent=-18),
        "cited": S("c", fontName="Courier", fontSize=7, leading=10,
                   textColor=MUTED, leftIndent=18, spaceAfter=7),
        "taxon": S("x", fontName="Times-Bold", fontSize=12, leading=15,
                   textColor=SAGE_DK, spaceBefore=11, spaceAfter=1),
        "meta":  S("m", fontName="Courier", fontSize=7, leading=10,
                   textColor=MUTED, spaceAfter=4),
        "ref":   S("r", fontSize=9.5, leading=12.5, leftIndent=16,
                   firstLineIndent=-10, spaceAfter=1),
        "none":  S("n", fontSize=9, leading=12, leftIndent=16,
                   textColor=MUTED, spaceAfter=2),
        "gap":   S("gp", fontSize=9.5, leading=13, leftIndent=10, spaceAfter=0),
    }

    def esc(text):
        return (text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

    def link(text, url, color=INK):
        return f'<link href="{esc(url)}" color="#{color.hexval()[2:]}">{esc(text)}</link>'

    def decorate(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(CREAM)
        canvas.rect(0, 0, LETTER[0], LETTER[1], stroke=0, fill=1)
        canvas.setFillColor(MUTED)
        canvas.setFont("Courier", 7)
        canvas.drawString(0.9 * inch, 0.6 * inch,
                          f"AROIDPEDIA - {d['genus'].upper()} BIBLIOGRAPHY - {d['compiled']}")
        canvas.drawRightString(LETTER[0] - 0.9 * inch, 0.6 * inch,
                               str(canvas.getPageNumber()))
        canvas.setStrokeColor(SAGE)
        canvas.setLineWidth(0.5)
        canvas.line(0.9 * inch, 0.78 * inch, LETTER[0] - 0.9 * inch, 0.78 * inch)
        canvas.restoreState()

    doc = BaseDocTemplate(path, pagesize=LETTER,
                          leftMargin=0.9 * inch, rightMargin=0.9 * inch,
                          topMargin=0.9 * inch, bottomMargin=1.0 * inch,
                          title=f"Aroidpedia - {d['genus']} Bibliography",
                          author="Aroidpedia.com")
    doc.addPageTemplates([PageTemplate(
        id="main",
        frames=[Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f")],
        onPage=decorate)])

    F = []
    def rule():
        return HRFlowable(width="100%", thickness=0.6, color=SAGE,
                          spaceBefore=6, spaceAfter=10)

    pct = round(100 * d["cited_count"] / d["taxon_count"]) if d["taxon_count"] else 0

    # ---- Cover ----
    F += [Spacer(1, 1.7 * inch),
          Paragraph(d["genus"].upper(), st["title"]),
          Paragraph("A Reference Bibliography",
                    S("sub2", fontName="Times-Italic", fontSize=14, leading=18,
                      alignment=TA_CENTER, textColor=INK, spaceAfter=22)),
          rule(),
          Paragraph(f"{d['source_count']} SOURCES &#183; {d['taxon_count']} TAXA",
                    st["sub"]),
          Paragraph(f"REFERENCES PRESENT FOR {d['cited_count']} OF "
                    f"{d['taxon_count']} TAXA ({pct}%)", st["sub"]),
          Paragraph(f"COMPILED {d['compiled']} FROM AROIDPEDIA.COM", st["sub"]),
          Spacer(1, 0.3 * inch),
          Paragraph(f"Automatically compiled from the References section of every "
                    f"{d['genus']} species, cultivar and hybrid page on Aroidpedia. "
                    f"Part I lists every source alphabetically with the taxa citing "
                    f"it. Part II lists each taxon with its own references, for "
                    f"readers wishing to dive deeper into a single plant."
                    + (" Part III lists taxa whose pages do not yet carry a "
                       "References section." if INCLUDE_PART_III else ""),
                    S("intro", fontName="Times-Italic", fontSize=10, leading=15,
                      alignment=TA_CENTER, textColor=MUTED)),
          PageBreak()]

    # ---- Part I: master bibliography ----
    F += [Paragraph("PART I - MASTER BIBLIOGRAPHY (A-Z)", st["part"]), rule()]
    letter = None
    for e in d["bibliography"]:
        first = sort_key(e["title"])[:1].upper()
        first = first if first.isalpha() else "#"
        if first != letter:
            letter = first
            F.append(Paragraph(letter, st["group"]))
        F.append(Paragraph(link(e["title"], e["url"]), st["entry"]))
        names = ", ".join(t["name"].title() for t in e["taxa"])
        F.append(Paragraph(f"cited by {e['count']} &#8212; {esc(names)}", st["cited"]))

    # ---- Part II: by taxon ----
    F += [PageBreak(), Paragraph("PART II - REFERENCES BY TAXON", st["part"]), rule()]

    listed = [t for t in d["taxa"] if t["refs"]] if OMIT_EMPTY_FROM_PART_II else d["taxa"]
    by_kind = defaultdict(list)
    for t in listed:
        by_kind[t["kind"]].append(t)

    order = ["Species", "Cultivar", "Cultivars", "Hybrid", "Hybrids"]
    kinds = [k for k in order if k in by_kind] + \
            [k for k in sorted(by_kind) if k not in order]

    for kind in kinds:
        group = by_kind[kind]
        F.append(Paragraph(f"{kind.upper()} ({len(group)})", st["group"]))
        for t in group:
            F.append(Paragraph(link(t["name"].title(), t["url"], SAGE_DK), st["taxon"]))
            bits = [esc(f"aroidpedia.com/journal/{t['slug']}")]
            if INCLUDE_KEW_IN_PDF and t["kew"]:
                bits.append(link("Kew POWO", t["kew"], MUTED))
            F.append(Paragraph(" &#183; ".join(bits), st["meta"]))
            if t["refs"]:
                for i, r in enumerate(t["refs"], 1):
                    F.append(Paragraph(f"{i}. {link(r['title'], r['url'])}", st["ref"]))
            else:
                F.append(Paragraph("No references listed.", st["none"]))

    # ---- Part III: coverage gaps ----
    if INCLUDE_PART_III:
        gaps = [t for t in d["taxa"] if not t["refs"]]
        F += [PageBreak(),
              Paragraph("PART III - TAXA AWAITING REFERENCES", st["part"]),
              rule(),
              Paragraph(f"{len(gaps)} of {d['taxon_count']} {d['genus']} pages do not "
                        f"yet carry a References section. Listed here as a coverage "
                        f"record.",
                        S("gapintro", fontName="Times-Italic", fontSize=9.5,
                          leading=13, textColor=MUTED, spaceAfter=8))]
        gap_kind = defaultdict(list)
        for t in gaps:
            gap_kind[t["kind"]].append(t)
        gkinds = [k for k in order if k in gap_kind] + \
                 [k for k in sorted(gap_kind) if k not in order]
        for kind in gkinds:
            group = gap_kind[kind]
            F.append(Paragraph(f"{kind.upper()} ({len(group)})", st["group"]))
            for t in group:
                F.append(Paragraph(link(t["name"].title(), t["url"], INK), st["gap"]))

    doc.build(F)
    print(f"  -> {path}")


def write_index(built):
    p = os.path.join(OUT_DIR, "aroidpedia-biblio-index.json")
    manifest = {
        "compiled": date.today().isoformat(),
        "genera": [{
            "genus":        d["genus"],
            "slug":         d["slug"],
            "taxon_count":  d["taxon_count"],
            "source_count": d["source_count"],
            "cited_count":  d["cited_count"],
            "json":         f"{d['slug']}-biblio.json",
            "pdf":          d["pdf"],
        } for d in built],
    }
    with open(p, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    print(f"\n-> {p}")


# --------------------------------- MAIN --------------------------------------
if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    only  = [a.lower() for a in sys.argv[1:]]          # optional genus filter
    built = []

    for g in GENERA:
        if only and g["slug"] not in only:
            continue
        d = build_genus(g)
        if not d:
            continue
        write_json(d)
        write_csv(d)
        write_pdf(d)
        built.append(d)

    if not built:
        sys.exit("No genera built.")

    write_index(built)
    print("\nDone: " + " | ".join(
        f"{d['genus']}: {d['source_count']} sources, "
        f"{d['cited_count']}/{d['taxon_count']} taxa cited" for d in built))
