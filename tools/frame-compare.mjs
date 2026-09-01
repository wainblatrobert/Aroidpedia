/* Render three species at three MAP_MIN_DEG values.

   The constant is patched in the SERVED bundle text, so every frame comes
   out of the real framing code rather than a viewBox I set by hand — the
   padding and aspect clamp still run, which is the whole point of
   comparing. Nothing is rebuilt and nothing is pushed. */
import { chromium } from "playwright";
import fs from "node:fs";

const BUNDLE = "C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js";
const HD = "C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json";
const OUT = "C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/5af356c8-a625-47c2-93cb-c3a053fc9fe6/scratchpad/frames";
fs.mkdirSync(OUT, { recursive: true });

const base = fs.readFileSync(BUNDLE, "utf8");
const hd = fs.readFileSync(HD, "utf8");
const NEEDLE = "MAP_MIN_DEG    : 26";
if (!base.includes(NEEDLE)) { console.error("constant not found — aborting"); process.exit(1); }

const SPECIES = [
  ["micholitziana", "https://www.aroidpedia.com/journal/alocasia-micholitziana"],
  ["aberrans",      "https://www.aroidpedia.com/journal/amorphophallus-aberrans"],
  ["dracontioides", "https://www.aroidpedia.com/journal/amorphophallus-dracontioides"],
];
const VALUES = [26, 14, 10];

const b = await chromium.launch({ channel: "chrome", headless: true });
for (const v of VALUES) {
  const js = base.replace(NEEDLE, "MAP_MIN_DEG    : " + v);
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await ctx.route("**/footer.js*", (r) => r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
  await ctx.route("**/shapes-hd.json*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: hd }));
  for (const [name, url] of SPECIES) {
    const p = await ctx.newPage();
    try {
      await p.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      await p.waitForSelector(".apsc-map svg", { timeout: 30000 });
      await p.waitForTimeout(3000);
      const vb = await p.evaluate(() => document.querySelector(".apsc-map svg").getAttribute("viewBox"));
      await p.locator(".apsc-map").first().screenshot({ path: `${OUT}/${name}-${v}.png` });
      console.log(`${name} @ ${v}: viewBox ${vb}`);
    } catch (e) {
      console.log(`${name} @ ${v}: FAILED ${e.message.split("\n")[0]}`);
    }
    await p.close();
  }
  await ctx.close();
}
await b.close();
console.log("\nframes in " + OUT);
