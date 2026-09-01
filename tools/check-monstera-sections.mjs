/* What does /monstera-pollination actually contain? Checking (a) the herbivory
   block the user says shows images from Cedeno-Fonseca & Zuluaga, and (b)
   whether anything phenological is already there. */
import { chromium } from 'playwright';

const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('https://aroidpedia.com/monstera-pollination', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(5000);

const t = await p.evaluate(() => document.body.innerText);
console.log('page chars:', t.length);

// section headings
const heads = await p.evaluate(() =>
  [...document.querySelectorAll('h1,h2,h3,h4')].map(h => h.textContent.trim()).filter(x => x && x.length < 90));
console.log('\n--- HEADINGS ---');
heads.forEach(h => console.log('  ' + h));

const probe = ['herbivor', 'Cactophagus', 'Zuluaga', 'Apatelodinae', 'gall',
               'phenolog', 'flowering season', 'month', 'January', 'rainy season',
               'fruit matures', 'ripen', 'year-round', 'seasonal'];
console.log('\n--- TERM PRESENCE ---');
for (const k of probe) {
  const n = (t.match(new RegExp(k, 'gi')) || []).length;
  console.log(`  ${k.padEnd(18)} ${n}`);
}

console.log('\n--- sentences mentioning months/seasonality ---');
for (const m of t.matchAll(/[^.\n]{0,170}(January|February|March|April|rainy season|dry season|flowering season|months of the year|year-round)[^.\n]{0,170}\./gi)) {
  console.log('  > ' + m[0].replace(/\s+/g, ' ').trim().slice(0, 260));
}
const imgs = await p.evaluate(() => document.querySelectorAll('img').length);
console.log('\nimages on page:', imgs);
await b.close();
