import { chromium } from 'playwright';
import fs from 'fs';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'regions').click(); });
await p.waitForTimeout(800);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const out = [];
  for (let lat = 0.6; lat <= 2.2; lat += 0.2) {
    const pt = svg.createSVGPoint(); pt.x = 113.2; pt.y = -lat;
    const hits = [];
    svg.querySelectorAll('path').forEach(n => {
      const cs = getComputedStyle(n);
      let hf = false, hs = false;
      try { hf = parseFloat(cs.fillOpacity) > 0.03 && n.isPointInFill(pt); } catch (e) {}
      try { hs = parseFloat(cs.strokeOpacity) > 0.03 && n.isPointInStroke && n.isPointInStroke(pt); } catch (e) {}
      if (hf || hs) hits.push((n.getAttribute('data-zone') || (n.getAttribute('class')||'').slice(0,18)) +
        (hf ? '·F' : '') + (hs ? '·S(' + cs.stroke.slice(4, 16) + ')' : ''));
    });
    out.push('lat ' + lat.toFixed(1) + ': ' + hits.join(' | '));
  }
  return out.join('\n');
}));
await b.close();
