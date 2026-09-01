import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 }, deviceScaleFactor: 2 });
await p.goto('https://www.aroidpedia.com/arum', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
/* crop around Italy/Adriatic in client px */
const crop = await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect();
  const px = (lon,lat) => ({ x: r.x + (lon - vb.x)/vb.width*r.width, y: r.y + (-lat - vb.y)/vb.height*r.height });
  const a = px(5, 48), c = px(25, 35);
  return { x: Math.round(a.x), y: Math.round(a.y), width: Math.round(c.x-a.x), height: Math.round(c.y-a.y) };
});
console.log('crop', JSON.stringify(crop));
await p.screenshot({ path: SP + 'arum-eu-with-hairline.png', clip: crop });
/* hide the world hairline only */
await p.evaluate(() => { document.querySelectorAll('.apgm-borders').forEach(e => e.style.display='none'); });
await p.waitForTimeout(300);
await p.screenshot({ path: SP + 'arum-eu-no-hairline.png', clip: crop });
/* count hairline subpaths + measure its own segment density */
console.log(await p.evaluate(() => {
  const d = document.querySelector('.apgm-borders').getAttribute('d') || '';
  const nums = d.match(/-?\d+(\.\d+)?/g) || [];
  let len=0,n=0,px=null,py=null;
  for (let i=0;i+1<nums.length;i+=2){ const x=+nums[i], y=+nums[i+1];
    if(px!==null){const dx=x-px,dy=y-py;const dd=Math.hypot(dx,dy); if(dd<5){len+=dd;n++;}} px=x;py=y; }
  return 'hairline subpaths=' + (d.match(/M/g)||[]).length + ' pts=' + (nums.length/2) +
         ' meanSeg=' + (len/Math.max(1,n)).toFixed(4) + 'deg';
}));
await b.close();
