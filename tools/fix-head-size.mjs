/* Corrects the callout's cqw coefficient in the v17 master.
   ⚠ CRLF-aware: a multi-line anchor written with bare newlines does not
   match this file, which has bitten me three times now. */
import fs from 'fs';
const P = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.17.26 v17.txt';
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
let s = fs.readFileSync(P, 'utf8');

function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error(`ABORT: "${name}" matched ${n}, expected 1`); process.exit(1); }
  s = s.replace(f, () => r);
  console.log('  ok: ' + name);
}

cut('clamp',
  'white-space:nowrap;font-size:clamp(9.5px, 3.3cqw, 13px);',
  'white-space:nowrap;font-size:clamp(8px, 3cqw, 13px);');

cut('note',
  `/* no container-query support: fall back to a size that fits the
   narrowest panel rather than to a wrapped headline */
@supports not (font-size: 1cqw){
  .apsc .apclim-rest__head{font-size:10px;}
}`,
  `/* ⚠ 3cqw IS MEASURED, NOT GUESSED. The first cut used 3.3cqw from a
   0.5em-per-character estimate and clipped the callout by 12-13px at
   three of four widths — and the check that passed it asserted "one
   line", which white-space:nowrap guarantees whether the text fits or
   not. The real figure is 31.4px of text per 1px of font-size for this
   string in this face, constant across widths, so an exact fit is
   ~3.19cqw; 3 leaves about 6% for the longest month pair.
   VERIFY WITH scrollWidth > clientWidth, NEVER by line count. */
/* no container-query support: fall back to a size that fits the
   narrowest panel rather than to a wrapped headline */
@supports not (font-size: 1cqw){
  .apsc .apclim-rest__head{font-size:9px;}
}`);

fs.writeFileSync(P, s, 'utf8');
console.log('written');
