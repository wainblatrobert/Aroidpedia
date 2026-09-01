// Footer v207 AND the morph block's own bridge on one page: do they fight?
import fs from 'node:fs'; import http from 'node:http'; import { chromium } from 'playwright';
const BUNDLE = fs.readFileSync('footer-v16-scratch.js','utf8');
const MORPH = fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/Arum/GENUS ARUM MORPHOLOGY & CULTIVATION 9.1.26 v3.txt','utf8');
const HTML = `<!doctype html><html><head><meta charset="utf-8">
<style>*{box-sizing:border-box}html{font-size:13px}body{margin:0;background:#0B120D}
.fluid-engine{display:grid;max-width:1200px;margin:0 auto}.fe-block{grid-area:1/1/2/2;width:100%}</style></head><body>
<section data-section-id="s"><div class="fluid-engine"><div class="fe-block">${MORPH}</div></div></section>
<script src="/bundle.js"><\/script></body></html>`;
const srv = http.createServer((req,res)=>{
  if (req.url==='/bundle.js'){res.writeHead(200,{'Content-Type':'application/javascript; charset=utf-8'});return res.end(BUNDLE);}
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}); res.end(HTML);
});
await new Promise(r=>srv.listen(4680,r));
const br = await chromium.launch({channel:'chrome',args:['--disable-gpu']});
const ctx = await br.newContext({viewport:{width:1440,height:900}});
const p = await ctx.newPage();
const errs=[], popups=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,140))); ctx.on('page',x=>popups.push(x.url()));
await p.goto('http://127.0.0.1:4680/',{waitUntil:'networkidle'}); await p.waitForTimeout(3000);
const fails=[];
console.log('boot        ', JSON.stringify(await p.evaluate(()=>({
  bundle: window.__apFooterBundle,
  blockBridge: document.documentElement.hasAttribute('data-apfig-bound'),
  footerBound: document.querySelector('a.ap-fig-link').dataset.apLightboxBound || null,
}))));
await p.click('a.ap-fig-link'); await p.waitForTimeout(500);
const r = await p.evaluate(()=>{
  const ov=document.getElementById('ap-lightbox-overlay');
  return { overlays: document.querySelectorAll('.ap-lightbox-overlay').length,
           open: ov?ov.classList.contains('ap-open'):false,
           display: ov?getComputedStyle(ov).display:null,
           src: ov?(ov.querySelector('.ap-lightbox-img').getAttribute('src')||'').split('/').pop():null,
           bodyLocked: document.body.style.overflow==='hidden' };
});
console.log('after click ', JSON.stringify(r));
if (r.overlays!==1) fails.push(`${r.overlays} overlays — the two implementations built separate ones`);
if (!r.open) fails.push('did not open');
if (popups.length) fails.push(`${popups.length} tab(s) also opened`);
await p.keyboard.press('Escape'); await p.waitForTimeout(400);
const c = await p.evaluate(()=>({open:document.getElementById('ap-lightbox-overlay').classList.contains('ap-open'),
                                 locked:document.body.style.overflow==='hidden'}));
console.log('after Escape', JSON.stringify(c));
if (c.open) fails.push('Escape did not close');
if (c.locked) fails.push('body scroll left locked by one of the two');
// reopen/close twice to shake out any state the two might disagree on
for (let i=0;i<2;i++){ await p.click('a.ap-fig-link'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.getElementById('ap-lightbox-overlay').click()); await p.waitForTimeout(300); }
const after = await p.evaluate(()=>({open:document.getElementById('ap-lightbox-overlay').classList.contains('ap-open'),
                                     locked:document.body.style.overflow==='hidden',
                                     overlays:document.querySelectorAll('.ap-lightbox-overlay').length}));
console.log('after cycles', JSON.stringify(after));
if (after.open||after.locked||after.overlays!==1) fails.push('state drifted after repeated open/close');
if (errs.length) fails.push('page errors: '+errs.join('; '));
await br.close(); srv.close();
console.log('\n===== FAILURES =====');
console.log(fails.length?fails.join('\n'):'ALL CHECKS PASSED');
