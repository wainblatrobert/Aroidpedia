import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('live stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
await p.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === 'countries');
  if (z) z.click();
});
await p.waitForTimeout(900);
console.log('live countries:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['Australia','Queensland','Borneo','China South-Central'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    return t + '=' + (n ? Math.round(parseFloat(getComputedStyle(n).fillOpacity)*100)/100 : '?');
  }).join('  ') + '  cov=' + svg.querySelectorAll('.apgm-cov').length;
}));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await svgH.screenshot({ path: SP + 'live-v22-countries.png', animations: 'disabled' });
console.log('done');
await b.close();
