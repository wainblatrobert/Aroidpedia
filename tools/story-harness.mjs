/* Harness for CARD v149 (story span on manual posts). Serves the fixture
   dir, loads each page in headless Chrome, reports assertions. */
import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIR = process.argv[2];
const srv = http.createServer((req, res) => {
  const p = path.join(DIR, req.url.split('?')[0].replace(/^\//, '') || 'index.html');
  try {
    const ext = path.extname(p);
    res.setHeader('Content-Type', ext === '.js' ? 'text/javascript'
      : ext === '.html' ? 'text/html' : 'application/octet-stream');
    res.end(fs.readFileSync(p));
  } catch { res.statusCode = 404; res.end('nf'); }
});
await new Promise(r => srv.listen(8935, '127.0.0.1', r));

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const out = {};

async function probe(name) {
  await page.goto('http://127.0.0.1:8935/' + name + '.html', { waitUntil: 'load' });
  await page.waitForTimeout(3500); // card mounts async (shapes fetch etc.)
  return await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const qa = s => [...document.querySelectorAll(s)];
    const mount = q('[data-apsc-version]');
    const story = q('.apsc-story');
    const plateImg = q('.apsc-story__plate img');
    const picks = qa('.apsc-story__pick').length;
    const inStory = src => qa('.apsc-story img').some(i => (i.getAttribute('src') || '').includes(src));
    const inCardOutsideStory = src => qa('.apsc img').some(i =>
      (i.getAttribute('src') || '').includes(src) && !i.closest('.apsc-story') && !i.closest('.apsc-lb') && (i.getAttribute('src') || '') !== '');
    const cardHtml = q('.apsc') ? q('.apsc').innerHTML.length : 0;
    const bodyText = document.body.innerText;
    return {
      stamp: mount ? mount.getAttribute('data-apsc-version') : null,
      story: !!story,
      storyTitle: story ? (q('.apsc-story__title') || {}).textContent || '' : '',
      plateSrc: plateImg ? plateImg.getAttribute('src') : null,
      picks,
      img1InStory: inStory('img1.png'), img2InStory: inStory('img2.png'),
      img1Outside: inCardOutsideStory('img1.png'),
      img2Outside: inCardOutsideStory('img2.png'),
      img3Outside: inCardOutsideStory('img3.png'),
      img3InStory: inStory('img3.png'),
      slashStoryVisible: bodyText.includes('/STORY'),
      afterNoteShown: bodyText.includes('After-story note paragraph'),
      cardHtmlLen: cardHtml,
      errors: window.__errs || []
    };
  });
}

page.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 200)));
for (const n of ['A-193', 'A-194', 'B-193', 'B-194']) {
  out[n] = await probe(n);
  console.log('==', n, JSON.stringify(out[n], null, 1));
}
// classic regression: compare B card HTML sizes and full strings
const bHtml = {};
for (const n of ['B-193', 'B-194']) {
  await page.goto('http://127.0.0.1:8935/' + n + '.html', { waitUntil: 'load' });
  await page.waitForTimeout(3500);
  bHtml[n] = await page.evaluate(() => {
    const c = document.querySelector('.apsc');
    return c ? c.innerHTML.replace(/card-v\d+-file-v\d+/g, 'STAMP') : '';
  });
}
console.log('CLASSIC IDENTICAL:', bHtml['B-193'] === bHtml['B-194'],
  '| lens', bHtml['B-193'].length, bHtml['B-194'].length);
await browser.close();
srv.close();
