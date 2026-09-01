/* Splices the split edits into the served page (live = v7/FILE v20)
   and verifies the two-column layout on three posts + phone order. */
import { chromium } from 'playwright';
import { EDITS } from './edits-split.mjs';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  let n = 0;
  for (const [o, nw] of EDITS) { const i = html.indexOf(o); if (i >= 0) { html = html.slice(0, i) + nw + html.slice(i + o.length); n++; } }
  console.log('  applied', n + '/' + EDITS.length);
  await route.fulfill({ response: resp, body: html });
});

for (const slug of ['alocasia-baginda', 'alocasia-acuminata', 'alocasia-frankenstein']) {
  await page.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-apsc-mount] .apsc-body', { timeout: 30000 });
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => {
    const col = document.querySelector('.apsc-colmain');
    const body = document.querySelector('.apsc-body');
    const rail = document.querySelector('.apsc-facts');
    const infl = document.querySelector('#apsc-inflorescence');
    const err = [];
    if (!col) err.push('no colmain');
    if (body && col && body.parentNode !== col) err.push('body not in column');
    return {
      err,
      bodyW: body ? Math.round(body.getBoundingClientRect().width) : null,
      railRight: rail ? Math.round(rail.getBoundingClientRect().left) : null,
      inflW: infl ? Math.round(infl.getBoundingClientRect().width) : null,
      secsInFig: document.querySelector('.apsc-hero') ? document.querySelector('.apsc-hero').querySelectorAll('.apsc-sec').length : 0,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  console.log(slug.padEnd(24), JSON.stringify(r));
  if (slug === 'alocasia-baginda') {
    await page.screenshot({ path: 'split-baginda-desktop.png', fullPage: false });
    await page.evaluate(() => window.scrollBy(0, 1200));
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'split-baginda-scrolled.png' });
    await page.evaluate(() => window.scrollTo(0, 0));
  }
}

/* phone order check on baginda */
await page.setViewportSize({ width: 375, height: 812 });
await page.goto('https://www.aroidpedia.com/journal/alocasia-baginda', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-apsc-mount] .apsc-body', { timeout: 30000 });
await page.waitForTimeout(2500);
const m = await page.evaluate(() => {
  const y = s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + window.scrollY) : null; };
  return {
    heroY: y('.apsc-hero'), railY: y('.apsc-facts'), bodyY: y('.apsc-body'),
    orderOK: y('.apsc-hero') < y('.apsc-facts') && y('.apsc-facts') < y('.apsc-body'),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
});
console.log('phone:', JSON.stringify(m));
await browser.close();
