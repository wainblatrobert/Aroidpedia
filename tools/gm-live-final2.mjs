import { chromium } from 'playwright';
const SP='C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b=await chromium.launch({channel:'chrome',headless:true});
for (const g of ['alocasia','arum']) {
  const p=await b.newPage({viewport:{width:1500,height:1100},deviceScaleFactor:2});
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'networkidle',timeout:120000});
  await p.waitForTimeout(13000);
  const svgH=await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  console.log(g, 'stamp:', await p.evaluate(()=>document.querySelector('.apgm').getAttribute('data-apgm-version')));
  await p.click('.apgm__climbtn'); await p.waitForTimeout(6000);
  const el=await p.evaluate(()=>{const s=document.querySelector('.apgm svg');
    const z=s.querySelector('.apgm-zone[data-zone="Borneo"]')||s.querySelector('.apgm-zone[data-zone="Italy"]')||s.querySelector('.apgm-zone');
    const r=z.getBoundingClientRect();
    for(let fy=.3;fy<=.7;fy+=.1)for(let fx=.3;fx<=.7;fx+=.1){const x=r.x+r.width*fx,y=r.y+r.height*fy;
      const h=document.elementFromPoint(x,y); if(h&&h.getAttribute&&h.getAttribute('data-zone'))return{x,y};}return null;});
  if(el){await p.mouse.move(el.x,el.y);await p.waitForTimeout(500);}
  console.log(' ', 'legend=' + await p.evaluate(()=>document.querySelectorAll('.apgm__clim-key').length),
    '| readout:', await p.evaluate(()=>{const o=document.querySelector('.apgm [data-on]');return o?o.textContent.trim():'-';}));
  await svgH.screenshot({path:SP+'final-'+g+'.png',animations:'disabled'});
  await p.close();
}
await b.close();
