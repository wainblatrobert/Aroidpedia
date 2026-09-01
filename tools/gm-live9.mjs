import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('live stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
console.log('live KT:', await p.evaluate(() => {
  const n = document.querySelector('.apgm svg [data-zone="Kutai Timur"]');
  return n ? 'ghost present' : 'ABSENT';
}));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'continents').click(); });
await p.waitForTimeout(800);
const opt = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (134 - vb.x)/vb.width*sr.width, y: sr.y + (24 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(opt.x, opt.y); await p.waitForTimeout(500);
await svgH.screenshot({ path: SP + 'live-v29-oceania.png', animations: 'disabled' });
console.log('done');
await b.close();
