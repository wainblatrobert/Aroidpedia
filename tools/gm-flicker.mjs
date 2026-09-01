/* usage: node gm-flicker.mjs local|live  — captures Borneo interior:
   A steady-base, B steady-hover(India), C 70ms after leave (mid-flight) */
import { chromium } from 'playwright';
import fs from 'fs';
const MODE = process.argv[2] || 'local';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
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
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'range').click(); });
await p.waitForTimeout(800);
const geo = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const india = svg.querySelector('.apgm-zone[data-zone="India"]').getBoundingClientRect();
  const borneo = svg.querySelector('.apgm-zone[data-zone="Borneo"]').getBoundingClientRect();
  let spot = null;
  for (let fy = 0.3; fy <= 0.7 && !spot; fy += 0.1) for (let fx = 0.3; fx <= 0.7; fx += 0.1) {
    const x = india.x + india.width * fx, y = india.y + india.height * fy;
    const hit = document.elementFromPoint(x, y);
    if (hit && hit.getAttribute && hit.getAttribute('data-zone') === 'India') { spot = { x, y }; break; }
  }
  return { spot, crop: { x: Math.round(borneo.x + borneo.width * 0.28), y: Math.round(borneo.y + borneo.height * 0.30),
                         width: Math.round(borneo.width * 0.42), height: Math.round(borneo.height * 0.38) } };
});
const shot = n => p.screenshot({ path: SP + 'flick-' + MODE + '-' + n + '.png', clip: geo.crop, animations: 'allow' });
await shot('A');
await p.mouse.move(geo.spot.x, geo.spot.y); await p.waitForTimeout(500);
await shot('B');
await p.mouse.move(geo.spot.x, geo.spot.y - 600);
await p.waitForTimeout(55);
await shot('C');
await p.waitForTimeout(600);
await shot('D');
console.log('done', MODE, JSON.stringify(geo.crop));
await b.close();
