/* Pull the LIVE /aroid-phylogeny tree block out of the page so it can be
   diffed against the local files. The live header says v44 while the local
   v44 was a 2-byte empty file — one of those two facts is wrong. */
import { chromium } from 'playwright';
import fs from 'fs';

const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto('https://aroidpedia.com/aroid-phylogeny', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(6000);
const html = await p.content();
fs.writeFileSync('live-phylogeny-page.html', html, 'utf8');

const i = html.indexOf('ARACEAE TREE');
console.log('header context:', JSON.stringify(html.slice(Math.max(0, i - 120), i + 260)));

// every version-looking stamp on the page
const stamps = [...html.matchAll(/ARACEAE TREE[^\n<]{0,60}/g)].map(m => m[0]);
console.log('\nstamps found:', stamps.length);
[...new Set(stamps)].slice(0, 10).forEach(s => console.log('  ' + s));

// the whole inline script block, if reachable
const scripts = await p.evaluate(() =>
  [...document.querySelectorAll('script')].map(s => s.textContent || '').filter(t => t.includes('ap-at') || t.includes('ARACEAE')));
console.log('\ninline scripts holding the block:', scripts.length,
            scripts.map(s => s.length).join(','));
if (scripts.length) fs.writeFileSync('live-tree-script.js', scripts.join('\n/* ---- next script ---- */\n'), 'utf8');
await b.close();
