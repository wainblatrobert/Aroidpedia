import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
const logs=[]; p.on('console', m=>logs.push(m.type()+': '+m.text().slice(0,180)));
await p.goto('https://www.aroidpedia.com/arum',{waitUntil:'networkidle',timeout:60000});
const at = async (ms,label)=>{ await p.waitForTimeout(ms); console.log(label, JSON.stringify(await p.evaluate(()=>{
  const c=document.querySelector('.ap-genus-counter');
  if(!c) return 'no counter';
  return { stats:[...c.querySelectorAll('.ap-gc-stat')].map(s=>s.querySelector('.ap-gc-num').dataset.key+'='+s.querySelector('.ap-gc-num').textContent),
           dividers:c.querySelectorAll('.ap-gc-divider').length,
           dataStats:c.getAttribute('data-stats'), statCount:c.getAttribute('data-stat-count') };
}))); };
await at(300,'t=0.3s ');
await at(6000,'t=6.3s ');
console.log('\n--- section headings the matcher can see ---');
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('section[data-section-id]')]
  .filter(s=>!s.querySelector('.ap-genus-counter'))
  .map(s=>{const h=s.querySelector('h1,h2,h3,h4');return h?h.textContent.trim().slice(0,50):'(no heading)';}))));
console.log('\n--- counter console ---');
logs.filter(l=>/genus-counter|ap-gc/.test(l)).forEach(l=>console.log('  '+l));
await br.close();
