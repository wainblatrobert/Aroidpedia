import { chromium } from 'playwright';
import { EDITS as SPLIT } from './edits-split.mjs';
import { EDITS as REFINE } from './edits-refine.mjs';
const ALL = [...SPLIT, ...REFINE];

const browser = await chromium.launch({ channel: 'chrome', headless: true });

/* 1: baseline phone overflow on the UNTOUCHED live page */
const p0 = await browser.newPage({ viewport: { width: 375, height: 812 } });
await p0.goto('https://www.aroidpedia.com/journal/alocasia-acuminata', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p0.waitForSelector('[data-apsc-mount]', { timeout: 30000 });
await p0.waitForTimeout(2500);
console.log('baseline live phone overflow:',
  await p0.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
await p0.close();

/* 2: extended sticky-breaker scan */
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  for (const [o, nw] of ALL) { const i = html.indexOf(o); if (i >= 0) html = html.slice(0, i) + nw + html.slice(i + o.length); }
  await route.fulfill({ response: resp, body: html });
});
await page.goto('https://www.aroidpedia.com/journal/alocasia-acuminata', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-apsc-mount] .apsc-body', { timeout: 30000 });
await page.waitForTimeout(2500);
const r = await page.evaluate(() => {
  const out = [];
  let n = document.querySelector('.apsc-facts');
  while (n && n !== document.documentElement) {
    const cs = getComputedStyle(n);
    const flags = [];
    if (cs.contain && cs.contain !== 'none') flags.push('contain:' + cs.contain);
    if (cs.willChange && cs.willChange !== 'auto') flags.push('will-change:' + cs.willChange);
    if (cs.filter && cs.filter !== 'none') flags.push('filter');
    if (cs.backdropFilter && cs.backdropFilter !== 'none') flags.push('backdrop-filter');
    if (cs.perspective && cs.perspective !== 'none') flags.push('perspective');
    if (cs.contentVisibility && cs.contentVisibility !== 'visible') flags.push('cv:' + cs.contentVisibility);
    if (cs.transform !== 'none') flags.push('transform');
    if (cs.overflow !== 'visible visible' && cs.overflow !== 'visible') flags.push('overflow:' + cs.overflow);
    if (flags.length) out.push({ el: n.tagName + '.' + String(n.className).split(' ').slice(0, 2).join('.'), flags });
    n = n.parentElement;
  }
  /* also: does a minimal test sticky work inside apsc-top? */
  const topEl = document.querySelector('.apsc-top');
  const probe = document.createElement('div');
  probe.style.cssText = 'position:sticky;top:0;height:10px;';
  topEl.appendChild(probe);
  const cs2 = getComputedStyle(probe);
  const stickyComputes = cs2.position;
  probe.remove();
  /* and re-read the rail's inline style + computed at this moment */
  const rail = document.querySelector('.apsc-facts');
  return { flagged: out, stickyComputes, railInline: rail.getAttribute('style'), railComputed: getComputedStyle(rail).position };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
