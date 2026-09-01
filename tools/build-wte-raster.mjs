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



/* ============ v1 (8.31.26) — WTE CLIMATE RASTER for the genus map ====
   Global, palette-indexed PNG in plain lon/-lat, so it registers on the
   map's own coordinate space with no reprojection. ONE raster, ONE
   fixed palette: a zone is the same colour on every genus page (the
   species ramp normalises per genus; this must NOT).
   Gaps: WTE leaves ~60k enclosed cells unclassified inside land -
   lakes, ice, and classes carrying no moisture domain - which read as
   black speckle. Enclosed holes are filled from their NEAREST
   classified neighbour (multi-source BFS), while true ocean, found by
   flooding inward from the map border, is left alone but given a small
   coastal fringe so a clipped coastline shows no dark rim.          */
import { TEMP, MOIST as MOIST3, colourFor } from './_wte-palette.mjs';

const { grid, zoneNames } = buildZoneGrid();
const N = W * H;

/* ---- 1. ocean = unclassified and reachable from the border ---- */
const ocean = new Uint8Array(N);
{
  const q = new Int32Array(N); let qh = 0, qt = 0;
  const push = i => { if (grid[i] < 0 && !ocean[i]) { ocean[i] = 1; q[qt++] = i; } };
  for (let c = 0; c < W; c++) { push(c); push((H - 1) * W + c); }
  for (let r = 0; r < H; r++) { push(r * W); push(r * W + W - 1); }
  while (qh < qt) {
    const i = q[qh++], r = (i / W) | 0, c = i % W;
    if (r > 0) push(i - W);
    if (r < H - 1) push(i + W);
    push(r * W + (c + W - 1) % W);            /* wrap the antimeridian */
    push(r * W + (c + 1) % W);
  }
}

/* ---- 2. nearest-classified fill: all enclosed holes, plus a
         bounded coastal fringe into the ocean ---- */
const FRINGE = 4 * SC;
const out = Int16Array.from(grid);
/* Uint16 is plenty for a hop count and saves ~1.3 GB at the finest
   step; 0xFFFF is the unvisited sentinel. */
const UNSEEN = 0xFFFF;
const dist = new Uint16Array(N).fill(UNSEEN);
{
  const q = new Int32Array(N); let qh = 0, qt = 0;
  for (let i = 0; i < N; i++) if (grid[i] >= 0) { dist[i] = 0; q[qt++] = i; }
  const seed = qt;
  while (qh < qt) {
    const i = q[qh++], r = (i / W) | 0, c = i % W, d = dist[i];
    const nb = [ r > 0 ? i - W : -1, r < H - 1 ? i + W : -1,
                 r * W + (c + W - 1) % W, r * W + (c + 1) % W ];
    for (const j of nb) {
      if (j < 0 || dist[j] !== UNSEEN) continue;
      if (ocean[j] && d + 1 > FRINGE) continue;   /* sea stays sea */
      dist[j] = Math.min(UNSEEN - 1, d + 1); out[j] = out[i]; q[qt++] = j;
    }
  }
  console.log('seeded %d classified cells; filled %d (holes + %d-cell coastal fringe)',
    seed, qt - seed, FRINGE);
}
let holesLeft = 0;
for (let i = 0; i < N; i++) if (out[i] < 0 && !ocean[i]) holesLeft++;
console.log('enclosed land cells still unclassified:', holesLeft);

/* ---- 3. palette-indexed PNG ---- */
const pal = [[0, 0, 0]];
const idxOf = new Int16Array(zoneNames.length).fill(0);
zoneNames.forEach((z, i) => {
  const t = TEMP.findIndex(x => z.startsWith(x));
  const m = MOIST3.findIndex(x => z.endsWith(x));
  if (t < 0 || m < 0) return;
  pal.push(colourFor(t, m, z));
  idxOf[i] = pal.length - 1;
});
const raw = Buffer.alloc(H * (W + 1));
for (let r = 0; r < H; r++) {
  raw[r * (W + 1)] = 0;
  for (let c = 0; c < W; c++) {
    const z = out[r * W + c];
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
ihdr[8] = 8; ihdr[9] = 3;
const png = Buffer.concat([
  Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]),
  chunk('IHDR', ihdr),
  chunk('PLTE', Buffer.from(pal.flat())),
  chunk('tRNS', Buffer.from([0, ...pal.slice(1).map(() => 255)])),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);
const DOCS = 'C:/Users/nli0490/Claude/Aroidpedia/docs/';
const OUT = (process.env.SHIP ? DOCS + 'climate-zones.png'
  : 'C:/Users/nli0490/Claude/aroidpedia-climate/wte-' + (process.env.PALETTE || 'tuned') + (SC > 1 ? '-x' + SC : '') + '.png');
fs.writeFileSync(OUT, png);
console.log('wrote %s  %s KB  (%d zones)', OUT.split('/').pop(), (png.length / 1024).toFixed(1), pal.length - 1);

/* ---- the sidecar the map reads: palette order, names, ranges ---- */
if (process.env.SHIP) {
  let stats = {};
  try { stats = JSON.parse(fs.readFileSync('_zone-stats.json', 'utf8')); } catch (e) {}
  const hex = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  const zones = [null];                       /* index 0 = no data */
  zoneNames.forEach((z, i) => {
    if (!idxOf[i]) return;
    const st = stats[z] || null;
    zones[idxOf[i]] = { name: z, hex: hex(pal[idxOf[i]]),
                        t: st ? st.t : null, rh: st ? st.rh : null };
  });
  const side = {
    v: '1.0.0',
    generated: new Date().toISOString().slice(0, 10),
    grid: { w: W, h: H, lon: [-180, 180], lat: [-90, 90] },
    source: 'World Terrestrial Ecosystems temperature x moisture domains ' +
            '(Sayre et al. 2020). Palette-indexed PNG in plain lon/-lat: it ' +
            'registers on the map viewBox with no reprojection. Enclosed ' +
            'unclassified cells (water, ice, classes with no moisture domain) ' +
            'are filled from their nearest classified neighbour; true ocean, ' +
            'found by flooding in from the border, is left alone. t=[p05 of ' +
            'coldest-month tmin, p95 of hottest-month tmax] degC and rh=[p05, ' +
            'p95] of the TYPICAL daily swing, both measured over each zone ' +
            'own 10-arcmin pixels (build-zone-stats.mjs).',
    zones,
  };
  fs.writeFileSync(DOCS + 'climate-zones.json', JSON.stringify(side));
  console.log('wrote climate-zones.json  %d zones, %d with ranges',
    zones.filter(Boolean).length, zones.filter(z => z && z.t).length);
}
