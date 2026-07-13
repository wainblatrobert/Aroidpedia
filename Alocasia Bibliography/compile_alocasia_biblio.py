#!/usr/bin/env python3
"""
Aroidpedia — Alocasia master bibliography compiler.

Crawls https://www.aroidpedia.com/alocasia, follows every /journal/alocasia-*
taxon page, extracts the numbered REFERENCES list at the end of each, dedupes
by URL, and emits:

    docs/alocasia-biblio.json                  (consumed by the site)
    docs/alocasia-biblio.csv                   (flat data)
    docs/Aroidpedia-Alocasia-Bibliography.pdf  (comprehensive download)

Requires: requests beautifulsoup4 reportlab
"""

import csv, json, os, re, sys, time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from urllib.parse import urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup

# ───────────────────────── CONFIG ─────────────────────────
GENUS_URL      = "https://www.aroidpedia.com/alocasia"
GENUS_NAME     = "Alocasia"
TAXON_RE       = re.compile(r"^/journal/alocasia-", re.I)
OUT_DIR        = "docs"

# Hosts excluded from the *bibliography* (still captured per-taxon).
KEW_HOSTS      = {"powo.science.kew.org", "www.kew.org", "kew.org"}
INCLUDE_KEW_IN_PDF = True      # show each taxon's POWO link in the PDF
INCLUDE_KEW_IN_WEB = False     # ...but not in the web A–Z list

WORKERS        = 6
DELAY          = 0.15          # politeness pause per request
TIMEOUT        = 25
UA             = "AroidpediaBiblioBot/1.0 (+https://www.aroidpedia.com)"

LEADING_ARTICLE = re.compile(r"^(the|a|an|die|der|das|le|la|les|l['’])\s*", re.I)

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": UA})


# ───────────────────────── HELPERS ─────────────────────────
def get(url):
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
    """Normalized dedup key: host + path + query, no trailing slash, no fragment."""
    p = urlparse(url)
    path = p.path.rstrip("/")
    return urlunparse((p.scheme.lower(), p.netloc.lower(), path, "", p.query, "")).lower()


def sort_key(title):
    return LEADING_ARTICLE.sub("", title.strip()).lower()


# ─────────────────── 1. DISCOVER TAXON PAGES ───────────────────
def discover_taxa():
    soup = BeautifulSoup(get(GENUS_URL), "html.parser")
    seen, taxa = set(), []
    for a in soup.select('a[href*="/journal/alocasia-"]'):
        href = urljoin(GENUS_URL, a.get("href", ""))
        p = urlparse(href)
        if not TAXON_RE.match(p.path):
            continue
        if "/tag/" in p.path or "/category/" in p.path or "author=" in (p.query or ""):
            continue
        path = p.path.rstrip("/")
        if path in seen:
            continue
        seen.add(path)
        label = " ".join(a.get_text(strip=True).split())
        taxa.append({
            "url":  f"https://www.aroidpedia.com{path}",
            "slug": path.rsplit("/", 1)[-1],
            "name": label or path.rsplit("/", 1)[-1].replace("-", " ").upper(),
        })
    return sorted(taxa, key=lambda t: t["name"])


# ─────────────── 2. EXTRACT ONE TAXON'S REFERENCES ───────────────
def parse_taxon(taxon):
    """Return taxon dict enriched with .kind, .kew, .refs[]."""
    soup = BeautifulSoup(get(taxon["url"]), "html.parser")
    out = dict(taxon, kind="Unclassified", kew=None, refs=[])

    # Squarespace category link tells us Species / Cultivar / Hybrid
    cat = soup.select_one('a[href*="/journal/category/"]')
    if cat:
        out["kind"] = cat.get_text(strip=True) or "Unclassified"

    # Locate the short "REFERENCES" label…
    label = None
    for el in soup.find_all(["p", "strong", "b", "h1", "h2", "h3", "h4", "h5", "h6", "span"]):
        txt = el.get_text(" ", strip=True)
        if len(txt) < 40 and re.match(r"^references\b", txt, re.I):
            label = el
            break
    if label is None:
        return out

    # …then the first list that follows it in document order.
    ref_list = label.find_next(["ol", "ul"])
    if ref_list is None:
        return out

    for a in ref_list.select("a[href]"):
        title = " ".join(a.get_text(strip=True).split())
        href = a.get("href", "").strip()
        if not title or not href or href.startswith(("#", "mailto:", "javascript:")):
            continue
        url = urljoin(taxon["url"], href)
        host = urlparse(url).netloc.lower()
        if host in KEW_HOSTS:
            out["kew"] = url          # captured separately, not a bibliography entry
            continue
        out["refs"].append({"title": title, "url": url, "key": canon(url)})
    return out


