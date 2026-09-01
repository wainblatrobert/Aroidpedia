import fs from 'fs';
const D='G:/My Drive/PlantsV2/Tableau Aroid Dashboards/World Climate Map/WTE SHAPE FILES/';
const shp=fs.readFileSync(process.env.SHPFILE || (D+'wte_012.shp'));
let off=100, recs=0, pts=0, segs=0, len=0, minSeg=1e9;
while(off+8<=shp.length){
  const cl=shp.readUInt32BE(off+4)*2, c=off+8; off=c+cl;
  if(shp.readInt32LE(c)!==5) continue;
  recs++;
  const nP=shp.readInt32LE(c+36), nPt=shp.readInt32LE(c+40);
  const pa=c+44, po=pa+4*nP; pts+=nPt;
  const parts=[]; for(let p=0;p<nP;p++) parts.push(shp.readInt32LE(pa+4*p));
  parts.push(nPt);
  for(let p=0;p<nP;p++) for(let i=parts[p]+1;i<parts[p+1];i++){
    const x1=shp.readDoubleLE(po+16*(i-1)), y1=shp.readDoubleLE(po+16*(i-1)+8);
    const x2=shp.readDoubleLE(po+16*i),     y2=shp.readDoubleLE(po+16*i+8);
    const d=Math.hypot(x2-x1,y2-y1);
    if(d>0){ segs++; len+=d; if(d<minSeg) minSeg=d; }
  }
}
console.log('polygon records:', recs, '| vertices:', pts.toLocaleString());
console.log('mean segment: %s deg  (~%s km)  min: %s deg', (len/segs).toFixed(4), ((len/segs)*111).toFixed(1), minSeg.toFixed(5));
console.log('shipped raster = 1/36 deg = %s deg (~%s km)', (1/36).toFixed(4), (111/36).toFixed(1));
