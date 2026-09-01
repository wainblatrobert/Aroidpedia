// =====================================================================
// AROIDPEDIA — CHECK TAXON RULINGS   (v1, 2026-08-31)
// Path in repo: scripts/check-taxon-rulings.mjs
//
//     node scripts/check-taxon-rulings.mjs
//
// Cross-references data/taxon-rulings.json against every artifact that
// carries a species name, and says where each ruling stands.
//
// ---------------------------------------------------------------------
// WHY A CHECKER AND NOT A PATCHER
// ---------------------------------------------------------------------
// The obvious move is to rewrite docs/genus-geo.json and the tree so they
// obey the rulings. Measured first, and it is very nearly a no-op:
//
//   · The species totals a READER sees come from the archive (published
//     pages) — Alocasia 118 — not from POWO. genus-geo's speciesTotalPowo
//     and the tree's speciesCountPowo are internal, and already disagree
//     with each other by one (91 vs 92) for reasons that predate any of
//     this.
//   · Alocasia augustiana's only locality is "New Guinea", which
//     Alocasia aequiloba already carries. Removing it changes the genus
//     place list not at all: 134 places before, 134 after, none dropped.
//     The range map would be byte-identical.
//   · The three re-included species have no geography in any dataset, so
//     they cannot be added to a geographic file in a way that means
//     anything. Injecting a species with an empty place list is worse
//     than leaving it out.
//
// And both files are generated OUTSIDE this repo, so a patch here is
// overwritten the next time they are exported. A checker survives that;
// a patcher fights it.
//
// So this reports, and leaves the editing to a human who can see the
// whole picture. It exits non-zero only on the one thing that is
// unambiguously wrong: an EXCLUDED name that still has a published page.
// =====================================================================
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || '.');
const rd = p => {
  const f = path.join(ROOT, p);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
};

const RULINGS = rd('data/taxon-rulings.json');
const YEARS   = rd('data/species-years.json');
const GEO     = rd('docs/genus-geo.json');
const TREE    = rd('docs/araceae-tree.v1.json');
const INDEX   = rd('docs/search-index.json');

if (!RULINGS) { console.error('no data/taxon-rulings.json'); process.exit(1); }

const treeGenus = (() => {
  const out = {};
  (function walk(n) {
    if (n.rank === 'genus') out[n.name.toLowerCase()] = n;
    for (const c of n.children || []) walk(c);
  })(TREE?.tree || TREE?.root || TREE || {});
  return out;
})();

const published = new Set((INDEX?.entries || []).map(e => e.s));

const epithet = full => full.split(/\s+/).slice(1).join(' ');
const bad = [];
let rulings = 0;

for (const [slug, r] of Object.entries(RULINGS)) {
  if (slug.startsWith('_')) continue;
  const geo = GEO?.genera?.[slug[0].toUpperCase() + slug.slice(1)];
  const years = YEARS?.genera?.[slug];
  const tree = treeGenus[slug];

  console.log(`\n=== ${slug} ===`);
  if (geo)  console.log(`    genus-geo   speciesTotal ${geo.speciesTotal} (archive) / speciesTotalPowo ${geo.speciesTotalPowo}, ${Object.keys(geo.speciesPlaces || {}).length} with geography`);
  if (tree) console.log(`    tree        speciesCount ${tree.speciesCount} (archive) / speciesCountPowo ${tree.speciesCountPowo}`);

  for (const kind of ['exclude', 'include']) {
    for (const e of r[kind] || []) {
      rulings++;
      const name = e.name, ep = epithet(name), low = name.toLowerCase();
      const inTimeline = years
        ? Object.values(years.years).some(v => v.includes(name)) : null;
      const inGeo = geo?.speciesPlaces ? (ep in geo.speciesPlaces) : null;
      const hasPage = published.has(low);
      const want = kind === 'include';

      const mark = v => v === null ? '  n/a' : (v === want ? '   ok' : ' DIFF');
      console.log(`  ${kind.toUpperCase().padEnd(8)} ${name}`);
      console.log(`      timeline data ${mark(inTimeline)}   ${inTimeline}`);
      console.log(`      genus-geo     ${mark(inGeo)}   ${inGeo}`);
      console.log(`      published page${mark(hasPage)}   ${hasPage}`);
      // A citation is NOT required — user ruling 2026-09-01. These are
      // Aroidpedia's own calls and stand on the authority line alone.
      if (e.note) console.log(`      note: ${e.note}`);

      if (kind === 'exclude' && hasPage)
        bad.push(`${name} is ruled INVALID but has a published page — merge or unpublish it`);
      if (kind === 'include' && !hasPage)
        console.log(e.note ? `      → unpublished, and on hold (see note)`
                           : `      → ruled valid but unpublished: a page is owed`);
      if (kind === 'exclude' && inGeo)
        console.log(`      → still in genus-geo; harmless if its localities are covered by the accepted name`);
    }
  }
}

console.log(`\n${rulings} ruling(s) checked.`);
if (bad.length) {
  console.log('\nACTION NEEDED:');
  for (const b of bad) console.log('  !! ' + b);
  process.exit(1);
}
console.log('Nothing contradicts a published page.');
