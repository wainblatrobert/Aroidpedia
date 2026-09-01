import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
await p.goto('https://www.aroidpedia.com/journal/alocasia-acuminata', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForSelector('[data-apsc-mount] .apsc-facts', { timeout: 30000 });
const r = await p.evaluate(() => {
  const rows = [...document.querySelectorAll('[data-apsc-mount] .apsc-facts .apsc-fact')];
  const dist = rows.find(x => x.querySelector('.apsc-fact__label')?.textContent.trim() === 'Distribution');
  return {
    solid: [...dist.querySelectorAll('a.apsc-chip:not(.apsc-chip--off):not(.apsc-chip--continent)')].map(a => a.textContent.trim()),
    off: [...dist.querySelectorAll('a.apsc-chip--off')].map(a => a.textContent.trim()),
    cont: [...dist.querySelectorAll('a.apsc-chip--continent')].map(a => a.textContent.trim()),
    tags: [...document.querySelectorAll('a[href*="/journal/tag/"]')].map(a => a.textContent.trim())
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
