import { chromium } from 'playwright';
import fs from 'fs';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'range').click(); });
await p.waitForTimeout(800);
/* find a client point that actually lands on the India path */
const spot = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const el = svg.querySelector('.apgm-zone[data-zone="India"]');
  const r = el.getBoundingClientRect();
  for (let fy = 0.3; fy <= 0.7; fy += 0.1) for (let fx = 0.3; fx <= 0.7; fx += 0.1) {
    const x = r.x + r.width * fx, y = r.y + r.height * fy;
    const hit = document.elementFromPoint(x, y);
    if (hit && hit.getAttribute && hit.getAttribute('data-zone') === 'India') return { x, y };
  }
  const sr = svg.getBoundingClientRect();
  return { x: sr.x + 10, y: sr.y + 10, miss: true };
});
console.log('spot:', JSON.stringify(spot));
const grab = () => p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const by = svg.querySelector('.apgm-zone[data-zone="Borneo"]');
  const cs = getComputedStyle(by);
  const on = document.querySelector('.apgm [data-on]');
  return { s: cs.stroke, f: cs.fill, hov: svg.classList.contains('apgm--hov'),
           reads: on ? on.textContent.trim().slice(0, 24) : '-' };
});
await p.mouse.move(spot.x, spot.y); await p.waitForTimeout(450);
const dim = await grab();
/* leave the map entirely */
await p.mouse.move(spot.x, spot.y - 600);
await p.waitForTimeout(70);
const mid = await grab();
await p.waitForTimeout(500);
const end = await grab();
console.log('dim :', JSON.stringify(dim));
console.log('mid :', JSON.stringify(mid));
console.log('end :', JSON.stringify(end));
console.log('strokeGlides=', mid.s !== dim.s && mid.s !== end.s,
            ' fillGlides=', mid.f !== dim.f && mid.f !== end.f,
            ' lockstep=', mid.s === mid.f);
await b.close();
