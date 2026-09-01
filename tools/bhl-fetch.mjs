// BHL fetch harness (Cloudflare-aware, polite).
// usage: node bhl-fetch.mjs <jobs.json>
// jobs.json: { "jobs": [ { "url": "...", "out": "C:/abs/path", "type": "html"|"binary" } ] }
// Persistent profile keeps the cf_clearance cookie across runs.
import { chromium } from 'playwright';
import fs from 'fs';

const jobsFile = process.argv[2];
const { jobs } = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));

const ctx = await chromium.launchPersistentContext(
  'C:/Users/nli0490/AppData/Local/Temp/bhl-profile',
  { channel: 'chrome', headless: false,
    args: ['--window-position=-32000,-32000', '--disable-blink-features=AutomationControlled'],
    ignoreDefaultArgs: ['--enable-automation'],
    viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
});
const page = ctx.pages()[0] ?? await ctx.newPage();

async function challengeCleared(maxSec) {
  for (let i = 0; i < maxSec; i++) {
    const t = await page.title();
    if (!/just a moment/i.test(t)) return true;
    await page.waitForTimeout(1000);
  }
  return false;
}

// warm-up
await page.goto('https://www.biodiversitylibrary.org/', { waitUntil: 'domcontentloaded', timeout: 60000 });
const warm = await challengeCleared(45);
console.log('warmup:', warm ? 'cleared' : 'STILL CHALLENGED', '| title:', await page.title());
if (!warm) { await ctx.close(); process.exit(3); }

let ok = 0, fail = 0;
for (const j of jobs) {
  try {
    if (j.type === 'binary') {
      const r = await page.request.get(j.url, { timeout: 120000 });
      if (r.status() !== 200) throw new Error('HTTP ' + r.status());
      fs.writeFileSync(j.out, Buffer.from(await r.body()));
    } else {
      await page.goto(j.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await challengeCleared(30);
      fs.writeFileSync(j.out, await page.content());
    }
    ok++; console.log('OK', j.url);
  } catch (e) {
    fail++; console.log('FAIL', j.url, '-', e.message.split('\n')[0]);
  }
  await page.waitForTimeout(500);
}
console.log(`done: ${ok} ok, ${fail} failed`);
await ctx.close();
