/* ==================================================================
   r2-preview.mjs - see a real species page rendering its photos from
   Cloudflare R2, with NOTHING deployed.

   Serves two things into the live page by request interception:
     footer.js      -> the FILE v198 scratch bundle (PHOTO_BASE)
     manifest.json  -> the staged manifest naming content-hashed keys

   Both must be swapped together: a v198 bundle resolves manifest `f`
   values against R2, and the manifest on Pages still names the old
   unhashed paths. Swapping one without the other 404s every image,
   which is exactly the ordering hazard the real cutover has to avoid.

     node r2-preview.mjs [species-slug]        default: margaritifer
   ================================================================== */
import { chromium } from 'playwright';
import fs from 'fs';

const SLUG = process.argv[2] || 'margaritifer';
const SCRATCH = 'C:/Users/nli0490/Claude/aroidpedia-climate/footer-v16-scratch.js';
const STAGED = `C:/Users/nli0490/Claude/Aroidpedia/staging/journal/amorphophallus/${SLUG}/manifest.json`;
const SHOT = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/'
  + 'a1293f97-a570-4698-bd93-b1dc94175c04/scratchpad/r2-preview.png';

for (const [label, p] of [['scratch bundle', SCRATCH], ['staged manifest', STAGED]]) {
  if (!fs.existsSync(p)) { console.error(`missing ${label}: ${p}`); process.exit(1); }
}
const bundle = fs.readFileSync(SCRATCH, 'utf8');
const manifest = fs.readFileSync(STAGED, 'utf8');

/* Cloudflare caches an R2 404 for four hours (Cache-Control: max-age=14400),
   so previewing a species whose objects are not uploaded yet does not just
   fail - it POISONS the edge for every one of its keys, and they keep 404ing
   after the upload lands. Check one key first and refuse rather than do that. */
{
  const first = JSON.parse(manifest).roles;
  const probe = Object.values(first).flat()[0].f;
  const url = `https://img.aroidpedia.com/journal/amorphophallus/${SLUG}/${probe}`;
  const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'aroidpedia-sync/1.0' } });
  if (!res.ok) {
    console.error(`REFUSING: ${SLUG} is not uploaded yet (HEAD ${res.status}).`);
    console.error('Upload it first, or this run caches 404s for 4 hours:');
    console.error(`  python scripts/publish_media.py --species ${SLUG} --push`);
    process.exit(1);
  }
}

const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 1200 } });

let swappedBundle = 0, swappedManifest = 0;

await p.route('**/footer.js*', async r => {
  swappedBundle++;
  await r.fulfill({ status: 200, contentType: 'application/javascript', body: bundle });
});
await p.route(`**/journal/amorphophallus/${SLUG}/manifest.json*`, async r => {
  swappedManifest++;
  await r.fulfill({ status: 200, contentType: 'application/json', body: manifest });
});

// Every media response, so we can prove where the bytes came from.
const media = [];
p.on('response', async res => {
  const u = res.url();
  if (!/\.(jpe?g|png|webp|gif|mp4|webm)(\?|$)/i.test(u)) return;
  let len = 0;
  try { len = Number(res.headers()['content-length'] || 0); } catch {}
  media.push({ url: u, status: res.status(), host: new URL(u).host, bytes: len });
});

const consoleErrors = [];
p.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });

const URL_ = `https://www.aroidpedia.com/journal/amorphophallus-${SLUG}`;
console.log(`loading ${URL_}`);
await p.goto(URL_, { waitUntil: 'networkidle', timeout: 120000 });

// Scroll the whole page so lazy images actually fetch. Slowly, and twice:
// a fast pass leaves loading="lazy" images still in flight, which reads as
// "broken" when it only means "not fetched yet".
await p.evaluate(async () => {
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 220));
    }
  }
  window.scrollTo(0, 0);
});
try { await p.waitForLoadState('networkidle', { timeout: 45000 }); } catch {}
// Give any decode still in flight a moment to finish.
await p.evaluate(() => Promise.all(
  Array.from(document.images).filter(i => i.src).map(i => i.decode().catch(() => {}))));
await p.waitForTimeout(2000);

const stamp = await p.evaluate(() => {
  const el = document.querySelector('[data-apsc-version]');
  return el ? el.getAttribute('data-apsc-version') : null;
});

const imgs = await p.evaluate(() => Array.from(document.images).map(i => ({
  src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight,
})).filter(i => i.src && /journal/.test(i.src)));

await p.screenshot({ path: SHOT, fullPage: false });

const r2 = media.filter(m => m.host === 'img.aroidpedia.com');
const pages = media.filter(m => m.host.endsWith('github.io'));
const bad = media.filter(m => m.status >= 400);
const broken = imgs.filter(i => i.w === 0);

console.log('');
console.log(`bundle swapped     ${swappedBundle}x     manifest swapped ${swappedManifest}x`);
console.log(`card stamp         ${stamp}`);
console.log('');
console.log(`media from R2      ${r2.length}  (${(r2.reduce((a, m) => a + m.bytes, 0) / 1048576).toFixed(2)} MB)`);
console.log(`media from Pages   ${pages.length}`);
console.log(`HTTP >=400         ${bad.length}`);
console.log(`<img> in DOM       ${imgs.length}   broken (naturalWidth 0): ${broken.length}`);
if (bad.length) bad.slice(0, 8).forEach(m => console.log(`   ${m.status}  ${m.url.slice(0, 120)}`));
if (broken.length) {
  // Distinguish a real failure from an image the browser simply never asked
  // for: only the former is a problem with the migration.
  const asked = new Set(media.map(m => m.url));
  const failed = broken.filter(i => asked.has(i.src));
  const never = broken.length - failed.length;
  console.log(`   of those: ${failed.length} actually FAILED, ${never} never requested (lazy, off-screen)`);
  failed.slice(0, 6).forEach(i => console.log(`   FAILED  ${i.src.slice(0, 120)}`));
}
const heavy = [...media].sort((a, b) => b.bytes - a.bytes).slice(0, 4);
if (heavy.length && heavy[0].bytes > 2 * 1048576) {
  console.log('\n   heaviest responses:');
  heavy.forEach(m => console.log(`   ${(m.bytes / 1048576).toFixed(1)} MB  ${m.url.split('/').pop().slice(0, 80)}`));
}
if (consoleErrors.length) {
  console.log(`\nconsole errors     ${consoleErrors.length}`);
  consoleErrors.slice(0, 5).forEach(e => console.log('   ' + e));
}
console.log(`\nscreenshot         ${SHOT}`);

await b.close();
