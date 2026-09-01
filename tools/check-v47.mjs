import { chromium } from 'playwright';
const BS = String.fromCharCode(92);                       // backslash, unmangleable
const NEW = 'ap-at-fine">K' + BS + 'u00f6ppen mix of each POWO';
const OLD = 'ap-at-fine">K' + BS + 'u00f6ppen class of each POWO';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.goto('https://www.aroidpedia.com/aroid-phylogeny',
                { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
const html = await page.content();
const newCode = html.includes(NEW);
const oldCode = html.includes(OLD);
console.log('v47 CODE line present :', newCode);
console.log('v46 CODE line present :', oldCode);
console.log('verdict               :', newCode && !oldCode ? 'V47 IS LIVE' : 'NOT CONFIRMED');
await browser.close();
process.exit(newCode && !oldCode ? 0 : 1);
