/* What did the port actually buy?

   Resolves every place TWICE — once with build-climate 1.4.0's find()
   (single pass, no admin pin) and once with the ported findPass() —
   and reports every place where they disagree. No rasterizing: the
   question is only WHICH FEATURE each name lands on.

   Self-validation: the new side must reproduce, for every place, the
   layer recorded in climate-audit.json. If it does not, this probe is
   not modelling the builder and its verdict means nothing.  */
import fs from 'fs';
const DRIVE = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/JS JAVASCRIPT CODE/';
/* 8.17.26: this used to name "build-shapes 8.10.26 v7.js" outright, and
   the day v8 shipped the probe silently kept reading v7's tables — it
   reported Nicobar as a mismatch against the builder's own audit, which
   is the probe being wrong, not the builder. Pick the NEWEST vN, the
   same way build-climate's loadTables does, so the probe can never
   again model a builder that is not the one that ran. */
const src = (() => {
  const cands = fs.readdirSync(DRIVE)
    .map(f => ({ f, m: f.match(/^build-shapes (\d+)\.(\d+)\.(\d+) v(\d+)\.js$/) }))
    .filter(x => x.m)
    .sort((a, b) => (+a.m[4]) - (+b.m[4]));
  if (!cands.length) throw new Error('no build-shapes <date> vN.js in ' + DRIVE);
  const f = cands[cands.length - 1].f;
  console.log(`tables from ${f}`);
  return fs.readFileSync(DRIVE + f, 'utf8');
})();
const cut = re => new Function('return ' + src.match(re)[1])();
const ALIAS = cut(/const ALIAS = (\{[\s\S]*?\n\});/);
const LAYER = cut(/const LAYER = (\{[\s\S]*?\n\});/);
const DOTS  = cut(/const DOTS = (\[[\s\S]*?\])/);

const norm = s => String(s || '').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const grab = k => JSON.parse(fs.readFileSync(DRIVE + 'ne-cache/' + k + '.geojson', 'utf8'));
const layers = {
  countries: grab('countries').features, regions: grab('regions').features,
  admin1: grab('admin1').features, countries10m: grab('countries10m').features
};

/* --- 1.4.0's find(): one pass, all name fields pooled, no admin pin --- */
const findOld = (name, pin) => {
  const want = norm(name);
  for (const [ln, feats] of Object.entries(layers)) {
    if (pin && ln !== pin) continue;
    for (const f of feats) {
      const p = f.properties;
      const names = (ln === 'countries' || ln === 'countries10m')
        ? [p.NAME, p.NAME_LONG, p.ADMIN, p.NAME_EN, p.BRK_NAME, p.GEOUNIT]
        : ln === 'regions' ? [p.NAME, p.NAMEALT, p.NAME_EN]
        : [p.name, p.name_en, p.gn_name, p.woe_name, p.NAME_EN];
      if (names.some(n => n && norm(n) === want)) return { f, layer: ln };
    }
  }
  return null;
};

/* --- the ported findPass() --- */
const findPass = (name, pin, adminWant, pass) => {
  const want = norm(name);
  for (const [ln, feats] of Object.entries(layers)) {
    if (pin && ln !== pin) continue;
    if (adminWant && ln !== 'admin1') continue;
    for (const f of feats) {
      const p = f.properties;
      if (adminWant && ln === 'admin1' &&
          norm(p.admin || p.ADMIN || '') !== norm(adminWant)) continue;
      const primary = (ln === 'countries' || ln === 'countries10m')
        ? [p.NAME, p.NAME_LONG, p.ADMIN] : ln === 'regions' ? [p.NAME] : [p.name, p.name_en];
      const aliasNames = (ln === 'countries' || ln === 'countries10m')
        ? [p.NAME_EN, p.BRK_NAME, p.GEOUNIT] : ln === 'regions' ? [p.NAMEALT, p.NAME_EN]
        : [p.gn_name, p.woe_name, p.NAME_EN];
      const names = pass === 0 ? primary : aliasNames;
      if (names.some(n => n && norm(n) === want)) return { f, layer: ln };
    }
  }
  return null;
};
const findNew = (n, pin, admin) => findPass(n, pin, admin, 0) || findPass(n, pin, admin, 1);

