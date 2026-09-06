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
*C. hambalii* and *C. timikense* the protologues are in the Aroideana run
on the Drive; for *C. hayii* the Phytotaxa paper is paywalled; several
species have no photograph of a living plant anywhere the search reached.

Tags: New Guinea and the Solomons are tagged Oceania, as
`docs/geo-hierarchy.json` places them, and Malesia as Asia; the 2021
Alocasia pages tagged New Guinea as Asia, so the tagging convention should
be checked before the pages go up.
