/* Card v117 (FILE v138) — BORNEO READS AT THREE DEPTHS.
   Master: Footer injection 8.20.26 v9.txt -> v10.txt

   Grower request: on Borneo a post tagged to a division should give
   the strongest fill, the unit above it a lighter one, and the ISLAND
   the lightest — with the rest of the map unfilled.

   Today the map has exactly TWO depths. Measured on live posts:
     A. baginda  (Indonesia · Borneo · East Kalimantan)
        East Kalimantan .82   Kalimantan .16   Borneo NOTHING
   Borneo only takes a wash when it is the DIRECT parent of a lit unit
   (A. princeps, where Sarawak/Sabah/Brunei are lit). A grandparent
   gets nothing, which is why the island goes blank on baginda.

   ⚠⚠ WHY THIS IS NOT JUST "WASH EVERY ANCESTOR". The wash deliberately
   picks a MINIMAL COVERING SET, and the reason is in the source:
   "Never every ancestor: two translucent fills over the same ground
   stack into a third tone." A child sits INSIDE its parent, so the
   fills overlap and alpha-composite. Today .16 under .82 already
   lands at .849; adding a third layer naively would drag the middle
   tone from .16 to .23 and the island would read as lit.

   ⚠⚠ SO THE OPACITIES ARE COMPENSATED, NOT STACKED BY EYE. Solving
   c(n) = c(n-1) + (1-c(n-1))·p for the painted value p gives:

       target composite      paint
       island   0.070        0.0700
       parent   0.160        0.0968
       lit      0.820        0.7857

   which re-composites to exactly 0.070 / 0.160 / 0.820. The ends
   therefore look identical to today; only the island is new. This is
   background-agnostic — no precomputed tints, so a theme change
   cannot break it.

   ⚠ AND PAINT ORDER HAD TO BE FORCED. apsc-ctx and apsc-on are
   appended to the svg as the shape loop meets them, i.e. in FEED
   order, which does not guarantee island-then-parent-then-leaf. With
   compensated opacities the order is load-bearing, so the three
   classes are re-appended in depth order after the loop. appendChild
   MOVES an existing node, so this reorders without cloning.

   ⚠ BORNEO ONLY, per the request. The compensation rides on a
   .apsc-tri class that is only set when the island level is
   actually in play, so every other map keeps the minimal-covering-set
   behaviour that was tuned against real regressions (A. sarawakensis
   washing the Malay peninsula 1,600 km from any record).            */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.20.26 v9.txt';
const OUT = DIR + 'Footer injection 8.20.26 v10.txt';
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

/* ── 1. the CSS: a third depth, and the compensated ramp ── */
cut('css-tri',
`.apsc-ctx{fill:var(--accent);fill-opacity:.16;stroke:rgba(239,240,232,.45);stroke-width:.8;pointer-events:none;}`,
`.apsc-ctx{fill:var(--accent);fill-opacity:.16;stroke:rgba(239,240,232,.45);stroke-width:.8;pointer-events:none;}
/* v117: THE ISLAND DEPTH (Borneo only). Painted under the other two,
   with no outline of its own - it is context for context, and a third
   stroke at this scale reads as clutter. */
.apsc-ctx0{fill:var(--accent);fill-opacity:.07;stroke:none;pointer-events:none;}
/* ⚠ COMPENSATED, NOT STACKED BY EYE. A child sits inside its parent so
   the fills composite; painting .07/.16/.82 straight would land the
   middle tone at .23. Solving c = c + (1-c)p for each depth gives the
   values below, which re-composite to EXACTLY .07 / .16 / .82 - so the
   two existing depths look unchanged and only the island is new.
   Scoped to .apsc-tri: every other map keeps today's numbers. */
.apsc-tri .apsc-ctx0{fill-opacity:.0700;}
.apsc-tri .apsc-ctx{fill-opacity:.0968;}
.apsc-tri .apsc-on{fill-opacity:.7857;}
.apsc-tri .apsc-ctx:hover{fill-opacity:.1600;}`);

