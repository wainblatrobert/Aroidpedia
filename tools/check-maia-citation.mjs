/* The version of record is J. Chem. Ecol. (2019) 45:204-213; "2018" is the
   online-first year. Where is it cited, and with which year? */
import { chromium } from 'playwright';
const PAGES = ['philodendron-pollination', 'monstera-pollination', 'anthurium-pollination',
               'amorphophallus-pollination', 'alocasia-pollination', 'aroid-pollination',
               'spathiphyllum-pollination', 'arum-pollination', 'arisaema-pollination'];
const b = await chromium.launch({ channel: 'chrome' });
for (const slug of PAGES) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await p.goto('https://aroidpedia.com/' + slug, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3000);
    const t = await p.evaluate(() => document.body.innerText);
    const hits = [...t.matchAll(/[^.\n]{0,120}Maia[^.\n]{0,160}/g)].map(m => m[0].replace(/\s+/g, ' ').trim());
    if (hits.length) {
      console.log('\n=== ' + slug);
      hits.slice(0, 4).forEach(h => console.log('   > ' + h.slice(0, 230)));
    }
  } catch (e) { console.log('\n=== ' + slug + ' FAILED'); }
  await p.close();
}
await b.close();
console.log('\n(pages not listed contain no "Maia")');
