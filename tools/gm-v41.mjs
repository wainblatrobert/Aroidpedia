import { chromium } from 'playwright';
import fs from 'fs';
const SP='C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const R='C:/Users/nli0490/Claude/Aroidpedia/docs/';
const b=await chromium.launch({channel:'chrome',headless:true});
const p=await b.newPage({viewport:{width:1500,height:1100},deviceScaleFactor:2});
p.on('pageerror',e=>console.log('PAGEERROR:',String(e).slice(0,200)));
for (const f of ['footer.js','climate-zones.json','climate-zones.png']){
  const ct=f.endsWith('.js')?'application/javascript':f.endsWith('.json')?'application/json':'image/png';
  await p.route('**/'+f+'*',r=>r.fulfill({body:fs.readFileSync(R+f),contentType:ct,headers:{'access-control-allow-origin':'*'}}));
}
await p.goto('https://www.aroidpedia.com/alocasia',{waitUntil:'networkidle',timeout:120000});
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(()=>document.querySelector('.apgm').getAttribute('data-apgm-version')));
console.log('zoom order:', await p.evaluate(()=>[...document.querySelectorAll('.apgm__zoom-row button')].map(b=>b.textContent).join(' ')));
const svgH=await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.click('.apgm__climbtn'); await p.waitForTimeout(7000);
const st=async()=>p.evaluate(()=>{
  const svg=document.querySelector('.apgm svg');
  const cp=svg.querySelector('clipPath[id^=apgm-climclip]');
  const lg=document.querySelector('.apgm__legend');
  return { clipPaths: cp?cp.children.length:0,
    edgeLen: (svg.querySelector('.apgm-clim-edge')?.getAttribute('d')||'').length,
    chips: document.querySelectorAll('.apgm__clim-key').length,
    legendRows: lg ? new Set([...lg.children].map(c=>Math.round(c.getBoundingClientRect().top))).size : 0 };
});
for (const v of ['range','regions','countries']){
  await p.evaluate(vv=>{[...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===vv).click();},v);
  await p.waitForTimeout(1800);
  console.log(v.padEnd(10), JSON.stringify(await st()));
}
/* hover -> outline appears */
await p.evaluate(()=>{[...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='regions').click();});
await p.waitForTimeout(1500);
const spot=await p.evaluate(()=>{const svg=document.querySelector('.apgm svg');
  const el=svg.querySelector('.apgm-zone[data-zone="Borneo"]'); const r=el.getBoundingClientRect();
  for(let fy=.3;fy<=.7;fy+=.1)for(let fx=.3;fx<=.7;fx+=.1){const x=r.x+r.width*fx,y=r.y+r.height*fy;
    const h=document.elementFromPoint(x,y); if(h&&h.getAttribute&&h.getAttribute('data-zone'))return{x,y};}return null;});
await p.mouse.move(spot.x,spot.y); await p.waitForTimeout(500);
console.log('hover  hotOutline len=', await p.evaluate(()=>(document.querySelector('.apgm-clim-hot')?.getAttribute('d')||'').length),
  '| readout:', await p.evaluate(()=>{const o=document.querySelector('.apgm [data-on]');return o?o.textContent.trim():'-';}));
await svgH.screenshot({path:SP+'v41-regions.png',animations:'disabled'});
await b.close();
