import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 }, deviceScaleFactor: 2 });
await p.goto('https://www.aroidpedia.com/arum', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const el = svg.querySelector('[data-zone="West Himalaya"]');
  const bb = el.getBBox();
  const cs = getComputedStyle(el);
  return 'WestHim bbox lon ' + bb.x.toFixed(1) + '..' + (bb.x+bb.width).toFixed(1) +
    ' lat ' + (-(bb.y+bb.height)).toFixed(1) + '..' + (-bb.y).toFixed(1) +
    ' | fill=' + cs.fill + ' fo=' + cs.fillOpacity + ' display=' + cs.display +
    ' | zIndexPos=' + [...svg.children].indexOf(el.parentNode === svg ? el : el.parentNode) +
    ' of ' + svg.children.length;
}));
/* range view, zoomed to NW India */
await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='range').click(); });
await p.waitForTimeout(900);
await p.evaluate(() => document.querySelector('.apgm svg').setAttribute('viewBox','68 -39 24 11'));
await p.waitForTimeout(400);
await svgH.screenshot({ path: SP + 'india-range.png' });
await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='countries').click(); });
await p.waitForTimeout(900);
await p.evaluate(() => document.querySelector('.apgm svg').setAttribute('viewBox','68 -39 24 11'));
await p.waitForTimeout(400);
await svgH.screenshot({ path: SP + 'india-countries.png' });
console.log('done');
await b.close();
