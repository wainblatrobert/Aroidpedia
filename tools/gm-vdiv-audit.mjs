import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'divisions').click(); });
await p.waitForTimeout(900);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const out = {};
  svg.querySelectorAll('path').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none') return;
    const so = parseFloat(cs.strokeOpacity);
    if (!(so > 0.3)) return;
    if (cs.stroke === 'none' || cs.stroke === 'rgba(0, 0, 0, 0)') return;
    const key = (el.getAttribute('class') || el.tagName) + ' | ' + cs.stroke.slice(0, 22) + ' o=' + so.toFixed(2);
    out[key] = (out[key] || 0) + 1;
  });
  return Object.entries(out).sort((a, b) => b[1] - a[1]).slice(0, 15)
    .map(([k, n]) => n + '× ' + k).join('\n');
}));
await b.close();
