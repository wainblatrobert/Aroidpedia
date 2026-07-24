/* =====================================================================
   AROIDPEDIA — counts.json BUILDER
   FILE VERSION: v3   (last updated 2026-07-24)
   Bump this number (and the date) any time this file is replaced, so an
   old copy is never mistaken for the current one.

   v2 ADDS THE "Hybrid Cultivar" CATEGORY, folded into the HYBRIDS
   count rather than broken out. A cultivar of a hybrid is still a
   hybrid as far as the genus page's top-line figure is concerned, and
   this has to agree with the genus index block, whose hybrids headline
   is likewise hybrids + hybrid cultivars combined. If the two ever
   disagree, that mismatch surfaces on the page as two different numbers
   for the same thing.

   A separate `hybridCultivars` figure IS emitted alongside, both
   site-wide and per genus, but it is INFORMATIONAL ONLY - nothing on
   the site renders it. It exists so the split can be reconciled from
   the console when the index and the hero counter are compared, which
   is exactly the check that caught the last counting discrepancy.
   `hybrids` remains inclusive of it; do not subtract one from the other.
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
const CAT_HYBRID_CULTIVAR = ["hybrid cultivar", "hybrid cultivars"];

function toJsonUrl(url) {
  const u = new URL(url, SITE_ORIGIN);
  u.searchParams.set("format", "json");
  return u.toString();
}

async function fetchJson(url) {
  const jsonUrl = toJsonUrl(url);

  console.log("Fetching:", jsonUrl);

  const response = await fetch(jsonUrl, {
    headers: {
      "User-Agent": "Aroidpedia Counts Bot"
    }
  });

  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status}: ${jsonUrl}`);
  }

  return response.json();
}

function getItems(data) {
  if (Array.isArray(data.items)) return data.items;
  if (data.collection && Array.isArray(data.collection.items)) return data.collection.items;
  if (data.page && Array.isArray(data.page.items)) return data.page.items;
  if (data.data && Array.isArray(data.data.items)) return data.data.items;
  return [];
}

function getNextPageUrl(data) {
  const pagination =
    data.pagination ||
    data.collection?.pagination ||
    data.page?.pagination ||
    {};

  return (
    pagination.nextPageUrl ||
    pagination.nextUrl ||
    pagination.next ||
    pagination.nextPage ||
    null
  );
}

function valueToNames(value) {
  if (!value) return [];

  const arr = Array.isArray(value) ? value : [value];

  return arr
    .map((v) => {
      if (!v) return "";
      if (typeof v === "string") return v;
      return v.title || v.name || v.label || v.displayName || v.slug || "";
    })
    .filter(Boolean)
    .map((v) => String(v).trim());
}

/* v2: hyphens and underscores collapse to spaces, and runs of
   whitespace collapse to one. Squarespace hands back the display name
   ("Hybrid Cultivar"), but a slug ("hybrid-cultivar") can arrive from
   some payload shapes, and both must land on the same token. */
function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

