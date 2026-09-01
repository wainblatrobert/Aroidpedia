import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(15000);
await p.evaluate(() => { const fb=[...document.querySelectorAll('button')].find(x=>/filter/i.test(x.textContent)); if(fb) fb.click(); });
await p.waitForTimeout(1200);
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="regions"]').click());
await p.waitForTimeout(1200);
const px = await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const S = (lon, lat) => ({ x: Math.round(sr.x + (lon - vb.x)/vb.width*sr.width), y: Math.round(sr.y + (-lat - vb.y)/vb.height*sr.height) });
  return { BD: S(90.2, 23.9), India: S(79, 22) };
});
console.log('journal px coords:', JSON.stringify(px));
await p.screenshot({ path: SP + 'final-journal-regions.png', animations: 'disabled' });

const p2 = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p2.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p2.waitForTimeout(13000);
await p2.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view || '') === 'countries');
  if (z) z.click();
  const svg = document.querySelector('.apgm svg');
  const r = svg.getBoundingClientRect();
  window.scrollTo(0, r.top + window.scrollY - 150);
});
await p2.waitForTimeout(900);
const gpt = await p2.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (90.4 - vb.x)/vb.width*sr.width, y: sr.y + (-23.8 - vb.y)/vb.height*sr.height };
});
await p2.mouse.move(gpt.x, gpt.y);
for (let i = 0; i < 6; i++) { await p2.mouse.wheel(0, -240); await p2.waitForTimeout(120); }
await p2.mouse.move(20, 20); await p2.waitForTimeout(600);
await p2.screenshot({ path: SP + 'final-genus-bd.png', animations: 'disabled' });
console.log('done');
await b.close();
