import { chromium } from 'playwright';
import { EDITS as MAPNAV } from './edits-mapnav.mjs';

/* instrument place() with an invocation counter */
const INSTR = MAPNAV.map(([o, n]) => [o, n.replace(
  'function place(){\n        var hd = document.querySelector("#header");\n        if (!hd){ bar.style.display = "none"; return; }',
  'function place(){\n        bar.setAttribute("data-n", String((+bar.getAttribute("data-n") || 0) + 1));\n        var hd = document.querySelector("#header");\n        if (!hd){ bar.style.display = "none"; return; }')]);

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 200)));
await page.route('**/journal/*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  for (const [o, nw] of INSTR) { const i = html.indexOf(o); if (i >= 0) html = html.slice(0, i) + nw + html.slice(i + o.length); }
  await route.fulfill({ response: resp, body: html });
});
await page.goto('https://www.aroidpedia.com/journal/alocasia-baginda', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.apsc-runhead', { timeout: 30000 });
await page.waitForTimeout(2500);
console.log('after load, place() calls:', await page.$eval('.apsc-runhead', x => x.getAttribute('data-n')));
await page.evaluate(() => window.scrollTo(0, 800));
await page.waitForTimeout(500);
console.log('after scroll, place() calls:', await page.$eval('.apsc-runhead', x => x.getAttribute('data-n')));
const g = await page.evaluate(() => {
  const hd = document.querySelector('#header');
  const nav = hd.querySelector('.header-nav, nav');
  const run = document.querySelector('.apsc-runhead').getBoundingClientRect();
  return { navLeft: Math.round(nav.getBoundingClientRect().left), runRight: Math.round(run.right), h: Math.round(run.height) };
});
console.log('geometry after scroll:', JSON.stringify(g));
await browser.close();
