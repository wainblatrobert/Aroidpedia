import { chromium } from 'playwright';
const SP='C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b=await chromium.launch({channel:'chrome',headless:true});
const p=await b.newPage({viewport:{width:1500,height:900},deviceScaleFactor:2});
await p.goto('https://www.aroidpedia.com/arum',{waitUntil:'networkidle',timeout:120000});
await p.waitForTimeout(13000);
const svgH=await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.evaluate(()=>{[...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='regions').click();});
await p.waitForTimeout(1500);
/* what is painted at these points? */
console.log(await p.evaluate(()=>{
  const svg=document.querySelector('.apgm svg');
  const at=(lon,lat)=>{
    const pt=svg.createSVGPoint(); pt.x=lon; pt.y=-lat;
    const q=pt.matrixTransform(svg.getScreenCTM());
    const h=document.elementFromPoint(q.x,q.y);
    if(!h||!h.getAttribute) return lon+','+lat+' -> none';
    const cs=getComputedStyle(h);
    return lon+','+lat+' -> '+(h.getAttribute('data-zone')||h.getAttribute('class'))+
      '  fill='+cs.fill+' fo='+(+parseFloat(cs.fillOpacity).toFixed(2));
  };
  return ['NW Bulgaria corner:', at(22.8,43.9), at(22.4,44.1), at(23.2,43.7),
          'Turkish Europe:', at(27.0,41.3), at(26.5,41.6), at(28.5,41.2)].join('\n  ');
}));
/* which border paths carry geometry near those boxes? */
console.log('\nborder segments passing through the two boxes:');
console.log(await p.evaluate(()=>{
  const svg=document.querySelector('.apgm svg');
  const boxes={ 'NW Bulgaria':[21.8,43.2,23.6,44.6], 'Turkish Europe':[25.8,40.5,29.2,42.2] };
  const out=[];
  svg.querySelectorAll('.apgm-rb').forEach(el=>{
    const d=el.getAttribute('d')||''; if(!d) return;
    const on=el.classList.contains('apgm-rb--on');
    const nums=d.match(/-?\d+(\.\d+)?/g)||[];
    for(const [nm,[x0,y0,x1,y1]] of Object.entries(boxes)){
      let hit=0;
      for(let i=0;i+1<nums.length;i+=2){const lo=+nums[i],la=-(+nums[i+1]);
        if(lo>=x0&&lo<=x1&&la>=y0&&la<=y1){hit++; if(hit>3)break;}}
      if(hit) out.push(nm+': '+hit+'+ pts, lit='+on);
    }
  });
  return out.length?out.join('\n  '):'  (none)';
}));
await p.evaluate(()=>document.querySelector('.apgm svg').setAttribute('viewBox','21.4 -44.9 3.4 2.2'));
await p.waitForTimeout(500); await svgH.screenshot({path:SP+'odd-bulgaria.png'});
await p.evaluate(()=>document.querySelector('.apgm svg').setAttribute('viewBox','25.4 -42.4 4.6 2.9'));
await p.waitForTimeout(500); await svgH.screenshot({path:SP+'odd-turkey.png'});
await b.close();
