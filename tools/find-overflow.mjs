import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
for (const g of ['alocasia','arum']) {
  const ctx = await br.newContext({viewport:{width:280,height:700}});
  const p = await ctx.newPage();
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'domcontentloaded',timeout:90000});
  await p.waitForTimeout(7000);
  const r = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    document.querySelectorAll('*').forEach(n => {
      const b = n.getBoundingClientRect();
      if (b.width === 0 || b.right <= vw + 1) return;
      // deepest offenders only: no child also sticking out
      const childOut = [...n.children].some(c => c.getBoundingClientRect().right > vw + 1);
      if (childOut) return;
      const cs = getComputedStyle(n);
      out.push({
        tag: n.tagName.toLowerCase(),
        cls: String(n.className || '').split(/\s+/).slice(0,2).join('.').slice(0,42),
        right: Math.round(b.right), w: Math.round(b.width),
        over: Math.round(b.right - vw),
        pos: cs.position,
        txt: (n.textContent||'').trim().slice(0,28)
      });
    });
    return { vw, scrollW: document.documentElement.scrollWidth, offenders: out.sort((a,b)=>b.over-a.over).slice(0,8) };
  });
  console.log('===', g, '| viewport', r.vw, '| scrollWidth', r.scrollW);
  r.offenders.forEach(o => console.log('   ', JSON.stringify(o)));
  await ctx.close();
}
await br.close();
