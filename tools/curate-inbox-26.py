# -*- coding: utf-8 -*-
"""Curate the 26 newly-ingested papers: real titles, authors, years, notes.

The classifier does subjects well but leaves the TITLE as the filename and
often has no year - and it read "Flora of Thailand" as 1968, which is the
most-cited year INSIDE the text, not its publication year (it cites work up
to 2011, so it is the 2012 treatment).

refresh_catalog.py carries an existing record forward wholesale when the
file is unchanged, so these survive a normal re-run.
⚠ `--reclassify` WOULD WIPE THEM. Do not pass it without re-applying this.
"""
import json, os, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
APPLY = "--apply" in sys.argv
CAT = "G:/My Drive/PlantsV2/Aroidpedia/LITERATURE/_INDEX/CATALOG.json"

Z = "Zuluaga, A., Llano, M. & Cameron, K."
ZT = ("Systematics, biogeography and morphological character evolution of the "
      "hemiepiphytic subfamily Monsteroideae (Araceae) \u2014 supplementary material")

M = {
 # ---- Zuluaga et al. 2019 Monsteroideae supplements (six files) --------
 "269-Other-6893-1-10-20190305.pdf": dict(
   title=ZT + ": clade tree with node numbers", authors=Z, year=2019,
   note="Supplement to the Monsteroideae phylogeny. Labelled tree carrying the "
        "node numbers the other supplements refer to. THIS NUMBERING is the one "
        "Table S6 uses - it follows Fig. S1, not Fig. 2."),
 "269-Other-6894-1-10-20190305.pdf": dict(
   title=ZT + ": perianth and seed-endosperm character mapping", authors=Z, year=2019,
   note="Ancestral-state mapping of perianth (absent/present) and seed endosperm "
        "(absent/present) across Monsteroideae."),
 "269-Other-6895-1-10-20190305.pdf": dict(
   title=ZT + ": locule-number and seed-number character mapping", authors=Z, year=2019,
   note="Ancestral-state mapping of locule number (1/2/3) and seed number "
        "(1/2/3-8/>10)."),
 "269-Other-6896-1-10-20190305.pdf": dict(
   title=ZT + ": seed morphometrics (PCA)", authors=Z, year=2019,
   note="IMAGE-ONLY; read visually 8.27.26. PCA of seed shape and size across "
        "Monsteroideae, with clade ellipses (Rhaphidophora clade, Heteropsis "
        "clade, Spathiphylleae) and genus ellipses. MONSTERA OCCUPIES ITS OWN "
        "REGION OF SEED MORPHOSPACE, separated on PC2 from every other genus; "
        "the Rhaphidophora clade spans a far larger space than the Heteropsis "
        "clade or Spathiphylleae. Panel E is a plate of seed outlines by taxon."),
 "269-Other-6897-1-10-20190305.pdf": dict(
   title=ZT + ": chronogram with biogeographic areas A-H", authors=Z, year=2019,
   note="Time-calibrated tree, 100-0 Ma, with ancestral areas coded A-H."),
 "269-Other-6898-1-10-20190305.pdf": dict(
   title=ZT + ": cover sheet and Figure S1 (BEAST chronogram)", authors=Z, year=2019,
   note="The supplement's own cover page. Figure S1 = BEAST chronogram from five "
        "plastid regions with node numbers and 95% HPD bars. THIS IS THE FIGURE "
        "Table S6's node numbering follows."),

 # ---- Amorphophallus: history, nomenclature, scent, fungi -------------
 "4a604b54-9020-4d40-a180-3f063beddb06.pdf": dict(
   title="Sull'Amorphophallus titanum Beccari", authors="Arcangeli, G.", year=1879,
   note="Bullettino della R. Societa Toscana di Orticultura 4(2): 46-51. Italian. "
        "An 1879 account of Amorphophallus titanum, four years after Beccari "
        "described it - among the earliest published observations of the plant."),
 "c9f9af62-7a0d-42ec-962a-74798d336631.pdf": dict(
   title="Proposal to change the typification of 723 Amorphophallus, nom. cons.",
   authors="Nicolson, D. H.", year=1977,
   note="Taxon 26(2/3): 337-338. The nomenclatural argument behind the modern name "
        "AMORPHOPHALLUS PAEONIIFOLIUS: Dracontium paeoniifolium Dennstedt (1818) "
        "antedates Arum campanulatum Roxburgh, which cited Rheede's plate 19 in "
        "synonymy and is therefore illegitimate. Primary source for why the "
        "species is not A. campanulatus."),
 "Amorphophallus-Scent-PSB-Online-First (1) - thaiensis.pdf": dict(
   title="Odor polymorphism in deceptive Amorphophallus species - a review",
   authors="Claudel, C. & Lev-Yadun, S.", year=2021,
   note="Plant Signaling & Behavior, doi:10.1080/15592324.2021.1991712. ALREADY "
        "CITED as the source of Part V's chemistry table on the Amorphophallus "
        "reproduction page - the PDF only reached the archive 8.27.26. Its "
        "central argument is a caveat we do not yet state: no clear evolutionary "
        "trend in inflorescence odour may be findable because INTRASPECIFIC "
        "scent variation (odour polymorphism) can exceed INTERSPECIFIC variation. "
        "Dimethyl oligosulfides occur across all four subgenera and are the most "
        "common constituents in half of the 92 species surveyed."),
 "Titanarum2021 (1).pdf": dict(
   title=("Unexpected occurrence of Cladosporium spp. on the inner surface of the "
          "spathe of the titan arum, Amorphophallus titanum"),
   authors="Ruprecht, U., Socher, S. A. & Dotterl, S.", year=2021,
   note="Acta Mycologica 56: 563, doi:10.5586/am.563. ITS barcoding found two "
        "Cladosporium taxa (C. cf. dominicanum, C. halotolerans) as a spatially "
        "well-defined fungal layer inside the PROXIMAL, permanently closed part "
        "of the spathe - the floral chamber - during anthesis. Discusses possible "
        "interference with pollen transfer and possible growth-promoting fungal "
        "volatiles. WEAK BY DESIGN: one cultivated plant, Salzburg, June 2019."),

 # ---- Araceae-wide morphology / anatomy / phylogeny -------------------
 "Araceae.pdf": dict(
   title="A preliminary survey of petiolar collenchyma in the Araceae",
   authors="Goncalves, E. G., Paiva, E. A. S. & Coelho, M. A. N.", year=2004,
   note="Annals of the Missouri Botanical Garden 91: 473-484. ALREADY CITED as "
        "ref 3 of the Philodendron morphology guide - the PDF only reached the "
        "archive 8.27.26, and every claim the guide makes from it was verified "
        "against the full text on arrival. NOTE the guide says the survey found "
        "'essentially two arrangements'; the paper defines THREE, the first being "
        "collenchyma ABSENT at the petiole midpoint, restricted to tribe "
        "Zamioculcadeae and the genus Anubias. Also unused: no genus with "
        "bisexual flowers so far analysed has collenchyma at the petiole "
        "midpoint - a floral character predicting a petiole one."),
 "extracellular calcium oxalate.pdf.pdf": dict(
   title="On the presence of extracellular calcium oxalate crystals on the inflorescences of Araceae",
   authors="Barabe, D., Lacroix, C., Chouteau, M. & Gibernau, M.", year=2004,
   note="Botanical Journal of the Linnean Society 146: 181-190. Crystals exuded on "
        "the epidermis are druses or crystal sand; crystals MIXED WITH POLLEN are "
        "raphides or styloids. Raphides mixed with pollen is widespread in the "
        "family, and whether a species does it is a SPECIES-level not genus-level "
        "character. Seen on nearly mature stamens in many Philodendron, and on "
        "stamens/staminodes/bristles in Arum and Schismatoglottis. Keating's 2002 "
        "anatomy survey reports only INTRAcellular crystals, so this class is "
        "missing from the standard reference. Function explicitly unknown."),
 "AmbrosinaArisarum-Barabetal2004 (1).pdf": dict(
   title="Aspects of floral morphology in Ambrosina and Arisarum (Araceae)",
   authors="Barabe, D., Lacroix, C. & Gibernau, M.", year=2004,
   note="Can. J. Bot. 82: 282-289, doi:10.1139/B03-125. Arisarum carries ATYPICAL "
        "ORGANS showing both male and female characteristics; Ambrosina's male "
        "flowers are di- or tri-androus. Shared pollen type (ellipsoid, "
        "inaperturate, striate-reticulate) and longitudinal theca dehiscence "
        "support a close Ambrosina-Arisarum relationship. In Arisarum the pollen "
        "is mixed with extracellular prismatic calcium oxalate - the companion "
        "observation to Barabe et al. 2004 (Bot. J. Linn. Soc.)."),
 "Poisson-Developmentalmorphologyflower-2011.pdf": dict(
   title=("Developmental morphology of the flower of Dracontium polyphyllum in the "
          "context of the phylogeny of the Araceae"),
   authors="Poisson, G. & Barabe, D.", year=2011,
   note="Kew Bulletin 66(4): 537-543. 150-300 flowers in recognisable spirals; "
        "5-6 tepals in 90% of specimens (or 7); 9-12 stamens in two whorls; "
        "gynoecium trilocular in 90% (or tetralocular), and THE TETRALOCULAR ONES "
        "OCCUR AT RANDOM AMONG THE TRILOCULAR - a character varying within a "
        "single inflorescence, which is the same trap the Alocasia H/I passage "
        "warns about."),
 "Evolution and Phylogeny or Araceae.pdf": dict(
   title="Evolution and phylogeny of the Araceae",
   authors="Grayum, M. H.", year=1990,
   note="Annals of the Missouri Botanical Garden 77(4): 628-697. The major "
        "PRE-MOLECULAR phylogeny, largely superseded on topology (it merges "
        "Pothoideae with Monsteroideae, dissolves Calloideae, rearranges "
        "Colocasioideae, absorbs Pistioideae and Thomsonieae). Still valuable for "
        "its explicit list of states inferred PRIMITIVE for the family: "
        "rhizomatous or caulescent habit, simple blades, parallel venation, "
        "simple green spathe, bisexual perigoniate flowers, trilocular ovaries "
        "with axile placentation, anatropous crassinucellate ovules, elongate "
        "stamens with longitudinal dehiscence, x = 7 or 14, and monosulcate "
        "reticulate binucleate pollen without starch. ATTRIBUTE THESE AS GRAYUM'S "
        "1990 INFERENCES, not as modern consensus."),
 "Flora of Thailand Volume 11 Part 2.pdf": dict(
   title="Araceae. Flora of Thailand 11(2): 1-221",
   authors=("Boyce, P. C., Sookchaloem, D., Hetterscheid, W. L. A., Gusman, G., "
            "Jacobsen, N., Idei, T. & Nguyen, V. D."), year=2012,
   note="Full regional treatment, 221 pages. ⚠ THE CATALOGUE FIRST READ THIS AS "
        "1968 - that is the most-cited year INSIDE the text, not its publication "
        "year; it cites work up to 2011. Heaviest coverage: Amorphophallus and "
        "Typhonium. A primary source for Thai distributions."),

 # ---- Bornean / Indian taxonomy and floristics ------------------------
 "suwidjianus.pdf": dict(
   title="Two new species of Amorphophallus (Araceae) from Kalimantan, Indonesia and Peninsular Malaysia",
   authors="Ipor, I. B., Tawan, C. S. & Meekiong, K.", year=2010,
   note="Folia Malaysiana 11(1): 39-46. IMAGE-ONLY; read visually 8.27.26. "
        "Describes Amorphophallus suwidjianus (Lanjak, West Kalimantan) and "
        "Amorphophallus bintangensis (Perak)."),
 "Amorphophallusjulaihii-GardensBulletinSingapore56153-159-IporCheksumBoyce2004.pdf": dict(
   title="A new species of Amorphophallus (Araceae: Thomsonieae) from Sarawak, Borneo",
   authors="Ipor, I. B., Tawan, C. S. & Boyce, P. C.", year=2004,
   note="Gardens' Bulletin Singapore 56: 153-159. IMAGE-ONLY; read visually "
        "8.27.26. Describes Amorphophallus julaihii from forested limestone in "
        "Mulu National Park. Carries a useful Bornean census at the time: 15 "
        "indigenous species, 8 in Sarawak, 5 in Sabah, 8 in Kalimantan, all "
        "endemic to Borneo except A. prainii - and 13 of the 15 described within "
        "the preceding 25 years."),
 "Folia Malaysiana Vol. 8 (1) page 1 - 10 (2007).pdf": dict(
   title="A new species of Amorphophallus (Araceae: Thomsonieae) from Sarawak",
   authors="Ipor, I. B., Tawan, C. S., Simon, A., Meekiong, K. & Fuad, A.", year=2007,
   note="Folia Malaysiana 8(1): 1-10. Describes Amorphophallus ranchanensis from "
        "sandstone at Ranchan Recreational Park, Serian, Sarawak."),
 "AMORPHOPHALLUS_DIVERSITY_AND_CONSERVATIO.pdf": dict(
   title="Amorphophallus diversity and conservation in Borneo and Malaysia",
   authors="Ipor, I. B., Tawan, C. S., Meekiong, K. & Simon, A.", year=None,
   note="International Seminar on Multidisciplinary Approaches in Angiosperm "
        "Systematics, p. 334ff. Over ten years of survey in Sarawak and Sabah; "
        "systematics, ecology and economic uses. Undated in the scan; cites work "
        "to 2004."),
 "TheAroidsoftheSarawakLimestone-Newslett.Int.AroidSoc.31218-BoyceWong2009.pdf": dict(
   title="The aroids of the West Sarawak limestone",
   authors="Boyce, P. C. & Wong, S. Y.", year=2009,
   note="IAS Newsletter 31(2). Limestone-restricted aroid flora of West Sarawak - "
        "relevant to the substrate-endemism pattern behind several Bornean "
        "species."),
 "Amorphophallusraveniiprotologue-NguyenV.Detal.2018-Novon26153-55 (1).pdf": dict(
   title="Amorphophallus ravenii, a new species of Amorphophallus (Araceae) from Laos",
   authors=("Nguyen, V. D., Tien, T. V., Loan, L. T., Bouamanivon, S. & "
            "Hetterscheid, W. L. A."), year=2018,
   note="Novon 26(1): 53-55, doi:10.3417/D1700005. Protologue."),
 "AmorphophallusshyamsalilianumJ.V.GadpayaleS.R.SomkuwarChaturvedisp.nov..pdf": dict(
   title="Amorphophallus shyamsalilianum sp. nov.",
   authors="Gadpayale, J. V., Somkuwar, S. R. & Chaturvedi, A.", year=None,
   note="Protologue-style description, India. Short extract only; journal and "
        "year not stated in the held pages."),
 "ReportontheextendeddistributionofendemicandthreatenedspeciesAmorphophallusmysorensisAraceaefromOdishaIndia.pdf": dict(
   title=("Report on the extended distribution of endemic and threatened species "
          "Amorphophallus mysorensis (Araceae) from Odisha, India"),
   authors="Swamy, J. & Rasingam, L.", year=2022,
   note="Nelumbo 64(2): 230-232, doi:10.20324/nelumbo/v64/2022/170756. Range "
        "extension for a threatened Indian endemic."),
 "Sivadasan1983.ThreatenedspeciesofIndianAraceae..pdf": dict(
   title="Threatened species of Indian Araceae",
   authors="Sivadasan, M.", year=1983,
   note="Chapter 43 in Jain, S. K. & Rao, R. R. (eds), An Assessment of Threatened "
        "Plants of India (Botanical Survey of India, Howrah), proceedings of the "
        "Dehra Dun seminar, 14-17 September 1981. IMAGE-ONLY; read visually "
        "8.27.26. Conservation assessment of Indian aroids, splitting threatened "
        "taxa into endemics and vanishing peripheral species."),

 # ---- does not belong here -------------------------------------------
 "MISCELLANEOUS_BOTANICAL_NOTES_V.pdf": dict(
   title="Miscellaneous botanical notes XXVI",
   authors="van Steenis, C. G. G. J. & Veldkamp, J. F.", year=1982,
   note="Reinwardtia 10(1): 21-26. ⚠⚠ NO ARACEAE CONTENT AT ALL - checked the full "
        "text: zero mentions of Araceae and no aroid genus. It concerns Ormosia "
        "(Leguminosae), Trifidacanthus/Desmodium and Platyspermation. The "
        "classifier's 'ecology-distribution / floristics-checklist' tags are a "
        "false positive. Keep only if wanted for another reason; it is not an "
        "aroid paper."),
}

