import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
await p.evaluate(() => { const fb=[...document.querySelectorAll('button')].find(x=>/filter/i.test(x.textContent)); if(fb) fb.click(); });
await p.waitForTimeout(1000);
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="regions"]').click());
await p.waitForTimeout(800);
// zoom toward Bangladesh with real wheels
const pt = await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (90.4 - vb.x)/vb.width*sr.width, y: sr.y + (-23.8 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(pt.x, pt.y);
for (let i=0;i<7;i++){ await p.mouse.wheel(0,-240); await p.waitForTimeout(120); }
await p.mouse.move(20,20); await p.waitForTimeout(500);
await p.screenshot({ path: SP+'live-regions-bd.png', animations:'disabled' });
console.log('saved');
await b.close();
