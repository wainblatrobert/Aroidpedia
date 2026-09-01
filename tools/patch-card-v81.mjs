/* Card v81 (FILE v99) — four changes asked for on 8.17.26.
   Master: Footer injection 8.17.26 v16.txt -> v17.txt

   1. carnosus catches Jan–Apr
   2. the callout is one line, one size, smaller
   3. hovering the curve explains what a month means
   4. the unexplained vertical grid lines go

   ⚠ CRLF master; ⚠ every anchor asserted. See patch-card-v80.mjs. */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.17.26 v16.txt';
const OUT = DIR + 'Footer injection 8.17.26 v17.txt';
let s = fs.readFileSync(SRC, 'utf8');
const edits = [];
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error(`ABORT: anchor "${name}" matched ${n} times, expected 1`); process.exit(1); }
  s = s.replace(f, () => r);
  edits.push(name);
}

/* ── 1. THE DRY LINE, not the cut ──────────────────────────────────
   The ask was "lower the cut so carnosus catches Jan–Apr". The cut is
   the wrong knob: the Andamans read 45 20 7 52 mm, and APRIL AT 52 mm
   is only just under the 60 mm line, so it scores 0.13 stress. Cut
   0.25 reaches Jan–Mar; Jan–Apr needs 0.13, which hands eleven other
   species a nine-month "season". Raising the dry line to 85 mm gets
   Jan–Apr at the unchanged cut, costs no long windows, and leaves the
   aseasonal count exactly where it was (127) — so nothing everwet was
   dragged into a season to buy it. */
cut('tuning',
  'var REST_TUNING = { DRY_MM: 60, COLD_HI: 18, COLD_LO: 8, CUT: 0.35, STRONG: 0.62 };',
  `var REST_TUNING = { DRY_MM: 85, COLD_HI: 18, COLD_LO: 8, CUT: 0.35, STRONG: 0.62,
                      MIN_WIN: 2 };
  /* MIN_WIN: a one-month "season" is noise, not phenology. Four species
     produced them at this dry line (Alocasia alba, and three DR Congo
     Amorphophallus whose driest month is 55 mm); they read better as
     no season at all than as a one-month dormancy claim. */`);

cut('min-window',
  `    var win = cued ? restRun(rest, CUT) : null;
    if (!win) { cued = false; cls = "ASEASONAL"; }`,
  `    var win = cued ? restRun(rest, CUT) : null;
    if (win && win.len < REST_TUNING.MIN_WIN) win = null;
    if (!win) { cued = false; cls = "ASEASONAL"; }`);

/* ── 2 + 3. the chart: no mystery lines, and hover says what it is ── */
cut('grid-to-hover',
  `    var grid = "";
    [0, 3, 6, 9].forEach(function(m){
      grid += '<line x1="' + (m * SLOT).toFixed(1) + '" y1="' + PADY2 + '" x2="' +
        (m * SLOT).toFixed(1) + '" y2="' + (H2 - PADY2) + '" stroke="rgba(243,241,234,.08)"/>';
    });`,
  `    /* ⚠ THE VERTICAL GRID LINES ARE GONE (v81). They marked Jan/Apr/
       Jul/Oct and meant nothing a reader could name — the month row
       already gives position, so they were decoration reading as data.
       An unexplained line in a data chart is a liability. */

    /* ── HOVER: every month says what it is ──────────────────────────
       One transparent rect per month, each carrying an SVG <title>, so
       the meaning is available on hover and to a screen reader without
       any script. The band alone could not do this: it says WHERE the
       season is but never what it means for the plant. */
    var MONTH_FULL = ["January","February","March","April","May","June","July",
                      "August","September","October","November","December"];
    function stateOf(m){
      if (cal.win){
        var st2 = south ? shiftM(cal.win.start, 6) : cal.win.start;
        for (var q = 0; q < cal.win.len; q++) if ((st2 + q) % 12 === m) return "lean";
      }
      if (cal.grow){
        var sg = south ? shiftM(cal.grow.start, 6) : cal.grow.start;
        for (var g = 0; g < cal.grow.len; g++) if ((sg + g) % 12 === m) return "grow";
      }
      return cal.cued ? "between" : "even";
    }
    function saysOf(st3){
      if (st3 === "lean") return "lean season — outdoors, the likeliest months to be dormant";
      if (st3 === "grow") return "growing season — the likeliest months to be in leaf";
      if (st3 === "between") return "between the two — neither clearly";
      return "no seasonal cue — wet and warm all year where it grows wild";
    }
    var hits = "";
    for (var hm = 0; hm < 12; hm++){
      hits += '<rect x="' + (hm * SLOT).toFixed(1) + '" y="' + PADY2 + '" width="' +
        SLOT.toFixed(1) + '" height="' + (H2 - 2 * PADY2) + '" fill="transparent">' +
        '<title>' + MONTH_FULL[hm] + " · " + saysOf(stateOf(hm)) + '</title></rect>';
    }`);

