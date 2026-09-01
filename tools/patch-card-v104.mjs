/* Card v104 (FILE v122) — the (i) pop stays inside the viewport.
   Master: Footer injection 8.19.26 v28.txt -> v29.txt

   REPORTED: the REST SEASON pop "is all below the i… mostly goes
   outside of the view range".

   Two causes, both mine:

   1. The pop is pinned top:15px — ALWAYS below the dot. Fine when it
      held one short note; the rest pop now carries the body sentence,
      the outdoor caveat, the rest-pressure explanation, CLIMATE ZONES
      and the zones explanation. Tall content anchored downward runs
      off the bottom whenever the dot sits low on screen.

   2. My v102 clamp handled the HORIZONTAL axis only. I fixed the axis
      that happened to be broken that day and never asked whether the
      other one could break the same way. It could, and it did.

   Now: it opens ABOVE when there is more room above, and its height is
   capped to the space actually available with the overflow scrolling —
   so it can never exceed the viewport regardless of how much text a
   future change puts in it.                                          */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.19.26 v28.txt';
const OUT = DIR + 'Footer injection 8.19.26 v29.txt';
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

cut('clamp-both-axes',
  `    function clamp(){
      pop.style.left = "";
      pop.style.right = "auto";
      var r = pop.getBoundingClientRect();
      var pad = 8;
      if (r.right > window.innerWidth - pad){
        pop.style.left = (-12 - (r.right - (window.innerWidth - pad))) + "px";
        r = pop.getBoundingClientRect();
      }
      if (r.left < pad) pop.style.left = (parseFloat(pop.style.left || -12) + (pad - r.left)) + "px";
    }`,
  `    /* ⚠ BOTH AXES. v102 clamped only the horizontal, because that is
       the one that was visibly broken that day — and the vertical broke
       the moment the pop grew tall. Reset every property first or each
       open compounds the last one's nudge. */
    function clamp(){
      pop.style.left = "";
      pop.style.right = "auto";
      pop.style.top = "";
      pop.style.bottom = "";
      pop.style.maxHeight = "";
      var pad = 8;
      var vw = window.innerWidth, vh = window.innerHeight;

      /* horizontal */
      var r = pop.getBoundingClientRect();
      if (r.right > vw - pad){
        pop.style.left = (-12 - (r.right - (vw - pad))) + "px";
        r = pop.getBoundingClientRect();
      }
      if (r.left < pad){
        pop.style.left = (parseFloat(pop.style.left || -12) + (pad - r.left)) + "px";
      }

      /* vertical: open UPWARD when there is more room up there, and cap
         the height to the space actually available so a long pop
         scrolls inside itself instead of running off the screen. */
      var d = dot.getBoundingClientRect();
      var above = d.top - pad;
      var below = vh - d.bottom - pad;
      r = pop.getBoundingClientRect();
      if (r.height > below && above > below){
        pop.style.top = "auto";
        pop.style.bottom = (d.height + 2) + "px";
        pop.style.maxHeight = Math.max(120, above) + "px";
      } else {
        pop.style.maxHeight = Math.max(120, below) + "px";
      }
    }`);

cut('pop-scrolls',
  `.apsc .apsc-clim__infopop{
  display:none;position:absolute;z-index:6;top:15px;left:-12px;`,
  `.apsc .apsc-clim__infopop{
  /* overflow-y is what makes the JS max-height mean anything; without
     it a capped box just clips its own text. */
  overflow-y:auto;overscroll-behavior:contain;
  display:none;position:absolute;z-index:6;top:15px;left:-12px;`);

cut('stamp', '"card-v103-file-v121"', '"card-v104-file-v122"');
cut('banner', 'FILE VERSION: v121', 'FILE VERSION: v122');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
