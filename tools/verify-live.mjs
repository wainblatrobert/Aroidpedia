/* Live verification of the CLIMATE RANGE block: loads the real
   aroidpedia.com post (live footer v13 builds the card), injects ONLY
   the new block's CSS+JS with window.APCLIM_DATA = local climate.json,
   and measures the result off the live DOM. */
import fs from 'fs';
import { chromium } from 'playwright';

const block = fs.readFileSync(new URL('./climate-block.txt', import.meta.url), 'utf8');
const css = block.match(/<style>([\s\S]*?)<\/style>/)[1];
const js = block.match(/<script>([\s\S]*?)<\/script>/)[1];
const clim = JSON.parse(fs.readFileSync(new URL('./climate.json', import.meta.url), 'utf8'));

const URL_ = 'https://www.aroidpedia.com/journal/alocasia-acuminata';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const logs = [];
page.on('console', m => { if (m.text().includes('[climate range]')) logs.push(m.text()); });

await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-apsc-mount] .apsc-facts', { timeout: 30000 });

/* the LIVE footer (v14+) already builds a climate row — WAIT for it,
   then remove it, KEEPING its done-marker so the live block stays
   dormant; the injected v2 copy runs on its own marker name. */
await page.waitForSelector('.apsc-fact--clim', { timeout: 15000 });
await page.evaluate(() => {
  document.querySelectorAll('.apsc-fact--clim').forEach(n => n.remove());
});
await page.evaluate(d => { window.APCLIM_DATA = d; }, clim);
await page.addStyleTag({ content: css });
await page.addScriptTag({ content: js.split('data-apclim-done').join('data-apclim-v2done') });

await page.waitForSelector('.apsc-fact--clim', { timeout: 15000 });
await page.waitForTimeout(300);

const r = await page.evaluate(() => {
  const rail = document.querySelector('[data-apsc-mount] .apsc-facts');
  const rows = [...rail.querySelectorAll('.apsc-fact')];
  const labels = rows.map(x => x.querySelector('.apsc-fact__label')?.textContent.trim());
  const clim = document.querySelector('.apsc-fact--clim');
  const reads = [...clim.querySelectorAll('.apsc-clim__read')].map(x => x.textContent);
  const distIdx = labels.indexOf('Distribution');
  const climIdx = rows.indexOf(clim);
  const box = clim.querySelector('.apsc-clim');
  return {
    labels,
    distIdx, climIdx,
    reads,
    basis: box.getAttribute('data-apclim-basis'),
    dataV: box.getAttribute('data-apclim-data'),
    zones: [...clim.querySelectorAll('.apsc-clim__zone')].map(x => x.textContent),
    note: clim.querySelector('.apsc-clim__note')?.textContent,
    svgs: clim.querySelectorAll('svg').length,
    railW: rail.getBoundingClientRect().width,
    climW: clim.getBoundingClientRect().width,
    docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
});
console.log(JSON.stringify(r, null, 1));
console.log('console:', logs);

/* toggle to Celsius and read back */
await page.click('.apsc-clim__unit:nth-child(2)');
const cRead = await page.$eval('.apsc-clim__read', x => x.textContent);
console.log('after C toggle:', cRead);

/* month hover: April column on the temp chart */
await page.hover('.apsc-fact--clim svg [data-m="3"]');
const hoverReads = await page.$$eval('.apsc-clim__read', xs => xs.map(x => x.textContent));
console.log('April hover:', hoverReads);
await page.click('.apsc-clim__unit:nth-child(1)'); /* back to F */

/* screenshots: rail on desktop, then phone */
await page.mouse.move(0, 0);
await page.waitForTimeout(200);
const rail = await page.$('[data-apsc-mount] .apsc-facts');
await rail.screenshot({ path: 'shot-rail-desktop.png' });

await page.setViewportSize({ width: 375, height: 812 });
await page.waitForTimeout(600);
const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('phone overflow px:', over);
const rail2 = await page.$('[data-apsc-mount] .apsc-facts');
await rail2.screenshot({ path: 'shot-rail-phone.png' });

await browser.close();
console.log('done');
