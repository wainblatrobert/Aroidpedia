/* Card v82 (FILE v100) — 8.17.26, four fixes.
   Master: Footer injection 8.17.26 v17.txt -> v18.txt

   1. HOVER DID NOT WORK. The month rects were fill="transparent" with
      no pointer-events, inside an svg carrying role="img" — which tells
      the browser to treat the whole graphic as ONE atomic image, so
      child <title> tooltips never fire. Native tooltips are also slow
      and undiscoverable, so this now uses the SAME mechanism the
      temperature chart already has (.apclim-col columns + a readout)
      and keeps <title> only as the assistive-tech fallback.

   2. THE MONTHS DID NOT LINE UP. bandChart uses a 300-unit viewBox,
      padL 26 / padR 4, months anchored AT the ends (x = padL + m*step).
      The rest chart used a 560-unit box with months at SLOT CENTRES.
      Two different coordinate systems cannot align. Both charts now
      share bandChart's geometry exactly.
      ⚠ Every tuned LOOK value is rescaled by 300/560 = 0.5357 so the
      RENDERED sizes are unchanged: hatch 6.5 -> 3.48 units still draws
      3.49 px at a 301 px panel, curve 3.25 -> 1.74, height 112 -> 60.
      Do not "round" these back up.

   3. NO CURRENT-MONTH LINE. Added, reusing .apclim-now and
      .apclim-mlab--now so it is the same hairline the temp chart draws.

   4. Month labels now use .apclim-mlab, so they match the temp chart's
      size and colour instead of approximating them.                  */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.17.26 v17.txt';
const OUT = DIR + 'Footer injection 8.17.26 v18.txt';
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
/* replace a whole span between two unique markers, inclusive */
function span(name, startMark, endMark, repl) {
  const a = toCRLF(startMark), b = toCRLF(endMark);
  const i = s.indexOf(a);
  if (i < 0 || s.indexOf(a, i + 1) >= 0) { console.error(`ABORT: "${name}" start marker not unique`); process.exit(1); }
  const j = s.indexOf(b, i);
  if (j < 0) { console.error(`ABORT: "${name}" end marker not found`); process.exit(1); }
  s = s.slice(0, i) + toCRLF(repl) + s.slice(j + b.length);
  edits.push(name);
}

/* ── LOOK rescaled into bandChart's 300-unit space ── */
cut('look',
  `  var REST_LOOK = { hatchSize: 6.5, hatchDensity: 1.1, hatchAngle: -45,
                    hatchAlpha: 0.65, bandTint: 0.11, curveWidth: 3.25, height: 112 };`,
  `  /* ⚠ IN bandChart's 300-UNIT SPACE, NOT 560. The values the grower
     tuned were set in a 560-unit viewBox; each is scaled by 300/560 =
     0.5357 so what renders on screen is IDENTICAL and the two charts
     share one coordinate system. 6.5 -> 3.48 still draws 3.49 px in a
     301 px panel. Do not round these back to neat numbers. */
  var REST_LOOK = { hatchSize: 3.48, hatchDensity: 1.1, hatchAngle: -45,
                    hatchAlpha: 0.65, bandTint: 0.11, curveWidth: 1.74, height: 60 };`);

