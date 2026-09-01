import { chromium } from 'playwright';
import fs from 'fs';
const DIR   = 'G:\\My Drive\\PlantsV2\\Aroidpedia\\WEBSITE\\ARACEAE PHYLOGENETIC TREE\\';
const block = fs.readFileSync(DIR + 'ARACEAE TREE 8.16.26 v44.txt', 'utf8');
const json  = fs.readFileSync(DIR + 'araceae-tree.v1.json', 'utf8');
const html  = '<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0}</style></head><body>' + block + '</body></html>';

const b = await chromium.launch({ channel: 'chrome' });
for (const [tag, vp] of [['desk', { width: 1440, height: 1100 }], ['phone', { width: 390, height: 900 }]]) {
  const p = await b.newPage({ viewport: vp });
  await p.route('**/*', async r => {
    const u = r.request().url();
    if (u.includes('araceae-tree.v1.json')) return r.fulfill({ status: 200, contentType: 'application/json', body: json });
    if (u.startsWith('http://local/'))      return r.fulfill({ status: 200, contentType: 'text/html', body: html });
    if (u.startsWith('http'))               return r.fulfill({ status: 404, body: '' });
    return r.continue();
  });
  await p.goto('http://local/', { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => { const r = document.getElementById('ap-at'); return r && r.dataset.treeVersion; }, { timeout: 20000 });
  await p.waitForTimeout(700);

  // dispatch the click on the first button that actually has a box
  const btns = await p.evaluate(() => [...document.querySelectorAll('[data-act="about"]')]
    .map((b, i) => ({ i, w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height })));
  console.log(tag, 'about buttons:', JSON.stringify(btns));
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('[data-act="about"]')]
      .find(x => x.getBoundingClientRect().width > 0) || document.querySelector('[data-act="about"]');
    b.click();
  });
  await p.waitForTimeout(500);

  const el = await p.$('.ap-at-aboutpanel');
  const box = await el.boundingBox();
  if (box && box.width > 0) {
    await el.screenshot({ path: `about-v44-${tag}.png` });
  } else {
    await p.screenshot({ path: `about-v44-${tag}.png` });
  }
  const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(tag, 'panel', box ? Math.round(box.width) + 'x' + Math.round(box.height) : 'no box', '| h-overflow', over);
  await p.close();
}
await b.close();
