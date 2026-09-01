import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil:'networkidle', timeout:60000 });
await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(() => {
  const h = document.querySelector('.ax-index.ax-on-cream .ax-heading');
  const q = document.querySelector('.ax-index.ax-on-cream .ax-heading__qual');
  const pick = n => n ? (({textTransform,fontSize,fontWeight,letterSpacing,fontFamily,color}) =>
      ({textTransform,fontSize,fontWeight,letterSpacing,fontFamily:fontFamily.split(',')[0],color}))(getComputedStyle(n)) : null;
  return {
    headingText: h ? h.childNodes[0].textContent : null,
    rendered: h ? h.innerText : null,
    heading: pick(h), qual: pick(q),
    otherHeadings: [...document.querySelectorAll('.ax-heading')].map(n => n.innerText.trim()).slice(0,5)
  };
}), null, 1));
await br.close();
