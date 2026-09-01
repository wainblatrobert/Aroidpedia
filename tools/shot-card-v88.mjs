import { chromium } from "playwright";
import fs from "node:fs";
const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js", "utf8");
const OUT = "C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/5af356c8-a625-47c2-93cb-c3a053fc9fe6/scratchpad";

const b = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await ctx.route("**/footer.js*", (r) =>
  r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
const p = await ctx.newPage();
await p.goto("https://www.aroidpedia.com/journal/amorphophallus-aberrans",
             { waitUntil: "networkidle", timeout: 60000 });
await p.waitForSelector(".apsc-map svg", { timeout: 30000 });
await p.waitForTimeout(3000);

await p.locator(".apsc-map").first().screenshot({ path: OUT + "/v88-map.png" });
console.log("map + zoom UI -> v88-map.png");

// pinned state, for the chip order
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
await p.waitForTimeout(1200);
const follow = p.locator(".apsc-facts--follow").first();
await follow.screenshot({ path: OUT + "/v88-pinned.png" });
console.log("pinned rail -> v88-pinned.png");

// a Nigerian species — the case in the user's screenshot
await p.goto("https://www.aroidpedia.com/journal/amorphophallus-dracontioides",
             { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
await p.waitForTimeout(3000);
const m2 = p.locator(".apsc-map").first();
if (await m2.count()) {
  await p.locator(".apsc-map__zoomui .apsc-map__zoom").first().click().catch(() => {});
  await p.waitForTimeout(400);
  await m2.screenshot({ path: OUT + "/v88-africa-world.png" });
  console.log("African species, World view -> v88-africa-world.png");
}
await b.close();
