import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
await p.evaluate(() => { const fb=[...document.querySelectorAll('button')].find(x=>/filter/i.test(x.textContent)); if(fb) fb.click(); });
await p.waitForTimeout(1000);
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="regions"]').click());
await p.waitForTimeout(800);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const pt = svg.createSVGPoint();
  pt.x = 90.4; pt.y = -23.8;   // path coordinate space is (lon, -lat)
  const hits = [];
  const paths = [...svg.querySelectorAll('path')];
  paths.forEach((e, i) => {
    let inside = false;
    try { inside = e.isPointInFill(pt); } catch (err) {}
    if (!inside) return;
    const t = e.getAttribute('data-tag') || e.getAttribute('data-place') || ('<' + (e.getAttribute('class') || e.parentNode.getAttribute('class') || '?') + '>');
    const cs = getComputedStyle(e);
    hits.push(i + ' ' + t + ' [' + (e.getAttribute('class')||'') + '] fill=' + cs.fill + ' fo=' + cs.fillOpacity + ' pe=' + cs.pointerEvents);
  });
  return 'paths whose FILL GEOMETRY contains BD center (draw order):\n' + hits.join('\n');
}));
await b.close();
