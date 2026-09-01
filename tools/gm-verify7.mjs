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
console.log('Borneo leader x1y1:', await p.evaluate(() => {
  const lines = [...document.querySelectorAll('.apgm-maplead')];
  const lbls = [...document.querySelectorAll('.apgm-maplabel')];
  const i = lbls.findIndex(t => t.textContent === 'Borneo');
  const l = lines[i];
  return l ? l.getAttribute('x1') + ',' + l.getAttribute('y1') : '?';
}));
/* who strokes the faint Sarawak/Kalimantan line in regions? */
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'regions').click(); });
await p.waitForTimeout(800);
console.log('stroke stack at (112.5,-1.2):', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const pt = svg.createSVGPoint(); pt.x = 112.5; pt.y = -1.2;
  const out = [];
  svg.querySelectorAll('path').forEach(n => {
    const cs = getComputedStyle(n);
    let hs = false;
    try { hs = parseFloat(cs.strokeOpacity) > 0.03 && n.isPointInStroke && n.isPointInStroke(pt); } catch (e) {}
    if (hs) out.push((n.getAttribute('data-zone') || n.getAttribute('class')) + ' stroke=' + cs.stroke.slice(0, 24) + ' sw=' + cs.strokeWidth);
  });
  return out.join(' | ') || '(none)';
}));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await svgH.screenshot({ path: SP + 'v26b-regions.png', animations: 'disabled' });
console.log('done');
await b.close();
