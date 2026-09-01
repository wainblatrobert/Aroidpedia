import { chromium } from 'playwright';
const SP='C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b=await chromium.launch({channel:'chrome',headless:true});
for (const g of ['arum','alocasia']) {
  const p=await b.newPage({viewport:{width:1500,height:1000},deviceScaleFactor:2});
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'networkidle',timeout:120000});
  await p.waitForTimeout(13000);
  const svgH=await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  const out=[];
  for (const v of ['continents','regions','countries']) {
    await p.evaluate(vv=>{[...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===vv).click();},v);
    await p.waitForTimeout(1400);
    out.push(v+'='+await p.evaluate(()=>{
      const svg=document.querySelector('.apgm svg');
      const on=[...svg.querySelectorAll('.apgm-rb.apgm-rb--on')];
      const m=svg.querySelector('.apgm-zone--merged');
      return on.length+' borders'+(on[0]?(' @'+getComputedStyle(on[0]).stroke):
        ' (merged '+(m?getComputedStyle(m).stroke:'-')+')');
    }));
    if (v==='continents') await svgH.screenshot({path:SP+'live206-'+g+'-continents.png',animations:'disabled'});
  }
  console.log(g.padEnd(10), await p.evaluate(()=>document.querySelector('.apgm').getAttribute('data-apgm-version')), '|', out.join(' | '));
  await p.close();
}
await b.close();
