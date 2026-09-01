/* Round-8: v20.28 — inclusive country counts back, subunits leave the
   grouped views. Verify tips, element counts (speed proxy), Bangladesh
   rivers still bridged, dim scene still flat, row views untouched. */
import { chromium } from 'playwright';
import fs from 'fs';
const NEW = fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/AROID JOURNAL/JOURNAL PAGE 8.28.26 v20.28.txt','utf8');
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/journal*', async route => {
  if (route.request().resourceType() !== 'document') return route.continue();
  const resp = await route.fetch();
  let html = await resp.text();
  const lines = NEW.replace(/\r\n/g,'\n').split('\n');
  const first = lines.find(l=>l.trim()).trim(), last = [...lines].reverse().find(l=>l.trim()).trim();
  const i = html.indexOf(first), j = html.lastIndexOf(last);
  if (i>=0 && j>i) html = html.slice(0,i)+NEW+html.slice(j+last.length);
  await route.fulfill({ response: resp, body: html });
});
await p.goto('https://www.aroidpedia.com/journal', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(14000);
console.log('stamp:', await p.evaluate(() => (document.documentElement.outerHTML.match(/journal page v20\.\d+/)||['none'])[0]));
await p.evaluate(() => { const fb=[...document.querySelectorAll('button')].find(x=>/filter/i.test(x.textContent)); if(fb) fb.click(); });
await p.waitForTimeout(1200);
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(400);
const view = async v => { await p.evaluate(vv => document.querySelector('.ap-jr-view[data-view="'+vv+'"]').click(), v); await p.waitForTimeout(900); };
const rendered = () => p.evaluate(() =>
  [...document.querySelectorAll('.ap-jr-svg .s')].filter(n => getComputedStyle(n).display !== 'none').length);
const nodeTip = tags => p.evaluate(ts => {
  const svg = document.querySelector('.ap-jr-svg');
  const out = [];
  ts.forEach(t => {
    const n = svg.querySelector('[data-tag="'+t+'"], [data-place="'+t+'"]');
    if (!n) { out.push(t+': ABSENT'); return; }
    n.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:400,clientY:300}));
    const tip = document.querySelector('.ap-jr-tip');
    out.push(t+': tip="'+(tip&&!tip.hidden?tip.textContent.trim():'-')+'"');
  });
  svg.dispatchEvent(new MouseEvent('mouseleave',{bubbles:true}));
  return out.join('\n');
}, tags);

await view('countries');
console.log('rendered paths (countries):', await rendered());
console.log(await nodeTip(['India','China','Indonesia','Laos','Sudan-South Sudan','Bangladesh']));
await p.screenshot({ path: SP+'v28-countries-base.png', animations:'disabled' });
/* hover Africa for the dim scene */
const pt = await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (20 - vb.x)/vb.width*sr.width, y: sr.y + (-10 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(pt.x, pt.y); await p.waitForTimeout(600);
await p.screenshot({ path: SP+'v28-countries-dim.png', animations:'disabled' });
await p.mouse.move(20,20); await p.waitForTimeout(300);

await view('regions');
console.log('rendered paths (regions):', await rendered());
await view('continents');
console.log('rendered paths (continents):', await rendered());
await view('subzones');
console.log('rendered paths (zones/subzones internal):', await rendered());
console.log(await nodeTip(['China','Borneo','Yunnan']));
/* Bangladesh pixel check in regions */
await view('regions');
const px = await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const S=(lon,lat)=>({x:Math.round(sr.x+(lon-vb.x)/vb.width*sr.width), y:Math.round(sr.y+(-lat-vb.y)/vb.height*sr.height)});
  return { BD:S(90.2,23.9), India:S(79,22) };
});
console.log('px coords:', JSON.stringify(px));
await p.screenshot({ path: SP+'v28-regions-px.png', animations:'disabled' });
console.log('done');
await b.close();
