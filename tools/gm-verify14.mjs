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
const pt = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const cl = (x, y) => ({ x: sr.x + (x - vb.x) / vb.width * sr.width, y: sr.y + (y - vb.y) / vb.height * sr.height });
  return { india: cl(79, -22), sea: cl(90, 8) };   /* Bay of Bengal = no zone */
});
const grab = () => p.evaluate(() => {
  const by = document.querySelector('.apgm svg .apgm-zone[data-zone="Borneo"]');
  const cs = getComputedStyle(by);
  return { s: cs.stroke, f: cs.fill, hovCls: document.querySelector('.apgm svg').classList.contains('apgm--hov') };
});
const base0 = await grab();
await p.mouse.move(pt.india.x, pt.india.y); await p.waitForTimeout(450);
const dim = await grab();
await p.mouse.move(pt.sea.x, pt.sea.y);     /* hover off the range */
await p.waitForTimeout(70);
const mid = await grab();
await p.waitForTimeout(500);
const end = await grab();
console.log('base:', JSON.stringify(base0));
console.log('dim :', JSON.stringify(dim));
console.log('mid :', JSON.stringify(mid));
console.log('end :', JSON.stringify(end));
console.log('strokeGlides=', mid.s !== dim.s && mid.s !== end.s,
            ' fillGlides=', mid.f !== dim.f && mid.f !== end.f,
            ' lockstep(mid s==f)=', mid.s === mid.f);
await b.close();
