import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/arum', { waitUntil:'networkidle', timeout:120000 });
const snap = async (tag) => console.log(tag, await p.evaluate(() => {
  const wrap = document.querySelector('.apgm'); if (!wrap) return 'no map';
  const svg = wrap.querySelector('svg');
  const btns = [...wrap.querySelectorAll('[data-view]')];
  const on = btns.filter(x => x.className.match(/on|active|sel/i) || x.getAttribute('aria-pressed')==='true')
                 .map(x=>x.dataset.view);
  const cls = [...svg.classList].filter(c=>c.startsWith('apgm--')).join(',');
  const q = t => { const el = svg.querySelector('[data-zone="'+t+'"]'); if(!el) return t+'=none';
    const cs = getComputedStyle(el);
    return t+'{fo='+(+parseFloat(cs.fillOpacity).toFixed(2))+' fill='+cs.fill.replace(/\s/g,'')+
      ' cov='+el.classList.contains('apgm-cov')+'}'; };
  return 'onBtn=[' + on.join(',') + '] svgCls=' + cls + '  ' + q('West Himalaya') + ' ' + q('India');
}));
await p.waitForTimeout(4000);  await snap('t=4s  ');
await p.waitForTimeout(9000);  await snap('t=13s ');
await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='range').click(); });
await p.waitForTimeout(900);   await snap('range ');
await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='countries').click(); });
await p.waitForTimeout(900);   await snap('cntry ');
await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='range').click(); });
await p.waitForTimeout(900);   await snap('range2');
await b.close();
