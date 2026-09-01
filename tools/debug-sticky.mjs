import { chromium } from 'playwright';
import { EDITS as SPLIT } from './edits-split.mjs';
import { EDITS as REFINE } from './edits-refine.mjs';
const ALL = [...SPLIT, ...REFINE];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
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

/* which ancestor breaks sticky? list overflow/display/height up the chain */
const chain = await page.evaluate(() => {
  const out = [];
  let n = document.querySelector('.apsc-facts');
  while (n && n !== document.documentElement) {
    const cs = getComputedStyle(n);
    if (cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible' ||
        cs.display === 'contents' || cs.transform !== 'none') {
      out.push({
        el: n.tagName + '.' + String(n.className).split(' ').slice(0, 2).join('.'),
        overflow: cs.overflow + '/' + cs.overflowX + '/' + cs.overflowY,
        display: cs.display, transform: cs.transform === 'none' ? '-' : 'TRANSFORM'
      });
    }
    n = n.parentElement;
  }
  return out;
});
console.log('suspicious ancestors:');
chain.forEach(c => console.log(' ', JSON.stringify(c)));

/* phone overflow: fresh load, find the culprit by right-edge scan */
await page.setViewportSize({ width: 375, height: 812 });
await page.goto('https://www.aroidpedia.com/journal/alocasia-acuminata', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-apsc-mount] .apsc-body', { timeout: 30000 });
await page.waitForTimeout(2500);
const ph = await page.evaluate(() => {
  const cw = document.documentElement.clientWidth;
  const over = document.documentElement.scrollWidth - cw;
  const bad = [];
  document.querySelectorAll('*').forEach(e => {
    const r = e.getBoundingClientRect();
    if (r.right > cw + 2 && r.width > 8) {
      bad.push({ el: e.tagName + '.' + String(e.className).split(' ').slice(0, 2).join('.'), right: Math.round(r.right), w: Math.round(r.width) });
    }
  });
  return { over, bad: bad.slice(0, 8) };
});
console.log('phone fresh-load overflow:', ph.over);
ph.bad.forEach(b => console.log(' ', JSON.stringify(b)));
await browser.close();
