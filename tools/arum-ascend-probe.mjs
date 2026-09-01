import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
for (const url of ['https://www.aroidpedia.com/arum','https://www.aroidpedia.com/alocasia']) {
  await p.goto(url, { waitUntil:'networkidle', timeout:60000 });
  await p.waitForTimeout(2500);
  console.log('\n=== ' + url);
  console.log(JSON.stringify(await p.evaluate(() => {
    const AP = window.AP || {};
    const eb = document.querySelector('.ap-gh-eyebrow, [class*="eyebrow"], .ap-gh-ascend');
    return {
      path: location.pathname,
      apPresent: !!window.AP,
      apGenus: AP.genus === undefined ? '(undefined)' : AP.genus,
      apAssets: AP.assets ? Object.keys(AP.assets) : null,
      ascend: AP.assets && AP.assets.ascend ? AP.assets.ascend : null,
      rosterKeys: AP.GENERA ? Object.keys(AP.GENERA) : null,
      hasArumRow: AP.GENERA ? !!AP.GENERA['arum'] : null,
      eyebrowEl: eb ? eb.className : null,
      eyebrowText: eb ? eb.textContent.trim() : null,
      heroTitle: (document.querySelector('.ap-gh-title') || {}).textContent || null,
    };
  }), null, 1));
}
await br.close();
