import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
await p.goto('https://www.aroidpedia.com/arum',{waitUntil:'networkidle',timeout:90000});
await p.waitForTimeout(9000);
const r = await p.evaluate(() => {
  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  const c=q('.ap-genus-counter');
  const axg=q('[data-axg-header]');
  return {
    title: document.title,
    // 1 header injection
    rosterRows: window.AP && AP.GENERA ? Object.keys(AP.GENERA).length : null,
    apGenus: window.AP ? AP.genus : null,
    ascend: window.AP && AP.assets ? AP.assets.ascend : null,
    eyebrow: q('.ap-gh-eyebrow') ? q('.ap-gh-eyebrow').textContent.trim() : null,
    // 2 hero
    heroV: q('.ap-genus-hero') ? q('.ap-genus-hero').getAttribute('data-gh-version') : null,
    stats: c ? qa('.ap-gc-stat').map(s=>{const n=s.querySelector('.ap-gc-num');
            return n.dataset.key+'='+n.textContent+(s.classList.contains('ap-gc-stat--link')?'*':'');}) : null,
    statsAuto: c ? c.getAttribute('data-stats-auto') : null,
    audioName: q('.ap-gh-audio-name') ? q('.ap-gh-audio-name').textContent : null,
    // 3 section header
    axgV: axg ? axg.getAttribute('data-axg-version') : null,
    axgVia: axg ? axg.getAttribute('data-axg-via') : null,
    timelineHeading: axg ? axg.querySelector('.ax-heading').innerText.trim() : null,
    // 4 intro
    introV: q('.ap-genus') ? q('.ap-genus').getAttribute('data-version') : null,
    commonNames: qa('.ap-syn-list--names .ap-syn-item').length,
    regions: qa('.ap-region').length,
    climate: q('#ap-genus-clim') ? q('#ap-genus-clim').getAttribute('data-apclim-data') : null,
    // 5 morph
    morphV: q('.ap-morph') ? q('.ap-morph').getAttribute('data-ap-version') : null,
    tabs: qa('.ap-tab').length,
    nofig: qa('.ap-panel.is-nofig').length,
    // timeline + biblio
    timelineMilestones: qa('#timeline svg path').length,
    biblioHeading: q('#apx-biblio .apx-head h2, #apx-biblio .apx-head h3')
                   ? q('#apx-biblio .apx-head h2, #apx-biblio .apx-head h3').textContent.trim() : null,
    alocasiaMentions: document.body.innerText.match(/Alocasia/g)?.length || 0,
  };
});
console.log(JSON.stringify(r,null,1));
console.log('\npage errors:', errs.length ? errs : '(none)');
await br.close();
