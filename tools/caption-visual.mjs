/* Visual check for the new .apol-table caption rule.
 *
 * Loads the LIVE /aroid-identification page, shoots the captioned table
 * as it is today, then injects the new rule (and the shortened caption
 * text, since the live page still carries Part IV v1) and shoots it
 * again. Two files, same element, same viewport.
 *
 * /!\ channel:'chrome' - the bundled chromium composites unreliably here.
 * /!\ Runs from aroidpedia-climate; playwright is only installed there.
 */
import { chromium } from 'playwright';

const URL = 'https://www.aroidpedia.com/aroid-identification';

const NEW_CSS = `
.apol-table caption{
  caption-side:top;
  text-align:left;
  padding:19px 16px 15px;
  font-family:'Cormorant Garamond',Georgia,serif;
  font-size:16.5px;
  line-height:1.4;
  color:var(--cream);
  border-bottom:1px solid var(--rule);
}
@media (max-width:560px){
  .apol-table caption{padding:15px 13px 12px;font-size:15.5px;}
}`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1180, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 });

// the captioned table in Part IV
const wrap = page.locator('.apol-tablewrap').filter({ has: page.locator('caption') }).first();
await wrap.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);

const before = await wrap.evaluate(el => {
  const c = el.querySelector('caption');
  const cs = getComputedStyle(c);
  return {
    caption: c.textContent.trim().slice(0, 60),
    font: cs.fontFamily.split(',')[0], size: cs.fontSize,
    align: cs.textAlign, padding: cs.padding, color: cs.color,
    borderBottom: cs.borderBottomWidth
  };
});
await wrap.screenshot({ path: 'caption-BEFORE.png' });

// apply the fix, and the shortened caption the block now carries
await page.addStyleTag({ content: NEW_CSS });
await wrap.evaluate(el => {
  el.querySelector('caption').textContent = 'The same five plants, fifteen years apart';
});
await page.waitForTimeout(400);

const after = await wrap.evaluate(el => {
  const cs = getComputedStyle(el.querySelector('caption'));
  return {
    font: cs.fontFamily.split(',')[0], size: cs.fontSize,
    align: cs.textAlign, padding: cs.padding, color: cs.color,
    borderBottom: cs.borderBottomWidth
  };
});
await wrap.screenshot({ path: 'caption-AFTER.png' });

console.log('BEFORE', JSON.stringify(before, null, 2));
console.log('AFTER ', JSON.stringify(after, null, 2));
await browser.close();
