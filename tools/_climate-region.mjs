/* PREVIEW ONLY — regional raster from climate.shp, the finest source on
   the drive (7.5M polygons, ~175 m minimum segment). Streams the 1.75 GB
   shapefile so it never has to sit in memory, resolves each polygon's
   gridcode through A.dbf (Value -> Temperature + Moisture), and paints
   one lon/lat box.
   env: BBOX="lonMin,latMin,lonMax,latMax" STEPDEG OUT                  */
import fs from 'fs';
import zlib from 'zlib';
import { TEMP, MOIST, colourFor } from './_wte-palette.mjs';

const B = 'G:/My Drive/PlantsV2/Tableau Aroid Dashboards/World Climate Map/';
const [LO0, LA0, LO1, LA1] = (process.env.BBOX || '105,-9,116,-5').split(',').map(Number);
const STEP = +(process.env.STEPDEG || 0.0035);
const OUT = process.env.OUT || 'region-fine.png';
const W = Math.round((LO1 - LO0) / STEP), H = Math.round((LA1 - LA0) / STEP);
const colOf = lon => Math.floor((lon - LO0) / STEP);
const rowOf = lat => Math.floor((LA1 - lat) / STEP);
const latOfRow = r => LA1 - (r + 0.5) * STEP;
console.log('region %dx%d at %s deg', W, H, STEP.toFixed(4));

/* ---- gridcode -> zone id ---- */
const val2zone = JSON.parse(fs.readFileSync('_val2zone.json', 'utf8'));
const zoneNames = [];
const zoneIdOfVal = new Int16Array(1000).fill(-1);
Object.keys(val2zone).forEach(v => {
  const z = val2zone[v];
  let i = zoneNames.indexOf(z);
  if (i < 0) { i = zoneNames.length; zoneNames.push(z); }
  zoneIdOfVal[+v] = i;
});

/* ---- every polygon's gridcode, in record order ---- */
console.log('reading climate.dbf…');
const gcodes = (() => {
  const fd = fs.openSync(B + 'climate.dbf', 'r');
  const head = Buffer.alloc(1024); fs.readSync(fd, head, 0, 1024, 0);
  const n = head.readUInt32LE(4), hdr = head.readUInt16LE(8), rec = head.readUInt16LE(10);
  const out = new Int16Array(n);
  const CH = 64 * 1024 * 1024, per = Math.floor(CH / rec) * rec;
  const buf = Buffer.alloc(per);
  let pos = hdr, i = 0;
  while (i < n) {
    const got = fs.readSync(fd, buf, 0, per, pos);
    if (!got) break;
    const cnt = Math.floor(got / rec);
    for (let k = 0; k < cnt && i < n; k++, i++) {
      out[i] = parseInt(buf.toString('ascii', k * rec + 11, k * rec + 21), 10) || 0;
    }
    pos += cnt * rec;
  }
  fs.closeSync(fd);
  console.log('  gridcodes:', n.toLocaleString());
  return out;
})();

/* ---- stream climate.shp, rasterising only what meets the box ---- */
const grid = new Int16Array(W * H).fill(-1);
{
  const F = B + 'climate.shp';
  const fd = fs.openSync(F, 'r'), size = fs.statSync(F).size;
  const CH = 96 * 1024 * 1024, buf = Buffer.alloc(CH);
  let pos = 100, rec = 0, hitRecs = 0, t0 = Date.now();
  while (pos < size) {
    const got = fs.readSync(fd, buf, 0, Math.min(CH, size - pos), pos);
    if (!got) break;
    let o = 0;
    while (o + 8 <= got) {
      const contentLen = buf.readUInt32BE(o + 4) * 2, c = o + 8;
      if (c + contentLen > got) break;
      o = c + contentLen;
      const gid = gcodes[rec]; rec++;
      if (buf.readInt32LE(c) !== 5) continue;
      const zid = gid > 0 && gid < 1000 ? zoneIdOfVal[gid] : -1;
      if (zid < 0) continue;
      const xMin = buf.readDoubleLE(c + 4), yMin = buf.readDoubleLE(c + 12);
      const xMax = buf.readDoubleLE(c + 20), yMax = buf.readDoubleLE(c + 28);
      if (xMax < LO0 || xMin > LO1 || yMax < LA0 || yMin > LA1) continue;
      hitRecs++;
      const numParts = buf.readInt32LE(c + 36), numPoints = buf.readInt32LE(c + 40);
      const partsAt = c + 44, pointsAt = partsAt + 4 * numParts;
      const parts = []; for (let p = 0; p < numParts; p++) parts.push(buf.readInt32LE(partsAt + 4 * p));
      parts.push(numPoints);
      const buckets = new Map();
      for (let p = 0; p < numParts; p++) {
        for (let i = parts[p], j = parts[p + 1] - 1; i < parts[p + 1]; j = i++) {
          const x1 = buf.readDoubleLE(pointsAt + 16 * j), y1 = buf.readDoubleLE(pointsAt + 16 * j + 8);
          const x2 = buf.readDoubleLE(pointsAt + 16 * i), y2 = buf.readDoubleLE(pointsAt + 16 * i + 8);
          if (y1 === y2) continue;
          if (Math.max(y1, y2) < LA0 || Math.min(y1, y2) > LA1) continue;
          const rTop = Math.max(0, rowOf(Math.min(LA1, Math.max(y1, y2))));
          const rBot = Math.min(H - 1, rowOf(Math.max(LA0, Math.min(y1, y2))));
          for (let r = rTop; r <= rBot; r++) {
            let bb = buckets.get(r); if (!bb) { bb = []; buckets.set(r, bb); }
            bb.push(x1, y1, x2, y2);
          }
        }
      }
      for (const [row, e] of buckets) {
        const y = latOfRow(row), xs = [];
        for (let k = 0; k < e.length; k += 4) {
          const x1 = e[k], y1 = e[k + 1], x2 = e[k + 2], y2 = e[k + 3];
          if ((y1 > y) !== (y2 > y)) xs.push(x1 + (y - y1) / (y2 - y1) * (x2 - x1));
        }
        xs.sort((a, b) => a - b);
        for (let k = 0; k + 1 < xs.length; k += 2) {
          const c0 = Math.max(0, colOf(xs[k] + 1e-9)), c1 = Math.min(W - 1, colOf(xs[k + 1] - 1e-9));
          for (let col = c0; col <= c1; col++) {
            const lon = LO0 + (col + 0.5) * STEP;
            if (lon >= xs[k] && lon <= xs[k + 1]) grid[row * W + col] = zid;
          }
        }
      }
    }
    if (o === 0) break;
    pos += o;
    if (rec % 2000000 < 5000) console.log('  %s%% (%s recs, %s in box)',
      (100 * pos / size).toFixed(0), rec.toLocaleString(), hitRecs.toLocaleString());
  }
  fs.closeSync(fd);
  console.log('  scanned %s polygons, %s met the box, %ss',
    rec.toLocaleString(), hitRecs.toLocaleString(), ((Date.now() - t0) / 1000).toFixed(0));
}

