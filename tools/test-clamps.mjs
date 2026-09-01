import { chromium } from 'playwright';
const b = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await b.newPage();
await p.goto('https://www.aroidpedia.com/philodendron-morphology',{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(1200);
const sel='.ap-phmor-hero .amph-title';

// candidate clamps to try, per word
const CASES = [
  { word:'PHILODENDRON',   clamps:['clamp(1.9rem,9.6vw,2.8rem)','clamp(1.75rem,8.2vw,2.8rem)','clamp(1.75rem,8.6vw,2.8rem)'] },
  { word:'AMORPHOPHALLUS', clamps:['clamp(1.9rem,7vw,2.8rem)','clamp(1.45rem,6.8vw,2.8rem)','clamp(1.45rem,7vw,2.8rem)'] },
];
const WIDTHS=[280,320,360,390];

for (const {word,clamps} of CASES){
  console.log('\n=== '+word+' ===');
  console.log('  clamp                            '+WIDTHS.map(w=>String(w).padStart(7)).join('')+'    verdict');
  for (const cl of clamps){
    const cells=[]; let worst=0;
    for (const w of WIDTHS){
      await p.setViewportSize({width:w,height:900});
      await p.waitForTimeout(300);
      const r = await p.evaluate(([sel,cl,word])=>{
        const el=document.querySelector(sel);
        if(!el.dataset.orig) el.dataset.orig=el.textContent;
        el.textContent=word;
        el.style.setProperty('font-size',cl,'important');
        el.style.setProperty('hyphens','none','important');
        const cs=getComputedStyle(el);
        const box=el.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
        const c=document.createElement('canvas').getContext('2d');
        c.font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const ls=parseFloat(cs.letterSpacing)||0;
        const ww=c.measureText(word).width+ls*word.length;
        return {pct: ww/box*100};
      },[sel,cl,word]);
      cells.push(r.pct); worst=Math.max(worst,r.pct);
    }
    const v = worst>100 ? 'OVERFLOWS' : worst>95 ? 'tight' : 'OK';
    console.log('  '+cl.padEnd(32)+cells.map(x=>(x.toFixed(1)+'%').padStart(7)).join('')+'    '+v);
  }
}
await b.close();
