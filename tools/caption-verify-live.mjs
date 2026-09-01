/* Verify the caption fix as the site actually serves it.
 *
 * /!\ NOTHING IS INJECTED HERE. The earlier harness injected the rule to
 * preview it; this one must not, or it proves nothing about what is live.
 * It asserts the rule arrived via a stylesheet, not a page style tag.
 *
 * Desktop and mobile, because the rule has a <=560px branch.
 */
import { chromium } from 'playwright';

const URL = 'https://www.aroidpedia.com/aroid-identification?cb=' + Date.now();

const browser = await chromium.launch({ channel: 'chrome' });

for (const [name, vp] of [['desktop', { width: 1180, height: 900 }],
                          ['mobile',  { width: 375,  height: 800 }]]) {
  const page = await browser.newPage({ viewport: vp });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 });

  const wrap = page.locator('.apol-tablewrap')
    .filter({ has: page.locator('caption') }).first();
  await wrap.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);

  const got = await wrap.evaluate(el => {
    const c = el.querySelector('caption');
    const cs = getComputedStyle(c);
    // where did the rule come from? a page <style> would mean injection.
    let fromSheet = false;
    for (const s of document.styleSheets) {
      let rules; try { rules = s.cssRules; } catch { continue; }
      for (const r of rules || []) {
        if (r.selectorText && r.selectorText.includes('.apol-table caption')) {
          fromSheet = true;
        }
        if (r.cssRules) for (const rr of r.cssRules) {
          if (rr.selectorText && rr.selectorText.includes('.apol-table caption')) fromSheet = true;
        }
      }
    }
    return {
      text: c.textContent.trim(),
      font: cs.fontFamily.split(',')[0],
      size: cs.fontSize, align: cs.textAlign,
      padding: cs.padding, borderBottom: cs.borderBottomWidth,
      color: cs.color,
      inlineStyleTags: document.querySelectorAll('style[data-injected]').length,
      ruleFromStylesheet: fromSheet
    };
  });

  console.log(name.toUpperCase(), JSON.stringify(got, null, 2));
  await wrap.screenshot({ path: `caption-LIVE-${name}.png` });
  await page.close();
}

await browser.close();
