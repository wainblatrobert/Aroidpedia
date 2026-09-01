/* Stronger check: every image in the strip must appear in the same
   order as its FIRST occurrence among the post's own (hidden) source
   blocks, read top to bottom. */
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
    const b = s => (s || '').split('?')[0].split('/').pop();
    /* page order of first occurrences across the post's source blocks */
    const blocks = [...document.querySelectorAll('.sqs-block-image, .sqs-block-gallery')];
    const firstAt = {};
    blocks.forEach((blk, bi) => {
      [...blk.querySelectorAll('img')].forEach((im, ii) => {
        const k = b(im.currentSrc || im.src || im.getAttribute('data-src'));
        if (k && !(k in firstAt)) firstAt[k] = bi * 10000 + ii;
      });
    });
    const secs = [...document.querySelectorAll('[data-apsc-mount] .apsc-sec')];
    const more = secs.find(s => /more photos/i.test(s.querySelector('.apsc-sec__h')?.textContent || ''));
    const card = more ? [...more.querySelectorAll('img')].map(i => b(i.src)) : [];
    const keys = card.map(k => firstAt[k]);
    let sorted = true, missing = 0;
    for (let i = 1; i < keys.length; i++) {
      if (keys[i] == null || keys[i - 1] == null) { missing++; continue; }
      if (keys[i] < keys[i - 1]) sorted = false;
    }
    return { n: card.length, sorted, missing };
  });
  console.log(slug.padEnd(28), 'strip follows page order:', r.sorted, ' (' + r.n + ' images, ' + r.missing + ' unmatchable)');
}
await browser.close();
