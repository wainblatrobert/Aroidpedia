/* usage: node gm-ghostctx.mjs local|live — empty-subunit readouts */
import { chromium } from 'playwright';
import fs from 'fs';
const MODE = process.argv[2] || 'local';
const JS = MODE==='local' ? fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js','utf8') : null;
const CASES = {
  arum:   [['Himachal Pradesh',77.2,31.7], ['Uttarakhand',79.3,30.2]],
  alocasia: [['Yunnan',101.5,24.8], ['Sabah',117.0,5.4], ['Kutai Timur',118.0,0.8]],
};
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const [g, cases] of Object.entries(CASES)) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
  if (JS) await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType:'application/javascript', headers:{'access-control-allow-origin':'*'} }));
  await p.goto('https://www.aroidpedia.com/'+g, { waitUntil:'networkidle', timeout:120000 });
  await p.waitForTimeout(13000);
  const svgH = await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  for (const view of ['subzones','divisions']) {
    const ok = await p.evaluate(vv => { const e=[...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===vv); if(!e) return false; e.click(); return true; }, view);
    if (!ok) continue;
    await p.waitForTimeout(800);
    for (const [nm,lon,lat] of cases) {
      const c = await p.evaluate(([lo,la]) => {
        const svg=document.querySelector('.apgm svg'); const vb=svg.viewBox.baseVal, r=svg.getBoundingClientRect();
        return { x: r.x+(lo-vb.x)/vb.width*r.width, y: r.y+(-la-vb.y)/vb.height*r.height };
      }, [lon,lat]);
      await p.mouse.move(c.x, c.y); await p.waitForTimeout(320);
      const txt = await p.evaluate(() => { const o=document.querySelector('.apgm [data-on]'); return o?o.textContent.trim():'-'; });
      console.log(MODE, g.padEnd(10), view.padEnd(10), nm.padEnd(18), '→', txt);
      await p.mouse.move(c.x, c.y-400); await p.waitForTimeout(120);
    }
  }
  await p.close();
}
await b.close();
