import { chromium } from 'playwright';
import fs from 'fs';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
await p.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === 'countries');
  if (z) z.click();
});
await p.waitForTimeout(800);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const out = [];
  const china = svg.querySelector('path[data-zone="China"]');
  out.push('China node: ' + (china ? '[' + china.getAttribute('class') + '] fo=' + getComputedStyle(china).fillOpacity : 'ABSENT'));
  const csc = svg.querySelector('path[data-zone="China South-Central"]');
  out.push('CSC: [' + csc.getAttribute('class') + '] fo=' + getComputedStyle(csc).fillOpacity);
  if (china && csc) {
    const bb = csc.getBBox();
    let inCsc = 0, inBoth = 0;
    for (let iy = 0; iy < 4; iy++) for (let ix = 0; ix < 4; ix++) {
      const pt = svg.createSVGPoint();
      pt.x = bb.x + bb.width * (ix + 0.5) / 4;
      pt.y = bb.y + bb.height * (iy + 0.5) / 4;
      if (csc.isPointInFill(pt)) { inCsc++; if (china.isPointInFill(pt)) inBoth++; }
    }
    out.push('CSC grid: in CSC=' + inCsc + ' also in China=' + inBoth);
  }
  /* every currently-covered shape */
  out.push('cov count: ' + svg.querySelectorAll('.apgm-cov').length);
  return out.join('\n');
}));
await b.close();
