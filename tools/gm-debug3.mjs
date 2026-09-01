import { chromium } from 'playwright';
import fs from 'fs';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
p.on('pageerror', e => console.log('PAGEERROR:', e.message.slice(0, 300)));
p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE-ERR:', m.text().slice(0, 300)); });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('--- clicking countries ---');
await p.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === 'countries');
  if (z) z.click();
});
await p.waitForTimeout(1000);
console.log('cov count:', await p.evaluate(() => document.querySelectorAll('.apgm .apgm-cov').length));
await b.close();
