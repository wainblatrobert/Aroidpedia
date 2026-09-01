// Prove v111 story-plate height cap on the LIVE julaihii page via HTML swap
import { chromium } from "playwright";

const OLD = `.apsc-story__plate img{
  display:block;width:100%;height:auto;border:1px solid var(--rule);
  background:rgba(243,241,234,.04);
}`;
const NEW = `.apsc-story__plate img{
  display:block;max-width:100%;width:auto;height:auto;
  max-height:clamp(320px,60vh,640px);
  margin:0 auto;border:1px solid var(--rule);
  background:rgba(243,241,234,.04);
}`;

const url = "https://www.aroidpedia.com/journal/amorphophallus-julaihii";

async function measure(swap) {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  if (swap) {
    await ctx.route("**/journal/amorphophallus-julaihii*", async route => {
      const res = await route.fetch();
      let body = await res.text();
      const n = body.split(OLD).length - 1;
      if (n !== 1) console.log("  !! needle count =", n);
      body = body.replace(OLD, NEW);
      await route.fulfill({ response: res, body });
    });
  }
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);
  const out = {};
  for (const pick of ["FIELD PLATE - WONG ET AL. 2022", "FLORAL VISITORS AT THE SPADIX"]) {
    await page.evaluate(label => {
      const b = [...document.querySelectorAll(".apsc-story__pick")].find(x => x.textContent.trim() === label);
      if (b) b.click();
    }, pick);
    await page.waitForTimeout(1200);
    out[pick] = await page.evaluate(() => {
      const img = document.querySelector(".apsc-story__plate img");
      if (!img) return null;
      const r = img.getBoundingClientRect();
      const box = img.closest(".apsc-story__plate").getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height),
               centered: Math.abs((r.left - box.left) - (box.right - r.right)) < 4,
               file: img.src.split("/").pop() };
    });
  }
  await browser.close();
  return out;
}

console.log("LIVE (v128, no swap):", JSON.stringify(await measure(false)));
console.log("SWAPPED (v129 css):  ", JSON.stringify(await measure(true)));
