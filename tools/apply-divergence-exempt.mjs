/* The self-check has to know about the same exemption.

   With the dot skipped, the NEXT guard fired: the climate place set no
   longer equals shapes.json u shapes-hd.json, because the map draws a
   "Gilbert Is." dot that climate legitimately cannot describe.

   That guard exists to catch a STALE shape feed, and it is worth
   keeping sharp — so it is not loosened. It is made precise: a dot
   with no places.json row is EXPECTED to be map-only, because a point
   has no polygon to measure. Every other divergence still aborts.  */
import fs from 'fs';
const P = './build-climate-v9-work.mjs';
let s = fs.readFileSync(P, 'utf8');
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error('ABORT: "' + name + '" matched ' + n); process.exit(1); }
  s = s.replace(f, () => r);
  console.log('  ok: ' + name);
}

cut('exempt-geometryless-dots',
`  const climPlaces = new Set(Object.keys(out));
  const onlyMap = [...mapPlaces].filter(t => !climPlaces.has(t));`,
`  const climPlaces = new Set(Object.keys(out));
  /* 1.13.0: a DOT with no places.json row has no polygon, so it can
     never have climate and is EXPECTED to be map-only. Exempting
     exactly those keeps this check as sharp as it was for every other
     kind of divergence — a stale shape feed still aborts. */
  const geometryless = new Set(hdDotOnly);
  const onlyMap = [...mapPlaces].filter(t => !climPlaces.has(t) && !geometryless.has(t));`);

/* hdDotOnly is scoped to the block that computed it; hoist it */
cut('hoist-hdDotOnly',
`    const have = new Set(places.map(p => p.tag));
    const hdDotOnly = Object.keys(hd.dots || {}).filter(t => !have.has(t));`,
`    const have = new Set(places.map(p => p.tag));
    hdDotOnly = Object.keys(hd.dots || {}).filter(t => !have.has(t));`);

cut('declare-hdDotOnly',
`  const hd = JSON.parse(fs.readFileSync(DRIVE + 'shapes-hd.json', 'utf8'));`,
`  const hd = JSON.parse(fs.readFileSync(DRIVE + 'shapes-hd.json', 'utf8'));
  let hdDotOnly = [];`);

fs.writeFileSync(P, s, 'utf8');
console.log('written');