/* ── 2. compute the island depth ── */
cut('island-set',
`    var ctxSet = {};
    (wash || []).forEach(function(n){ if (!doubtful[n]) ctxSet[n] = 1; });`,
`    var ctxSet = {};
    (wash || []).forEach(function(n){ if (!doubtful[n]) ctxSet[n] = 1; });

    /* ── v117: THE ISLAND DEPTH, BORNEO ONLY ────────────────────────
       Walk up the published tree from everything already painted. If
       Borneo is an ancestor and is not already carrying a stronger
       depth, it takes the faintest one. Deliberately keyed on the one
       island the grower asked for rather than generalised: the
       minimal-covering-set rule everywhere else was tuned against
       live regressions and is not being disturbed. */
    var ISLANDS = { "Borneo": 1 };
    var HIER3 = (data && data.hier && data.hier.places) || {};
    var islandSet = {};
    (function(){
      function up(n){
        var t = HIER3[n];
        if (t && t.parent) return [t.parent];
        return (subparent && subparent[n]) || [];
      }
      var start = Object.keys(ctxSet).concat(hits);
      for (var i = 0; i < start.length; i++){
        var stack = up(start[i]).slice(), guard = 0, seen = {};
        while (stack.length && guard++ < 30){
          var u = stack.pop();
          if (seen[u]) continue;
          seen[u] = 1;
          if (ISLANDS[u] && !ctxSet[u] && hits.indexOf(u) < 0) islandSet[u] = 1;
          up(u).forEach(function(x){ stack.push(x); });
        }
      }
    })();`);

/* ── 3. class it, and let it draw ── */
cut('island-class',
`      if (PARENT[name] && !onSet[name] && !ctxSet[name]) return;
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      p.setAttribute("class", onSet[name]
        ? (doubtful[name] ? "apsc-on apsc-on--doubtful" : "apsc-on")
        : (ctxSet[name] ? "apsc-ctx" : "apsc-base"));`,
`      if (PARENT[name] && !onSet[name] && !ctxSet[name] && !islandSet[name]) return;
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      p.setAttribute("class", onSet[name]
        ? (doubtful[name] ? "apsc-on apsc-on--doubtful" : "apsc-on")
        : (ctxSet[name] ? "apsc-ctx"
        : (islandSet[name] ? "apsc-ctx0" : "apsc-base")));`);

cut('island-append',
`      if (!onSet[name] && !ctxSet[name]){
        /* ground: the filled body carries the hover title, a twin path
           carries the outline in the brighter group above it */
        gFill.appendChild(p);`,
`      if (!onSet[name] && !ctxSet[name] && !islandSet[name]){
        /* ground: the filled body carries the hover title, a twin path
           carries the outline in the brighter group above it */
        gFill.appendChild(p);`);

/* ── 4. force paint order — with compensation it is load-bearing ── */
cut('paint-order',
`    /* point localities (Himalaya today) that have no polygon */
    hits.forEach(function(name){
      var dot = data.dots && data.dots[name];`,
`    /* ⚠ v117: PAINT ORDER IS NOW LOAD-BEARING. The three depths were
       appended as the shape loop met them, i.e. in FEED order, which
       does not guarantee island -> parent -> leaf. Compensated
       opacities only compose correctly bottom-up, so re-append them in
       depth order. appendChild MOVES an existing node, so this
       reorders in place without cloning or losing listeners. */
    if (Object.keys(islandSet).length){
      /* ⚠ A MARKER CLASS, NOT "apsc-map". The svg carries NO class of
         its own - apsc-map belongs to the WRAPPER DIV - so setting
         "apsc-map" here would mint a SECOND element matching
         .apsc-map and quietly change what every such selector
         returns. (It already fooled my own probe.) */
      svg.setAttribute("class", "apsc-tri");
      ["apsc-ctx0", "apsc-ctx", "apsc-on"].forEach(function(c){
        [].slice.call(svg.querySelectorAll("path." + c.split(" ")[0]))
          .forEach(function(el){ svg.appendChild(el); });
      });
    }

    /* point localities (Himalaya today) that have no polygon */
    hits.forEach(function(name){
      var dot = data.dots && data.dots[name];`);

cut('stamp', '"card-v116-file-v137"', '"card-v117-file-v138"');
cut('banner', 'FILE VERSION: v137', 'FILE VERSION: v138');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
