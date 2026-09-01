import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
for (const g of ['alocasia','amorphophallus','arum']) {
  const p = await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'networkidle',timeout:60000});
  await p.waitForTimeout(3000);
  console.log(g.padEnd(16), JSON.stringify(await p.evaluate(()=>{
    const c=document.querySelector('.ap-genus-counter');
    return {
      idxSpecies: document.querySelectorAll('.ax-index[data-mode="species"]').length,
      idxHybrids: document.querySelectorAll('.ax-index[data-mode="hybrids"]').length,
      stats: c ? [...c.querySelectorAll('.ap-gc-stat')].map(s=>{
        const n=s.querySelector('.ap-gc-num');
        return n.dataset.key+'='+n.textContent+(s.classList.contains('ap-gc-stat--link')?'*':'');
      }) : 'no counter',
      heroV: (document.querySelector('.ap-genus-hero')||{}).getAttribute
             ? document.querySelector('.ap-genus-hero').getAttribute('data-gh-version') : null,
    };
  })));
  await p.context().close();
}
await br.close();
