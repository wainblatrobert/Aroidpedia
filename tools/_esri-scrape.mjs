import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
const svc = new Set();
p.on('request', r => { const u = r.url();
  if (/ImageServer|MapServer|FeatureServer|item\?|items\//i.test(u)) svc.add(u.split('?')[0]); });
await p.goto('https://storymaps.arcgis.com/stories/61a5d4e9494f46c2b520a984b2398f3b',
             { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(9000);
console.log('TITLE:', await p.title());
const txt = await p.evaluate(() => document.body.innerText.replace(/\n{2,}/g, '\n').slice(0, 2500));
console.log('---- TEXT ----\n' + txt);
console.log('---- SERVICES ----');
[...svc].filter(u => /ImageServer|MapServer|FeatureServer/i.test(u)).slice(0, 20).forEach(u => console.log('  ' + u));
await p.screenshot({ path: SP + 'esri-story.png', fullPage: false });
await b.close();
