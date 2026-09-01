/* Round-4 verification: serve the LIVE journal page with the pasted
   v20.23 block swapped for the local v20.24 file (route interception),
   so the JS overlay runs against the real archive. Scenes: regions
   NE-Africa base + hover, countries hover northern Sudan, continents. */
import { chromium } from 'playwright';
import fs from 'fs';

const NEW = fs.readFileSync(
  'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/AROID JOURNAL/JOURNAL PAGE 8.28.26 v20.24.txt',
  'utf8');
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';

const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });

let swapped = 'NOT ATTEMPTED';
await p.route('**/journal*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  /* the pasted block: from the file's opening line to its closing line.
     Normalise CRLF for the search; splice on the raw string. */
  const lines = NEW.replace(/\r\n/g, '\n').split('\n');
  const first = lines.find(l => l.trim());
  const last = [...lines].reverse().find(l => l.trim());
  const H = html;
  const i = H.indexOf(first.trim());
  const j = H.lastIndexOf(last.trim());
  if (i >= 0 && j > i) {
    html = H.slice(0, i) + NEW + H.slice(j + last.trim().length);
    swapped = 'OK (spliced ' + (j - i) + ' chars)';
  } else {
    /* fallback: locate by the version stamp's enclosing block */
    swapped = 'MARKERS NOT FOUND first=' + (i >= 0) + ' last=' + (j >= 0) +
              ' | firstLine=' + JSON.stringify(first.slice(0, 60));
  }
  await route.fulfill({ response: resp, body: html });
});

await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
console.log('swap:', swapped);
console.log('stamp on page:', await p.evaluate(() =>
  (document.documentElement.outerHTML.match(/journal page v20\.\d+/) || ['none'])[0]));

await p.evaluate(() => { const fb = Array.from(document.querySelectorAll('button')).find(x => /filter/i.test(x.textContent)); if (fb) fb.click(); });
await p.waitForTimeout(1200);
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(500);

async function view(v) {
  await p.evaluate(vv => document.querySelector('.ap-jr-view[data-view="' + vv + '"]').click(), v);
  await p.waitForTimeout(800);
}
async function zoomAt(tag, steps) {
  const pt = await p.evaluate(t => {
    const n = document.querySelector('.ap-jr-svg [data-tag="' + t + '"], .ap-jr-svg [data-place="' + t + '"]');
    if (!n) return null;
    const r = n.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, tag);
  if (!pt) { console.log('zoom target missing:', tag); return null; }
  await p.mouse.move(pt.x, pt.y);
  for (let i = 0; i < steps; i++) { await p.mouse.wheel(0, -240); await p.waitForTimeout(120); }
  await p.waitForTimeout(400);
  return pt;
}
const tipText = () => p.evaluate(() => {
  const t = document.querySelector('.ap-jr-tip');
  return t ? t.textContent.trim() : '(no .ap-jr-tip)';
});

/* -- scene 1: REGIONS, zoomed at Sudan-South Sudan, no hover ---------- */
await view('regions');
console.log('gb paths (regions):', await p.evaluate(() =>
  Array.from(document.querySelectorAll('.ap-jr-gb path')).length));
await zoomAt('Sudan-South Sudan', 6);
await p.mouse.move(20, 20);
await p.waitForTimeout(500);
await p.screenshot({ path: SP + 'v24-regions-base.png', animations: 'disabled' });

/* -- scene 2: REGIONS, hover the region ------------------------------- */
const pt2 = await zoomAt('Sudan-South Sudan', 0);
if (pt2) { await p.mouse.move(pt2.x, pt2.y); await p.waitForTimeout(600); }
console.log('regions hover tip:', await tipText());
await p.screenshot({ path: SP + 'v24-regions-hover.png', animations: 'disabled' });
await p.mouse.move(20, 20); await p.waitForTimeout(400);

/* -- scene 3: COUNTRIES, hover NORTHERN Sudan (real mouse) ------------ */
await view('countries');
console.log('gb paths (countries, expect 0):', await p.evaluate(() =>
  Array.from(document.querySelectorAll('.ap-jr-gb path')).length));
const su = await p.evaluate(() => {
  const n = document.querySelector('.ap-jr-svg [data-tag="Sudan"], .ap-jr-svg [data-place="Sudan"]');
  if (!n) return null;
  const r = n.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height * 0.35 };
});
if (su) {
  await p.mouse.move(su.x, su.y);
  for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, -240); await p.waitForTimeout(120); }
  await p.waitForTimeout(400);
  const su2 = await p.evaluate(() => {
    const n = document.querySelector('.ap-jr-svg [data-tag="Sudan"], .ap-jr-svg [data-place="Sudan"]');
    const r = n.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height * 0.35, pe: getComputedStyle(n).pointerEvents };
  });
  console.log('Sudan pointer-events:', su2.pe);
  await p.mouse.move(su2.x, su2.y);
  await p.waitForTimeout(600);
  console.log('countries hover-N-Sudan tip:', await tipText());
  await p.screenshot({ path: SP + 'v24-countries-hover.png', animations: 'disabled' });
  await p.mouse.move(20, 20); await p.waitForTimeout(400);
  await p.screenshot({ path: SP + 'v24-countries-base.png', animations: 'disabled' });
}

/* -- scene 4: CONTINENTS, whole world --------------------------------- */
await view('continents');
console.log('gb paths (continents):', await p.evaluate(() =>
  Array.from(document.querySelectorAll('.ap-jr-gb path')).length));
await p.screenshot({ path: SP + 'v24-continents.png', animations: 'disabled' });
console.log('done');
await b.close();
