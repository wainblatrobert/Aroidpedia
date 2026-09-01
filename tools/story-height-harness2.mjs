// Prove v111 story-plate height cap by swapping the CSS inside the HOSTED footer.js
// Needles are the ESCAPED single-line form the bundle stores (literal backslash-r-backslash-n).
import { chromium } from "playwright";

const ESC = "\\r\\n";
const OLD = [".apsc-story__plate img{", "  display:block;width:100%;height:auto;border:1px solid var(--rule);", "  background:rgba(243,241,234,.04);", "}"].join(ESC);
const NEW = [".apsc-story__plate img{", "  display:block;max-width:100%;width:auto;height:auto;", "  max-height:clamp(320px,60vh,640px);", "  margin:0 auto;border:1px solid var(--rule);", "  background:rgba(243,241,234,.04);", "}"].join(ESC);

const url = "https://www.aroidpedia.com/journal/amorphophallus-julaihii";

async function measure(swap) {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  if (swap) {
    await ctx.route("**/footer.js", async route => {
      const res = await route.fetch();
      let body = await res.text();
      const n = body.split(OLD).length - 1;
      if (n !== 1) console.log("  !! footer.js needle count =", n);
      body = body.replaceAll(OLD, NEW);
      await route.fulfill({ response: res, body });
    });
  }
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => document.querySelector(".apsc-story")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(2000);
  const out = {};
  for (const pick of ["FIELD PLATE - WONG ET AL. 2022", "FLORAL VISITORS AT THE SPADIX", "INFRUCTESCENCE WITH VISITING BEETLE"]) {
    await page.evaluate(label => {
      const b = [...document.querySelectorAll(".apsc-story__pick")].find(x => x.textContent.trim() === label);
      if (b) b.click();
    }, pick);
    await page.waitForTimeout(1500);
    out[pick] = await page.evaluate(async () => {
      const img = document.querySelector(".apsc-story__plate img");
      if (!img) return null;
      if (!img.complete) await new Promise(r => { img.onload = r; img.onerror = r; setTimeout(r, 4000); });
      const r = img.getBoundingClientRect();
      const box = img.closest(".apsc-story__plate").getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), natural: img.naturalWidth + "x" + img.naturalHeight,
               centered: Math.abs((r.left - box.left) - (box.right - r.right)) < 4 };
    });
  }
  await page.evaluate(() => document.querySelector(".apsc-story")?.scrollIntoView({ block: "center" }));
  await page.screenshot({ path: `story-${swap ? "new" : "live"}.png`, clip: await page.evaluate(() => {
    const r = document.querySelector(".apsc-story").getBoundingClientRect();
    return { x: r.x, y: Math.max(0, r.y), width: r.width, height: Math.min(1000, r.height) };
  }) });
  await browser.close();
  return out;
}

console.log("LIVE   :", JSON.stringify(await measure(false)));
console.log("SWAPPED:", JSON.stringify(await measure(true)));
