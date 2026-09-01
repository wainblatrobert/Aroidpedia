import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { fromFile } = require('geotiff');
const B = 'G:/My Drive/PlantsV2/Tableau Aroid Dashboards/World Climate Map/';
const t = await fromFile(B + 'World_Ecosystems.tif');
const img = await t.getImage();
const bb = img.getBoundingBox();
console.log('World_Ecosystems.tif');
console.log('  size      :', img.getWidth(), 'x', img.getHeight());
console.log('  bbox      :', bb.map(v => +v.toFixed(4)).join(', '));
console.log('  cell size :', ((bb[2]-bb[0])/img.getWidth()).toFixed(6), 'deg  (~',
            (((bb[2]-bb[0])/img.getWidth())*111*1000).toFixed(0), 'm )');
console.log('  samples   :', img.getSamplesPerPixel(), '| bits', img.getBitsPerSample());
/* the shipped raster for comparison */
console.log('  shipped   : 0.027800 deg  (~3089 m )');
