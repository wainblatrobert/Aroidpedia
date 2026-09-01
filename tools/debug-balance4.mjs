import fs from 'fs';
import { chromium } from 'playwright';
import { EDITS as V6 } from './edits-visual.mjs';
import { EDITS as V7 } from './edits-balance.mjs';

const clim = JSON.parse(fs.readFileSync(new URL('./climate.json', import.meta.url), 'utf8'));
/* instrument the balance code with beacons */
const V7i = V7.map(([o, n]) => [o, n
  .replace('(function(){\n      if (!fig.firstChild) return;',
           '(function(){\n      window.__balStart = 1;\n      if (!fig.firstChild) return;\n      window.__balFig = 1;')
  .replace('if (!cands.length) return;',
           'window.__balCands = cands.length;\n      window.__balBody = { n: body.children.length, first: body.children[0] ? body.children[0].tagName + "." + body.children[0].className + "#" + body.children[0].id : null };\n      if (!cands.length) return;')
  .replace('function balance(){',
           'function balance(){\n        window.__balCalls = (window.__balCalls || 0) + 1;')
]);
const ALL = [...V6, ...V7i];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 300)));
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
await page.waitForTimeout(2500);
const b = await page.evaluate(() => ({
  start: window.__balStart, fig: window.__balFig, cands: window.__balCands, calls: window.__balCalls,
  body: window.__balBody,
  inFig: document.querySelector('.apsc-hero').querySelectorAll('.apsc-sec').length
}));
console.log(JSON.stringify(b));
await browser.close();
