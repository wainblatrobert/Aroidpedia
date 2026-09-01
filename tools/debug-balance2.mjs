import fs from 'fs';
import { chromium } from 'playwright';
import { EDITS as V6 } from './edits-visual.mjs';
import { EDITS as V7 } from './edits-balance.mjs';

const clim = JSON.parse(fs.readFileSync(new URL('./climate.json', import.meta.url), 'utf8'));
const ALL = [...V6, ...V7];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 300)));
page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE ERR:', m.text().slice(0, 200)); });
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  let applied = [];
  ALL.forEach(([o, n], i) => { const at = html.indexOf(o); if (at >= 0) { html = html.slice(0, at) + n + html.slice(at + o.length); applied.push(i); } });
  console.log('applied edit indexes:', applied.join(','));
  html = html.replace('<head>', '<head><script>window.APCLIM_DATA=' + JSON.stringify(clim) + ';</script>');
  await route.fulfill({ response: resp, body: html });
});
await page.goto('https://www.aroidpedia.com/journal/alocasia-baginda', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.apsc-fact--clim svg', { timeout: 30000 });
await page.waitForTimeout(2500);

/* 1: does a resize dispatch trigger a move? */
await page.evaluate(() => window.dispatchEvent(new Event('resize')));
await page.waitForTimeout(600);
let s = await page.evaluate(() => document.querySelector('.apsc-hero').querySelectorAll('.apsc-sec').length);
console.log('after resize dispatch, sections in fig:', s);

/* 2: manual execution of the same logic — errors surface here */
const manual = await page.evaluate(() => {
  try {
    const fig = document.querySelector('.apsc-hero');
    const body = document.querySelector('.apsc-body');
    const rail = document.querySelector('.apsc-facts');
    const gap = rail.offsetHeight - fig.offsetHeight;
    const kid = body.children[0];
    const ok = /\bapsc-sec\b/.test(kid.className || '');
    if (gap > 260 && ok) { fig.appendChild(kid); return { moved: true, gap }; }
    return { moved: false, gap, ok, cls: kid.className };
  } catch (e) { return { err: String(e) }; }
});
console.log('manual:', JSON.stringify(manual));
await browser.close();
