import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://www.aroidpedia.com/arum',{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(7000);
console.log(JSON.stringify(await p.evaluate(()=>{
  const c=document.querySelector('.ap-genus-counter');
  if(!c) return {counter:'MISSING'};
  return {
    dataStats: JSON.stringify(c.getAttribute('data-stats')),
    stats: [...c.querySelectorAll('.ap-gc-stat')].map(s=>s.querySelector('.ap-gc-num').dataset.key),
    linked: [...c.querySelectorAll('.ap-gc-stat--link')].map(s=>s.querySelector('.ap-gc-num').dataset.key),
    dividers: c.querySelectorAll('.ap-gc-divider').length,
    heroVersionInFile: !!document.querySelector('.ap-genus-hero'),
  };
}),null,1));
await br.close();
