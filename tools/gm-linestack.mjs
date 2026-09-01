import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
await p.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === 'subzones');
  z.click();
});
await p.waitForTimeout(800);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const stackAt = (x, y) => {
    const pt = svg.createSVGPoint(); pt.x = x; pt.y = y;
    const out = [];
    svg.querySelectorAll('path').forEach(n => {
      const cs = getComputedStyle(n);
      let hitF = false, hitS = false;
      try { hitF = parseFloat(cs.fillOpacity) > 0.03 && n.isPointInFill(pt); } catch (e) {}
      try { hitS = parseFloat(cs.strokeOpacity) > 0.03 && n.isPointInStroke && n.isPointInStroke(pt); } catch (e) {}
      if (hitF || hitS) out.push((n.getAttribute('data-zone') || n.getAttribute('class')) +
        (hitF ? ' FILL(' + Math.round(parseFloat(cs.fillOpacity)*100)/100 + ')' : '') + (hitS ? ' STROKE' : ''));
    });
    return out.join(' | ');
  };
  return 'LINE pt (111.8,1.0): ' + stackAt(111.8, 1.0) +
       '\nCELL pt (111.0,-0.3): ' + stackAt(111.0, -0.3) +
       '\nLINE2 pt (116.9,1.3): ' + stackAt(116.9, 1.3);
}));
await b.close();
