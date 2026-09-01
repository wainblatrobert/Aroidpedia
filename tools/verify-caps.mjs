import fs from 'fs';
import { chromium } from 'playwright';
import { EDITS } from './edits-visual.mjs';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  for (const [o, n] of EDITS) { const i = html.indexOf(o); if (i >= 0) html = html.slice(0, i) + n + html.slice(i + o.length); }
  await route.fulfill({ response: resp, body: html });
});
await page.goto('https://www.aroidpedia.com/journal/alocasia-cuprea', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-apsc-mount] .apsc-sec', { timeout: 30000 });
await page.waitForTimeout(2500);
const caps = await page.evaluate(() => [...document.querySelectorAll('.apsc-strip__cap')].map(x => x.textContent.slice(0, 70)));
console.log('caption spans:', caps.length);
caps.slice(0, 5).forEach(c => console.log('  ', c));
const cap = await page.$('.apsc-strip button .apsc-strip__cap');
if (cap) {
  const btn = await page.evaluateHandle(el => el.closest('button'), cap);
  await btn.asElement().scrollIntoViewIfNeeded();
  await btn.asElement().hover();
  await page.waitForTimeout(400);
  await btn.asElement().screenshot({ path: 'v6-tile-hover.png' });
  console.log('hover shot taken');
}
await browser.close();
