import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { fromFile } = require('geotiff');
const WTE_DIR = process.env.WTE_DIR ||
  'G:/My Drive/PlantsV2/Tableau Aroid Dashboards/World Climate Map/WTE SHAPE FILES/';
const WTE_BASE = process.env.WTE_BASE || 'wte_012';
const SC = +(process.env.SC || 1);
const W = 2160*SC, H = 1080*SC, STEP = 1 / (6*SC);
const colOf = lon => Math.min(W - 1, Math.max(0, Math.floor((lon + 180) / STEP)));
const rowOf = lat => Math.min(H - 1, Math.max(0, Math.floor((90 - lat) / STEP)));
const latOfRow = r => 90 - (r + 0.5) * STEP;

const MOISTURE = ['Moist', 'Dry', 'Desert'];

function zoneOf(classname) {
  const words = classname.split(/\s+/);
  for (let i = 1; i < words.length; i++) {
    if (MOISTURE.includes(words[i])) return words.slice(0, i + 1).join(' ');
  }
  return null; /* e.g. pure water/ice classes with no moisture domain */
}

function buildZoneGrid() {
  const dbf = fs.readFileSync(WTE_DIR + WTE_BASE + '.dbf');
  const nRec = dbf.readUInt32LE(4), hdrSize = dbf.readUInt16LE(8), recSize = dbf.readUInt16LE(10);
  const fields = []; let fo = 32;
  while (dbf[fo] !== 0x0D) {
    fields.push({ name: dbf.toString('ascii', fo, fo + 11).replace(/\0.*$/, ''), len: dbf[fo + 16] });
    fo += 32;
  }
  const cnIdx = fields.findIndex(f => f.name === 'CLASSNAME');
  const cnOff = 1 + fields.slice(0, cnIdx).reduce((a, f) => a + f.len, 0);
  const cnLen = fields[cnIdx].len;
  const classnames = [];
  for (let i = 0; i < nRec; i++) {
    const o = hdrSize + i * recSize;
    classnames.push(dbf.toString('ascii', o + cnOff, o + cnOff + cnLen).trim());
  }

  /* zone ids */
  const zoneIds = new Map(); const zoneNames = [];
  const zoneOfRec = classnames.map(cn => {
    const z = zoneOf(cn);
    if (z == null) return -1;
    if (!zoneIds.has(z)) { zoneIds.set(z, zoneNames.length); zoneNames.push(z); }
    return zoneIds.get(z);
  });

  const shp = fs.readFileSync(WTE_DIR + WTE_BASE + '.shp');
  const grid = new Int16Array(W * H).fill(-1);
  let off = 100, rec = 0;
  while (off + 8 <= shp.length) {
    const contentLen = shp.readUInt32BE(off + 4) * 2;
    const c = off + 8;
    off = c + contentLen;
    const shapeType = shp.readInt32LE(c);
    const zid = zoneOfRec[rec]; rec++;
    if (shapeType !== 5) continue;
    if (zid < 0) continue;
    const numParts = shp.readInt32LE(c + 36);
    const numPoints = shp.readInt32LE(c + 40);
    const partsAt = c + 44, pointsAt = partsAt + 4 * numParts;
    const parts = [];
    for (let p = 0; p < numParts; p++) parts.push(shp.readInt32LE(partsAt + 4 * p));
    parts.push(numPoints);

    /* bucket edges by grid row so each row only tests edges that cross it */
    const buckets = new Map();
    for (let p = 0; p < numParts; p++) {
      for (let i = parts[p], j = parts[p + 1] - 1; i < parts[p + 1]; j = i++) {
        const x1 = shp.readDoubleLE(pointsAt + 16 * j), y1 = shp.readDoubleLE(pointsAt + 16 * j + 8);
        const x2 = shp.readDoubleLE(pointsAt + 16 * i), y2 = shp.readDoubleLE(pointsAt + 16 * i + 8);
        if (y1 === y2) continue;
        const rTop = rowOf(Math.max(y1, y2)), rBot = rowOf(Math.min(y1, y2));
        for (let r = rTop; r <= rBot; r++) {
          let b = buckets.get(r); if (!b) { b = []; buckets.set(r, b); }
          b.push(x1, y1, x2, y2);
        }
      }
    }
    for (const [row, e] of buckets) {
      const y = latOfRow(row);
      const xs = [];
      for (let k = 0; k < e.length; k += 4) {
        const x1 = e[k], y1 = e[k + 1], x2 = e[k + 2], y2 = e[k + 3];
        if ((y1 > y) !== (y2 > y)) xs.push(x1 + (y - y1) / (y2 - y1) * (x2 - x1));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const c0 = colOf(xs[k] + 1e-9), c1 = colOf(xs[k + 1] - 1e-9);
        for (let col = c0; col <= c1; col++) {
          const lon = -180 + (col + 0.5) * STEP;
          if (lon >= xs[k] && lon <= xs[k + 1]) grid[row * W + col] = zid;
        }
      }
    }
  }
  return { grid, zoneNames };
}



