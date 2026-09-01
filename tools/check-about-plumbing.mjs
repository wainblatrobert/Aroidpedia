import { chromium } from 'playwright';
import fs from 'fs';
const DIR   = 'G:\\My Drive\\PlantsV2\\Aroidpedia\\WEBSITE\\ARACEAE PHYLOGENETIC TREE\\';
const block = fs.readFileSync(DIR + 'ARACEAE TREE 8.16.26 v45.txt', 'utf8');
const json  = fs.readFileSync(DIR + 'araceae-tree.v1.json', 'utf8');
const html  = '<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}</style></head><body>' + block + '</body></html>';

const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.route('**/*', async r => {
  const u = r.request().url();
  if (u.includes('araceae-tree.v1.json')) return r.fulfill({ status: 200, contentType: 'application/json', body: json });
  if (u.startsWith('http://local/'))      return r.fulfill({ status: 200, contentType: 'text/html', body: html });
  if (u.startsWith('http'))               return r.fulfill({ status: 404, body: '' });
  return r.continue();
});
await p.goto('http://local/', { waitUntil: 'domcontentloaded' });
await p.waitForFunction(() => { const r = document.getElementById('ap-at'); return r && r.dataset.treeVersion; }, { timeout: 20000 });
await p.click('[data-act="about"]');
await p.waitForTimeout(300);

const r = await p.evaluate(() => {
  const h = [...document.querySelectorAll('h3')].find(x => /About this tree/.test(x.textContent));
  const pan = h && h.parentElement;
  const t = pan ? pan.textContent : '';
  return {
    panel: pan ? (pan.id || pan.className) : null,
    hits: ['provenance', 'uncertainPlacement', '_run_log', '1.32.0', 'version'].filter(k => t.includes(k)),
    chars: t.length,
    tail: t.slice(-140)
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
