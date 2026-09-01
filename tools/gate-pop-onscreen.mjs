/* Does every (i) pop stay fully inside the viewport — at every scroll
   position, not just the one that happens to be convenient?

   The reported bug was vertical, and my previous gate only ever opened
   pops with the element mid-screen, where "below" always had room. So
   this scrolls the dot to the TOP, MIDDLE and BOTTOM of the viewport
   before opening it. The bottom case is the one that failed. */
import fs from 'fs';
import { chromium } from 'playwright';
const BUNDLE = fs.readFileSync('./footer-v16-scratch.js', 'utf8');
const LIVE = !!process.env.LIVE;

const b = await chromium.launch({ channel: 'chrome', headless: true });
let fails = 0;
for (const [slug, vh] of [['amorphophallus-impressus', 900], ['amorphophallus-impressus', 700],
                          ['alocasia-acuminata', 900], ['amorphophallus-abyssinicus', 800]]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: vh } });
  if (!LIVE) await ctx.route('**/footer.js*', r =>
    r.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: BUNDLE }));
  const p = await ctx.newPage();
  await p.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForSelector('.apsc-fact--clim', { timeout: 45000 });
  await p.waitForTimeout(2600);
  const sels = await p.evaluate(() =>
    [...document.querySelectorAll('.apsc-clim__info')].map((d, i) => i));
  for (const i of sels) {
    for (const place of ['top', 'middle', 'bottom']) {
      const r = await p.evaluate(({ i, place }) => {
        const d = [...document.querySelectorAll('.apsc-clim__info')][i];
        /* put the dot where we want it on screen, then open */
        const box = d.getBoundingClientRect();
        const want = place === 'top' ? 60 : place === 'middle' ? window.innerHeight / 2
                                                              : window.innerHeight - 60;
        /* ⚠ instant, not smooth: the panel is STICKY so the dot barely
           moves, and with smooth scrolling the clamp measured a position
           the dot was still travelling away from - producing "failures"
           that were the test's timing, not the code. */
        window.scrollBy({ top: box.top - want, behavior: 'instant' });
        return new Promise(res => setTimeout(() => {
          d.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const pop = d.querySelector('.apsc-clim__infopop');
          const pr = pop.getBoundingClientRect();
          const out = { label: d.getAttribute('aria-label'),
            top: Math.round(pr.top), bottom: Math.round(pr.bottom),
            h: Math.round(pr.height), vh: window.innerHeight,
            off: pr.top < -1 || pr.bottom > window.innerHeight + 1 ||
                 pr.left < -1 || pr.right > window.innerWidth + 1 };
          document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          res(out);
        }, 450));
      }, { i, place });
      if (r.off) fails++;
      console.log(`  ${r.off ? 'FAIL' : 'PASS'}  ${slug.replace('amorphophallus-', 'A.').padEnd(16)}` +
        `vh${String(r.vh).padEnd(4)} dot@${place.padEnd(7)} ${String(r.label).padEnd(30)}` +
        ` pop ${r.top}..${r.bottom} (h${r.h})${r.off ? '  ** OFF SCREEN **' : ''}`);
    }
  }
  await p.close(); await ctx.close();
}
await b.close();
console.log(fails ? `\n${fails} pops off screen` : '\nevery pop fully on screen, every dot position');
process.exitCode = fails ? 1 : 0;
