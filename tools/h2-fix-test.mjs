import { chromium } from 'playwright';
const RULE = '.ap-genus .ap-h2{font-size:clamp(30px,11.2vw,42px);}';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
for (const g of ['alocasia','amorphophallus']) {
  for (const w of [1440, 375, 320, 280]) {
    const ctx = await br.newContext({viewport:{width:w,height:700}});
    const p = await ctx.newPage();
    await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'domcontentloaded',timeout:90000});
    await p.waitForTimeout(6000);
    const before = await p.evaluate(()=>({
      fs: getComputedStyle([...document.querySelectorAll('.ap-genus .ap-h2')][0]).fontSize,
      sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth }));
    // inject the candidate Custom CSS rule into <head>, as Squarespace would
    await p.evaluate(rule => {
      const s = document.createElement('style'); s.id='h2fix'; s.textContent = rule;
      document.head.appendChild(s);
    }, RULE);
    await p.waitForTimeout(400);
    const after = await p.evaluate(()=>({
      fs: getComputedStyle([...document.querySelectorAll('.ap-genus .ap-h2')][0]).fontSize,
      sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth }));
    console.log('%s @%d  before %s scrollW %d/%d  ->  after %s scrollW %d/%d  %s',
      g.padEnd(15), w, before.fs.padEnd(7), before.sw, before.vw,
      after.fs.padEnd(7), after.sw, after.vw,
      (before.sw>before.vw && after.sw<=after.vw) ? 'FIXED'
        : (after.sw>after.vw ? 'STILL OVERFLOWS' : 'ok both'));
    await ctx.close();
  }
}
await br.close();
