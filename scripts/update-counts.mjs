/* =====================================================================
   AROIDPEDIA — counts.json BUILDER
   FILE VERSION: v6   (last updated 2026-08-12)
   Bump this number (and the date) any time this file is replaced, so an
   old copy is never mistaken for the current one.

   v6 ADDS `speciesGroups` — the tags the v5 header called "epithets"
   are in fact CLADE / SPECIES-GROUP tags (user ruling 2026-08-12:
   groups of related species, deliberately applied to the posts). They
   now resolve against the SPECIES_GROUPS vocabulary below and are
   counted per genus:

       "speciesGroups": {
         "Alocasia": { "Scabriuscula": 9, "Princeps": 8, ... }
       }

   `unresolvedTags` therefore shrinks to tags that are NEITHER a place
   NOR a known group — which is what makes it useful again: a real
   place appearing there means shapes.json is missing it; a real group
   appearing there means the vocabulary below needs the new name.
   ⚠ EXTEND SPECIES_GROUPS when a new group tag is coined — this list
   is the vocabulary, exactly like shapes.json is for places.

   v5 ADDS `byGenusGeo` — how many of a genus's records sit in each of
   the five native-range zones, for the hover card on /all-genera:

       "byGenusGeo": {
         "Amorphophallus": { "total": 61, "placed": 61,
                             "zones": { "africa": 12, "asia": 49 } }
       }

   WHY IT IS COMPUTED HERE AND NOWHERE ELSE. The card worked this out in
   the browser from search-index.json + shapes.json, which cost every
   reader 205 KB on the first hover of a documented genus. Worse, it was
   a SECOND CRAWL: on 2026-08-08 that pair said Amorphophallus held 61
   records while this file said 62, because they ran fourteen hours
   apart. Counting it here uses the SAME items as byGenus, in the same
   pass, so the two cannot disagree — `total` is literally byGenus's
   total, not a recount of it.

   HOW A RECORD IS PLACED. Each item's tags are resolved against
   docs/shapes.json's `continent` map, and the item is credited to the
   DISTINCT set of zones that produces. A post tagged Vietnam + Thailand
   + Laos is ONE Asian record, not three.

     ⚠ TAGS ARE NOT A PLACE LIST. They also carry epithets —
       Scabriuscula, Princeps, Macrorrhizos, Longiloba, Puber, Cuprea.
       The continent map is therefore used as a WHITELIST: a tag either
       resolves to a place or it does not count. There is no blacklist
       to maintain, and unresolved tags are reported at the end so a
       genuinely missing place cannot hide among the epithets.

     ⚠ `placed` IS USUALLY LESS THAN `total`, AND THAT IS CORRECT.
       Hybrids and hybrid cultivars have no native range at all — of
       Alocasia's 330 records, 159 are hybrids or hybrid cultivars.
       Both numbers are published so the card can say '159 of 330
       records carry a place' rather than letting the zone counts
       quietly fail to add up to the total beside them.

     ⚠ THE ZONE COUNTS CAN SUM TO MORE THAN `placed`. A record tagged
       in two zones is a real record in both. Distinct-per-zone is the
       point, not a rounding error.

     ⚠ IF docs/shapes.json IS MISSING, `byGenusGeo` IS OMITTED and the
       run still succeeds. The card falls back to computing it in the
       browser, which is the pre-v5 behaviour — degraded, not broken.

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
const SHAPES_FILE = process.env.SHAPES_FILE || "docs/shapes.json";

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

/* v4: the four output buckets, in classification precedence order -
   most specific first. `pickBucket` walks this list and takes the
   first hit, which is what guarantees one item -> one bucket.

   Order rationale, since it decides real numbers:
     - "Hybrid Cultivar" beats "Hybrid" and "Cultivar": it is the
       union of both, so it is the most specific description.
     - "Cultivar" beats "Species": a page for a named cultivar is
       about that cultivar, even where the species is also tagged.
   An item hitting more than one bucket is reported in diagnostics,
   because the right fix is almost always to correct the tagging
   rather than to lean on this order. */
const BUCKET_PRECEDENCE = ["hybridCultivars", "hybrids", "cultivars", "species"];

/* How many offending titles to record per diagnostic list. Enough to
   act on, few enough that a site-wide mis-tag does not balloon
   counts.json into a diff nobody can read. */
