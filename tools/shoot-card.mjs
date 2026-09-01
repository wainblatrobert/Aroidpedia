/* Screenshot the live card at its key regions, desktop + phone. */
import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('https://www.aroidpedia.com/journal/alocasia-acuminata', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-apsc-mount] .apsc-sec', { timeout: 30000 });
await page.waitForTimeout(3500);

const top = await page.$('.apsc-top');
if (top) await top.screenshot({ path: 'card-top.png' });

const secs = await page.$$('[data-apsc-mount] .apsc-sec');
console.log('sections:', secs.length);
for (const s of secs) {
  const h = await s.$eval('.apsc-sec__h', x => x.textContent.trim()).catch(() => '');
  if (/original description/i.test(h)) await s.screenshot({ path: 'card-sec-original.png' }).catch(e => console.log('orig shot fail'));
  if (/more photos/i.test(h)) await s.screenshot({ path: 'card-more.png' }).catch(e => console.log('more shot fail'));
}

/* phone */
await page.setViewportSize({ width: 375, height: 812 });
await page.waitForTimeout(1200);
const mount = await page.$('[data-apsc-mount]');
const box = await mount.boundingBox();
console.log('phone card height:', Math.round(box.height));
await page.screenshot({ path: 'card-phone-top.png' });
await page.evaluate(() => window.scrollBy(0, 1400));
await page.waitForTimeout(400);
await page.screenshot({ path: 'card-phone-mid.png' });
await browser.close();
console.log('done');
