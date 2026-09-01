// GENUS HERO v21 — counter collapse harness (8.31.26)
import fs from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const HERO = fs.readFileSync(
  'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/GENUS HERO 8.31.26 v23.txt', 'utf8');

// Squarespace shell + the section wrappers the counter's section-matcher reads.
function page({ stats = '', sections = ['Species & Cultivars', 'Hybrids and Hybrid Cultivars'] }) {
  // Real index-block markup: v23 reads .ax-index[data-mode], not heading text.
  const secs = sections.map((h, i) => {
    const mode = /hybrid/i.test(h) ? 'hybrids' : 'species';
    return `<section data-section-id="s${i}"><div class="ax-index" data-mode="${mode}">`
         + `<h2 class="ax-heading">${h}</h2></div><p>x</p></section>`;
  }).join('\n');
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box}html{font-size:13px}body{margin:0;background:#0B120D}
.fluid-engine{overflow-x:clip;display:grid;max-width:1200px;margin:0 auto}.fe-block{grid-area:1/1/2/2;width:100%}</style>
</head><body>
<section data-section-id="hero"><div class="fluid-engine"><div class="fe-block">
${HERO.replace('data-stats=""', `data-stats="${stats}"`)}
</div></div></section>
${secs}
</body></html>`;
}

const ROUTES = {
  '/arum':       () => page({ stats: 'species,cultivars', sections: ['Species & Cultivars'] }),
  '/alocasia':   () => page({ stats: '' }),                       // default: all three
  // v23: NO data-stats, no hybrids index block -> must auto-collapse
  '/auto':       () => page({ stats: '', sections: ['Species & Cultivars'] }),
  // GUARD 1: no .ax-index anywhere -> leave the counter alone
  '/nosignal':   () => page({ stats: '', sections: [] }),
  '/orphan':     () => page({ stats: '', sections: ['Species & Cultivars'] }), // hybrids has no section
  // THE LIVE /arum FAILURE: the index block writes its heading with JS, so the
  // first wire pass finds nothing for species OR cultivars either.
  '/latehead':   () => page({ stats: '', sections: [] }).replace('</body>',
      `<section data-section-id="late"><h2 class="ax-heading"></h2></section>
       <script>setTimeout(function(){document.querySelector('[data-section-id="late"] h2')
         .textContent='Species & Cultivars';},600);<\/script></body>`),
};
const server = http.createServer((req, res) => {
  const key = req.url.replace(/\/+$/, '') || '/arum';
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end((ROUTES[key] || ROUTES['/arum'])());
});
await new Promise(r => server.listen(4630, r));

const browser = await chromium.launch({ channel: 'chrome', args: ['--disable-gpu'] });
const fails = [];

async function look(path, waitMs) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:4630' + path, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(waitMs);
  const r = await p.evaluate(() => {
    const c = document.querySelector('.ap-genus-counter');
    const stats = [...c.querySelectorAll('.ap-gc-stat')];
    const cap = n => getComputedStyle(n.querySelector('.ap-gc-glass')).borderRadius;
    return {
      keys: stats.map(s => s.querySelector('.ap-gc-num').dataset.key),
      dividers: c.querySelectorAll('.ap-gc-divider').length,
      lastChildIsStat: c.lastElementChild.classList.contains('ap-gc-stat'),
      caps: stats.map(cap),
      linked: stats.filter(s => s.classList.contains('ap-gc-stat--link'))
                   .map(s => s.querySelector('.ap-gc-num').dataset.key),
      statCount: c.getAttribute('data-stat-count'),
    };
  });
  r.errors = errs;
  await ctx.close();
  console.log(path, JSON.stringify(r));
  return r;
}

// 1. declarative collapse — must be instant (no waiting)
const arum = await look('/arum', 250);
if (arum.keys.join() !== 'species,cultivars') fails.push(`/arum keys: ${arum.keys}`);
if (arum.dividers !== 1) fails.push(`/arum dividers: ${arum.dividers} (want 1)`);
if (!arum.lastChildIsStat) fails.push('/arum: a divider is left as :last-child');
if (arum.caps[0] !== '16px 0px 0px 16px') fails.push(`/arum first cap: ${arum.caps[0]}`);
if (arum.caps[1] !== '0px 16px 16px 0px') fails.push(`/arum last cap (cultivars): ${arum.caps[1]}`);

// 2. default — three stats, unchanged from v20
const alo = await look('/alocasia', 1200);
if (alo.keys.join() !== 'species,cultivars,hybrids') fails.push(`default keys: ${alo.keys}`);
if (alo.dividers !== 2) fails.push(`default dividers: ${alo.dividers}`);
if (alo.caps[0] !== '16px 0px 0px 16px') fails.push(`default first cap: ${alo.caps[0]}`);
if (alo.caps[1] !== '0px') fails.push(`default middle cap: ${alo.caps[1]}`);
if (alo.caps[2] !== '0px 16px 16px 0px') fails.push(`default last cap: ${alo.caps[2]}`);

// 3. v23: automatic collapse with no data-stats at all
const auto = await look('/auto', 1500);
if (auto.keys.join() !== 'species,cultivars') fails.push(`auto keys: ${auto.keys}`);
if (auto.dividers !== 1) fails.push(`auto dividers: ${auto.dividers}`);
if (!auto.lastChildIsStat) fails.push('auto: divider left as :last-child');
if (auto.caps[1] !== '0px 16px 16px 0px') fails.push(`auto last cap: ${auto.caps[1]}`);

// GUARD 1: no signal at all -> do nothing
const nos = await look('/nosignal', 1500);
if (nos.keys.length !== 3) fails.push(`no-signal page was edited: ${nos.keys}`);

// 4. THE v21 REGRESSION: a late-written heading must not empty the counter.
const late = await look('/latehead', 7000);
if (late.keys.length < 1) fails.push(`late-heading counter emptied: ${late.keys}`);
if (late.linked.join() !== 'species,cultivars') fails.push(`late-heading linked: ${late.linked}`);

for (const [k, v] of Object.entries({ '/arum': arum, '/alocasia': alo, '/auto': auto, '/nosignal': nos, '/latehead': late }))
  if (v.errors.length) fails.push(`${k} page errors: ${v.errors.join('; ')}`);

await browser.close();
server.close();
console.log('\n===== FAILURES =====');
console.log(fails.length ? fails.join('\n') : 'ALL CHECKS PASSED');
