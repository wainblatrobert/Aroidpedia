/* Builds "Footer injection 8.9.26 v6.txt" (FILE v19) from v5 using the
   shared edit list. Every needle proved unique before any cut; the
   untouched remainder asserted verbatim. */
import fs from 'fs';
import { EDITS } from './edits-visual.mjs';

const SRC = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v5.txt';
const OUT = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v6.txt';
const orig = fs.readFileSync(SRC, 'utf8');

let bad = 0;
EDITS.forEach(([oldS], i) => {
  const at = orig.indexOf(oldS);
  if (at < 0) { console.error('NEEDLE MISSING #' + i + ': ' + oldS.slice(0, 60).replace(/\n/g, '\\n')); bad++; }
  else if (orig.indexOf(oldS, at + 1) >= 0) { console.error('NEEDLE NOT UNIQUE #' + i + ': ' + oldS.slice(0, 60).replace(/\n/g, '\\n')); bad++; }
});
if (bad) { console.error('NOTHING WRITTEN.'); process.exit(1); }

let out = orig;
for (const [oldS, newS] of EDITS) out = out.replace(oldS, newS);

const checks = [
  ['FILE VERSION: v19', 1], ['FILE VERSION: v18', 0],
  ['SPECIES CARD  (v17)', 1], ['CLIMATE RANGE  (v3)', 1],
  ['CLIMATE RANGE  v3', 1], ['CLIMATE RANGE  v2', 0],
  ['apclim-band--t-in', 1],       /* CSS only — JS assembles the class from parts */
  ['apclim-now', 2],              /* CSS rule + JS string */
  ['apsc-strip__cap', 4],         /* CSS x3 selectors + JS create */
  ['apsc-plates__label', 2],      /* CSS + JS */
  ['tnMed:[]', 1],
  ['new Date().getMonth()', 1]
];
let cbad = 0;
for (const [needle, want] of checks) {
  const got = out.split(needle).length - 1;
  if (got !== want) { console.error(`ASSERT FAIL: "${needle}" x${got}, wanted x${want}`); cbad++; }
}
/* untouched spans between consecutive edits carried verbatim */
let cursor = 0, sbad = 0;
const positions = EDITS.map(([oldS]) => orig.indexOf(oldS)).sort((a, b) => a - b);
const ends = EDITS.map(([oldS]) => orig.indexOf(oldS) + oldS.length).sort((a, b) => a - b);
for (let i = 0; i < positions.length; i++) {
  const spanStart = i === 0 ? 0 : ends[i - 1];
  const span = orig.slice(spanStart, positions[i]);
  if (span && !out.includes(span)) { console.error('SPAN FAIL before edit at ' + positions[i]); sbad++; }
}
const tail = orig.slice(ends[ends.length - 1]);
if (tail && !out.includes(tail)) { console.error('TAIL FAIL'); sbad++; }
if (cbad + sbad) { console.error('NOTHING WRITTEN.'); process.exit(1); }

fs.writeFileSync(OUT, out, 'utf8');
console.log('wrote', OUT, '·', (out.length / 1024).toFixed(1), 'KB');
