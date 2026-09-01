# -*- coding: utf-8 -*-
"""AROIDEANA CITABILITY PASS -- the 129 on-tree records in `Croat - Aroideana`
and `Gibernau-Aroideana` that could not be cited.

WHY
---
"Citable" is the gate on writing, not "read": a record needs BOTH `authors`
and `year` to go in a reference list without opening the PDF. 418 of 1,128
on-tree records failed that test, and 129 of them -- nearly a third -- are
*Aroideana*, the one journal for which a vision-read volume-year table and a
printed running head already exist. That is the cheapest lever on the shelf.

WHERE EVERY VALUE COMES FROM
----------------------------
Nothing is derived. No PDF properties, no "Received" date, no most-cited-year
-- those were measured 39% wrong on an earlier pass.

  year    <- the article's own RUNNING HEAD (`1983]`, `T. B. CROAT, 2014`),
             or the volume printed on the page looked up in the vision-read
             table (`AROIDEANA VOLUME-YEAR TABLE 8.20.26.md` /
             `AROIDEANA ARTICLE METADATA 8.22.26.md`, both read off rendered
             pages).  A head that RECURS is page furniture; a single
             `Name, YEAR` line may be a citation and is not trusted.
  authors <- the printed BYLINE.  The head supplies the LIST (it is complete
             on every page); the byline supplies the SPELLING (the head is
             set in caps and OCRs badly: `C. C. FINCI-I` is Finch).

`aroideana_meta_ontree.py` does that extraction.  OVERRIDES below are the
records where I read the page and the extractor was wrong or silent; each
carries the reason.  Where the page does not say, the field is LEFT NULL --
an empty year is honest, a guessed one is a lie that sorts and gets cited.

⚠⚠ `refresh_catalog.py --reclassify` WOULD WIPE ALL OF THIS.  A plain refresh
carries unchanged records forward and preserves it.  Re-apply this script
after any reclassify, exactly as with `curate-inbox-26.py`.

Run:  python curate-aroideana-129.py [--apply]
"""
import os, sys, json, io

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import aroideana_meta_ontree as X

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
APPLY = "--apply" in sys.argv
CAT = "G:/My Drive/PlantsV2/Aroidpedia/LITERATURE/_INDEX/CATALOG.json"

# Volumes whose year was read off a printed page in AROIDEANA ARTICLE
# METADATA 8.22.26.md but which are absent from the smaller volume table.
# Used only where the page itself names the volume.
VOL_YEAR_EXTRA = {7: 1984, 8: 1985, 14: 1991, 20: 1997, 21: 1998, 25: 2002,
                  30: 2007, 31: 2008, 32: 2009, 35: 2012, 36: 2013}

