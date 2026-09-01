# -*- coding: utf-8 -*-
"""Catalogue Aroideana article splits (v42-49) into CATALOG-OFFTREE.json.

Volumes 1-41 are split into 752 per-article files and all are catalogued;
42-49 were not, so each was one record of 89-589 pages carrying a single genus
and a subject profile blended across the whole issue -- a blob, not a
retrieval unit. `split_aroideana.py` cuts them into per-article PDFs; this files them.
Point AROID_MANIFEST at the manifest for the batch being filed.

/!\\ WHY NOT JUST RUN lit_offtree_catalogue.py. That re-walks the whole drive
(2,500+ PDFs), re-extracts text and RE-CLASSIFIES every off-tree record. A
reclassify is exactly what destroyed 26 hand-written curations between 8.27
and 8.28. This adds ONLY the 24 new files and touches nothing else; the
full tool can be run later when a drive-wide refresh is actually wanted.

Title, authors, volume, issue and start page come from the issue's own printed
CONTENTS table (read by column geometry in the splitter, recorded in
`articles\\_notes_48-49_split.json`) -- not guessed, and not from the filename,
which is opaque by design.

Subjects, genus and tier come from `aroidlit.classify()`, the same scorer the
rest of the shelf uses, so these records are directly comparable.

Run:  python catalogue-aroideana-48-49.py [--apply]
"""
import io, json, os, sys, re

IDX = r"G:\My Drive\PlantsV2\Aroidpedia\LITERATURE\_INDEX"
sys.path.insert(0, os.path.join(IDX, "tools"))
import aroidlit as A

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
APPLY = "--apply" in sys.argv

ART = r"G:\My Drive\PlantsV2\Aroideana\articles"
CAT = os.path.join(IDX, "CATALOG-OFFTREE.json")
TXT = os.path.join(IDX, "TEXT-OFFTREE")
MAN = os.path.join(ART, os.environ.get("AROID_MANIFEST", "_notes_48-49_split.json"))

# volume -> year. /!\ EVERY ONE WAS READ OFF THE PAGES, NOT DERIVED. The
# volume-year table warns in capitals that there is no arithmetic rule and
# that year = volume + 1977 is WRONG on volume 5. These were taken from the
# "Aroideana Vol N No M, YYYY" line, which RECURS 7-9 times per issue as page
# furniture -- the same recurrence test that table itself was built on.
VOL_YEAR = {42: 2019, 43: 2020, 44: 2021, 45: 2022, 46: 2023,
            47: 2024, 48: 2025, 49: 2026}


def clean_authors(s):
    """The contents table prints authors as a wrapped block; normalise it."""
    s = re.sub(r"\s+", " ", s or "").strip()
    s = re.sub(r"\s*,\s*", ", ", s)
    s = re.sub(r"\s*&\s*", " & ", s)
    return s.strip(" ,&")


def main():
    man = json.load(io.open(MAN, encoding="utf-8"))
    cat = json.load(io.open(CAT, encoding="utf-8"))
    recs = cat if isinstance(cat, list) else cat.get("records")
    have = {os.path.basename(r.get("file") or "") for r in recs}
    have_md5 = {r.get("md5") for r in recs if r.get("md5")}
    nextn = max((int(r["id"][1:]) for r in recs if re.fullmatch(r"F\d+", r.get("id") or "")), default=0)

    added, skipped = [], []
    for e in man:
        fn = e["file"]
        abs_p = os.path.join(ART, fn)
        if fn in have:
            skipped.append((fn, "already catalogued by name")); continue
        h = A.md5(abs_p)
        if h in have_md5:
            skipped.append((fn, "already catalogued by md5")); continue

        # /!\ extract_text() WRITES the cache and returns (chars, pages, kind).
        # It does NOT return the text. Treating its return value as a string
        # skipped all 24 with "'tuple' object has no attribute 'strip'".
        dest = os.path.join(TXT, "Aroideana__articles__" + fn.replace(".pdf", ".txt"))
        raw, has_text, kind = "", False, None
        try:
            chars, npages, kind = A.extract_text(abs_p, dest)
            if kind and os.path.exists(dest):
                raw = io.open(dest, encoding="utf-8", errors="replace").read()
            has_text = bool(kind) and len(raw.strip()) > 200
        except Exception as ex:
            skipped.append((fn, "text extract failed: %s" % ex)); continue

        rel = os.path.join("Aroideana", "articles", fn)
        c = A.classify(rel, raw, has_text)

        # the printed CONTENTS beats anything the classifier guessed
        c["title"] = re.sub(r"\s+", " ", e["title"]).strip() or c.get("title")
        au = clean_authors(e["authors"])
        if au:
            c["authors"] = au
        c["year"] = VOL_YEAR.get(e["volume"])
        nextn += 1
        c["id"] = "F%04d" % nextn
        c["file"] = rel
        c["abs_path"] = abs_p
        c["root"] = r"G:\My Drive\PlantsV2\Aroideana"
        c["md5"] = h
        c["pdf_mb"] = round(os.path.getsize(abs_p) / 1e6, 2)
        c["pages"] = e["pdf_end"] - e["pdf_start"] + 1
        c["text_status"] = kind if kind else "IMAGE-ONLY"
        c["txt"] = os.path.basename(dest)
        c["note"] = ("Aroideana %d(%d): %s ff. Split from %s at printed page %s "
                     "(PDF pp. %d-%d); title and authors read off the issue's own "
                     "printed CONTENTS table."
                     % (e["volume"], e["issue"], e["printed_start"], e["source"],
                        e["printed_start"], e["pdf_start"], e["pdf_end"]))
        recs.append(c)
        added.append(c)

    print("%-14s %-5s %-6s %-26s %s" % ("file", "pp", "year", "genus", "title"))
    for c in added:
        print("%-14s %-5s %-6s %-26s %s"
              % (os.path.basename(c["file"]), c["pages"], c["year"],
                 ",".join(c.get("genus_primary") or [])[:26], (c.get("title") or "")[:46]))
    for fn, why in skipped:
        print("  skipped %-14s %s" % (fn, why))
    print()
    print("added %d, skipped %d, catalogue %d -> %d"
          % (len(added), len(skipped), len(recs) - len(added), len(recs)))

    if APPLY:
        bak = CAT + ".bak-pre-4249-8.28.26"
        if not os.path.exists(bak):
            io.open(bak, "wb").write(io.open(CAT, "rb").read())
        json.dump(cat, open(CAT, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        print("written to CATALOG-OFFTREE.json (backup: %s)" % os.path.basename(bak))
    else:
        print("DRY RUN - pass --apply to write")


if __name__ == "__main__":
    main()
