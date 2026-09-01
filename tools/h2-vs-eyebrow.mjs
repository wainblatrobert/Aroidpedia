import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
for (const g of ['alocasia','amorphophallus','arum']) {
  const ctx = await br.newContext({viewport:{width:280,height:700}});
  const p = await ctx.newPage();
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'domcontentloaded',timeout:90000});
  await p.waitForTimeout(7000);
  const r = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const pick = (sel, filter) => {
      const n = [...document.querySelectorAll(sel)].find(filter || (()=>true));
      if (!n) return null;
      const b = n.getBoundingClientRect();
      return { w: Math.round(b.width), right: Math.round(b.right), over: Math.round(b.right - vw),
               text: (n.textContent||'').trim().slice(0,34) };
    };
    return {
      scrollW: document.documentElement.scrollWidth, vw,
      eyebrow: pick('.ap-gh-eyebrow'),
      h2: pick('.ap-genus .ap-h2', n => /DISTRIBUTION/i.test(n.textContent)),
      axHeadings: [...document.querySelectorAll('.ax-heading')].map(n=>{
        const b=n.getBoundingClientRect();
        return { t:(n.textContent||'').trim().slice(0,30), over: Math.round(b.right - vw) };
      }).filter(x=>x.over>0),
    };
  });
  console.log('===', g);
  console.log('   scrollW', r.scrollW, 'vs viewport', r.vw, r.scrollW>r.vw ? '  OVERFLOWS by '+(r.scrollW-r.vw) : '  ok');
  console.log('   eyebrow ', JSON.stringify(r.eyebrow));
  console.log('   h2      ', JSON.stringify(r.h2));
  console.log('   ax over ', JSON.stringify(r.axHeadings));
  await ctx.close();
}
await br.close();
