/* Live-verifies SPECIES CARD v15: splices the v4 file's full More-photos
   passage (retired-filter + sort) into the served page in place of the
   live (v13-era) assembly, then checks the strip. */
import fs from 'fs';
import { chromium } from 'playwright';

const v4 = fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v4.txt', 'utf8');
const START = '    /* v15: THE GENERIC RANGE MAPS ARE GONE';
const TAIL = 'if (rest.length) body.appendChild(section("More photos"';
const newPassage = v4.slice(v4.indexOf(START), v4.indexOf(TAIL));

/* the live page still runs the ORIGINAL assembly (filter only) —
   replace it wholesale */
const LIVE_OLD = `var rest = allImgs.filter(function(i){
      var k = i.src.split("?")[0];
      if (shown[k]) return false;
      shown[k] = 1;
      return true;
    });`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
let swapped = 0;
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  const i = html.indexOf(LIVE_OLD);
  if (i >= 0) { html = html.slice(0, i) + newPassage.replace(/^\s*/, '') + html.slice(i + LIVE_OLD.length); swapped++; }
  await route.fulfill({ response: resp, body: html });
});

for (const slug of ['alocasia-acuminata', 'alocasia-alba', 'alocasia-atropurpurea', 'alocasia-cuprea']) {
  await page.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-apsc-mount] .apsc-sec', { timeout: 30000 });
  await page.waitForTimeout(2000);
  const r = await page.evaluate(() => {
    const b = s => (s || '').split('?')[0].split('/').pop();
    const norm = s => (s || '').split('?')[0];
    const key = i => norm(i.currentSrc || i.src || i.getAttribute('data-src') || '');
    const galURLs = [...document.querySelectorAll('.sqs-block-gallery img')].map(key);
    const galSet = new Set(galURLs);
    const secs = [...document.querySelectorAll('[data-apsc-mount] .apsc-sec')];
    const more = secs.find(s => /more photos/i.test(s.querySelector('.apsc-sec__h')?.textContent || ''));
    const cardURLs = more ? [...more.querySelectorAll('img')].map(i => norm(i.src)) : [];
    const inGal = cardURLs.filter(u => galSet.has(u));
    const galOrder = galURLs.filter(u => inGal.includes(u));
    return {
      n: cardURLs.length,
      first3: cardURLs.slice(0, 3).map(b),
      galOK: inGal.join('|') === galOrder.join('|'),
      geoLeft: cardURLs.map(b).filter(x => /geo|distribution/i.test(x))
    };
  });
  console.log(slug.padEnd(24), 'n=' + r.n, 'galleryOrder:', r.galOK,
    'geo/distribution left:', r.geoLeft.length ? r.geoLeft.join(',') : 'NONE',
    '\n   first:', r.first3.join(' | '));
}
console.log('documents swapped:', swapped);
await browser.close();
