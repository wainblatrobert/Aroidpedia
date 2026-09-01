/* END-TO-END for card v87 — Köppen zones + at-elevation lines, REAL feeds.

   A. alocasia-cuprea    : has a stated band (1000–1500 m) -> expect BOTH
                           lines, real numbers (nights 15.9 / days 28).
   B. amorphophallus-dracontioides : no band -> zones line only.
*/
import { chromium } from 'playwright';
import fs from 'fs';

const BUNDLE = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function run(url) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  let scRequested = false;
  await ctx.route('**/footer.js*', r =>
    r.fulfill({ status: 200, contentType: 'application/javascript', body: BUNDLE }));
  await ctx.route('**/species-climate.json*', async r => { scRequested = true; await r.continue(); });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-apsc-mount] .apsc-chip', { timeout: 30000 });
  await page.waitForTimeout(4500);
  const out = await page.evaluate(() => {
    const kz = [...document.querySelectorAll('.apclim-kz')].map(d => ({
      label: (d.querySelector('.apclim-kz__label') || {}).textContent || '',
      val: (d.querySelector('.apclim-kz__val') || {}).textContent || '',
    }));
    const fine = document.querySelector('.apclim-kz__fine');
    const mount = document.querySelector('[data-apsc-version]');
    return { kz, fine: fine ? fine.textContent : null,
             version: mount ? mount.getAttribute('data-apsc-version') : null,
             chartPresent: !!document.querySelector('.apsc-clim') };
  });
  console.log(`--- ${url.split('/').pop()} ---`);
  console.log('  stamp        :', out.version);
  console.log('  chart present:', out.chartPresent);
  console.log('  sc requested :', scRequested);
  out.kz.forEach(l => console.log('  line         :', l.label, '→', l.val));
  console.log('  fine         :', out.fine);
  await ctx.close();
  return { ...out, scRequested };
}

const A = await run('https://www.aroidpedia.com/journal/alocasia-cuprea');
const B = await run('https://www.aroidpedia.com/journal/amorphophallus-dracontioides');
await browser.close();

let fails = 0;
const ok = (l, c) => { console.log((c ? 'PASS  ' : 'FAIL  ') + l); if (!c) fails++; };
console.log('');
ok('A: stamp card-v87-file-v105', A.version === 'card-v87-file-v105');
ok('A: feed requested', A.scRequested);
ok('A: zones line with rainforest', A.kz.some(l => /CLIMATE ZONES/.test(l.label) && /rainforest/.test(l.val)));
ok('A: elevation line at 1000–1500 m', A.kz.some(l => /AT 1000.1500 M/.test(l.label)));
ok('A: real at-altitude numbers', A.kz.some(l => /15\.9/.test(l.val) && /28/.test(l.val)));
ok('A: provenance fine print', !!A.fine && /species-climate v1\.1\.0/.test(A.fine));
ok('B: zones line present', B.kz.some(l => /CLIMATE ZONES/.test(l.label)));
ok('B: NO elevation line', !B.kz.some(l => /^AT /.test(l.label)));
console.log(fails ? `\n${fails} FAILED` : '\nALL v87 CHECKS PASS');
process.exit(fails ? 1 : 0);
