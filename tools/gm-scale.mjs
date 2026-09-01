import { chromium } from 'playwright';
import fs from 'fs';
const MODE = process.argv[2] || 'local';
const JS = MODE === 'local' ? fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js','utf8') : null;
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const g of ['arum','alocasia','amorphophallus']) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
  if (JS) await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: {'access-control-allow-origin':'*'} }));
  await p.goto('https://www.aroidpedia.com/'+g, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(13000);
  console.log(MODE, g.padEnd(15), await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect();
    const scale = Math.min(r.width/vb.width, r.height/vb.height);   /* meet */
    return 'svg=' + Math.round(r.width) + 'x' + Math.round(r.height) +
      ' vb=' + vb.width.toFixed(1) + 'x' + vb.height.toFixed(1) +
      ' px/deg=' + scale.toFixed(2) +
      ' limited=' + ((r.width/vb.width) < (r.height/vb.height) ? 'width' : 'height');
  }));
  await p.close();
}
await b.close();
