/* Verification gates for climate.json 1.5.0 (8.17.26).

   ⚠⚠ SUPERSEDED 8.17.26 by verify-climate-1.6.0.mjs. KEPT AS THE
   RECORD OF THE 1.4.0 -> 1.5.0 TRANSITION, not as a live gate.

   This file will REFUSE to run against anything but 1.5.0 (see the
   guard below), because two of its EXPLAINED entries are now false of
   the shipped data and a stale gate that still passes is worse than no
   gate. Specifically:

     'Nicobar'    said "PRE-EXISTING, byte-identical ... an upstream
                  tag-definition question, not a climate defect".
                  build-shapes v8 trimmed the ALIAS on 8.17.26; the tag
                  is the Nicobars alone and no longer flags at all.
     'Seychelles' said "a REAL DEFECT ... Reported, not changed here".
                  build-shapes v8's CLIP table dropped the Aldabra
                  Group on 8.17.26; the row is measured at Mahé and no
                  longer flags either.

   Both were true when written and are the reason 1.6.0 exists. The
   live assertions for them are section E of verify-climate-1.6.0.mjs,
   which FAILS if either place is ever flagged again.

   Four checks, in the order the brief lists them:
     A  every place that existed in 1.4.0 is byte-identical, or named
     B  centroid gate on every place — pixel-set centre vs places.json
     C  duplicate geometry — two places, one pixel set
     D  spot checks: a province must not equal its country

   Reads climate.json + climate.json.1.4.0 + climate-audit.json here.  */
import fs from 'fs';

const NOW  = JSON.parse(fs.readFileSync('./climate.json', 'utf8'));
const OLD  = JSON.parse(fs.readFileSync('./climate.json.1.4.0', 'utf8'));
const AUD  = JSON.parse(fs.readFileSync('./climate-audit.json', 'utf8')).places;

/* the guard — see the banner. Run verify-climate-1.6.0.mjs instead. */
if (NOW.version !== '1.5.0') {
  console.error(`This gate verifies the 1.4.0 -> 1.5.0 transition and climate.json ` +
                `is now ${NOW.version}. Two of its EXPLAINED entries (Nicobar, ` +
                `Seychelles) describe defects that build-shapes v8 has since fixed, ` +
                `so its verdict would be wrong. Run verify-climate-1.6.0.mjs.`);
  process.exit(1);
}

const line = s => console.log(s);
const hr = () => line('─'.repeat(72));

/* ── A ── */
hr(); line(`A. PRE-EXISTING PLACES   ${OLD.version} (${Object.keys(OLD.places).length}) -> ${NOW.version} (${Object.keys(NOW.places).length})`);
const changed = [], missing = [];
for (const tag of Object.keys(OLD.places)) {
  if (!NOW.places[tag]) { missing.push(tag); continue; }
  const a = JSON.stringify(OLD.places[tag]), b = JSON.stringify(NOW.places[tag]);
  if (a !== b) changed.push(tag);
}
line(`   identical: ${Object.keys(OLD.places).length - changed.length - missing.length}`);
line(`   changed:   ${changed.length}${changed.length ? '  -> ' + changed.join(', ') : ''}`);
line(`   dropped:   ${missing.length}${missing.length ? '  -> ' + missing.join(', ') : ''}`);
for (const tag of changed) {
  const o = OLD.places[tag], n = NOW.places[tag];
  const ov = o.ff || o.all, nv = n.ff || n.all;
  line(`     ${tag}`);
  line(`        n ${o.n} -> ${n.n}   method ${o.method} -> ${n.method}   ` +
       `ffShare ${o.ffShare} -> ${n.ffShare}`);
  line(`        year ${Math.min(...ov.tnLo)}..${Math.max(...ov.txHi)} -> ` +
       `${Math.min(...nv.tnLo)}..${Math.max(...nv.txHi)} °C   ` +
       `zones [${ov.zones.map(z => z[0]).join('/')}] -> [${nv.zones.map(z => z[0]).join('/')}]`);
  const a = AUD[tag];
  if (a) line(`        centroid now ${a.lat}, ${a.lon}  (declared ${a.declLat}, ${a.declLon})  ` +
              `via ${a.resolved.map(r => r.name + '@' + r.layer).join(' + ') || 'centroid fallback'}`);
}

