/* Card v84 (FILE v102) — the native hemisphere.
   Master: Footer injection 8.17.26 v19.txt -> v20.txt

   THE BUG: the card shifted the rest season six months whenever the
   reader picked S. That is only right for a NORTHERN-native species,
   and 22 of the 110 Amorphophallus are southern-native. The Madagascar
   species already compute a May-Oct lean season — that IS southern
   winter — so "S" moved it backwards into the reader's summer.

   THE FIX, three parts:
     · the offset is (selected !== native) ? 6 : 0, so the NATIVE
       calendar is the zero point instead of the northern one
     · the toggle DEFAULTS to the species' own hemisphere, so a page
       opens on the true, documented months
     · a line states which hemisphere it is native to, because a chart
       that silently re-phases itself per species is worse than one
       that does not

   The flowering span now shifts by the SAME offset — the grower's
   ruling: anchor it to the dry/cold season so it keeps its relationship
   to the cycle ("flowers as the dry season ends") instead of moving
   blindly or not at all.

   ⚠ A STORED PREFERENCE STILL WINS. The toggle says where the READER
   grows; native hemisphere is only the default before they choose.   */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.17.26 v19.txt';
const OUT = DIR + 'Footer injection 8.17.26 v20.txt';
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

/* 1. latitude rides through to the calendar */
cut('parts-lat',
  `      return { tag: e.tag, n: e.p.n, v: pick(e.p).v };`,
  `      /* v84: lat rides along so the calendar can tell which hemisphere
         the species is native to (needs climate.json >= 1.8.0) */
      return { tag: e.tag, n: e.p.n, v: pick(e.p).v, lat: e.p.lat };`);

cut('native-hemi',
  `    return {
      rest: rest, cls: cls, cued: cued, win: win, driver: driver, peak: peak,`,
  `    /* NATIVE HEMISPHERE — mean latitude of the tagged places.
       ⚠ LATITUDE, not the warmest month: derived from temperature the
       sign is wrong for 15 of the 110 species, because within a few
       degrees of the equator the annual temperature peak is noise.
       Pre-1.8.0 data carries no lat, and then nothing votes and the
       card behaves exactly as it did before. */
    var lats = usable.map(function(p){ return p.lat; })
                     .filter(function(v){ return typeof v === "number"; });
    var meanLat = lats.length
      ? lats.reduce(function(a, b){ return a + b; }, 0) / lats.length : null;
    return {
      meanLat: meanLat, nativeSouth: meanLat != null && meanLat < 0,
      hasLat: lats.length > 0,
      rest: rest, cls: cls, cued: cued, win: win, driver: driver, peak: peak,`);

/* 2. one offset function, three call sites */
cut('shift-helper',
  `  function shiftM(i, by){ return (i + by + 12) % 12; }
  function restRange(w, south){
    var st = south ? shiftM(w.start, 6) : w.start;
    return MON[st] + "–" + MON[shiftM(st, w.len - 1)];
  }`,
  `  function shiftM(i, by){ return (i + by + 12) % 12; }
  /* ⚠ THE ZERO POINT IS THE NATIVE CALENDAR, NOT THE NORTHERN ONE.
     The months computed from climate.json are the real months at the
     native locality. A reader in the SAME hemisphere reads them as-is;
     one in the opposite hemisphere is six months out. The old code
     took a bare "south" boolean and always treated N as the zero,
     which shifted every southern-native species backwards for exactly
     the readers it suits. */
  function restShift(cal, south){
    return (south === !!cal.nativeSouth) ? 0 : 6;
  }
  function restRange(w, off){
    var st = shiftM(w.start, off);
    return MON[st] + "–" + MON[shiftM(st, w.len - 1)];
  }`);

cut('phrase-off',
  `      lean: "Lean season " + restRange(cal.win, south),
      grow: cal.grow ? "Most likely to be actively growing " + restRange(cal.grow, south)`,
  `      lean: "Lean season " + restRange(cal.win, restShift(cal, south)),
      grow: cal.grow ? "Most likely to be actively growing " + restRange(cal.grow, restShift(cal, south))`);

cut('chart-off',
  `      var out = [], st = south ? shiftM(w.start, 6) : w.start;`,
  `      var out = [], st = shiftM(w.start, restShift(cal, south));`);

cut('state-off',
  `      var st = south ? shiftM(w.start, 6) : w.start;
      for (var q = 0; q < w.len; q++) if ((st + q) % 12 === m) return true;`,
  `      var st = shiftM(w.start, restShift(cal, south));
      for (var q = 0; q < w.len; q++) if ((st + q) % 12 === m) return true;`);

/* 3. the flowering span moves with the season it is anchored to */
cut('flow-shift',
  `      var fa = cal.flow[0], fb = cal.flow[1];`,
  `      /* v84: shifted by the SAME offset as the lean season — the
         grower's ruling. The record's value is its RELATIONSHIP to the
         cycle ("flowers as the dry season ends"), so it has to travel
         with that season rather than stay pinned or move blindly. The
         habitat months stay visible in the line below the chart. */
      var fo = restShift(cal, south);
      var fa = shiftM(cal.flow[0], fo), fb = shiftM(cal.flow[1], fo);`);

