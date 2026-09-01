import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('live stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded();
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'range').click(); });
await p.waitForTimeout(800);
console.log('live range AP/Sikkim/EHM:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['Arunachal Pradesh','Sikkim','East Himalaya','India'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    return t + '=' + (n ? Math.round(parseFloat(getComputedStyle(n).fillOpacity)*100)/100 : '?');
  }).join('  ');
}));
await svgH.screenshot({ path: SP + 'live-v23-range.png', animations: 'disabled' });
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'subzones').click(); });
await p.waitForTimeout(800);
await svgH.screenshot({ path: SP + 'live-v23-zones.png', animations: 'disabled' });
console.log('done');
await b.close();
