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
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'divisions').click(); });
await p.waitForTimeout(800);
/* zoom into Cambodia with real wheel */
const cpt = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (105 - vb.x)/vb.width*sr.width, y: sr.y + (12.5 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(cpt.x, cpt.y);
for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, -240); await p.waitForTimeout(150); }
await p.mouse.move(20, 20); await p.waitForTimeout(400);
console.log('zoomed class:', await p.evaluate(() => document.querySelector('.apgm svg').classList.contains('apgm--zoomed')));
await svgH.screenshot({ path: SP + 'v27-cambodia.png', animations: 'disabled' });
/* Borneo divisions: strokes + hover */
await p.evaluate(() => { const s = document.querySelector('.apgm svg'); }); 
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'range').click(); });
await p.waitForTimeout(300);
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'divisions').click(); });
await p.waitForTimeout(800);
console.log('Kapit stroke now:', await p.evaluate(() => {
  const n = document.querySelector('.apgm svg [data-zone="Kapit"]');
  return n ? getComputedStyle(n).strokeOpacity : '?';
}));
/* real-mouse hover inside Kapit (113.0, 1.8N) at world zoom */
const kpt = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (113.0 - vb.x)/vb.width*sr.width, y: sr.y + (-1.8 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(kpt.x, kpt.y);
await p.waitForTimeout(500);
console.log('hover at Kapit-point reads:', await p.evaluate(() => {
  const hov = document.querySelector('.apgm [data-on]');
  return hov ? hov.textContent.trim().slice(0, 44) : '-';
}));
const bpt = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (116.5 - vb.x)/vb.width*sr.width, y: sr.y + (-0.5 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(bpt.x, bpt.y);
await p.waitForTimeout(500);
console.log('hover at EK-regency point reads:', await p.evaluate(() => {
  const hov = document.querySelector('.apgm [data-on]');
  return hov ? hov.textContent.trim().slice(0, 44) : '-';
}));
await p.mouse.move(20, 20); await p.waitForTimeout(300);
await svgH.screenshot({ path: SP + 'v27-divisions.png', animations: 'disabled' });
console.log('done');
await b.close();
