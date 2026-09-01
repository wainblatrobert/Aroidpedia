/* Preview the rebuilt shapes on the LIVE pages: intercept the CDN feed
   URLs and serve the local docs/ copies. */
import { chromium } from 'playwright';
import fs from 'fs';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const TOPO = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-topo.json', 'utf8');
const HD = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/shapes-topo.json*', r => r.fulfill({ body: TOPO, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } }));
await p.route('**/shapes-hd.json*', r => r.fulfill({ body: HD, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
await p.evaluate(() => { const fb=[...document.querySelectorAll('button')].find(x=>/filter/i.test(x.textContent)); if(fb) fb.click(); });
await p.waitForTimeout(1200);
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="regions"]').click());
await p.waitForTimeout(1000);
const clip = await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const S=(lon,lat)=>({x:sr.x+(lon-vb.x)/vb.width*sr.width, y:sr.y+(-lat-vb.y)/vb.height*sr.height});
  const a=S(84,28), c=S(97,18);
  return {x:a.x, y:a.y, width:c.x-a.x, height:c.y-a.y};
});
await p.screenshot({ path: SP+'feedswap-regions-bd.png', clip, animations:'disabled' });
/* pixel sample */
const pts = await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const S=(lon,lat)=>({x:Math.round(sr.x+(lon-vb.x)/vb.width*sr.width), y:Math.round(sr.y+(-lat-vb.y)/vb.height*sr.height)});
  return { BD:S(90.2,23.9), India:S(79,22) };
});
console.log('px:', JSON.stringify(pts));
await p.screenshot({ path: SP+'feedswap-regions-full.png', animations:'disabled' });
/* genus map: Alocasia countries view (country-grain Bangladesh) */
const p2 = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p2.route('**/shapes-topo.json*', r => r.fulfill({ body: TOPO, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } }));
await p2.route('**/shapes-hd.json*', r => r.fulfill({ body: HD, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } }));
await p2.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p2.waitForTimeout(12000);
await p2.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === 'countries');
  if (z) z.click();
});
await p2.waitForTimeout(900);
const clip2 = await p2.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const S=(lon,lat)=>({x:sr.x+(lon-vb.x)/vb.width*sr.width, y:sr.y+(-lat-vb.y)/vb.height*sr.height});
  const a=S(84,28), c=S(97,18);
  window.scrollTo(0, sr.top + window.scrollY - 200);
  return null;
});
await p2.waitForTimeout(400);
const clip3 = await p2.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const S=(lon,lat)=>({x:sr.x+(lon-vb.x)/vb.width*sr.width, y:sr.y+(-lat-vb.y)/vb.height*sr.height});
  const a=S(84,28), c=S(97,18);
  return {x:a.x, y:a.y, width:c.x-a.x, height:c.y-a.y};
});
await p2.screenshot({ path: SP+'feedswap-genus-bd.png', clip: clip3, animations:'disabled' });
console.log('done');
await b.close();
