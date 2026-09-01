/* Card v83 (FILE v101) — documented flowering months.
   Master: Footer injection 8.17.26 v18.txt -> v19.txt

   Twelve Amorphophallus posts state a flowering range in prose. They
   are surveyed, hand-curated (see flowering-curated.mjs) and drawn as
   a second span on the rest-season chart: two rules with a fill
   between, plus the sentence they rest on, on hover.

   ⚠ THE FLOWERING SPAN DOES NOT SHIFT WITH THE HEMISPHERE, and every
   other band on this chart does. That is deliberate. The lean and
   growing bands answer "when would MY outdoor plant rest" and so they
   move with the reader's seasons. A flowering record answers "when has
   this been seen in flower in habitat" — shifting it to Nov-Dec would
   assert something nobody ever documented. Truth beats visual
   symmetry; the readout says "in habitat" so the difference is stated
   rather than left to be noticed.                                    */
import fs from 'fs';
import { FLOWERING } from './flowering-curated.mjs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.17.26 v18.txt';
const OUT = DIR + 'Footer injection 8.17.26 v19.txt';
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

/* the table, emitted compactly: [from, to, sentence] */
const rows = Object.entries(FLOWERING)
  .map(([k, v]) => `    ${JSON.stringify(k)}: [${v.m[0]}, ${v.m[1]}, ${JSON.stringify(v.s)}]`)
  .join(',\n');

cut('table',
  '  var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];',
  `  var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  /* ── DOCUMENTED FLOWERING ─────────────────────────────────────────
     Surveyed from the Amorphophallus post bodies (they are the only
     place this exists — no feed carries it) and then read one by one.
     The miner alone was wrong in BOTH directions: it flagged four of
     the best sources because the sentence also mentions fruiting, and
     it passed "flowering Oct., Bosser 18117 (P, inflor.)" as clean
     when that is a herbarium sheet. Rejected outright: single dated
     events, glasshouse flowerings (cirrifer flowered in APRIL in
     EUROPE), and one explicitly speculative "presumably flowering".

     [firstMonth, lastMonth, the sentence it rests on] — 0 = January.
     ⚠ 12 of 110 posts. The import is at a-i, so this grows on its own;
     absence is normal and must never read as an error. */
  var FLOWERING = {
${rows}
  };`);

/* look the species up and hand it down */
cut('lookup',
  `        var restCal = null;
        if (isAmorph && res.parts && res.parts.length){
          try { restCal = restSeason(res.parts); } catch (e) { restCal = null; }
        }`,
  `        var restCal = null;
        if (isAmorph && res.parts && res.parts.length){
          try { restCal = restSeason(res.parts); } catch (e) { restCal = null; }
        }
        /* v83: the documented flowering span, keyed on the post title.
           A cultivar title ("... 'Something'") simply will not match,
           which is correct — the record is about the wild species. */
        if (restCal){
          var key = ((ttl && ttl.textContent) || "").replace(/\\s+/g, " ").trim().toUpperCase();
          restCal.flow = FLOWERING[key] || null;
        }`);

/* draw it */
cut('draw-flow',
  `    /* v82: the current-month hairline, the same one bandChart draws */`,
  `    /* ── v83: DOCUMENTED FLOWERING ──────────────────────────────────
       Two rules with a fill between, and a ribbon along the top so the
       span reads at a glance. Deliberately UNHATCHED: the hatch means
       "lean", and reusing it here would say the two spans are the same
       kind of claim. One is measured climate, the other is a sentence
       somebody published.
       ⚠ NOT hemisphere-shifted — see the file header. */
    var flowMarks = "";
    if (cal.flow){
      var fa = cal.flow[0], fb = cal.flow[1];
      var fx0 = Math.max(PADL, xm(fa) - STEP / 2);
      var fx1 = Math.min(W2 - PADR, xm(fb) + STEP / 2);
      /* a span that wraps the year end draws as two pieces, exactly as
         the lean band does */
      var pieces = (fb >= fa) ? [[fx0, fx1]]
        : [[fx0, W2 - PADR], [PADL, Math.min(W2 - PADR, xm(fb) + STEP / 2)]];
      pieces.forEach(function(p){
        flowMarks += '<rect x="' + p[0].toFixed(2) + '" y="' + TOP + '" width="' +
          (p[1] - p[0]).toFixed(2) + '" height="' + (BOT - TOP) +
          '" fill="rgba(243,241,234,.05)"/>' +
          '<rect x="' + p[0].toFixed(2) + '" y="' + TOP + '" width="' +
          (p[1] - p[0]).toFixed(2) + '" height="2.2" fill="rgba(243,241,234,.42)"/>' +
          '<line x1="' + p[0].toFixed(2) + '" y1="' + TOP + '" x2="' + p[0].toFixed(2) +
          '" y2="' + BOT + '" stroke="rgba(243,241,234,.42)" stroke-width="0.7"/>' +
          '<line x1="' + p[1].toFixed(2) + '" y1="' + TOP + '" x2="' + p[1].toFixed(2) +
          '" y2="' + BOT + '" stroke="rgba(243,241,234,.42)" stroke-width="0.7"/>';
      });
    }

    /* v82: the current-month hairline, the same one bandChart draws */`);

