/* THE PROOF. The eight posts that lost their CLIMATE RANGE chart when a
   subunit tag replaced the country as the lit place should now read a
   plain "Climate range" instead of card v71's "Climate range · <country>"
   fallback label.

   ⚠ The version stamp is captured in the SAME probe as the label. A live
   sweep straight after a push can read a stale file through the CDN, and
   a miss that reports the OLD data version is a cache artefact, not a
   result — it must not be believed either way.  */
import { chromium } from 'playwright';

const POSTS = ['gallowayi', 'glaucophyllus', 'gliruroides', 'glossophyllus',
               'gomboczianus', 'gracilior', 'gracilis', 'hohenackeri'];
/* POSITIVE CONTROL: a cultivar always carries a suffixed label
   ("Climate range · parent species"). If the probe reports a plain
   label HERE too, the probe cannot see suffixes and the eight passes
   above mean nothing. */
const CONTROL = { url: 'https://aroidpedia.com/journal/alocasia-baginda-dragonscale',
                  expect: 'Climate range · parent species' };

const b = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 } });
let pass = 0, fail = 0;

for (const sp of POSTS) {
  const page = await ctx.newPage();
  const url = `https://aroidpedia.com/journal/amorphophallus-${sp}`;
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('.apsc-fact--clim', { timeout: 45000 });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => {
      const row = document.querySelector('.apsc-fact--clim');
      if (!row) return null;
      const box = row.querySelector('.apsc-clim');
      const chips = [...document.querySelectorAll('.apsc-fact--dist .apsc-chip, .apsc-chip')]
        .map(c => c.textContent.trim() + (/pill/.test(c.className) ? ' (pill)' : ''));
      const nums = [...row.querySelectorAll('.apclim-read, .apclim-year, .apsc-fact__value')]
        .map(n => n.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean)[0] || '';
      return {
        /* the label element also holds the info tooltip and the zone
           chips; only its FIRST TEXT NODE is the label itself */
        label: (() => {
          const L = row.querySelector('.apsc-fact__label');
          if (!L) return null;
          const t = [...L.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
          return (t ? t.textContent : L.textContent).trim();
        })(),
        dataV: box?.getAttribute('data-apclim-data'),
        basis: box?.getAttribute('data-apclim-basis'),
        cardV: document.querySelector('[data-apsc-version]')?.getAttribute('data-apsc-version'),
        chips: chips.slice(0, 8),
        read: nums.slice(0, 90)
      };
    });
    if (!r) { console.log(`${sp.padEnd(15)} NO CLIMATE ROW`); fail++; }
    else {
      const clean = r.label === 'Climate range';
      const stale = r.dataV !== '1.5.0';
      console.log(`${clean && !stale ? 'PASS' : 'FAIL'}  ${sp.padEnd(15)} "${r.label}"` +
                  `   data=${r.dataV}${stale ? ' ⚠STALE — disbelieve this row' : ''}` +
                  `  basis=${r.basis}  card=${r.cardV}`);
      console.log(`        ${r.read}`);
      clean && !stale ? pass++ : fail++;
    }
  } catch (e) {
    console.log(`ERROR ${sp.padEnd(13)} ${e.message.split('\n')[0]}`);
    fail++;
  }
  await page.close();
}
/* ── the control ── */
const cp = await ctx.newPage();
await cp.goto(CONTROL.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await cp.waitForSelector('.apsc-fact--clim', { timeout: 45000 });
await cp.waitForTimeout(1200);
const cl = await cp.evaluate(() => {
  const L = document.querySelector('.apsc-fact--clim .apsc-fact__label');
  const t = [...L.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
  return (t ? t.textContent : L.textContent).trim();
});
const controlOk = cl === CONTROL.expect;
console.log(`\nCONTROL  ${controlOk ? 'PASS' : 'FAIL'}  baginda-dragonscale reads "${cl}"` +
            `  (expected "${CONTROL.expect}")`);
await cp.close();
await b.close();

console.log(`\n${pass}/${POSTS.length} showing a plain "Climate range" on 1.5.0 data` +
            (fail ? `   — ${fail} not` : ''));
console.log(controlOk
  ? '  and the probe demonstrably CAN read a suffixed label, so those are real.'
  : '  ⚠ THE CONTROL FAILED — the probe cannot distinguish a suffixed label,\n' +
    '    so the passes above prove nothing. Fix the selector before believing them.');
