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
const view = async v => { await p.evaluate(vv => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === vv).click(); }, v); await p.waitForTimeout(800); };
/* island stability: Maluku/Luzon fills across views */
for (const v of ['range','continents','countries']) {
  await view(v);
  console.log(v + ':', await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    return ['Maluku','Luzon','Nicobar','Brunei'].map(t => {
      const n = svg.querySelector('[data-zone="' + t + '"]');
      return t + '=' + (n ? Math.round(parseFloat(getComputedStyle(n).fillOpacity)*100)/100 : '?');
    }).join('  ');
  }));
}
/* divisions: EK inert, hover falls to regency; borders toned */
await view('divisions');
console.log('EK pointer:', await p.evaluate(() => getComputedStyle(document.querySelector('.apgm svg [data-zone="East Kalimantan"]')).pointerEvents),
  '| Kapit stroke:', await p.evaluate(() => getComputedStyle(document.querySelector('.apgm svg [data-zone="Kapit"]')).strokeOpacity));
const ek = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (116.5 - vb.x)/vb.width*sr.width, y: sr.y + (-0.5 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(ek.x, ek.y); await p.waitForTimeout(500);
console.log('EK-area hover reads:', await p.evaluate(() => {
  const hov = document.querySelector('.apgm [data-on]');
  return hov ? hov.textContent.trim().slice(0, 44) : '-';
}));
await p.mouse.move(20, 20); await p.waitForTimeout(300);
await svgH.screenshot({ path: SP + 'v28-divisions.png', animations: 'disabled' });
await view('continents');
await svgH.screenshot({ path: SP + 'v28-continents.png', animations: 'disabled' });
console.log('done');
await b.close();
