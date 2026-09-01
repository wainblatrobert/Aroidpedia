/* v93 part two:
   - the auto country pill (beccarii tags Sarawak, never Malaysia)
   - the doubtful rule (sarawakensis tags "Kalimantan?" — its provinces
     must NOT open, while Sarawak still opens Borneo)
   - the Borneo wash, the case the OLD code's own comment says broke it */
import { chromium } from "playwright";
import fs from "node:fs";
const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js", "utf8");
const hd = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json", "utf8");
const pass = [], fail = [];
const ok = (c, m) => (c ? pass : fail).push(m);

const b = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route("**/footer.js*", (r) => r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
await ctx.route("**/shapes-hd.json*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: hd }));

async function look(slug) {
  const p = await ctx.newPage();
  await p.goto("https://www.aroidpedia.com/journal/" + slug, { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForSelector(".apsc-map svg", { timeout: 30000 });
  await p.waitForTimeout(3500);
  const r = await p.evaluate(() => {
    const svg = document.querySelector(".apsc-map svg");
    const named = [...svg.querySelectorAll("path")]
      .map((x) => { const t = x.querySelector("title"); return t && { n: t.textContent, c: x.getAttribute("class") || "" }; })
      .filter(Boolean);
    return {
      v: document.querySelector("[data-apsc-mount]").getAttribute("data-apsc-version"),
      lit: named.filter((x) => /\bapsc-on\b/.test(x.c)).map((x) => x.n),
      doubt: named.filter((x) => /apsc-on--doubtful/.test(x.c)).map((x) => x.n),
      ctx: named.filter((x) => /apsc-ctx/.test(x.c)).map((x) => x.n),
      base: named.filter((x) => /apsc-base/.test(x.c)).map((x) => x.n),
      chips: [...document.querySelectorAll(".apsc-facts--follow .apsc-chips .apsc-chip")]
        .map((c) => ({ t: c.textContent.trim(), parent: /--parent/.test(c.className), title: c.getAttribute("title") || "" })),
    };
  });
  await p.close();
  return r;
}

/* ---- the auto country pill ---- */
const bec = await look("alocasia-beccarii");
console.log("  beccarii chips:", bec.chips.map((c) => c.t + (c.parent ? "[p]" : "")).join(" | "));
const mal = bec.chips.find((c) => c.t === "Malaysia");
ok(!!mal, `beccarii: Malaysia pill present though never tagged`);
ok(!!mal && /not tagged on this post/.test(mal.title), `beccarii: pill titled honestly — "${mal ? mal.title : ""}"`);

/* ---- sarawakensis: Borneo wash + the doubtful rule ---- */
const sar = await look("alocasia-sarawakensis");
console.log("  sarawakensis lit:", sar.lit.join(", "));
console.log("  sarawakensis doubtful:", sar.doubt.join(", ") || "(none)");
console.log("  sarawakensis wash:", sar.ctx.join(", "));
ok(sar.ctx.includes("Borneo"), `sarawakensis: washes Borneo`);
ok(!sar.ctx.includes("Malaysia") && !sar.ctx.includes("Indonesia"),
   `sarawakensis: does NOT wash Malaysia/Indonesia — the case that broke the old rule`);
const kalKids = ["East Kalimantan", "South Kalimantan", "Central Kalimantan", "West Kalimantan", "North Kalimantan"]
  .filter((n) => sar.base.includes(n) || sar.lit.includes(n));
ok(kalKids.length === 0,
   `doubtful Kalimantan does not open its provinces${kalKids.length ? " — OPENED: " + kalKids.join(", ") : ""}`);
const borneoKids = ["Sarawak", "Sabah", "Kalimantan", "Brunei"].filter((n) => sar.base.includes(n) || sar.lit.includes(n));
ok(borneoKids.length > 0, `Borneo still opens via the firm records: ${borneoKids.join(", ")}`);

await b.close();
console.log("\nPASS " + pass.length + " / FAIL " + fail.length);
pass.forEach((x) => console.log("  ok   " + x));
fail.forEach((x) => console.log("  FAIL " + x));
process.exit(fail.length ? 1 : 0);
