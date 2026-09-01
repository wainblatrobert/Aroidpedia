/* Breadth check: a second genus, and a hybrid post that should get NO
   climate row (its rail has no Distribution chips) without erroring. */
import fs from 'fs';
import { chromium } from 'playwright';

const block = fs.readFileSync(new URL('./climate-block.txt', import.meta.url), 'utf8');
const css = block.match(/<style>([\s\S]*?)<\/style>/)[1];
const js = block.match(/<script>([\s\S]*?)<\/script>/)[1];
const clim = JSON.parse(fs.readFileSync(new URL('./climate.json', import.meta.url), 'utf8'));

const URLS = [
  'https://www.aroidpedia.com/journal/amorphophallus-coudercii',
  'https://www.aroidpedia.com/journal/alocasia-frankenstein'
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const u of URLS) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  const logs = [];
  page.on('console', m => { if (m.text().includes('[climate range]')) logs.push(m.text()); });
  try {
    await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('[data-apsc-mount] .apsc-facts', { timeout: 30000 });
    await page.evaluate(d => { window.APCLIM_DATA = d; }, clim);
    await page.addStyleTag({ content: css });
    await page.addScriptTag({ content: js });
    await page.waitForTimeout(2500);
    const r = await page.evaluate(() => {
      const rail = document.querySelector('[data-apsc-mount] .apsc-facts');
      const clim = document.querySelector('.apsc-fact--clim');
      const chips = rail.querySelectorAll('a.apsc-chip:not(.apsc-chip--off):not(.apsc-chip--continent)').length;
      return {
        done: rail.getAttribute('data-apclim-done'),
        hasRow: !!clim,
        chips,
        reads: clim ? [...clim.querySelectorAll('.apsc-clim__read')].map(x => x.textContent) : null,
        basis: clim ? clim.querySelector('.apsc-clim')?.getAttribute('data-apclim-basis') : null,
        zones: clim ? [...clim.querySelectorAll('.apsc-clim__zone')].map(x => x.textContent) : null
      };
    });
    console.log(u.split('/').pop(), '->', JSON.stringify(r), 'log:', logs, 'errors:', errs);
  } catch (e) {
    console.log(u.split('/').pop(), 'FAILED:', String(e).slice(0, 200));
  }
  await page.close();
}
await browser.close();