# ─────────────────────── 3. AGGREGATE ───────────────────────
def build():
    taxa = discover_taxa()
    print(f"Discovered {len(taxa)} {GENUS_NAME} pages.")

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        parsed = list(pool.map(parse_taxon, taxa))

    biblio = {}                       # key -> entry
    for t in parsed:
        for r in t["refs"]:
            e = biblio.setdefault(r["key"], {"title": r["title"], "url": r["url"], "taxa": []})
            if len(r["title"]) > len(e["title"]):      # prefer the fullest label seen
                e["title"] = r["title"]
            if not any(x["url"] == t["url"] for x in e["taxa"]):
                e["taxa"].append({"name": t["name"], "url": t["url"], "kind": t["kind"]})

    entries = sorted(biblio.values(), key=lambda e: sort_key(e["title"]))
    for e in entries:
        e["taxa"].sort(key=lambda x: x["name"])
        e["count"] = len(e["taxa"])
        e["host"] = urlparse(e["url"]).netloc.lower().replace("www.", "")

    parsed.sort(key=lambda t: (t["kind"], t["name"]))
    no_refs = [t["name"] for t in parsed if not t["refs"]]
    if no_refs:
        print(f"  ({len(no_refs)} pages carry no REFERENCES section — skipped)")

    return {
        "genus": GENUS_NAME,
        "compiled": date.today().isoformat(),
        "source": GENUS_URL,
        "taxon_count": len(parsed),
        "source_count": len(entries),
        "kew_excluded_from_bibliography": not INCLUDE_KEW_IN_WEB,
        "bibliography": entries,
        "taxa": parsed,
    }


