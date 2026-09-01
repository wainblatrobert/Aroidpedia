/* Is the live genus map current, and does it show the Bangladesh
   river-haze the journal round diagnosed? */
import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
const logs = [];
p.on('console', m => { const t = m.text(); if (/apgm|apsc|footer/i.test(t)) logs.push(t); });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(12000);
console.log('console stamps:', logs.join(' | ') || '(none)');
console.log(await p.evaluate(() => {
  const m = document.querySelector('[data-apgm-version], .apgm');
  const root = document.querySelector('.apgm');
  return 'version attr: ' + (m ? (m.getAttribute('data-apgm-version') || m.getAttribute('data-version') || '(none)') : '(no map node)') +
    ' | map present: ' + !!root;
}));
/* find the genus map svg + its view pills */
const pills = await p.evaluate(() => Array.from(document.querySelectorAll('.apgm button, .apgm [data-view]'))
  .map(x => (x.dataset.view || '') + ':' + x.textContent.trim()).filter(Boolean).slice(0, 12).join(' '));
console.log('pills:', pills);
/* zones view, screenshot Bangladesh area */
await p.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => /zone/i.test(x.dataset.view || x.textContent));
  if (z) z.click();
});
await p.waitForTimeout(900);
const clip = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  if (!svg) return null;
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const S = (lon, lat) => ({ x: sr.x + (lon - vb.x)/vb.width*sr.width, y: sr.y + (-lat - vb.y)/vb.height*sr.height });
  const a = S(70, 30), c = S(105, 5);
  window.scrollTo(0, sr.top + window.scrollY - 200);
  return { x: a.x, y: Math.max(0, a.y), width: c.x - a.x, height: c.y - a.y };
});
await p.waitForTimeout(500);
if (clip) {
  const clip2 = await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
    const S = (lon, lat) => ({ x: sr.x + (lon - vb.x)/vb.width*sr.width, y: sr.y + (-lat - vb.y)/vb.height*sr.height });
    const a = S(70, 30), c = S(105, 5);
    return { x: a.x, y: a.y, width: c.x - a.x, height: c.y - a.y };
  });
  await p.screenshot({ path: SP + 'gm-bd.png', clip: clip2, animations: 'disabled' });
  console.log('screenshot saved');
} else console.log('NO APGM SVG FOUND');
await b.close();
