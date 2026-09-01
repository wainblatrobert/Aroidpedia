/* URL-keyed check (filenames collide across duplicate uploads):
   1. the card strip's gallery-URL members follow the gallery's URL order
   2. every strip image's source-block index is non-decreasing, where
      the index is resolved by full asset path against the page blocks */
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

for (const slug of ['alocasia-alba', 'alocasia-acuminata', 'alocasia-clypeolata', 'alocasia-brisbanensis']) {
  await page.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-apsc-mount] .apsc-sec', { timeout: 30000 });
  await page.waitForTimeout(2000);
  const r = await page.evaluate(() => {
    const norm = s => (s || '').split('?')[0];
    const key = i => norm(i.currentSrc || i.src || i.getAttribute('data-src') || '');
    const blocks = [...document.querySelectorAll('.sqs-block-image, .sqs-block-gallery')];
    const at = {};
    blocks.forEach((blk, bi) => [...blk.querySelectorAll('img')].forEach((im, ii) => {
      const k = key(im); if (k && !(k in at)) at[k] = bi * 10000 + ii;
    }));
    const galURLs = [...document.querySelectorAll('.sqs-block-gallery img')].map(key);
    const galSet = new Set(galURLs);
    const secs = [...document.querySelectorAll('[data-apsc-mount] .apsc-sec')];
    const more = secs.find(s => /more photos/i.test(s.querySelector('.apsc-sec__h')?.textContent || ''));
    const card = more ? [...more.querySelectorAll('img')].map(i => norm(i.src)) : [];
    const inGal = card.filter(u => galSet.has(u));
    const galOrder = galURLs.filter(u => inGal.includes(u));
    const galOK = inGal.join('|') === galOrder.join('|');
    let mono = true, unresolved = 0, prev = -1;
    card.forEach(u => {
      const a = at[u];
      if (a == null) { unresolved++; return; }
      if (a < prev) mono = false;
      prev = a;
    });
    return { n: card.length, galOK, mono, unresolved };
  });
  console.log(slug.padEnd(26), 'gallery order kept:', r.galOK, '· page-monotonic:', r.mono,
    '· images:', r.n, r.unresolved ? '(' + r.unresolved + ' unresolved URL)' : '');
}
await browser.close();
