#!/usr/bin/env python3
"""
Aroidpedia - search index builder
=================================
Writes docs/search-index.json: every published entry on the site, in the
smallest useful form for a browser typeahead.

Same shape of job as compile_aroidpedia_biblio.py, but this one cares only
about identity (title / genus / category / URL), never body content - so it
is fast and the output stays small enough to download on any page.

OUTPUT  docs/search-index.json

    {
      "generated": "2026-07-19T09:00:00Z",
      "counts":  {"entries": 357, "genera": 2},
      "genera":  [{"n": "Alocasia", "u": "/alocasia", "c": 214}, ...],
      "entries": [
        {"t": "Alocasia 'Albatuwan'",
         "g": "Alocasia",
         "c": "hybrid",
         "u": "/journal/alocasia-albatuwan",
         "s": "alocasia albatuwan"},
        ...
      ]
    }

  t  title as published        c  species | cultivar | hybrid | ""
  g  genus (first tag)         u  path, root-relative
  s  normalised search string (lower-case, accents folded, quotes
     stripped) so the browser can match without re-processing 357 rows
     on every keystroke

Keys are single letters on purpose: at a few hundred entries the field
names would otherwise be a third of the payload.

The file also carries the genus list with counts, so the typeahead needs
ONE fetch rather than two - it no longer has to also pull counts.json.

FETCH STRATEGY
Squarespace has changed which endpoint returns collection items more than
once, so three are tried in order and the log says which one worked:
  1. /journal?format=json&nested=true   (what the bibliography uses)
  2. /api/open/content/items?collectionId=...
  3. sitemap.xml + per-page ?format=json   (slow, last resort)

CLEAN DIFFS
Re-run daily and the "generated" stamp would change every time, so every
run would commit. The script instead compares everything EXCEPT that stamp
against the file on disk and leaves it untouched when nothing has really
changed - so a commit in the history always means the site changed.

USAGE
    python "Aroidpedia Search Index/build_search_index.py"
    python "Aroidpedia Search Index/build_search_index.py" --dry-run
Run from the REPO ROOT: output goes to docs/ relative to the working
directory, exactly like the bibliography script.
"""

import argparse
import json
import os
import re
import sys
import time
import unicodedata
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

import requests

SITE = "https://www.aroidpedia.com"
COLLECTION_PATH = "/journal"
COLLECTION_ID = "5ecf40ddda96fb2d2d4da53e"      # from the live site
OUT_PATH = os.path.join("docs", "search-index.json")

PAGE_SIZE = 100
MAX_PAGES = 60                                   # 6,000 entries; a guard, not a target
TIMEOUT = 30
RETRIES = 3
PAUSE = 0.4                                      # be polite between requests

CATEGORIES = {"species", "cultivar", "hybrid"}

session = requests.Session()
session.headers.update({
    "User-Agent": "aroidpedia-search-index/1.0 (+https://www.aroidpedia.com)"
})


# ----------------------------------------------------------------- helpers
def log(msg):
    print(msg, flush=True)


def get(url, as_json=True):
    """GET with retries. Returns parsed JSON, raw text, or None."""
    for attempt in range(1, RETRIES + 1):
        try:
            r = session.get(url, timeout=TIMEOUT)
            if r.status_code != 200:
                log(f"    HTTP {r.status_code} for {url}")
                return None
            return r.json() if as_json else r.text
        except json.JSONDecodeError:
            log(f"    not JSON: {url}")
            return None
        except requests.RequestException as e:
            if attempt == RETRIES:
                log(f"    failed after {RETRIES} tries: {url} ({e})")
                return None
            time.sleep(attempt * 1.5)
    return None


def norm(s):
    """Lower-case, fold accents, drop punctuation - the browser matches on this."""
    s = unicodedata.normalize("NFD", str(s or ""))
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def slug(s):
    # Fold accents first, or "Café" would slug to "caf".
    s = unicodedata.normalize("NFD", str(s or ""))
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def title_from_slug(s):
    return " ".join(w.capitalize() for w in str(s or "").split("-") if w)


