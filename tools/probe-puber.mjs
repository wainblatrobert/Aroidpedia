import { chromium } from "playwright";
import fs from "node:fs";
const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js", "utf8");
const hd = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json", "utf8");
const b = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route("**/footer.js*", (r) => r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
await ctx.route("**/shapes-hd.json*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: hd }));
const p = await ctx.newPage();
await p.goto("https://www.aroidpedia.com/journal/alocasia-brancifolia", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForSelector(".apsc-map svg", { timeout: 30000 });
await p.waitForTimeout(3500);

const r = await p.evaluate(() => {
  const svg = document.querySelector(".apsc-map svg");
  const named = [...svg.querySelectorAll("path")]
    .map((x) => { const t = x.querySelector("title"); return t && { n: t.textContent, c: x.getAttribute("class") || "" }; })
    .filter(Boolean);
  const chips = [...document.querySelectorAll(".apsc-facts .apsc-chips .apsc-chip")]
    .map((c) => ({ t: c.textContent.trim(), cls: c.className }));
  return {
    version: document.querySelector("[data-apsc-mount]").getAttribute("data-apsc-version"),
    chips,
    lit: named.filter((x) => /\bapsc-on\b/.test(x.c)).map((x) => x.n),
    ctx: named.filter((x) => /apsc-ctx/.test(x.c)).map((x) => x.n),
    base: named.filter((x) => /apsc-base/.test(x.c)).map((x) => x.n),
  };
});
console.log("version:", r.version);
console.log("\nCHIPS:", r.chips.map((c) => c.t + (/--parent/.test(c.cls) ? "[parent]" : /--continent/.test(c.cls) ? "[cont]" : "")).join(" | "));
console.log("\nLIT  :", r.lit.join(", "));
console.log("\nWASH :", r.ctx.join(", "));
const sum = ["Sumatra","South Sumatra","Riau","Jambi","West Sumatra","Bengkulu","Lampung","North Sumatra","Aceh"];
const mal = ["Peninsular Malaysia","Selangor","Pahang","Perak","Terengganu","Johor","Kedah","Kelantan","Malacca","Penang","Perlis","Negeri Sembilan"];
const jav = ["Java","West Java","Central Java","East Java","Banten","Yogyakarta","Jakarta"];
const inSet = (a) => a.filter((x) => r.base.includes(x));
console.log("\nSumatra group drawn as base :", inSet(sum).join(", ") || "(none)");
console.log("Malaysia group drawn as base:", inSet(mal).join(", ") || "(none)");
console.log("Java group drawn as base    :", inSet(jav).join(", ") || "(none)");
await b.close();
