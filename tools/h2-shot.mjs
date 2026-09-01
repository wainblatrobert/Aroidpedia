import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
for (const [g,w] of [['alocasia',375],['arum',375]]) {
  const ctx = await br.newContext({viewport:{width:w,height:900},deviceScaleFactor:2});
  const p = await ctx.newPage();
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'networkidle',timeout:90000});
  await p.waitForTimeout(3500);
  const h2 = await p.evaluateHandle(() =>
    [...document.querySelectorAll('.ap-genus .ap-h2')].find(n=>/DISTRIBUTION/i.test(n.textContent)));
  await p.evaluate(el => el.scrollIntoView({block:'center'}), h2);
  await p.waitForTimeout(800);
  const box = await p.evaluate(() => {
    const card = document.querySelector('.ap-genus').getBoundingClientRect();
    return { x: Math.max(0, card.left-6), y: 0, width: Math.min(375, card.width+12), height: 300 };
  });
  await p.screenshot({ path: `h2-${g}.png`, clip: { ...box, y: await p.evaluate(el => {
    const r = el.getBoundingClientRect(); return Math.max(0, r.top - 30); }, h2) } });
  console.log('shot', g);
  await ctx.close();
}
await br.close();
