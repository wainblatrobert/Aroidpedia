// SECTION HEADER v3 — resolution + rendering harness (8.31.26)
// Run from this directory:  node ax-header-harness.mjs
import fs from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const BLOCK = fs.readFileSync(
  'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/SECTION HEADER 8.31.26 v3.txt', 'utf8');

// The site's real base rules for .ax-index / .ax-heading, as MEASURED on the
// live /alocasia (44px / 600 / 1.76px Cormorant Garamond, uppercase). The
// harness must carry them or the span-vs-text-node test proves nothing.
const BASE_CSS = `
  *{box-sizing:border-box} html{font-size:13px}
  body{margin:0;background:#EFE9DC;font-family:Manrope,Helvetica,Arial,sans-serif}
  .ax-index{max-width:1200px;margin:0 auto;padding:40px 24px}
  .ax-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 16px}
  .ax-heading{font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(30px,5vw,44px);
              font-weight:600;letter-spacing:.04em;text-transform:uppercase;line-height:1.05;margin:0;color:#F0EEE2}
  .ax-heading__qual{text-transform:uppercase}
  .ax-rule{height:1px;background:rgba(232,230,220,.15);margin:18px 0 0}
`;

function page(pathLabel, mutate = '', apGenus = null) {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Manrope:wght@400;500&display=swap" rel="stylesheet">
<style>${BASE_CSS}</style>
<script>${apGenus === null ? '' : `window.AP={genus:${JSON.stringify(apGenus)}};`}</script>
</head><body>
${BLOCK.replace('data-qual="Timeline">', 'data-qual="Timeline"' + mutate + '>')}
</body></html>`;
}

// A control copy that emits the genus as a BARE TEXT NODE, exactly as the
// GENUS INDEX block does, so the span can be compared against it.
const CONTROL = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Manrope:wght@400;500&display=swap" rel="stylesheet">
<style>${BASE_CSS}</style></head><body>
<div class="ax-index ax-static ax-on-cream"><div class="ax-head">
<h2 class="ax-heading">Arum <span class="ax-heading__qual">Timeline</span></h2></div></div>
</body></html>`;

const ROUTES = {
  '/arum':            () => page('/arum'),                                  // slug only, no AP row
  '/alocasia':        () => page('/alocasia', '', 'alocasia'),              // AP.genus present
  '/amorphophallus':  () => page('/amorphophallus', ' data-genus="Arum"', 'amorphophallus'), // override wins
  '/aroid-morphology/deep/page': () => page('multi-segment'),               // not a genus page
  '/control':         () => CONTROL,
  '/arum?qual':       () => page('/arum').replace('data-qual="Timeline">', 'data-qual="Species">'),
};

const server = http.createServer((req, res) => {
  const key = Object.keys(ROUTES).find(k => req.url.replace(/\/+$/, '') === k) || '/arum';
  // note: '/arum?qual' keeps location.pathname === '/arum', so the slug
  // resolver still answers Arum while the qualifier knob is exercised
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(ROUTES[key]());
});
await new Promise(r => server.listen(4610, r));

const browser = await chromium.launch({ channel: 'chrome', args: ['--disable-gpu'] });
const fails = [];
const results = {};

async function look(path) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 800 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:4610' + path, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const root = document.querySelector('[data-axg-header]') || document.querySelector('.ax-index');
    const h = document.querySelector('.ax-heading');
    const box = h.getBoundingClientRect();
    return {
      rendered: h.innerText.replace(/\s+/g, ' ').trim(),
      slots: [...document.querySelectorAll('[data-axg-genus]')].map(n => n.textContent),
      via: root ? root.getAttribute('data-axg-via') : null,
      resolved: root ? root.getAttribute('data-axg-genus-resolved') : null,
      version: root ? root.getAttribute('data-axg-version') : null,
      mounted: root ? root.getAttribute('data-ax-mounted') : null,
      headingBox: { w: Math.round(box.width * 100) / 100, h: Math.round(box.height * 100) / 100 },
      lede: (document.querySelector('.ax-lede') || {}).innerText || null,
      docSW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
    };
  });
  r.errors = errs;
  await ctx.close();
  return r;
}

for (const path of Object.keys(ROUTES)) results[path] = await look(path);

// ---- assertions ----
const arum = results['/arum'];
if (arum.slots.join('|') !== 'Arum|Arum|Arum') fails.push(`/arum slots: ${arum.slots}`);
if (arum.via !== 'url-slug') fails.push(`/arum via: ${arum.via}`);
if (arum.rendered !== 'ARUM TIMELINE') fails.push(`/arum rendered: ${arum.rendered}`);
if (arum.mounted !== '1') fails.push('/arum lost data-ax-mounted');

const alo = results['/alocasia'];
if (alo.via !== 'AP.genus' || alo.resolved !== 'Alocasia') fails.push(`/alocasia: ${alo.via} ${alo.resolved}`);

const ovr = results['/amorphophallus'];
if (ovr.via !== 'data-genus' || ovr.resolved !== 'Arum') fails.push(`override: ${ovr.via} ${ovr.resolved}`);

const multi = results['/aroid-morphology/deep/page'];
if (multi.via !== null || multi.slots.join('|') !== 'Alocasia|Alocasia|Alocasia')
  fails.push(`multi-segment should keep authored text, got ${multi.via} ${multi.slots}`);

const q = results['/arum?qual'];
if (q.rendered !== 'ARUM SPECIES') fails.push(`data-qual knob: ${q.rendered}`);

const ctl = results['/control'];
if (Math.abs(ctl.headingBox.w - arum.headingBox.w) > 0.5 ||
    Math.abs(ctl.headingBox.h - arum.headingBox.h) > 0.5)
  fails.push(`span vs text node differ: span ${JSON.stringify(arum.headingBox)} vs text ${JSON.stringify(ctl.headingBox)}`);

for (const [k, v] of Object.entries(results)) {
  if (v.errors.length) fails.push(`${k} page errors: ${v.errors.join('; ')}`);
  if (v.docSW > v.clientW) fails.push(`${k} horizontal overflow`);
}

console.log(JSON.stringify(results, null, 1));
await browser.close();
server.close();
console.log('\n===== FAILURES =====');
console.log(fails.length ? fails.join('\n') : 'ALL CHECKS PASSED');
