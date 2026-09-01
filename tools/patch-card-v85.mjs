/* Card v100 (FILE v118) — the curve shifts with the hemisphere.
   Master: Footer injection 8.19.26 v24.txt -> v25.txt

   ⚠ RE-TARGETED. This was first written against v20/file-v102 and two
   days had passed: the master had moved to 8.19.26 v24 / file-v117 and
   v20 had been archived to Backup\. Applying it as written would have
   reverted FOURTEEN file versions of other lanes' work. Only an ENOENT
   on the missing v20 stopped it. ALWAYS re-read the master and re-check
   the deployed stamp before patching — a patch script is not a plan,
   it is a snapshot.

   THE BUG, found by the grower on amorphophallus-impressus: flipping
   N/S moved the hatched band and the hover readout but NOT the curve
   behind them. restChart read cal.rest at the raw index while the band
   applied restShift(), so on a flip the lean band sat over the GROWING
   half of its own curve.

   It affects every species on a flip; impressus made it visible because
   it is southern-native and therefore OPENS aligned, so the flip is the
   first thing that moves.

   ⚠ WHY MY TESTS MISSED IT: every assertion read TEXT — the callout
   months, the labels, the hint. All of those were right. Nothing
   compared the band's position against the curve's shape, which is the
   only thing that could have caught it. The new gate asserts the
   INVARIANT: mean curve height under the band must exceed mean height
   outside it, in both hemispheres. Lean is drawn high, so a band that
   drifts onto the growing half fails immediately.                    */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.19.26 v24.txt';
const OUT = DIR + 'Footer injection 8.19.26 v25.txt';
let s = fs.readFileSync(SRC, 'utf8');
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
const edits = [];
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error(`ABORT: "${name}" matched ${n}, expected 1`); process.exit(1); }
  s = s.replace(f, () => r);
  edits.push(name);
}

cut('curve-shift',
  `    function yOf(v){ return +(BOT - (BOT - TOP) * v).toFixed(2); }
    var y = cal.rest.map(function(r){ return 0.06 + 0.88 * Math.min(1, r); });
    function at(i){ return [xm(i), yOf(y[((i % 12) + 12) % 12])]; }`,
  `    function yOf(v){ return +(BOT - (BOT - TOP) * v).toFixed(2); }
    var y = cal.rest.map(function(r){ return 0.06 + 0.88 * Math.min(1, r); });
    /* ⚠ THE CURVE CARRIES THE SAME OFFSET AS THE BAND. cal.rest is in
       the NATIVE calendar; the band, the hover state and the callout
       all pass through restShift(). This did not, so a flip slid the
       band six months across a stationary curve and parked the lean
       season on its own growing half. Displayed month i shows native
       month i - off. */
    var off = restShift(cal, south);
    function at(i){ return [xm(i), yOf(y[(((i - off) % 12) + 12) % 12])]; }`);

cut('stamp', '"card-v99-file-v117"', '"card-v100-file-v118"');
cut('banner', 'FILE VERSION: v117', 'FILE VERSION: v118');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
