# pages/ — every page field, per species

One file per species, written in the labelled-section schema the species
card reads (`docs/footer.js` SCHEMA: PROTOLOGUE, SYNONYMS with HOMOTYPIC /
HETEROTYPIC / ACCEPTED INFRASPECIFICS, DISTRIBUTION and DISTRIBUTION NOTE,
SPECIES DESCRIPTION, INFLORESCENCE, ECOLOGY, DISTRIBUTION MAPS, ETYMOLOGY,
numbered NOTES with superscript citations, numbered REFERENCES with
POWO first, the protologue second and iNaturalist third), plus three
build-only lines: TITLE, AUTHORITY, TAGS (place keys checked against
`docs/geo-hierarchy.json`) and PHOTOS (which files in the pack to use).

The same content, one row per species and one column per field, is
`data/species-base/Cyrtosperma-pages.xlsx` and `.csv` — the "all columns"
layer of the species database, kept separate from `Cyrtosperma.xlsx`,
which the API script regenerates.

Every statement carries a superscript pointing at the numbered reference.
A field marked ⚠ could not be filled from the sources in hand: for
*C. hayii* the Phytotaxa paper is paywalled; several species have no
photograph of a living plant anywhere the search reached. The Aroideana
protologues of *C. hambalii* and *C. timikense*, and the 2020 papers on
*C. giganteum* and *C. johnstonii*, were read from the Drive's text exports
on 2026-09-07 and are now in the drafts.

`scripts/build-genus-sheets.py Cyrtosperma` rebuilds the two workbooks from
these files: `Cyrtosperma-pages.xlsx` (this schema, one column per field)
and `Cyrtosperma-base.xlsx` (the Drive base layout used for Syngonium and
Scindapsus, which is what the Google Sheet `Cyrtosperma` was made from).

Tags: New Guinea and the Solomons are tagged Oceania, as
`docs/geo-hierarchy.json` places them, and Malesia as Asia; the 2021
Alocasia pages tagged New Guinea as Asia, so the tagging convention should
be checked before the pages go up.
