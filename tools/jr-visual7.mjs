import { chromium } from 'playwright';
import fs from 'fs';
const NEW = fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/AROID JOURNAL/JOURNAL PAGE 8.28.26 v20.26.txt','utf8');
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
const view = async v => { await p.evaluate(vv => { const el=document.querySelector('.ap-jr-view[data-view="'+vv+'"]'); if (el) el.click(); }, v); await p.waitForTimeout(900); };
const nodeTip = tags => p.evaluate(ts => {
  const svg = document.querySelector('.ap-jr-svg');
  const out = [];
  ts.forEach(t => {
    const n = svg.querySelector('[data-tag="'+t+'"], [data-place="'+t+'"]');
    if (!n) { out.push(t+': ABSENT'); return; }
    n.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:400,clientY:300}));
    const tip = document.querySelector('.ap-jr-tip');
    out.push(t+': ['+(n.getAttribute('class')||'')+'] tip="'+(tip&&!tip.hidden?tip.textContent.trim():'-')+'"');
  });
  svg.dispatchEvent(new MouseEvent('mouseleave',{bubbles:true}));
  return out.join('\n');
}, tags);
const clipAt = (lonA,latA,lonB,latB) => p.evaluate(a => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const S=(lon,lat)=>({x:sr.x+(lon-vb.x)/vb.width*sr.width, y:sr.y+(-lat-vb.y)/vb.height*sr.height});
  const q=S(a[0],a[1]), r=S(a[2],a[3]);
  return {x:q.x, y:q.y, width:r.x-q.x, height:r.y-q.y};
}, [lonA,latA,lonB,latB]);

/* regions: Bangladesh clean? */
await view('regions');
await p.screenshot({ path: SP+'v26-regions-bd.png', clip: await clipAt(70,30,105,5), animations:'disabled' });
/* continents: Cape Verde gone? Asia hover clean? */
await view('continents');
await p.screenshot({ path: SP+'v26-continents-base.png', clip: await clipAt(-30,25,60,-10), animations:'disabled' });
const ch = await p.evaluate(() => {
  const svg=document.querySelector('.ap-jr-svg');
  const n=svg.querySelector('[data-tag="China"],[data-place="China"]');
  n.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:400,clientY:300}));
  return document.querySelector('.ap-jr-tip').textContent.trim();
});
console.log('continents hover via China:', ch);
await p.waitForTimeout(400);
await p.screenshot({ path: SP+'v26-continents-asia-hover.png', clip: await clipAt(55,45,150,-15), animations:'disabled' });
await p.evaluate(() => document.querySelector('.ap-jr-svg').dispatchEvent(new MouseEvent('mouseleave',{bubbles:true})));
console.log('continents Cape Verde:', await p.evaluate(() => {
  const n=document.querySelector('.ap-jr-svg [data-tag="Cape Verde"], .ap-jr-svg [data-place="Cape Verde"]');
  return n ? n.getAttribute('class') : 'ABSENT';
}));
/* countries: context back? */
await view('countries');
console.log(await nodeTip(['China','India','Indonesia','Laos','Sudan-South Sudan']));
await p.screenshot({ path: SP+'v26-countries-base.png', animations:'disabled' });
/* displayed ZONES: China context? */
await view('subzones');
console.log(await nodeTip(['China','Borneo','Yunnan','India']));
await p.screenshot({ path: SP+'v26-zones-china.png', clip: await clipAt(70,45,125,5), animations:'disabled' });
console.log('done');
await b.close();