cut('assemble-flow',
  `      '</pattern></defs>' + band + nowLine +`,
  `      '</pattern></defs>' + band + flowMarks + nowLine +`);

/* the hover text gains the flowering fact */
cut('says-flow',
  `    var hits = "";
    for (var hm = 0; hm < 12; hm++){
      var cx0 = Math.max(PADL, Math.min(W2 - PADR - STEP, xm(hm) - STEP / 2));
      hits += '<rect class="apclim-col" data-m="' + hm + '" x="' + cx0.toFixed(2) +
        '" y="0" width="' + STEP.toFixed(2) + '" height="' + H2 + '">' +
        '<title>' + MONTH_FULL[hm] + " \\u00b7 " + restSays(stateOf(hm)) + '</title></rect>';
    }`,
  `    var hits = "";
    for (var hm = 0; hm < 12; hm++){
      var cx0 = Math.max(PADL, Math.min(W2 - PADR - STEP, xm(hm) - STEP / 2));
      hits += '<rect class="apclim-col" data-m="' + hm + '" x="' + cx0.toFixed(2) +
        '" y="0" width="' + STEP.toFixed(2) + '" height="' + H2 + '">' +
        '<title>' + MONTH_FULL[hm] + " \\u00b7 " + restSays(stateOf(hm)) +
        (restInFlower(cal, hm) ? " \\u00b7 " + restFlowerSays(cal) : "") +
        '</title></rect>';
    }`);

cut('flow-helpers',
  `  /* what a month means, in words — shared by the tooltip and the readout */`,
  `  function restInFlower(cal, m){
    if (!cal.flow) return false;
    var a = cal.flow[0], b = cal.flow[1];
    return (b >= a) ? (m >= a && m <= b) : (m >= a || m <= b);
  }
  function restFlowerSays(cal){
    return "documented to flower " + MON[cal.flow[0]] + "\\u2013" + MON[cal.flow[1]] + " in habitat";
  }

  /* what a month means, in words — shared by the tooltip and the readout */`);

/* the readout under the chart */
cut('hint-flow',
  `    function setHint(m){
      hint.textContent = MONTH_FULL2[m] + " \\u00b7 " + restSays(restStateOf(cal, m, south));
    }`,
  `    function setHint(m){
      /* the flowering fact REPLACES the season line for those months
         rather than being appended: at the 301px desktop panel there is
         room for one clause, and "documented to flower" is the rarer
         and more specific thing to say. */
      hint.textContent = restInFlower(cal, m)
        ? MONTH_FULL2[m] + " \\u00b7 " + restFlowerSays(cal)
        : MONTH_FULL2[m] + " \\u00b7 " + restSays(restStateOf(cal, m, south));
    }`);

/* and a line under the callout, so it is visible without hovering */
cut('flow-line',
  `    wrap.appendChild(body);
    wrap.appendChild(note);`,
  `    wrap.appendChild(body);
    if (cal.flow){
      var fl = el("div", "apclim-rest__flower");
      fl.textContent = "Documented to flower " + MON[cal.flow[0]] + "\\u2013" +
        MON[cal.flow[1]] + " in habitat.";
      fl.title = cal.flow[2];        /* the sentence it rests on */
      wrap.appendChild(fl);
    }
    wrap.appendChild(note);`);

cut('flow-css',
  `.apsc .apclim-rest__note{`,
  `.apsc .apclim-rest__flower{
  font-size:12px;color:rgba(243,241,234,.66);margin:4px 0 0;
  padding-left:9px;border-left:2px solid rgba(243,241,234,.32);
}
.apsc .apclim-rest__note{`);

cut('stamp', '"card-v82-file-v100"', '"card-v83-file-v101"');
cut('banner', 'FILE VERSION: v100  (last updated 2026-08-17)',
             'FILE VERSION: v101  (last updated 2026-08-17)');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log(`flowering rows embedded: ${Object.keys(FLOWERING).length}`);
console.log('wrote ' + OUT.split('/').pop() + '  ' + (s.length / 1024).toFixed(0) + ' KB');
