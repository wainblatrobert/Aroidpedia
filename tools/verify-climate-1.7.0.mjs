/* Verification gate for climate.json 1.7.0 (8.17.26).

   1.7.0 is PURELY ADDITIVE: it adds prMed (median monthly rainfall,
   mm) to every variant and touches nothing else. So the claim to test
   is sharper than any previous version's — not "these places moved for
   these reasons" but "NOTHING moved at all".

   Sections:
     A  strip prMed from 1.7.0 and require byte-identity with 1.6.0
     B  prMed present, well-formed and non-negative on every variant
     C  the values are real rainfall, not a constant or a copy of
        another field — the failure mode a shape check cannot see
     D  the dry season is actually recoverable now, on the places that
        motivated the change

   Reads climate.json + climate.json.1.6.0.  */
import fs from 'fs';
const N = JSON.parse(fs.readFileSync('./climate.json', 'utf8'));
const O = JSON.parse(fs.readFileSync('./climate.json.1.6.0', 'utf8'));
if (N.version !== '1.7.0') {
  console.error(`This gate verifies 1.6.0 -> 1.7.0; climate.json is ${N.version}.`);
  process.exit(1);
}
const VAR = ['all', 'ff', 'warm', 'warmMoist'];
const line = s => console.log(s);
const fails = [];

/* ── A ── */
const strip = e => { const c = JSON.parse(JSON.stringify(e));
  VAR.forEach(k => { if (c[k]) delete c[k].prMed; }); return c; };
let moved = [];
for (const [tag, o] of Object.entries(O.places)) {
  const n = N.places[tag];
  if (!n) { moved.push(tag + ' MISSING'); continue; }
  if (JSON.stringify(strip(n)) !== JSON.stringify(o)) moved.push(tag);
}
line(`A. additive-only: ${Object.keys(O.places).length - moved.length}/${Object.keys(O.places).length} ` +
     `places byte-identical once prMed is stripped`);
if (moved.length) fails.push(`${moved.length} places moved: ${moved.slice(0, 8).join(', ')}`);

/* ── B ── */
let bad = 0, missing = 0, n = 0;
for (const e of Object.values(N.places)) for (const k of VAR) {
  if (!e[k]) continue;
  n++;
  const pr = e[k].prMed;
  if (!Array.isArray(pr) || pr.length !== 12) { missing++; continue; }
  if (pr.some(x => !isFinite(x) || x < 0)) bad++;
}
line(`B. prMed well-formed on ${n - missing - bad}/${n} variants`);
if (missing) fails.push(`${missing} variants missing prMed`);
if (bad) fails.push(`${bad} variants with negative or non-finite prMed`);

/* ── C ── the check a shape test cannot make. A field that is present,
   12 long and numeric can still be garbage: a constant, or an
   accidental copy of tnMed. Both would sail through A and B. */
let flat = 0, echoes = 0;
for (const e of Object.values(N.places)) {
  const v = e.warmMoist || e.warm || e.ff || e.all;
  if (!v || !v.prMed) continue;
  if (new Set(v.prMed).size === 1) flat++;
  if (JSON.stringify(v.prMed) === JSON.stringify(v.tnMed.map(Math.round))) echoes++;
}
line(`C. constant-value places: ${flat}   places where prMed echoes tnMed: ${echoes}`);
if (echoes) fails.push(`${echoes} places where prMed is a copy of tnMed`);
/* flat is not automatically wrong — a 1-cell place can have a flat
   month profile — so it is reported, not failed. */

/* ── D ── the point of the whole exercise: places whose dry season was
   INVISIBLE in the old derived-dew-point signal must now show one. */
line('D. dry season recoverable where the dew-point proxy failed:');
const EXPECT = [
  ['Ogun',            'Harmattan — dew showed 2.7 C of nothing'],
  ['Nigeria',         'the northern dry season'],
  ['Karnataka',       'the monsoon'],
  ['Amhara',          'Ethiopian highland — cool all year, sharply seasonal rain'],
  ['Borneo',          'MUST stay everwet: no month below 60 mm'],
  ['Sumatra',         'MUST stay everwet']
];
for (const [tag, why] of EXPECT) {
  const e = N.places[tag];
  if (!e) { line(`   ${tag.padEnd(12)} ABSENT`); fails.push(tag + ' absent'); continue; }
  const v = e.warmMoist || e.warm || e.ff || e.all;
  const lo = Math.min(...v.prMed), hi = Math.max(...v.prMed);
  const dryMonths = v.prMed.filter(x => x < 60).length;
  const everwet = /MUST stay everwet/.test(why);
  const ok = everwet ? dryMonths === 0 : dryMonths >= 2;
  line(`   ${tag.padEnd(12)} ${String(lo).padStart(4)}-${String(hi).padStart(4)} mm  ` +
       `${dryMonths} month(s) under 60 mm  ${ok ? 'ok' : 'FAIL'}   ${why}`);
  if (!ok) fails.push(`${tag}: ${dryMonths} dry months, expected ${everwet ? '0' : '>=2'}`);
}

line('');
if (fails.length) { console.log('GATE FAILED: ' + fails.join('; ')); process.exitCode = 1; }
else console.log('GATE PASSED — 1.7.0 adds rainfall and moves nothing else.');
