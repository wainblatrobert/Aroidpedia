/* Verification gates for climate.json 1.6.0 (8.17.26).

   Successor to verify-climate-1.5.0.mjs. Same five sections; two
   differences, both deliberate:

   1. THE BASELINE MOVED, 1.4.0 -> 1.5.0. 1.5.0 is what is live and
      what was gated place by place, so "byte-identical to 1.5.0" is
      the claim worth testing here — and it is a far sharper claim than
      1.4.0 ever supported, because 1.6.0 should move exactly TWO of
      712 rows. climate.json.1.4.0 is kept on disk; the 1.4.0 -> 1.5.0
      story lives in verify-climate-1.5.0.mjs and is not re-litigated.

   2. THE EXPLAINED TABLE SHRANK BY TWO. In 1.5.0 both Nicobar and
      Seychelles were centroid flags carrying an EXPLAINED entry that
      said, in effect, "known defect, reported, not fixed here". Both
      are fixed in build-shapes v8, so both should now be ABSENT from
      the flag list. Leaving their excuses in place would have let a
      regression re-raise the flag and still pass — so section E below
      asserts the opposite: it FAILS if either place is flagged again.

   Reads climate.json + climate.json.1.5.0 + climate-audit.json.  */
import fs from 'fs';

const NOW  = JSON.parse(fs.readFileSync('./climate.json', 'utf8'));
const PREV = JSON.parse(fs.readFileSync('./climate.json.1.5.0', 'utf8'));
const AUD  = JSON.parse(fs.readFileSync('./climate-audit.json', 'utf8')).places;

const line = s => console.log(s);
const hr = () => line('─'.repeat(72));

/* ── A ── */
hr(); line(`A. PRE-EXISTING PLACES   ${PREV.version} (${Object.keys(PREV.places).length}) -> ${NOW.version} (${Object.keys(NOW.places).length})`);
const changed = [], missing = [];
for (const tag of Object.keys(PREV.places)) {
  if (!NOW.places[tag]) { missing.push(tag); continue; }
  if (JSON.stringify(PREV.places[tag]) !== JSON.stringify(NOW.places[tag])) changed.push(tag);
}
const added = Object.keys(NOW.places).filter(t => !PREV.places[t]);
line(`   identical: ${Object.keys(PREV.places).length - changed.length - missing.length}`);
line(`   changed:   ${changed.length}${changed.length ? '  -> ' + changed.join(', ') : ''}`);
line(`   dropped:   ${missing.length}${missing.length ? '  -> ' + missing.join(', ') : ''}`);
line(`   added:     ${added.length}${added.length ? '  -> ' + added.join(', ') : ''}`);
for (const tag of changed) {
  const o = PREV.places[tag], n = NOW.places[tag];
  const ov = o.ff || o.all, nv = n.ff || n.all;
  line(`     ${tag}`);
  line(`        n ${o.n} -> ${n.n}   method ${o.method} -> ${n.method}   ffShare ${o.ffShare} -> ${n.ffShare}`);
  line(`        year ${Math.min(...ov.tnLo)}..${Math.max(...ov.txHi)} -> ` +
       `${Math.min(...nv.tnLo)}..${Math.max(...nv.txHi)} °C   ` +
       `rhLo50 ${Math.min(...ov.rhLo50)}..${Math.max(...ov.rhLo50)} -> ` +
       `${Math.min(...nv.rhLo50)}..${Math.max(...nv.rhLo50)} %`);
  const a = AUD[tag];
  if (a) line(`        centroid now ${a.lat}, ${a.lon}  (declared ${a.declLat}, ${a.declLon})  ` +
              `via ${a.resolved.map(r => r.name + '@' + r.layer + ' n=' + r.n).join(' + ') || 'centroid fallback'}`);
}

