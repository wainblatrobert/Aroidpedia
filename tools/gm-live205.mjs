import { chromium } from 'playwright';
const SP='C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b=await chromium.launch({channel:'chrome',headless:true});
for (const [g,view] of [['alocasia','regions'],['arum','countries']]) {
  const p=await b.newPage({viewport:{width:1500,height:1100},deviceScaleFactor:2});
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'networkidle',timeout:120000});
  await p.waitForTimeout(13000);
  const svgH=await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  await p.click('.apgm__climbtn'); await p.waitForTimeout(9000);
  await p.evaluate(v=>{[...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view===v).click();},view);
  await p.waitForTimeout(2500);
  console.log(g, await p.evaluate(()=>{
    const lg=document.querySelector('.apgm__legend');
    return 'stamp='+document.querySelector('.apgm').getAttribute('data-apgm-version')+
      ' zoom='+[...document.querySelectorAll('.apgm__zoom-row button')].map(b=>b.textContent).join('')+
      ' clip='+document.querySelector('clipPath[id^=apgm-climclip]').children.length+
      ' chips='+document.querySelectorAll('.apgm__clim-key').length+
      ' legendRows='+new Set([...lg.children].map(c=>Math.round(c.getBoundingClientRect().top))).size;
  }));
  const spot=await p.evaluate(()=>{const svg=document.querySelector('.apgm svg');
    const el=svg.querySelector('.apgm-zone[data-zone="Borneo"]')||svg.querySelector('.apgm-zone[data-zone="Italy"]');
    const r=el.getBoundingClientRect();
    for(let fy=.3;fy<=.7;fy+=.1)for(let fx=.3;fx<=.7;fx+=.1){const x=r.x+r.width*fx,y=r.y+r.height*fy;
      const h=document.elementFromPoint(x,y); if(h&&h.getAttribute&&h.getAttribute('data-zone'))return{x,y};}return null;});
  if(spot){await p.mouse.move(spot.x,spot.y);await p.waitForTimeout(600);}
  console.log('  readout:', await p.evaluate(()=>{const o=document.querySelector('.apgm [data-on]');return o?o.textContent.trim():'-';}));
  await svgH.screenshot({path:SP+'live205-'+g+'.png',animations:'disabled'});
  await p.close();
}
await b.close();
