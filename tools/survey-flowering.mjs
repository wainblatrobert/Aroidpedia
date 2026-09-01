/* SURVEY: what do the Amorphophallus posts actually say about months?

   ⚠ The post text exists NOWHERE locally — the bulk-import generator
   does not keep it and the bodies are not in any feed. It has to be
   fetched from the live pages with ?format=json.

   This script only READS and REPORTS. It deliberately does not decide
   anything: a mined claim that goes onto a species page is a claim the
   site is making, so every hit is dumped with its surrounding sentence
   for review before any of it is trusted.

   Cached to flowering-raw.json so re-running the miner costs no
   further requests. */
import fs from 'fs';

const LIST = JSON.parse(fs.readFileSync('./amorph-urls.json', 'utf8'));
const CACHE = './flowering-raw.json';
const sleep = ms => new Promise(r => setTimeout(r, ms));

let store = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
let fetched = 0, failed = [];

const strip = h => String(h || '')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
  .replace(/&[a-z]+;/g, ' ')
  .replace(/\s+/g, ' ').trim();

for (const row of LIST) {
  if (store[row.u]) continue;
  try {
    const r = await fetch('https://aroidpedia.com' + row.u + '?format=json');
    if (!r.ok) { failed.push(row.u + ' HTTP ' + r.status); continue; }
    const j = await r.json();
    const item = (j.item || (j.items && j.items[0]) || j);
    store[row.u] = { t: row.t, body: strip(item.body || ''), excerpt: strip(item.excerpt || '') };
    fetched++;
    if (fetched % 20 === 0) { console.log('  fetched ' + fetched); fs.writeFileSync(CACHE, JSON.stringify(store)); }
    await sleep(220);                       /* be polite to the host */
  } catch (e) { failed.push(row.u + ' ' + e.message); }
}
fs.writeFileSync(CACHE, JSON.stringify(store));
console.log(`fetched ${fetched} new, cached ${Object.keys(store).length}/${LIST.length}` +
            (failed.length ? `, ${failed.length} failed: ${failed.slice(0,3).join(' | ')}` : ''));

/* ── mine ── */
const MONTH = '(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept?|Oct|Nov|Dec)';
const RANGE = new RegExp(MONTH + '\\s*(?:[-–—]|to|and|until|through|\\/)\\s*' + MONTH, 'i');
const SINGLE = new RegExp('\\b' + MONTH + '\\b', 'i');
const FLOWER = /(flower|flowering|bloom|blooms|blooming|anthesis|inflorescence|spathe opens?|in bloom)/i;
const LEAF = /(leaf|leaves|foliage|dormant|dormancy|tuber)/i;

const rows = [];
let noMonth = 0;
for (const [u, d] of Object.entries(store)) {
  const text = (d.body + ' ' + d.excerpt);
  const sentences = text.split(/(?<=[.;!?])\s+/);
  const hits = sentences.filter(s => FLOWER.test(s) && SINGLE.test(s));
  if (!hits.length) { noMonth++; continue; }
  rows.push({ u, t: d.t, hits: hits.map(s => s.trim().slice(0, 220)) });
}
console.log(`\nposts mentioning a MONTH near a FLOWERING word: ${rows.length} of ${Object.keys(store).length}` +
            `   (no such sentence: ${noMonth})`);
console.log(`of those, with an explicit RANGE: ${rows.filter(r => r.hits.some(h => RANGE.test(h))).length}\n`);

rows.slice(0, 18).forEach(r => {
  console.log('── ' + r.t.replace('AMORPHOPHALLUS ', 'A. '));
  r.hits.slice(0, 2).forEach(h => console.log('   ' + h));
});
fs.writeFileSync('./flowering-hits.json', JSON.stringify(rows, null, 1));
console.log(`\nfull dump -> flowering-hits.json (${rows.length} posts)`);
