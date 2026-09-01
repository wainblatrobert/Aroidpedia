import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('live stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
console.log('live label:', await p.evaluate(() => {
  const lbl = [...document.querySelectorAll('.apgm-maplabel')].find(t => t.textContent === 'Sulawesi');
  return lbl ? lbl.getAttribute('x') + ',' + lbl.getAttribute('y') : 'MISSING';
}));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await svgH.screenshot({ path: SP + 'live-v24-range.png', animations: 'disabled' });
console.log('done');
await b.close();
