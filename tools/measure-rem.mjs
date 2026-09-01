import { chromium } from 'playwright';
const b = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await b.newPage();
await p.goto('https://www.aroidpedia.com/philodendron-morphology',{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(1200);
console.log('  vw    root-rem   1.9rem    9.6vw    8.2vw    which wins');
console.log('  ----  ---------  --------  -------  -------  ----------');
for (const w of [280,320,360,390,412,767]) {
  await p.setViewportSize({width:w,height:900});
  await p.waitForTimeout(350);
  const rem = await p.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).fontSize));
  const min=1.9*rem, v96=w*.096, v82=w*.082;
  const win = min>v96 ? '1.9rem FLOOR' : '9.6vw';
  console.log(`  ${String(w).padEnd(4)}  ${rem.toFixed(2).padStart(9)}  ${min.toFixed(2).padStart(8)}  ${v96.toFixed(2).padStart(7)}  ${v82.toFixed(2).padStart(7)}  ${win}`);
}
await b.close();
