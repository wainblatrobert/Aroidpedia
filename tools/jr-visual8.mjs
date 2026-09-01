/* Round-7: reproduce the grower's exact scene — Continents view,
   hover AFRICA, look at dimmed ASIA for internal borders. */
import { chromium } from 'playwright';
import fs from 'fs';
const NEW = fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/AROID JOURNAL/JOURNAL PAGE 8.28.26 v20.27.txt','utf8');
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
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="continents"]').click());
await p.waitForTimeout(900);
/* real-mouse hover over central Africa */
const pt = await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  return { x: sr.x + (20 - vb.x)/vb.width*sr.width, y: sr.y + (-10 - vb.y)/vb.height*sr.height };
});
await p.mouse.move(pt.x, pt.y);
await p.waitForTimeout(700);
await p.screenshot({ path: SP+'v27-continents-africa-hover.png', animations:'disabled' });
/* the same scene in the two other affected views */
await p.mouse.move(20,20); await p.waitForTimeout(400);
for (const v of ['regions','countries']) {
  await p.evaluate(vv => document.querySelector('.ap-jr-view[data-view="'+vv+'"]').click(), v);
  await p.waitForTimeout(800);
  await p.mouse.move(pt.x, pt.y);
  await p.waitForTimeout(600);
  await p.screenshot({ path: SP+'v27-'+v+'-africa-hover.png', animations:'disabled' });
  await p.mouse.move(20,20); await p.waitForTimeout(300);
}
console.log('done');
await b.close();
