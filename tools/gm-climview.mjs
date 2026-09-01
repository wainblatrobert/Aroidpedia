/* usage: node gm-climview.mjs <genus> [local|live] */
import { chromium } from 'playwright';
import fs from 'fs';
const GEN = process.argv[2] || 'alocasia';
const MODE = process.argv[3] || 'local';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const R = 'C:/Users/nli0490/Claude/Aroidpedia/docs/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 }, deviceScaleFactor: 2 });
p.on('console', m => { if (/apgm|climate/i.test(m.text())) console.log('  [page]', m.text().slice(0,120)); });
if (MODE === 'local') {
  await p.route('**/footer.js*', r => r.fulfill({ body: fs.readFileSync(R+'footer.js','utf8'), contentType:'application/javascript', headers:{'access-control-allow-origin':'*'} }));
  await p.route('**/climate-zones.json*', r => r.fulfill({ body: fs.readFileSync(R+'climate-zones.json','utf8'), contentType:'application/json', headers:{'access-control-allow-origin':'*'} }));
  await p.route('**/climate-zones.png*', r => r.fulfill({ body: fs.readFileSync(R+'climate-zones.png'), contentType:'image/png', headers:{'access-control-allow-origin':'*'} }));
}
await p.goto('https://www.aroidpedia.com/'+GEN, { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
console.log('pills:', await p.evaluate(() => [...document.querySelectorAll('.apgm [data-view]')].map(x=>x.textContent).join(' | ')));
const svgH = await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='climate').click(); });
await p.waitForTimeout(4000);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return 'image=' + svg.querySelectorAll('.apgm-clim-img').length +
    ' borders=' + svg.querySelectorAll('.apgm-clim-borders').length +
    ' clipPaths=' + svg.querySelectorAll('clipPath[id^=apgm-climclip]').length +
    '\n  legend chips: ' + [...document.querySelectorAll('.apgm__clim-key')].map(c=>c.textContent.trim()).join(' | ');
}));
/* hover a few known points and read the band */
const PROBES = {
  alocasia: [['Borneo interior',114,1],['N India plain',78,27],['S China',105,25],['Japan',138,36],['Queensland',145,-20]],
  arum:     [['Spain interior',-4,40],['Sweden',15,62],['Tibet',88,32],['Sahara (Algeria)',3,27],['Turkey',33,39]],
  amorphophallus: [['Congo basin',22,0],['Thailand',101,15],['Madagascar',47,-19]],
};
for (const [nm, lon, lat] of (PROBES[GEN] || PROBES.alocasia)) {
  /* user units -> client px via the CTM: preserveAspectRatio letterboxes,
     so a linear viewBox->box stretch is simply wrong. */
  const c = await p.evaluate(([lo,la]) => {
    const svg=document.querySelector('.apgm svg');
    const pt=svg.createSVGPoint(); pt.x=lo; pt.y=-la;
    const q=pt.matrixTransform(svg.getScreenCTM());
    return { x:q.x, y:q.y };
  }, [lon,lat]);
  await p.mouse.move(c.x, c.y); await p.waitForTimeout(260);
  console.log('  hover', nm.padEnd(16), '->', await p.evaluate(() => { const o=document.querySelector('.apgm [data-on]'); return o?o.textContent.trim():'-'; }));
}
await svgH.screenshot({ path: SP + 'built-' + GEN + '-' + MODE + '.png', animations:'disabled' });
await b.close();
