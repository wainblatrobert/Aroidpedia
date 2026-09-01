import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const ctx = await br.newContext({viewport:{width:1440,height:900}});
const p = await ctx.newPage();
const errs=[], popups=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,140))); ctx.on('page',x=>popups.push(x.url()));
await p.goto('https://www.aroidpedia.com/arum',{waitUntil:'networkidle',timeout:90000});
await p.waitForTimeout(7000);
console.log('bundle/binding', JSON.stringify(await p.evaluate(()=>({
  bundle: window.__apFooterBundle,
  figs: document.querySelectorAll('a.ap-fig-link').length,
  bound: [...document.querySelectorAll('a.ap-fig-link')].filter(a=>a.dataset.apLightboxBound==='1').length,
}))));
await p.click('a.ap-fig-link'); await p.waitForTimeout(900);
console.log('after click   ', JSON.stringify(await p.evaluate(()=>{
  const ov=document.getElementById('ap-lightbox-overlay');
  const img=ov&&ov.querySelector('.ap-lightbox-img');
  return { overlays:document.querySelectorAll('.ap-lightbox-overlay').length,
           open:ov?ov.classList.contains('ap-open'):false,
           display:ov?getComputedStyle(ov).display:null,
           src:img?(img.getAttribute('src')||'').split('/').pop():null,
           natural: img?img.naturalWidth+'x'+img.naturalHeight:null };
})));
console.log('new tabs      ', popups.length);
await p.keyboard.press('Escape'); await p.waitForTimeout(400);
console.log('after Escape  ', JSON.stringify(await p.evaluate(()=>({
  open: document.getElementById('ap-lightbox-overlay').classList.contains('ap-open')}))));
console.log('page errors   ', errs.length?errs:'(none)');
await br.close();
