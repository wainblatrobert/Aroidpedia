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

const info = await page.evaluate(() => {
  const rail = document.querySelector('.apsc-facts');
  const top = document.querySelector('.apsc-top');
  const col = document.querySelector('.apsc-colmain');
  return {
    railH: rail.offsetHeight, railStyleTop: rail.style.top,
    topRect: { top: Math.round(top.getBoundingClientRect().top + scrollY), h: Math.round(top.getBoundingClientRect().height) },
    colH: col.offsetHeight
  };
});
console.log('geometry:', JSON.stringify(info));

for (const y of [0, 400, 800, 1200, 1600, 2000, 2600, 3200]) {
  await page.evaluate(v => window.scrollTo(0, v), y);
  await page.waitForTimeout(250);
  const s = await page.evaluate(() => {
    const r = document.querySelector('.apsc-facts').getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom) };
  });
  console.log('scrollY', String(y).padStart(5), '· rail viewport top', String(s.top).padStart(6), 'bottom', String(s.bottom).padStart(6));
}
await browser.close();
