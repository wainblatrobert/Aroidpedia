/* Round-5b: displayed-ZONES China scene (internal id subzones), zoomed
   countries Sudan probe, regions India crop source. */
import { chromium } from 'playwright';
import fs from 'fs';

const NEW = fs.readFileSync(
  'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/AROID JOURNAL/JOURNAL PAGE 8.28.26 v20.25.txt',
  'utf8');
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';

const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/journal*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  const lines = NEW.replace(/\r\n/g, '\n').split('\n');
  const first = lines.find(l => l.trim()).trim();
  const last = [...lines].reverse().find(l => l.trim()).trim();
  const i = html.indexOf(first), j = html.lastIndexOf(last);
  if (i >= 0 && j > i) html = html.slice(0, i) + NEW + html.slice(j + last.length);
  await route.fulfill({ response: resp, body: html });
});
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
console.log('stamp:', await p.evaluate(() =>
  (document.documentElement.outerHTML.match(/journal page v20\.\d+/) || ['none'])[0]));
await p.evaluate(() => { const fb = Array.from(document.querySelectorAll('button')).find(x => /filter/i.test(x.textContent)); if (fb) fb.click(); });
await p.waitForTimeout(1200);
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(500);
console.log('pills:', await p.evaluate(() =>
  Array.from(document.querySelectorAll('.ap-jr-view')).map(x => x.dataset.view + ':' + x.textContent.trim()).join(' ')));

const view = async v => { await p.evaluate(vv => { const el = document.querySelector('.ap-jr-view[data-view="' + vv + '"]'); if (el) el.click(); }, v); await p.waitForTimeout(800); };
const center = (tag, fy = 0.5, fx = 0.5) => p.evaluate(a => {
  const n = document.querySelector('.ap-jr-svg [data-tag="' + a.t + '"], .ap-jr-svg [data-place="' + a.t + '"]');
  if (!n) return null;
  const r = n.getBoundingClientRect();
  return { x: r.x + r.width * a.fx, y: r.y + r.height * a.fy };
}, { t: tag, fy, fx });
const tipText = () => p.evaluate(() => {
  const t = document.querySelector('.ap-jr-tip');
  return t ? (t.hidden ? '(hidden)' : t.textContent.trim()) : '(no tip)';
});

/* displayed ZONES = internal subzones: the China scene */
await view('subzones');
let pt = await center('China', 0.45);
if (pt) {
  await p.mouse.move(pt.x, pt.y);
  for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, -240); await p.waitForTimeout(120); }
  await p.waitForTimeout(400);
  pt = await center('China', 0.45);
  if (pt) { await p.mouse.move(pt.x, pt.y); await p.waitForTimeout(500); }
  console.log('ZONES China-area tip:', await tipText());
  await p.screenshot({ path: SP + 'v25-zones-china.png', animations: 'disabled' });
  console.log('ZONES Yunnan tip:', await (async () => { const q = await center('Yunnan'); if (!q) return '(missing)'; await p.mouse.move(q.x, q.y); await p.waitForTimeout(400); return tipText(); })());
  console.log('ZONES Borneo tip:', await (async () => { const q = await center('Borneo', 0.55); if (!q) return '(missing)'; await p.mouse.move(q.x, q.y); await p.waitForTimeout(400); return tipText(); })());
  await p.mouse.move(20, 20); await p.waitForTimeout(300);
}

/* countries: zoomed Sudan probe */
await view('countries');
pt = await center('Sudan', 0.35);
if (pt) {
  await p.mouse.move(pt.x, pt.y);
  for (let i = 0; i < 5; i++) { await p.mouse.wheel(0, -240); await p.waitForTimeout(120); }
  await p.waitForTimeout(400);
  pt = await center('Sudan', 0.35);
  await p.mouse.move(pt.x, pt.y); await p.waitForTimeout(500);
  console.log('countries N-Sudan tip:', await tipText());
  await p.screenshot({ path: SP + 'v25-countries-sudan.png', animations: 'disabled' });
}
console.log('done');
await b.close();