const DIAGNOSTIC_SAMPLE_CAP = 25;

/* v6: the species-group / clade vocabulary. These tags mark groups of
   related species (user ruling 2026-08-12) and are counted into
   `speciesGroups` per genus instead of falling into `unresolvedTags`.
   Matching runs through normalizeComparable, same as places, so case
   and diacritics are forgiven; the DISPLAY spelling published in
   counts.json is the canonical one written here.
   ⚠ This list is the vocabulary — extend it when a new group tag is
   coined, exactly as shapes.json is extended for a new place. */
const SPECIES_GROUPS = [
  "Scabriuscula", "Princeps", "Macrorrhizos", "Longiloba", "Puber",
  "Yunnanensis", "Pygmaeus", "Coriaceae", "Cuprea", "Other"
];

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

/* v5: shapes.json speaks in continents, the phylogeny tree — and so the
   hover card that reads this file — speaks in five zones. This table is
   the only place the two vocabularies meet.

   ⚠ SECOND HOME FOR THIS MAP. The /all-genera block carries the same
     table as CONT_ZONE, because it still computes this in the browser
     whenever `byGenusGeo` is absent. Change both together.

   'Europe' is here in advance: shapes.json carries no European place
   today because none has been provisioned, and the day one is, it
   should land in euwasia rather than be silently dropped. */
const CONT_ZONE = {
  "Asia": "asia",
  "Africa": "africa",
  "South America": "americas",
  "Central America": "americas",
  "Caribbean": "americas",
  "North America": "americas",
  "Oceania": "austral",
  "Australia": "austral",
  "Europe": "euwasia"
};

const ZONE_ORDER = ["americas", "africa", "euwasia", "asia", "austral"];

/* tag -> zone, keyed by the same normaliser the category matching uses,
   so a slug ("new-guinea") and a display name ("New Guinea") land on the
   same entry. Continent names are added as tags in their own right: some
   posts carry only "Asia", with no finer place under it. */
