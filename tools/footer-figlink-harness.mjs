// Does the REBUILT footer bundle (v207) open a code-block figure link?
// Serves the scratch build locally. No morph-block bridge present — the
// footer must do it alone.
import fs from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const BUNDLE = fs.readFileSync('C:/Users/nli0490/Claude/aroidpedia-climate/footer-v16-scratch.js', 'utf8');

const HTML = `<!doctype html><html><head><meta charset="utf-8"></head>
<body style="margin:0;background:#0B120D">
  <!-- a plate exactly as the genus morphology block emits it -->
  <div class="ap-fig-wrap">
    <a class="ap-fig-link" href="https://wainblatrobert.github.io/Aroidpedia/diagrams/arum-tuber-types.jpg"
       target="_blank" rel="noopener" aria-label="Open the tuber types plate at full size">
      <img class="ap-fig" src="https://wainblatrobert.github.io/Aroidpedia/diagrams/arum-tuber-types.jpg"
           width="1122" height="1402" alt="Labeled plate of the two Arum tuber types.">
    </a>
    <p class="ap-fig-cap">Fig &middot; The two tuber types</p>
  </div>
  <!-- a plain link that must NOT be hijacked -->
  <a id="plain" href="https://example.com/x.jpg">plain link</a>
  <script src="/bundle.js"><\/script>
</body></html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/bundle.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    return res.end(BUNDLE);
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML);
});
await new Promise(r => server.listen(4670, r));

const browser = await chromium.launch({ channel: 'chrome', args: ['--disable-gpu'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const errs = [], popups = [];
p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
ctx.on('page', pg => popups.push(pg.url()));
await p.goto('http://127.0.0.1:4670/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);

const fails = [];
const boot = await p.evaluate(() => ({
  bundle: window.__apFooterBundle || null,
  bound: document.querySelector('a.ap-fig-link').dataset.apLightboxBound || null,
  plainBound: document.getElementById('plain').dataset.apLightboxBound || null,
}));
console.log('boot          ', JSON.stringify(boot));
if (boot.bundle !== 'v207') fails.push(`bundle is ${boot.bundle}, want v207`);
if (boot.bound !== '1') fails.push('the figure link was not bound by the footer');
if (boot.plainBound) fails.push('a plain link got bound — the selector is too broad');

await p.click('a.ap-fig-link');
await p.waitForTimeout(500);
const open = await p.evaluate(() => {
  const ov = document.getElementById('ap-lightbox-overlay');
  const img = ov && ov.querySelector('.ap-lightbox-img');
  return { exists: !!ov, open: ov ? ov.classList.contains('ap-open') : false,
           display: ov ? getComputedStyle(ov).display : null,
           src: img ? (img.getAttribute('src')||'').split('/').pop() : null,
           alt: img ? (img.alt||'').slice(0,34) : null,
           overlays: document.querySelectorAll('.ap-lightbox-overlay').length };
});
console.log('after click   ', JSON.stringify(open));
if (!open.open) fails.push('overlay did not open');
if (open.display !== 'flex') fails.push(`display ${open.display}`);
if (open.overlays !== 1) fails.push(`${open.overlays} overlays`);
if (open.src !== 'arum-tuber-types.jpg') fails.push(`src ${open.src}`);
if (popups.length) fails.push(`opened ${popups.length} tab(s) — should have been none`);

await p.keyboard.press('Escape'); await p.waitForTimeout(300);
const closed = await p.evaluate(() => document.getElementById('ap-lightbox-overlay').classList.contains('ap-open'));
console.log('after Escape  ', JSON.stringify({ closed: !closed }));
if (closed) fails.push('Escape did not close');

// modified click must still reach a real tab
popups.length = 0;
await p.click('a.ap-fig-link', { modifiers: ['Control'] });
await p.waitForTimeout(900);
console.log('ctrl-click    ', JSON.stringify({ newTabs: popups.length }));
if (popups.length !== 1) fails.push(`ctrl-click gave ${popups.length} tabs, want 1`);

// a figure injected AFTER load must get bound by the MutationObserver
await p.evaluate(() => {
  const d = document.createElement('div');
  d.innerHTML = '<a class="ap-fig-link" id="late" href="https://wainblatrobert.github.io/Aroidpedia/diagrams/arum-infructescence.jpg"><img alt="late plate"></a>';
  document.body.appendChild(d);
});
await p.waitForTimeout(600);
const late = await p.evaluate(() => document.getElementById('late').dataset.apLightboxBound || null);
console.log('late-injected ', JSON.stringify({ bound: late }));
if (late !== '1') fails.push('a figure added after load was not bound');

if (errs.length) fails.push('page errors: ' + errs.join('; '));
await browser.close(); server.close();
console.log('\n===== FAILURES =====');
console.log(fails.length ? fails.join('\n') : 'ALL CHECKS PASSED');