cut('flow-inflower',
  `  function restInFlower(cal, m){
    if (!cal.flow) return false;
    var a = cal.flow[0], b = cal.flow[1];
    return (b >= a) ? (m >= a && m <= b) : (m >= a || m <= b);
  }
  function restFlowerSays(cal){
    return "documented to flower " + MON[cal.flow[0]] + "\\u2013" + MON[cal.flow[1]] + " in habitat";
  }`,
  `  function restInFlower(cal, m, south){
    if (!cal.flow) return false;
    var o = restShift(cal, south);
    var a = shiftM(cal.flow[0], o), b = shiftM(cal.flow[1], o);
    return (b >= a) ? (m >= a && m <= b) : (m >= a || m <= b);
  }
  function restFlowerSays(cal, south){
    var o = restShift(cal, south);
    var here = MON[shiftM(cal.flow[0], o)] + "\\u2013" + MON[shiftM(cal.flow[1], o)];
    var wild = MON[cal.flow[0]] + "\\u2013" + MON[cal.flow[1]];
    /* when the reader's calendar differs from the habitat's, BOTH are
       named: the shifted months are what they should watch for, the
       habitat months are what was actually documented, and collapsing
       the two would assert a record nobody published. */
    return o ? "flowers " + here + " here \\u00b7 documented " + wild + " in habitat"
             : "documented to flower " + wild + " in habitat";
  }`);

cut('flow-title-call',
  `        (restInFlower(cal, hm) ? " \\u00b7 " + restFlowerSays(cal) : "") +`,
  `        (restInFlower(cal, hm, south) ? " \\u00b7 " + restFlowerSays(cal, south) : "") +`);

cut('flow-hint-call',
  `      hint.textContent = restInFlower(cal, m)
        ? MONTH_FULL2[m] + " \\u00b7 " + restFlowerSays(cal)`,
  `      hint.textContent = restInFlower(cal, m, south)
        ? MONTH_FULL2[m] + " \\u00b7 " + restFlowerSays(cal, south)`);

/* 4. default the toggle to the native hemisphere, and say which it is */
cut('default-hemi',
  `    var south = false;
    try { south = localStorage.getItem(HEMI_KEY) === "S"; } catch (e) {}`,
  `    /* v84: DEFAULT TO THE SPECIES' OWN HEMISPHERE, so the page opens
       on the true documented months rather than on a six-month shift.
       A stored choice still wins — the toggle is about where the READER
       grows, and that does not change from species to species. */
    var south = !!cal.nativeSouth;
    try {
      var pref = localStorage.getItem(HEMI_KEY);
      if (pref === "S") south = true; else if (pref === "N") south = false;
    } catch (e) {}`);

cut('native-label',
  `    var top = el("div", "apclim-rest__top");
    top.appendChild(el("span", "apsc-clim__sub", "rest season"));
    top.appendChild(hemi);`,
  `    var top = el("div", "apclim-rest__top");
    top.appendChild(el("span", "apsc-clim__sub", "rest season"));
    top.appendChild(hemi);
    /* a chart that re-phases itself per species must say so */
    var nativeLine = el("div", "apclim-rest__native");`);

cut('native-draw',
  `      bN.setAttribute("aria-pressed", south ? "false" : "true");
      bS.setAttribute("aria-pressed", south ? "true" : "false");`,
  `      bN.setAttribute("aria-pressed", south ? "false" : "true");
      bS.setAttribute("aria-pressed", south ? "true" : "false");
      if (cal.hasLat){
        var nat = cal.nativeSouth ? "southern" : "northern";
        nativeLine.textContent = restShift(cal, south)
          ? "Native to the " + nat + " hemisphere \\u00b7 months shifted to yours"
          : "Native to the " + nat + " hemisphere";
      } else nativeLine.textContent = "";`);

cut('native-mount',
  `    wrap.appendChild(top);
    wrap.appendChild(chart);`,
  `    wrap.appendChild(top);
    wrap.appendChild(nativeLine);
    wrap.appendChild(chart);`);

/* ⚠ anchored on TWO lines: ".apclim-rest__hint{" alone matches twice,
   because v82 added an @supports fallback with the same selector. */
cut('native-css',
  `.apsc .apclim-rest__hint{
  color:rgba(243,241,234,.55);margin:3px 0 0;min-height:1.5em;`,
  `.apsc .apclim-rest__native{
  color:rgba(243,241,234,.42);margin:0 0 5px;letter-spacing:.02em;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  font-size:clamp(8px, 2.5cqw, 11px);
}
@supports not (font-size: 1cqw){ .apsc .apclim-rest__native{font-size:9px;} }
.apsc .apclim-rest__hint{
  color:rgba(243,241,234,.55);margin:3px 0 0;min-height:1.5em;`);

cut('stamp', '"card-v83-file-v101"', '"card-v84-file-v102"');
cut('banner', 'FILE VERSION: v101  (last updated 2026-08-17)',
             'FILE VERSION: v102  (last updated 2026-08-17)');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop() + '  ' + (s.length / 1024).toFixed(0) + ' KB');
