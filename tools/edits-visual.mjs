/* The v6 (FILE v19) edit list, shared by apply-visual.mjs (builds the
   file) and verify-visual.mjs (splices the same edits into the served
   page). SPECIES CARD v16 -> v17, CLIMATE RANGE v2 -> v3. */
export const EDITS = [

/* ---- file header ---- */
[`FILE VERSION: v18  (last updated 2026-08-09; SPECIES CARD v16 -`,
`FILE VERSION: v19  (last updated 2026-08-09; SPECIES CARD v17 +
     CLIMATE RANGE v3 - the visual pass: typical-day band inside the
     temperature envelope, current-month marker on both charts, chart
     labels legible, one-line provenance note, photo-tile hover
     captions + designed loading state, protologue micro-label.
     Previously SPECIES CARD v16 -`],

/* ---- TOC ---- */
[`       "SPECIES CARD  (v16)"`,
`       "SPECIES CARD  (v17)"`],
[`       "CLIMATE RANGE  (v2)"`,
`       "CLIMATE RANGE  (v3)"`],

/* ---- species card block header ---- */
[`     AROIDPEDIA · SPECIES CARD  v16  —  8.9.26
     (v16: the CLIMATE prose row is retired`,
`     AROIDPEDIA · SPECIES CARD  v17  —  8.9.26
     (v17: the visual pass — photo tiles carry their caption on hover
     and a designed waiting state (panel tone + inset hairline) while
     lazy images load, and the protologue thumbnails get a micro-label
     so the lone stamp reads as intentional. v16: the CLIMATE prose
     row is retired`],

/* ---- plates label (JS) ---- */
[`    var plates = origImgs.filter(function(i){ return i !== hero; });
    if (plates.length){
      var pw = el("div","apsc-plates");`,
`    var plates = origImgs.filter(function(i){ return i !== hero; });
    if (plates.length){
      /* v17: the stamp-sized thumbnails read as an orphan without a
         name; same 8px mono caps as every other micro-label */
      fig.appendChild(el("div","apsc-plates__label","Protologue"));
      var pw = el("div","apsc-plates");`],

/* ---- photoStrip captions (JS) ---- */
[`      b.appendChild(img);
      b.addEventListener("click", function(){ lb.open(images, i); });
      g.appendChild(b);`,
`      b.appendChild(img);
      /* v17: the caption was lightbox-only; its first line surfaces
         on hover/focus so the grid reads as documented specimens.
         Touch users still get the full caption in the lightbox. */
      if (im.cap){
        var cap = el("span","apsc-strip__cap", im.cap);
        cap.title = im.cap;
        b.appendChild(cap);
      }
      b.addEventListener("click", function(){ lb.open(images, i); });
      g.appendChild(b);`],

/* ---- strip CSS: waiting state + caption ---- */
[`.apsc-strip button{
  padding:0;border:0;background:var(--panel);cursor:zoom-in;line-height:0;
  border-radius:2px;overflow:hidden;aspect-ratio:1;
}`,
`.apsc-strip button{
  padding:0;border:0;background:var(--panel);cursor:zoom-in;line-height:0;
  border-radius:2px;overflow:hidden;aspect-ratio:1;
  /* v17: while a lazy image is still loading the tile used to be a
     void; the panel tone + inset hairline make waiting look designed */
  position:relative;
  box-shadow:inset 0 0 0 1px var(--rule-soft);
}`],
[`.apsc-strip button:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}`,
`.apsc-strip button:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
/* v17: hover caption — one line, solid film (no gradients on this site) */
.apsc-strip__cap{
  position:absolute;left:0;right:0;bottom:0;
  padding:6px 8px;background:rgba(11,18,13,.85);
  font-family:var(--body);font-size:10.5px;line-height:1.35;color:var(--dim);
  text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  opacity:0;transition:opacity .18s ease;pointer-events:none;
}
.apsc-strip button:hover .apsc-strip__cap,
.apsc-strip button:focus-visible .apsc-strip__cap{opacity:1;}`],

/* ---- plates CSS: label + tightened gap ---- */
[`.apsc-plates{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;}`,
`.apsc-plates__label{
  margin-top:14px;font-family:var(--mono);font-size:8.5px;
  letter-spacing:.22em;text-transform:uppercase;color:var(--dimmer);
}
.apsc-plates{display:flex;gap:10px;margin-top:6px;flex-wrap:wrap;}`],

/* ---- climate block header ---- */
[`     AROIDPEDIA · CLIMATE RANGE  v2  —  8.9.26`,
`     AROIDPEDIA · CLIMATE RANGE  v3  —  8.9.26
     ------------------------------------------------------------------
     v3 (same day): the visual pass. A TYPICAL-DAY band (tnMed/txMed,
     shipped since data 1.0.0 — median across places of each place's
     median-pixel day) draws inside the temperature envelope, so a
     normal day and the range edges are two different statements. A
     hairline marks the CURRENT MONTH on both charts and lights its
     month letter. Chart labels step up to 8px/7.5px in --dim. The
     provenance note becomes one ellipsised line (full text stays in
     its tooltip). Deliberately NOT drawn: a 50 °F reference line —
     the warm clip is a display statistic, not a biological threshold;
     tubers survive freezes buried and mulched (user ruling 8.9.26).`],

/* ---- climate CSS: bands, now-line, label sizes, note ---- */
[`.apsc .apclim-band--t{fill:rgba(175,192,144,.16);}`,
`.apsc .apclim-band--t{fill:rgba(175,192,144,.16);}
.apsc .apclim-band--t-in{fill:rgba(175,192,144,.26);}`],
[`.apsc .apclim-ylab{font-size:7px;fill:var(--dimmer);}
.apsc .apclim-mlab{font-size:6.5px;fill:var(--dimmer);}`,
`.apsc .apclim-ylab{font-size:8px;fill:var(--dim);}
.apsc .apclim-mlab{font-size:7.5px;fill:var(--dim);}
.apsc .apclim-mlab--now{fill:var(--accent);}
.apsc .apclim-now{stroke:rgba(243,241,234,.22);stroke-width:1;}`],
[`.apsc .apsc-clim__note{
  font-family:var(--mono);font-size:8px;letter-spacing:.06em;
  color:var(--dimmer);line-height:1.7;cursor:help;
}`,
`.apsc .apsc-clim__note{
  font-family:var(--mono);font-size:8px;letter-spacing:.06em;
  color:var(--dimmer);line-height:1.7;cursor:help;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}`],

/* ---- climate JS: typical-day aggregation ---- */
[`    var agg = { tnLo:[], txHi:[], rhLo:[], rhHi:[] };
    for (var m = 0; m < 12; m++){
      agg.tnLo.push(nth(chosen.map(function(v){ return v.tnLo[m]; }), false));
      agg.txHi.push(nth(chosen.map(function(v){ return v.txHi[m]; }), true));`,
`    function med(vals){
      var a = vals.slice().sort(function(x, y){ return x - y; });
      var h = a.length >> 1;
      return a.length % 2 ? a[h] : (a[h - 1] + a[h]) / 2;
    }
    var agg = { tnLo:[], txHi:[], tnMed:[], txMed:[], rhLo:[], rhHi:[] };
    for (var m = 0; m < 12; m++){
      agg.tnLo.push(nth(chosen.map(function(v){ return v.tnLo[m]; }), false));
      agg.txHi.push(nth(chosen.map(function(v){ return v.txHi[m]; }), true));
      /* v3: the typical-day band — the MEDIAN across places of each
         place's median-pixel day. Extremes corroborate; typicals
         average out. Works on every climate.json since 1.0.0. */
      agg.tnMed.push(med(chosen.map(function(v){ return v.tnMed[m]; })));
      agg.txMed.push(med(chosen.map(function(v){ return v.txMed[m]; })));`],

/* ---- climate JS: bandChart gains opts (inner band + now marker) ---- */
[`  function bandChart(lo, hi, domainMin, domainMax, fmt, css, label){
    var W = 300, H = 84, padL = 26, padR = 4, top = 6, bot = 70;`,
`  function bandChart(lo, hi, domainMin, domainMax, fmt, css, label, opts){
    opts = opts || {};
    var W = 300, H = 84, padL = 26, padR = 4, top = 6, bot = 70;`],
[`    var months = "";
    for (i = 0; i < 12; i++){
      months += '<text class="apclim-mlab" x="' + x(i) + '" y="' + (H - 3) + '" text-anchor="middle">' + MONTHS[i].charAt(0) + "</text>";
    }`,
`    /* v3: typical-day band inside the envelope */
    var inner = "";
    if (opts.inLo && opts.inHi){
      var iu = [], idn = [];
      for (i = 0; i < 12; i++) iu.push(x(i) + "," + y(opts.inHi[i]));
      for (i = 11; i >= 0; i--) idn.push(x(i) + "," + y(opts.inLo[i]));
      inner = '<polygon class="apclim-band--' + css + '-in" points="' + iu.join(" ") + " " + idn.join(" ") + '"/>';
    }
    /* v3: hairline at the current month, so "now" is findable */
    var nowLine = "";
    if (typeof opts.now === "number"){
      var nx = x(opts.now);
      nowLine = '<line class="apclim-now" x1="' + nx + '" y1="' + top + '" x2="' + nx + '" y2="' + bot + '"/>';
    }
    var months = "";
    for (i = 0; i < 12; i++){
      months += '<text class="apclim-mlab' + (i === opts.now ? " apclim-mlab--now" : "") + '" x="' + x(i) + '" y="' + (H - 3) + '" text-anchor="middle">' + MONTHS[i].charAt(0) + "</text>";
    }`],
[`    svg.innerHTML =
      g +
      '<polygon class="apclim-band--' + css + '" points="' + up.join(" ") + " " + down.join(" ") + '"/>' +
      '<polyline class="apclim-edge--' + css + '" points="' + up.join(" ") + '"/>' +`,
`    svg.innerHTML =
      g +
      '<polygon class="apclim-band--' + css + '" points="' + up.join(" ") + " " + down.join(" ") + '"/>' +
      inner + nowLine +
      '<polyline class="apclim-edge--' + css + '" points="' + up.join(" ") + '"/>' +`],

/* ---- climate JS: wire the opts through render ---- */
[`    var unit = "F";
    try { unit = localStorage.getItem(UNIT_KEY) === "C" ? "C" : "F"; } catch (e) {}`,
`    var unit = "F";
    try { unit = localStorage.getItem(UNIT_KEY) === "C" ? "C" : "F"; } catch (e) {}
    var NOW = new Date().getMonth();`],
[`      var svgT = bandChart(
        a.tnLo.map(conv), a.txHi.map(conv), d[0], d[1],
        function(v){ return Math.round(v) + "°"; },
        "t", "Monthly temperature range, " + tempStr(yTn, yTx, unit));`,
`      var svgT = bandChart(
        a.tnLo.map(conv), a.txHi.map(conv), d[0], d[1],
        function(v){ return Math.round(v) + "°"; },
        "t", "Monthly temperature range, " + tempStr(yTn, yTx, unit),
        { inLo: a.tnMed.map(conv), inHi: a.txMed.map(conv), now: NOW });`],
[`      var svgH = bandChart(
        a.rhLo, a.rhHi, 0, 100,
        function(v){ return v + "%"; },
        "h", "Monthly humidity range, " + yRl + " to " + yRh + " percent");`,
`      var svgH = bandChart(
        a.rhLo, a.rhHi, 0, 100,
        function(v){ return v + "%"; },
        "h", "Monthly humidity range, " + yRl + " to " + yRh + " percent",
        { now: NOW });`]
];
