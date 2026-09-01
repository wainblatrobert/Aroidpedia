/* preview only: swap the climate image for a regional raster and zoom in */
import { chromium } from 'playwright';
import fs from 'fs';
const SP='C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const LEVELS=[['L0','reg-java-L0.png','0.0278° · wte_004 · SHIPPED'],
              ['L1','reg-java-L1.png','0.0139° · WTE 10x'],
              ['L2','reg-java-L2.png','0.0069° · WTE 10x']];
const BOX={x:105,y:5,w:11,h:4};                 /* lon 105..116, lat -9..-5 */
const VIEW='106.5 5.6 9.2 3.1';
const b=await chromium.launch({channel:'chrome',headless:true});
const p=await b.newPage({viewport:{width:1500,height:620},deviceScaleFactor:2});
await p.goto('https://www.aroidpedia.com/alocasia',{waitUntil:'networkidle',timeout:120000});
await p.waitForTimeout(13000);
const svgH=await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.click('.apgm__climbtn'); await p.waitForTimeout(6000);
for (const [tag,file,label] of LEVELS){
  const b64=fs.readFileSync(file).toString('base64');
  await p.evaluate(([d,box])=>{
    const svg=document.querySelector('.apgm svg');
    const img=svg.querySelector('.apgm-clim-img');
    img.setAttribute('href','data:image/png;base64,'+d);
    img.setAttributeNS('http://www.w3.org/1999/xlink','href','data:image/png;base64,'+d);
    img.setAttribute('x',box.x); img.setAttribute('y',box.y);
    img.setAttribute('width',box.w); img.setAttribute('height',box.h);
  },[b64,BOX]);
  await p.evaluate(v=>document.querySelector('.apgm svg').setAttribute('viewBox',v), VIEW);
  await p.waitForTimeout(700);
  await svgH.screenshot({path:SP+'detail-java-'+tag+'.png'});
  console.log('captured', tag, label);
}
await b.close();