# ---------------------------------------------------------------------------
# OVERRIDES -- keyed by BASENAME, because ids are positional and move when
# files are added.  `authors=False` means "the page does not name one, leave
# it null on purpose".
# ---------------------------------------------------------------------------
O = {
 # ---- the extractor read an OCR-corrupted surname ----------------------
 "[P] 0340008.pdf": dict(authors="Gibernau M.",
   why="byline OCRs the surname as `Gibemau`; the running head reads "
       "`M. GIBERNAU, 2011`."),
 "[D] 0330008.pdf": dict(authors="Barabé D. & Gibernau M.",
   why="same `Gibemau` OCR; accented Barabé per the archive's own usage."),

 # ---- the extractor read the wrong block entirely ----------------------
 "[P] A Revision of Philodendron Subgenus Philodendron (Araceae) for Mexico and Central America, Annals of the Missouri Botanical Garden 1997 - Croat.pdf": dict(
   authors="Croat T.B.",
   why="the split opens on the JOURNAL'S EDITORIAL MASTHEAD (Grayum, "
       "McPherson, Gunter...), not on a byline. Author from the title page."),
 "[P] A Revision of Anthurium Section Pachyneurium (Araceae), Annals of the Missouri Botanical Garden 1991.pdf": dict(
   authors="Croat T.B.",
   why="first page is a library accession stamp; no byline in the cache."),
 "Aroid Workshop at Harvard Forest.pdf": dict(
   authors="Croat T.B.", year=1985,
   why="the two `John Banta` lines are PHOTO CREDITS under figs 9-10; the "
       "article byline is `Thomas B. Croat`. Vol 8 -> 1985."),
 "[X] Index to Aroideana Volumes 1- 10.pdf": dict(
   authors="Croat T.B. & Rossman K.",
   why="the head reads `INDEX, 1991`, which is the running head of an index, "
       "not an author; byline `Thomas B. Croat and Kay Rossman`."),
 "[D] A New Website for Araceae Taxonomy on www.cate-araceae.org.pdf": dict(
   authors="Haigh A. et al.",
   why="head `A. HAIGH ET Ai.` is OCR of `et al.`; byline names Haigh, Lay, "
       "Mayo, Reynolds, Sellaro."),
 "[P] AROID PROFILE NO. 9 Philodendron rugosum Bogner & Bunting.pdf": dict(
   authors="Croat T.B.", year=1984,
   why="`Bogner & Bunting` is the SPECIES AUTHORITY inside the title, not a "
       "byline; byline `Thomas B. Croat`. Head `1984]`."),

 # ---- names the resolver mangled --------------------------------------
 "[S] A New Species of Typhonium (Araceae) from Vietnam.pdf": dict(
   authors="Nguyen V.D. & Croat T.B.", year=1997,
   why="`Nguyen Van Dzu` is a Vietnamese name -- Nguyen is the family name, "
       "not `Van`. Vol 20 -> 1997."),
 "VI International Aroid Conference in Kunming.pdf": dict(
   authors="Croat T.B. & Li H.",
   why="`LI HENG` is a Chinese name -- Li is the family name, not Heng."),
 "0280019.pdf": dict(authors="Pérez-Farrera M.A.",
   why="accents restored; the caps head drops them."),
 "New Species of Genus Hapaline (Araceae) from Vietnam.pdf": dict(
   authors="Nguyen V.D. & Croat T.B.",
   why="byline `Nguyen Van Du` -- Vietnamese, Nguyen is the family name."),
 "[P] Rediscovery of Anthurium gustavii Regel and Anthurium metallicum Linden ex Schott (Araceae) in Colombia.pdf": dict(
   authors="Jácome J. & Croat T.B.",
   why="accent restored on Jácome, as on the Monstera minima note."),
 "[S] 0230007.pdf": dict(authors="Dieringer G. & Cabrera R. L.",
   why="head `G. DIERINGER, L. CABRERA R.`; `Cabrera R.` is a Spanish double "
       "surname whose second element is abbreviated, not an initial."),
 "[P] 0290012.pdf": dict(authors="Gonçalves E.G. & Maia A.C.D.",
   why="byline `Eduardo G. Gon~a1ves` and `Artur Campos DaJia Maia` -- both "
       "OCR-mangled; the surnames are Gonçalves and Dalla Maia. The archive "
       "already cites the second as Maia A.C.D."),
 "[P] 0030202.pdf": dict(authors="Riedl H.",
   why="the first line is the TAIL OF THE TITLE (`...IN THE ARACEAE-AROIDEAE`), "
       "not a byline; the author line below is `HARALD RIEDL`."),
 "[P] Contributions to the Araceae Flora in Northwestern Pichincha Province,Ecuador.pdf": dict(
   authors="Croat T.B. & Rodríguez de Salvador J.",
   why="head `JIMENA RODRiGUEZ DE SALVADOR`; the surname is Rodríguez de "
       "Salvador, not `de Salvador`."),
 "[P] New Species of SpathiphyUum (Araceae) for Panama and Colombia.pdf": dict(
   authors="Croat T.B. & Cardona N. F.",
   why="byline `Felipe Cardona N.` -- the maternal surname initial is printed "
       "and is kept."),
 "Notes on Monstera minima Madison (Araceae) in Colombia and Panama.pdf": dict(
   authors="Jácome J. & Croat T.B.", year=2002,
   why="accent restored on Jácome. Vol 25 -> 2002."),
 "[P] Anthurium chamberlainii Masters (Araceae) Rediscovered.pdf": dict(
   authors="Croat T.B. & Gröger A.",
   why="the repeated title line pushed the second byline out of the window; "
       "byline names Andreas Gröger as well."),
 "[S] Aroid Profile No. 11  Syngonium steyermarkii Croat.pdf": dict(
   authors="Croat T.B. & Bogner J.",
   why="byline runs `THOMAS B. CROAT ... & J osef Bogner` across two lines."),
 "A Preliminary Analysis of Anthurium (Araceae) from Carchi Province, Ecuador.pdf": dict(
   authors="Croat T.B. & Ferry G.",
   why="head `Croat and Ferry, 2015` carries no initials; byline supplies "
       "`Thomas B. Croat` and `Geneviève Ferry`."),
 "Araceae of Parque Nacional Natural de Las Orquídeas, Colombia.pdf": dict(
   authors="Croat T.B. et al.",
   why="head `Croat, Hempe and Kostelac, 2015` carries no initials."),
 "[P] A Review of Studies of Neotropical Araceae.pdf": dict(
   authors="Croat T.B.",
   why="head `Croat, 2015` carries no initials; byline is Thomas B. Croat."),
 "Rediscovery of a Rare Monstera.pdf": dict(
   authors="Croat T.", year=1984,
   why="the page prints only `T. Croat` -- the middle initial is NOT on it, "
       "so it is not added. Vol 7 + head `1984]`."),

 # ---- the extractor found nothing; read off the page -------------------
 "[P] 0220005.pdf": dict(authors="Bogner J. & Gonçalves E.G.",
   why="byline `Josef Bogner` / `Eduardo G. Gonçalves` (OCR `Gon~a1ves`)."),
 "[P] 0220006.pdf": dict(authors="Gonçalves E.G.",
   why="byline `Eduardo G. Gonçalves` (OCR `Gon~alves`)."),
 "[S] 0060405.pdf": dict(authors="Henny R.J. & Fooshee W.C.",
   why="byline `R.J . Henny and w.e. Fooshee}` -- OCR lowercases the initials."),
 "The Origin of Anthurium leuconeurum.pdf": dict(
   authors="Croat T.B.", year=1983,
   why="figure captions precede the head; `1983]` and the byline sit below."),
 "[P] The Anthurium bredemeyeri Complex (Araceae)  of Venezuela and Colombia.pdf": dict(
   authors="Croat T.B.", year=1985,
   why="the article prints its own citation: `Aroideana. 8(4): 118-137. 1985 "
       "(1986)`. 1985 is the issue date; 1986 is the imprint."),
 "[S] The Araceae of Venezuela.pdf": dict(
   authors="Croat T.B. & Lambert N.", year=1986,
   why="byline `by Thomas B. Croat1 and Nancy Lambert2`; head `1986)`. "
       "⚠ the catalogue said 1979 -- a body-text year."),
 "Mexican Aroid Specialist.pdf": dict(authors="Croat T.B.",
   why="an obituary of Eizi Matuda (1894-1978) signed `Thomas B. Croat`. "
       "No volume or head on the page, so the year is LEFT NULL."),
 "Correction in Publication  Anthurlum nutibarense.pdf": dict(
   authors="Croat T.B.",
   why="byline `Thomas B. Croat, Missouri Botanical Garden`. The `2005` on "
       "the page is the year of the paper BEING CORRECTED, not this note's, "
       "so the year is LEFT NULL."),
 "Ecology and Life Forms of Araceae  a Follow-up.pdf": dict(
   authors="Croat T.B.", year=1989,
   why="the split opens mid-previous-article; the byline sits under the real "
       "title further down. `AROIDEANA, Vol. 12` -> 1989."),
 "Heinrich Gustav Adolph Engler.pdf": dict(
   authors="Croat T.B.", year=1983,
   why="`[Vol. 6 NO .3` then `1983]`, byline `Thomas B. Croat`."),
 "Photograph  Anthurium sp., Aroideana 8(4) 1985.pdf": dict(
   authors="Croat T.",
   why="a photograph page, credited `Photo: T. Croat.` -- no middle initial "
       "printed, so none is added."),

 # ---- genuinely unsigned / mid-article: LEAVE THE AUTHOR NULL ----------
 "Short communications 1980.pdf": dict(authors=False, year=1980,
   why="an UNSIGNED editorial column. `[Vol. 3` -> 1980. No author is named "
       "on the page and none is invented."),
 "[P] 0050405.pdf": dict(authors=False,
   why="the split begins MID-ARTICLE (cultivar-naming rules); its first page "
       "carries no title and no byline. Head `1983]` gives the year only."),

 # ---- year only, from the volume printed on the page -------------------
 "New name for Anthurium mapiriense Croat sect. Xialophyllium.pdf": dict(
   year=2012, why="`AROIDEANA, Vol. 35` -> 2012."),
 "THE AROID COLLECTIONS AT THE MISSOURI BOTANICAL GARDEN.pdf": dict(
   year=1979, why="`[Vol. 2` with a `1979]` head in the same split."),
 "[P] A New Endemic Species of Anthurium sect. Pachyneurium (Araceae) for Guatemala.pdf": dict(
   year=2007, why="`Vol. 30` -> 2007."),
 "[P] GERMINATION OF SEEDS OF ANTHURIUM.pdf": dict(
   year=1979, why="`[Vol. 2` with a `1979]` head in the same split."),
 "[P] STANDARDIZATION OF ANTHURIUM DESCRIPTIONS.pdf": dict(
   year=1979, why="`[Vol. 2` with a `1979]` head. ⭐ This is Croat & Bunting "
       "1979, the anchor of the Anthurium morphology guide."),
 "New Book on African Araceae.pdf": dict(
   year=1985, why="`Vol. 8` -> 1985."),
 "[P] Aroid Profile No 10. Taccarum weddellianum.pdf": dict(
   year=1985, why="`Vol. 8` with an `1985]` head."),
 "The Importance of Labeling Living Plants.pdf": dict(
   year=1984, why="`[Vol. 7` with a `1984]` head."),
}


