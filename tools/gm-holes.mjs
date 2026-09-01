import { chromium } from 'playwright';
const SP='C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b=await chromium.launch({channel:'chrome',headless:true});
const p=await b.newPage({viewport:{width:1500,height:900},deviceScaleFactor:2});
await p.goto('https://www.aroidpedia.com/arum',{waitUntil:'networkidle',timeout:120000});
await p.waitForTimeout(14000);
const svgH=await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.evaluate(()=>{[...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='countries').click();});
await p.waitForTimeout(1500);
console.log('painted at the former holes (Countries view):', await p.evaluate(()=>{
  const svg=document.querySelector('.apgm svg');
  const at=(nm,lon,lat)=>{const pt=svg.createSVGPoint();pt.x=lon;pt.y=-lat;
    const q=pt.matrixTransform(svg.getScreenCTM());const h=document.elementFromPoint(q.x,q.y);
    if(!h||!h.getAttribute)return nm+'=nothing';
    const cs=getComputedStyle(h);
    return nm+'='+(h.getAttribute('data-zone')||'?')+' fo='+(+parseFloat(cs.fillOpacity).toFixed(2));};
  return ['\n  '+at('Luxembourg',6.1,49.8), at('Andorra',1.6,42.5),
          at('N. Ireland',-6.7,54.6), at('Moldova',28.5,47.2),
          at('NW Bulgaria',22.8,43.6)].join('\n  ');
}));
await p.evaluate(()=>document.querySelector('.apgm svg').setAttribute('viewBox','20.5 -45.5 10 4.6'));
await p.waitForTimeout(500); await svgH.screenshot({path:SP+'holes-bulgaria.png'});
await p.evaluate(()=>document.querySelector('.apgm svg').setAttribute('viewBox','-11 -56.5 20 9.2'));
await p.waitForTimeout(500); await svgH.screenshot({path:SP+'holes-nweurope.png'});
await b.close();
