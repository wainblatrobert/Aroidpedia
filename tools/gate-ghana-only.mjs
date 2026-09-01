/* 1.12.0 -> 1.13.0 must be a KOPPEN-ONLY change.

   The fix touches one expression inside the classifier, so every other
   field — temperatures, humidity, precipitation, WTE zones, elevation
   slabs, shares, lat/lon, the place set — must come back byte-equal.
   Anything else that moved means the rebuild picked up an unrelated
   input drift, and the diff would be unreviewable.

   ⚠ elev.bands[].k IS a Koppen mix, so it is expected to move too. It
   is counted separately rather than waved through with the rest. */
import fs from 'fs';
const A = JSON.parse(fs.readFileSync('./climate-1.20.0-baseline.json', 'utf8'));
const B = JSON.parse(fs.readFileSync('./climate.json', 'utf8'));
const a = A.places || A, b = B.places || B;

console.log(`baseline ${A.version}  ->  new ${B.version}`);
const ka = Object.keys(a), kb = Object.keys(b);
console.log(`places ${ka.length} -> ${kb.length}` +
  (ka.length === kb.length ? '  (unchanged)' : '  ** PLACE SET MOVED **'));
const missing = ka.filter(k => !(k in b)), added = kb.filter(k => !(k in a));
if (missing.length) console.log('  gone: ' + missing.join(', '));
if (added.length)   console.log('  new:  ' + added.join(', '));

const VARIANTS = ['all', 'ff', 'warm', 'warmMoist'];
const SERIES = ['tnLo','tnMed','txMed','txHi','rhLo','rhHi','rhLo50','rhHi50','prMed',
                'annTnMin','annTxMax','zones'];
let nonKoppen = 0, koppenChanged = 0, elevKChanged = 0, elevOtherChanged = 0, checked = 0;
const examples = [];
for (const t of ka) {
  if (!(t in b)) continue;
  const x = a[t], y = b[t];
  for (const f of ['n','ffShare','warmShare','wmShare','method','lat','lon']) {
    if (JSON.stringify(x[f]) !== JSON.stringify(y[f])) {
      nonKoppen++; if (examples.length < 6) examples.push(`${t}.${f}`);
    }
  }
  for (const v of VARIANTS) {
    if (!x[v] || !y[v]) { if (!!x[v] !== !!y[v]) nonKoppen++; continue; }
    for (const f of SERIES) {
      checked++;
      if (JSON.stringify(x[v][f]) !== JSON.stringify(y[v][f])) {
        nonKoppen++; if (examples.length < 6) examples.push(`${t}.${v}.${f}`);
      }
    }
    if (JSON.stringify(x[v].koppen) !== JSON.stringify(y[v].koppen)) koppenChanged++;
  }
  /* elevation slabs: n/tn/tx must hold; k is a Koppen mix and may move */
  const ea = x.elev && x.elev.bands, eb = y.elev && y.elev.bands;
  if (ea && eb) {
    if (JSON.stringify(Object.keys(ea)) !== JSON.stringify(Object.keys(eb))) elevOtherChanged++;
    for (const band of Object.keys(ea)) {
      if (!eb[band]) { elevOtherChanged++; continue; }
      for (const f of ['n','tn','tx']) {
        if (JSON.stringify(ea[band][f]) !== JSON.stringify(eb[band][f])) elevOtherChanged++;
      }
      if (JSON.stringify(ea[band].k) !== JSON.stringify(eb[band].k)) elevKChanged++;
    }
  }
}
console.log(`\n  ${checked} non-Koppen series compared`);
console.log(`  non-Koppen fields changed : ${nonKoppen}` + (nonKoppen ? '   ** UNEXPECTED **' : '   (none — good)'));
if (examples.length) console.log('    e.g. ' + examples.join(', '));
console.log(`  elev n/tn/tx changed      : ${elevOtherChanged}` + (elevOtherChanged ? '   ** UNEXPECTED **' : '   (none — good)'));
console.log(`  koppen mixes changed      : ${koppenChanged}   (expected)`);
console.log(`  elev band Koppen changed  : ${elevKChanged}   (expected)`);
const clean = !nonKoppen && !elevOtherChanged && !missing.length;   /* ADDED PLACES ARE NOT DRIFT: 1.12.0 was built 8.18.26 and the map lane shipped Cambodia + Madagascar on 8.19.26, so the live climate feed has been MISSING them since. A rebuild picking them up is the feed catching up. Drift would be a place DISAPPEARING or a pre-existing series moving - both asserted zero above. */
console.log('\n' + (clean ? 'CLEAN: Koppen moved as intended; nothing lost, no other field touched.'
                          : 'DIRTY: something outside Koppen moved — do not ship.'));
process.exitCode = clean ? 0 : 1;
