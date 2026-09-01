// Does the morph block open the FOOTER'S lightbox correctly?
// Loads the real hosted footer.js so the overlay CSS is the live one.
import fs from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const D = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/Arum/';
const MORPH = fs.readFileSync(D + 'GENUS ARUM MORPHOLOGY & CULTIVATION 8.31.26 v2.txt', 'utf8');

const page = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box}html{font-size:13px}body{margin:0;background:#0B120D}
.fluid-engine{overflow-x:clip;display:grid;max-width:1200px;margin:0 auto}.fe-block{grid-area:1/1/2/2;width:100%}</style>
</head><body>
<section data-section-id="s"><div class="fluid-engine"><div class="fe-block">${MORPH}</div></div></section>
<script src="https://wainblatrobert.github.io/Aroidpedia/footer.js"><\/script>
</body></html>`;

const server = http.createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(page);
});
await new Promise(r => server.listen(4660, r));

const browser = await chromium.launch({ channel: 'chrome', args: ['--disable-gpu'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const errs = [], popups = [];
p.on('pageerror', e => errs.push(e.message.slice(0, 140)));
ctx.on('page', pg => popups.push(pg.url()));
await p.goto('http://127.0.0.1:4660/', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);

const fails = [];
const step = async (label, fn) => { const r = await fn(); console.log(label.padEnd(34), JSON.stringify(r)); return r; };

// footer bundle actually loaded?
const boot = await step('footer bundle + css', () => p.evaluate(() => {
  let css = false;
  for (const sh of document.styleSheets) {
    try { for (const r of sh.cssRules) if (r.selectorText && /ap-lightbox-overlay/.test(r.selectorText)) { css = true; break; } } catch(e){}
    if (css) break;
  }
  return { bundle: window.__apFooterBundle || null, lightboxCss: css,
           overlayPrebuilt: !!document.getElementById('ap-lightbox-overlay'),
           figs: document.querySelectorAll('a.ap-fig-link').length };
}));
if (!boot.bundle) fails.push('footer bundle did not load');
if (!boot.lightboxCss) fails.push('footer lightbox CSS missing');

// click a plate
await p.click('a.ap-fig-link');
await p.waitForTimeout(400);
const opened = await step('after clicking a plate', () => p.evaluate(() => {
  const ov = document.getElementById('ap-lightbox-overlay');
  const img = ov && ov.querySelector('.ap-lightbox-img');
  const cs = ov && getComputedStyle(ov);
  return {
    overlays: document.querySelectorAll('.ap-lightbox-overlay').length,
    open: ov ? ov.classList.contains('ap-open') : false,
    display: cs ? cs.display : null,
    zIndex: cs ? cs.zIndex : null,
    src: img ? img.getAttribute('src').split('/').pop() : null,
    alt: img ? (img.alt || '').slice(0, 40) : null,
    bodyLocked: document.body.style.overflow === 'hidden',
    focusOnClose: document.activeElement && document.activeElement.className,
  };
}));
if (!opened.open) fails.push('overlay did not open');
if (opened.display !== 'flex') fails.push(`overlay display ${opened.display}, want flex`);
if (opened.overlays !== 1) fails.push(`${opened.overlays} overlays exist, want exactly 1`);
if (!opened.src) fails.push('no image src set');
if (!opened.bodyLocked) fails.push('body scroll not locked');
if (popups.length) fails.push(`a new tab opened: ${popups.join(', ')}`);

// escape closes
await p.keyboard.press('Escape');
await p.waitForTimeout(300);
const closed = await step('after Escape', () => p.evaluate(() => {
  const ov = document.getElementById('ap-lightbox-overlay');
  return { open: ov.classList.contains('ap-open'),
           display: getComputedStyle(ov).display,
           bodyLocked: document.body.style.overflow === 'hidden' };
}));
if (closed.open) fails.push('Escape did not close');
if (closed.bodyLocked) fails.push('body scroll left locked');

// backdrop click closes; clicking the image itself does NOT
await p.click('a.ap-fig-link'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('.ap-lightbox-img').click());
await p.waitForTimeout(200);
const stillOpen = await p.evaluate(() => document.getElementById('ap-lightbox-overlay').classList.contains('ap-open'));
console.log('clicking the plate itself'.padEnd(34), JSON.stringify({ stillOpen }));
if (!stillOpen) fails.push('clicking the image closed it — should only close on the backdrop');
await p.evaluate(() => document.getElementById('ap-lightbox-overlay').click());
await p.waitForTimeout(300);
const byBackdrop = await p.evaluate(() => document.getElementById('ap-lightbox-overlay').classList.contains('ap-open'));
console.log('backdrop click'.padEnd(34), JSON.stringify({ closed: !byBackdrop }));
if (byBackdrop) fails.push('backdrop click did not close');

// ctrl-click must still open a real tab
popups.length = 0;
await p.click('a.ap-fig-link', { modifiers: ['Control'] });
await p.waitForTimeout(900);
console.log('ctrl-click'.padEnd(34), JSON.stringify({ newTabs: popups.length }));
if (popups.length !== 1) fails.push(`ctrl-click opened ${popups.length} tabs, want 1`);

if (errs.length) fails.push('page errors: ' + errs.join('; '));
await browser.close(); server.close();
console.log('\n===== FAILURES =====');
console.log(fails.length ? fails.join('\n') : 'ALL CHECKS PASSED');
