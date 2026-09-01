import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/arum', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
const TAGS = ['West Himalaya','India','Nepal','Pakistan','Xinjiang','Tibet','China','Afghanistan'];
for (const v of ['range','continents','regions','countries','zones','subzones']) {
  const ok = await p.evaluate(vv => {
    const el = [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===vv);
    if (!el) return false; el.click(); return true;
  }, v);
  if (!ok) { console.log(v.padEnd(11), '(no such view)'); continue; }
  await p.waitForTimeout(800);
  console.log(v.padEnd(11), await p.evaluate(ts => ts.map(t => {
    const el = document.querySelector('.apgm svg [data-zone="'+t+'"]');
    if (!el) return t+'=NONODE';
    const cs = getComputedStyle(el);
    const fo = +parseFloat(cs.fillOpacity).toFixed(2);
    const gh = el.classList.contains('apgm-cg') ? 'g' : el.classList.contains('apgm-ghost') ? 'G' : '';
    return t.replace(' Himalaya','Him')+gh+'='+fo;
  }).join('  '), TAGS));
}
await b.close();
