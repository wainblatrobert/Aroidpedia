import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'divisions').click(); });
await p.waitForTimeout(800);
/* real-mouse hovers at geographic points across Borneo */
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const S = (lon, lat) => ({ x: sr.x + (lon - vb.x)/vb.width*sr.width, y: sr.y + (-lat - vb.y)/vb.height*sr.height });
  const pts = [['Kapit-ish', 113.0, 1.8], ['Kuching-ish', 110.3, 1.4], ['Sabah-int', 116.8, 5.2],
               ['EK-regency', 116.5, 0.5], ['NK-area', 116.5, 3.2], ['CtrKal', 113.3, -1.5]];
  return pts.map(([lbl, lon, lat]) => {
    const pt = S(lon, lat);
    const el = document.elementFromPoint(pt.x, pt.y);
    const z = el && el.getAttribute ? (el.getAttribute('data-zone') || el.getAttribute('class')) : '?';
    if (el) el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const hov = document.querySelector('.apgm [data-on]');
    return lbl + ': top=' + String(z).slice(0, 40) + ' reads"' + (hov ? hov.textContent.trim().slice(0, 38) : '-') + '"';
  }).join('\n');
}));
/* stroke visibility of division ghosts */
console.log('div ghost strokes:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['Kapit','Sibu','Kuching','Kutai Kartanegara','Berau','Malinau'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    if (!n) return t + '=?';
    const cs = getComputedStyle(n);
    return t + ' so=' + cs.strokeOpacity + ' pe=' + cs.pointerEvents;
  }).join('  ');
}));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await svgH.screenshot({ path: SP + 'div-now.png', animations: 'disabled' });
console.log('done');
await b.close();
