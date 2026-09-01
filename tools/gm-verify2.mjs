import { chromium } from 'playwright';
import fs from 'fs';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
for (const v of ['continents','regions','countries']) {
  await p.evaluate(vv => {
    const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === vv);
    if (z) z.click();
  }, v);
  await p.waitForTimeout(700);
  console.log(v + ': ' + await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    return ['Borneo','New Guinea','Andaman Islands'].map(t => {
      const n = svg.querySelector('[data-zone="' + t + '"]');
      return t + '=' + (n ? getComputedStyle(n).fillOpacity : '?');
    }).join('  ');
  }));
}
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await svgH.screenshot({ path: SP + 'v21-alocasia-countries.png', animations: 'disabled' });
console.log('done');
await b.close();
