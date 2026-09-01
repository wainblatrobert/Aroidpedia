/* END-TO-END for card v86's HD upgrade, on the REAL site.

   Serves the locally-built footer.js (v104) into the live
   alocasia-cuprea post via route interception, twice:

   A. CONTROL — untouched shapes.json. The post's tags all resolve, so
      shapes-hd must NOT be requested, and the card must render exactly
      as before: Sabah solid, stamp card-v86-file-v104.

   B. TRIGGER — shapes.json is served with Sabah REMOVED (shape + order),
      simulating an HD-only place named in the DISTRIBUTION prose. The
      card must fetch shapes-hd, resolve Sabah from it, and render it as
      a SOLID chip with a lit map path — not the dashed --off chip.
*/
import { chromium } from 'playwright';
import fs from 'fs';

const BUNDLE = 'C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js';
const POST = 'https://www.aroidpedia.com/journal/alocasia-cuprea';
const bundle = fs.readFileSync(BUNDLE, 'utf8');

const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function run(label, mangleShapes) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  let hdRequested = false, shapesServed = false;

  await ctx.route('**/footer.js*', r =>
    r.fulfill({ status: 200, contentType: 'application/javascript', body: bundle }));
  await ctx.route('**/shapes-hd.json*', async r => {
    hdRequested = true;
    await r.continue();
  });
  if (mangleShapes) {
    await ctx.route('**/Aroidpedia/shapes.json*', async r => {
      const resp = await r.fetch();
      const j = await resp.json();
      delete j.shapes['Sabah'];
      j.order = (j.order || []).filter(n => n !== 'Sabah');
      shapesServed = true;
      await r.fulfill({ status: 200, contentType: 'application/json',
                        body: JSON.stringify(j) });
    });
  }

  await page.goto(POST, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-apsc-mount] .apsc-chip', { timeout: 30000 });
  await page.waitForTimeout(2500);

  const out = await page.evaluate(() => {
    const chips = [...document.querySelectorAll('.apsc-chip')].map(c => ({
      text: c.textContent.trim(),
      off: c.classList.contains('apsc-chip--off'),
      parent: c.classList.contains('apsc-chip--parent'),
    }));
    const paths = [...document.querySelectorAll('.apsc svg [class*="apsc-on"]')]
      .map(p => p.getAttribute('data-zone') || p.getAttribute('aria-label') || '?');
    const mount = document.querySelector('[data-apsc-version]');
    return { chips,
             litPaths: paths,
             version: mount ? mount.getAttribute('data-apsc-version') : null,
             hasClimate: !!document.querySelector('.apsc-climate, [class*="apclim"]') };
  });

  const sabah = out.chips.find(c => c.text === 'Sabah');
  console.log(`--- ${label} ---`);
  console.log('  stamp          :', out.version);
  console.log('  shapes mangled :', mangleShapes ? shapesServed : 'n/a');
  console.log('  hd requested   :', hdRequested);
  console.log('  Sabah chip     :', sabah ? (sabah.off ? 'DASHED (--off)' : 'SOLID') : 'MISSING');
  console.log('  lit map paths  :', out.litPaths.length, out.litPaths.slice(0, 6));
  await ctx.close();
  return { hdRequested, sabah, out };
}

const A = await run('A · CONTROL (real shapes.json)', false);
const B = await run('B · TRIGGER (Sabah removed from shapes.json)', true);
await browser.close();

let fails = 0;
const ok = (l, c) => { console.log((c ? 'PASS  ' : 'FAIL  ') + l); if (!c) fails++; };
console.log('');
ok('control: stamp is card-v86-file-v104', A.out.version === 'card-v86-file-v104');
ok('control: shapes-hd NOT requested', !A.hdRequested);
ok('control: Sabah solid', A.sabah && !A.sabah.off);
ok('trigger: shapes-hd WAS requested', B.hdRequested);
ok('trigger: Sabah still present as a chip', !!B.sabah);
ok('trigger: Sabah SOLID via the HD merge', B.sabah && !B.sabah.off);
console.log(fails ? `\n${fails} FAILED` : '\nALL END-TO-END CHECKS PASS');
process.exit(fails ? 1 : 0);
