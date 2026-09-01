import fs from 'fs';
import zlib from 'zlib';
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



const { grid, zoneNames } = buildZoneGrid();
/* spread sample points per zone, away from zone edges so a coarse tile
   pixel cannot land on a neighbour */
const pure = (r, c, z) => {
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    const rr = r + dr, cc = (c + dc + W) % W;
    if (rr < 0 || rr >= H) return false;
    if (grid[rr * W + cc] !== z) return false;
  }
  return true;
};
const out = {};
zoneNames.forEach((nm, z) => {
  const hits = [];
  for (let r = 2; r < H - 2 && hits.length < 4000; r += 3)
    for (let c = 2; c < W - 2; c += 3)
      if (grid[r * W + c] === z && pure(r, c, z)) hits.push([r, c]);
  const step = Math.max(1, Math.floor(hits.length / 14));
  out[nm] = hits.filter((_, i) => i % step === 0).slice(0, 14)
    .map(([r, c]) => [ +(-180 + (c + 0.5) * STEP).toFixed(4), +(90 - (r + 0.5) * STEP).toFixed(4) ]);
  console.log(nm.padEnd(24), hits.length + ' pure cells ->', out[nm].length + ' samples');
});
fs.writeFileSync('_zone-samples.json', JSON.stringify(out));