async function loadZoneMap() {
  let shapes;
  try {
    shapes = JSON.parse(await fs.readFile(SHAPES_FILE, "utf8"));
  } catch (error) {
    console.warn(
      `WARNING: could not read ${SHAPES_FILE} (${error.code || error.message}). ` +
      `byGenusGeo will be omitted and /all-genera will fall back to ` +
      `computing record geography in the browser.`
    );
    return null;
  }
  const continent = (shapes && shapes.continent) || {};
  const map = new Map();
  for (const [tag, cont] of Object.entries(continent)) {
    const zone = CONT_ZONE[cont];
    if (zone) map.set(normalizeComparable(tag), zone);
  }
  for (const [cont, zone] of Object.entries(CONT_ZONE)) {
    map.set(normalizeComparable(cont), zone);
  }
  return map;
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

/* v4: every bucket whose category set this item matches. Usually one
   entry. More than one means the page carries overlapping categories
   and is about to be reclassified by precedence - the caller reports
   those rather than letting the choice pass unseen. */
function matchedBuckets(normalizedCategories) {
  const has = (names) => names.some((n) => normalizedCategories.includes(n));

  const matched = [];
  if (has(CAT_SPECIES))         matched.push("species");
  if (has(CAT_CULTIVAR))        matched.push("cultivars");
  if (has(CAT_HYBRID))          matched.push("hybrids");
  if (has(CAT_HYBRID_CULTIVAR)) matched.push("hybridCultivars");

  return matched;
}

/* v4: collapse the matched list to the single bucket this item counts
   toward, or null if it matched nothing. This function is the whole
   reason the output no longer double counts. */
function pickBucket(matched) {
  for (const bucket of BUCKET_PRECEDENCE) {
    if (matched.includes(bucket)) return bucket;
  }
  return null;
}

/* v7 (9.3.26): the site is an Astro build on Cloudflare Pages now, not
   Squarespace, so the ?format=json collection pages no longer exist. The
   site publishes every record it is built from at /records.json in the
   same collection shape ({ items: [...] }, Squarespace field names) - one
   request, and countCollection() is untouched. The paging crawl below is
   kept only as a fallback. */
async function fetchRecordsFile() {
  const url = `${SITE_ORIGIN}/records.json`;
  console.log("Fetching:", url);
  const response = await fetch(url, { headers: { "User-Agent": "Aroidpedia Counts Bot" } });
  if (!response.ok) throw new Error(`Fetch failed ${response.status}: ${url}`);
  const data = await response.json();
  const items = getItems(data);
  if (!items.length) throw new Error(`records.json carried no items: ${url}`);
  console.log(`records.json: ${items.length} items (generated ${data.generated || "?"})`);
  return items;
}

async function fetchAllJournalItems() {
  try {
    return await fetchRecordsFile();
  } catch (e) {
    console.warn(`records.json unavailable (${e.message}); falling back to the collection crawl.`);
  }
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

function countCollection(items, zoneMap = null) {
  const counts = {
    species: 0,
    cultivars: 0,
    hybrids: 0,
    hybridCultivars: 0,
    unclassified: 0,
    genera: new Set()
  };

  const diagnostics = {
    multiCategory: 0,
    multiCategoryItems: [],
    unclassifiedItems: []
  };

  // Per-genus breakdown:
  //   genus -> { total, species, cultivars, hybrids, hybridCultivars }
  const byGenusMap = new Map();

  /* v5: genus -> { placed, zones }. `total` is deliberately NOT kept
     here - it is read off byGenus at assembly, so a geo total can never
     drift from the genus total printed beside it on the same card. */
  const geoMap = new Map();
  const unresolvedTags = new Map();

  /* v6: canonical-spelling lookup for the group vocabulary, plus
     genus -> { GroupName: count }. Counted here, in the same pass and
     from the same items as everything else, so it can never disagree
     with byGenus. */
  const groupLookup = new Map(
    SPECIES_GROUPS.map(g => [normalizeComparable(g), g]));
  const groupsMap = new Map();

  function bumpGeo(genus, item) {
    if (!zoneMap) return;
    const zones = new Set();
    for (const tag of getTags(item)) {
      const zone = zoneMap.get(normalizeComparable(tag));
      if (zone) { zones.add(zone); continue; }
      const group = groupLookup.get(normalizeComparable(tag));
      if (group) {
        let g = groupsMap.get(genus);
        if (!g) { g = new Map(); groupsMap.set(genus, g); }
        g.set(group, (g.get(group) || 0) + 1);
        continue;
      }
      if (normalizeComparable(tag) !== normalizeComparable(genus)) {
        unresolvedTags.set(tag, (unresolvedTags.get(tag) || 0) + 1);
      }
    }
    if (!zones.size) return;              /* hybrid, cultivar, or untagged */
    let g = geoMap.get(genus);
    if (!g) { g = { placed: 0, zones: {} }; geoMap.set(genus, g); }
    g.placed++;
    for (const z of zones) g.zones[z] = (g.zones[z] || 0) + 1;
  }

  /* v4: takes the single bucket the item was classified into, so
     `total` is by construction the sum of the four buckets. There is
     no longer a code path that can bump one without the other. */
  function bumpGenus(genus, bucket) {
    let g = byGenusMap.get(genus);
    if (!g) {
      g = { total: 0, species: 0, cultivars: 0, hybrids: 0, hybridCultivars: 0 };
      byGenusMap.set(genus, g);
    }
    g.total++;
    g[bucket]++;
  }

  const seenItems = new Set();

  items.forEach((item, index) => {
    const key = getItemKey(item, index);
    if (seenItems.has(key)) return;
    seenItems.add(key);

    const categories = getCategories(item).map(normalizeCategory);
    const matched = matchedBuckets(categories);
    const bucket = pickBucket(matched);

    if (matched.length > 1) {
      diagnostics.multiCategory++;
      if (diagnostics.multiCategoryItems.length < DIAGNOSTIC_SAMPLE_CAP) {
        diagnostics.multiCategoryItems.push({
          title: item.title || String(key),
          categories,
          matched,
          countedAs: bucket
        });
      }
    }

    if (!bucket) {
      counts.unclassified++;
      if (diagnostics.unclassifiedItems.length < DIAGNOSTIC_SAMPLE_CAP) {
        diagnostics.unclassifiedItems.push({
          title: item.title || String(key),
          categories
        });
      }
      return;
    }

    counts[bucket]++;

    const genus = getGenus(item);
    if (genus) {
      counts.genera.add(genus);
      bumpGenus(genus, bucket);
      bumpGeo(genus, item);
    }
  });

  /* v4: the disjointness guarantee, checked rather than assumed. If
     this ever trips, the arithmetic above is wrong and the right
     outcome is a failed Action, not a published counts.json that
     quietly disagrees with itself. */
  const bucketTotal =
    counts.species +
    counts.cultivars +
    counts.hybrids +
    counts.hybridCultivars +
    counts.unclassified;

  if (bucketTotal !== seenItems.size) {
    throw new Error(
      `Count invariant violated: buckets sum to ${bucketTotal} but ` +
      `${seenItems.size} distinct items were scanned. The categories ` +
      `are no longer mutually exclusive.`
    );
  }

  // Convert the per-genus map to a plain object, sorted by total desc
  const byGenus = {};
  [...byGenusMap.entries()]
    .sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]))
    .forEach(([genus, g]) => { byGenus[genus] = g; });

  /* v5: assembled from byGenus, so `total` is the same number the rest of
     the file publishes rather than a second tally of the same items. */
  let byGenusGeo;
  if (zoneMap) {
    byGenusGeo = {};
    for (const [genus, g] of Object.entries(byGenus)) {
      const geo = geoMap.get(genus) || { placed: 0, zones: {} };
      const zones = {};
      for (const z of ZONE_ORDER) if (geo.zones[z]) zones[z] = geo.zones[z];
      byGenusGeo[genus] = { total: g.total, placed: geo.placed, zones };
    }
  }

  return {
    species: counts.species,
    cultivars: counts.cultivars,
    hybrids: counts.hybrids,
    hybridCultivars: counts.hybridCultivars,
    unclassified: counts.unclassified,
    genera: counts.genera.size,
    byGenus,
    ...(byGenusGeo ? { byGenusGeo } : {}),
    /* v6: per-genus species-group counts, canonical spellings, sorted
       by count. Omitted entirely when no group tag was seen. */
    ...(groupsMap.size ? { speciesGroups: Object.fromEntries(
      [...groupsMap.entries()].map(([genus, g]) => [genus,
        Object.fromEntries([...g.entries()].sort((a, b) => b[1] - a[1]))])
    ) } : {}),
    diagnostics,
    ...(zoneMap ? { unresolvedTags: Object.fromEntries(
      [...unresolvedTags.entries()].sort((a, b) => b[1] - a[1])
        .slice(0, DIAGNOSTIC_SAMPLE_CAP)) } : {}),
    updatedAt: new Date().toISOString(),
    source: `${SITE_ORIGIN}${COLLECTION_PATH}`,
    totalItemsScanned: seenItems.size
  };
}

