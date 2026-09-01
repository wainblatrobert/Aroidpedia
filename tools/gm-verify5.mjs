import { chromium } from 'playwright';
import fs from 'fs';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded();
const view = async v => { await p.evaluate(vv => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === vv).click(); }, v); await p.waitForTimeout(800); };

await view('continents');
console.log('CONT readouts:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['China','Australia','Indonesia','Queensland'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    if (!n) return t + '=?';
    n.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const hov = document.querySelector('.apgm [data-on]');
    return t + '"' + (hov ? hov.textContent.trim().slice(0, 30) : '-') + '"';
  }).join('  ');
}));
console.log('CONT hover-Asia lights ghosts:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  svg.querySelector('[data-zone="India"]').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  const hotGhosts = [...svg.querySelectorAll('.apgm-cg.is-hot')].map(n => n.getAttribute('data-zone'));
  return hotGhosts.join(', ') || '(none)';
}));
await p.evaluate(() => document.querySelector('.apgm svg').dispatchEvent(new MouseEvent('mouseleave', { bubbles: true })));
await p.waitForTimeout(400);
await svgH.screenshot({ path: SP + 'v25-continents.png', animations: 'disabled' });

await view('regions');
console.log('REG China:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const n = svg.querySelector('[data-zone="China"]');
  n.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  const hov = document.querySelector('.apgm [data-on]');
  return hov ? hov.textContent.trim().slice(0, 30) : '-';
}));
await p.evaluate(() => document.querySelector('.apgm svg').dispatchEvent(new MouseEvent('mouseleave', { bubbles: true })));
await p.waitForTimeout(300);
await svgH.screenshot({ path: SP + 'v25-regions.png', animations: 'disabled' });

await view('range');
console.log('RANGE Luzon/Mindanao fo:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['Luzon','Mindanao','Sarawak','Yunnan'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    return t + '=' + (n ? Math.round(parseFloat(getComputedStyle(n).fillOpacity)*100)/100 : '?');
  }).join('  ');
}));
await svgH.screenshot({ path: SP + 'v25-range.png', animations: 'disabled' });

for (const v of ['subzones','subzones2','divisions']) {
  await view(v);
  await svgH.screenshot({ path: SP + 'v25-' + v + '.png', animations: 'disabled' });
}
console.log('SUBZONES2 fills:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['Sarawak','Jawa','India','Kalimantan','East Kalimantan'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    return t + '=' + (n ? Math.round(parseFloat(getComputedStyle(n).fillOpacity)*100)/100 : '?');
  }).join('  ');
}));
console.log('done');
await b.close();
