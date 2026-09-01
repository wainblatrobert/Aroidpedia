/* usage: node gm-ghostctx2.mjs local|live — hover named elements directly */
import { chromium } from 'playwright';
import fs from 'fs';
const MODE = process.argv[2] || 'local';
const JS = MODE==='local' ? fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js','utf8') : null;
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
if (JS) await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType:'application/javascript', headers:{'access-control-allow-origin':'*'} }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
for (const view of ['subzones','divisions']) {
  await p.evaluate(vv => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===vv).click(); }, view);
  await p.waitForTimeout(800);
  for (const t of ['Yunnan','Guangxi','Sabah','Kutai Timur','Himachal Pradesh']) {
    const spot = await p.evaluate(tag => {
      const svg = document.querySelector('.apgm svg');
      const el = svg.querySelector('[data-zone="'+tag+'"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      for (let fy=0.3; fy<=0.7; fy+=0.1) for (let fx=0.3; fx<=0.7; fx+=0.1) {
        const x=r.x+r.width*fx, y=r.y+r.height*fy;
        const h=document.elementFromPoint(x,y);
        if (h && h.getAttribute && h.getAttribute('data-zone')===tag) return {x,y};
      }
      return null;
    }, t);
    if (!spot) { console.log(MODE, view.padEnd(10), t.padEnd(18), '→ (not hoverable in this view)'); continue; }
    await p.mouse.move(spot.x, spot.y); await p.waitForTimeout(320);
    const txt = await p.evaluate(() => { const o=document.querySelector('.apgm [data-on]'); return o?o.textContent.trim():'-'; });
    console.log(MODE, view.padEnd(10), t.padEnd(18), '→', txt);
    await p.mouse.move(spot.x, spot.y-400); await p.waitForTimeout(120);
  }
}
await b.close();
