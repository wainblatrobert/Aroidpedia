/* Splices split + refine + mapnav edits into the served page (live =
   FILE v20) and verifies the sticky map + nav running head. */
import { chromium } from 'playwright';
/* live page = pasted FILE v22 (split + refine already in) — splice
   ONLY the mapnav edits, exactly what the file build does */
import { EDITS as MAPNAV } from './edits-mapnav.mjs';
const ALL = [...MAPNAV];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 200)));
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  let n = 0;
  for (const [o, nw] of ALL) { const i = html.indexOf(o); if (i >= 0) { html = html.slice(0, i) + nw + html.slice(i + o.length); n++; } }
  console.log('  applied', n + '/' + ALL.length);
  await route.fulfill({ response: resp, body: html });
});
await page.goto('https://www.aroidpedia.com/journal/alocasia-baginda', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-apsc-mount] .apsc-body', { timeout: 30000 });
await page.waitForTimeout(3000);

/* trace the MAP across scroll — it should pin at header+12 */
for (const y of [0, 600, 1200, 1800, 2400]) {
  await page.evaluate(v => window.scrollTo(0, v), y);
  await page.waitForTimeout(250);
  const s = await page.evaluate(() => {
    const m = document.querySelector('.apsc-map').getBoundingClientRect();
    const hd = document.querySelector('#header');
    const hh = hd ? Math.round(hd.getBoundingClientRect().height) : 0;
    const run = document.querySelector('.apsc-runhead');
    const rr = run ? run.getBoundingClientRect() : null;
    return {
      mapTop: Math.round(m.top), headerH: hh,
      runOn: run ? run.classList.contains('apsc-runhead--on') : null,
      runBox: rr ? { l: Math.round(rr.left), r: Math.round(rr.right), t: Math.round(rr.top), h: Math.round(rr.height) } : null
    };
  });
  console.log('scrollY', String(y).padStart(5), JSON.stringify(s));
}

/* the name must sit between logo and nav */
const geom = await page.evaluate(() => {
  const hd = document.querySelector('#header');
  const logo = hd.querySelector('.header-title-logo, .header-title');
  const nav = hd.querySelector('.header-nav, nav');
  const run = document.querySelector('.apsc-runhead').getBoundingClientRect();
  return {
    logoRight: logo ? Math.round(logo.getBoundingClientRect().right) : null,
    navLeft: nav ? Math.round(nav.getBoundingClientRect().left) : null,
    runLeft: Math.round(run.left), runRight: Math.round(run.right),
    clear: logo && nav ? run.left >= logo.getBoundingClientRect().right && run.right <= nav.getBoundingClientRect().left : null,
    text: document.querySelector('.apsc-runhead').textContent
  };
});
console.log('nav geometry:', JSON.stringify(geom));

await page.evaluate(() => window.scrollTo(0, 1400));
await page.waitForTimeout(700);
await page.screenshot({ path: 'mapnav-scrolled.png' });
await browser.close();
