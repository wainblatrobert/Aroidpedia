import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const ctx = await br.newContext({viewport:{width:1440,height:900}});
const p = await ctx.newPage();
const errs=[], popups=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,140))); ctx.on('page',x=>popups.push(x.url()));
await p.goto('https://www.aroidpedia.com/arum',{waitUntil:'networkidle',timeout:90000});
await p.waitForTimeout(7000);
const fails=[];
const boot = await p.evaluate(()=>({
  morphV: (document.querySelector('.ap-morph')||{}).getAttribute
          ? document.querySelector('.ap-morph').getAttribute('data-ap-version') : null,
  bundle: window.__apFooterBundle,
  bridgeGone: !document.documentElement.hasAttribute('data-apfig-bound'),
  figs: document.querySelectorAll('a.ap-fig-link').length,
  bound: [...document.querySelectorAll('a.ap-fig-link')].filter(a=>a.dataset.apLightboxBound==='1').length,
  tabs: document.querySelectorAll('.ap-tab').length,
  nofig: document.querySelectorAll('.ap-panel.is-nofig').length,
}));
console.log('boot        ', JSON.stringify(boot));
if (boot.morphV !== 'arum-morph-cult-v3-9.1.26') fails.push('morph version is '+boot.morphV);
if (!boot.bridgeGone) fails.push('the in-block bridge is still present');
if (boot.bound !== 4) fails.push('only '+boot.bound+'/4 figures bound by the footer');
if (boot.nofig !== 0) fails.push(boot.nofig+' figure column(s) still hidden');

// every plate opens in-page
for (let i=0;i<4;i++){
  await p.evaluate(i=>document.querySelectorAll('.ap-tab')[i].click(), i);
  await p.waitForTimeout(350);
  await p.evaluate(()=>document.querySelector('.ap-panel.is-active a.ap-fig-link').click());
  await p.waitForTimeout(600);
  const r = await p.evaluate(()=>{
    const ov=document.getElementById('ap-lightbox-overlay');
    const img=ov&&ov.querySelector('.ap-lightbox-img');
    return { open:ov?ov.classList.contains('ap-open'):false,
             src:img?(img.getAttribute('src')||'').split('/').pop():null,
             nat:img?img.naturalWidth+'x'+img.naturalHeight:null,
             overlays:document.querySelectorAll('.ap-lightbox-overlay').length };
  });
  console.log('plate '+(i+1)+'      ', JSON.stringify(r));
  if (!r.open) fails.push('plate '+(i+1)+' did not open');
  if (r.overlays!==1) fails.push('plate '+(i+1)+': '+r.overlays+' overlays');
  await p.keyboard.press('Escape'); await p.waitForTimeout(350);
}
if (popups.length) fails.push(popups.length+' new tab(s) opened');
if (errs.length) fails.push('page errors: '+errs.join('; '));
await br.close();
console.log('\nnew tabs:', popups.length, '| page errors:', errs.length?errs:'(none)');
console.log('\n===== FAILURES =====');
console.log(fails.length?fails.join('\n'):'ALL CHECKS PASSED');