/* ── B ── great-circle distance, pixel-set centre vs declared centroid */
hr(); line('B. CENTROID GATE (pixel-set centre vs places.json centroid)');
const R = 6371;
const d2r = d => d * Math.PI / 180;
const dist = (la1, lo1, la2, lo2) => {
  const dLat = d2r(la2 - la1), dLon = d2r(lo2 - lo1);
  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(d2r(la1)) * Math.cos(d2r(la2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
};
/* The gate SCALES with the place. A flat threshold is the wrong
   instrument: China's pixel centre sits 507 km from its label point
   and that is just what a 4000-km country looks like, while a 3-pixel
   province 200 km off its centre is a mismatch. Radius is the
   equivalent-disc radius of n cells — an UNDERSTATEMENT for anything
   elongated, so the gate over-flags rather than under-flags. */
const rows = [];
for (const [tag, a] of Object.entries(AUD)) {
  if (a.declLat == null) continue;
  const km = dist(a.lat, a.lon, a.declLat, a.declLon);
  const cell = 18.52 * Math.sqrt(Math.max(0.05, Math.cos(d2r(a.lat))));
  const radius = Math.sqrt(a.n * cell * cell / Math.PI);
  rows.push({ tag, km, radius, ratio: km / Math.max(1, radius), a, isNew: !OLD.places[tag] });
}
rows.sort((x, y) => y.ratio - x.ratio);
const OVER = rows.filter(r => r.km > Math.max(120, r.radius));
/* Every flag reviewed by hand on 8.17.26, part by part, against the
   audit's per-part centroids. A flag is ACCEPTED only with a reason;
   anything flagged and not listed here is a regression and fails. */
const EXPLAINED = {
  'Puducherry':      'four non-contiguous enclaves (Mahé 75.3E on the west coast, Puducherry + Karaikal 79.8E on the east); the declared point is their bbox centre, inland Andhra, in none of them',
  'Puntarenas':      'a 200-km Pacific coastal strip; the declared point sits offshore because the province nominally includes Cocos Island (5.5N), which caught no 10-arcmin cell',
  'North Sulawesi':  'Sulawesi\'s northern arm PLUS the Sangihe-Talaud chain trailing to 4.4N; declared point is the bbox centre, in the Celebes Sea',
  'Bougainville':    'Bougainville + Buka, a 180-km chain; declared point is at the Buka end',
  'Malaysia':        'peninsula (100E) + Sabah/Sarawak (119E); the centroid of a two-lobed country falls in the South China Sea between them',
  'Cuba':            'a 1200-km-long island; ratio 1.3, the mildest flag in the list',
  'Society Islands': 'Windward (Tahiti) resolves, Leeward (Bora Bora, Raiatea) is too small for the ocean mask and contributes 0 pixels; Tahiti carries the group. PRE-EXISTING, byte-identical to 1.4.0',
  'Nicobar':         'PRE-EXISTING, byte-identical. build-shapes\' own ALIAS unions "Nicobar Islands" with the whole "Andaman and Nicobar" territory, so the tag includes the Andamans. The MAP draws the same ground — an upstream tag-definition question, not a climate defect',
  'Seychelles':      'PRE-EXISTING, byte-identical, and a REAL DEFECT: the only cell centre the archipelago catches is Aldabra (9.4S 46.4E), 1131 km from the granitic islands the tag means. Reported, not changed here — deciding which island represents a scattered archipelago is a places.json question and it moves the MAP too'
};
line(`   places gated: ${rows.length}   (new in 1.5.0: ${rows.filter(r => r.isNew).length})`);
line(`   flagged (offset > max(120 km, own radius)): ${OVER.length}`);
const UNEXPLAINED = [];
OVER.forEach(r => {
  const why = EXPLAINED[r.tag];
  if (!why) UNEXPLAINED.push(r.tag);
  line(`     ${String(Math.round(r.km)).padStart(5)} km / r${String(Math.round(r.radius)).padStart(4)}  ` +
       `${r.tag.padEnd(22)} n=${String(r.a.n).padStart(5)}  ${r.isNew ? 'NEW' : '   '}  ` +
       `bbox ${r.a.bbox.join(' ')}`);
  (r.a.resolved || []).forEach(p =>
    line(`            part ${p.name}@${p.layer}  n=${p.n}  at ${p.lat}, ${p.lon}`));
  line(`            ${why ? '✓ ' + why : '⚠ UNEXPLAINED — a compact part far from its declared centroid is a mismatch'}`);
});

/* ── C ── */
hr(); line('C. DUPLICATE GEOMETRY (identical pixel sets)');
const byHash = new Map();
for (const [tag, a] of Object.entries(AUD)) {
  const k = a.hash + ':' + a.n;
  if (!byHash.has(k)) byHash.set(k, []);
  byHash.get(k).push(tag);
}
const dupes = [...byHash.values()].filter(v => v.length > 1);
line(`   colliding sets: ${dupes.length}`);
dupes.forEach(v => line(`     n=${AUD[v[0]].n}  ${v.join('  ==  ')}`));

/* ── D ── */
hr(); line('D. SPOT CHECKS (a subunit must not be its parent)');
const PAIRS = [
  ['Kanchanaburi', 'Thailand'], ['Karnataka', 'India'], ['Sabah', 'Malaysia'],
  ['Niger State', 'Niger'], ['Addis Ababa', 'Oromia'], ['La Union', 'El Salvador'],
  ['Isabela', 'Ecuador'], ['Riau', 'Indonesia'], ['Luzon', 'Philippines'],
];
for (const [sub, par] of PAIRS) {
  const s = AUD[sub], p = AUD[par];
  if (!s) { line(`     ${sub.padEnd(16)} — not a place`); continue; }
  if (!p) { line(`     ${sub.padEnd(16)} n=${s.n} @ ${s.lat},${s.lon}   (${par} not a place)`); continue; }
  const same = s.hash === p.hash && s.n === p.n;
  line(`     ${sub.padEnd(16)} n=${String(s.n).padStart(5)} @ ${String(s.lat).padStart(7)},${String(s.lon).padStart(8)}   ` +
       `vs ${par.padEnd(14)} n=${String(p.n).padStart(5)} @ ${String(p.lat).padStart(7)},${String(p.lon).padStart(8)}   ` +
       `${same ? '*** IDENTICAL ***' : 'distinct'}`);
}

/* ── summary ── */
hr();
const EXPLAINED_CHANGE = {
  'Alabat': 'build-shapes v7 moved Alabat from ALIAS ["Quezon"] into DOTS on 8.16.26 — the island had been borrowing mainland Quezon province\'s outline, which since the level-4 build is a shape of its own. Climate now follows the map: the nearest land cell to the island\'s own centroid, 7 km away, instead of 26 cells of mainland Quezon'
};
const fails = [];
if (missing.length)      fails.push(`${missing.length} pre-existing places dropped`);
if (UNEXPLAINED.length)  fails.push(`${UNEXPLAINED.length} unexplained centroid flags: ${UNEXPLAINED.join(', ')}`);
if (dupes.length)        fails.push(`${dupes.length} duplicate pixel sets`);
const unexplainedChange = changed.filter(t => !EXPLAINED_CHANGE[t]);
if (unexplainedChange.length) fails.push(`${unexplainedChange.length} unexplained changes: ${unexplainedChange.join(', ')}`);
if (fails.length) { line('GATES FAILED: ' + fails.join('; ')); process.exitCode = 1; }
else {
  line(`GATES PASSED — ${Object.keys(OLD.places).length - changed.length} of ` +
       `${Object.keys(OLD.places).length} pre-existing places byte-identical, ` +
       `${OVER.length} centroid flags all explained, 0 duplicate geometries.`);
  changed.forEach(t => line(`  change: ${t} — ${EXPLAINED_CHANGE[t]}`));
}
