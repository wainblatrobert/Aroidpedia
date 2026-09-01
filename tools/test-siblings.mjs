/* v90: Alocasia micholitziana — lit Luzon provinces should sit inside a
   Luzon that still shows its OTHER provinces, while Mindanao's and every
   unrelated country's stay hidden. */
import { chromium } from "playwright";
import fs from "node:fs";
const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js", "utf8");
const hd = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json", "utf8");
const pass = [], fail = [];
const ok = (c, m) => (c ? pass : fail).push(m);

const b = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await ctx.route("**/footer.js*", (r) => r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
await ctx.route("**/shapes-hd.json*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: hd }));
const p = await ctx.newPage();
await p.goto("https://www.aroidpedia.com/journal/alocasia-micholitziana",
             { waitUntil: "networkidle", timeout: 60000 });
await p.waitForSelector(".apsc-map svg", { timeout: 30000 });
await p.waitForTimeout(3500);

ok(await p.getAttribute("[data-apsc-mount]", "data-apsc-version") === "card-v99-file-v117",
   "version under test = card-v99-file-v117");

const m = await p.evaluate(() => {
  const svg = document.querySelector(".apsc-map svg");
  const named = [...svg.querySelectorAll("path")]
    .map((x) => { const t = x.querySelector("title"); return t && { n: t.textContent, c: x.getAttribute("class") || "" }; })
    .filter(Boolean);
  return {
    total: named.length,
    lit: named.filter((x) => /\bapsc-on\b/.test(x.c)).map((x) => x.n),
    ctx: named.filter((x) => /apsc-ctx/.test(x.c)).map((x) => x.n),
    base: named.filter((x) => /apsc-base/.test(x.c)).map((x) => x.n),
    names: named.map((x) => x.n),
  };
});
ok(m.total > 0, `shapes drawn = ${m.total}`);
console.log("   lit:", m.lit.join(", "));
console.log("   ctx:", m.ctx.join(", "));

// other Luzon provinces must be back
const luzonSibs = ["Cagayan", "Isabela", "Nueva Ecija", "Pangasinan", "Bulacan",
                   "Batangas", "Quezon", "Bataan", "Zambales", "Tarlac"]
  .filter((n) => m.names.includes(n));
ok(luzonSibs.length >= 4, `other Luzon provinces drawn: ${luzonSibs.length} (${luzonSibs.slice(0,6).join(", ")})`);

// elsewhere in the Philippines must stay hidden
const elsewhere = ["Davao del Sur", "Bukidnon", "Lanao del Norte", "Cebu",
                   "Bohol", "Negros Occidental", "Zamboanga del Sur"]
  .filter((n) => m.names.includes(n));
ok(elsewhere.length === 0, `non-Luzon provinces hidden${elsewhere.length ? " — LEAKED: " + elsewhere.join(", ") : ""}`);

// and unrelated countries stay clean
const foreign = ["Tak", "Uthai Thani", "Kerala", "Texas", "Ontario", "Yakutiya", "Sarawak"]
  .filter((n) => m.names.includes(n));
ok(foreign.length === 0, `unrelated subunits hidden${foreign.length ? " — LEAKED: " + foreign.join(", ") : ""}`);

await p.locator(".apsc-map").first().screenshot({
  path: "C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0684-Claude/x.png"
      .replace("C--Users-nli0684-Claude/x.png",
               "C--Users-nli0490-Claude/5af356c8-a625-47c2-93cb-c3a053fc9fe6/scratchpad/v90-luzon.png") });
await b.close();
console.log("\nPASS " + pass.length + " / FAIL " + fail.length);
pass.forEach((x) => console.log("  ok   " + x));
fail.forEach((x) => console.log("  FAIL " + x));
process.exit(fail.length ? 1 : 0);
