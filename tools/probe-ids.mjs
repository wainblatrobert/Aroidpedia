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
await p.waitForTimeout(900);
console.log(await p.evaluate(() => {
  const n = [...document.querySelectorAll('[data-id]')];
  return JSON.stringify({
    count: n.length,
    sample: n.slice(0, 8).map(e => e.getAttribute('data-id')),
    amor: n.filter(e => /amorph/i.test(e.getAttribute('data-id') || '')).map(e => e.getAttribute('data-id')).slice(0, 4),
    tags: [...new Set(n.slice(0, 40).map(e => e.tagName))]
  });
}));
await b.close();