/* ── B ── great-circle distance, pixel-set centre vs declared centroid */
hr(); line('B. CENTROID GATE (pixel-set centre vs places.json centroid)');
const R = 6371;
const d2r = d => d * Math.PI / 180;
const dist = (la1, lo1, la2, lo2) => {
  const h = Math.sin(d2r(la2 - la1) / 2) ** 2 +
            Math.cos(d2r(la1)) * Math.cos(d2r(la2)) * Math.sin(d2r(lo2 - lo1) / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
};
/* The gate SCALES with the place. A flat threshold is the wrong
   instrument: China's pixel centre sits 507 km from its label point
   and that is just what a 4000-km country looks like, while a 3-pixel
   province 200 km off its centre is a mismatch. Radius is the
   equivalent-disc radius of n cells — an UNDERSTATEMENT for anything
   elongated, so the gate over-flags rather than under-flags. */
const offsetOf = a => dist(a.lat, a.lon, a.declLat, a.declLon);
const rows = [];
for (const [tag, a] of Object.entries(AUD)) {
  if (a.declLat == null) continue;
  const km = offsetOf(a);
  const cell = 18.52 * Math.sqrt(Math.max(0.05, Math.cos(d2r(a.lat))));
  const radius = Math.sqrt(a.n * cell * cell / Math.PI);
  rows.push({ tag, km, radius, ratio: km / Math.max(1, radius), a });
}
rows.sort((x, y) => y.ratio - x.ratio);
const OVER = rows.filter(r => r.km > Math.max(120, r.radius));
/* Every flag reviewed by hand, part by part, against the audit's
   per-part centroids. A flag is ACCEPTED only with a reason; anything
   flagged and not listed here is a regression and fails.

   All seven survive from 1.5.0 unchanged. Nicobar and Seychelles were
   the eighth and ninth and are gone — see section E. */
const EXPLAINED = {
  'Puducherry':      'four non-contiguous enclaves (Mahé 75.3E on the west coast, Puducherry + Karaikal 79.8E on the east); the declared point is their bbox centre, inland Andhra, in none of them',
  'Puntarenas':      'a 200-km Pacific coastal strip; the declared point sits offshore because the province nominally includes Cocos Island (5.5N), which caught no 10-arcmin cell',
  'North Sulawesi':  'Sulawesi\'s northern arm PLUS the Sangihe-Talaud chain trailing to 4.4N; declared point is the bbox centre, in the Celebes Sea',
  'Bougainville':    'Bougainville + Buka, a 180-km chain; declared point is at the Buka end',
  'Malaysia':        'peninsula (100E) + Sabah/Sarawak (119E); the centroid of a two-lobed country falls in the South China Sea between them',
  'Cuba':            'a 1200-km-long island; ratio 1.3, the mildest flag in the list',
  'Society Islands': 'Windward (Tahiti) resolves, Leeward (Bora Bora, Raiatea) is too small for the ocean mask and contributes 0 pixels; Tahiti carries the group. Unlike Seychelles this is NOT a wrong-island error — Tahiti is the largest island of the group it stands for, 135 km from the group\'s bbox centre. Byte-identical since 1.4.0'
};
line(`   places gated: ${rows.length}`);
line(`   flagged (offset > max(120 km, own radius)): ${OVER.length}`);
const UNEXPLAINED = [];
OVER.forEach(r => {
  const why = EXPLAINED[r.tag];
  if (!why) UNEXPLAINED.push(r.tag);
  line(`     ${String(Math.round(r.km)).padStart(5)} km / r${String(Math.round(r.radius)).padStart(4)}  ` +
       `${r.tag.padEnd(22)} n=${String(r.a.n).padStart(5)}   bbox ${r.a.bbox.join(' ')}`);
  (r.a.resolved || []).forEach(p =>
    line(`            part ${p.name}@${p.layer}  n=${p.n}  at ${p.lat}, ${p.lon}`));
  line(`            ${why ? '✓ ' + why : '⚠ UNEXPLAINED — a compact part far from its declared centroid is a mismatch'}`);
});
const STALE = Object.keys(EXPLAINED).filter(t => !OVER.some(r => r.tag === t));
if (STALE.length) line(`   ⚠ EXPLAINED entries that no longer flag (delete them): ${STALE.join(', ')}`);

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
  /* 8.17.26 — the pair this release exists for. They are separate
     WGSRPD units, separate tags and separate posts; they must be
     separate pixel sets, and neither may be the union territory. */
  ['Nicobar', 'Andaman Islands'],
];
for (const [sub, par] of PAIRS) {
  const s = AUD[sub], p = AUD[par];
  if (!s) { line(`     ${sub.padEnd(16)} — not a place`); continue; }
  if (!p) { line(`     ${sub.padEnd(16)} n=${s.n} @ ${s.lat},${s.lon}   (${par} not a place)`); continue; }
  const same = s.hash === p.hash && s.n === p.n;
  line(`     ${sub.padEnd(16)} n=${String(s.n).padStart(5)} @ ${String(s.lat).padStart(7)},${String(s.lon).padStart(8)}   ` +
       `vs ${par.padEnd(16)} n=${String(p.n).padStart(5)} @ ${String(p.lat).padStart(7)},${String(p.lon).padStart(8)}   ` +
       `${same ? '*** IDENTICAL ***' : 'distinct'}`);
}

/* ── E ── the two fixes, asserted POSITIVELY.
   "It is no longer flagged" is not enough: a place with one pixel in
   the wrong ocean can fall under the 120-km floor for the wrong
   reason. Each fix states where the row must now be measured and how
   far that is from the ground it names. */
