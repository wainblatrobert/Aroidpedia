/* Splices BOTH pending edit sets (v6 visual + v7 balance) into the
   served page (live = v5) and checks baginda (short hero -> OD moves
   up, legend present) vs acuminata (tall hero -> OD stays in body). */
import fs from 'fs';
import { chromium } from 'playwright';
import { EDITS as V6 } from './edits-visual.mjs';
import { EDITS as V7 } from './edits-balance.mjs';

const clim = JSON.parse(fs.readFileSync(new URL('./climate.json', import.meta.url), 'utf8'));
const ALL = [...V6, ...V7];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  let n = 0;
  for (const [o, nw] of ALL) { const i = html.indexOf(o); if (i >= 0) { html = html.slice(0, i) + nw + html.slice(i + o.length); n++; } }
  html = html.replace('<head>', '<head><script>window.APCLIM_DATA=' + JSON.stringify(clim) + ';</script>');
  console.log('  applied', n + '/' + ALL.length);
  await route.fulfill({ response: resp, body: html });
});

for (const slug of ['alocasia-baginda', 'alocasia-acuminata']) {
  await page.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.apsc-fact--clim svg', { timeout: 30000 });
  await page.waitForTimeout(3000);
  const r = await page.evaluate(() => {
    const od = document.querySelector('#apsc-original-description');
    const fig = document.querySelector('.apsc-hero');
    const rail = document.querySelector('.apsc-facts');
    const legend = document.querySelector('.apsc-clim__legend');
    return {
      odInFig: !!od && od.parentNode === fig,
      gap: rail && fig ? Math.round(rail.offsetHeight - fig.offsetHeight) : null,
      legend: legend ? legend.textContent : null
    };
  });
  /* hover a month to read the typicals */
  await page.hover('.apsc-fact--clim svg [data-m="3"]');
  const hov = await page.$eval('.apsc-clim__read', x => x.textContent);
  console.log(slug.padEnd(22), 'OD moved up:', r.odInFig, '· residual gap:', r.gap + 'px',
    '· legend:', JSON.stringify(r.legend), '· APR hover:', hov);
  if (slug === 'alocasia-baginda') {
    await page.mouse.move(0, 0); await page.waitForTimeout(300);
    const top = await page.$('.apsc-top');
    await top.screenshot({ path: 'v7-baginda-top.png' });
  }
}
await browser.close();
console.log('done');
