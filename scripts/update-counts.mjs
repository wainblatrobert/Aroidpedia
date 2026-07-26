/* =====================================================================
   AROIDPEDIA — counts.json BUILDER
   FILE VERSION: v4   (last updated 2026-07-26)
   Bump this number (and the date) any time this file is replaced, so an
   old copy is never mistaken for the current one.
   v4 MAKES THE FOUR CATEGORIES MUTUALLY EXCLUSIVE. Every item lands in
   exactly ONE of species / cultivars / hybrids / hybridCultivars, and
   is never counted twice. Aggregation is now the caller's job: the
   code blocks on the site decide what to add together.
   THIS REVERSES v2. Under v2, `hybrids` was inclusive - a hybrid
   cultivar bumped BOTH `hybrids` and `hybridCultivars`, and the site
   rendered the inclusive figure. Under v4 `hybrids` means PLAIN
   hybrids only. Anything on the site that wants the old inclusive
   number must now render:
       hybrids + hybridCultivars
   Both the genus page top-line and the genus index hybrids headline
   read that field, so BOTH need the addition or both will silently
   drop by the hybrid-cultivar count. They must be changed together -
   that pair disagreeing is precisely the two-different-numbers-for-
   the-same-thing failure the v2 note was written about.
   WHAT MAKES THE BUCKETS DISJOINT: a single classify step per item,
   with a documented precedence, replacing v3's four independent `if`
   tests. Precedence runs most-specific first:
       hybridCultivars > hybrids > cultivars > species
   so an item tagged both "Hybrid" and "Hybrid Cultivar" is a hybrid
   cultivar and is counted once, there. Multi-category items are no
   longer silently double counted - but they ARE now silently
   RECLASSIFIED, which is a quieter kind of wrong, so every one of
   them is reported in `diagnostics.multiCategory`.
   TWO NEW SELF-CHECKS, both cheap and both worth keeping:
     - `unclassified` counts items matching no category at all. In v3
       these vanished without trace. Now the four buckets plus
       `unclassified` sum to `totalItemsScanned` EXACTLY, and that
       invariant is asserted below - a mismatch throws and fails the
       Action rather than publishing wrong numbers.
     - `diagnostics` lists the titles of multi-category and
       unclassified items (capped), so a mis-tagged page shows up in
       the Action log instead of quietly bending a headline figure.
   Per genus, `total` is now exactly the sum of that genus's four
   buckets. Under v3 it was an independent per-item tally that could
   drift below the sum; it can no longer disagree.
   ===================================================================== */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const SITE_ORIGIN = process.env.SITE_ORIGIN || "https://www.aroidpedia.com";
const COLLECTION_PATH = process.env.COLLECTION_PATH || "/journal";
const OUT_FILE = process.env.OUT_FILE || "docs/counts.json";
const GENERA = [
  "Adelonema","Aglaodorum","Aglaonema","Aia","Alloschemone","Alocasia","Ambrosina",
  "Amorphophallus","Amydrium","Anadendrum","Anaphyllopsis","Anaphyllum","Anchomanes",
  "Anthurium","Anubias","Apoballis","Aridarum","Ariopsis","Arisaema","Arisarum",
  "Arophyton","Arum","Asterostigma","Ayuantha","Bakoa","Bakoaella","Bau","Biarum",
  "Bidayuha","Bognera","Borneoa","Boycea","Bucephalandra","Burttianthus","Caladium",
  "Calla","Callopsis","Carlephyton","Cercestis","Chlorospatha","Colletogyne",
  "Colobogynium","Colocasia","Croatiella","Cryptocoryne","Culcasia","Cyrtosperma",
  "Dieffenbachia","Dracontioides","Dracontium","Dracunculus","Eminium","Englerarum",
  "Epipremnum","Fenestratarum","Filarum","Furtadoa","Galantharum","Gamogyne","Gearum",
  "Gonatopus","Gorgonidium","Gosong","Gymnostachys","Hapaline","Helicodiceros","Hera",
  "Heteroaridarum","Heteropsis","Holochlamys","Homalomena","Hottarum","Ibania",
  "Idimanthus","Incarum","Jasarum","Josefia","Kiewia","Lagenandra","Lasia","Lasimorpha",
  "Lazarum","Lemna","Leucocasia","Lorenzia","Lysichiton","Mangonia","Monstera",
  "Montrichardia","Nabalu","Naiadia","Nephthytis","Ooia","Orontium","Peltandra",
  "Philodendron","Philonotion","Phyllotaenium","Phymatarum","Pichinia","Pinellia",
  "Piptospatha","Pistia","Podolasia","Pothoidium","Pothos","Protarum","Pseudohydrosme",
  "Pursegloveia","Pycnospatha","Remusatia","Rhaphidophora","Rhodospatha","Rhynchopyle",
  "Sarawakia","Sauromatum","Scaphispatha","Schottarum","Schottariella",
  "Scindapsus","Spathantheum","Spathicarpa","Spathiphyllum","Spirodela","Stenospermation",
  "Steudnera","Stylochiton","Symplocarpus","Synandrospadix","Syngonium",
  "Taccarum","Tawaia","Theriophonum","Toga","Tweeddalea","Typhonium","Typhonodorum",
  "Ulearum","Urospatha","Vesta","Vietnamocasia","Vivaria","Wolffia","Wolffiella",
  "Xanthosoma","Zamioculcas","Zantedeschia","Zomicarpa","Zomicarpella"
];
const GENERA_SET = new Set(GENERA.map(normalizeComparable));
/* Category name sets, normalised. Kept as data rather than inline
   conditionals so a renamed or pluralised category is a one-line edit.
   Matching is EXACT against the normalised name - "hybrid cultivar"
   never satisfies "cultivar", because these are whole-string
   comparisons rather than substring tests. That is load-bearing: a
   substring match would silently count every hybrid cultivar as a
   plain cultivar too. */
const CAT_SPECIES         = ["species"];
const CAT_CULTIVAR        = ["cultivar", "cultivars"];
const CAT_HYBRID          = ["hybrid", "hybrids"];
