import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
for (const g of ['alocasia','arum']) {
  const ctx = await br.newContext({viewport:{width:375,height:520},deviceScaleFactor:2});
  const p = await ctx.newPage();
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'domcontentloaded',timeout:90000});
  await p.waitForTimeout(7000);
  const y = await p.evaluate(() => {
    const h2=[...document.querySelectorAll('.ap-genus .ap-h2')].find(n=>/DISTRIBUTION/i.test(n.textContent));
    return h2.getBoundingClientRect().top + window.scrollY - 40;
  });
  await p.evaluate(y => window.scrollTo(0, y), y);
  await p.waitForTimeout(1200);
  const at = await p.evaluate(() => {
    const h2=[...document.querySelectorAll('.ap-genus .ap-h2')].find(n=>/DISTRIBUTION/i.test(n.textContent));
    const r=h2.getBoundingClientRect();
    return { topInView: Math.round(r.top), rightEdge: Math.round(r.right), viewport: innerWidth,
             cutBy: Math.round(r.right - innerWidth) };
  });
  await p.screenshot({ path: `shot-${g}.png` });
  console.log(g.padEnd(14), JSON.stringify(at));
  await ctx.close();
}
await br.close();
