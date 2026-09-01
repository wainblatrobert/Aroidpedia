/* usage: node gm-flicker2.mjs local|live — burst-sample stroke vs fill on a
   merged range shape after hover-off; any instant stroke!=fill = the mesh flash */
import { chromium } from 'playwright';
import fs from 'fs';
const MODE = process.argv[2] || 'local';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
if (MODE === 'local') {
  const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
  await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
}
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);

for (const vw of ['range', 'continents']) {
  await p.evaluate(vv => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === vv).click(); }, vw);
  await p.waitForTimeout(800);
  const spot = await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const el = svg.querySelector('.apgm-zone[data-zone="India"]');
    const r = el.getBoundingClientRect();
    for (let fy = 0.3; fy <= 0.7; fy += 0.1) for (let fx = 0.3; fx <= 0.7; fx += 0.1) {
      const x = r.x + r.width * fx, y = r.y + r.height * fy;
      const hit = document.elementFromPoint(x, y);
      if (hit && hit.getAttribute && hit.getAttribute('data-zone')) return { x, y };
    }
    return null;
  });
  await p.mouse.move(spot.x, spot.y); await p.waitForTimeout(500);
  /* burst: sample a merged Borneo-side shape every ~25ms for 500ms after leave */
  const burstP = p.evaluate(() => new Promise(res => {
    const svg = document.querySelector('.apgm svg');
    const el = svg.querySelector('.apgm-zone--merged[data-zone="Borneo"]') ||
               svg.querySelector('.apgm-zone--merged') || svg.querySelector('.apgm-zone[data-zone="Borneo"]');
    const rows = [];
    const t0 = performance.now();
    const tick = () => {
      const cs = getComputedStyle(el);
      rows.push({ t: Math.round(performance.now() - t0), s: cs.stroke, f: cs.fill });
      if (performance.now() - t0 < 520) setTimeout(tick, 25); else res({ zone: el.getAttribute('data-zone'), rows });
    };
    tick();
  }));
  await p.mouse.move(spot.x, spot.y - 600);   /* leave */
  const burst = await burstP;
  const diverge = burst.rows.filter(r => r.s !== r.f);
  console.log(MODE, vw, 'zone=' + burst.zone,
    'samples=' + burst.rows.length, 'diverging=' + diverge.length);
  if (diverge.length) console.log('  e.g.', JSON.stringify(diverge.slice(0, 3)));
  const distinctF = [...new Set(burst.rows.map(r => r.f))];
  console.log('  fill timeline:', distinctF.length, 'distinct values (glide=' + (distinctF.length > 2) + ')');
}
await b.close();
