import { chromium } from 'playwright';
import fs from 'fs';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const R = 'C:/Users/nli0490/Claude/Aroidpedia/docs/';
const TAG = process.argv[2] || 'new';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 2 });
await p.route('**/footer.js*', r => r.fulfill({ body: fs.readFileSync(R+'footer.js','utf8'), contentType:'application/javascript', headers:{'access-control-allow-origin':'*'} }));
await p.route('**/climate-zones.json*', r => r.fulfill({ body: fs.readFileSync(R+'climate-zones.json','utf8'), contentType:'application/json', headers:{'access-control-allow-origin':'*'} }));
await p.route('**/climate-zones.png*', r => r.fulfill({ body: fs.readFileSync(process.env.PNGFILE || (R+'climate-zones.png')), contentType:'image/png', headers:{'access-control-allow-origin':'*'} }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.evaluate(() => { const c=[...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='climate'); if(c) c.click(); });
await p.waitForTimeout(4000);
/* Java + Bali + Lombok, then New Guinea */
for (const [nm, vb] of [['java','105 5.4 12 5.6'], ['papua','131 1.5 18 8.4']]) {
  await p.evaluate(v => document.querySelector('.apgm svg').setAttribute('viewBox', v), vb);
  await p.waitForTimeout(500);
  await svgH.screenshot({ path: SP + 'res-' + nm + '-' + TAG + '.png' });
}
console.log('done', TAG);
await b.close();
