import { chromium } from 'playwright';
import fs from 'fs';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const R = 'C:/Users/nli0490/Claude/Aroidpedia/docs/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 }, deviceScaleFactor: 2 });
for (const f of ['footer.js','climate-zones.json','climate-zones.png']) {
  const ct = f.endsWith('.js')?'application/javascript':f.endsWith('.json')?'application/json':'image/png';
  await p.route('**/'+f+'*', r => r.fulfill({ body: fs.readFileSync(R+f), contentType: ct, headers:{'access-control-allow-origin':'*'} }));
}
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
const state = () => p.evaluate(() => {
  const svg=document.querySelector('.apgm svg');
  const btn=document.querySelector('.apgm__climbtn');
  const zr=document.querySelector('.apgm__zoom-row');
  return { on: btn.getAttribute('aria-pressed'), host: getComputedStyle(document.querySelector('.apgm svg g:has(.apgm-clim-img)')||btn).display,
    imgVisible: !!svg.querySelector('.apgm-clim-img') && getComputedStyle(svg.querySelector('.apgm-clim-img').parentNode).display !== 'none',
    btnW: Math.round(btn.getBoundingClientRect().width), rowW: Math.round(zr.getBoundingClientRect().width),
    legend: document.querySelectorAll('.apgm__clim-key').length,
    pills: [...document.querySelectorAll('.apgm [data-view]')].map(x=>x.textContent).join('|') };
});
console.log('pills:', (await state()).pills);
console.log('OFF  ', JSON.stringify(await state()));
await p.click('.apgm__climbtn'); await p.waitForTimeout(4000);
console.log('ON   ', JSON.stringify(await state()));
/* switch geo pills with climate on - layer must persist and rows stay hoverable */
for (const v of ['countries','subzones']) {
  await p.evaluate(vv => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===vv).click(); }, v);
  await p.waitForTimeout(1200);
  const spot = await p.evaluate(() => { const svg=document.querySelector('.apgm svg');
    const el=svg.querySelector('.apgm-zone[data-zone="Borneo"]')||svg.querySelector('.apgm-zone');
    const r=el.getBoundingClientRect();
    for(let fy=.3;fy<=.7;fy+=.1)for(let fx=.3;fx<=.7;fx+=.1){const x=r.x+r.width*fx,y=r.y+r.height*fy;
      const h=document.elementFromPoint(x,y); if(h&&h.getAttribute&&h.getAttribute('data-zone'))return{x,y};}
    return null; });
  if (spot) { await p.mouse.move(spot.x, spot.y); await p.waitForTimeout(350); }
  console.log(' ', v.padEnd(10), 'img=' + (await state()).imgVisible, '| readout:',
    await p.evaluate(() => { const o=document.querySelector('.apgm [data-on]'); return o?o.textContent.trim():'-'; }));
}
await svgH.screenshot({ path: SP + 'toggle-on.png', animations:'disabled' });
await p.click('.apgm__climbtn'); await p.waitForTimeout(1500);
console.log('OFF again', JSON.stringify(await state()));
await svgH.screenshot({ path: SP + 'toggle-off.png', animations:'disabled' });
await b.close();
