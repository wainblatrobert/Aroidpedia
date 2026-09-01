import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
await p.goto('https://www.aroidpedia.com/arum',{waitUntil:'networkidle',timeout:90000});
await p.waitForTimeout(6000);
// open each morphology tab so every panel gets measured
const r = await p.evaluate(async () => {
  const out = [];
  const tabs = [...document.querySelectorAll('.ap-tab')].slice(0,4);
  for (const t of tabs) {
    t.click();
    await new Promise(r=>setTimeout(r,350));
    const panel = document.querySelector('.ap-panel.is-active');
    const img = panel.querySelector('.ap-fig');
    out.push({
      tab: t.textContent.trim(),
      nofig: panel.classList.contains('is-nofig'),
      img: img ? img.getAttribute('src').split('/').pop() : null,
      loaded: img ? (img.complete && img.naturalWidth > 0) : null,
      natural: img ? img.naturalWidth + 'x' + img.naturalHeight : null,
      figVisible: panel.querySelector('.ap-fig-wrap') ? !!panel.querySelector('.ap-fig-wrap').offsetParent : null,
      caption: panel.querySelector('.ap-fig-cap') ? panel.querySelector('.ap-fig-cap').textContent : null,
    });
  }
  return { panels: out, stillNofig: document.querySelectorAll('.ap-panel.is-nofig').length };
});
console.log(JSON.stringify(r,null,1));
console.log('page errors:', errs.length ? errs : '(none)');
await br.close();
