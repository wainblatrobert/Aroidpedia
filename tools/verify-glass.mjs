/* Delta-splice onto the live page (auto-detects whether seam2/v25 is
   pasted) and verify the glass: computed backdrop-filter, rest-state
   tone stability, and a screenshot of text passing beneath the map. */
import { chromium } from 'playwright';
import { EDITS as SEAM2 } from './edits-seam2.mjs';
import { EDITS as GLASS } from './edits-glass.mjs';
const ALL = [...SEAM2, ...GLASS];

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

const cs = await page.evaluate(() => {
  const map = document.querySelector('.apsc-map');
  const m = getComputedStyle(map);
  const b = getComputedStyle(map, '::before');
  return {
    map: { bg: m.backgroundColor, bf: m.backdropFilter || m.webkitBackdropFilter },
    strip: { bg: b.backgroundColor, bf: b.backdropFilter || b.webkitBackdropFilter }
  };
});
console.log('computed:', JSON.stringify(cs));

/* rest state shot (map in natural position) */
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await page.screenshot({ path: 'glass-rest.png', clip: { x: 1040, y: 380, width: 400, height: 420 } });

/* pinned with text passing beneath */
await page.evaluate(() => window.scrollTo(0, 1000));
await page.waitForTimeout(700);
await page.screenshot({ path: 'glass-pinned.png', clip: { x: 1000, y: 0, width: 440, height: 560 } });
await browser.close();
console.log('done');