# ------------------------------------------------------------ fetch: API 1
def fetch_collection_json():
    """/journal?format=json&nested=true, paginated."""
    items, offset = [], 0
    for page in range(MAX_PAGES):
        url = f"{SITE}{COLLECTION_PATH}?format=json&nested=true&offset={offset}"
        data = get(url)
        if not data:
            break
        batch = data.get("items") or []
        if not batch:
            break
        items.extend(batch)
        log(f"    page {page + 1}: +{len(batch)} (total {len(items)})")

        pag = data.get("pagination") or {}
        if not pag.get("nextPage"):
            break
        offset = pag.get("nextPageOffset") or (offset + len(batch))
        time.sleep(PAUSE)
    return items


# ------------------------------------------------------------ fetch: API 2
def fetch_open_api():
    """/api/open/content/items?collectionId=..., paginated."""
    items, offset = [], 0
    for page in range(MAX_PAGES):
        url = (f"{SITE}/api/open/content/items"
               f"?collectionId={COLLECTION_ID}&limit={PAGE_SIZE}&offset={offset}")
        data = get(url)
        if not data:
            break
        batch = data.get("items") or data.get("content") or []
        if not batch:
            break
        items.extend(batch)
        log(f"    page {page + 1}: +{len(batch)} (total {len(items)})")
        if len(batch) < PAGE_SIZE:
            break
        offset += len(batch)
        time.sleep(PAUSE)
    return items


# ------------------------------------------------------------ fetch: API 3
def fetch_via_sitemap():
    """Last resort: sitemap for URLs, then ?format=json per page. Slow."""
    xml = get(f"{SITE}/sitemap.xml", as_json=False)
    if not xml:
        return []
    try:
        root = ET.fromstring(xml)
    except ET.ParseError as e:
        log(f"    sitemap parse error: {e}")
        return []

    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [el.text for el in root.findall(".//s:loc", ns) if el.text]
    urls = [u for u in urls if COLLECTION_PATH + "/" in u]
    log(f"    sitemap: {len(urls)} candidate entry URLs")

    items = []
    for i, u in enumerate(urls, 1):
        data = get(f"{u}?format=json")
        if data and data.get("item"):
            items.append(data["item"])
        if i % 25 == 0:
            log(f"    fetched {i}/{len(urls)}")
        time.sleep(PAUSE)
    return items


def fetch_items():
    for name, fn in (("collection JSON", fetch_collection_json),
                     ("open content API", fetch_open_api),
                     ("sitemap walk", fetch_via_sitemap)):
        log(f"  trying {name} ...")
        items = fn()
        if items:
            log(f"  -> {name} returned {len(items)} items")
            return items, name
        log(f"  -> {name} returned nothing")
    return [], None


# ------------------------------------------------------------------ shape
def extract_category(item):
    """Species / Cultivar / Hybrid, from whichever field carries it."""
    cats = item.get("categories") or []
    if isinstance(cats, str):
        cats = [cats]
    for c in cats:
        if str(c).strip().lower() in CATEGORIES:
            return str(c).strip().lower()
    return ""


def extract_genus(item):
    """Genus is the FIRST tag - same rule the journal filter uses."""
    tags = item.get("tags") or []
    if isinstance(tags, str):
        tags = [tags]
    for t in tags:
        t = str(t).strip()
        if len(t) > 1:
            return title_from_slug(slug(t))
    # No tag -> no genus. Guessing from the title's first word invents
    # phantom genera (and phantom /genus URLs) out of any non-taxon post.
    # The entry is still indexed and searchable; it just isn't filed
    # under a genus, and the run log lists it so it can be tagged.
    return ""


def extract_url(item):
    for key in ("fullUrl", "urlId"):
        v = item.get(key)
        if not v:
            continue
        v = str(v)
        if v.startswith("http"):
            return re.sub(r"^https?://[^/]+", "", v)
        return v if v.startswith("/") else f"{COLLECTION_PATH}/{v}"
    return ""


