/* Card v107 (FILE v125) — the pop clears THE PANEL, not the dot.
   Master: Footer injection 8.19.26 v31.txt -> v32.txt

   v106 preferred "right of the dot", and measured against the dot it
   looked right at every width. Measured against what the reader is
   actually looking at, it was wrong nearly everywhere: the panel is
   ~460px wide and the pop is 280px, so "just right of the dot" is
   still INSIDE the panel, sitting on the temperature chart. Six of the
   ten placements covered the chart.

   The reader's complaint was never about the dot. It was that empty
   margin sat unused beside the panel while the pop covered content. So
   the geometry is measured against the PANEL:

     1. right of the panel, if the viewport margin fits it   (dead space)
     2. left of the panel, into the article column, if that fits
     3. the v104 vertical fallback

   ⚠ MEASURE AGAINST WHAT THE READER IS LOOKING AT. A clearance test
   that passes against the wrong reference passes for nothing — the
   v106 numbers were all "clear" while the pop sat on the chart.      */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.19.26 v31.txt';
const OUT = DIR + 'Footer injection 8.19.26 v32.txt';
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

cut('clear-the-panel',
  `      var d = dot.getBoundingClientRect();
      var popW = pop.offsetWidth || 280;
      /* ⚠ RIGHT BEFORE LEFT. Left was tested first and the article
         column nearly always has room, so on a wide screen the pop
         covered the article while empty margin sat unused to the right.
         The right margin costs the reader nothing. */
      var sideways = null;
      if (vw - d.right - pad >= popW + 14) sideways = d.width + 14;
      else if (d.left - pad >= popW + 14) sideways = -(popW + 14);
      if (sideways !== null){`,
  `      var d = dot.getBoundingClientRect();
      var popW = pop.offsetWidth || 280;
      /* ⚠ CLEAR THE PANEL, NOT THE DOT. The panel is ~460px wide and
         the pop 280px, so "just right of the dot" is still inside the
         panel — straight over the temperature chart the reader opened
         the panel to read. v106 measured against the dot and reported
         every placement clear while six of ten covered the chart.
         Reference point is the PANEL: dead margin first, then the
         article column, then the vertical fallback. */
      var panel = dot.closest ? dot.closest(".apsc-facts") : null;
      var pnl = panel ? panel.getBoundingClientRect() : d;
      var gap = 14;
      var sideways = null;
      if (vw - pnl.right - pad >= popW + gap) sideways = (pnl.right + gap) - d.left;
      else if (pnl.left - pad >= popW + gap) sideways = (pnl.left - gap - popW) - d.left;
      if (sideways !== null){`);

cut('stamp', '"card-v106-file-v124"', '"card-v107-file-v125"');
cut('banner', 'FILE VERSION: v124', 'FILE VERSION: v125');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
