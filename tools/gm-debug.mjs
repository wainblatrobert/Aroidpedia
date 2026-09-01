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
  const au = svg.querySelector('.apgm-cg[data-zone="Australia"]');
  const qld = svg.querySelector('[data-zone="Queensland"]');
  if (!au || !qld) return 'missing: au=' + !!au + ' qld=' + !!qld;
  const bb = qld.getBBox();
  const out = ['qld bbox: ' + JSON.stringify({x:bb.x,y:bb.y,w:bb.width,h:bb.height})];
  let inQ = 0, inA = 0, tested = 0;
  for (let iy = 0; iy < 4; iy++) for (let ix = 0; ix < 4; ix++) {
    const pt = svg.createSVGPoint();
    pt.x = bb.x + bb.width * (ix + 0.5) / 4;
    pt.y = bb.y + bb.height * (iy + 0.5) / 4;
    let q = false, a = false;
    try { q = qld.isPointInFill(pt); } catch (e) { return 'qld isPointInFill THROWS: ' + e.message; }
    try { a = au.isPointInFill(pt); } catch (e) { return 'au isPointInFill THROWS: ' + e.message; }
    tested++; if (q) inQ++; if (q && a) inA++;
  }
  out.push('grid: ' + tested + ' pts, in QLD: ' + inQ + ', of those also in AU-ghost: ' + inA);
  out.push('qld class: ' + qld.getAttribute('class'));
  out.push('au fill-opacity: ' + getComputedStyle(au).fillOpacity + ' class: ' + au.getAttribute('class'));
  return out.join('\n');
}));
await b.close();
