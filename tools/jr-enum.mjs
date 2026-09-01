import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(14000);
await p.evaluate(() => { const fb=[...document.querySelectorAll('button')].find(x=>/filter/i.test(x.textContent)); if(fb) fb.click(); });
await p.waitForTimeout(1000);
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="regions"]').click());
await p.waitForTimeout(800);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const S=(lon,lat)=>({x:sr.x+(lon-vb.x)/vb.width*sr.width, y:sr.y+(-lat-vb.y)/vb.height*sr.height});
  const a=S(87.5,27), c=S(93.5,20.5);
  const out = [];
  svg.querySelectorAll('*').forEach(e => {
    const r = e.getBoundingClientRect();
    if (!r.width && !r.height) return;
    if (r.right < a.x || r.left > c.x || r.bottom < a.y || r.top > c.y) return;
    if (r.width > (c.x-a.x)*3) return;      /* skip world-sized */
    const cs = getComputedStyle(e);
    const t = e.getAttribute('data-tag')||e.getAttribute('data-place')||'';
    out.push(e.tagName+' '+t+' ['+(e.getAttribute('class')||'')+'] fill='+cs.fill+' stroke='+cs.stroke+' disp='+cs.display+' w='+r.width.toFixed(1));
  });
  return out.join('\n');
}));
await b.close();
