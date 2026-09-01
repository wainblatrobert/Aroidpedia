import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
for (const g of ['alocasia','arum']) {
  for (const w of [375, 320, 280]) {
    const ctx = await br.newContext({viewport:{width:w,height:800}});
    const p = await ctx.newPage();
    await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'networkidle',timeout:90000});
    await p.waitForTimeout(3500);
    const r = await p.evaluate(() => {
      const card = document.querySelector('.ap-genus');
      const h2 = [...document.querySelectorAll('.ap-genus .ap-h2')]
        .find(n => /DISTRIBUTION/i.test(n.textContent)) ||
        document.querySelector('.ap-genus .ap-h2');
      // real ink width of the heading text, via a Range
      const rng = document.createRange(); rng.selectNodeContents(h2);
      const ink = rng.getBoundingClientRect().width;
      const cs = getComputedStyle(h2);
      const avail = h2.getBoundingClientRect().width;
      const cardR = card.getBoundingClientRect();
      return {
        text: h2.textContent.trim(),
        fontSize: cs.fontSize,
        inkW: Math.round(ink*10)/10,
        h2BoxW: Math.round(avail*10)/10,
        inkOverflowsBox: Math.round((ink - avail)*10)/10,
        cardW: Math.round(cardR.width*10)/10,
        cardRight: Math.round(cardR.right*10)/10,
        viewportW: document.documentElement.clientWidth,
        cardOverflowsViewport: Math.round((cardR.right - document.documentElement.clientWidth)*10)/10,
        docScrollW: document.documentElement.scrollWidth,
      };
    });
    console.log(`${g} @${w}`.padEnd(18), JSON.stringify(r));
    await ctx.close();
  }
}
await br.close();
