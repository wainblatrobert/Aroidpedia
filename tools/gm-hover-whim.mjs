import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/arum', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
const pt = async (lon,lat) => p.evaluate(([lo,la]) => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect();
  return { x: r.x + (lo - vb.x)/vb.width*r.width, y: r.y + (-la - vb.y)/vb.height*r.height };
}, [lon,lat]);
/* Himachal Pradesh ~ 77.2E 31.7N ; also a plain-India point 78E 26N */
for (const v of ['range','continents','regions','countries','subzones','divisions']) {
  const ok = await p.evaluate(vv => { const e=[...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===vv); if(!e) return false; e.click(); return true; }, v);
  if (!ok) { console.log(v.padEnd(11),'(absent)'); continue; }
  await p.waitForTimeout(800);
  const out = [];
  for (const [nm,lon,lat] of [['HimachalPr',77.2,31.7], ['plainIndia',78.5,26.0]]) {
    const c = await pt(lon,lat);
    await p.mouse.move(c.x, c.y); await p.waitForTimeout(350);
    const r = await p.evaluate(() => {
      const on = document.querySelector('.apgm [data-on]');
      return (on ? on.textContent.trim().slice(0,44) : '-');
    });
    const el = await p.evaluate(([x,y]) => { const h=document.elementFromPoint(x,y); return h&&h.getAttribute? (h.getAttribute('data-zone')||h.getAttribute('class')) : '?'; }, [c.x,c.y]);
    out.push(nm+': reads "'+r+'"  [hit=' + el + ']');
    await p.mouse.move(c.x, c.y - 400); await p.waitForTimeout(150);
  }
  console.log(v.padEnd(11), out.join('   |   '));
}
await b.close();
