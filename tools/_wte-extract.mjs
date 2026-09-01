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


/* ---- bivariate palette: hue = temperature band, value = moisture ---- */
const TEMP  = ['Tropical','Sub Tropical','Warm Temperate','Cool Temperate','Boreal','Polar'];
const MOIST3 = ['Moist','Dry','Desert'];
/* warm->cool hue walk, kept inside the site's sage/sand range */
const HUE = [[122,150,96],[150,166,104],[168,158,104],[132,150,140],[110,132,146],[150,160,175]];
const MOD = [1.0, 0.78, 0.58];      /* Moist / Dry / Desert */
const { grid, zoneNames } = buildZoneGrid();
console.log('zones:', zoneNames.length, zoneNames.join(' | '));

const pal = [[0,0,0]];              /* index 0 = transparent */
const idxOf = new Int16Array(zoneNames.length).fill(0);
zoneNames.forEach((z, i) => {
  const t = TEMP.findIndex(x => z.startsWith(x));
  const m = MOIST3.findIndex(x => z.endsWith(x));
  if (t < 0 || m < 0) return;
  const base = HUE[t], k = MOD[m];
  pal.push([Math.round(base[0]*k), Math.round(base[1]*k), Math.round(base[2]*k)]);
  idxOf[i] = pal.length - 1;
});

/* ---- minimal indexed PNG ---- */
const raw = Buffer.alloc(H * (W + 1));
for (let r = 0; r < H; r++) {
  raw[r * (W + 1)] = 0;                       /* filter: none */
  for (let c = 0; c < W; c++) {
    const z = grid[r * W + c];
    raw[r * (W + 1) + 1 + c] = z >= 0 ? idxOf[z] : 0;
  }
}
const crcT = (() => { const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
  return t; })();
const crc = b => { let c = -1; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const cc = Buffer.alloc(4); cc.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, cc]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 3; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const plte = Buffer.from(pal.flat());
const trns = Buffer.from([0, ...pal.slice(1).map(() => 255)]);
const png = Buffer.concat([
  Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]),
  chunk('IHDR', ihdr), chunk('PLTE', plte), chunk('tRNS', trns),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
]);
fs.writeFileSync('C:/Users/nli0490/Claude/aroidpedia-climate/wte-zones' + (SC>1?('-x'+SC):'') + '.png', png);
console.log('wrote wte-zones.png  %s KB  (%d colours)', (png.length/1024).toFixed(1), pal.length-1);
