/* Builds "Footer injection 8.9.26 v3.txt" (FILE v16) from v2:
   SPECIES CARD v13 -> v14 — "More photos" now follows the PAGE's own
   top-to-bottom order instead of schema-assembly order.
   Needles proved before cutting; output asserted. */
import fs from 'fs';

const SRC = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v2.txt';
const OUT = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v3.txt';
const orig = fs.readFileSync(SRC, 'utf8');

function once(hay, needle, name){
  const i = hay.indexOf(needle);
  if (i < 0) { console.error('ABORT: needle missing -> ' + name); process.exit(1); }
  if (hay.indexOf(needle, i + 1) >= 0) { console.error('ABORT: needle not unique -> ' + name); process.exit(1); }
  return i;
}

/* 1 — file header */
const H_OLD = `FILE VERSION: v15  (last updated 2026-08-09; CLIMATE RANGE v2 -`;
const H_NEW = `FILE VERSION: v16  (last updated 2026-08-09; SPECIES CARD v14 -
     "More photos" now follows the page's own top-to-bottom order: it
     was assembled in schema order, which pushed the retired
     DISTRIBUTION images to the front and, on A. alba, inline figures
     into the middle of a hand-arranged 35-image gallery. Also
     CLIMATE RANGE v2 -`;
once(orig, H_OLD, 'file header');

/* 2 — TOC */
const T_OLD = `       "SPECIES CARD  (v13)"`;
const T_NEW = `       "SPECIES CARD  (v14)"`;
once(orig, T_OLD, 'TOC species card');

/* 3 — block header */
const B_OLD = `     AROIDPEDIA · SPECIES CARD  v13  —  8.5.26`;
const B_NEW = `     AROIDPEDIA · SPECIES CARD  v14  —  8.9.26
     (v14: "More photos" sorted into the page's own order — see the
     MORE PHOTOS comment in the render section. v13, 8.5.26, below.)`;
once(orig, B_OLD, 'block header');

/* 4 — the More photos assembly */
const M_OLD = `    var rest = allImgs.filter(function(i){
      var k = i.src.split("?")[0];
      if (shown[k]) return false;
      shown[k] = 1;
      return true;
    });
    if (rest.length) body.appendChild(section("More photos", photoStrip(rest, lb), rest.length));`;
const M_NEW = `    var rest = allImgs.filter(function(i){
      var k = i.src.split("?")[0];
      if (shown[k]) return false;
      shown[k] = 1;
      return true;
    });
    /* v14: THE STRIP FOLLOWS THE PAGE. allImgs is assembled in SCHEMA
       order — the order the card tells the story in, which is not the
       order the author laid the photos out in. On A. alba that pushed
       three DISTRIBUTION images and an inline figure into the middle
       of a 35-image gallery arranged by hand; on nearly every species
       post it led the strip with the retired hand-drawn range map
       instead of the gallery's opening photo. Every image carries the
       index of the source block it was read from ("at"), so sorting
       on it restores the full entry's own top-to-bottom order; the
       tiebreak on collection index keeps one gallery's photos in
       their set order and makes the sort stable everywhere. */
    rest = rest.map(function(r, i){ return { r: r, i: i }; })
      .sort(function(a, b){ return (a.r.at || 0) - (b.r.at || 0) || a.i - b.i; })
      .map(function(x){ return x.r; });
    if (rest.length) body.appendChild(section("More photos", photoStrip(rest, lb), rest.length));`;
once(orig, M_OLD, 'More photos assembly');

let out = orig.replace(H_OLD, H_NEW).replace(T_OLD, T_NEW).replace(B_OLD, B_NEW).replace(M_OLD, M_NEW);

const checks = [
  ['FILE VERSION: v16', 1],
  ['FILE VERSION: v15', 0],
  ['SPECIES CARD  (v14)', 1],
  ['SPECIES CARD  v14', 1],
  ['SPECIES CARD  v13', 0],
  ['THE STRIP FOLLOWS THE PAGE', 1],
  ['CLIMATE RANGE  v2', 1]
];
let bad = 0;
for (const [needle, want] of checks){
  const got = out.split(needle).length - 1;
  if (got !== want){ console.error(`ASSERT FAIL: "${needle}" x${got}, wanted x${want}`); bad++; }
}
/* untouched remainder: the file minus the four replaced needles must
   be carried verbatim — check the largest untouched span */
const spans = [
  orig.slice(orig.indexOf(H_OLD) + H_OLD.length, orig.indexOf(T_OLD)),
  orig.slice(orig.indexOf(T_OLD) + T_OLD.length, orig.indexOf(B_OLD)),
  orig.slice(orig.indexOf(B_OLD) + B_OLD.length, orig.indexOf(M_OLD)),
  orig.slice(orig.indexOf(M_OLD) + M_OLD.length)
];
spans.forEach((s, i) => { if (!out.includes(s)){ console.error('ASSERT FAIL: span ' + i + ' not carried verbatim'); bad++; } });
if (bad){ console.error('NOTHING WRITTEN.'); process.exit(1); }

fs.writeFileSync(OUT, out, 'utf8');
console.log('wrote', OUT, '·', (out.length / 1024).toFixed(1), 'KB');
