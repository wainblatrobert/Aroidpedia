/* Do the bisexual/unisexual plates actually RENDER?

The plate is injected by a JS component (.apxf) whose config names the file
in a <script> block, not an <img src>. Every static scan therefore misses
it, and a substring test on the HTML says "present" whether or not the
component ever paints. Only a browser settles it. */
import { chromium } from "playwright";

const PAGES = [
  ["/spathiphyllum-reproduction", "bisexual"],
  ["/arum-reproduction", "unisexual"],
  ["/anthurium-reproduction", "bisexual"],
  ["/monstera-reproduction", "bisexual"],
  ["/amorphophallus-reproduction", "unisexual"],
  ["/philodendron-reproduction", "unisexual"],
  ["/arisaema-reproduction", "unisexual"],
  ["/aroid-reproduction", "both"],
];

const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1400, height: 1000 } });

console.log("%s %-12s %-7s %-9s %s".replace(/%s/g, "%s"));
console.log("PAGE                          expect   .apxf  img in DOM  painted  natural size");
console.log("-".repeat(88));

for (const [url, expect] of PAGES) {
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", e => errs.push(String(e).slice(0, 60)));
  try {
    await pg.goto("https://www.aroidpedia.com" + url,
                  { waitUntil: "domcontentloaded", timeout: 60000 });
    await pg.waitForTimeout(5000);
    // scroll the whole page so lazy work has a chance
    await pg.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 900) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await pg.waitForTimeout(2500);
    const r = await pg.evaluate(() => {
      const host = document.querySelectorAll(".apxf");
      const imgs = [...document.querySelectorAll(".apxf img, .apxf-stage img")];
      return {
        hosts: host.length,
        imgs: imgs.length,
        detail: imgs.map(i => {
          const rect = i.getBoundingClientRect();
          return { src: (i.currentSrc || i.src || "").split("/").pop(),
                   nat: i.naturalWidth + "x" + i.naturalHeight,
                   box: Math.round(rect.width) + "x" + Math.round(rect.height),
                   complete: i.complete };
        })
      };
    });
    const d = r.detail[0];
    console.log("%-29s %-8s %-6d %-11d %-8s %s",
      url, expect, r.hosts, r.imgs,
      d ? (d.complete && d.nat !== "0x0" ? "yes" : "NO") : "-",
      d ? d.nat + "  " + d.src : "(no img)");
    if (errs.length) console.log("      page errors: " + errs.slice(0, 2).join(" | "));
  } catch (e) {
    console.log("%-29s ERROR %s", url, String(e).slice(0, 60));
  }
  await pg.close();
}
await b.close();
