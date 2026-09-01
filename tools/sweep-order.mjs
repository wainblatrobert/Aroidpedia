/* Sweep posts: compare the hidden gallery block's DOM order against the
   card's "More photos" strip. Flags: SCRAMBLED (gallery items out of
   order), LEAKS (non-gallery images mixed in and where). */
import { chromium } from 'playwright';

const idx = await (await fetch('https://wainblatrobert.github.io/Aroidpedia/search-index.json')).json();
const slugs = idx.entries.map(e => e.u.replace('/journal/', '')).slice(0, 60);

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
let checked = 0, clean = 0;
const problems = [];

for (const slug of slugs) {
  if (checked >= 25) break;
  try {
    await page.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('[data-apsc-mount]', { timeout: 20000 });
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const b = s => (s || '').split('?')[0].split('/').pop();
      const gals = [...document.querySelectorAll('.sqs-block-gallery')];
      const gal = gals.flatMap(g => [...g.querySelectorAll('img')].map(i => b(i.currentSrc || i.src || i.getAttribute('data-src'))));
      const secs = [...document.querySelectorAll('[data-apsc-mount] .apsc-sec')];
      const more = secs.find(s => /more photos/i.test(s.querySelector('.apsc-sec__h')?.textContent || ''));
      const card = more ? [...more.querySelectorAll('img')].map(i => b(i.src)) : [];
      return { gal, card };
    });
    if (!r.card.length) continue;
    checked++;
    const galSet = new Set(r.gal);
    const inGal = r.card.filter(x => galSet.has(x));
    const leaks = r.card.map((x, i) => galSet.has(x) ? null : (i + ':' + x)).filter(Boolean);
    const galOrder = r.gal.filter(x => inGal.includes(x));
    const scrambled = inGal.join('|') !== galOrder.join('|');
    if (scrambled || leaks.length) {
      problems.push({ slug, scrambled, leaks: leaks.slice(0, 4), nCard: r.card.length, nGal: r.gal.length });
    } else clean++;
  } catch (e) { /* skip slow/odd pages */ }
}
console.log('checked', checked, 'posts with a More photos strip; clean:', clean);
problems.forEach(p => console.log(
  p.slug.padEnd(38), p.scrambled ? 'SCRAMBLED' : 'in-order ',
  'leaks:', p.leaks.length ? p.leaks.join(' , ') : 'none',
  `(card ${p.nCard} / gal ${p.nGal})`));
await browser.close();
