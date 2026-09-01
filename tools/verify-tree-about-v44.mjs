/* Verify ARACEAE TREE v44 + data 1.32.0 renders the new About section.
   The block is pasted into a bare page; every request for the tree JSON is
   routed to the LOCAL 1.32.0 file, so what the browser runs is what is on
   disk, not what is on Pages. */
import { chromium } from 'playwright';
import fs from 'fs';

const DIR   = 'G:\\My Drive\\PlantsV2\\Aroidpedia\\WEBSITE\\ARACEAE PHYLOGENETIC TREE\\';
const BLOCK = DIR + 'ARACEAE TREE 8.16.26 v45.txt';
const DATA  = DIR + 'araceae-tree.v1.json';

const block = fs.readFileSync(BLOCK, 'utf8');
const json  = fs.readFileSync(DATA, 'utf8');

const page_html = `<!doctype html><html><head><meta charset="utf-8">
<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui}</style>
</head><body>${block}</body></html>`;

const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });

const logs = [];
p.on('console', m => logs.push(m.text()));
p.on('pageerror', e => logs.push('PAGEERROR ' + e.message));

let served = 0;
await p.route('**/*', async r => {
  const u = r.request().url();
  if (u.includes('araceae-tree.v1.json')) { served++; return r.fulfill({ status: 200, contentType: 'application/json', body: json }); }
  if (u.startsWith('http://local/')) return r.fulfill({ status: 200, contentType: 'text/html', body: page_html });
  if (u.startsWith('http')) return r.fulfill({ status: 404, body: '' });   // no network
  return r.continue();
});

await p.goto('http://local/', { waitUntil: 'domcontentloaded' });
await p.waitForFunction(() => {
  const r = document.getElementById('ap-at');
  return r && r.getAttribute('data-tree-version');
}, { timeout: 20000 });

const stamp = await p.evaluate(() => {
  const r = document.getElementById('ap-at');
  return { v: r.dataset.treeVersion, u: r.dataset.treeUpdated };
});

// open the About panel the way a reader does
await p.click('[data-act="about"]');
await p.waitForTimeout(400);

const about = await p.evaluate(() => {
  const pn = document.querySelector('.ap-at-about, #ap-at-about') ||
             [...document.querySelectorAll('*')].find(e => /About this tree/.test(e.textContent) && e.querySelector('h3'));
  if (!pn) return null;
  return {
    hidden: pn.hidden,
    headings: [...pn.querySelectorAll('h3')].map(h => h.textContent.trim()),
    datesBody: (() => {
      const hs = [...pn.querySelectorAll('h3')];
      const h = hs.find(x => /How firm are the dates/.test(x.textContent));
      return h && h.nextElementSibling ? h.nextElementSibling.textContent.trim() : null;
    })(),
    plumbing: /provenance|uncertainPlacement|_run_log|1\.32\.0/.test(pn.textContent)
  };
});

console.log('data stamp      :', JSON.stringify(stamp));
console.log('json served     :', served, 'time(s)');
console.log('about hidden    :', about && about.hidden);
console.log('about headings  :', JSON.stringify(about && about.headings, null, 0));
console.log('dates section   :', about && about.datesBody ? 'PRESENT' : 'MISSING');
console.log('plumbing leaked :', about && about.plumbing);
console.log('--- dates body ---\n' + (about && about.datesBody));
console.log('--- console/errors ---');
logs.filter(l => /Aroidpedia|ERROR|error/i.test(l)).slice(0, 12).forEach(l => console.log('  ' + l));

await p.screenshot({ path: 'tree-about-v44.png', fullPage: false });
await b.close();