/* ── the chart, rebuilt on bandChart's geometry ── */
span('restChart',
  '  function restChart(cal, south){',
  "      months + hits + '</svg>';   /* hits LAST so they take the hover */\r\n  }",
`  /* Geometry is bandChart's, exactly: same viewBox, same padding, same
     x() — so a month sits at the same screen column in both charts and
     the eye can run straight down. */
  function restChart(cal, south){
    var W2 = 300, PADL = 26, PADR = 4, TOP = 5, BOT = 49, H2 = REST_LOOK.height;
    var uid = "r" + (restChart.n = (restChart.n || 0) + 1);
    var STEP = (W2 - PADL - PADR) / 11;
    function xm(m){ return +(PADL + m * STEP).toFixed(2); }
    /* rest[] is an ABSOLUTE stress, so no amplitude rescaling: a flat
       species draws flat because its numbers are flat. */
    function yOf(v){ return +(BOT - (BOT - TOP) * v).toFixed(2); }
    var y = cal.rest.map(function(r){ return 0.06 + 0.88 * Math.min(1, r); });
    function at(i){ return [xm(i), yOf(y[((i % 12) + 12) % 12])]; }
    /* the curve is still drawn through wrapped neighbours (-2..13) so
       the Dec->Jan slope is continuous; it is clipped to the plot, and
       the two visible ends are genuinely January and December, exactly
       as the temperature chart's are. */
    var d = "M" + at(-2)[0] + " " + at(-2)[1];
    for (var i = -2; i < 13; i++){
      var p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      d += "C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(2) + " " +
                 (p1[1] + (p2[1] - p0[1]) / 6).toFixed(2) + "," +
                 (p2[0] - (p3[0] - p1[0]) / 6).toFixed(2) + " " +
                 (p2[1] - (p3[1] - p1[1]) / 6).toFixed(2) + "," +
                 p2[0] + " " + p2[1];
    }
    var words = !cal.cued ? ["", ""]
              : cal.driver === "cold" ? ["cool", "cool"]
              : cal.driver === "dry" ? ["dry", "dry"] : ["dry", "cool"];
    /* the tile follows WORD LENGTH — a flat multiplier was calibrated
       for a three-letter word and made "cool" overlap. */
    var chars = Math.max(words[0].length, words[1].length) || 3;
    var tw = (1.1667 * chars * REST_LOOK.hatchSize) / REST_LOOK.hatchDensity;
    var th = (1.25 * REST_LOOK.hatchSize) / REST_LOOK.hatchDensity;
    function hatchText(x, yy, w){
      return '<text x="' + x.toFixed(2) + '" y="' + yy.toFixed(2) + '" font-size="' +
        REST_LOOK.hatchSize + '" font-family="Helvetica Neue, Helvetica, Arial" ' +
        'fill="rgba(175,192,144,' + REST_LOOK.hatchAlpha + ')">' + w + '</text>';
    }
    /* ⚠ NOTHING is drawn when there is no lean season: a full-width
       fill is the SAME MARK as the lean band and would read as "the
       whole year is lean" — the opposite of the finding. */
    var band = "";
    function monthsInWin(w){
      var out = [], st = south ? shiftM(w.start, 6) : w.start;
      for (var q = 0; q < w.len; q++) out.push((st + q) % 12);
      return out;
    }
    if (cal.win){
      monthsInWin(cal.win).forEach(function(m){
        var x0 = Math.max(PADL, xm(m) - STEP / 2);
        var x1 = Math.min(W2 - PADR, xm(m) + STEP / 2);
        var w = (x1 - x0).toFixed(2);
        band += '<rect x="' + x0.toFixed(2) + '" y="' + TOP + '" width="' + w +
          '" height="' + (BOT - TOP) + '" fill="rgba(175,192,144,' + REST_LOOK.bandTint + ')"/>' +
          '<rect x="' + x0.toFixed(2) + '" y="' + TOP + '" width="' + w +
          '" height="' + (BOT - TOP) + '" fill="url(#p' + uid + ')"/>';
      });
    }
    /* v82: the current-month hairline, the same one bandChart draws */
    var now = new Date().getMonth();
    var nowLine = '<line class="apclim-now" x1="' + xm(now) + '" y1="' + TOP +
                  '" x2="' + xm(now) + '" y2="' + BOT + '"/>';
    /* month labels use the temp chart's own class, so size and colour
       match instead of approximating */
    var months = "";
    for (var mm = 0; mm < 12; mm++){
      months += '<text class="apclim-mlab' + (mm === now ? " apclim-mlab--now" : "") +
        '" x="' + xm(mm) + '" y="' + (H2 - 3) + '" text-anchor="middle">' +
        MON[mm].charAt(0) + '</text>';
    }
    /* ── HOVER ────────────────────────────────────────────────────────
       .apclim-col is the temperature chart's own hover column, reused
       so behaviour is identical. <title> stays for assistive tech, but
       the readout below the chart is what a reader actually sees —
       a native tooltip waits about a second and is easy to miss. */
    var MONTH_FULL = ["January","February","March","April","May","June","July",
                      "August","September","October","November","December"];
    var leanSet = cal.win ? monthsInWin(cal.win) : [];
    var growSet = cal.grow ? monthsInWin(cal.grow) : [];
    function stateOf(m){
      if (leanSet.indexOf(m) >= 0) return "lean";
      if (growSet.indexOf(m) >= 0) return "grow";
      return cal.cued ? "between" : "even";
    }
    var hits = "";
    for (var hm = 0; hm < 12; hm++){
      var cx0 = Math.max(PADL, Math.min(W2 - PADR - STEP, xm(hm) - STEP / 2));
      hits += '<rect class="apclim-col" data-m="' + hm + '" x="' + cx0.toFixed(2) +
        '" y="0" width="' + STEP.toFixed(2) + '" height="' + H2 + '">' +
        '<title>' + MONTH_FULL[hm] + " \\u00b7 " + restSays(stateOf(hm)) + '</title></rect>';
    }
    /* ⚠ NO role="img" HERE. It marks the graphic as one atomic image and
       is why the first attempt's child tooltips never fired. */
    return '<svg viewBox="0 0 ' + W2 + ' ' + H2 + '" aria-label="' +
      (cal.win ? "Rest season through the year" : "No lean season") + '">' +
      '<defs><clipPath id="c' + uid + '"><rect x="' + PADL + '" y="0" width="' +
      (W2 - PADL - PADR) + '" height="' + H2 + '"/></clipPath>' +
      '<pattern id="p' + uid + '" width="' + tw.toFixed(2) + '" height="' + th.toFixed(2) +
      '" patternUnits="userSpaceOnUse" patternTransform="rotate(' + REST_LOOK.hatchAngle + ')">' +
      hatchText(0, th * 0.46, words[0]) + hatchText(tw / 2, th * 0.96, words[1]) +
      '</pattern></defs>' + band + nowLine +
      '<path d="' + d + '" fill="none" stroke="rgba(175,192,144,.85)" stroke-width="' +
      REST_LOOK.curveWidth + '" stroke-linecap="round" clip-path="url(#c' + uid + ')"/>' +
      months + hits + '</svg>';   /* hits LAST so they take the hover */
  }

  /* what a month means, in words — shared by the tooltip and the readout */
  function restSays(st){
    if (st === "lean") return "lean season \\u2014 outdoors, the likeliest months to be dormant";
    if (st === "grow") return "growing season \\u2014 the likeliest months to be in leaf";
    if (st === "between") return "between the two \\u2014 neither clearly";
    return "no seasonal cue \\u2014 wet and warm all year where it grows wild";
  }
  function restStateOf(cal, m, south){
    function inWin(w){
      if (!w) return false;
      var st = south ? shiftM(w.start, 6) : w.start;
      for (var q = 0; q < w.len; q++) if ((st + q) % 12 === m) return true;
      return false;
    }
    if (inWin(cal.win)) return "lean";
    if (inWin(cal.grow)) return "grow";
    return cal.cued ? "between" : "even";
  }`);

