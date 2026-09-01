/* Card v101 (FILE v119) — the y axis says what it measures.
   Master: Footer injection 8.19.26 v25.txt -> v26.txt

   The rest chart sat next to two charts labelled °F and %, carrying no
   axis label at all. A reader could see the curve rise and had nothing
   telling them what rising MEANT.

   "rest pressure", set in the LEFT GUTTER — the same 26 units where
   bandChart puts its 100°/80°/60° ticks. Putting it there rather than
   floating it over the plot makes the two charts read as one system,
   and the gutter is otherwise empty because this axis has no values to
   tick.

   ⚠ NO TICKS, ONLY A TITLE. The 85 mm and 18->8 °C constants stay
   invisible on purpose: the grower ruled that this data is a display
   statistic and not a survivability threshold, so nothing here may be
   drawn as a line a reader could read a cutoff off. A title names the
   dimension without implying a measurable scale.

   ⚠ NOT "leaner" — that was my word, not a reader's.               */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.19.26 v25.txt';
const OUT = DIR + 'Footer injection 8.19.26 v26.txt';
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

cut('axis-title',
  `    /* v82: the current-month hairline, the same one bandChart draws */`,
  `    /* ── v101: THE Y AXIS TITLE ──────────────────────────────────────
       Rotated up the left gutter, in the 26 units bandChart reserves
       for its own scale, so the two charts share a margin as well as a
       grid. Anchored at the MIDDLE of the plot and rotated -90, so it
       reads bottom-to-top and grows with the curve.
       Sized to the plot height, not guessed: 44 units of plot against
       roughly 0.5em per character means "rest pressure" (13 chars)
       needs about 6.5. */
    var axisTitle = '<text class="apclim-ylab apclim-ytitle" x="0" y="0" ' +
      'text-anchor="middle" transform="translate(9,' +
      ((TOP + BOT) / 2).toFixed(1) + ') rotate(-90)">rest pressure</text>';

    /* v82: the current-month hairline, the same one bandChart draws */`);

cut('assemble',
  `      '</pattern></defs>' + band + flowMarks + nowLine +`,
  `      '</pattern></defs>' + axisTitle + band + flowMarks + nowLine +`);

cut('css',
  `.apsc .apclim-mlab--now{fill:var(--accent);}`,
  `.apsc .apclim-mlab--now{fill:var(--accent);}
/* v101: the rest chart's axis title. Smaller than .apclim-ylab's 8px
   because it must fit the PLOT HEIGHT rotated, not a row of digits. */
.apsc .apclim-ytitle{font-size:6.5px;letter-spacing:.04em;}`);

cut('stamp', '"card-v100-file-v118"', '"card-v101-file-v119"');
cut('banner', 'FILE VERSION: v118', 'FILE VERSION: v119');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
