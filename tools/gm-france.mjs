/* usage: node gm-france.mjs local|live */
import { chromium } from 'playwright';
import fs from 'fs';
const MODE = process.argv[2] || 'local';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const R = 'C:/Users/nli0490/Claude/Aroidpedia/docs/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
if (MODE === 'local') {
  const j = f => r => r.fulfill({ body: fs.readFileSync(R + f, 'utf8'), contentType: 'application/json', headers: {'access-control-allow-origin':'*'} });
  await p.route('**/shapes-topo.json*', j('shapes-topo.json'));
  await p.route('**/shapes-hd.json*', j('shapes-hd.json'));
  await p.route('**/climate.json*', j('climate.json'));
}
await p.goto('https://www.aroidpedia.com/arum', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log(MODE, await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect();
  const fr = svg.querySelector('[data-zone="France"]');
  const bb = fr ? fr.getBBox() : null;
  let u = [1e9,1e9,-1e9,-1e9];
  svg.querySelectorAll('.apgm-zone').forEach(el => {
    if (parseFloat(getComputedStyle(el).fillOpacity) < 0.05) return;
    const g = el.getBBox();
    u = [Math.min(u[0],g.x), Math.min(u[1],g.y), Math.max(u[2],g.x+g.width), Math.max(u[3],g.y+g.height)];
  });
  return 'stamp=' + document.querySelector('.apgm').getAttribute('data-apgm-version') +
    '\n  France bbox lon ' + (bb? bb.x.toFixed(1)+'..'+(bb.x+bb.width).toFixed(1) : '?') +
    '   lat ' + (bb? (-(bb.y+bb.height)).toFixed(1)+'..'+(-bb.y).toFixed(1) : '?') +
    '\n  painted union lon ' + u[0].toFixed(1) + '..' + u[2].toFixed(1) +
    '\n  frame ' + vb.width.toFixed(1) + ' x ' + vb.height.toFixed(1) +
    '   px/deg=' + Math.min(r.width/vb.width, r.height/vb.height).toFixed(2);
}));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await svgH.screenshot({ path: SP + 'france-' + MODE + '.png', animations: 'disabled' });
await b.close();
