import fs from 'fs';
const F = 'G:/My Drive/PlantsV2/Tableau Aroid Dashboards/World Climate Map/climate.shp';
const fd = fs.openSync(F, 'r');
const CH = 64 * 1024 * 1024;
const buf = Buffer.alloc(CH);
const n = fs.readSync(fd, buf, 0, CH, 0);
fs.closeSync(fd);
let off = 100, recs = 0, segs = 0, len = 0, minSeg = 1e9, pts = 0;
const codes = new Set();
while (off + 8 <= n) {
  const contentLen = buf.readUInt32BE(off + 4) * 2, c = off + 8;
  if (c + contentLen > n) break;
  off = c + contentLen;
  if (buf.readInt32LE(c) !== 5) { recs++; continue; }
  recs++;
  const numParts = buf.readInt32LE(c + 36), numPoints = buf.readInt32LE(c + 40);
  const partsAt = c + 44, pointsAt = partsAt + 4 * numParts;
  const parts = []; for (let p = 0; p < numParts; p++) parts.push(buf.readInt32LE(partsAt + 4 * p));
  parts.push(numPoints);
  pts += numPoints;
  for (let p = 0; p < numParts; p++) {
    for (let i = parts[p] + 1; i < parts[p + 1]; i++) {
      const x1 = buf.readDoubleLE(pointsAt + 16 * (i - 1)), y1 = buf.readDoubleLE(pointsAt + 16 * (i - 1) + 8);
      const x2 = buf.readDoubleLE(pointsAt + 16 * i), y2 = buf.readDoubleLE(pointsAt + 16 * i + 8);
      const d = Math.hypot(x2 - x1, y2 - y1);
      if (d > 1e-12) { segs++; len += d; if (d < minSeg) minSeg = d; }
    }
  }
}
console.log('climate.shp — first %s MB sampled', (n / 1048576).toFixed(0));
console.log('  polygons in sample :', recs.toLocaleString(), '| vertices', pts.toLocaleString());
console.log('  mean segment       : %s deg  (~%s km)', (len / segs).toFixed(5), ((len / segs) * 111).toFixed(2));
console.log('  MIN  segment       : %s deg  (~%s m)', minSeg.toFixed(5), (minSeg * 111000).toFixed(0));
console.log('  shipped raster     : 0.02780 deg  (~3089 m)');
console.log('  WTE.shp 10x        : 0.01588 deg  (~1763 m)');
