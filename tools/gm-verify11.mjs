import { chromium } from 'playwright';
import fs from 'fs';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const TOPO = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-topo.json', 'utf8');
const HIER = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/geo-hierarchy.json', 'utf8');
const HD = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
const j = (body) => (r) => r.fulfill({ body, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.route('**/shapes-topo.json*', j(TOPO));
await p.route('**/geo-hierarchy.json*', j(HIER));
await p.route('**/shapes-hd.json*', j(HD));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
const view = async v => { await p.evaluate(vv => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === vv).click(); }, v); await p.waitForTimeout(800); };

/* Oceania hover dim: continents view */
await view('continents');
const opt = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (134 - vb.x)/vb.width*sr.width, y: sr.y + (24 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(opt.x, opt.y); await p.waitForTimeout(500);
console.log('hover reads:', await p.evaluate(() => { const h = document.querySelector('.apgm [data-on]'); return h ? h.textContent.trim().slice(0, 30) : '-'; }));
await svgH.screenshot({ path: SP + 'v29-oceania-hover.png', animations: 'disabled' });
await p.mouse.move(20, 20); await p.waitForTimeout(300);

/* countries: uniform borders + Laos */
await view('countries');
await svgH.screenshot({ path: SP + 'v29-countries.png', animations: 'disabled' });
/* Kutai Timur ghost present + hover */
await view('divisions');
console.log('Kutai Timur node:', await p.evaluate(() => {
  const n = document.querySelector('.apgm svg [data-zone="Kutai Timur"]');
  return n ? (n.getAttribute('class')||'') : 'ABSENT';
}));
const kt = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (117.7 - vb.x)/vb.width*sr.width, y: sr.y + (-1.0 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(kt.x, kt.y); await p.waitForTimeout(500);
console.log('KT-area hover reads:', await p.evaluate(() => { const h = document.querySelector('.apgm [data-on]'); return h ? h.textContent.trim().slice(0, 44) : '-'; }));
console.log('done');
await b.close();
