import { chromium } from 'playwright';
import fs from 'fs';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js','utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const g of ['alocasia','arum']) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
  await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: {'access-control-allow-origin':'*'} }));
  await p.goto('https://www.aroidpedia.com/'+g, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(13000);
  console.log('==', g, await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const rows = [];
    svg.querySelectorAll('.apgm-cg').forEach(el => {
      const bb = el.getBBox();
      rows.push({ z: el.getAttribute('data-zone'),
        lit: +parseFloat(getComputedStyle(el).fillOpacity).toFixed(2),
        x0:+bb.x.toFixed(1), x1:+(bb.x+bb.width).toFixed(1),
        y0:+bb.y.toFixed(1), y1:+(bb.y+bb.height).toFixed(1) });
    });
    rows.sort((a,c)=>(c.y1-c.y0)-(a.y1-a.y0));
    return '\n' + rows.map(r=>'  '+r.z.padEnd(24)+' lit='+r.lit+' x '+r.x0+'..'+r.x1+'  y '+r.y0+'..'+r.y1).join('\n');
  }));
  await p.close();
}
await b.close();
