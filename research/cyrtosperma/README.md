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
| `species/<epithet>.md` | One dossier per POWO-accepted species (15) |
| `bibliography.md` | Every source used or sought, with its status (held / login-only / paywalled / not found) and where it lives |
| `bibliography.json` | The same, machine-readable |
| `data/cyrtosperma-gbif-occurrences.csv` | All 1,086 GBIF occurrence records for the genus (specimens, observations, types) |
| `data/cyrtosperma-gbif-summary.json` | Per-species summary of the above: countries, years, elevation, collectors |
| `data/cyrtosperma-type-specimens.csv` | 33 type-specimen images referenced by GBIF (K, L, BM, A, GH, G), with licence and URL |
| `data/cyrtosperma-inat-observations.csv` | All 216 iNaturalist observations of the genus (one row each) |
| `data/cyrtosperma-inat-photos.csv` | All 441 iNaturalist photos: licence, attribution, observer, URL, and whether a copy was taken |
| `data/protologue-scans.csv` | Index of every protologue / treatment page scan taken from Internet Archive or rendered from a PDF |
| `data/papers.csv` | Index of the downloaded papers |

## What is NOT in this folder (delivered separately, never committed)

The binaries: the PDFs, the page scans, the type-specimen images and the
iNaturalist photos. They are copyrighted or licensed third-party material
and several hundred megabytes, so they travel as zip files to be dropped into
the Drive species folders (`GENERA/Cyrtosperma/<species>/`), not into a
public repository. Every file in those zips is listed in the CSVs above with
its licence and source URL, so any of it can be re-fetched.

## How the sources were reached

- **POWO** (`powo.science.kew.org`) and **BHL** (`biodiversitylibrary.org`)
  both answer 403 to scripts (Cloudflare). POWO data came through the World
  Checklist copy on GBIF; BHL page scans came through Internet Archive, which
  holds the same scans (the BHL page-image service redirects to an open S3
  bucket keyed by the Internet Archive identifier, and that bucket is
  readable).
- **IPNI**, **GBIF**, **iNaturalist**, **Crossref**, **Europe PMC**, the
  **Naturalis repository** (Blumea) and **Firenze University Press** (Webbia)
  answered normally.
- **Aroideana** PDFs on aroid.org redirect to the IAS member login. The three
  Cyrtosperma papers there (Dearden & Hay 2001; Hay & Imran 2020 ×2; Hay
  2020) must be fetched with a member account — URLs in `bibliography.md`.
- **Phytotaxa** (C. hayii, 2024) is paywalled; only the citation metadata was
  captured.

## Licences of the photographs

iNaturalist photos were copied only where the photographer's licence allows
reuse (CC0, CC BY, CC BY-SA, CC BY-NC, CC BY-NC-SA): 339 of 441. The 101
"all rights reserved" photos are listed in the CSV with their URLs and
observers so permission can be asked; none was copied. Type-specimen images
are CC BY 4.0 (Kew, NHM London), CC0 (Naturalis) or Harvard's public-domain
statement. Page scans are of pre-1930 public-domain works or of open-access
papers (Blumea via Naturalis; Webbia CC BY).

## Refreshing

- Names: `python scripts/build-species-base.py Cyrtosperma`
- The pulls in this folder were one-off scripts run in the session; the CSVs
  record every source URL, so they can be re-run against the same endpoints.
