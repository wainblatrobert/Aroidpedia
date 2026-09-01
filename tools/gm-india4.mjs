import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 }, deviceScaleFactor: 2 });
await p.goto('https://www.aroidpedia.com/arum', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
for (const v of ['range','countries']) {
  await p.evaluate(vv => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===vv).click(); }, v);
  await p.waitForTimeout(900);
  await svgH.screenshot({ path: SP + 'arum-view-' + v + '.png', animations:'disabled' });
  /* and a crop over the subcontinent */
  const crop = await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect();
    const px = (lon,lat)=>({x:r.x+(lon-vb.x)/vb.width*r.width, y:r.y+(-lat-vb.y)/vb.height*r.height});
    const a=px(60,42), c=px(100,5);
    return {x:Math.round(a.x),y:Math.round(a.y),width:Math.round(c.x-a.x),height:Math.round(c.y-a.y)};
  });
  await p.screenshot({ path: SP + 'arum-sub-' + v + '.png', clip: crop });
}
console.log('done');
await b.close();
