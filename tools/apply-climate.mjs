/* Builds "Footer injection 8.9.26 v1.txt" from the 8.8.26 v1 file:
   1. header: FILE VERSION v13 -> v14 with the new changelog sentence
   2. TOC: adds the CLIMATE RANGE entry after COMMENT BAR's
   3. appends the CLIMATE RANGE block (climate-block.txt) at the end
   Every needle is proved present exactly once BEFORE any edit, and the
   output is asserted to carry the untouched remainder verbatim. */
import fs from 'fs';

const SRC = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.8.26 v1.txt';
const OUT = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v2.txt';
const BLOCK = new URL('./climate-block.txt', import.meta.url);

const orig = fs.readFileSync(SRC, 'utf8');
const block = fs.readFileSync(BLOCK, 'utf8');

function once(hay, needle, name){
  const i = hay.indexOf(needle);
  if (i < 0) { console.error('ABORT: needle missing -> ' + name); process.exit(1); }
  if (hay.indexOf(needle, i + 1) >= 0) { console.error('ABORT: needle not unique -> ' + name); process.exit(1); }
  return i;
}

/* ---- needle 1: the version header parenthetical ---- */
const H_OLD = `FILE VERSION: v13  (last updated 2026-08-08; adds COMMENT BAR - the
     journal entries' Squarespace comment box rebuilt as the home page hero
     glass search bar. Its CSS lives in THIS file, not Custom CSS - see the
     block's own note. Previously v12: SPECIES CARD`;
const H_NEW = `FILE VERSION: v15  (last updated 2026-08-09; CLIMATE RANGE v2 -
     humidity now shows the TYPICAL DAILY SWING (median cell's afternoon
     low to dawn high, climate.json >= 1.3.0) instead of the p05
     envelope that made Thailand read "33%"; labelled "daily swing" in
     the row. Previously v14 (also 8.9.26): CLIMATE RANGE v1 - measured
     temperature + humidity on every journal entry from the same place
     tags the distribution map draws + the climate.json feed; F/C
     toggle, monthly band charts, zone chips; silent until climate.json
     deploys. Previously v13: COMMENT BAR - the journal entries'
     Squarespace comment box rebuilt as the home page hero glass search
     bar. Previously v12: SPECIES CARD`;
once(orig, H_OLD, 'version header');

/* ---- needle 2: end of the COMMENT BAR TOC entry ---- */
const TOC_ANCHOR = `                                      button, auto-growing field.
                                      Gated to blog items only`;
const TOC_ADD = `
       "CLIMATE RANGE  (v2)"          journal entries: yearly + monthly
                                      temperature and humidity measured
                                      across the card's own place chips
                                      (climate.json feed), with °F/°C
                                      toggle, band charts, zone chips.
                                      Temp = envelope; humidity = the
                                      typical daily swing (v2).
                                      Renders nothing until climate.json
                                      is deployed beside shapes.json`;
once(orig, TOC_ANCHOR, 'TOC anchor');

/* ---- sanity on the block itself ---- */
if (!/CLIMATE RANGE  v2/.test(block)) { console.error('ABORT: block header missing'); process.exit(1); }
if (orig.includes('apclim')) { console.error('ABORT: source already contains apclim'); process.exit(1); }

/* ---- build ---- */
let out = orig.replace(H_OLD, H_NEW).replace(TOC_ANCHOR, TOC_ANCHOR + TOC_ADD);
out = out.replace(/\s*$/, '') + '\n\n\n' + block.replace(/\s*$/, '') + '\n';

/* ---- asserts on the finished file (verify-by-searching-the-output) ---- */
const checks = [
  ['FILE VERSION: v15', 1],
  ['FILE VERSION: v13', 0],
  ['FILE VERSION: v14', 0],
  ['CLIMATE RANGE  v2', 1],
  ['CLIMATE RANGE  v1', 0],
  ['"CLIMATE RANGE  (v2)"', 1],
  ['rhLo50', 3],                 /* doc mention + JS comment + JS use */
  ['daily swing', 7],            /* header ×2 + TOC + doc + sub-label + comment + tooltip */
  ['APCLIM_DATA', 4],            /* 2 doc mentions + JS check + JS use */
  ['data-apclim-done', 5],       /* JS comment + 1 get + 3 sets */
  ['apsc-fact--clim', 1]
];
let bad = 0;
for (const [needle, want] of checks){
  const got = out.split(needle).length - 1;
  if (got !== want){ console.error(`ASSERT FAIL: "${needle}" x${got}, wanted x${want}`); bad++; }
}
/* the untouched remainder: everything between the two edits, and from
   the TOC edit to the end of the original, must be carried verbatim */
const afterHeader = orig.indexOf(H_OLD) + H_OLD.length;
const tocIdx = orig.indexOf(TOC_ANCHOR);
const mid = orig.slice(afterHeader, tocIdx);
const tail = orig.slice(tocIdx + TOC_ANCHOR.length).replace(/\s*$/, '');
if (!out.includes(mid)) { console.error('ASSERT FAIL: mid-file content not carried verbatim'); bad++; }
if (!out.includes(tail)) { console.error('ASSERT FAIL: tail content not carried verbatim'); bad++; }
if (bad){ console.error('NOTHING WRITTEN.'); process.exit(1); }

fs.writeFileSync(OUT, out, 'utf8');
console.log('wrote', OUT);
console.log('size:', (out.length / 1024).toFixed(1), 'KB  (was', (orig.length / 1024).toFixed(1), 'KB)');
