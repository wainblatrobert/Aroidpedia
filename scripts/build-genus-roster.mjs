// =====================================================================
// AROIDPEDIA — BUILD GENUS ROSTER   (v1, 2026-08-31)
// Path in repo: scripts/build-genus-roster.mjs
//
// WHAT IT DOES
// One source of truth for per-genus facts, for all 150 genera instead
// of the 14 that were hand-typed into the header injection.
//
//   docs/araceae-tree.v1.json          (subfamily + tribe + slug)
//   data/genus-roster-overrides.json   (artwork + hand — not derivable)
//        |
//        +--> docs/genus-roster.json   machine-readable, for any block
//        +--> docs/header-roster.js    the paste-ready AP.GENERA literal
//
// WHY THE HEADER STILL GETS A PASTE AND NOT A FETCH
// This is the whole design decision, so it is written down here.
// The header injection's per-genus LOGO SWAP works by writing a
// <style> rule into <head> BEFORE Squarespace paints the header — that
// is the entire reason it lives in the header and not the footer. If
// AP.GENERA arrived over fetch(), AP.genus would be unknown at paint
// time, the master logo would paint first and then change, and the
// block would reintroduce exactly the flash it exists to prevent. The
// favicon swap has the same shape.
//
// So GitHub builds the CODE, not a runtime dependency. The generated
// docs/header-roster.js is pasted into the header injection the same
// way the roster already is — the difference is that it is generated
// from the tree and covers every genus, instead of being typed by hand
// and covering fourteen.
//
// docs/genus-roster.json is the other half: blocks that are NOT paint
// critical (the cream section header, anything future) can fetch that
// and never need a paste at all.
//
// ⚠ ascend IS GENERATED, NEVER OVERRIDDEN. The overrides file is
// rejected if it tries to set it. Verified before this script was
// written: the tree reproduces all 14 hand-written ascend values
// exactly, 0 mismatches — which is what makes generating them safe.
// A genus whose placement is wrong is fixed in the TREE, so the
// phylogeny page and the hero can never disagree.
//
// ⚠ 12 genera legitimately sit directly under a subfamily with no
// tribe rank (Calla, Englerarum, Leucocasia, Vietnamocasia,
// Gymnostachys, Lemna, Spirodela, Wolffia, Wolffiella, Lysichiton,
// Orontium, Symplocarpus). They emit tribe: "" and the hero already
// handles that — subfamily alone, because a wrong tribe is worse than
// no tribe.
//
// ⚠ NO SPECIES COUNTS HERE, deliberately. The tree carries a
// speciesCount, and for Arum it reads 27 against the POWO master
// export's 26 — the tree counted a truncated hybrid row. Counts have
// a home already (counts.json / the POWO export); a second source
// would just be a second thing to disagree.
// =====================================================================
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || '.');
const TREE = path.join(ROOT, 'docs', 'araceae-tree.v1.json');
const OVERRIDES = path.join(ROOT, 'data', 'genus-roster-overrides.json');
const OUT_JSON = path.join(ROOT, 'docs', 'genus-roster.json');
const OUT_JS = path.join(ROOT, 'docs', 'header-roster.js');

const ASSET_KEYS = ['logo', 'i16', 'i32', 'i180', 'i192', 'i512'];
const VERSION = '1.0.0';

// ---------------------------------------------------------------- tree
const treeDoc = JSON.parse(fs.readFileSync(TREE, 'utf8'));
const rootNode = treeDoc.tree || treeDoc.root || treeDoc;

const genera = [];
(function walk(n, sub, tribe) {
  if (n.rank === 'subfamily') sub = n.name;
  if (n.rank === 'tribe') tribe = n.name;
  if (n.rank === 'genus') genera.push({ node: n, sub: sub || '', tribe: tribe || '' });
  for (const c of n.children || []) walk(c, sub, tribe);
})(rootNode, '', '');

if (!genera.length) { console.error('No genera found in the tree. Aborting.'); process.exit(1); }

