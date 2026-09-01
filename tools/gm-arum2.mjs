import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/arum', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
const views = await p.evaluate(() => [...document.querySelectorAll('.apgm [data-view]')].map(x=>x.dataset.view + (x.classList.contains('is-on')||x.getAttribute('aria-pressed')==='true'?'*':'')));
console.log('views:', views.join(' '));
for (const v of ['range','continents','regions','countries','zones']) {
  const r = await p.evaluate(vv => {
    const el = [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===vv);
    if (el) el.click();
  }, v).then(() => p.waitForTimeout(700)).then(() => p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const vb = svg.viewBox.baseVal;
    const right = vb.x + vb.width, left = vb.x;
    const out = [];
    let u=[1e9,1e9,-1e9,-1e9];
    svg.querySelectorAll('.apgm-zone').forEach(el => {
      if (parseFloat(getComputedStyle(el).fillOpacity) < 0.05) return;
      const bb = el.getBBox();
      u=[Math.min(u[0],bb.x),Math.min(u[1],bb.y),Math.max(u[2],bb.x+bb.width),Math.max(u[3],bb.y+bb.height)];
      if (bb.x+bb.width > right + 0.5 || bb.x < left - 0.5)
        out.push((el.getAttribute('data-zone')||'?') + (el.classList.contains('apgm-cg')?'[ghost]':'') +
                 ' x:' + bb.x.toFixed(1) + '..' + (bb.x+bb.width).toFixed(1));
    });
    return { vb:[+vb.x.toFixed(1),+vb.y.toFixed(1),+vb.width.toFixed(1),+vb.height.toFixed(1)],
             union:u.map(n=>+n.toFixed(1)), overflow: out.slice(0,8), nOver: out.length };
  }));
  console.log(v, JSON.stringify(r));
}
await b.close();
