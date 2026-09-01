/* Round-5 verification: live page with v20.25 spliced in (route swap).
   Scenes: continents base + Asia hover (uninterrupted block), regions
   at the Indian subcontinent, countries residuals + tips, zones China. */
import { chromium } from 'playwright';
import fs from 'fs';

const NEW = fs.readFileSync(
  'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/AROID JOURNAL/JOURNAL PAGE 8.28.26 v20.25.txt',
  'utf8');
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';

const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });

let swapped = 'NOT ATTEMPTED';
await p.route('**/journal*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  const lines = NEW.replace(/\r\n/g, '\n').split('\n');
  const first = lines.find(l => l.trim()).trim();
  const last = [...lines].reverse().find(l => l.trim()).trim();
  const i = html.indexOf(first);
  const j = html.lastIndexOf(last);
  if (i >= 0 && j > i) {
    html = html.slice(0, i) + NEW + html.slice(j + last.length);
    swapped = 'OK';
  } else swapped = 'MARKERS NOT FOUND';
  await route.fulfill({ response: resp, body: html });
});

await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
console.log('swap:', swapped, '| stamp:', await p.evaluate(() =>
  (document.documentElement.outerHTML.match(/journal page v20\.\d+/) || ['none'])[0]));

await p.evaluate(() => { const fb = Array.from(document.querySelectorAll('button')).find(x => /filter/i.test(x.textContent)); if (fb) fb.click(); });
await p.waitForTimeout(1200);
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(500);

const view = async v => { await p.evaluate(vv => document.querySelector('.ap-jr-view[data-view="' + vv + '"]').click(), v); await p.waitForTimeout(800); };
const center = (tag, fy = 0.5) => p.evaluate(a => {
  const n = document.querySelector('.ap-jr-svg [data-tag="' + a.t + '"], .ap-jr-svg [data-place="' + a.t + '"]');
  if (!n) return null;
  const r = n.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height * a.fy };
}, { t: tag, fy });
const tipText = () => p.evaluate(() => {
  const t = document.querySelector('.ap-jr-tip');
  return t ? (t.hidden ? '(hidden)' : t.textContent.trim()) : '(no tip node)';
});
const hoverTip = async (tag, fy = 0.5) => {
  const pt = await center(tag, fy);
  if (!pt) return '(shape missing: ' + tag + ')';
  await p.mouse.move(pt.x, pt.y);
  await p.waitForTimeout(500);
  return await tipText();
};
const gbCount = () => p.evaluate(() => document.querySelectorAll('.ap-jr-gb path').length);

/* -- 1. CONTINENTS ---------------------------------------------------- */
await view('continents');
console.log('gb (continents):', await gbCount());
await p.mouse.move(20, 20); await p.waitForTimeout(400);
await p.screenshot({ path: SP + 'v25-continents-base.png', animations: 'disabled' });
console.log('Asia hover tip:', await hoverTip('China', 0.5));
await p.screenshot({ path: SP + 'v25-continents-hover.png', animations: 'disabled' });
await p.mouse.move(20, 20); await p.waitForTimeout(400);

/* -- 2. REGIONS at the Indian subcontinent ---------------------------- */
await view('regions');
console.log('gb (regions):', await gbCount());
const ind = await center('India', 0.4);
if (ind) {
  await p.mouse.move(ind.x, ind.y);
  for (let i = 0; i < 5; i++) { await p.mouse.wheel(0, -240); await p.waitForTimeout(120); }
  await p.waitForTimeout(400);
  await p.mouse.move(20, 20); await p.waitForTimeout(500);
  await p.screenshot({ path: SP + 'v25-regions-india.png', animations: 'disabled' });
  console.log('IndSub hover tip:', await hoverTip('India', 0.4));
  await p.screenshot({ path: SP + 'v25-regions-india-hover.png', animations: 'disabled' });
  await p.mouse.move(20, 20); await p.waitForTimeout(400);
}

/* -- 3. COUNTRIES: residuals ------------------------------------------ */
await view('countries');
console.log('gb (countries):', await gbCount());
await p.screenshot({ path: SP + 'v25-countries-base.png', animations: 'disabled' });
console.log('countries Indonesia tip:', await hoverTip('Indonesia', 0.5));
console.log('countries China tip:', await hoverTip('China', 0.5));
console.log('countries N-Sudan tip:', await hoverTip('Sudan', 0.35));
console.log('countries Vietnam tip:', await hoverTip('Vietnam', 0.5));
await p.mouse.move(20, 20); await p.waitForTimeout(400);

/* -- 4. ZONES: the coarse China unit ---------------------------------- */
await view('subzones') /* warm */; await view('zones');
console.log('zones China tip:', await hoverTip('China', 0.45));
await p.screenshot({ path: SP + 'v25-zones-china.png', animations: 'disabled' });
console.log('done');
await b.close();
