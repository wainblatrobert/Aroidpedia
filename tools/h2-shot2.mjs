import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
for (const g of ['alocasia','arum']) {
  const ctx = await br.newContext({viewport:{width:375,height:640},deviceScaleFactor:2});
  const p = await ctx.newPage();
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'domcontentloaded',timeout:90000});
  await p.waitForTimeout(6000);
  await p.evaluate(() => {
    const h2=[...document.querySelectorAll('.ap-genus .ap-h2')].find(n=>/DISTRIBUTION/i.test(n.textContent));
    h2.scrollIntoView({block:'start'});
    window.scrollBy(0,-80);
  });
  await p.waitForTimeout(700);
  await p.screenshot({ path: `full-${g}.png` });      // whole 375 viewport, no clip
  console.log(g, JSON.stringify(await p.evaluate(()=>({
    docScrollW: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
    canScrollX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }))));
  await ctx.close();
}
await br.close();
