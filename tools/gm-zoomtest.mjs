import { chromium } from 'playwright';
import fs from 'fs';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
for (let i = 0; i < 5; i++) {
  await p.evaluate(() => { [...document.querySelectorAll('.apgm button')].find(x => x.textContent.trim() === '+').click(); });
  await p.waitForTimeout(150);
}
console.log('after 5x plus: zoomed class =', await p.evaluate(() => document.querySelector('.apgm svg').classList.contains('apgm--zoomed')),
  '| borders stroke =', await p.evaluate(() => getComputedStyle(document.querySelector('.apgm-borders')).stroke));
await b.close();
