import { chromium } from 'playwright';
import fs from 'fs';
const SP='C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const R='C:/Users/nli0490/Claude/Aroidpedia/docs/';
const b=await chromium.launch({channel:'chrome',headless:true});
const p=await b.newPage({viewport:{width:1500,height:1000},deviceScaleFactor:2});
p.on('pageerror',e=>console.log('PAGEERROR:',String(e).slice(0,220)));
for (const f of ['footer.js','shapes-topo.json','climate-zones.json','climate-zones.png']) {
  const ct=f.endsWith('.js')?'application/javascript':f.endsWith('.png')?'image/png':'application/json';
  await p.route('**/'+f+'*',r=>r.fulfill({body:fs.readFileSync(R+f),contentType:ct,headers:{'access-control-allow-origin':'*'}}));
}
await p.goto('https://www.aroidpedia.com/'+(process.argv[2]||'arum'),{waitUntil:'networkidle',timeout:120000});
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(()=>document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH=await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
for (const v of ['continents','regions','countries']) {
  await p.evaluate(vv=>{[...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===vv).click();},v);
  await p.waitForTimeout(1500);
  console.log(v.padEnd(11), await p.evaluate(()=>{
    const svg=document.querySelector('.apgm svg');
    const on=[...svg.querySelectorAll('.apgm-rb.apgm-rb--on')];
    const len=on.reduce((n,e)=>n+(e.getAttribute('d')||'').length,0);
    const cs=on[0]?getComputedStyle(on[0]):null;
    const merged=svg.querySelector('.apgm-zone--merged');
    return 'groupBorders='+on.length+' dLen='+len+
      (cs?(' stroke='+cs.stroke+' op='+cs.strokeOpacity+' w='+cs.strokeWidth):'')+
      ' | merged --mst='+(merged?getComputedStyle(merged).stroke:'-');
  }));
  await svgH.screenshot({path:SP+'v42-'+v+'.png',animations:'disabled'});
}
await b.close();