hr(); line('E. THE 1.6.0 FIXES (asserted, not merely explained)');
const FIXES = [
  { tag: 'Nicobar',
    was: 'unioned "Andaman and Nicobar", the whole union territory: 20 of 47 cells sat on the Andamans at 11.5N',
    want: a => ({
      ok: a.n === 30 && a.bbox[2] < 10 && a.resolved.length === 1 &&
          a.resolved[0].name === 'Nicobar Islands',
      say: `n=${a.n} (want 30), northern edge ${a.bbox[2]}N (want < 10N, i.e. clear of Little Andaman at 10.5N), ` +
           `parts [${a.resolved.map(r => r.name).join(' + ')}] (want Nicobar Islands alone)` }) },
  { tag: 'Seychelles',
    was: 'its one cell was Aldabra at 9.42S 46.42E, 1131 km from the granitic islands',
    want: a => ({
      ok: a.method === 'centroid' && offsetOf(a) < 30 && a.lat > -6 && a.lon > 54,
      say: `method ${a.method} (want centroid), cell ${a.lat},${a.lon} — ` +
           `${Math.round(offsetOf(a))} km from the declared Mahé point (want < 30 km, was 1131)` }) },
];
const FIXFAIL = [];
for (const f of FIXES) {
  const a = AUD[f.tag];
  if (!a) { FIXFAIL.push(f.tag + ' is not a place'); continue; }
  const v = f.want(a);
  line(`     ${f.tag}`);
  line(`        was:  ${f.was}`);
  line(`        now:  ${v.say}`);
  line(`        ${v.ok ? '✓ fixed' : '⚠ NOT FIXED'}`);
  if (!v.ok) FIXFAIL.push(f.tag);
  if (OVER.some(r => r.tag === f.tag)) FIXFAIL.push(f.tag + ' is still centroid-flagged');
}

/* ── summary ── */
hr();
const EXPLAINED_CHANGE = {
  'Nicobar':    'build-shapes v8 trimmed the ALIAS to ["Nicobar Islands"]. The tag had unioned the whole Andaman & Nicobar union territory, so it drew and measured the Andamans — which are already the tag "Andaman Islands", 55 cells at 12.3N, on three posts. 47 cells -> 30; the coldest-month low rises 21.5 -> 22.6 °C as the Andaman cells leave. No post used "Nicobar" to mean the Andamans (checked in the published search-index.json)',
  'Seychelles': 'build-shapes v8\'s new CLIP table drops the Aldabra Group. The archipelago catches exactly ONE 10-arcmin cell centre and it was Aldabra, a raised coral atoll 1131 km from the granitic islands; the one aroid POWO cites for Seychelles is Protarum sechellarum and all 122 of its georeferenced GBIF records are on the granitics. With Aldabra gone the tag catches no cell at all and the existing nearest-valid-pixel fallback measures it at Mahé, 12 km from the declared centroid — the same treatment Lakshadweep has always had'
};
const fails = [];
if (missing.length)     fails.push(`${missing.length} places dropped`);
if (added.length)       fails.push(`${added.length} places appeared (1.6.0 adds none)`);
if (UNEXPLAINED.length) fails.push(`${UNEXPLAINED.length} unexplained centroid flags: ${UNEXPLAINED.join(', ')}`);
if (STALE.length)       fails.push(`${STALE.length} stale EXPLAINED entries: ${STALE.join(', ')}`);
if (dupes.length)       fails.push(`${dupes.length} duplicate pixel sets`);
if (FIXFAIL.length)     fails.push(`fix assertions failed: ${FIXFAIL.join(', ')}`);
const unexplainedChange = changed.filter(t => !EXPLAINED_CHANGE[t]);
if (unexplainedChange.length) fails.push(`${unexplainedChange.length} unexplained changes: ${unexplainedChange.join(', ')}`);
const missedChange = Object.keys(EXPLAINED_CHANGE).filter(t => !changed.includes(t));
if (missedChange.length) fails.push(`documented as changed but did not change: ${missedChange.join(', ')}`);

if (fails.length) { line('GATES FAILED: ' + fails.join('; ')); process.exitCode = 1; }
else {
  line(`GATES PASSED — ${Object.keys(PREV.places).length - changed.length} of ` +
       `${Object.keys(PREV.places).length} places byte-identical to ${PREV.version}, ` +
       `${OVER.length} centroid flags all explained, 0 duplicate geometries, ` +
       `both 1.6.0 fixes asserted.`);
  changed.forEach(t => line(`\n  change: ${t}\n    ${EXPLAINED_CHANGE[t]}`));
}
