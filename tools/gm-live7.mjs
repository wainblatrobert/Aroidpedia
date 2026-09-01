import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('live stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'divisions').click(); });
await p.waitForTimeout(800);
console.log('Kapit stroke:', await p.evaluate(() => getComputedStyle(document.querySelector('.apgm svg [data-zone="Kapit"]')).strokeOpacity));
/* hover inside Kapit */
const kpt = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (113.0 - vb.x)/vb.width*sr.width, y: sr.y + (-1.8 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(kpt.x, kpt.y); await p.waitForTimeout(500);
console.log('Kapit-point reads:', await p.evaluate(() => {
  const hov = document.querySelector('.apgm [data-on]');
  return hov ? hov.textContent.trim().slice(0, 44) : '-';
}));
/* zoom deep with + and confirm the hairline fades */
for (let i = 0; i < 9; i++) { await p.evaluate(() => { [...document.querySelectorAll('.apgm button')].find(x => x.textContent.trim() === '+').click(); }); await p.waitForTimeout(100); }
console.log('zoom-fade live:', await p.evaluate(() => getComputedStyle(document.querySelector('.apgm-borders')).stroke));
await p.mouse.move(20, 20); await p.waitForTimeout(300);
await svgH.screenshot({ path: SP + 'live-v27-divisions.png', animations: 'disabled' });
console.log('done');
await b.close();
