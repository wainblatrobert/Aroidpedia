/* Live-verifies SPECIES CARD v16: swaps the rail fact loop in the
   served page for the v5 version and checks the Climate prose row is
   gone while Climate range (measured) and Ecology stay. */
import fs from 'fs';
import { chromium } from 'playwright';

const v5 = fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.9.26 v5.txt', 'utf8');
const START = '    /* v16: CLIMATE PROSE IS RETIRED SITE-WIDE';
const TAIL = '["parentage","hybridizer","ecology"].forEach(function(k){';
const newPassage = v5.slice(v5.indexOf(START), v5.indexOf(TAIL) + TAIL.length);
const LIVE_OLD = '["parentage","hybridizer","climate","ecology"].forEach(function(k){';

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

for (const slug of ['alocasia-acuminata', 'amorphophallus-coudercii', 'alocasia-cucullata']) {
  await page.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-apsc-mount] .apsc-facts', { timeout: 30000 });
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => {
    const rail = document.querySelector('[data-apsc-mount] .apsc-facts');
    const labels = [...rail.querySelectorAll('.apsc-fact__label')].map(x => x.textContent.trim());
    const bodySecs = [...document.querySelectorAll('[data-apsc-mount] .apsc-sec .apsc-sec__h')].map(x => x.textContent.trim());
    return { labels, climInBody: bodySecs.filter(x => /^climate$/i.test(x)) };
  });
  const hasProse = r.labels.some(l => /^climate$/i.test(l));
  const hasRange = r.labels.some(l => /climate range/i.test(l));
  console.log(slug.padEnd(26), 'prose row:', hasProse ? 'STILL THERE' : 'gone',
    '· measured row:', hasRange ? 'present' : '(none)',
    '· climate as body section:', r.climInBody.length ? 'LEAKED' : 'no',
    '· rail:', r.labels.join(', '));
}
console.log('documents swapped:', swapped);
await browser.close();
