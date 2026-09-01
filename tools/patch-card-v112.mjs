/* Card v112 (FILE v130) — two grower requests, both about height.
   Master: Footer injection 8.20.26 v1.txt -> v2.txt

   ⚠ BUILT ON 8.20.26 v1, NOT on the 8.19.26 series. Another lane
   shipped card v111 (height-controlled story plates) on top of my
   v128 and renamed the master to a new date series. The highest
   8.19.26 number is now STALE. Verified before writing: 8.20.26 v1
   stamps card-v111-file-v129, matches the deployed bundle, and still
   carries the Ghana SUBPARENT block and the -XX keys.

   1. NO LEAN SEASON -> NO CHART. On an everwet species (julaihii,
      gigas, beccarii) the calendar draws a flat line and says "No
      lean season". The line carries no information: there is no
      trough to point at, the hatch band never appears, and the
      hemisphere toggle shifts months that mean nothing. The SENTENCE
      is still worth having — "its wild range never dries out … so the
      weather never signals a rest" is the answer to the question a
      grower came with — so the text stays and only the graphic goes.
      Dropped with it: the hover readout (nothing to hover), the N/S
      toggle (nothing to re-phase) and the native-hemisphere line
      (it exists to explain that re-phasing).

      ⚠ AND THE COLLAPSE GOES WITH IT. data-apclim-collapse was set
      for the whole genus to buy room for the calendar. With no
      calendar there is nothing to buy room for, so those pages get
      BOTH monthly charts back instead of paying a toggle for a chart
      that is not there.

   2. A LONG ECOLOGY NOW TRIGGERS THE COLLAPSE. Reported on Alocasia
      baginda: with a long ecology note the panel outgrows the
      viewport and the temperature chart is clipped by the sticky
      panel above it — measured, and visible in a screenshot as the
      100% gridline sliced in half.

      ⚠⚠ THE RULE COMPARES TWO MEASURED QUANTITIES, NOT A MAGIC
      NUMBER. `extra` = everything in the panel that is not the
      climate block (i.e. the ecology note). `frees` = what collapsing
      would actually reclaim, read off the .apsc-clim__h elements.
      Collapse when extra > frees: the panel is carrying more added
      content than the trade can recover, so the trade is worth
      making. On real pages that is baginda/cuprea at 262px against
      152px freed, while acuminata (89), scabriuscula (110) and ten
      others stay open. Nothing invented; if the layout changes, both
      sides of the comparison move with it.

      ⚠ MEASURED AFTER LAYOUT, ON A rAF. offsetHeight is used rather
      than getBoundingClientRect because the follow panel above is
      sticky and its rect height genuinely changes as you scroll
      (648 -> 332 on baginda) — a rule reading that would flip
      depending on where the reader happened to be.                 */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.20.26 v1.txt';
const OUT = DIR + 'Footer injection 8.20.26 v2.txt';
let s = fs.readFileSync(SRC, 'utf8');
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
const edits = [];
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error('ABORT: "' + name + '" matched ' + n + ', expected 1'); process.exit(1); }
  s = s.replace(f, () => r);
  edits.push(name);
}

/* ── 1a. buildRest: omit the graphic when there is no cue ── */
cut('rest-no-chart',
`    wrap.appendChild(nativeLine);
    wrap.appendChild(chart);
    wrap.appendChild(hint);
    wrap.appendChild(head);`,
`    /* v112: NO CUE, NO GRAPHIC. A flat line with no trough, no hatch
       band and a hemisphere toggle that re-phases nothing is decoration
       -- the sentence below carries the whole finding. The native line
       goes too: it exists only to explain a re-phasing that no longer
       happens here. */
    if (cal.cued){
      wrap.appendChild(nativeLine);
      wrap.appendChild(chart);
      wrap.appendChild(hint);
    }
    wrap.appendChild(head);`);

cut('rest-no-toggle',
`    top.appendChild(topLabel);
    top.appendChild(hemi);`,
`    top.appendChild(topLabel);
    if (cal.cued) top.appendChild(hemi);`);

