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
  return {
    species: counts.species,
    cultivars: counts.cultivars,
    hybrids: counts.hybrids,
    hybridCultivars: counts.hybridCultivars,
    unclassified: counts.unclassified,
    genera: counts.genera.size,
    byGenus,
    diagnostics,
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
export { countCollection, normalizeCategory, matchedBuckets, pickBucket };
const invokedDirectly =
  !process.argv[1] ||
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
