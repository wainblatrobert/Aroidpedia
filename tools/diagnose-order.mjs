/* Compare three photo orders on live posts:
   A. configured order — the post's own ?format=json body (ground truth)
   B. live DOM order of the hidden gallery block (post-plugins)
   C. the card's "More photos" strip order */
import { chromium } from 'playwright';

const SLUGS = ['alocasia-acuminata', 'alocasia-macrorrhizos-lutea', 'alocasia-baginda-dragon-scale'];
const base = s => (s || '').split('?')[0].split('/').pop();

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

for (const slug of SLUGS) {
  const url = 'https://www.aroidpedia.com/journal/' + slug;
  try {
    /* A: configured order from the JSON API */
    const j = await (await fetch(url + '?format=json-pretty')).json();
    const body = (j.item && j.item.body) || '';
    const galHtml = body.match(/<div[^>]*sqs-block-gallery[\s\S]*?(<div[^>]*sqs-block(?!-gallery)|$)/);
    const cfg = [];
    const re = /data-src="([^"]+)"/g; let m;
    while ((m = re.exec(galHtml ? galHtml[0] : '')) !== null) cfg.push(base(m[1]));

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('[data-apsc-mount]', { timeout: 30000 });
    await page.waitForTimeout(2500);

    const r = await page.evaluate(() => {
      const b = s => (s || '').split('?')[0].split('/').pop();
      const gal = document.querySelector('.sqs-block-gallery');
      const dom = gal ? [...gal.querySelectorAll('img')].map(i =>
        b(i.currentSrc || i.src || i.getAttribute('data-src'))) : [];
      const secs = [...document.querySelectorAll('[data-apsc-mount] .apsc-sec')];
      const more = secs.find(s => /more photos/i.test(s.querySelector('.apsc-sec__h')?.textContent || ''));
      const card = more ? [...more.querySelectorAll('img')].map(i => b(i.src)) : [];
      return { dom, card, galClass: gal ? gal.className.slice(0, 120) : null };
    });

    console.log('=== ' + slug);
    console.log(' A configured (' + cfg.length + '):', cfg.join(' | '));
    console.log(' B live DOM  (' + r.dom.length + '):', r.dom.join(' | '));
    console.log(' C card strip(' + r.card.length + '):', r.card.join(' | '));
    console.log(' gallery class:', r.galClass);
  } catch (e) {
    console.log('=== ' + slug + ' FAILED: ' + String(e).slice(0, 150));
  }
}
await browser.close();
