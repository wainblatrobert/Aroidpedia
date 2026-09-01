/* The axis title collided with the month row.

   Measured, not guessed: at 6.5 units "rest pressure" runs 49.8 units
   long, and centring it on the PLOT midpoint (27) put it at y 2.1-51.9
   while the month letters start at 50.1 — a 1.8-unit overlap.

   ⚠ My first check asserted the wrong bound. It compared the label
   against the 44-unit PLOT height, which the label is allowed to
   exceed because it sits in the gutter; the real constraints are the
   SVG frame and the month row. An assertion against the wrong bound
   reported a failure that was not one, and would equally have hidden a
   real one.

   6 units -> 46.0 long, centred at 25 -> spans 2..48, clearing the
   month row by 2 units. v26 has not shipped, so this edits in place.  */
import fs from 'fs';
const P = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.19.26 v26.txt';
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
let s = fs.readFileSync(P, 'utf8');
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error(`ABORT: "${name}" matched ${n}`); process.exit(1); }
  s = s.replace(f, () => r);
  console.log('  ok: ' + name);
}

cut('centre',
  `      'text-anchor="middle" transform="translate(9,' +
      ((TOP + BOT) / 2).toFixed(1) + ') rotate(-90)">rest pressure</text>';`,
  `      'text-anchor="middle" transform="translate(9,25) rotate(-90)">rest pressure</text>';`);

cut('size',
  `.apsc .apclim-ytitle{font-size:6.5px;letter-spacing:.04em;}`,
  `/* 6, not 6.5: at 6.5 the string measures 49.8 units and, centred on
   the plot midpoint, ran from y 2.1 to 51.9 while the month letters
   begin at 50.1. Centred at 25 and sized 6 it spans 2..48 and clears
   them by two units. Both figures are MEASURED in the browser. */
.apsc .apclim-ytitle{font-size:6px;letter-spacing:.04em;}`);

fs.writeFileSync(P, s, 'utf8');
console.log('written');
