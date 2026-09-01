/* climate.json 1.13.0 — resolve the Cs/Cw overlap by STRENGTH.
   build-climate 8.18.26 v8.mjs -> build-climate 8.20.26 v9.mjs

   REPORTED: Amorphophallus impressus, a Malawi/Tanzania plant, showed
   "mediterranean 24%".

   Peel et al. 2007's Cs and Cw criteria are not mutually exclusive,
   and the published ordering silently hands every tie to Cs. Malawi
   satisfies BOTH, so it was labelled Csa.

   The tie is manufactured by the fixed six-month summer block. Malawi
   rains Nov-Apr; the southern "summer" is Oct-Mar. That offset puts
   October (15 mm, the last DRY month) inside summer, where it becomes
   the "driest summer month", and April (89 mm, the last WET month)
   inside winter, where it becomes the "wettest winter month". Cs then
   passes on 15 < 89/3 — a threshold met entirely by two months that
   are in the wrong season.

   The same offset produces the same false Cs in the north: Mexico
   rains Jun-Oct against an Apr-Sep summer, so October lands in winter
   and April-May in summer. Jalisco was 67% "mediterranean".

   FIX: when both criteria pass, take the season whose contrast is
   actually stronger, instead of whichever the source paper happens to
   list first. Malawi's winter-dry contrast is x115.5 against a
   summer-dry x4.0 — not a close call once you ask which way the year
   leans.

   ⚠ THIS DOES NOT TOUCH REAL MEDITERRANEAN CLIMATES. All 102 places
   that change sit between 0.5 and 31 degrees; every genuine
   winter-rain region (Iberia, Greece, Tunisia, California, Chile
   Central, the Levant, the Aegean islands) keeps its s, because
   nowhere with a genuinely dry summer also has a winter drier than a
   tenth of its summer peak. Chile North appears to change only in a
   whole-place proxy: it is 98.6% arid, and B is decided before the C
   group is ever reached.

   ⚠ NOT FIXED, AND NOT PRETENDING TO BE: the equatorial bimodal belt
   (Imbabura, Carchi ~0.5N) has two rainy seasons and no meaningful
   summer to be dry in. A six-month split cannot describe it and this
   tiebreak does not rescue it.

   ⚠ THE D GROUP SHARES THIS LINE. Ds/Dw is decided by the same
   expression, so the same tiebreak now applies there. That is
   intended: the overlap is identical in kind.                       */
import fs from 'fs';
const P = './build-climate-v9-work.mjs';
let s = fs.readFileSync(P, 'utf8');
/* the builder is CRLF; this patch file is LF. Convert both sides or
   every multi-line needle silently matches zero times. */
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

cut('cs-cw-tiebreak',
`        const season = (Psdry < 40 && Psdry < Pwwet / 3) ? 's'
                     : (Pwdry < Pswet / 10) ? 'w' : 'f';`,
`        /* ⚠ Cs AND Cw OVERLAP, AND ORDER ALONE DECIDED IT. Peel's two
           criteria are not exclusive; testing s first handed every tie
           to "mediterranean". Malawi satisfies both and came out Csa —
           a manufactured tie, because the fixed six-month summer block
           (Oct-Mar south, Apr-Sep north) sits about a month off the
           real rainfall calendar, so the last dry month falls inside
           summer and the last wet month inside winter. Mexico shows
           the mirror image. When both pass, take the season whose
           contrast is genuinely stronger. The 0.1 floor guards a
           rainless month; if both are rainless the comparison falls
           through to which half holds the wetter peak, which is the
           right answer anyway. */
        const sDry = (Psdry < 40 && Psdry < Pwwet / 3);
        const wDry = (Pwdry < Pswet / 10);
        const season = (sDry && wDry)
          ? ((Pswet / Math.max(Pwdry, 0.1)) > (Pwwet / Math.max(Psdry, 0.1)) ? 'w' : 's')
          : (sDry ? 's' : (wDry ? 'w' : 'f'));`);

cut('version', `const VERSION = '1.12.0';`, `const VERSION = '1.13.0';`);

cut('method-note',
  ` Coarsen client-side; never re-split.`,
  ` Coarsen client-side; never re-split. 1.13.0: Peel's Cs and Cw criteria overlap and his ordering gives every tie to Cs, which labelled summer-rain tropics "mediterranean" (Malawi 33% Cs, Njombe 91%, Jalisco 67%) because the fixed six-month summer block sits ~1 month off the real rainfall calendar in both hemispheres; where BOTH criteria pass the stronger contrast now wins (Pswet/Pwdry vs Pwwet/Psdry). 102 places change, all between 0.5 and 31 degrees; no genuine winter-rain region is affected. The equatorial bimodal belt (two rainy seasons, no meaningful summer) remains undescribable by a six-month split.`);

fs.writeFileSync(P, s, 'utf8');
console.log('edits: ' + edits.join(', '));
