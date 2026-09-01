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
  const groups = {};
  svg.querySelectorAll('path').forEach(n => {
    const cs = getComputedStyle(n);
    const so = parseFloat(cs.strokeOpacity), fo = parseFloat(cs.fillOpacity);
    if (so < 0.05 || cs.stroke === 'none') return;
    /* Borneo box in path coords: x 108-119.5, y -7..4.3 (y=-lat) */
    let bb; try { bb = n.getBBox(); } catch (e) { return; }
    if (bb.x > 119.5 || bb.x + bb.width < 108 || bb.y > 4.3 || bb.y + bb.height < -7.2) return;
    const key = (n.getAttribute('class') || '(none)') + ' | so=' + Math.round(so*100)/100 + ' fo=' + Math.round(fo*100)/100 + ' | stroke=' + cs.stroke.slice(0, 26);
    (groups[key] = groups[key] || []).push(n.getAttribute('data-zone') || '?');
  });
  return Object.keys(groups).map(k => k + '\n    -> ' + groups[k].slice(0, 14).join(', ') + (groups[k].length > 14 ? ' (+' + (groups[k].length - 14) + ')' : '')).join('\n');
}));
await b.close();