// ------------------------------------------------------------ overrides
let overrides = {};
if (fs.existsSync(OVERRIDES)) {
  overrides = JSON.parse(fs.readFileSync(OVERRIDES, 'utf8'));
} else {
  console.warn(`No overrides file at ${OVERRIDES} — building ascendancy only.`);
}
for (const [slug, o] of Object.entries(overrides)) {
  if (o && o.ascend) {
    console.error(`::error::overrides["${slug}"] sets "ascend". Ascendancy is generated ` +
                  `from docs/araceae-tree.v1.json; fix the tree instead.`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------- rows
const rows = {};
const warnings = [];
for (const g of genera) {
  const name = g.node.name;
  const url = String(g.node.archiveUrl || '').trim();
  if (!url) { warnings.push(`${name}: no archiveUrl in the tree — skipped`); continue; }
  const slug = url.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase();
  if (!/^[a-z][a-z\-]*$/.test(slug)) { warnings.push(`${name}: odd slug "${slug}" — skipped`); continue; }
  if (slug !== name.toLowerCase()) warnings.push(`${name}: slug "${slug}" differs from the name`);
  if (rows[slug]) { warnings.push(`${name}: duplicate slug "${slug}" — kept the first`); continue; }

  const row = { name, ascend: { sub: g.sub, tribe: g.tribe } };
  const o = overrides[slug] || {};
  if (o.hand === 'left' || o.hand === 'right') row.hand = o.hand;
  else if (o.hand) warnings.push(`${slug}: hand "${o.hand}" is not "left" or "right" — dropped`);
  // Empty asset fields are OMITTED, not emitted as "". AP.asset() already
  // falls back to AP.MASTER for a missing key, so a genus with no artwork
  // is one short line instead of six empty ones.
  for (const k of ASSET_KEYS) if (o[k]) row[k] = o[k];
  rows[slug] = row;
}

const slugs = Object.keys(rows).sort();   // stable order => stable diffs

// ----------------------------------------------------------- JSON out
const jsonDoc = {
  version: VERSION,
  generated: new Date().toISOString().slice(0, 10),
  source: 'docs/araceae-tree.v1.json + data/genus-roster-overrides.json',
  note: 'ascend is generated from the tree and must be corrected there, not here.',
  count: slugs.length,
  genera: Object.fromEntries(slugs.map(s => [s, rows[s]])),
};
fs.writeFileSync(OUT_JSON, JSON.stringify(jsonDoc, null, 1) + '\n', 'utf8');

// ------------------------------------------------------- header JS out
const esc = s => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const lines = [];
lines.push('/* =====================================================================');
lines.push('   AROIDPEDIA — AP.GENERA ROSTER');
lines.push('   GENERATED FILE — DO NOT EDIT BY HAND.');
lines.push('   Built by scripts/build-genus-roster.mjs from');
lines.push('   docs/araceae-tree.v1.json + data/genus-roster-overrides.json.');
lines.push('');
lines.push('   To change a subfamily or tribe, edit the TREE.');
lines.push('   To add artwork or set the hero hand, edit the OVERRIDES.');
lines.push('   Then paste this block into the header injection, replacing the');
lines.push('   existing "AP.GENERA = { ... };" statement and nothing else.');
lines.push('');
lines.push(`   ${slugs.length} genera · roster v${VERSION} · ${jsonDoc.generated}`);
lines.push('   ===================================================================== */');
lines.push(`  AP.GENERA = {`);
for (const s of slugs) {
  const r = rows[s];
  const parts = [`ascend: { sub: "${esc(r.ascend.sub)}", tribe: "${esc(r.ascend.tribe)}" }`];
  if (r.hand) parts.push(`hand: "${r.hand}"`);
  const assets = ASSET_KEYS.filter(k => r[k]);
  if (!assets.length) {
    lines.push(`    "${s}": { ${parts.join(', ')} },`);
  } else {
    lines.push(`    "${s}": {`);
    lines.push(`      ${parts.join(',\n      ')},`);
    assets.forEach((k, i) => {
      lines.push(`      ${k}: "${esc(r[k])}"${i === assets.length - 1 ? '' : ','}`);
    });
    lines.push(`    },`);
  }
}
lines.push('  };');
const js = lines.join('\n') + '\n';
fs.writeFileSync(OUT_JS, js, 'utf8');

// ------------------------------------------------------------- report
console.log(`genera in tree : ${genera.length}`);
console.log(`rows emitted   : ${slugs.length}`);
console.log(`with a tribe   : ${slugs.filter(s => rows[s].ascend.tribe).length}`);
console.log(`tribe: ""      : ${slugs.filter(s => !rows[s].ascend.tribe).length}` +
            ` (${slugs.filter(s => !rows[s].ascend.tribe).map(s => rows[s].name).join(', ')})`);
console.log(`with artwork   : ${slugs.filter(s => ASSET_KEYS.some(k => rows[s][k])).length}`);
console.log(`with hand      : ${slugs.filter(s => rows[s].hand).length}`);
console.log(`header-roster.js: ${(js.length / 1024).toFixed(1)} KB`);
console.log(`genus-roster.json: ${(JSON.stringify(jsonDoc).length / 1024).toFixed(1)} KB`);
if (warnings.length) {
  console.log('\nwarnings:');
  for (const w of warnings) console.log('  ! ' + w);
}
