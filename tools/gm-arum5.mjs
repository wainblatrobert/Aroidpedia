import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 }, deviceScaleFactor: 2 });
await p.goto('https://www.aroidpedia.com/arum', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
const set = vb => p.evaluate(v => { document.querySelector('.apgm svg').setAttribute('viewBox', v); }, vb);
/* Italy + Adriatic, 20 deg wide  */
await set('6 -47 20 9.2');
await p.waitForTimeout(300);
await svgH.screenshot({ path: SP + 'cmp-italy.png' });
await p.evaluate(() => document.querySelectorAll('.apgm-borders').forEach(e=>e.style.display='none'));
await p.waitForTimeout(200);
await svgH.screenshot({ path: SP + 'cmp-italy-nohair.png' });
await p.evaluate(() => document.querySelectorAll('.apgm-borders').forEach(e=>e.style.display=''));
/* Xinjiang/Tibet at the SAME 20-deg width */
await set('76 -40 20 9.2');
await p.waitForTimeout(300);
await svgH.screenshot({ path: SP + 'cmp-asia.png' });
console.log('done');
await b.close();
