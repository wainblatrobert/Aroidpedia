import { chromium } from 'playwright';
import fs from 'fs';
const R = 'C:/Users/nli0490/Claude/Aroidpedia/docs/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
for (const f of ['footer.js','climate-zones.json','climate-zones.png']) {
  const ct = f.endsWith('.js')?'application/javascript':f.endsWith('.json')?'application/json':'image/png';
  await p.route('**/'+f+'*', r => r.fulfill({ body: fs.readFileSync(R+f), contentType: ct, headers:{'access-control-allow-origin':'*'} }));
}
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.click('.apgm__climbtn'); await p.waitForTimeout(4000);
const spot = await p.evaluate(() => { const svg=document.querySelector('.apgm svg');
  const el=svg.querySelector('.apgm-zone[data-zone="Borneo"]'); const r=el.getBoundingClientRect();
  for(let fy=.3;fy<=.7;fy+=.1)for(let fx=.3;fx<=.7;fx+=.1){const x=r.x+r.width*fx,y=r.y+r.height*fy;
    const h=document.elementFromPoint(x,y); if(h&&h.getAttribute&&h.getAttribute('data-zone')==='Borneo')return{x,y};}
  return null; });
await p.mouse.move(spot.x, spot.y); await p.waitForTimeout(500);
console.log('after 1 move:', await p.evaluate(() => {
  const h=document.querySelector('.apgm [data-on]');
  return 'text="' + (h?h.textContent.trim():'-') + '" tailSpan=' + (h?!!h.querySelector('.apgm__hov-clim'):'?');
}));
await p.mouse.move(spot.x+2, spot.y+1); await p.waitForTimeout(400);
console.log('after 2 moves:', await p.evaluate(() => {
  const h=document.querySelector('.apgm [data-on]');
  return 'text="' + (h?h.textContent.trim():'-') + '" tailSpan=' + (h?!!h.querySelector('.apgm__hov-clim'):'?');
}));
console.log('hover el id:', await p.evaluate(() => {
  const h=document.querySelector('.apgm [data-on]');
  return h.className + ' | children=' + h.children.length + ' | html=' + h.innerHTML.slice(0,160);
}));
await b.close();
