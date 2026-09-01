/* Wave 5 RULING PENDING: Bröderbauer 2014's 26% open fruit set in Colocasia
   esculenta is a CULTIVATED figure. Does any live page print it without
   saying so? Check before claiming anything needs changing. */
import { chromium } from 'playwright';

const PAGES = [
  'https://aroidpedia.com/aroid-pollination',
  'https://aroidpedia.com/alocasia-pollination',
  'https://aroidpedia.com/amorphophallus-pollination',
  'https://aroidpedia.com/monstera-pollination',
  'https://aroidpedia.com/philodendron-pollination',
  'https://aroidpedia.com/anthurium-pollination',
  'https://aroidpedia.com/spathiphyllum-pollination',
  'https://aroidpedia.com/arum-pollination',
  'https://aroidpedia.com/arisaema-pollination'
];

const b = await chromium.launch({ channel: 'chrome' });
for (const url of PAGES) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(2500);
    const txt = await p.evaluate(() => document.body.innerText);
    const hits = [];
    // the figure itself, and the words that would qualify it
    for (const m of txt.matchAll(/[^.]{0,160}\b(26\s?%|Br[oö]derbauer)[^.]{0,160}\./g)) {
      hits.push(m[0].replace(/\s+/g, ' ').trim());
    }
    const colo = /Colocasia esculenta/.test(txt);
    console.log('\n=== ' + url.split('/').pop());
    console.log('   mentions Colocasia esculenta:', colo);
    console.log('   26% / Bröderbauer hits      :', hits.length);
    hits.slice(0, 4).forEach(h => console.log('     > ' + h.slice(0, 240)));
  } catch (e) {
    console.log('\n=== ' + url.split('/').pop() + '  FAILED: ' + e.message.split('\n')[0]);
  }
  await p.close();
}
await b.close();
