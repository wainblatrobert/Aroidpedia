# -*- coding: utf-8 -*-
"""Write the inbox reading report. Composed as a file, not a heredoc -
backslashes and backticks both get eaten going through bash."""
import io

OUT = ("G:/My Drive/PlantsV2/Aroidpedia/LITERATURE/"
       "INBOX READ 8.27.26 - WHAT THE 26 PAPERS CHANGE.md")

DOC = """# INBOX READ 8.27.26 — what the 26 new papers change

All 26 are filed, text-extracted, classified and **hand-curated** (real
titles, authors, years, and a note on each). Catalogue 1,094 → 1,120.
`CATALOG-OFFTREE.json` was checked and is untouched at 1,119.

Four had no extractable text and were **read visually**, page by page:
*suwidjianus*, *Sivadasan 1983*, *Amorphophallus julaihii*, and one Zuluaga
supplement.

---

## 1. Two papers we were already citing but did not hold

Both check out, which is the good outcome — but each carries material we
did not use.

### Gonçalves, Paiva & Coelho 2004 — petiolar collenchyma
Cited as **ref 3 of the Philodendron morphology guide**. Every claim the
guide makes from it verifies against the full text, word for word: the
115 species / 56 genera / ~51% figure, both pattern definitions, the
"very conservative within genera" line, Engler's dismissal, and the
1–4-cell parenchyma intrusions in *Philodendron uliginosum* and
*Philodendron pedatum*.

**But the guide says the survey found "essentially two arrangements". It
defines three.** The first is collenchyma **absent** at the petiole
midpoint, and it is restricted to tribe Zamioculcadeae and the genus
*Anubias*. Three further findings we do not use:

- ⭐ **No genus with bisexual flowers so far analysed has collenchyma at
  the petiole midpoint**, though it usually occurs at apex and base. A
  floral character predicting a petiole one — which is close to the
  argument the whole morphology section exists to make.
- **A fully collenchymatous petiole appears only in more derived genera**
  and "may be an apomorphic feature within the family" — the authors'
  own phylogenetic reading of the character.
- The parenchyma intrusions **line up with the stomata** in every species
  that has them, and nobody knows why; the authors ask how permeable the
  tissue is to air and leave it there.

And a caution worth adding to Part II: in three of four *Aglaonema*
species the ring is so widely interrupted that the segments *look* like
colocasioid strands. The authors still call it philodendroid — because
the strands are **not associated with vascular bundles**. The two types
grade into one another, and the vascular association, not the shape, is
what decides.

### Claudel & Lev-Yadun 2021 — odour polymorphism in *Amorphophallus*
Cited as the source of **Part V's chemistry table** on the Amorphophallus
reproduction page. Its central argument is not on the page:

> No clear evolutionary trend in inflorescence odour may be findable at
> all, because **intraspecific scent variation can exceed interspecific
> variation.**

That constrains every species-level scent statement we make, on that page
and elsewhere. Their other headline: dimethyl oligosulfides occur across
**all four subgenera** and are the most common constituent in **half of
the 92 species** surveyed.

---

## 2. What is genuinely new

### MORPHOLOGY

**Extracellular calcium oxalate — a whole class the hub is missing.**
Barabé, Lacroix, Chouteau & Gibernau 2004 (*Bot. J. Linn. Soc.* 146:
181–190). Our "Inside the tissue" block covers raphides thoroughly —
idioblasts, biforines, the Colocasia/Alocasia dimensions, the delivery-
system framing — and says nothing about crystals **outside** cells:

- Exuded on the epidermis as **druses or crystal sand**; mixed with pollen
  as **raphides or styloids**.
- **Raphides mixed with pollen is widespread across the family**, and
  whether a given species does it is a **species-level, not genus-level**
  character.
- Seen on nearly mature stamens in many *Philodendron*, and on stamens,
  staminodes or bristles in *Arum* and *Schismatoglottis*.
- ⭐ **Keating's 2002 anatomy survey — the standard reference — reports
  only intracellular crystals.** This class is missing from the book the
  field reaches for.
- Function **explicitly unknown**; the authors pose the pollination link
  as an open question and do not answer it.

**A seed character that separates *Monstera*.** The Zuluaga seed
morphometrics supplement (read visually) puts *Monstera* in **its own
region of seed morphospace**, clear of every other Monsteroideae genus on
PC2, while the *Rhaphidophora* clade sprawls across a far larger area.
The Monstera guide's thesis is that the adult leaf is the least reliable
character in the genus — a seed character that *does* separate it is the
natural counterpoint, and the guide currently ends without one.

**An independent example for the Alocasia H/I passage.** Poisson &
Barabé 2011 (*Kew Bull.* 66: 537–543) on *Dracontium polyphyllum*:
gynoecia are trilocular in 90% of specimens, tetralocular in the rest —
and **the tetralocular ones occur at random among the trilocular**. That
is the same trap Part VII now warns about, in a different organ and a
different genus.

### REPRODUCTION

**A fungal layer in the floral chamber.** Ruprecht, Socher & Dötterl 2021
(*Acta Mycologica* 56: 563). ITS barcoding found two *Cladosporium* taxa
as a spatially well-defined layer inside the **proximal, permanently
closed** part of an *Amorphophallus titanum* spathe during anthesis. They
discuss possible interference with pollen transfer and possible growth-
promoting fungal volatiles. ⚠ **One cultivated plant, Salzburg, June
2019** — weak by construction, and it should be framed that way. Its
real interest may be as a confounder: a fungal layer in the chamber sits
exactly where chamber scent is sampled.

**Crystals on the sexual organs.** The extracellular-oxalate paper above
is a reproduction finding as much as a morphology one — crystals on
stamens, staminodes and bristles, and mixed with pollen, in three genera
we have pages for.

**Two genera we do not cover.** Barabé, Lacroix & Gibernau 2004 (*Can. J.
Bot.* 82: 282–289) on *Ambrosina* and *Arisarum*: *Arisarum* carries
**atypical organs showing both male and female characteristics**;
*Ambrosina*'s male flowers are **di- or tri-androus**; shared pollen type
and longitudinal theca dehiscence support a close relationship; and in
*Arisarum* the pollen is mixed with extracellular prismatic crystals.

### PHYLOGENY

**Grayum 1990** (*Ann. Missouri Bot. Gard.* 77: 628–697) — the major
pre-molecular phylogeny. Superseded on topology (it merges Pothoideae
with Monsteroideae, dissolves Calloideae, rearranges Colocasioideae,
absorbs Pistioideae and Thomsonieae), so it changes nothing in the tree.
What it offers is an explicit list of the states it infers **primitive**
for Araceae — rhizomatous or caulescent habit, simple blades, parallel
venation, a simple green spathe, bisexual perigoniate flowers, trilocular
ovaries with axile placentation, anatropous crassinucellate ovules,
elongate stamens with longitudinal dehiscence, x = 7 or 14, and
monosulcate reticulate binucleate pollen without starch. We have nothing
equivalent anywhere on the site. ⚠ It must be attributed as **Grayum's
1990 inference**, not as modern consensus.

**Nicolson 1977** (*Taxon* 26: 337–338) — the nomenclatural argument
behind the name **Amorphophallus paeoniifolius**. *Dracontium
paeoniifolium* Dennstedt (1818) antedates *Arum campanulatum* Roxburgh,
which cited Rheede's plate 19 in synonymy and is therefore illegitimate.
This is the primary source for why the species is not *A. campanulatus*.

**The six Zuluaga supplements are now catalogued**, including the one
that carries the node numbering — with the trap recorded in its note:
**Table S6 numbers its nodes after Fig. S1, not Fig. 2.**

---

## 3. Corrections made

- **Flora of Thailand Araceae was dated 1968.** That is the most-cited
  year *inside* the text, not its publication year — it cites work up to
  2011. Corrected to **2012** (Boyce, Sookchaloem, Hetterscheid, Gusman,
  Jacobsen, Idei & Nguyen; 221 pp.).
- All 26 titles were filenames; all now carry real titles, authors and
  years, flagged `title_confidence: hand`.
  ⚠ `refresh_catalog.py` preserves these — **`--reclassify` would wipe
  them.**

## 4. One paper does not belong

`MISCELLANEOUS_BOTANICAL_NOTES_V.pdf` — van Steenis & Veldkamp 1982,
*Reinwardtia* 10(1): 21–26. **Zero Araceae content**: no mention of the
family and no aroid genus anywhere in the full text. It concerns
*Ormosia* (Leguminosae), *Trifidacanthus*/*Desmodium* and
*Platyspermation*. The classifier's "ecology-distribution /
floristics-checklist" tags are a false positive. Flagged in its note;
delete it if it arrived by accident.

## 5. Regional taxonomy (for the geography lane, not these three)

Six Bornean/Indian papers add distribution and species-description
material rather than anything that changes the three sections: two new
*Amorphophallus* from Kalimantan and Perak (Ipor et al. 2010),
*A. julaihii* from Mulu limestone (2004), *A. ranchanensis* from Serian
(2007), the Sarawak limestone aroid flora (Boyce & Wong 2009),
*A. ravenii* from Laos (2018), *A. mysorensis* extended into Odisha
(2022), and Sivadasan's 1983 conservation assessment of Indian aroids.
The *julaihii* paper carries a useful census: at the time, **15
indigenous Bornean species, 13 of them described within the preceding 25
years**.
"""

open(OUT, "w", encoding="utf-8", newline="\r\n").write(DOC)
print("wrote %s" % OUT.rsplit("/", 1)[-1])
print("%d lines, %d chars" % (DOC.count("\n") + 1, len(DOC)))
