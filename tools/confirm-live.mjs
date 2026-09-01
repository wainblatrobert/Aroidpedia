/* Pure live check — no splicing, no APCLIM_DATA, fresh profile:
   what any first-time visitor gets right now. */
import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const logs = [];
page.on('console', m => { if (m.text().includes('[climate range]')) logs.push(m.text()); });
for (const slug of ['alocasia-acuminata', 'alocasia-baginda']) {
  await page.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.apsc-fact--clim svg', { timeout: 30000 });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const clim = document.querySelector('.apsc-fact--clim');
    const fig = document.querySelector('.apsc-hero');
    return {
      dataV: clim.querySelector('.apsc-clim').getAttribute('data-apclim-data'),
      reads: [...clim.querySelectorAll('.apsc-clim__read')].map(x => x.textContent),
      swingLabel: !!clim.querySelector('.apsc-clim__sub') &&
        [...clim.querySelectorAll('.apsc-clim__sub')].some(x => /daily swing/i.test(x.textContent)),
      legend: clim.querySelector('.apsc-clim__legend')?.textContent || null,
      innerBand: !!clim.querySelector('.apclim-band--t-in'),
      nowMarks: clim.querySelectorAll('.apclim-now').length,
      balancedSecs: fig ? fig.querySelectorAll('.apsc-sec').length : 0
    };
  });
  console.log(slug.padEnd(22), JSON.stringify(r));
}
console.log('console lines:', logs);
await browser.close();
