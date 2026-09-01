/* Moving the chip into the header carried its (i) with it, landing two
   identical dots side by side: "CLIMATE RANGE [Tropical Dry 40%] (i)(i)".
   Two same-looking controls an inch apart is a worse problem than the
   row of height it saved.

   They merge. The provenance pop ALREADY holds the full chip mix, so
   the zones explanation simply joins it there and the second dot goes.
   One (i) in the header, everything about the zones behind it.

   v30 has not shipped; edited in place. ⚠ CRLF-aware. */
import fs from 'fs';
const P = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.19.26 v30.txt';
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

/* stop building the second dot; keep the words for the merged pop */
cut('drop-zone-dot',
  `      var zInfo = makeInfoDot("What the climate zones mean");
      zInfo.pop.appendChild(el("div", "apsc-clim__note",`,
  `      /* v105: NO SECOND DOT — it would sit beside the provenance one
         in the header, two identical controls an inch apart. The text
         joins the provenance pop below, which already carries the full
         chip mix. */
      var zoneWhy = el("div", "apsc-clim__note",`);

cut('close-zone-why',
  `        "Sub Tropical Desert…), not Köppen codes."));
      zwrap.appendChild(zInfo.dot);
      box.appendChild(zwrap);`,
  `        "Sub Tropical Desert…), not Köppen codes.");
      box.appendChild(zwrap);`);

/* the explanation lands with the chips it explains */
cut('why-into-provenance',
  `      infoPop.appendChild(zc);`,
  `      infoPop.appendChild(zc);
      if (typeof zoneWhy !== "undefined" && zoneWhy) infoPop.appendChild(zoneWhy);`);

fs.writeFileSync(P, s, 'utf8');
console.log('written');
