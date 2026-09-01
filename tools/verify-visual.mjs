/* Splices the v6 edits into the live page and checks/photographs:
   typical-day band, current-month marker, hover caption, plates label,
   tile waiting state. Uses local climate.json 1.3.0 as APCLIM_DATA so
   the humidity row also previews its final numbers. */
import fs from 'fs';
import { chromium } from 'playwright';
import { EDITS } from './edits-visual.mjs';

const clim = JSON.parse(fs.readFileSync(new URL('./climate.json', import.meta.url), 'utf8'));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  let applied = 0;
  for (const [oldS, newS] of EDITS) {
    const i = html.indexOf(oldS);
    if (i >= 0) { html = html.slice(0, i) + newS + html.slice(i + oldS.length); applied++; }
  }
  html = html.replace('<head>', '<head><script>window.APCLIM_DATA=' + JSON.stringify(clim) + ';</script>');
  console.log('edits applied to document:', applied + '/' + EDITS.length);
  await route.fulfill({ response: resp, body: html });
});

await page.goto('https://www.aroidpedia.com/journal/alocasia-acuminata', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.apsc-fact--clim svg', { timeout: 30000 });
await page.waitForTimeout(2500);

const r = await page.evaluate(() => {
  const clim = document.querySelector('.apsc-fact--clim');
  const t = clim.querySelectorAll('svg')[0];
  return {
    innerBand: !!t.querySelector('.apclim-band--t-in'),
    nowLine: clim.querySelectorAll('.apclim-now').length,
    nowLit: [...clim.querySelectorAll('.apclim-mlab--now')].map(x => x.textContent),
    reads: [...clim.querySelectorAll('.apsc-clim__read')].map(x => x.textContent),
    dataV: clim.querySelector('.apsc-clim').getAttribute('data-apclim-data'),
    noteOneLine: getComputedStyle(clim.querySelector('.apsc-clim__note')).whiteSpace,
    platesLabel: document.querySelector('.apsc-plates__label')?.textContent || null,
    capCount: document.querySelectorAll('.apsc-strip__cap').length
  };
});
console.log(JSON.stringify(r, null, 1));

/* screenshots: rail (chart area), plates label, a hovered tile */
const rail = await page.$('[data-apsc-mount] .apsc-facts');
await rail.screenshot({ path: 'v6-rail.png' });
const hero = await page.$('.apsc-hero');
if (hero) await hero.screenshot({ path: 'v6-plates.png' });

const capBtn = await page.$('.apsc-strip button .apsc-strip__cap');
if (capBtn) {
  const btn = await page.evaluateHandle(el => el.closest('button'), capBtn);
  await btn.asElement().scrollIntoViewIfNeeded();
  await btn.asElement().hover();
  await page.waitForTimeout(400);
  await btn.asElement().screenshot({ path: 'v6-tile-hover.png' });
}
await browser.close();
console.log('done');