def search_string(title, genus):
    base = norm(title)
    g = norm(genus)
    if g and g not in base:
        base = f"{base} {g}"
    return base


def build(items):
    entries, seen = [], set()

    for it in items:
        title = str(it.get("title") or "").strip()
        url = extract_url(it)
        if not title or not url or url in seen:
            continue
        seen.add(url)

        genus = extract_genus(it)
        entries.append({
            "t": title,
            "g": genus,
            "c": extract_category(it),
            "u": url,
            # Genus is appended only when the title doesn't already
            # contain it, so "Alocasia 'Albatuwan'" doesn't store
            # "alocasia" twice. The browser tokenises the query, so
            # "aloc alba" still matches "alocasia albatuwan".
            "s": search_string(title, genus),
        })

    entries.sort(key=lambda e: (e["g"].lower(), e["t"].lower()))

    tally = {}
    for e in entries:
        if e["g"]:
            tally[e["g"]] = tally.get(e["g"], 0) + 1

    genera = [{"n": g, "u": "/" + slug(g), "c": n}
              for g, n in sorted(tally.items(), key=lambda kv: kv[0].lower())]

    return {
        "generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "counts": {"entries": len(entries), "genera": len(genera)},
        "genera": genera,
        "entries": entries,
    }


def unchanged(new, path):
    """True when only the timestamp differs from what's already on disk."""
    if not os.path.exists(path):
        return False
    try:
        with open(path, encoding="utf-8") as f:
            old = json.load(f)
    except (OSError, json.JSONDecodeError):
        return False
    a = {k: v for k, v in old.items() if k != "generated"}
    b = {k: v for k, v in new.items() if k != "generated"}
    return a == b


# ------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true",
                    help="crawl and report, write nothing")
    args = ap.parse_args()

    log("Aroidpedia search index")
    log(f"  site: {SITE}")

    items, via = fetch_items()
    if not items:
        log("ERROR: no items returned by any strategy - index NOT written.")
        log("       The existing file is left in place rather than emptied.")
        return 1

    index = build(items)
    n_entries = index["counts"]["entries"]
    n_genera = index["counts"]["genera"]

    log("")
    log(f"  source        : {via}")
    log(f"  raw items     : {len(items)}")
    log(f"  indexed       : {n_entries}")
    log(f"  genera        : {n_genera}")
    for g in index["genera"]:
        log(f"      {g['n']:<24} {g['c']:>5}  {g['u']}")

    missing_genus = [e["t"] for e in index["entries"] if not e["g"]]
    missing_cat = [e["t"] for e in index["entries"] if not e["c"]]
    if missing_genus:
        log(f"  WARNING: {len(missing_genus)} entries have no genus tag, e.g.:")
        for t in missing_genus[:8]:
            log(f"      {t}")
    if missing_cat:
        log(f"  NOTE: {len(missing_cat)} entries have no Species/Cultivar/Hybrid "
            f"category, e.g.:")
        for t in missing_cat[:8]:
            log(f"      {t}")

    # A sudden collapse almost always means a failed/partial crawl rather
    # than 300 deleted posts - refuse to overwrite a good file with a bad one.
    if os.path.exists(OUT_PATH):
        try:
            with open(OUT_PATH, encoding="utf-8") as f:
                prev = json.load(f).get("counts", {}).get("entries", 0)
            if prev and n_entries < prev * 0.5:
                log(f"ERROR: entry count fell from {prev} to {n_entries} "
                    f"(>50% drop). Refusing to overwrite; re-run to confirm.")
                return 1
        except (OSError, json.JSONDecodeError):
            pass

    if args.dry_run:
        log("\n  --dry-run: nothing written.")
        return 0

    if unchanged(index, OUT_PATH):
        log("\n  No changes since last build - file left untouched.")
        return 0

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, separators=(",", ":"))

    size = os.path.getsize(OUT_PATH)
    log(f"\n  wrote {OUT_PATH}  ({size:,} bytes, ~{size // 1024} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