async function main() {
  const items = await fetchAllJournalItems();
  const zoneMap = await loadZoneMap();
  const counts = countCollection(items, zoneMap);

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(counts, null, 2) + "\n", "utf8");

  console.log("Counts written:", counts);

  /* v4: surface tagging problems in the Action log. These do not fail
     the run - a mis-tagged page is a content fix, not a build break -
     but they must not be invisible either. */
  if (counts.unclassified > 0) {
    console.warn(
      `WARNING: ${counts.unclassified} item(s) matched no category and ` +
      `were counted toward no genus.`,
      counts.diagnostics.unclassifiedItems
    );
  }

  /* v6: with the group vocabulary in place this list should normally be
     EMPTY. A real place here means shapes.json is missing it; a real
     species-group means SPECIES_GROUPS needs the new name. Either way
     those records are going uncounted, invisibly - so it goes in the
     log, capped, rather than nowhere. */
  if (counts.unresolvedTags && Object.keys(counts.unresolvedTags).length) {
    console.warn(
      `NOTE: ${Object.keys(counts.unresolvedTags).length} tag(s) resolved to ` +
      `no place and no species group, and were not counted. A real place ` +
      `means shapes.json is missing it; a real group means SPECIES_GROUPS ` +
      `in this file needs the new name.`,
      counts.unresolvedTags
    );
  }
  if (counts.speciesGroups) {
    console.log("Species groups:", JSON.stringify(counts.speciesGroups));
  }

  if (counts.diagnostics.multiCategory > 0) {
    console.warn(
      `WARNING: ${counts.diagnostics.multiCategory} item(s) carry more than ` +
      `one category and were assigned by precedence.`,
      counts.diagnostics.multiCategoryItems
    );
  }
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
export { countCollection, normalizeCategory, matchedBuckets, pickBucket, loadZoneMap, CONT_ZONE };

const invokedDirectly =
  !process.argv[1] ||
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
