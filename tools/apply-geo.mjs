/* Builds "Footer injection 8.9.26 v4.txt" (FILE v17) from v3:
   SPECIES CARD v14 -> v15 — images filed under DISTRIBUTION (the
   retired hand-drawn range maps) no longer fall through to More
   photos; they disappear from the card entirely (user ruling 8.9.26).
   Gallery copies with their own URLs are untouched — those are part
   of the gallery the author arranged. */
import fs from 'fs';

const SRC = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v3.txt';
const OUT = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v4.txt';
const orig = fs.readFileSync(SRC, 'utf8');

function once(hay, needle, name){
  const i = hay.indexOf(needle);
  if (i < 0) { console.error('ABORT: needle missing -> ' + name); process.exit(1); }
  if (hay.indexOf(needle, i + 1) >= 0) { console.error('ABORT: needle not unique -> ' + name); process.exit(1); }
  return i;
}

const H_OLD = `FILE VERSION: v16  (last updated 2026-08-09; SPECIES CARD v14 -`;
const H_NEW = `FILE VERSION: v17  (last updated 2026-08-09; SPECIES CARD v15 -
     the generic hand-drawn range map (DISTRIBUTION images named
     "*geo.png") no longer falls through to "More photos" - gone from
     the card entirely; essential additional maps under DISTRIBUTION
     are kept (user rulings 8.9.26). Also v14 -`;
once(orig, H_OLD, 'file header');

const T_OLD = `       "SPECIES CARD  (v14)"`;
const T_NEW = `       "SPECIES CARD  (v15)"`;
once(orig, T_OLD, 'TOC');

const B_OLD = `     AROIDPEDIA · SPECIES CARD  v14  —  8.9.26
     (v14: "More photos" sorted into the page's own order — see the
     MORE PHOTOS comment in the render section. v13, 8.5.26, below.)`;
const B_NEW = `     AROIDPEDIA · SPECIES CARD  v15  —  8.9.26
     (v15: the generic hand-drawn range map — DISTRIBUTION images
     named "*geo.png" — no longer reaches "More photos" at all; the
     tag-drawn map replaced it and the user ruled it gone, 8.9.26,
     while ESSENTIAL additional maps under DISTRIBUTION stay. This
     narrows the "falls through to MORE PHOTOS" line in the map
     section's NO-TOGGLE note. v14: "More photos" sorted into the
     page's own order — see the MORE PHOTOS comment in the render
     section. v13, 8.5.26, below.)`;
once(orig, B_OLD, 'block header');

const M_OLD = `    var rest = allImgs.filter(function(i){
      var k = i.src.split("?")[0];
      if (shown[k]) return false;
      shown[k] = 1;
      return true;
    });`;
const M_NEW = `    /* v15: THE GENERIC RANGE MAPS ARE GONE. The hand-drawn geo map
       the tag-drawn map replaced used to fall through to this strip
       (the map section's NO-TOGGLE note) and, sitting mid-page, it
       opened the strip on nearly every species post. User ruling
       8.9.26: drop it — BUT some posts carry ADDITIONAL maps under
       DISTRIBUTION that are essential (occurrence-data maps, second
       detail maps), so the filter takes only images that are BOTH
       filed under DISTRIBUTION AND named by the generic convention:
       a filename ending in "geo" before the extension (acuminata+geo
       .png, geo.png, scalprum+geo.jpg) OR the bare species epithet
       (atropurpurea.png, cuprea.png, decipiens.png — the same generic
       map under its other naming habit; cuprea proves it, carrying
       BOTH cuprea.png and the essential updated+distribution+cuprea
       .PNG). alba+java+geo+data.PNG, aequiloba+distribution+2.PNG and
       every "+distribution" detail map survive on purpose. Widen or
       narrow by editing RETIRED_NAME / the epithet test below. A copy
       the author also placed in the gallery has its own URL and
       stays. */
    var RETIRED_NAME = /(^|[+\\-_. ])geo\\.(png|jpe?g)$/i;
    var epithet = (facts.title.split(/\\s+/)[1] || "").toLowerCase();
    var retired = {};
    ((S.distribution && S.distribution.images) || []).forEach(function(i){
      var base = i.src.split("?")[0].split("/").pop();
      var stem = base.replace(/\\.[a-z]+$/i, "").toLowerCase();
      if (RETIRED_NAME.test(base) || (epithet && stem === epithet)){
        retired[i.src.split("?")[0]] = 1;
      }
    });
    var rest = allImgs.filter(function(i){
      var k = i.src.split("?")[0];
      if (retired[k]) return false;
      if (shown[k]) return false;
      shown[k] = 1;
      return true;
    });`;
once(orig, M_OLD, 'More photos filter');

let out = orig.replace(H_OLD, H_NEW).replace(T_OLD, T_NEW).replace(B_OLD, B_NEW).replace(M_OLD, M_NEW);

const checks = [
  ['FILE VERSION: v17', 1],
  ['FILE VERSION: v16', 0],
  ['SPECIES CARD  (v15)', 1],
  ['SPECIES CARD  v15', 1],
  ['SPECIES CARD  v14', 0],   /* double-space form fully superseded */
  ['THE GENERIC RANGE MAPS ARE GONE', 1],
  ['RETIRED_NAME', 3],
  ['retired[k]', 1],
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
