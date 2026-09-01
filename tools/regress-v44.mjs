/* v44 regression: (a) fails SOFT on 1.31.0 data, (b) all four views still
   draw on 1.32.0, (c) no page errors, (d) the Time view still credits
   Nauheimer and still carries 121.7 / 112.0-131.9. */
import { chromium } from 'playwright';
import fs from 'fs';
const DIR   = 'G:\\My Drive\\PlantsV2\\Aroidpedia\\WEBSITE\\ARACEAE PHYLOGENETIC TREE\\';
const block = fs.readFileSync(DIR + 'ARACEAE TREE 8.16.26 v45.txt', 'utf8');
const NEW   = fs.readFileSync(DIR + 'araceae-tree.v1.json', 'utf8');
const OLD   = fs.readFileSync(DIR + 'araceae-tree.v1.json.bak-pre-1.32.0', 'utf8');
const html  = '<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0}</style></head><body>' + block + '</body></html>';

const b = await chromium.launch({ channel: 'chrome' });

async function run(label, json) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
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

  const ver = await p.evaluate(() => document.getElementById('ap-at').dataset.treeVersion);

  await p.evaluate(() => document.querySelector('[data-act="about"]').click());
  await p.waitForTimeout(300);
  const heads = await p.evaluate(() =>
    [...document.querySelectorAll('.ap-at-aboutpanel h3')].map(h => h.textContent.trim()));
  await p.evaluate(() => document.querySelector('[data-act="about"]').click());
  await p.waitForTimeout(200);

  // every view draws
  const views = {};
  for (const o of ['lr', 'td', 'bub', 'time']) {
    const btn = await p.$(`[data-orient="${o}"]`);
    if (!btn) { views[o] = 'no button'; continue; }
    await p.evaluate(sel => document.querySelector(sel).click(), `[data-orient="${o}"]`);
    await p.waitForTimeout(900);
    views[o] = await p.evaluate(() => {
      const s = document.querySelector('.ap-at-svg');
      return s ? s.querySelectorAll('*').length : 0;
    });
  }
  const timeNote = await p.evaluate(() => {
    const t = document.querySelector('.ap-at-svg .tv-note');
    return t ? t.textContent.slice(0, 60) : null;
  });

  console.log(`[${label}] stamp=${ver}`);
  console.log(`  about h3s : ${heads.length} -> ${heads.map(h => h.slice(0, 22)).join(' | ')}`);
  console.log(`  dates sect: ${heads.some(h => /How firm/.test(h)) ? 'PRESENT' : 'absent'}`);
  console.log(`  views     : ${JSON.stringify(views)}`);
  console.log(`  time note : ${timeNote}`);
  console.log(`  errors    : ${errs.length ? errs.slice(0, 3).join(' // ') : 'none'}`);
  await p.close();
}

await run('1.32.0 NEW', NEW);
await run('1.31.0 OLD', OLD);
await b.close();
