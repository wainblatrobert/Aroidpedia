/* Report exactly which <img> is broken on a live species page, and why. */
import { chromium } from 'playwright';

const SLUG = process.argv[2];
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });

const seen = new Map();
p.on('response', r => seen.set(r.url(), r.status()));

await p.goto(`https://www.aroidpedia.com/journal/amorphophallus-${SLUG}`,
  { waitUntil: 'networkidle', timeout: 120000 });
await p.evaluate(async () => {
  for (let pass = 0; pass < 2; pass++)
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200));
    }
  window.scrollTo(0, 0);
});
try { await p.waitForLoadState('networkidle', { timeout: 40000 }); } catch {}
await p.waitForTimeout(3000);

const broken = await p.evaluate(() => Array.from(document.images)
  .filter(i => i.src && /journal/.test(i.src) && i.naturalWidth === 0)
  .map(i => ({
    src: i.src,
    loading: i.getAttribute('loading') || '(none)',
    cls: (i.className || '').slice(0, 60),
    parent: i.parentElement ? String(i.parentElement.className).slice(0, 60) : '',
    complete: i.complete,
  })));

console.log(`${SLUG}: ${broken.length} broken`);
for (const x of broken) {
  console.log(`  src        ${x.src}`);
  console.log(`  response   ${seen.has(x.src) ? seen.get(x.src) : 'NEVER REQUESTED'}`);
  console.log(`  loading=${x.loading}  complete=${x.complete}`);
  console.log(`  class      ${x.cls}`);
  console.log(`  parent     ${x.parent}`);
  const r = await fetch(x.src, { headers: { 'User-Agent': 'aroidpedia-sync/1.0' } });
  console.log(`  direct GET ${r.status} ${r.headers.get('content-type')} ${r.headers.get('content-length')} bytes`);
}
await b.close();
