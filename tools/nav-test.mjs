import { chromium } from 'playwright';
import fs from 'fs';
const scratch = fs.readFileSync('C:/Users/nli0490/Claude/aroidpedia-climate/footer-v16-scratch.js','utf8');

const b = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const ctx = await b.newContext();
// INTERCEPT: serve the scratch build instead of the deployed one. Nothing ships.
await ctx.route('**/Aroidpedia/footer.js', r =>
  r.fulfill({ status:200, contentType:'application/javascript', body:scratch }));
const p = await ctx.newPage();
await p.goto('https://www.aroidpedia.com/aroid-morphology',{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(2500);

const stamp = await p.evaluate(() => {
  const el=document.querySelector('[data-apsc-version]');
  return el ? el.getAttribute('data-apsc-version') : '(no card on this page)';
});
console.log('bundle under test :', stamp);

// pull the built submenu structure straight out of the DOM
const menus = await p.evaluate(() => {
  const out={};
  document.querySelectorAll('.ap-subhold, [class*="subhold"]').forEach(h=>{
    const parent=h.getAttribute('data-parent')||h.previousElementSibling?.textContent?.trim()||'?';
    out[parent]=[...h.querySelectorAll('a')].map(a=>a.getAttribute('href')+'  ::  '+a.textContent.trim());
  });
  // fallback: every nav anchor whose href is a genus guide
  if(!Object.keys(out).length){
    out['(all nav anchors)']=[...document.querySelectorAll('nav a, header a')]
      .map(a=>a.getAttribute('href')||'')
      .filter(h=>/-identification$|-morphology$/.test(h));
  }
  return out;
});
console.log(JSON.stringify(menus,null,2).slice(0,2200));
await b.close();