cat = json.load(open(CAT, encoding="utf-8"))
recs = cat if isinstance(cat, list) else cat.get("papers", cat)
# /!\ MATCH BY STEM, NOT BY BASENAME. Every key in M above is a bare
# filename as the file arrived. Once a paper is READ, the pipeline renames
# it with a parse-tag prefix -- MISCELLANEOUS_BOTANICAL_NOTES_V.pdf became
# "[X] MISCELLANEOUS_BOTANICAL_NOTES_V.pdf" -- so a basename lookup misses
# every one of them and this script reports "26 not found" while looking
# like it ran. Measured 8.28.26: it was matching 0 of 26.
TAG = re.compile(r"^\[[PSDX]\]\s*")


def _stem(p):
    return TAG.sub("", os.path.basename(p or "")).strip().lower()


by = {_stem(r.get("file", "")): r for r in recs}

hit = miss = 0
for fn, meta in M.items():
    r = by.get(_stem(fn))
    if not r:
        print("  !! not in catalogue: %s" % fn); miss += 1; continue
    for k, v in meta.items():
        if v is not None:
            r[k] = v
    r["title_confidence"] = "hand"
    hit += 1

print("\ncurated %d record(s); %d not found" % (hit, miss))
if APPLY:
    # ⚠ SERIALISATION: CATALOG.json is CRLF with indent=1. refresh_catalog.py
    # writes it with a bare open(..., "w") and lets Windows translate \n to
    # \r\n, so do exactly that - passing newline="\n" would silently rewrite
    # 56,054 line endings and bury the real diff.
    before = open(CAT, "rb").read()
    json.dump(cat, open(CAT, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    after = open(CAT, "rb").read()
    print("written to CATALOG.json")
    print("  bytes %d -> %d   CRLF %d -> %d   bare LF %d -> %d"
          % (len(before), len(after),
             before.count(b"\r\n"), after.count(b"\r\n"),
             before.count(b"\n") - before.count(b"\r\n"),
             after.count(b"\n") - after.count(b"\r\n")))
else:
    print("DRY RUN - pass --apply to write")
