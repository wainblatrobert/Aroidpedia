/* usage: node gm-verify17.mjs local|live — region borders follow paint */
import { chromium } from 'playwright';
import fs from 'fs';
const MODE = process.argv[2] || 'local';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
if (MODE === 'local') {
  const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
  const TOPO = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-topo.json', 'utf8');
  await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
  await p.route('**/shapes-topo.json*', r => r.fulfill({ body: TOPO, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } }));
}
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'regions').click(); });
await p.waitForTimeout(900);
console.log(await p.evaluate(() => {
  /* count path points inside lon/lat boxes across ALL lit rb paths
     (svg y = -lat) */
  const boxes = {
    pakistanWest: [60.5, 71.5, 24, 37.5],     /* lonMin, lonMax, latMin, latMax */
    mongoliaRim:  [87, 114, 41.5, 52.5],
    kraIsthmus:   [98.5, 102.5, 5.5, 10.5],
    himalaya:     [78, 89, 26.5, 36],
    amurFarEast:  [116, 135, 47, 53.5],
  };
  const counts = {};
  Object.keys(boxes).forEach(k => counts[k] = 0);
  document.querySelectorAll('.apgm-rb').forEach(el => {
    if (parseFloat(getComputedStyle(el).strokeOpacity) < 0.5) return;
    const d = el.getAttribute('d') || '';
    for (const m of d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)) {
      const lon = parseFloat(m[1]), lat = -parseFloat(m[2]);
      for (const [k, [x0, x1, y0, y1]] of Object.entries(boxes)) {
        if (lon >= x0 && lon <= x1 && lat >= y0 && lat <= y1) counts[k]++;
      }
    }
  });
  const lit = document.querySelectorAll('.apgm-rb.apgm-rb--on').length;
  return 'lit=' + lit + ' ' + JSON.stringify(counts);
}));
await svgH.screenshot({ path: SP + 'v32-regions.png', animations: 'disabled' });
console.log('done');
await b.close();
