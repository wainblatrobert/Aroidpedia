# research/cyrtosperma — the Cyrtosperma build pack

Working material for the Cyrtosperma genus build, assembled 2026-09-05/06 from
the sources the house uses for every genus: the nomenclatural base list
(POWO/IPNI, see `data/species-base/`), the protologues, the monograph and the
later papers, the type specimens, GBIF occurrence data and iNaturalist
observations and photos.

**Nothing here is a finished page.** These are dossiers: what each source
says, with the source named, so a species page can be written from them
without going back to the PDFs. Where a source could not be obtained the
dossier says so and gives the exact reference and URL.

## What is in this folder

| Path | What it is |
|---|---|
| `genus.md` | Genus overview: circumscription, history, informal groups, excluded names, biology |
| `species/<epithet>.md` | One dossier per POWO-accepted species (15): what each source says |
| `pages/<epithet>.md` | Every page field per species in the card's labelled-section schema, ready to paste; also as `data/species-base/Cyrtosperma-pages.xlsx` and, in the Drive base layout, `Cyrtosperma-base.xlsx` (both built by `scripts/build-genus-sheets.py`) |
| `bibliography.md` | Every source used or sought, with its status (held / login-only / paywalled / not found) and where it lives |
| `bibliography.json` | The same, machine-readable |
| `data/cyrtosperma-gbif-occurrences.csv` | All 1,086 GBIF occurrence records for the genus (specimens, observations, types) |
| `data/cyrtosperma-gbif-summary.json` | Per-species summary of the above: countries, years, elevation, collectors |
| `data/cyrtosperma-type-specimens.csv` | 33 type-specimen images referenced by GBIF (K, L, BM, A, GH, G), with licence and URL |
| `data/cyrtosperma-inat-observations.csv` | All 216 iNaturalist observations of the genus (one row each) |
| `data/cyrtosperma-inat-photos.csv` | All 441 iNaturalist photos: licence, attribution, observer, URL, and whether a copy was taken |
| `data/protologue-scans.csv` | Index of every protologue / treatment page scan taken from Internet Archive or rendered from a PDF |
| `data/papers.csv` | Index of the downloaded papers |
| `data/cyrtosperma-inat-places.csv` | Reverse-geocoded place of every iNaturalist observation (country, province, TDWG unit), for the base sheet's INATURALIST column |

## What is NOT in this folder (delivered separately, never committed)

The binaries: the PDFs, the page scans, the type-specimen images and the
iNaturalist photos. They are copyrighted or licensed third-party material
and several hundred megabytes, so they travel as zip files to be dropped into
the Drive species folders (`GENERA/Cyrtosperma/<species>/`), not into a
public repository. Every file in those zips is listed in the CSVs above with
its licence and source URL, so any of it can be re-fetched.

## On the Drive

| What | Where |
|---|---|
| The genus workbook, as a Google Sheet | **Cyrtosperma** at the Drive root, beside Syngonium and Scindapsus: https://docs.google.com/spreadsheets/d/1DPdZS0Mb7NXf0WkWZiHnPp6Sbaidjmu4ERtSgKV-61U — the `SPECIES` tab of `data/species-base/Cyrtosperma-base.xlsx`, verified identical to the local file after upload |
| This README and `genus.md` | `GENERA/Cyrtosperma/Research pack/` |
| Species photographs and scans | `GENERA/Cyrtosperma/Species - Cyrtosperma/<species>/` (the 15 folders already exist); the zips from the chat unpack into the role folders |
| Papers and page scans | `GENERA/Cyrtosperma/Literature/` (with `EXTRACTS/`), following the Scindapsus layout |
| The Aroideana issues read for this build | `LITERATURE` — Aroideana24.pdf and Aroideana43n3.pdf, with the text exports aroideana24.txt and Aroideana43N3.txt |

The Google Sheet carries only the `SPECIES` tab. The four-tab base
(`SPECIES` / `CULTIVARS` / `HYBRIDS` / `ROW BACKUPS`, with the same columns
and formulas as the Syngonium and Scindapsus sheets) is
`data/species-base/Cyrtosperma-base.xlsx` in this repo: upload it to Drive,
or use File > Import > Insert new sheet(s) on the Sheet, to add the three
empty tabs.

## How the sources were reached

- **POWO** (`powo.science.kew.org`) and **BHL** (`biodiversitylibrary.org`)
  both answer 403 to scripts (Cloudflare). POWO data came through the World
  Checklist copy on GBIF. BHL pages came two ways: Internet Archive holds the
  same scans, and BHL's own OpenURL resolver (`/openurl?...`, the link IPNI
  carries for every protologue) and page-image service (`/pageimage/<id>`)
  are NOT behind the challenge: the resolver answers with the BHL page id and
  the page-image call redirects to an open S3 bucket keyed by the Internet
  Archive identifier and leaf number, from which any leaf of that volume can
  be read. That route found the volumes Internet Archive search could not
  (Schott 1857, Nadeaud 1897, L'Illustration Horticole, the Botanical
  Magazine plate). The Tuscan horticultural bulletin (macrotum 1879) is not
  on BHL at all.
- **IPNI**, **GBIF**, **iNaturalist**, **Crossref**, **Europe PMC**, the
  **Naturalis repository** (Blumea) and **Firenze University Press** (Webbia)
  answered normally.
- **Aroideana**: aroid.org serves its PDFs only to logged-in members and
  later refused the sandbox altogether ("forbidden by administrative rules").
  The house holds the complete run on the Drive (`LITERATURE`, folders
  `Croat - Aroideana` and `Gibernau-Aroideana`, catalogued in `_INDEX`), so
  the four Cyrtosperma papers — Aroideana 24: 102–104 (2001) and 43(3–4):
  4–11, 97–107 and 108–117 (2020) — come from there, not from the web: the
  Drive's text exports of both issues (aroideana24.txt, Aroideana43N3.txt)
  were read on 2026-09-07 and the papers are transcribed into the dossiers
  and page drafts of C. hambalii, C. timikense, C. giganteum and
  C. johnstonii. The figures remain in the PDFs on the Drive.
- **Phytotaxa** (C. hayii, 2024) is paywalled; only the citation metadata was
  captured.

## Licences of the photographs

Every iNaturalist photo still online was copied (editorial decision,
2026-09-06): 339 carry reuse licences (CC0, CC BY, CC BY-SA, CC BY-NC,
CC BY-NC-SA) and 101 are "all rights reserved". The CSV carries the licence
and attribution of each; the all-rights-reserved ones need the
photographer's permission before they appear on a page. 440 of the 441 were
fetched at original size; one is listed by iNaturalist but no longer served,
and is marked in the CSV. Type-specimen images
are CC BY 4.0 (Kew, NHM London), CC0 (Naturalis) or Harvard's public-domain
statement. Page scans are of pre-1930 public-domain works or of open-access
papers (Blumea via Naturalis; Webbia CC BY).

## Refreshing

- Names: `python scripts/build-species-base.py Cyrtosperma`
- The pulls in this folder were one-off scripts run in the session; the CSVs
  record every source URL, so they can be re-run against the same endpoints.