/* ── the readout, wired to the columns ── */
cut('readout',
  `    var chart = el("div", "apclim-rest__chart");`,
  `    var chart = el("div", "apclim-rest__chart");
    var hint = el("div", "apclim-rest__hint");`);

cut('hint-mount',
  `    wrap.appendChild(chart);
    wrap.appendChild(head);`,
  `    wrap.appendChild(chart);
    wrap.appendChild(hint);
    wrap.appendChild(head);`);

cut('wire',
  `    function draw(){
      var p = restPhrase(cal, south);
      chart.innerHTML = restChart(cal, south);`,
  `    var MONTH_FULL2 = ["January","February","March","April","May","June","July",
                       "August","September","October","November","December"];
    function setHint(m){
      hint.textContent = MONTH_FULL2[m] + " \\u00b7 " + restSays(restStateOf(cal, m, south));
    }
    function draw(){
      var p = restPhrase(cal, south);
      chart.innerHTML = restChart(cal, south);
      /* the readout defaults to THIS month rather than sitting empty —
         a reader who never hovers still learns where the plant is now,
         and the row cannot jump height when a hover starts. */
      var nowM = new Date().getMonth();
      setHint(nowM);
      var cols = chart.querySelectorAll(".apclim-col");
      [].forEach.call(cols, function(c){
        var m = +c.getAttribute("data-m");
        c.addEventListener("mouseenter", function(){ setHint(m); });
        c.addEventListener("focus", function(){ setHint(m); });
      });
      chart.addEventListener("mouseleave", function(){ setHint(nowM); });`);

cut('hint-css',
  `.apsc .apclim-rest__body{font-size:13px;color:rgba(243,241,234,.72);margin:2px 0 0;}`,
  `.apsc .apclim-rest__hint{
  font-size:11.5px;color:rgba(243,241,234,.55);margin:3px 0 0;min-height:1.5em;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.apsc .apclim-col{fill:transparent;pointer-events:all;cursor:default;}
.apsc .apclim-rest__body{font-size:13px;color:rgba(243,241,234,.72);margin:2px 0 0;}`);

cut('stamp', '"card-v81-file-v99"', '"card-v82-file-v100"');
cut('banner', 'FILE VERSION: v99  (last updated 2026-08-17)',
             'FILE VERSION: v100  (last updated 2026-08-17)');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop() + '  ' + (s.length / 1024).toFixed(0) + ' KB');
