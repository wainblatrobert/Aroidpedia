import fs from 'fs';
import { chromium } from 'playwright';
import { EDITS as V6 } from './edits-visual.mjs';
import { EDITS as V7 } from './edits-balance.mjs';

const clim = JSON.parse(fs.readFileSync(new URL('./climate.json', import.meta.url), 'utf8'));
const ALL = [...V6, ...V7];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 200)));
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  for (const [o, n] of ALL) { const i = html.indexOf(o); if (i >= 0) html = html.slice(0, i) + n + html.slice(i + o.length); }
  html = html.replace('<head>', '<head><script>window.APCLIM_DATA=' + JSON.stringify(clim) + ';</script>');
  await route.fulfill({ response: resp, body: html });
});
await page.goto('https://www.aroidpedia.com/journal/alocasia-baginda', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.apsc-fact--clim svg', { timeout: 30000 });
await page.waitForTimeout(3000);
const r = await page.evaluate(() => {
  const body = document.querySelector('.apsc-body');
  const fig = document.querySelector('.apsc-hero');
  const rail = document.querySelector('.apsc-facts');
  const kids = [...body.children].slice(0, 5).map(k => ({ cls: k.className, id: k.id, h: k.offsetHeight }));
  const balanceCodePresent = !!document.documentElement.outerHTML.match(/apsc-balance-home/);
  return {
    kids,
    balanceCodePresent,
    railH: rail.offsetHeight, figH: fig.offsetHeight,
    marksInFig: fig.querySelectorAll('.apsc-sec').length
  };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
