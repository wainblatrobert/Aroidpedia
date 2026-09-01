import fs from 'fs';
import zlib from 'zlib';
/* decode our own indexed PNG back to a grid to inspect gaps */
const buf = fs.readFileSync('wte-zones-x3.png');
let off = 8, W=0, H=0, idat = [];
while (off < buf.length) {
  const len = buf.readUInt32BE(off), type = buf.toString('ascii', off+4, off+8);
  const data = buf.slice(off+8, off+8+len);
  if (type === 'IHDR') { W = data.readUInt32BE(0); H = data.readUInt32BE(4); }
  if (type === 'IDAT') idat.push(data);
  off += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idat));
const g = new Uint8Array(W*H);
for (let r=0;r<H;r++) for (let c=0;c<W;c++) g[r*W+c] = raw[r*(W+1)+1+c];
console.log('grid', W+'x'+H);
let zero=0, nz=0;
for (let i=0;i<W*H;i++) (g[i]===0?zero++:nz++);
console.log('classified %d (%.1f%%)  unclassified %d', nz, 100*nz/(W*H), zero);
/* how many unclassified cells touch a classified one (interior/coastal fringe) */
let fringe=0;
const at=(r,c)=> (r<0||c<0||r>=H||c>=W) ? 0 : g[r*W+c];
for (let r=0;r<H;r++) for (let c=0;c<W;c++) {
  if (g[r*W+c]) continue;
  if (at(r-1,c)||at(r+1,c)||at(r,c-1)||at(r,c+1)) fringe++;
}
console.log('unclassified cells adjacent to a classified cell: %d', fringe);
/* small holes: unclassified with >=5 of 8 neighbours classified */
let holes=0;
for (let r=0;r<H;r++) for (let c=0;c<W;c++) {
  if (g[r*W+c]) continue;
  let n=0;
  for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) if (dr||dc) if (at(r+dr,c+dc)) n++;
  if (n>=5) holes++;
}
console.log('ENCLOSED holes (>=5 of 8 neighbours classified): %d', holes);
