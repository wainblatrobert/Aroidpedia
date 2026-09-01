import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded();
await p.waitForTimeout(300);
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'divisions').click(); });
await p.waitForTimeout(800);
/* zoom toward Cambodia like the grower did */
const pt = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (105 - vb.x)/vb.width*sr.width, y: sr.y + (12 - vb.y)/vb.height*sr.height * 1 };
});
await p.mouse.move(pt.x, pt.y);
for (let i = 0; i < 5; i++) { await p.mouse.wheel(0, -240); await p.waitForTimeout(150); }
await p.mouse.move(20, 20); await p.waitForTimeout(500);
await svgH.screenshot({ path: SP + 'chords-repro.png', animations: 'disabled' });
/* stroke-probe a grid over the area, group hits by owner */
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const owners = {};
  for (let lon = 100; lon <= 110; lon += 0.25) {
    for (let lat = 8; lat <= 15; lat += 0.25) {
      const pt2 = svg.createSVGPoint(); pt2.x = lon; pt2.y = -lat;
      svg.querySelectorAll('path').forEach(n => {
        const cs = getComputedStyle(n);
        if (parseFloat(cs.strokeOpacity) < 0.05) return;
        let hs = false;
        try { hs = n.isPointInStroke && n.isPointInStroke(pt2); } catch (e) {}
        if (hs) {
          const k = (n.getAttribute('data-zone') || (n.getAttribute('class')||'').slice(0,24));
          owners[k] = (owners[k] || 0) + 1;
        }
      });
    }
  }
  return Object.entries(owners).sort((a,b)=>b[1]-a[1]).slice(0,15).map(e=>e[0]+':'+e[1]).join('  ');
}));
console.log('done');
await b.close();