# ─────────────────────── 4. WRITERS ───────────────────────
def write_json(data):
    path = os.path.join(OUT_DIR, "alocasia-biblio.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"→ {path}")


def write_csv(data):
    path = os.path.join(OUT_DIR, "alocasia-biblio.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["title", "url", "repository", "cited_by_count", "cited_by_taxa"])
        for e in data["bibliography"]:
            w.writerow([e["title"], e["url"], e["host"], e["count"],
                        "; ".join(t["name"] for t in e["taxa"])])
    print(f"→ {path}")


def write_pdf(data):
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER
    from reportlab.lib.pagesizes import LETTER
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.platypus import (BaseDocTemplate, Frame, PageBreak, PageTemplate,
                                    Paragraph, Spacer, HRFlowable)

    CREAM, SAGE, SAGE_DK, INK, MUTED = (
        colors.HexColor("#F6F1E7"), colors.HexColor("#8A9A7B"),
        colors.HexColor("#5F6F52"), colors.HexColor("#2F2A24"),
        colors.HexColor("#8A8172"))

    path = os.path.join(OUT_DIR, "Aroidpedia-Alocasia-Bibliography.pdf")
    ss = getSampleStyleSheet()

    def S(name, **kw):
        base = dict(parent=ss["Normal"], fontName="Times-Roman", fontSize=10,
                    leading=13.5, textColor=INK)
        base.update(kw)
        return ParagraphStyle(name, **base)

    st = {
        "title":   S("t", fontName="Times-Bold", fontSize=30, leading=34,
                     alignment=TA_CENTER, textColor=SAGE_DK, spaceAfter=6),
        "sub":     S("s", fontName="Courier", fontSize=8.5, leading=12,
                     alignment=TA_CENTER, textColor=MUTED, spaceAfter=4),
        "part":    S("p", fontName="Courier-Bold", fontSize=10, leading=14,
                     textColor=SAGE_DK, spaceBefore=6, spaceAfter=10),
        "group":   S("g", fontName="Courier-Bold", fontSize=8.5, leading=12,
                     textColor=SAGE_DK, spaceBefore=14, spaceAfter=6),
        "entry":   S("e", fontSize=10.5, leading=14, spaceAfter=1, leftIndent=18,
                     firstLineIndent=-18),
        "cited":   S("c", fontName="Courier", fontSize=7, leading=10,
                     textColor=MUTED, leftIndent=18, spaceAfter=7),
        "taxon":   S("x", fontName="Times-Bold", fontSize=12, leading=15,
                     textColor=SAGE_DK, spaceBefore=11, spaceAfter=1),
        "meta":    S("m", fontName="Courier", fontSize=7, leading=10,
                     textColor=MUTED, spaceAfter=4),
        "ref":     S("r", fontSize=9.5, leading=12.5, leftIndent=16,
                     firstLineIndent=-10, spaceAfter=1),
        "none":    S("n", fontSize=9, leading=12, leftIndent=16,
                     textColor=MUTED, spaceAfter=2),
    }

    def link(text, url, color=INK):
        safe = (text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))
        return f'<link href="{url}" color="#{color.hexval()[2:]}">{safe}</link>'

    def decorate(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(CREAM)
        canvas.rect(0, 0, LETTER[0], LETTER[1], stroke=0, fill=1)
        canvas.setFillColor(MUTED); canvas.setFont("Courier", 7)
        canvas.drawString(0.9 * inch, 0.6 * inch,
                          f"AROIDPEDIA · {GENUS_NAME.upper()} BIBLIOGRAPHY · {data['compiled']}")
        canvas.drawRightString(LETTER[0] - 0.9 * inch, 0.6 * inch, str(canvas.getPageNumber()))
        canvas.setStrokeColor(SAGE); canvas.setLineWidth(0.5)
        canvas.line(0.9 * inch, 0.78 * inch, LETTER[0] - 0.9 * inch, 0.78 * inch)
        canvas.restoreState()

    doc = BaseDocTemplate(path, pagesize=LETTER,
                          leftMargin=0.9 * inch, rightMargin=0.9 * inch,
                          topMargin=0.9 * inch, bottomMargin=1.0 * inch,
                          title=f"Aroidpedia — {GENUS_NAME} Bibliography",
                          author="Aroidpedia.com")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=decorate)])

    F = []
    rule = HRFlowable(width="100%", thickness=0.6, color=SAGE, spaceBefore=6, spaceAfter=10)

    # ── Cover ────────────────────────────────────────────────
    F += [Spacer(1, 1.7 * inch),
          Paragraph(GENUS_NAME.upper(), st["title"]),
          Paragraph("A Reference Bibliography", S("sub2", parent=st["sub"],
                    fontName="Times-Italic", fontSize=14, textColor=INK, spaceAfter=22)),
          rule,
          Paragraph(f"{data['source_count']} SOURCES · {data['taxon_count']} TAXA", st["sub"]),
          Paragraph(f"COMPILED {data['compiled']} FROM AROIDPEDIA.COM", st["sub"]),
          Spacer(1, 0.3 * inch),
          Paragraph("Automatically compiled from the References section of every "
                    "Alocasia species, cultivar and hybrid page on Aroidpedia. "
                    "Part I lists every source alphabetically with the taxa citing it. "
                    "Part II lists every taxon with its own references, for readers "
                    "wishing to dive deeper into a single plant.",
                    S("intro", fontName="Times-Italic", fontSize=10, leading=15,
                      alignment=TA_CENTER, textColor=MUTED)),
          PageBreak()]

    # ── Part I: master bibliography ──────────────────────────
    F += [Paragraph("PART I — MASTER BIBLIOGRAPHY (A–Z)", st["part"]), rule]
    letter = None
    for e in data["bibliography"]:
        first = sort_key(e["title"])[:1].upper()
        first = first if first.isalpha() else "#"
        if first != letter:
            letter = first
            F.append(Paragraph(letter, st["group"]))
        F.append(Paragraph(link(e["title"], e["url"]), st["entry"]))
        names = ", ".join(t["name"].title() for t in e["taxa"])
        F.append(Paragraph(f"cited by {e['count']} — {names}", st["cited"]))

    # ── Part II: by taxon ────────────────────────────────────
    F += [PageBreak(), Paragraph("PART II — REFERENCES BY TAXON", st["part"]), rule]
    by_kind = defaultdict(list)
    for t in data["taxa"]:
        by_kind[t["kind"]].append(t)
    order = ["Species", "Cultivar", "Cultivars", "Hybrid", "Hybrids"]
    kinds = [k for k in order if k in by_kind] + \
            [k for k in sorted(by_kind) if k not in order]

    for kind in kinds:
        group = by_kind[kind]
        F.append(Paragraph(f"{kind.upper()} ({len(group)})", st["group"]))
        for t in group:
            F.append(Paragraph(link(t["name"].title(), t["url"], SAGE_DK), st["taxon"]))
            bits = [f"aroidpedia.com/{t['slug']}"]
            if INCLUDE_KEW_IN_PDF and t["kew"]:
                bits.append(link("Kew POWO", t["kew"], MUTED))
            F.append(Paragraph(" · ".join(bits), st["meta"]))
            if t["refs"]:
                for i, r in enumerate(t["refs"], 1):
                    F.append(Paragraph(f"{i}. {link(r['title'], r['url'])}", st["ref"]))
            else:
                F.append(Paragraph("No references listed.", st["none"]))

    doc.build(F)
    print(f"→ {path}")


# ─────────────────────── MAIN ───────────────────────
if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    data = build()
    write_json(data)
    write_csv(data)
    write_pdf(data)
    print(f"\nDone — {data['source_count']} unique sources across "
          f"{data['taxon_count']} taxa.")
