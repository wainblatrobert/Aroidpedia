/* Does the four-province Kalimantan union actually miss North Kalimantan?
   Rasterize Borneo, Sabah, Sarawak, Brunei and the four provinces, then
   ask which Indonesian-Borneo cells no province claims. */
import fs from 'fs';
const DRIVE = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/JS JAVASCRIPT CODE/';
const W = 2160, H = 1080, STEP = 1 / 6;
const rowOf = la => Math.min(H - 1, Math.max(0, Math.floor((90 - la) / STEP)));
const colOf = lo => Math.min(W - 1, Math.max(0, Math.floor((lo + 180) / STEP)));
const latOfRow = r => 90 - (r + 0.5) * STEP, lonOfCol = c => -180 + (c + 0.5) * STEP;
function rasterize(geom, into) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates]
              : geom.type === 'MultiPolygon' ? geom.coordinates : [];
  polys.forEach(rings => {
    let mn = 90, mx = -90;
    rings.forEach(r => r.forEach(p => { if (p[1] < mn) mn = p[1]; if (p[1] > mx) mx = p[1]; }));
    for (let row = rowOf(mx); row <= rowOf(mn); row++) {
      const y = latOfRow(row); const xs = [];
      rings.forEach(r => { for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        const [x1, y1] = r[j], [x2, y2] = r[i];
        if ((y1 > y) !== (y2 > y)) xs.push(x1 + (y - y1) / (y2 - y1) * (x2 - x1));
      }});
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2)
        for (let c = colOf(xs[k] + 1e-9); c <= colOf(xs[k + 1] - 1e-9); c++) {
          const lon = lonOfCol(c);
          if (lon >= xs[k] && lon <= xs[k + 1]) into.add(row * W + c);
        }
    }
  });
}
const norm = s => String(s || '').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const L = {}; for (const k of ['countries', 'regions', 'admin1', 'countries10m'])
  L[k] = JSON.parse(fs.readFileSync(DRIVE + 'ne-cache/' + k + '.geojson', 'utf8')).features;
const grabFeat = (name, layer) => L[layer].find(f => {
  const p = f.properties;
  return [p.NAME, p.NAME_LONG, p.ADMIN, p.NAME_EN, p.BRK_NAME, p.GEOUNIT, p.name, p.name_en,
          p.gn_name, p.woe_name, p.NAMEALT].some(n => n && norm(n) === norm(name));
});
const set = (name, layer) => { const f = grabFeat(name, layer);
  if (!f) { console.log('  !! no feature', name, '@', layer); return new Set(); }
  const s = new Set(); rasterize(f.geometry, s); return s; };

const prov = ['Kalimantan Barat', 'Kalimantan Timur', 'Kalimantan Selatan', 'Kalimantan Tengah'];
const kal = new Set();
prov.forEach(n => { const s = set(n, 'admin1');
  const las = [...s].map(i => latOfRow(Math.floor(i / W)));
  console.log(`  ${n.padEnd(20)} cells ${String(s.size).padStart(4)}  lat ${Math.min(...las).toFixed(2)}..${Math.max(...las).toFixed(2)}`);
  s.forEach(i => kal.add(i)); });
const las = [...kal].map(i => latOfRow(Math.floor(i / W)));
console.log(`  UNION                cells ${kal.size}  lat ${Math.min(...las).toFixed(2)}..${Math.max(...las).toFixed(2)}`);

const borneo = set('Borneo', 'regions');
const other = new Set();
[['Sabah', 'admin1'], ['Sarawak', 'admin1'], ['Brunei', 'countries']].forEach(([n, l]) =>
  set(n, l).forEach(i => other.add(i)));
console.log(`\n  Borneo ${borneo.size} cells; Sabah+Sarawak+Brunei ${other.size}`);
const gap = [...borneo].filter(i => !kal.has(i) && !other.has(i));
console.log(`  Borneo cells claimed by NO tag: ${gap.length}`);
const north = gap.filter(i => latOfRow(Math.floor(i / W)) > 2.0);
console.log(`  ...of which north of 2N (the North Kalimantan band): ${north.length}`);
gap.sort((a, b) => latOfRow(Math.floor(b / W)) - latOfRow(Math.floor(a / W)))
   .slice(0, 25).forEach(i => console.log(`     ${latOfRow(Math.floor(i / W)).toFixed(2)}, ${lonOfCol(i % W).toFixed(2)}`));
/* the reverse question: does Kalimantan Timur alone reach into North Kalimantan? */
const kt = set('Kalimantan Timur', 'admin1');
const ktn = [...kt].filter(i => latOfRow(Math.floor(i / W)) > 2.5);
console.log(`\n  Kalimantan Timur cells north of 2.5N (North Kalimantan's band): ${ktn.length}`);
if (ktn.length) { const l2 = ktn.map(i => latOfRow(Math.floor(i / W)));
  console.log(`     up to ${Math.max(...l2).toFixed(2)}N`); }
