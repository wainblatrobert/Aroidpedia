/* ==================================================================
   r2-live-verify.mjs - the REAL site, no interception, no swapping.
   Confirms published species pages are serving photos from R2 and
   that nothing is broken or silently falling back to Pages.

     node r2-live-verify.mjs [n]      default: 12 species, spread out
   ================================================================== */
import { chromium } from 'playwright';
import fs from 'fs';

const STAGING = 'C:/Users/nli0490/Claude/Aroidpedia/staging/journal/amorphophallus';
const N = Number(process.argv[2] || 12);

const all = fs.readdirSync(STAGING).filter(d =>
  fs.existsSync(`${STAGING}/${d}/manifest.json`)).sort();
// Even spread across the alphabet rather than the first N.
const step = Math.max(1, Math.floor(all.length / N));
const pick = Array.from({ length: N }, (_, i) => all[i * step]).filter(Boolean);

const b = await chromium.launch({ channel: 'chrome', headless: true });
let fails = 0;

for (const slug of pick) {
 try {
  const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
  const media = [];
  p.on('response', res => {
    const u = res.url();
    if (/\.(jpe?g|png|webp|gif|mp4|webm)(\?|$)/i.test(u))
      media.push({ host: new URL(u).host, status: res.status(), url: u });
  });

  await p.goto(`https://www.aroidpedia.com/journal/amorphophallus-${slug}`,
    { waitUntil: 'networkidle', timeout: 120000 });
  await p.evaluate(async () => {
    for (let pass = 0; pass < 2; pass++)
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200));
      }
    window.scrollTo(0, 0);
  });
  try { await p.waitForLoadState('networkidle', { timeout: 40000 }); } catch {}
  await p.waitForTimeout(2500);

  const stamp = await p.evaluate(() => {
    const el = document.querySelector('[data-apsc-version]');
    return el ? el.getAttribute('data-apsc-version') : 'NO CARD';
  });
  const broken = await p.evaluate(() => Array.from(document.images)
    .filter(i => i.src && /journal/.test(i.src) && i.naturalWidth === 0).length);
  const imgs = await p.evaluate(() => Array.from(document.images)
    .filter(i => i.src && /journal/.test(i.src)).length);

  const r2 = media.filter(m => m.host === 'img.aroidpedia.com');
  const pages = media.filter(m => m.host.endsWith('github.io'));
  const bad = media.filter(m => m.status >= 400);
  // Assert the CARD version, never a FILE version. The file number moves with
  // every unrelated footer change - hardcoding v198 here made a healthy site
  // report 0/4 clean the moment the bundle reached v208. card-v149 is the one
  // that resolves manifest keys against PHOTO_BASE, which is what matters.
  const cardOK = /card-v(\d+)/.test(stamp) && Number(stamp.match(/card-v(\d+)/)[1]) >= 149;
  const ok = broken === 0 && bad.length === 0 && pages.length === 0 && cardOK;
  if (!ok) fails++;

  console.log(`${ok ? 'OK  ' : 'FAIL'} ${slug.padEnd(18)} ${stamp.padEnd(22)}`
    + `imgs ${String(imgs).padStart(3)}  r2 ${String(r2.length).padStart(3)}`
    + `  pages ${pages.length}  broken ${broken}  http>=400 ${bad.length}`);
  if (bad.length) bad.slice(0, 3).forEach(m => console.log(`       ${m.status} ${m.url.slice(0, 110)}`));
  await p.close();
 } catch (e) {
  fails++;
  console.log(`FAIL ${slug.padEnd(18)} harness error: ${String(e).replace(/\s+/g, ' ').slice(0, 90)}`);
 }
}

console.log(`\n${pick.length - fails}/${pick.length} species clean`);
await b.close();
process.exit(fails ? 1 : 0);
