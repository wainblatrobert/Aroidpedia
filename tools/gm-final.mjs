import { chromium } from 'playwright';
import fs from 'fs';
const SP='C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const R='C:/Users/nli0490/Claude/Aroidpedia/docs/';
const b=await chromium.launch({channel:'chrome',headless:true});
for (const g of ['lemna','arum','alocasia','amorphophallus']) {
  const p=await b.newPage({viewport:{width:1500,height:900},deviceScaleFactor:2});
  p.on('pageerror',e=>console.log('  PAGEERROR:',String(e).slice(0,160)));
  for (const f of ['geo-hierarchy.json','genus-geo.json','shapes-topo.json','shapes-hd.json','climate.json'])
    await p.route('**/'+f+'*',r=>r.fulfill({body:fs.readFileSync(R+f),contentType:'application/json',headers:{'access-control-allow-origin':'*'}}));
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'networkidle',timeout:120000});
  await p.waitForTimeout(14000);
  const out=[];
  for (const v of ['range','continents','regions','countries']) {
    await p.evaluate(vv=>{const e=[...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===vv); if(e)e.click();},v);
    await p.waitForTimeout(900);
    out.push(v+'='+await p.evaluate(()=>{
      const svg=document.querySelector('.apgm svg');
      if(!svg) return 'NO MAP';
      let lit=0; svg.querySelectorAll('.apgm-zone').forEach(e=>{if(parseFloat(getComputedStyle(e).fillOpacity)>0.05)lit++;});
      return lit+' lit';
    }));
  }
  const mol=await p.evaluate(()=>{
    const svg=document.querySelector('.apgm svg'); if(!svg) return '-';
    const m=svg.querySelector('[data-zone="Moldova"]');
    return m? ('drawn fo='+(+parseFloat(getComputedStyle(m).fillOpacity).toFixed(2))) : 'not drawn';
  });
  console.log(g.padEnd(15), out.join(' | '), '| Moldova:', mol);
  if (g==='arum'){ const svgH=await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    await p.evaluate(()=>document.querySelector('.apgm svg').setAttribute('viewBox','24 -49.5 10 4.6'));
    await p.waitForTimeout(400); await svgH.screenshot({path:SP+'moldova-live.png'}); }
  await p.close();
}
await b.close();
