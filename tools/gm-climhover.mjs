import { chromium } from 'playwright';
import fs from 'fs';
const R = 'C:/Users/nli0490/Claude/Aroidpedia/docs/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: fs.readFileSync(R+'footer.js','utf8'), contentType:'application/javascript', headers:{'access-control-allow-origin':'*'} }));
await p.route('**/climate-zones.json*', r => r.fulfill({ body: fs.readFileSync(R+'climate-zones.json','utf8'), contentType:'application/json', headers:{'access-control-allow-origin':'*'} }));
await p.route('**/climate-zones.png*', r => r.fulfill({ body: fs.readFileSync(R+'climate-zones.png'), contentType:'image/png', headers:{'access-control-allow-origin':'*'} }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='climate').click(); });
await p.waitForTimeout(3500);
console.log('zones incl?', await p.evaluate(() => ['Queensland','Japan','Assam','Borneo']
  .map(t => t + '=' + !!document.querySelector('.apgm svg .apgm-zone[data-zone="'+t+'"]')).join(' ')));
for (const t of ['Queensland','Japan','Borneo']) {
  console.log(t, await p.evaluate(tag => {
    const svg=document.querySelector('.apgm svg');
    const el=svg.querySelector('.apgm-zone[data-zone="'+tag+'"]');
    if(!el) return 'no node';
    const r=el.getBoundingClientRect();
    for (let fy=.3; fy<=.7; fy+=.1) for (let fx=.3; fx<=.7; fx+=.1) {
      const x=r.x+r.width*fx, y=r.y+r.height*fy;
      const h=document.elementFromPoint(x,y);
      if (h && h.getAttribute && h.getAttribute('data-zone')===tag)
        return 'hit ok, topmost=' + (h.getAttribute('class')||'') + ' at ' + Math.round(x)+','+Math.round(y);
    }
    const h2=document.elementFromPoint(r.x+r.width/2, r.y+r.height/2);
    return 'NO self-hit; centre topmost=' + (h2 && h2.getAttribute ? (h2.getAttribute('data-zone')||h2.getAttribute('class')) : h2);
  }, t));
}
await b.close();
