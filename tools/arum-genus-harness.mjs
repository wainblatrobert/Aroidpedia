// Arum genus-page render harness — 8.30.26
// Builds a Squarespace-shaped page from the two Arum genus blocks and
// drives it in headless Chrome. Run from this directory:
//   node arum-genus-harness.mjs
import fs from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/Arum/';
const INTRO = fs.readFileSync(DIR + 'GENUS ARUM INTRO 8.31.26 v2.txt', 'utf8');
const MORPH = fs.readFileSync(DIR + 'GENUS ARUM MORPHOLOGY & CULTIVATION 8.30.26 v1.txt', 'utf8');

// the two globals the live site sets and the harness must carry
const SKELETON = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  *{box-sizing:border-box}
  html{font-size:13px}                       /* the site's real root size */
  body{margin:0;background:#0B120D;color:#cfcdc2}
  .page-section{width:100%}
  .fluid-engine{overflow-x:clip;display:grid;max-width:1200px;margin:0 auto}
  .fe-block{grid-area:1/1/2/2;width:100%}
</style></head><body>
<div class="page-section"><div class="fluid-engine"><div class="fe-block">
${INTRO}
</div></div></div>
<div class="page-section"><div class="fluid-engine"><div class="fe-block">
${MORPH}
</div></div></div>
</body></html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(SKELETON);
});
await new Promise(r => server.listen(4599, r));

const browser = await chromium.launch({ channel: 'chrome', args: ['--disable-gpu'] });
const errors = [];
const fails = [];

async function run(width, height, label) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${label}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${label} console: ${m.text()}`); });
  await page.goto('http://127.0.0.1:4599/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const r = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const qa = s => [...document.querySelectorAll(s)];
    return {
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      introCardW: q('.ap-genus') ? Math.round(q('.ap-genus').getBoundingClientRect().width * 1000) / 1000 : null,
      mgroupW: qa('.ap-mgroup').map(n => Math.round(n.getBoundingClientRect().width * 1000) / 1000),
      regions: qa('.ap-region').length,
      regionCounts: qa('.ap-region .ap-count').map(n => n.textContent),
      regionPlaceCounts: qa('.ap-region-places').map(n => n.textContent.split('·').length),
      climFilled: !!q('#ap-genus-clim') && q('#ap-genus-clim').children.length > 0,
      climData: q('#ap-genus-clim') ? q('#ap-genus-clim').getAttribute('data-apclim-data') : null,
      climBasis: q('#ap-genus-clim') ? q('#ap-genus-clim').getAttribute('data-apclim-basis') : null,
      climRead: qa('.ap-clim-read').map(n => n.textContent),
      climNote: q('.ap-clim-note') ? q('.ap-clim-note').textContent : null,
      tabs: qa('.ap-tab').length,
      activePanels: qa('.ap-panel.is-active').length,
      nofig: qa('.ap-panel.is-nofig').length,
      figWrapsVisible: qa('.ap-fig-wrap').filter(n => n.offsetParent !== null).length,
      version: q('.ap-morph') ? q('.ap-morph').getAttribute('data-ap-version') : null,
      introVersion: q('.ap-genus') ? q('.ap-genus').getAttribute('data-version') : null,
    };
  });

  // interactions: expand a region, switch a morphology tab, switch a cultivation tab
  // v2: two independent expanders in the DESCRIPTION column
  const syn = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('.ap-syn')];
    const before = boxes.map(b => b.classList.contains('is-open'));
    boxes[1].querySelector('.ap-syn-toggle').click();
    const after = boxes.map(b => b.classList.contains('is-open'));
    const list = boxes[1].querySelector('.ap-syn-list--names');
    const items = [...list.querySelectorAll('.ap-syn-item')];
    const tops = new Set(items.map(n => Math.round(n.getBoundingClientRect().top)));
    const cols = items.length && tops.size ? Math.round(items.length / tops.size) : 0;
    return { count: items.length, before, after,
             noteVisible: !!boxes[1].querySelector('.ap-syn-note').offsetParent,
             cols, labels: boxes.map(b => b.querySelector('.ap-syn-toggle span').textContent),
             sample: items.slice(0,3).map(n => n.textContent),
             widest: Math.max(...items.map(n => Math.round(n.scrollWidth))) };
  });

  await page.click('.ap-region:nth-of-type(3) .ap-region-head');
  const regionOpen = await page.evaluate(() =>
    document.querySelectorAll('.ap-region')[2].classList.contains('is-open'));

  await page.click('#ap-t-m-inflor');
  const inflor = await page.evaluate(() => {
    const p = document.getElementById('ap-p-m-inflor');
    return { active: p.classList.contains('is-active'), hidden: p.hasAttribute('hidden'),
             others: [...document.querySelectorAll('#ap-p-m-tuber,#ap-p-m-leaf,#ap-p-m-fruit')]
                       .filter(n => n.classList.contains('is-active')).length };
  });

  await page.click('#ap-t-c-prop');
  const prop = await page.evaluate(() => {
    const p = document.getElementById('ap-p-c-prop');
    return { active: p.classList.contains('is-active'), hidden: p.hasAttribute('hidden') };
  });

  // keyboard: ArrowRight wraps within a tablist
  await page.focus('#ap-t-c-pest');
  await page.keyboard.press('ArrowRight');
  const wrapped = await page.evaluate(() => document.activeElement.id);

  const noOverflow = r.scrollW <= r.clientW;
  if (!noOverflow) fails.push(`${label}: horizontal overflow ${r.scrollW} > ${r.clientW}`);
  if (r.regions !== 6) fails.push(`${label}: expected 6 region groups, got ${r.regions}`);
  if (r.tabs !== 9) fails.push(`${label}: expected 9 tabs, got ${r.tabs}`);
  if (r.activePanels !== 2) fails.push(`${label}: expected 2 open panels, got ${r.activePanels}`);
  if (r.nofig !== 4) fails.push(`${label}: expected 4 panels to fall back (no plates yet), got ${r.nofig}`);
  if (r.figWrapsVisible !== 0) fails.push(`${label}: ${r.figWrapsVisible} figure column(s) still visible`);
  if (!regionOpen) fails.push(`${label}: region expander did not open`);
  if (syn.count !== 66) fails.push(`${label}: expected 66 common names, got ${syn.count}`);
  if (syn.before.join() !== 'false,false') fails.push(`${label}: expanders not closed at load`);
  if (syn.after.join() !== 'false,true') fails.push(`${label}: expanders are coupled - ${syn.after}`);
  if (!syn.noteVisible) fails.push(`${label}: the note under the names did not show`);
  if (!inflor.active || inflor.hidden || inflor.others) fails.push(`${label}: morphology tab switch failed`);
  if (!prop.active || prop.hidden) fails.push(`${label}: cultivation tab switch failed`);
  if (wrapped !== 'ap-t-c-sub') fails.push(`${label}: ArrowRight did not wrap (focus ${wrapped})`);

  console.log(`\n===== ${label} (${width}x${height}) =====`);
  console.log(JSON.stringify({ ...r, regionOpen, syn, inflor, prop, wrapped }, null, 1));
  await ctx.close();
}

await run(1440, 900, 'desktop');
await run(375, 812, 'phone-375');
await run(280, 640, 'phone-280');

await browser.close();
server.close();

console.log('\n===== PAGE ERRORS =====');
console.log(errors.length ? errors.join('\n') : '(none)');
console.log('\n===== FAILURES =====');
console.log(fails.length ? fails.join('\n') : 'ALL CHECKS PASSED');
