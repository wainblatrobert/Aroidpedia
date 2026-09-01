/* What ground does the Seychelles tag actually stand on?
   Lists the rings of the countries10m Seychelles feature, which grid
   cells each ring catches, and which of those WorldClim calls land. */
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { fromFile } = require('geotiff');

const DRIVE = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/JS JAVASCRIPT CODE/';
const W = 2160, H = 1080, STEP = 1 / 6;
const rowOf = la => Math.min(H - 1, Math.max(0, Math.floor((90 - la) / STEP)));
const colOf = lo => Math.min(W - 1, Math.max(0, Math.floor((lo + 180) / STEP)));
const latOfRow = r => 90 - (r + 0.5) * STEP;
const lonOfCol = c => -180 + (c + 0.5) * STEP;

function rasterize(geom, into) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates]
              : geom.type === 'MultiPolygon' ? geom.coordinates : [];
  polys.forEach(rings => {
    let minLat = 90, maxLat = -90;
    rings.forEach(r => r.forEach(p => { if (p[1] < minLat) minLat = p[1]; if (p[1] > maxLat) maxLat = p[1]; }));
    for (let row = rowOf(maxLat); row <= rowOf(minLat); row++) {
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

const NOD = -1e30;
const load = async (name) => { const m = [];
  for (let i = 1; i <= 12; i++) m.push((await (await (await fromFile(
    `${DRIVE}climate-cache/${name}/wc2.1_10m_${name}_${String(i).padStart(2,'0')}.tif`)).getImage()).readRasters())[0]);
  return m; };
const TN = await load('tmin'), TX = await load('tmax');
const valid = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) {
  let ok = true;
  for (let m = 0; m < 12; m++) { const v = TN[m][i]; if (v < NOD || !isFinite(v)) { ok = false; break; } }
  if (ok) valid[i] = 1;
}

const feats = JSON.parse(fs.readFileSync(DRIVE + 'ne-cache/countries10m.geojson', 'utf8')).features;
const f = feats.find(x => x.properties.NAME === 'Seychelles');
console.log('feature:', f.properties.NAME, f.geometry.type);
const polys = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
console.log(`rings (outer only), ${polys.length} parts:\n`);
const shoelace = r => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++)
  a += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return Math.abs(a / 2); };
polys.forEach((rings, i) => {
  const r = rings[0];
  let la = 0, lo = 0; r.forEach(p => { lo += p[0]; la += p[1]; });
  la /= r.length; lo /= r.length;
  const px = new Set(); rasterize({ type: 'Polygon', coordinates: rings }, px);
  const v = [...px].filter(k => valid[k]);
  console.log(`  part ${String(i).padStart(2)}  centre ${la.toFixed(3).padStart(8)}, ${lo.toFixed(3).padStart(8)}   ` +
    `area ${shoelace(r).toFixed(5).padStart(9)} deg²   cells ${px.size}  valid ${v.length}` +
    (v.length ? '  -> ' + v.map(k => `${latOfRow(Math.floor(k/W)).toFixed(2)},${lonOfCol(k%W).toFixed(2)}`).join(' ') : ''));
});

console.log('\nnearest valid pixel to the declared centroid (-4.7, 55.5), by ring radius:');
const r0 = rowOf(-4.7), c0 = colOf(55.5);
for (let rad = 0; rad <= 12; rad++) {
  const hits = [];
  for (let dr = -rad; dr <= rad; dr++) for (let dc = -rad; dc <= rad; dc++) {
    if (Math.max(Math.abs(dr), Math.abs(dc)) !== rad) continue;
    const idx = (r0 + dr) * W + (c0 + dc);
    if (valid[idx]) hits.push(`${latOfRow(r0+dr).toFixed(2)},${lonOfCol(c0+dc).toFixed(2)}`);
  }
  if (hits.length) { console.log(`  radius ${rad} cells (~${(rad*18.5)|0} km): ${hits.join('  ')}`); break; }
  if (rad === 12) console.log('  nothing within 12 cells (~222 km)');
}

const mean = a => a.reduce((x,y)=>x+y,0)/a.length;
const at = (la, lo, label) => { const i = rowOf(la)*W+colOf(lo);
  if (!valid[i]) return console.log(`  ${label.padEnd(22)} NO DATA at cell ${latOfRow(rowOf(la)).toFixed(2)},${lonOfCol(colOf(lo)).toFixed(2)}`);
  const tn = [], tx = [];
  for (let m = 0; m < 12; m++) { tn.push(TN[m][i]); tx.push(TX[m][i]); }
  console.log(`  ${label.padEnd(22)} cell ${latOfRow(rowOf(la)).toFixed(2)},${lonOfCol(colOf(lo)).toFixed(2)}  ` +
    `tmin ${Math.min(...tn).toFixed(1)}..${Math.max(...tn).toFixed(1)}  tmax ${Math.min(...tx).toFixed(1)}..${Math.max(...tx).toFixed(1)}  ` +
    `mean ${((mean(tn)+mean(tx))/2).toFixed(1)}C`);
};
console.log('\ncells at the named islands:');
at(-9.42, 46.42, 'Aldabra');
at(-4.62, 55.45, 'Mahe');
at(-4.32, 55.73, 'Praslin');
at(-4.35, 55.83, 'La Digue');
at(-4.49, 55.24, 'Silhouette');