const bbox = f => {
  let a = 90, b = 180, c = -90, d = -180;
  const eat = r => r.forEach(p => {
    if (p[1] < a) a = p[1]; if (p[1] > c) c = p[1];
    if (p[0] < b) b = p[0]; if (p[0] > d) d = p[0];
  });
  const g = f.geometry;
  (g.type === 'Polygon' ? [g.coordinates] : g.coordinates || []).forEach(poly => poly.forEach(eat));
  return [(a + c) / 2, (b + d) / 2];
};
const R = 6371, d2r = x => x * Math.PI / 180;
const dist = (p, q) => 2 * R * Math.asin(Math.min(1, Math.sqrt(
  Math.sin(d2r(q[0] - p[0]) / 2) ** 2 +
  Math.cos(d2r(p[0])) * Math.cos(d2r(q[0])) * Math.sin(d2r(q[1] - p[1]) / 2) ** 2)));

const places = JSON.parse(fs.readFileSync(DRIVE + 'places.json', 'utf8')).places;
const AUD = JSON.parse(fs.readFileSync('./climate-audit.json', 'utf8')).places;
const OLD = new Set(Object.keys(JSON.parse(fs.readFileSync('./climate.json.1.4.0', 'utf8')).places));
const ADMIN_PIN = {};
places.forEach(p => { if (p.admin) ADMIN_PIN[p.tag] = p.admin; });

let mismatchProbe = 0, moved = [];
for (const pl of places) {
  if (DOTS.includes(pl.tag)) continue;
  const wanted = ALIAS[pl.tag] || [pl.tag];
  const pin = LAYER[pl.tag], admin = ADMIN_PIN[pl.tag];
  const auditLayers = (AUD[pl.tag].resolved || []).map(r => r.name + '@' + r.layer).join(',');
  const mineLayers = [];
  for (const n of wanted) {
    const a = findOld(n, pin), b = findNew(n, pin, admin);
    if (b) mineLayers.push(n + '@' + b.layer);
    const ka = a ? a.layer + ':' + (a.f.properties.name || a.f.properties.NAME) : null;
    const kb = b ? b.layer + ':' + (b.f.properties.name || b.f.properties.NAME) : null;
    if (ka !== kb) {
      moved.push({ tag: pl.tag, part: n, from: ka, to: kb,
        km: a && b ? Math.round(dist(bbox(a.f), bbox(b.f))) : null,
        isNew: !OLD.has(pl.tag) });
    }
  }
  if (mineLayers.join(',') !== auditLayers) mismatchProbe++;
}

console.log(mismatchProbe
  ? `⚠ PROBE INVALID: ${mismatchProbe} places where this probe disagrees with the builder's audit`
  : '✓ probe reproduces the builder\'s resolution for all 710 polygon places');
console.log(`\nplaces the port MOVES (1.4.0 find() vs ported find()): ${moved.length}\n`);
const pre = moved.filter(m => !m.isNew), nw = moved.filter(m => m.isNew);
console.log(`  pre-existing (in 1.4.0): ${pre.length}`);
pre.forEach(m => console.log(`     ${m.tag} / ${m.part}: ${m.from} -> ${m.to}  (${m.km} km)`));
console.log(`\n  new in 1.5.0: ${nw.length}   — these are the rows that would have been silently wrong`);
nw.sort((a, b) => (b.km || 0) - (a.km || 0));
nw.forEach(m => console.log(
  `     ${String(m.km).padStart(5)} km  ${m.tag.padEnd(22)} ${String(m.from).padEnd(34)} -> ${m.to}`));
