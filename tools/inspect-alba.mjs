import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
for (const slug of ['alocasia-alba', 'alocasia-clypeolata']) {
  await page.goto('https://www.aroidpedia.com/journal/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-apsc-mount]', { timeout: 30000 });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const b = s => (s || '').split('?')[0].split('/').pop();
    const gals = [...document.querySelectorAll('.sqs-block-gallery')].map(g => ({
      cls: g.className.replace(/\s+/g, ' ').slice(0, 90),
      imgs: [...g.querySelectorAll('img')].map(i => b(i.currentSrc || i.src || i.getAttribute('data-src')))
    }));
    const secs = [...document.querySelectorAll('[data-apsc-mount] .apsc-sec')];
    const more = secs.find(s => /more photos/i.test(s.querySelector('.apsc-sec__h')?.textContent || ''));
    return {
      galleries: gals.map(g => ({ cls: g.cls, n: g.imgs.length, first3: g.imgs.slice(0, 3), last2: g.imgs.slice(-2) })),
      card: more ? [...more.querySelectorAll('img')].map(i => b(i.src)) : []
    };
  });
  console.log('===', slug);
  r.galleries.forEach((g, i) => console.log(' gal' + i, 'n=' + g.n, g.cls, '\n   first:', g.first3.join(' | '), ' last:', g.last2.join(' | ')));
  console.log(' card strip (' + r.card.length + '):', r.card.join(' | ').slice(0, 900));
}
await browser.close();
