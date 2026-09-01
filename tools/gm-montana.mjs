import { chromium } from 'playwright';
const SP='C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b=await chromium.launch({channel:'chrome',headless:true});
for (const g of ['arum','lysichiton']) {
  const p=await b.newPage({viewport:{width:1500,height:900},deviceScaleFactor:2});
  await p.goto('https://www.aroidpedia.com/'+g,{waitUntil:'networkidle',timeout:120000});
  await p.waitForTimeout(14000);
  const has=await p.evaluate(()=>!!document.querySelector('.apgm svg'));
  if(!has){ console.log(g.padEnd(12),'no map on this page'); await p.close(); continue; }
  console.log(g.padEnd(12), await p.evaluate(()=>{
    const svg=document.querySelector('.apgm svg'); const vb=svg.viewBox.baseVal;
    const m=svg.querySelector('[data-zone="Montana"]');
    let bb=null; if(m){const r=m.getBBox(); bb='lon '+r.x.toFixed(1)+'..'+(r.x+r.width).toFixed(1)+' lat '+(-(r.y+r.height)).toFixed(1)+'..'+(-r.y).toFixed(1);}
    return 'frame lon '+vb.x.toFixed(0)+'..'+(vb.x+vb.width).toFixed(0)+
      ' | Montana: '+(m? (bb+' fo='+(+parseFloat(getComputedStyle(m).fillOpacity).toFixed(2))) : 'not drawn');
  }));
  const svgH=await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  await svgH.screenshot({path:SP+'montana-'+g+'.png',animations:'disabled'});
  await p.close();
}
await b.close();
