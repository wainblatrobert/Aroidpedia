/* Full 7-view sweep with BOTH the new bundle and new topology swapped in. */
import { chromium } from 'playwright';
import fs from 'fs';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const TOPO = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-topo.json', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.route('**/shapes-topo.json*', r => r.fulfill({ body: TOPO, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded();
for (const v of ['range','continents','regions','countries','subzones','subzones2','divisions']) {
  await p.evaluate(vv => {
    const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === vv);
    if (z) z.click();
  }, v);
  await p.waitForTimeout(800);
  await svgH.screenshot({ path: SP + 'v23-' + v + '.png', animations: 'disabled' });
}
/* probes */
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'range').click(); });
await p.waitForTimeout(700);
console.log('RANGE:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['East Himalaya','India','Sikkim','Arunachal Pradesh','Borneo','China South-Central'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    return t + '=' + (n ? Math.round(parseFloat(getComputedStyle(n).fillOpacity)*100)/100 : '?');
  }).join('  ');
}));
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'countries').click(); });
await p.waitForTimeout(700);
console.log('COUNTRIES hover India hot set:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  svg.querySelector('[data-zone="India"]').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  const lit = [...svg.querySelectorAll('.is-hot')].filter(n => parseFloat(getComputedStyle(n).fillOpacity) > 0.05)
    .map(n => n.getAttribute('data-zone'));
  return lit.join(', ');
}));
await p.waitForTimeout(300);
await svgH.screenshot({ path: SP + 'v23-countries-hoverindia.png', animations: 'disabled' });
console.log('done');
await b.close();