/* ==== PER-ZONE CLIMATE STATISTICS  v1 (8.31.26) ====================
   The genus map's climate legend needs a temperature and humidity range
   per WTE zone. The per-place rows cannot give it honestly - reading
   them back and taking month extremes runs far too wide - so this
   measures the zone's OWN pixels, with the same percentile discipline
   the place rows use (p05/p95, and the TYPICAL daily RH swing rather
   than the triple extreme).
   Reads the same WorldClim 2.1 10-arcmin rasters as the climate build.
   OUT: _zone-stats.json  {zone: {t:[lo,hi], rh:[lo,hi], n}}         */
const CLIM = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/JS JAVASCRIPT CODE/climate-cache/';
const NOD = -1e30;
const es = t => 0.6108 * Math.exp(17.27 * t / (t + 237.3));

async function loadVar(name) {
  const months = [];
  for (let m = 1; m <= 12; m++) {
    const f = `${CLIM}${name}/wc2.1_10m_${name}_${String(m).padStart(2, '0')}.tif`;
    const img = await (await fromFile(f)).getImage();
    if (img.getWidth() !== W || img.getHeight() !== H)
      throw new Error(f + ': unexpected size');
    months.push((await img.readRasters())[0]);
  }
  console.log('  loaded', name);
  return months;
}
const median = a => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y);
  const h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };
const pct = (a, p) => { if (!a.length) return null; const s = Float64Array.from(a).sort();
  return s[Math.min(s.length - 1, Math.max(0, Math.round((s.length - 1) * p)))]; };

console.log('rasterizing WTE zones…');
const { grid, zoneNames } = buildZoneGrid();
console.log('loading rasters…');
const TN = await loadVar('tmin'), TX = await loadVar('tmax'), VP = await loadVar('vapr');

const acc = zoneNames.map(() => ({ tLo: [], tHi: [], rLo: [], rHi: [] }));
let used = 0;
for (let i = 0; i < W * H; i++) {
  const z = grid[i];
  if (z < 0) continue;
  let ok = true, coldest = 1e9, hottest = -1e9;
  const rl = [], rh = [];
  for (let m = 0; m < 12; m++) {
    const tn = TN[m][i], tx = TX[m][i], vp = VP[m][i];
    if (tn < NOD || tx < NOD || !isFinite(tn) || !isFinite(tx)) { ok = false; break; }
    if (tn < coldest) coldest = tn;
    if (tx > hottest) hottest = tx;
    if (vp > NOD && isFinite(vp)) {
      rh.push(Math.max(0, Math.min(100, 100 * vp / es(tn))));   /* dawn, humid */
      rl.push(Math.max(0, Math.min(100, 100 * vp / es(tx))));   /* afternoon, dry */
    }
  }
  if (!ok) continue;
  const a = acc[z];
  a.tLo.push(coldest); a.tHi.push(hottest);
  if (rh.length) { a.rHi.push(median(rh)); a.rLo.push(median(rl)); }
  used++;
}
console.log('pixels measured:', used);
const out = {};
zoneNames.forEach((nm, z) => {
  const a = acc[z];
  if (a.tLo.length < 20) return;
  out[nm] = {
    n: a.tLo.length,
    t: [Math.round(pct(a.tLo, 0.05)), Math.round(pct(a.tHi, 0.95))],
    rh: [Math.round(pct(a.rLo, 0.05)), Math.round(pct(a.rHi, 0.95))],
  };
  console.log('  %s  n=%d  %d to %d C  %d-%d%% RH', nm.padEnd(24), out[nm].n,
    out[nm].t[0], out[nm].t[1], out[nm].rh[0], out[nm].rh[1]);
});
fs.writeFileSync('_zone-stats.json', JSON.stringify(out, null, 1));
console.log('wrote _zone-stats.json (%d zones)', Object.keys(out).length);