/* ---- ocean-aware fill, as the shipped builder does ---- */
const N = W * H, ocean = new Uint8Array(N);
{
  const q = new Int32Array(N); let qh = 0, qt = 0;
  const push = i => { if (grid[i] < 0 && !ocean[i]) { ocean[i] = 1; q[qt++] = i; } };
  for (let c = 0; c < W; c++) { push(c); push((H - 1) * W + c); }
  for (let r = 0; r < H; r++) { push(r * W); push(r * W + W - 1); }
  while (qh < qt) { const i = q[qh++], r = (i / W) | 0, c = i % W;
    if (r > 0) push(i - W); if (r < H - 1) push(i + W);
    if (c > 0) push(i - 1); if (c < W - 1) push(i + 1); }
}
const out = Int16Array.from(grid), dist = new Int32Array(N).fill(-1);
{
  const q = new Int32Array(N); let qh = 0, qt = 0;
  for (let i = 0; i < N; i++) if (grid[i] >= 0) { dist[i] = 0; q[qt++] = i; }
  const FR = Math.max(2, Math.round(0.11 / STEP));
  while (qh < qt) {
    const i = q[qh++], r = (i / W) | 0, c = i % W, d = dist[i];
    const nb = [r > 0 ? i - W : -1, r < H - 1 ? i + W : -1, c > 0 ? i - 1 : -1, c < W - 1 ? i + 1 : -1];
    for (const j of nb) {
      if (j < 0 || dist[j] >= 0) continue;
      if (ocean[j] && d + 1 > FR) continue;
      dist[j] = d + 1; out[j] = out[i]; q[qt++] = j;
    }
  }
}

/* ---- indexed PNG ---- */
const pal = [[0, 0, 0]], idxOf = new Int16Array(zoneNames.length).fill(0);
zoneNames.forEach((z, i) => {
  const t = TEMP.findIndex(x => z.startsWith(x)), m = MOIST.findIndex(x => z.endsWith(x));
  if (t < 0 || m < 0) return;
  pal.push(colourFor(t, m, z)); idxOf[i] = pal.length - 1;
});
const raw = Buffer.alloc(H * (W + 1));
for (let r = 0; r < H; r++) { raw[r * (W + 1)] = 0;
  for (let c = 0; c < W; c++) { const z = out[r * W + c]; raw[r * (W + 1) + 1 + c] = z >= 0 ? idxOf[z] : 0; } }
const crcT = (() => { const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
const crc = b => { let c = -1; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (ty, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(ty, 'ascii'), data]);
  const cc = Buffer.alloc(4); cc.writeUInt32BE(crc(td)); return Buffer.concat([l, td, cc]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 3;
fs.writeFileSync(OUT, Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  chunk('IHDR', ihdr), chunk('PLTE', Buffer.from(pal.flat())),
  chunk('tRNS', Buffer.from([0, ...pal.slice(1).map(() => 255)])),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]));
console.log('wrote %s  %dx%d  %s KB', OUT, W, H, (fs.statSync(OUT).size / 1024).toFixed(1));
