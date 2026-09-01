# -*- coding: utf-8 -*-
"""Write the literature handoff."""
import io

OUT = ("G:/My Drive/PlantsV2/Aroidpedia/LITERATURE/"
       "LITERATURE HANDOFF 8.28.26.md")

DOC = """# LITERATURE — HANDOFF 8.28.26

## Where it stands

**2,247 papers held.** 1,128 catalogued on-tree in `CATALOG.json`, 1,119
owned-but-off-tree in `CATALOG-OFFTREE.json`.

| tag | meaning | count |
|---|---|--:|
| `[P]` | parsed in full, findings in `_INDEX\\DIGESTS\\` | 546 |
| `[S]` | skimmed — partially mined, come back to it | 221 |
| `[X]` | read, nothing usable (a recorded negative) | 24 |
| `[D]` | byte-identical duplicate, never read | 104 |
| *(none)* | **nobody has opened it** | **233** |

**CORE is effectively closed: 4 unopened, of 397.** The 233 unread are
166 SUPPORTING, 44 PERIPHERAL, 19 POLLINATOR-REF, 4 CORE.

### The 4 CORE nobody has opened

    Amorphophallus  2005  Notes on the genus Amorphophallus (Araceae)
    Amorphophallus  1993  Amorphophallus (Araceae) nouveaux d'Afrique centrale
    Amorphophallus  1987  Morphological, anatomical and chemical analyses of
                          Amorphophallus paeoniifolius
    Anthurium       1976  Cross compatibility in the genus Anthurium

Three are Amorphophallus taxonomy/chemistry; the Anthurium one is a crossing
paper and the most likely to change a page.

### What the shelf can actually support

From `_INDEX/LENS-READINESS.md` (re-run `tools/lens_readiness.py` after any
reclassify):

| lens | held | first-rank | unread | **citable** |
|---|--:|--:|--:|--:|
| identification | 968 | 523 | 99 | **337 (64%)** |
| reproduction | 696 | 299 | 13 | **202 (68%)** |
| evolution | 239 | 75 | 21 | **49 (65%)** |
| cultivation | 183 | 46 | 18 | **21 (46%)** |
| distribution | 646 | 41 | 17 | **32 (78%)** |
| people-and-uses | 51 | 1 | 0 | 1 |

⚠ **`tier` is a REPRODUCTION score, not a quality score** — only 7 of 25
subjects can earn CORE. A paper can be first-rank for cultivation and
irrelevant for reproduction. Rank per lens, not by tier.

⚠ **"Citable" is the real gate, not "read."** A record needs both `authors`
and `year` to be cited without opening the PDF: **710 of 1,128** have both.

---

## What I'd do next, in order

**1. Identification is the obvious next section, and it is not close.**
523 first-rank papers, 337 of them citable — more than reproduction ever
had. Reproduction is written; identification is the largest unexploited
holding on the shelf. The morphology section already proves the format
works.

**2. Read the four CORE.** Small, bounded, and one of them (Anthurium
crossing, 1976) touches a live page.

**3. Fix the 418 records that cannot be cited.** 710 of 1,128 carry both
author and year; the rest cannot be put in a reference list without opening
the PDF. That is the cheapest single lever on writing throughput, and
`tools/lit_aroideana_meta.py` and the DOI→CrossRef pass already exist for
it. ⚠⚠ Do **not** invent metadata: PDF properties and "Received" dates were
measured **39% wrong** while looking better than the alternative.

**4. Leave the 233 unread mostly alone.** 166 are SUPPORTING and 44
PERIPHERAL. Reading them is low-yield next to (1) and (3).

---

## Traps — read before touching the catalogue

⚠⚠⚠ **`refresh_catalog.py --reclassify` WIPES CURATED METADATA.** It
happened between 8.27 and 8.28: all 26 hand-written titles, authors, years
and notes from the inbox pass were destroyed, and Flora of Thailand reverted
to a wrong 1968. Re-applied from
`aroidpedia-climate/curate-inbox-26.py`. **A plain `refresh_catalog.py`
preserves them — verified by running one and re-checking.** Only pass
`--reclassify` if you are prepared to re-apply every curation afterwards.

⚠⚠ **`CATALOG.json` is CRLF with `indent=1`.** The tools write it with a
bare `open(..., "w")` and let Windows translate. Passing `newline="\\n"`
rewrites 56,000 line endings and buries the real diff.

⚠⚠ **A classifier's year can be the most-cited year INSIDE the text.**
Flora of Thailand came in as 1968; it cites work to 2011 and is the 2012
treatment.

⚠⚠ **A subject tag is not evidence the paper is on-topic.**
`MISCELLANEOUS_BOTANICAL_NOTES_V.pdf` was tagged
"ecology-distribution / floristics-checklist" and contains **zero Araceae
content** — it is about *Ormosia* and *Platyspermation*. Now `[X]`.

⚠ **Check `duplicate_of` before treating an ingest as new.** Two of the "26
new" papers on 8.27 were byte-identical re-drops of papers already held and
already `[P]` — the Ambrosina/Arisarum morphology paper and *Amorphophallus
julaihii*. The field was populated; I did not look. Now `[D]`.

⚠ **IDs are positional and change when files are added.** Cite the filename
in anything durable, never `Lnnn`. `mark_parsed.py` will refuse a stale id
and tell you to re-resolve by filename fragment — believe it.

---

## What the last inbox pass produced

26 papers filed 8.27.26 (24 genuinely new), all curated and now tagged
`[S]` — read and mined into
`LITERATURE\\INBOX READ 8.27.26 - WHAT THE 26 PAPERS CHANGE.md`, but **no
`DIGESTS/` entry was written**, which is why they are `[S]` and not `[P]`.
Writing those digests is a legitimate small job for whoever picks this up.

Findings that changed live pages: the extracellular calcium oxalate section
now in the morphology hub, and the confirmation that every claim the
Philodendron guide makes from Gonçalves 2004 is accurate — plus the
correction that the paper defines **three** collenchyma patterns, not two.

Still unused from that pass: Claudel & Lev-Yadun's central argument (that
intraspecific scent variation may exceed interspecific, which constrains
every species-level scent claim on the site), and Grayum 1990's list of
inferred primitive states for the family — attribute that as **Grayum's
1990 inference**, not modern consensus.

The `_INBOX` is empty. Three Amorphophallus papers arrived and were filed
on 8.28 and are among the 233 unread.
"""

open(OUT, "w", encoding="utf-8", newline="\r\n").write(DOC)
print("wrote %s" % OUT.rsplit("/", 1)[-1])
print("%d lines" % (DOC.count("\n") + 1))
