// Do the GENERATED timeline specs actually render? Same vega versions and the
// same renderer the live GENUS TIMELINE block uses.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const TL = 'C:/Users/nli0490/Claude/Aroidpedia/Timelines';
const CASES = process.argv.slice(2).length ? process.argv.slice(2)
  : ['arum', 'arum_mobile', 'alocasia', 'alocasia_mobile', 'amorphophallus', 'anthurium', 'philodendron'];

const server = http.createServer((req, res) => {
  const name = decodeURIComponent(req.url.slice(1));
  if (name.startsWith('spec/')) {
    const f = path.join(TL, name.slice(5));
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end('no'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(fs.readFileSync(f));
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html><html><head><meta charset="utf-8">
<script src="https://cdn.jsdelivr.net/npm/vega@5.33.1"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@6.29.0"></script>
</head><body style="margin:0;background:#0B120D"><div id="timeline"></div>
<script>
window.__done = null;
fetch('/spec/' + new URLSearchParams(location.search).get('g'))
  .then(r => r.json())
  .then(s => vegaEmbed('#timeline', s, { actions:false, renderer:'svg' }))
  .then(res => {
    const svg = document.querySelector('#timeline svg');
    window.__done = {
      ok: true,
      svgW: svg ? +svg.getAttribute('width') : null,
      svgH: svg ? +svg.getAttribute('height') : null,
      paths: svg ? svg.querySelectorAll('path').length : 0,
      texts: svg ? svg.querySelectorAll('text').length : 0,
      milestones: res.view.data('milestones').length,
      ticks: res.view.data('ticks').length,
    };
  })
  .catch(e => { window.__done = { ok:false, error: String(e && e.message || e) }; });
<\/script></body></html>`);
});
await new Promise(r => server.listen(4650, r));

const browser = await chromium.launch({ channel: 'chrome', args: ['--disable-gpu'] });
const fails = [];
for (const g of CASES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:4650/?g=' + g, { waitUntil: 'networkidle' });
  let r = null;
  try { r = await p.waitForFunction(() => window.__done, null, { timeout: 25000 }).then(h => h.jsonValue()); }
  catch { r = { ok: false, error: 'timed out with no result' }; }

  const want = g.endsWith('_mobile') ? 300 : 1050;
  if (!r.ok) fails.push(`${g}: ${r.error}`);
  else {
    if (!r.milestones) fails.push(`${g}: 0 milestones rendered`);
    if (!r.texts) fails.push(`${g}: no text marks`);
    if (r.svgW !== want + (g.endsWith('_mobile') ? 101 : 156)) { /* width + padding, informational */ }
  }
  if (errs.length) fails.push(`${g} page errors: ${errs.join('; ')}`);
  console.log(g.padEnd(24), JSON.stringify(r));
  await ctx.close();
}
await browser.close();
server.close();
console.log('\n===== FAILURES =====');
console.log(fails.length ? fails.join('\n') : 'ALL SPECS RENDERED');