def main():
    rows = X.collect()
    cat = json.load(open(CAT, encoding="utf-8"))
    recs = cat if isinstance(cat, list) else cat.get("records")
    by = {os.path.basename(r.get("file", "")): r for r in recs}

    changed = collections_counter()
    log, unresolved = [], []
    seen_overrides = set()

    for d in rows:
        rec = d["rec"]
        fn = os.path.basename(rec["file"])
        ov = O.get(fn, {})
        if ov:
            seen_overrides.add(fn)

        # --- authors ---
        a_new, a_src = None, ""
        if "authors" in ov:
            if ov["authors"] is False:
                a_new, a_src = None, "left null on purpose"
            else:
                a_new, a_src = ov["authors"], "hand, off the page"
        elif d["resolved"]:
            a_new, a_src = d["resolved"], d["rnote"]

        # --- year ---
        y_new, y_src = None, ""
        if ov.get("year"):
            y_new, y_src = ov["year"], "hand, off the page"
        elif d["year"]:
            y_new, y_src = d["year"], d["yroute"]
        elif not rec.get("year"):
            # a volume named on the page but absent from the small table
            m = X.HEAD_VOL.search(" ".join(x for x in d["head"]))
            if m and int(m.group(1)) in VOL_YEAR_EXTRA:
                v = int(m.group(1))
                y_new = VOL_YEAR_EXTRA[v]
                y_src = "vol %d -> page-read year (article metadata)" % v

        target = by.get(fn)
        if target is None:
            print("  !! not in catalogue: %s" % fn)
            continue

        did = []
        if a_new and target.get("authors") != a_new:
            did.append("authors=%r (%s)" % (a_new, a_src))
            target["authors"] = a_new
            changed["authors"] += 1
        if y_new and target.get("year") != y_new:
            old = target.get("year")
            did.append("year=%s%s (%s)"
                       % (y_new, (" [was %s]" % old) if old else "", y_src))
            target["year"] = int(y_new)
            changed["year"] += 1
            if old:
                changed["year corrected"] += 1
        if did:
            log.append((rec["id"], fn, did))
        if not target.get("authors") or not target.get("year"):
            unresolved.append((rec["id"], fn,
                               "no author" if not target.get("authors") else "",
                               "no year" if not target.get("year") else ""))

    stray = set(O) - seen_overrides
    for s in sorted(stray):
        print("  !! override not matched to any target record: %s" % s)

    for i, fn, did in log:
        print("%-5s %s" % (i, fn[:80]))
        for x in did:
            print("        %s" % x)
    print()
    print("records touched      : %d of %d" % (len(log), len(rows)))
    print("authors written      : %d" % changed["authors"])
    print("years written        : %d  (of which corrections: %d)"
          % (changed["year"], changed["year corrected"]))
    print("still not citable    : %d" % len(unresolved))
    for i, fn, a, y in unresolved:
        print("   %-5s %-8s %s" % (i, (a + " " + y).strip(), fn[:74]))

    if APPLY:
        # ⚠ SERIALISATION: CATALOG.json is CRLF with indent=1. The tools write
        # it with a bare open(..., "w") and let Windows translate \n to \r\n;
        # passing newline="\n" would rewrite 56,000 line endings and bury the
        # real diff.
        before = open(CAT, "rb").read()
        bak = CAT.replace("CATALOG.json",
                          "Backup/CATALOG.json.bak-pre-aroideana-129-8.28.26")
        if not os.path.exists(bak):
            open(bak, "wb").write(before)
            print("backup written: %s" % bak)
        json.dump(cat, open(CAT, "w", encoding="utf-8"),
                  indent=1, ensure_ascii=False)
        after = open(CAT, "rb").read()
        print("written to CATALOG.json")
        print("  bytes %d -> %d   CRLF %d -> %d   bare LF %d -> %d"
              % (len(before), len(after),
                 before.count(b"\r\n"), after.count(b"\r\n"),
                 before.count(b"\n") - before.count(b"\r\n"),
                 after.count(b"\n") - after.count(b"\r\n")))
    else:
        print("\nDRY RUN - pass --apply to write")


def collections_counter():
    import collections
    return collections.Counter()


if __name__ == "__main__":
    main()
