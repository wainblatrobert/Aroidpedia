/* The v44 branch I re-applied by hand must actually fire. Reach the
   Amorphophallus and Calla genus cards through the SEARCH box, driven with
   real keyboard events (the suggestion list is built on input+keydown). */
import { chromium } from 'playwright';
import fs from 'fs';
const DIR   = 'G:\\My Drive\\PlantsV2\\Aroidpedia\\WEBSITE\\ARACEAE PHYLOGENETIC TREE\\';
const block = fs.readFileSync(DIR + 'ARACEAE TREE 8.16.26 v45.txt', 'utf8');
const json  = fs.readFileSync(DIR + 'araceae-tree.v1.json', 'utf8');
const html  = '<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0}</style></head><body>' + block + '</body></html>';

const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
await p.route('**/*', async r => {
  const u = r.request().url();
  if (u.includes('araceae-tree.v1.json')) return r.fulfill({ status: 200, contentType: 'application/json', body: json });
  if (u.startsWith('http://local/'))      return r.fulfill({ status: 200, contentType: 'text/html', body: html });
  if (u.startsWith('http'))               return r.fulfill({ status: 404, body: '' });
  return r.continue();
});
await p.goto('http://local/', { waitUntil: 'domcontentloaded' });
await p.waitForFunction(() => { const r = document.getElementById('ap-at'); return r && r.dataset.treeVersion; }, { timeout: 20000 });
await p.waitForTimeout(800);

for (const genus of ['Amorphophallus', 'Calla']) {
  await p.click('.ap-at-q');
  await p.fill('.ap-at-q', '');
  await p.type('.ap-at-q', genus, { delay: 40 });
  await p.waitForTimeout(500);
  const sugg = await p.evaluate(() => {
    const l = [...document.querySelectorAll('[class*="sugg"], [role="option"], .ap-at-sug, .ap-at-sugg li, ul li')]
      .filter(e => e.offsetParent !== null);
    return l.slice(0, 6).map(e => e.className + ' :: ' + e.textContent.trim().slice(0, 40));
  });
  await p.keyboard.press('ArrowDown');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(800);
  const card = await p.evaluate(() => {
    const d = document.querySelector('.ap-at-dbody') || document.querySelector('.ap-at-drawer');
    if (!d) return null;
    const nm = d.querySelector('.ap-at-name');
    const f  = d.querySelector('.ap-at-flag');
    return { name: nm ? nm.textContent.trim() : null, flag: f ? f.textContent.trim().slice(0, 150) : null };
  });
  console.log('\n' + genus);
  console.log('  suggestions:', JSON.stringify(sugg));
  console.log('  card       :', JSON.stringify(card));
}
await b.close();