/* draw() touches chart/hint/hemi unconditionally; guard the parts that
   only exist when there is a cue */
cut('draw-guard',
`    function draw(){
      var p = restPhrase(cal, south);
      chart.innerHTML = restChart(cal, south);`,
`    function draw(){
      var p = restPhrase(cal, south);
      /* v112: with no cue the chart is never inserted, so skip every
         step that reads it -- innerHTML on a detached node is harmless
         but the hover wiring below would silently do nothing and the
         cost is a full SVG build per redraw for a graphic nobody sees. */
      if (!cal.cued){
        head.innerHTML = "";
        head.appendChild(el("b", "", p.lean));
        head.appendChild(el("span", "apclim-rest__bar", "|"));
        head.appendChild(el("span", "apclim-rest__grow", p.grow));
        body.textContent = p.body;
        return;
      }
      chart.innerHTML = restChart(cal, south);`);

/* ── 1b. buildRow: only pay the collapse when a calendar is drawn ── */
cut('collapse-only-when-charted',
`    var zonesTarget = null;
    if (restCal){
      box.setAttribute("data-apclim-collapse", "1");`,
`    var zonesTarget = null;
    if (restCal){
      /* v112: the collapse bought room for the CALENDAR. An everwet
         species draws no calendar, so it should not pay the toggle --
         those pages get both monthly charts back. */
      if (restCal.cued) box.setAttribute("data-apclim-collapse", "1");`);

/* ── 2. measured collapse for a tall panel ── */
cut('height-collapse-fn',
`  function buildRow(res, version, placeCount, forCultivar, fellBackTo, restCal){`,
`  /* v112: A LONG ECOLOGY NOTE COLLAPSES THE CHARTS.
     Reported on Alocasia baginda: the panel outgrows the viewport and
     the sticky follow panel clips the top of the temperature chart.

     ⚠ TWO MEASURED QUANTITIES, NO MAGIC NUMBER. \`extra\` is whatever
     shares the panel with the climate block (the ecology note);
     \`frees\` is what collapsing actually reclaims, read off the
     .apsc-clim__h elements themselves. Collapse when the panel is
     carrying more added content than the trade can recover. Both
     sides move if the layout changes, so this cannot drift into a
     stale constant.

     ⚠ offsetHeight, NOT getBoundingClientRect: the follow panel above
     is sticky and its rect height really does change with scroll
     (648 -> 332 on baginda), which would make the rule depend on
     where the reader is standing. */
  function fitCollapse(box){
    if (!box || box.getAttribute("data-apclim-collapse") === "1") return;
    var host = box.closest ? box.closest(".apsc-facts") : null;
    var climFact = box.closest ? box.closest(".apsc-fact") : null;
    if (!host || !climFact) return;
    var extra = 0;
    [].slice.call(host.children).forEach(function(c){
      if (c !== climFact) extra += c.offsetHeight || 0;
    });
    var frees = 0;
    [].slice.call(box.querySelectorAll(".apsc-clim__h")).forEach(function(e){
      frees += e.offsetHeight || 0;
    });
    if (frees > 0 && extra > frees) box.setAttribute("data-apclim-collapse", "1");
  }

  function buildRow(res, version, placeCount, forCultivar, fellBackTo, restCal){`);

cut('height-collapse-call',
`        if (window.console && console.info){
          console.info("[climate range] climate.json v" + (cd.version || "?") + " · " +`,
`        /* measured after the browser has laid the panel out - before
           that every offsetHeight is 0 and the rule would never fire */
        if (window.requestAnimationFrame){
          requestAnimationFrame(function(){
            requestAnimationFrame(function(){
              fitCollapse(built.row.querySelector(".apsc-clim"));
            });
          });
        }
        if (window.console && console.info){
          console.info("[climate range] climate.json v" + (cd.version || "?") + " · " +`);

cut('stamp', '"card-v111-file-v129"', '"card-v112-file-v130"');
cut('banner', 'FILE VERSION: v129', 'FILE VERSION: v130');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
