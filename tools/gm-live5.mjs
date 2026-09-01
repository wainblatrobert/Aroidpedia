import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('live stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const view = async v => { await p.evaluate(vv => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === vv).click(); }, v); await p.waitForTimeout(800); };
await view('continents');
console.log('China reads:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  svg.querySelector('[data-zone="China"]').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  const hov = document.querySelector('.apgm [data-on]');
  return hov ? hov.textContent.trim().slice(0, 30) : '-';
}));
await view('subzones2');
console.log('Sarawak band:', await p.evaluate(() => {
  const n = document.querySelector('.apgm svg [data-zone="Sarawak"]');
  return Math.round(parseFloat(getComputedStyle(n).fillOpacity)*100)/100;
}));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await view('continents');
await svgH.screenshot({ path: SP + 'live-v25-continents.png', animations: 'disabled' });
await view('subzones2');
await svgH.screenshot({ path: SP + 'live-v25-subzones2.png', animations: 'disabled' });
console.log('done');
await b.close();
