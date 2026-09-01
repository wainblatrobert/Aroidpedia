/* Builds "Footer injection 8.9.26 v5.txt" (FILE v18) from v4:
   SPECIES CARD v15 -> v16 — the post-authored CLIMATE prose row is
   retired site-wide; the measured CLIMATE RANGE replaces it. */
import fs from 'fs';

const SRC = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v4.txt';
const OUT = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v5.txt';
const orig = fs.readFileSync(SRC, 'utf8');

function once(hay, needle, name){
  const i = hay.indexOf(needle);
  if (i < 0) { console.error('ABORT: needle missing -> ' + name); process.exit(1); }
  if (hay.indexOf(needle, i + 1) >= 0) { console.error('ABORT: needle not unique -> ' + name); process.exit(1); }
  return i;
}

const H_OLD = `FILE VERSION: v17  (last updated 2026-08-09; SPECIES CARD v15 -`;
const H_NEW = `FILE VERSION: v18  (last updated 2026-08-09; SPECIES CARD v16 -
     the post-authored CLIMATE prose row is RETIRED site-wide: a sweep
     of all 179 species posts found only templates (one text on 86
     posts), "N/A" (39) and "Unknown" (33); the measured CLIMATE RANGE
     row is the card's climate statement now. Also v15 -`;
once(orig, H_OLD, 'file header');

const T_OLD = `       "SPECIES CARD  (v15)"`;
const T_NEW = `       "SPECIES CARD  (v16)"`;
once(orig, T_OLD, 'TOC');

const B_OLD = `     AROIDPEDIA · SPECIES CARD  v15  —  8.9.26
     (v15: the generic hand-drawn range map`;
const B_NEW = `     AROIDPEDIA · SPECIES CARD  v16  —  8.9.26
     (v16: the CLIMATE prose row is retired — see the comment at the
     rail's fact loop. v15: the generic hand-drawn range map`;
once(orig, B_OLD, 'block header');

const M_OLD = `    ["parentage","hybridizer","climate","ecology"].forEach(function(k){`;
const M_NEW = `    /* v16: CLIMATE PROSE IS RETIRED SITE-WIDE (user ruling 8.9.26).
       A sweep of ALL 179 species posts found the CLIMATE label is
       never a description of the species: one template text sits on
       86 posts verbatim-but-for-its-first-line (48-88°F / rainy
       Oct-May, pasted across Australia, Borneo, the Philippines,
       Hainan and New Guinea alike), 39 posts say "N/A", 33 say
       "Unknown", and the rest are five regional templates filled in
       with different numbers - even A. acuminata's, the best of them,
       is the same skeleton. The measured CLIMATE RANGE row (its own
       block, from climate.json) is the card's climate statement now.
       The label is still parsed and marked used-in-rail so the prose
       can never resurface as a body section, and its source block
       stays hidden with the rest. */
    usedInRail.climate = 1;
    ["parentage","hybridizer","ecology"].forEach(function(k){`;
once(orig, M_OLD, 'rail fact loop');

let out = orig.replace(H_OLD, H_NEW).replace(T_OLD, T_NEW).replace(B_OLD, B_NEW).replace(M_OLD, M_NEW);

const checks = [
  ['FILE VERSION: v18', 1],
  ['FILE VERSION: v17', 0],
  ['SPECIES CARD  (v16)', 1],
  ['SPECIES CARD  v16', 1],
  ['CLIMATE PROSE IS RETIRED SITE-WIDE', 1],
  ['usedInRail.climate = 1', 1],
  ['"parentage","hybridizer","climate"', 0],
  ['CLIMATE RANGE  v2', 1]
];
let bad = 0;
for (const [needle, want] of checks){
  const got = out.split(needle).length - 1;
  if (got !== want){ console.error(`ASSERT FAIL: "${needle}" x${got}, wanted x${want}`); bad++; }
}
const spans = [
  orig.slice(orig.indexOf(H_OLD) + H_OLD.length, orig.indexOf(T_OLD)),
  orig.slice(orig.indexOf(T_OLD) + T_OLD.length, orig.indexOf(B_OLD)),
  orig.slice(orig.indexOf(B_OLD) + B_OLD.length, orig.indexOf(M_OLD)),
  orig.slice(orig.indexOf(M_OLD) + M_OLD.length)
];
spans.forEach((s, i) => { if (!out.includes(s)){ console.error('ASSERT FAIL: span ' + i + ' not carried'); bad++; } });
if (bad){ console.error('NOTHING WRITTEN.'); process.exit(1); }

fs.writeFileSync(OUT, out, 'utf8');
console.log('wrote', OUT, '·', (out.length / 1024).toFixed(1), 'KB');
