/* Splices split (v19) + refine (v20) edits into the served page
   (live = FILE v20) and verifies: wide tail, sticky rail, running
   head — including behavior at scroll. */
import { chromium } from 'playwright';
import { EDITS as SPLIT } from './edits-split.mjs';
import { EDITS as REFINE } from './edits-refine.mjs';

const ALL = [...SPLIT, ...REFINE];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
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

await page.goto('https://www.aroidpedia.com/journal/alocasia-acuminata', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-apsc-mount] .apsc-body', { timeout: 30000 });
await page.waitForTimeout(3000);

const top = await page.evaluate(() => {
  const wide = document.querySelector('.apsc-wide');
  const body = document.querySelector('.apsc-body');
  const rail = document.querySelector('.apsc-facts');
  const run = document.querySelector('.apsc-runhead');
  return {
    wideSections: wide ? [...wide.querySelectorAll('.apsc-sec__h')].map(x => x.textContent.trim()) : null,
    wideW: wide ? Math.round(wide.getBoundingClientRect().width) : null,
    bodyW: body ? Math.round(body.getBoundingClientRect().width) : null,
    railPos: getComputedStyle(rail).position, railTop: rail.style.top,
    runExists: !!run, runText: run ? run.textContent : null,
    runVisibleAtTop: run ? getComputedStyle(run).opacity : null
  };
});
console.log('top:', JSON.stringify(top, null, 1));

/* scroll deep: rail should be pinned, running head visible */
await page.evaluate(() => window.scrollTo(0, 1800));
await page.waitForTimeout(700);
const scrolled = await page.evaluate(() => {
  const rail = document.querySelector('.apsc-facts');
  const run = document.querySelector('.apsc-runhead');
  const r = rail.getBoundingClientRect();
  return {
    railViewportTop: Math.round(r.top), railBottom: Math.round(r.bottom),
    vh: window.innerHeight,
    railPinned: Math.abs(r.bottom - (window.innerHeight - 24)) < 4 || (parseFloat(rail.style.top) > 0 && Math.abs(r.top - parseFloat(rail.style.top)) < 4),
    runOn: run.classList.contains('apsc-runhead--on'),
    runOpacity: getComputedStyle(run).opacity,
    runTop: run.style.top
  };
});
console.log('scrolled:', JSON.stringify(scrolled, null, 1));
await page.screenshot({ path: 'refine-scrolled.png' });

/* the wide tail in view */
await page.evaluate(() => { const w = document.querySelector('.apsc-wide'); if (w) w.scrollIntoView(); window.scrollBy(0, -120); });
await page.waitForTimeout(900);
await page.screenshot({ path: 'refine-wide.png' });

/* back to top: running head must hide again */
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
const backTop = await page.$eval('.apsc-runhead', x => x.classList.contains('apsc-runhead--on'));
console.log('running head off again at top:', !backTop);

/* phone: runhead hidden, order preserved */
await page.setViewportSize({ width: 375, height: 812 });
await page.waitForTimeout(1000);
const phone = await page.evaluate(() => ({
  runDisplay: getComputedStyle(document.querySelector('.apsc-runhead')).display,
  railPos: getComputedStyle(document.querySelector('.apsc-facts')).position,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
}));
console.log('phone:', JSON.stringify(phone));
await browser.close();
