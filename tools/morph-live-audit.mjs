/* What the five morphology pages ACTUALLY show right now, read off the live
   site — heading order, part numbers, and the hub's genus-card states.
   Nothing here is copied from the handoff; it is all measured. */
import { chromium } from "playwright";

const PAGES = [
  ["/aroid-morphology",     "HUB"],
  ["/alocasia-morphology",  "ALOCASIA"],
  ["/anthurium-morphology", "ANTHURIUM"],
  ["/monstera-morphology",  "MONSTERA"],
  ["/philodendron-morphology", "PHILODENDRON"]
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
const page = await ctx.newPage();

for (const [slug, label] of PAGES) {
  await page.goto("https://www.aroidpedia.com" + slug, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(3500);
  const out = await page.evaluate(() => {
    const heads = [...document.querySelectorAll("h1, h2")]
      .map(h => ({ tag: h.tagName, id: h.id || "", text: h.textContent.trim().replace(/\s+/g, " ").slice(0, 90) }))
      .filter(h => h.text);
    const live = [...document.querySelectorAll("a.apoh-card--live")]
      .map(a => (a.textContent.trim().split("\n")[0] || "").trim().slice(0, 40) + "  ->  " + a.getAttribute("href"));
    const soon = [...document.querySelectorAll(".apoh-card--soon")]
      .map(d => (d.textContent.trim().split("\n")[0] || "").trim().slice(0, 40));
    return { heads, live, soon };
  });
  console.log("\n================ " + label + "  " + slug);
  out.heads.forEach(h => console.log("   " + h.tag + "  " + (h.id ? "#" + h.id + "  " : "") + h.text));
  if (out.live.length || out.soon.length) {
    console.log("   --- genus cards: " + out.live.length + " live, " + out.soon.length + " in preparation");
    out.live.forEach(l => console.log("       LIVE  " + l));
    console.log("       SOON  " + out.soon.join(", "));
  }
}

await browser.close();
