import fs from 'fs';
import { chromium } from 'playwright';

const v3 = fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v3.txt', 'utf8');
const mNew = v3.slice(v3.indexOf('    /* v14: THE STRIP FOLLOWS THE PAGE'), v3.indexOf('if (rest.length) body.appendChild(section("More photos"'));
const M_OLD_TAIL = 'if (rest.length) body.appendChild(section("More photos"';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
let intercepted = 0;
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  const i = html.indexOf(M_OLD_TAIL);
  if (i >= 0) { html = html.slice(0, i) + mNew + html.slice(i); intercepted++; }
  await route.fulfill({ response: resp, body: html });
});

const slug = 'alocasia-alba';
await page.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-apsc-mount] .apsc-sec', { timeout: 30000 });
await page.waitForTimeout(2000);
const r = await page.evaluate(() => {
  const b = s => (s || '').split('?')[0].split('/').pop();
  const marker = document.documentElement.outerHTML.indexOf('THE STRIP FOLLOWS THE PAGE') >= 0;
  const blocks = [...document.querySelectorAll('.sqs-block-image, .sqs-block-gallery')];
  const firstAt = {}, blockOf = {};
  blocks.forEach((blk, bi) => {
    [...blk.querySelectorAll('img')].forEach((im, ii) => {
      const k = b(im.currentSrc || im.src || im.getAttribute('data-src'));
      if (k && !(k in firstAt)) { firstAt[k] = bi * 10000 + ii; blockOf[k] = bi; }
    });
  });
  const secs = [...document.querySelectorAll('[data-apsc-mount] .apsc-sec')];
  const more = secs.find(s => /more photos/i.test(s.querySelector('.apsc-sec__h')?.textContent || ''));
  const card = more ? [...more.querySelectorAll('img')].map(i => b(i.src)) : [];
  const viol = [];
  for (let i = 1; i < card.length; i++) {
    if (firstAt[card[i]] < firstAt[card[i - 1]]) {
      viol.push(`pos ${i}: ${card[i]} (block ${blockOf[card[i]]}) after ${card[i - 1]} (block ${blockOf[card[i - 1]]})`);
    }
  }
  return { marker, viol: viol.slice(0, 6), nBlocks: blocks.length };
});
console.log('injected code present in page:', r.marker, '· intercepted responses:', intercepted, '· img blocks:', r.nBlocks);
r.viol.forEach(v => console.log('  VIOLATION', v));
await browser.close();
