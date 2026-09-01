/* Live-verifies SPECIES CARD v14's page-order strip: intercepts the
   document request, swaps the OLD More-photos assembly in the page's
   inline footer for the NEW sorted one, and lets the real build run. */
import fs from 'fs';
import { chromium } from 'playwright';

const v3 = fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v3.txt', 'utf8');
const mNew = v3.slice(v3.indexOf('    /* v14: THE STRIP FOLLOWS THE PAGE'), v3.indexOf('if (rest.length) body.appendChild(section("More photos"'));
const M_OLD_TAIL = 'if (rest.length) body.appendChild(section("More photos"';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  const i = html.indexOf(M_OLD_TAIL);
  if (i >= 0) html = html.slice(0, i) + mNew + html.slice(i);
  await route.fulfill({ response: resp, body: html });
});

for (const slug of ['alocasia-alba', 'alocasia-acuminata']) {
  await page.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-apsc-mount] .apsc-sec', { timeout: 30000 });
  await page.waitForTimeout(2000);
  const r = await page.evaluate(() => {
    const b = s => (s || '').split('?')[0].split('/').pop();
    const gal = [...document.querySelectorAll('.sqs-block-gallery')]
      .flatMap(g => [...g.querySelectorAll('img')].map(i => b(i.currentSrc || i.src || i.getAttribute('data-src'))));
    const secs = [...document.querySelectorAll('[data-apsc-mount] .apsc-sec')];
    const more = secs.find(s => /more photos/i.test(s.querySelector('.apsc-sec__h')?.textContent || ''));
    const card = more ? [...more.querySelectorAll('img')].map(i => b(i.src)) : [];
    return { gal, card };
  });
  const galSet = new Set(r.gal);
  const inGal = r.card.filter(x => galSet.has(x));
  const galOrder = r.gal.filter(x => inGal.includes(x));
  const leaks = r.card.map((x, i) => galSet.has(x) ? null : i + ':' + x).filter(Boolean);
  console.log('===', slug);
  console.log(' gallery items in card follow gallery order:', inGal.join('|') === galOrder.join('|'));
  console.log(' non-gallery images at positions:', leaks.join(' , ') || 'none');
  console.log(' first 6 of strip:', r.card.slice(0, 6).join(' | '));
}
await browser.close();
