/* Delta-splice seam(v4) + seam2(v5) edits onto the pasted v23 page and
   probe both edges of the pinned map. */
import { chromium } from 'playwright';
import { EDITS as SEAM } from './edits-seam.mjs';
import { EDITS as SEAM2 } from './edits-seam2.mjs';
const ALL = [...SEAM, ...SEAM2];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  let n = 0;
  for (const [o, nw] of ALL) { const i = html.indexOf(o); if (i >= 0) { html = html.slice(0, i) + nw + html.slice(i + o.length); n++; } }
  console.log('applied', n + '/' + ALL.length);
  await route.fulfill({ response: resp, body: html });
});
await page.goto('https://www.aroidpedia.com/journal/alocasia-baginda', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-apsc-mount] .apsc-body', { timeout: 30000 });
await page.waitForTimeout(3000);
await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(600);
const r = await page.evaluate(() => {
  const map = document.querySelector('.apsc-map');
  const m = map.getBoundingClientRect();
  const above = document.elementFromPoint(m.left + m.width / 2, m.top - 6);
  const below = document.elementFromPoint(m.left + m.width / 2, m.bottom + 6);
  const id = e => e ? e.tagName + '.' + String(e.className).split(' ')[0] : null;
  return { mapTop: Math.round(m.top), aboveProbe: id(above), belowProbe: id(below) };
});
console.log(JSON.stringify(r));
await page.screenshot({ path: 'seam2-check.png', clip: { x: 1000, y: 0, width: 440, height: 560 } });
await browser.close();
