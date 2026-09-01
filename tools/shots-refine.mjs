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
await page.waitForTimeout(3000);
await page.evaluate(() => window.scrollTo(0, 1200));
await page.waitForTimeout(800);
await page.screenshot({ path: 'refine-pinned.png' });
await page.evaluate(() => { document.querySelector('.apsc-wide').scrollIntoView(); window.scrollBy(0, -140); });
await page.waitForTimeout(1200);
await page.screenshot({ path: 'refine-wide.png' });
await browser.close();
console.log('shots taken');
