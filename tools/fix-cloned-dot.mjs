/* The provenance pop clones the zone chip row, and the row now carries
   the new (i) dot — so the clone produced a SECOND dot, nested inside
   another pop, with a duplicated aria-label and no click handler
   (cloneNode copies nodes, not listeners). A dead control that looks
   live is worse than no control.

   Strip any dot out of the clone. v27 has not shipped, so this edits in
   place. ⚠ CRLF-aware. */
import fs from 'fs';
const P = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.19.26 v27.txt';
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

cut('strip-clone-dot',
  `    if (res.zones.length && zwrap){
      var zc = zwrap.cloneNode(true);
      zc.style.margin = "0 0 8px";
      infoPop.appendChild(zc);
    }`,
  `    if (res.zones.length && zwrap){
      var zc = zwrap.cloneNode(true);
      zc.style.margin = "0 0 8px";
      /* v102: the row now carries its own (i) dot, and a CLONE of a dot
         is a dead control — cloneNode copies nodes, not listeners — so
         it would sit inside this pop looking clickable and do nothing,
         with a duplicated aria-label for a screen reader to read out
         twice. The chips clone; the dot does not. */
      var stray = zc.querySelectorAll(".apsc-clim__info");
      [].forEach.call(stray, function(n){ if (n.parentNode) n.parentNode.removeChild(n); });
      infoPop.appendChild(zc);
    }`);

fs.writeFileSync(P, s, 'utf8');
console.log('written');
