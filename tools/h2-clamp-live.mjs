import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
for (const g of ['alocasia','amorphophallus','arum']) {
  for (const w of [375, 320, 280]) {
    const ctx = await br.newContext({viewport:{width:w,height:800}});
    const p = await ctx.newPage();
    await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'domcontentloaded',timeout:90000});
    await p.waitForTimeout(2500);
    const r = await p.evaluate(() => {
      const card = document.querySelector('.ap-genus');
      if (!card) return { card:null };
      const h2 = [...document.querySelectorAll('.ap-genus .ap-h2')];
      const worst = h2.map(n => ({
        t: n.textContent.trim(),
        fs: getComputedStyle(n).fontSize,
        over: n.scrollWidth - Math.ceil(n.getBoundingClientRect().width)
      })).sort((a,b)=>b.over-a.over)[0];
      return {
        cardW: Math.round(card.getBoundingClientRect().width*10)/10,
        clipped: Math.round((card.getBoundingClientRect().width - document.documentElement.clientWidth)*10)/10,
        h2: worst,
        docSW: document.documentElement.scrollWidth,
      };
    });
    console.log('%-15s %4dpx  card %-7s clippedBy %-6s  h2 %-7s "%s" overflows %s',
      g, w, r.cardW, r.clipped, r.h2?r.h2.fs:'-', r.h2?r.h2.t:'-', r.h2?r.h2.over:'-');
    await ctx.close();
  }
}
await br.close();
