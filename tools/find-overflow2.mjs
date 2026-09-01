import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
for (const g of ['alocasia','arum']) {
  const ctx = await br.newContext({viewport:{width:280,height:700}});
  const p = await ctx.newPage();
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'domcontentloaded',timeout:90000});
  await p.waitForTimeout(7000);
  const r = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const hits = [];
    document.querySelectorAll('*').forEach(n => {
      const b = n.getBoundingClientRect();
      if (b.width === 0) return;
      // elements whose right edge lands near the document's scroll extent
      if (b.right > vw + 1 && b.right <= sw + 2) {
        const cs = getComputedStyle(n);
        // skip anything inside the off-canvas menu
        if (n.closest('.header-menu, .header-menu-nav')) return;
        hits.push({ tag:n.tagName.toLowerCase(),
          cls:String(n.className||'').split(/\s+/).slice(0,3).join('.').slice(0,50),
          right:Math.round(b.right), w:Math.round(b.width),
          ovf:cs.overflowX, pos:cs.position,
          txt:(n.textContent||'').trim().slice(0,32) });
      }
    });
    return { vw, sw, hits: hits.slice(0,10) };
  });
  console.log('===', g, '| vw', r.vw, '| scrollWidth', r.sw, '| candidates outside the menu:', r.hits.length);
  r.hits.forEach(h => console.log('   ', JSON.stringify(h)));
  await ctx.close();
}
await br.close();