function slugToTitle(value) {
  return String(value || "")
    .replace(/^tag-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function normalizeComparable(value) {
  return String(value || "")
    .replace(/^tag-/, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getCategories(item) {
  return valueToNames(item.categories || item.category);
}

function getTags(item) {
  return valueToNames(
    item.tags ||
    item.tagNames ||
    item.tagList ||
    item.labels
  );
}

function getItemKey(item, index) {
  return (
    item.id ||
    item.systemDataId ||
    item.urlId ||
    item.fullUrl ||
    item.url ||
    item.title ||
    `item-${index}`
  );
}

function getGenus(item) {
  const tags = getTags(item);

  if (!tags.length) return "";

  // Best method: choose the first tag that matches your accepted-genera list.
  for (const tag of tags) {
    const comparable = normalizeComparable(tag);
    if (GENERA_SET.has(comparable)) {
      return slugToTitle(tag);
    }
  }

  // Fallback: your current Custom Filter assumes the first tag is the genus.
  return slugToTitle(tags[0]);
}

async function fetchAllJournalItems() {
  let allItems = [];
  let nextUrl = COLLECTION_PATH;
  let guard = 0;

  const seenPages = new Set();

  while (nextUrl && guard < 200) {
    const jsonUrl = toJsonUrl(nextUrl);

    if (seenPages.has(jsonUrl)) break;
    seenPages.add(jsonUrl);

    const data = await fetchJson(nextUrl);
    const items = getItems(data);

    allItems = allItems.concat(items);

    nextUrl = getNextPageUrl(data);
    guard++;
  }

  return allItems;
}

function countCollection(items) {
  const counts = {
    species: 0,
    cultivars: 0,
    hybrids: 0,
    hybridCultivars: 0,
    genera: new Set()
  };

  // Per-genus breakdown:
  //   genus -> { total, species, cultivars, hybrids, hybridCultivars }
  const byGenusMap = new Map();

  function bumpGenus(genus, kind) {
    let g = byGenusMap.get(genus);
    if (!g) {
      g = { total: 0, species: 0, cultivars: 0, hybrids: 0, hybridCultivars: 0 };
      byGenusMap.set(genus, g);
    }
    g.total++;
    if (kind) g[kind]++;
  }

  const seenItems = new Set();

  items.forEach((item, index) => {
    const key = getItemKey(item, index);
    if (seenItems.has(key)) return;
    seenItems.add(key);

    const categories = getCategories(item).map(normalizeCategory);
    const has = (names) => names.some((n) => categories.includes(n));

    const isSpecies = has(CAT_SPECIES);
    const isCultivar = has(CAT_CULTIVAR);
    const isHybridCultivar = has(CAT_HYBRID_CULTIVAR);

    /* v2: a hybrid cultivar counts as a hybrid. Note this is a BOOLEAN
       OR, not an addition - an item carrying both "Hybrid" and "Hybrid
       Cultivar" still contributes exactly 1 to the hybrids figure. */
    const isHybrid = has(CAT_HYBRID) || isHybridCultivar;

    if (isSpecies) counts.species++;
    if (isCultivar) counts.cultivars++;
    if (isHybrid) counts.hybrids++;
    if (isHybridCultivar) counts.hybridCultivars++;   // informational only

    if (isSpecies || isCultivar || isHybrid) {
      const genus = getGenus(item);
      if (genus) {
        counts.genera.add(genus);
        // A single item can, in theory, carry more than one category tag.
        // Count the item once toward the genus total, and bump each
        // matching category so the breakdown stays internally consistent.
        bumpGenus(genus, null);
        if (isSpecies)         byGenusMap.get(genus).species++;
        if (isCultivar)        byGenusMap.get(genus).cultivars++;
        if (isHybrid)          byGenusMap.get(genus).hybrids++;
        if (isHybridCultivar)  byGenusMap.get(genus).hybridCultivars++;
      }
    }
  });

  // Convert the per-genus map to a plain object, sorted by total desc
  const byGenus = {};
  [...byGenusMap.entries()]
    .sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]))
    .forEach(([genus, g]) => { byGenus[genus] = g; });

  return {
    species: counts.species,
    cultivars: counts.cultivars,
    hybrids: counts.hybrids,
    hybridCultivars: counts.hybridCultivars,
    genera: counts.genera.size,
    byGenus,
    updatedAt: new Date().toISOString(),
    source: `${SITE_ORIGIN}${COLLECTION_PATH}`,
    totalItemsScanned: seenItems.size
  };
}

async function main() {
  const items = await fetchAllJournalItems();
  const counts = countCollection(items);

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(counts, null, 2) + "\n", "utf8");

  console.log("Counts written:", counts);
}

/* Export for testing; main() only runs when executed directly, so a
   test harness can import countCollection without triggering a fetch.

   v3: the direct-run check uses fileURLToPath + path.resolve rather
   than the common `import.meta.url === \`file://${process.argv[1]}\``
   idiom. That idiom breaks on any path needing URL encoding - a space
   in a runner directory is enough - and its failure mode here is
   SILENT: main() simply never runs, the Action writes nothing, and the
   workflow's commit step reports "No count changes to commit" as
   though the data were merely unchanged. Comparing resolved filesystem
   paths avoids the encoding question entirely.

   The `|| !process.argv[1]` fallback is a second belt: if argv[1] is
   somehow absent, run anyway. For a scheduled job, running when it
   maybe shouldn't is a far cheaper mistake than silently not running. */
export { countCollection, normalizeCategory };

const invokedDirectly =
  !process.argv[1] ||
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
