/* Delta-splice ONLY the seam edits onto the pasted v23 page; check the
   gap is sealed while the map is pinned, and the name size. */
import { chromium } from 'playwright';
import { EDITS } from './edits-seam.mjs';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  let n = 0;
  for (const [o, nw] of EDITS) { const i = html.indexOf(o); if (i >= 0) { html = html.slice(0, i) + nw + html.slice(i + o.length); n++; } }
  console.log('applied', n + '/' + EDITS.length);
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
  const hd = document.querySelector('#header').getBoundingClientRect();
  const before = getComputedStyle(map, '::before');
  /* what element is visible in the former gap, at the map's center-x
     just above its top edge? */
  const probe = document.elementFromPoint(m.left + m.width / 2, m.top - 6);
  return {
    mapTop: Math.round(m.top), headerBottom: Math.round(hd.bottom),
    strip: { h: before.height, bg: before.backgroundColor, pos: before.position, bottom: before.bottom },
    gapProbe: probe ? probe.tagName + '.' + String(probe.className).split(' ')[0] : null,
    nameSize: getComputedStyle(document.querySelector('.apsc-runhead')).fontSize
  };
});
console.log(JSON.stringify(r, null, 1));
const clip = await page.$('.apsc-facts');
await page.screenshot({ path: 'seam-check.png', clip: { x: 1000, y: 0, width: 440, height: 500 } });
await browser.close();
