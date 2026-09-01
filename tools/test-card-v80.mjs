/* End-to-end test of card v80 WITHOUT deploying it.

   The scratch bundle is served in place of the live footer.js by
   intercepting the request, so the shared repo and the live site are
   both untouched — another session is mid-flight in that same master.

   ⚠ Every assertion also captures data-apsc-version, because a live
   sweep that reads a stale bundle through the CDN reports a false
   result in BOTH directions. A row that disagrees with the version
   under test is a cache artefact, not evidence.                     */
import fs from 'fs';
import { chromium } from 'playwright';

const BUNDLE = fs.readFileSync('./footer-v16-scratch.js', 'utf8');
const WANT = 'card-v136-file-v158';

const CASES = [
  { url: 'https://aroidpedia.com/journal/amorphophallus-gracilior',   expect: 'calendar', note: 'dry-driven, Harmattan' },
  { url: 'https://aroidpedia.com/journal/amorphophallus-dunnii',      expect: 'calendar', note: 'cold-driven -> "cool" hatch' },
  /* v112: an everwet species keeps the SENTENCE and loses the GRAPHIC.
     A flat line with no trough says nothing, so the chart, the hover
     readout, the N/S toggle and the collapse all go - those pages get
     both monthly charts back instead of paying a toggle for a chart
     that is not drawn. */
  { url: 'https://aroidpedia.com/journal/amorphophallus-gigas',       expect: 'text-only', note: 'everwet -> text, NO chart, NO collapse' },
  { url: 'https://aroidpedia.com/journal/alocasia-acuminata',         expect: 'none',     note: 'NOT Amorphophallus — must be untouched' }
];

const b = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 } });
/* serve the scratch bundle for any footer.js request */
await ctx.route('**/footer.js*', r =>
  r.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: BUNDLE }));

let pass = 0, fail = 0;
for (const c of CASES) {
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  /* only real JS exceptions count. A resource 404 on a post's own
     image is the site's business, not this bundle's, and failing on it
     would make the test lie about the code under test. */
  page.on('console', m => {
    const t = m.text();
    /* Third-party noise is not a defect in this bundle:
         - a resource 404 on a post's own image is the site's business
         - a REPORT-ONLY CSP violation from an embedded Google frame is
           by its own wording not enforced ("no further action has been
           taken"), and it appears intermittently, which made this suite
           flap between 3/4 and 4/4 while every real assertion passed.
       Filtering it is fixing the HARNESS, not loosening the test: the
       assertions on version, collapse and the calendar are untouched. */
    if (m.type() === 'error' &&
        !/Failed to load resource/.test(t) &&
        !/report-only Content Security Policy/i.test(t)) errs.push(t);
  });
  try {
    await page.goto(c.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('.apsc-fact--clim', { timeout: 45000 });
    await page.waitForTimeout(1800);
    const r = await page.evaluate(() => {
      /* ⚠ NOT querySelector('.apsc-clim') — the FIRST one in the DOM is
         the --mini yearly line in the follow panel, which deliberately
         carries no view attribute. The real box is the non-mini one. */
      const box = document.querySelector('.apsc-clim:not(.apsc-clim--mini)');
      const rest = document.querySelector('.apclim-rest');
      const sw = document.querySelector('.apsc-clim__switch');
      const vis = sw ? getComputedStyle(sw).display : null;
      return {
        version: document.querySelector('[data-apsc-version]')?.getAttribute('data-apsc-version'),
        collapse: box?.getAttribute('data-apclim-collapse') || null,
        view: box?.getAttribute('data-apclim-view') || null,
        switchDisplay: vis,
        hasRest: !!rest,
        lean: rest?.querySelector('.apclim-rest__head b')?.textContent || null,
        grow: rest?.querySelector('.apclim-rest__grow')?.textContent || null,
        body: rest?.querySelector('.apclim-rest__body')?.textContent?.slice(0, 90) || null,
        hatchWord: rest?.querySelector('svg pattern text')?.textContent || null,
        paths: rest ? rest.querySelectorAll('svg path').length : 0,
        /* is the OTHER chart actually hidden by the permanent collapse? */
        humidityHidden: (() => {
          const h = document.querySelector('.apsc-clim__h');
          return h ? getComputedStyle(h).display === 'none' : null;
        })()
      };
    });
    const stale = r.version !== WANT;
    const wantCal  = c.expect === 'calendar';
    const wantText = c.expect === 'text-only';
    const ok = !stale && !errs.length &&
               r.hasRest === (wantCal || wantText) &&
               (!wantCal  || (r.lean && r.paths > 0 && r.collapse === '1')) &&
               /* text-only: the finding survives, the graphic and the
                  collapse do not - assert BOTH, or a regression that
                  silently redraws the chart would still pass */
               (!wantText || (r.lean && r.paths === 0 && r.collapse === null)) &&
               (c.expect !== 'none' || r.collapse === null);
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.url.split('/').pop().padEnd(26)} ${c.note}`);
    console.log(`      version ${r.version}${stale ? '  ⚠ STALE — disbelieve this row' : ''}` +
                `   collapse=${r.collapse}  view=${r.view}  switch=${r.switchDisplay}` +
                `  humidityHidden=${r.humidityHidden}`);
    if (r.hasRest) {
      console.log(`      ${r.lean}  |  ${r.grow}`);
      console.log(`      ${r.body}`);
      console.log(`      hatch word: ${JSON.stringify(r.hatchWord)}   svg paths: ${r.paths}`);
    } else {
      console.log(`      no calendar (correct for a non-Amorphophallus page)`);
    }
    if (errs.length) console.log(`      JS ERRORS: ${errs.slice(0, 2).join(' | ')}`);
    ok ? pass++ : fail++;
  } catch (e) {
    console.log(`ERROR ${c.url.split('/').pop()}  ${e.message.split('\n')[0]}`);
    fail++;
  }
  await page.close();
}
await b.close();
console.log(`\n${pass}/${CASES.length} passed`);
process.exitCode = fail ? 1 : 0;
