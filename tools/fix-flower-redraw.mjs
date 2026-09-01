/* The .apclim-rest__flower line was built ONCE, outside draw(), so it
   kept its habitat months when the hemisphere toggle moved everything
   else. Caught by flipping the toggle and reading the line — the chart
   band and the tooltip had both shifted correctly, which is exactly
   how a half-wired control hides.

   v20 has not shipped, so this edits it in place rather than minting a
   version for a mistake that never reached anyone. ⚠ CRLF-aware. */
import fs from 'fs';
const P = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.17.26 v20.txt';
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

/* declare it with the other elements so draw() can reach it */
cut('declare',
  `    var nativeLine = el("div", "apclim-rest__native");`,
  `    var nativeLine = el("div", "apclim-rest__native");
    /* built here, TEXT SET IN draw() — anything that must follow the
       hemisphere toggle has to be written inside the redraw, not once
       at construction. */
    var flowLine = cal.flow ? el("div", "apclim-rest__flower") : null;
    if (flowLine) flowLine.title = cal.flow[2];   /* the source sentence */`);

/* set its text on every redraw */
cut('redraw',
  `      } else nativeLine.textContent = "";`,
  `      } else nativeLine.textContent = "";
      if (flowLine){
        var fs2 = restFlowerSays(cal, south);
        flowLine.textContent = fs2.charAt(0).toUpperCase() + fs2.slice(1) + ".";
      }`);

/* mount the shared element instead of building a fresh one */
cut('mount',
  /* \u26a0 the master holds the ESCAPE TEXT \u2013, not an en-dash \u2014 it was
     written by a patch whose template literal emitted \\u2013. Matching
     the real character here finds nothing. */
  `    if (cal.flow){
      var fl = el("div", "apclim-rest__flower");
      fl.textContent = "Documented to flower " + MON[cal.flow[0]] + "\\u2013" +
        MON[cal.flow[1]] + " in habitat.";
      fl.title = cal.flow[2];        /* the sentence it rests on */
      wrap.appendChild(fl);
    }`,
  `    if (flowLine) wrap.appendChild(flowLine);`);

fs.writeFileSync(P, s, 'utf8');
console.log('written');
