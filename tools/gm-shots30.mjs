import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
const view = async v => { await p.evaluate(vv => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === vv).click(); }, v); await p.waitForTimeout(900); };

await view('countries');
await svgH.screenshot({ path: SP + 'live-v30-countries.png', animations: 'disabled' });
/* Indochina crop for the Laos check */
const box = await svgH.boundingBox();
const crop = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const r = svg.querySelector('.apgm-zone[data-zone="Laos"]').getBoundingClientRect();
  return { x: Math.round(r.x - r.width * 1.2), y: Math.round(r.y - r.height * 0.6),
           width: Math.round(r.width * 3.6), height: Math.round(r.height * 2.2) };
});
await p.screenshot({ path: SP + 'live-v30-laos.png', clip: crop });
await view('divisions');
await svgH.screenshot({ path: SP + 'live-v30-divisions.png', animations: 'disabled' });
console.log('done');
await b.close();
