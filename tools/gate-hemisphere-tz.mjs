/* The reader's hemisphere comes from their timezone (card v106+).
   One bit, no network, no IP. This gate pins the cases that would be
   silently wrong if the table were edited carelessly.

   ⚠ INDONESIA IS SOUTHERN. Jakarta is 6°S. It is the case most likely
   to be broken by someone "tidying" Asia/* out of a southern table,
   and it is a large slice of an aroid audience — so it is asserted
   explicitly, not left to the Australia/* prefix rule.

   ⚠ EQUATORIAL ZONES MUST NOT GUESS. Bogotá and Singapore return null
   and fall back to the species' native hemisphere; asserting "false"
   here would pass for the wrong reason, so the expectation is the
   NATIVE default, which for carnosus is northern.                   */
import fs from 'fs';
import { chromium } from 'playwright';

const BUNDLE = fs.readFileSync('./footer-v16-scratch.js', 'utf8');
const WANT = 'card-v136-file-v158';
const URL = 'https://www.aroidpedia.com/journal/amorphophallus-carnosus';

/* carnosus is natively NORTHERN: lean Jan–Apr as read in the north,
   Jul–Oct once shifted for a southern reader. */
const N = 'Jan–Apr', S = 'Jul–Oct';
const CASES = [
  ['America/New_York',  false, N, 'northern'],
  ['Europe/London',     false, N, 'northern'],
  ['Australia/Sydney',  true,  S, 'Australia/ prefix'],
  ['Pacific/Auckland',  true,  S, 'listed'],
  ['Asia/Jakarta',      true,  S, '⚠ 6°S — Asia/ but southern'],
  ['Asia/Makassar',     true,  S, '⚠ 5°S'],
  ['America/Sao_Paulo', true,  S, 'listed'],
  ['Africa/Johannesburg', true, S, 'listed'],
  ['Africa/Lagos',      false, N, 'northern Africa-ish, unlisted -> north'],
  ['America/Bogota',    false, N, 'equatorial -> null -> native (north)'],
  ['Asia/Singapore',    false, N, 'equatorial -> null -> native (north)']
];

const b = await chromium.launch({ channel: 'chrome', headless: true });
let pass = 0, fail = 0;
for (const [tz, wantSouth, wantLean, why] of CASES) {
  /* ⚠ A FRESH CONTEXT PER CASE. One shared context carries the previous
     case's localStorage hemisphere choice, and a saved choice outranks
     the timezone — a leaked flip makes this gate lie. */
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: tz });
  await ctx.route('**/footer.js*', r =>
    r.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: BUNDLE }));
  const p = await ctx.newPage();
  try {
    await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForSelector('.apclim-rest', { timeout: 45000 });
    await p.waitForTimeout(2000);
    const r = await p.evaluate(() => {
      const on = document.querySelector('.apclim-rest .apclim-hemi__btn.is-on, .apclim-rest [data-hemi].is-on');
      const btns = [].slice.call(document.querySelectorAll('.apclim-rest .apclim-rest__hemi button, .apclim-rest [data-hemi]'));
      const sel = btns.find(x => x.classList.contains('is-on') || x.getAttribute('aria-pressed') === 'true');
      return {
        version: document.querySelector('[data-apsc-version]')?.getAttribute('data-apsc-version'),
        south: /S/.test((sel || on)?.textContent || ''),
        lean: document.querySelector('.apclim-rest__head b')?.textContent || ''
      };
    });
    const stale = r.version !== WANT;
    const ok = !stale && r.south === wantSouth && r.lean.indexOf(wantLean) >= 0;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${tz.padEnd(22)} S=${String(r.south).padEnd(5)} ${r.lean.padEnd(20)} ${why}` +
                (stale ? `  ⚠ STALE ${r.version}` : ''));
    ok ? pass++ : fail++;
  } catch (e) {
    console.log(`  ERROR ${tz}  ${e.message.split('\n')[0]}`);
    fail++;
  }
  await ctx.close();
}
await b.close();
console.log(`\n${pass}/${CASES.length} timezones resolve to the right calendar`);
process.exitCode = fail ? 1 : 0;
