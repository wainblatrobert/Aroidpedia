# data/species-base/ — the starting species list for a genus

One workbook per genus, built by `scripts/build-species-base.py` from the two
sources the house treats as the base list: **POWO** (through its underlying
World Checklist of Vascular Plants) and **IPNI**. It is the list a genus
build starts from, before any editorial pass.

```bash
python scripts/build-species-base.py Cyrtosperma            # uses the API cache
python scripts/build-species-base.py Cyrtosperma --refresh  # re-pulls everything
```

Requires `requests` and `openpyxl`. Raw API responses are cached outside the
repo (`$AP_SPECIES_BASE_CACHE`, default a folder in the system temp dir); the
cache is never committed.

## Files

| File | What it is |
|---|---|
| `<Genus>.xlsx` | The workbook: `SPECIES`, `HYBRIDS`, `SYNONYMS`, `ALL NAMES`, `SOURCES` |
| `<Genus>-species.csv` | The `SPECIES` sheet, flat — paste-ready for a Google Sheet |
| `<Genus>-synonyms.csv` | The `SYNONYMS` sheet, flat |
| `<Genus>-names.json` | Every name from both sources, reconciled, for code |

## The sheets

**SPECIES** — one row per POWO-accepted species: name, authority, year
described, protologue, basionym, IPNI's original remarks (usually the type
locality), POWO's range summary, native and introduced TDWG level-3 units,
POWO's synonyms for the species, and the IPNI / POWO / WCVP / WFO identifiers
with a BHL link to the protologue scan. The last three columns
(`AROIDPEDIA STATUS`, `AROIDPEDIA RULING / NOTES`, `PAGE URL`) are blank on
purpose: that is where the editorial pass goes.

The header names `SPECIES NAME` and `YEAR DESCRIBED`, and the rule that
hybrids live on their own sheet, are the same as the POWO export workbooks
on the Drive (`Araceae_Exports/EXCELS/<Genus>.xlsx`), so a workbook from here
can be dropped into that folder and `scripts/extract-species-years.py` reads
it unchanged.

**HYBRIDS** — hybrid names (IPNI's hybrid flag, or a × in the name). Headers
only when the genus has none.

**SYNONYMS** — every other name that touches the genus, with what POWO does
with it: genus names sunk into an accepted species here or in another genus,
names POWO leaves unplaced, names only IPNI knows, and names from *other*
genera that POWO sinks into an accepted species of this genus. The
`RELATION` column says which.

**ALL NAMES** — the raw union of both sources, one row per name, with the
join result. The audit trail for the sheets above.

**SOURCES** — endpoints, the WCVP release date, counts, a cross-check against
`data/species-years.json` and `docs/genus-geo.json`, and every discrepancy
the join found between IPNI and POWO (spellings, authorities, names in one
source only).

## POWO is the base list, not the verdict

Same house rule as the timelines (2026-08-31): a published journal article
trumps POWO. The workbook is a faithful pull of the two sources and applies
**no** rulings, so the editorial pass starts from what the sources actually
say. Rulings go in the `AROIDPEDIA` columns and, once made, in
`data/taxon-rulings.json`.

## Why POWO is read through GBIF

`powo.science.kew.org/api` sits behind a Cloudflare browser challenge and
answers 403 to scripts. The World Checklist of Vascular Plants — the dataset
POWO serves — is published to GBIF (dataset
`f382f0ce-323a-4091-bb9f-add557f3a9a2`, DOI 10.15468/6h8ucr) at each release,
and that copy is what the script reads. The `SOURCES` sheet records the
release date, and every row carries its POWO URL so a name can be checked
on POWO itself.
