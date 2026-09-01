import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://www.aroidpedia.com/arum',{waitUntil:'networkidle',timeout:90000});
await p.waitForTimeout(6000);
console.log(JSON.stringify(await p.evaluate(() => {
  // is the footer's lightbox CSS present, and its overlay reachable?
  let cssFound = false;
  for (const sh of document.styleSheets) {
    try { for (const r of sh.cssRules) {
      if (r.selectorText && /ap-lightbox-overlay/.test(r.selectorText)) { cssFound = true; break; }
    } } catch(e) {}
    if (cssFound) break;
  }
  const figLink = document.querySelector('a.ap-fig-link');
  return {
    footerBundle: window.__apFooterBundle || null,
    lightboxCssPresent: cssFound,
    overlayInDom: !!document.getElementById('ap-lightbox-overlay'),
    imageBlockWrappers: document.querySelectorAll('.image-block-wrapper').length,
    lightboxEnabledWrappers: document.querySelectorAll('.ap-lightbox-enabled').length,
    figLinks: document.querySelectorAll('a.ap-fig-link').length,
    figLinkInsideImageBlock: figLink ? !!figLink.closest('.image-block-wrapper') : null,
    figLinkTarget: figLink ? figLink.getAttribute('target') : null,
    openOverlayGlobal: typeof window.openOverlay,
  };
}),null,1));
await br.close();
