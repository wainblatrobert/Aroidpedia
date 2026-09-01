/* THE INVARIANT MY TEXT ASSERTIONS COULD NOT SEE.

   Every earlier check read words — the callout months, the labels, the
   hover line. All of them were correct while the chart was wrong,
   because the band's POSITION RELATIVE TO THE CURVE is not expressible
   in text.

   The invariant: lean is drawn HIGH, so the curve must be higher inside
   the lean band than outside it. Sample the rendered path at each
   month's x, split by whether that month is banded, and compare. A
   band that drifts off its own trough fails at once — in EITHER
   hemisphere, which is the case that actually broke.                 */
import fs from 'fs';
import { chromium } from 'playwright';

const BUNDLE = fs.readFileSync('./footer-v16-scratch.js', 'utf8');
const SLUGS = [
  'amorphophallus-impressus',    /* the report: southern-native */
  'amorphophallus-carnosus',     /* northern-native, has flowering */
  'amorphophallus-gracilior',
  'amorphophallus-dunnii',       /* cold-driven */
  'amorphophallus-galbra'        /* southern-native */
];

const b = await chromium.launch({ channel: 'chrome', headless: true });

let fails = 0;
for (const slug of SLUGS) {
  /* ⚠ A FRESH CONTEXT PER SPECIES. The toggle persists to
     localStorage, so a shared context carried the PREVIOUS species'
     flip into the next page and the "as-opened" row stopped testing
     the native default at all - gracilior failed as-opened and passed
     flipped, which is impossible for a northern-native species and was
     the tell. A stateful control needs a clean room per case. */
  const ctx = await b.newContext({ viewport: { width: 820, height: 1200 } });
  /* LIVE=1 runs against the real deployed bundle instead of a scratch
     one - the final proof, after the push. */
  if (!process.env.LIVE) await ctx.route('**/footer.js*', r =>
    r.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: BUNDLE }));
  const p = await ctx.newPage();
  await p.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForSelector('.apclim-rest', { timeout: 45000 });
  await p.waitForTimeout(1500);

  const probe = () => p.evaluate(() => {
    const svg = document.querySelector('.apclim-rest svg');
    const path = svg.querySelector('path');
    const W = 300, PADL = 26, PADR = 4, STEP = (W - PADL - PADR) / 11;
    /* sample the rendered path at each month's x by walking its length */
    const L = path.getTotalLength();
    const ys = [];
    for (let m = 0; m < 12; m++) {
      const want = PADL + m * STEP;
      let best = null, bd = 1e9;
      for (let i = 0; i <= 1200; i++) {
        const pt = path.getPointAtLength(L * i / 1200);
        const d = Math.abs(pt.x - want);
        if (d < bd) { bd = d; best = pt.y; }
      }
      ys.push(best);
    }
    /* which months are banded: a band rect covers the month's x */
    const rects = [...svg.querySelectorAll('rect[fill^="rgba(175"]')];
    const banded = [];
    for (let m = 0; m < 12; m++) {
      const x = PADL + m * STEP;
      banded.push(rects.some(r => {
        const rx = +r.getAttribute('x'), rw = +r.getAttribute('width');
        return x >= rx - 0.6 && x <= rx + rw + 0.6;
      }));
    }
    return { ys, banded,
      head: document.querySelector('.apclim-rest__head').textContent.replace(/\s+/g, ' ').trim(),
      S: document.querySelector('.apclim-rest__hemi button[aria-label*=Southern]').getAttribute('aria-pressed') };
  });

  for (const phase of ['as-opened', 'flipped']) {
    const r = await probe();
    const inB = r.ys.filter((_, m) => r.banded[m]);
    const outB = r.ys.filter((_, m) => !r.banded[m]);
    if (!inB.length || !outB.length) {
      console.log(`  ${slug.padEnd(26)} ${phase.padEnd(10)} no band (aseasonal) — skipped`);
    } else {
      /* SVG y grows downward, so "higher on the chart" is a SMALLER y */
      const mi = inB.reduce((a, c) => a + c, 0) / inB.length;
      const mo = outB.reduce((a, c) => a + c, 0) / outB.length;
      const ok = mi < mo;
      if (!ok) fails++;
      console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${slug.replace('amorphophallus-', '').padEnd(14)} ${phase.padEnd(10)}` +
        ` curve-y under band ${mi.toFixed(1)} vs outside ${mo.toFixed(1)}` +
        `  ${ok ? '(band sits on the lean peak)' : '** BAND IS OFF ITS OWN TROUGH **'}`);
    }
    if (phase === 'as-opened') {
      await p.click('.apclim-rest__hemi button[aria-label*=' + (r.S === 'true' ? 'Northern' : 'Southern') + ']');
      await p.waitForTimeout(300);
    }
  }
  await p.close();
  await ctx.close();
}
await b.close();
console.log(fails ? `\n${fails} failures` : '\nband sits on its own lean peak in both hemispheres, every species');
process.exitCode = fails ? 1 : 0;