cut('svg-assembly',
  `      '</pattern></defs>' + grid + band +
      '<path d="' + d + '" fill="none" stroke="rgba(175,192,144,.85)" stroke-width="' +
      REST_LOOK.curveWidth + '" stroke-linecap="round" clip-path="url(#c' + uid + ')"/>' +
      months + '</svg>';`,
  `      '</pattern></defs>' + band +
      '<path d="' + d + '" fill="none" stroke="rgba(175,192,144,.85)" stroke-width="' +
      REST_LOOK.curveWidth + '" stroke-linecap="round" clip-path="url(#c' + uid + ')"/>' +
      months + hits + '</svg>';   /* hits LAST so they take the hover */`);

/* ── the N/S buttons ── */
cut('hemi-labels',
  `    bN.title = "Northern hemisphere"; bS.title = "Southern hemisphere";`,
  `    /* v81: title alone was not enough — a native tooltip waits about a
       second and is easy to miss. aria-label carries it to assistive
       tech, and the wrapper is labelled so the pair reads as a choice
       rather than two loose letters. */
    bN.title = "Northern hemisphere"; bS.title = "Southern hemisphere";
    bN.setAttribute("aria-label", "Northern hemisphere");
    bS.setAttribute("aria-label", "Southern hemisphere");
    hemi.setAttribute("role", "group");
    hemi.setAttribute("aria-label", "Hemisphere");`);

/* ── 4. the callout on one line ───────────────────────────────────── */
cut('head-css',
  `.apsc .apclim-rest__head{margin:7px 0 0;color:var(--accent);font-size:15px;line-height:1.35;}
.apsc .apclim-rest__head b{font-weight:600;}`,
  `/* ⚠ ONE LINE, ONE SIZE, SIZED TO THE CONTAINER — NOT THE VIEWPORT.
   The callout runs ~432 px at 15 px, and the panel is only 301 px wide
   at a 1280 viewport (the card goes two-column there), so it wrapped
   to two lines on desktop while fitting on a phone. A vw-based clamp
   would have read the WRONG box for exactly that reason; cqw measures
   the panel itself. Both halves are now one size — only weight
   separates them. */
.apsc .apclim-rest{container-type:inline-size;}
.apsc .apclim-rest__head{
  margin:7px 0 0;color:var(--accent);line-height:1.4;
  white-space:nowrap;font-size:clamp(9.5px, 3.3cqw, 13px);
}
.apsc .apclim-rest__head b{font-weight:600;}
/* no container-query support: fall back to a size that fits the
   narrowest panel rather than to a wrapped headline */
@supports not (font-size: 1cqw){
  .apsc .apclim-rest__head{font-size:10px;}
}`);

cut('grow-css',
  `.apsc .apclim-rest__grow{color:rgba(243,241,234,.8);font-weight:400;}`,
  `.apsc .apclim-rest__grow{color:rgba(243,241,234,.8);font-weight:400;}
.apsc .apclim-rest__hemi button{cursor:pointer;}`);

cut('head-media',
  `@media (max-width:640px){
  .apsc .apclim-rest__head{font-size:14px;}
}`,
  `/* the old max-width override is gone: it fought the container clamp,
   and the phone is not the narrow case here — the two-column desktop
   panel is. */`);

/* ── versions ── */
cut('stamp', '"card-v80-file-v98"', '"card-v81-file-v99"');
cut('banner', 'FILE VERSION: v98  (last updated 2026-08-17)',
             'FILE VERSION: v99  (last updated 2026-08-17)');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits applied: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop() + '  ' + (s.length / 1024).toFixed(0) + ' KB');
