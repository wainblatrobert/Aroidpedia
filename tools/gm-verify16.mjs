/* usage: node gm-verify16.mjs local|live */
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
const view = async v => { await p.evaluate(vv => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === vv).click(); }, v); await p.waitForTimeout(900); };

/* ---- region borders ---- */
await view('regions');
console.log('rb paths:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const all = Array.from(svg.querySelectorAll('.apgm-rb'));
  const lit = all.filter(el => parseFloat(getComputedStyle(el).strokeOpacity) > 0.5);
  const litOn = all.filter(el => el.classList.contains('apgm-rb--on'));
  return 'total=' + all.length + ' lit=' + lit.length +
    ' on=[' + litOn.map((el, i) => i).length + ']';
}));
await svgH.screenshot({ path: SP + 'v31-regions.png', animations: 'disabled' });

/* ---- hover-ON flash: burst-sample a covered member entering hover ---- */
for (const [vw, target, member] of [['countries', 'Australia', 'Queensland'],
                                    ['regions', 'India', 'Borneo']]) {
  await view(vw);
  const spot = await p.evaluate(t => {
    const svg = document.querySelector('.apgm svg');
    const el = svg.querySelector('.apgm-zone[data-zone="' + t + '"], .apgm-ghost[data-zone="' + t + '"]');
    const r = el.getBoundingClientRect();
    for (let fy = 0.25; fy <= 0.75; fy += 0.08) for (let fx = 0.25; fx <= 0.75; fx += 0.08) {
      const x = r.x + r.width * fx, y = r.y + r.height * fy;
      const hit = document.elementFromPoint(x, y);
      if (hit && hit.getAttribute && hit.getAttribute('data-zone')) return { x, y };
    }
    return null;
  }, target);
  if (!spot) { console.log(vw, 'no spot for', target); continue; }
  const burstP = p.evaluate(m => new Promise(res => {
    const svg = document.querySelector('.apgm svg');
    const el = svg.querySelector('.apgm-zone[data-zone="' + m + '"]');
    const rows = [];
    const t0 = performance.now();
    const alpha = c => { const mm = c.match(/rgba?\(([^)]+)\)/); if (!mm) return c === 'transparent' ? 0 : 1;
      const parts = mm[1].split(','); return parts.length === 4 ? parseFloat(parts[3]) : 1; };
    const tick = () => {
      const cs = getComputedStyle(el);
      const vis = parseFloat(cs.strokeOpacity) * alpha(cs.stroke);
      rows.push({ t: Math.round(performance.now() - t0), vis: +vis.toFixed(3), hot: el.classList.contains('is-hot') });
      if (performance.now() - t0 < 600) setTimeout(tick, 20); else res(rows);
    };
    tick();
  }), member);
  await p.mouse.move(spot.x, spot.y);        /* hover ON during the burst */
  const rows = await burstP;
  const flash = rows.filter(r => r.hot && r.vis > 0.05);
  console.log(MODE, vw, 'hover', target, '-> member', member,
    ': hotSamples=' + rows.filter(r => r.hot).length,
    'visibleStrokeWhileHot=' + flash.length,
    flash.length ? JSON.stringify(flash.slice(0, 3)) : '');
  await p.mouse.move(spot.x, spot.y - 600); await p.waitForTimeout(400);
}
console.log('done');
await b.close();
