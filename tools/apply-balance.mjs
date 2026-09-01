import fs from 'fs';
import { EDITS } from './edits-balance.mjs';

const SRC = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v6.txt';
const OUT = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v7.txt';
const orig = fs.readFileSync(SRC, 'utf8');

let bad = 0;
EDITS.forEach(([oldS], i) => {
  const at = orig.indexOf(oldS);
  if (at < 0) { console.error('NEEDLE MISSING #' + i + ': ' + oldS.slice(0, 70).replace(/\n/g, '\\n')); bad++; }
  else if (orig.indexOf(oldS, at + 1) >= 0) { console.error('NEEDLE NOT UNIQUE #' + i); bad++; }
});
if (bad) { console.error('NOTHING WRITTEN.'); process.exit(1); }

let out = orig;
for (const [oldS, newS] of EDITS) out = out.replace(oldS, newS);

const checks = [
  ['FILE VERSION: v20', 1], ['FILE VERSION: v19', 0],
  ['SPECIES CARD  (v18)', 1], ['CLIMATE RANGE  (v4)', 1],
  ['THE EMPTY COLUMN', 1],            /* JS comment; the header's copy line-wraps */
  ['apsc-balance-home', 1],
  ['restoreLast', 3],
  ['apsc-clim__legend', 2],           /* CSS + JS */
  ['apsc-clim__key', 8],              /* CSS x4 selectors + JS "key key--x" x2 strings = 4 */
  ['typ ', 2]
];
let cbad = 0;
for (const [needle, want] of checks) {
  const got = out.split(needle).length - 1;
  if (got !== want) { console.error(`ASSERT FAIL: "${needle}" x${got}, wanted x${want}`); cbad++; }
}
const positions = EDITS.map(([oldS]) => orig.indexOf(oldS)).sort((a, b) => a - b);
const ends = EDITS.map(([oldS]) => orig.indexOf(oldS) + oldS.length).sort((a, b) => a - b);
let sbad = 0;
for (let i = 0; i < positions.length; i++) {
  const span = orig.slice(i === 0 ? 0 : ends[i - 1], positions[i]);
  if (span && !out.includes(span)) { console.error('SPAN FAIL at ' + positions[i]); sbad++; }
}
const tail = orig.slice(ends[ends.length - 1]);
if (tail && !out.includes(tail)) { console.error('TAIL FAIL'); sbad++; }
if (cbad + sbad) { console.error('NOTHING WRITTEN.'); process.exit(1); }

fs.writeFileSync(OUT, out, 'utf8');
console.log('wrote', OUT, '·', (out.length / 1024).toFixed(1), 'KB');
