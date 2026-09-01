import { chromium } from 'playwright';
const b = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await b.newPage();
await p.goto('https://www.aroidpedia.com/philodendron-morphology',{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(1200);
const r = await p.evaluate(() => {
  const t = document.body.innerText;
  return {
    hasClamp:    t.includes('9.6vw') || t.includes('clamp('),
    hasMeasured: t.includes('Measured live'),
    hasFloor:    t.includes('THE MOBILE CLAMP'),
    styleTags:   document.querySelectorAll('style').length,
    // and the thing that actually matters:
    heroFont:    getComputedStyle(document.querySelector('.ap-phmor-hero .amph-title')).fontSize,
  };
});
console.log('  build-note text visible on page :', r.hasMeasured || r.hasFloor || r.hasClamp);
console.log('     "Measured live"              :', r.hasMeasured);
console.log('     "THE MOBILE CLAMP"           :', r.hasFloor);
console.log('     any "clamp(" / "9.6vw"       :', r.hasClamp);
console.log('  <style> tags on page            :', r.styleTags);

// the real test: does the title still overflow at 280?
console.log('\n  === overflow re-test on the LIVE page ===');
for (const w of [280,320,360]) {
  await p.setViewportSize({width:w,height:900});
  await p.waitForTimeout(350);
  const m = await p.evaluate(() => {
    const el=document.querySelector('.ap-phmor-hero .amph-title');
    const cs=getComputedStyle(el);
    const box=el.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
    const c=document.createElement('canvas').getContext('2d');
    c.font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const ls=parseFloat(cs.letterSpacing)||0;
    let worst=0,word='';
    for(const t of el.textContent.trim().split(/\s+/)){
      const ww=c.measureText(t).width+ls*t.length;
      if(ww>worst){worst=ww;word=t;}
    }
    return {fs:cs.fontSize, pct:worst/box*100, word};
  });
  console.log(`    ${w}px  font ${m.fs.padStart(7)}  ${m.word}  ${m.pct.toFixed(1)}%  ${m.pct>100?'OVERFLOW':'ok'}`);
}
await b.close();
