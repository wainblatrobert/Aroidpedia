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
await p.waitForTimeout(1200);
const pts = await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const S = (lon, lat) => ({ x: Math.round(sr.x + (lon - vb.x)/vb.width*sr.width),
                             y: Math.round(sr.y + (-lat - vb.y)/vb.height*sr.height) });
  return { BD: S(90.2, 23.9), BDsylhet: S(91.7, 24.6), India: S(79, 22), Myanmar: S(96, 21), Thailand: S(101, 15) };
});
console.log(JSON.stringify(pts));
await p.screenshot({ path: SP + 'live-regions-base.png', animations: 'disabled' });
console.log('saved');
await b.close();
