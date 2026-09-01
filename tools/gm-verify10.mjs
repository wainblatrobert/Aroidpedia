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
const view = async v => { await p.evaluate(vv => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === vv).click(); }, v); await p.waitForTimeout(800); };
await view('divisions');
console.log('EK pointer:', await p.evaluate(() => getComputedStyle(document.querySelector('.apgm svg [data-zone="East Kalimantan"]')).pointerEvents));
/* zones + subzones islands */
for (const v of ['subzones','subzones2']) {
  await view(v);
  console.log(v + ':', await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    return ['Maluku','Luzon','Nicobar','Lesser Sunda Is.'].map(t => {
      const n = svg.querySelector('[data-zone="' + t + '"]');
      return t + '=' + (n ? Math.round(parseFloat(getComputedStyle(n).fillOpacity)*100)/100 : '?');
    }).join('  ');
  }));
}
/* ghost hover fill tint sanity: hover Kapit */
await view('divisions');
const kpt = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (113.0 - vb.x)/vb.width*sr.width, y: sr.y + (-1.8 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(kpt.x, kpt.y); await p.waitForTimeout(400);
console.log('Kapit hover: fill-opacity =', await p.evaluate(() => getComputedStyle(document.querySelector('.apgm svg [data-zone="Kapit"]')).fillOpacity),
  '| reads:', await p.evaluate(() => { const h = document.querySelector('.apgm [data-on]'); return h ? h.textContent.trim().slice(0, 40) : '-'; }));
console.log('done');
await b.close();
