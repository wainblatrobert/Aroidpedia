/* v50 render test — print the ACTUAL tooltip text for the rows the user
   objected to, and check the legend that is VISIBLE (not every string in
   the DOM: other views' keys live there too and would false-positive). */
import { chromium } from "playwright";
import fs from "fs";
import http from "http";

const BLOCK = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/ARACEAE PHYLOGENETIC TREE/ARACEAE TREE 8.26.26 v50.txt";
const html = "<!doctype html><meta charset=utf-8><body style='background:#12150f'>\n" +
             fs.readFileSync(BLOCK, "utf8");

const srv = http.createServer((rq, rs) => {
  rs.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  rs.end(html);
}).listen(8791);

const b = await chromium.launch({ channel: "chrome" });
const pg = await b.newPage({ viewport: { width: 1500, height: 1100 } });
const errs = [];
pg.on("pageerror", e => errs.push(String(e)));
await pg.goto("http://localhost:8791/", { waitUntil: "networkidle" });
await pg.waitForSelector("#ap-at .ap-at-svg g", { timeout: 30000 });

const btn = await pg.$("[data-orient='time'], button:has-text('Time')");
if (btn) { await btn.click(); await pg.waitForTimeout(1800); }

/* expand, one pass at a time with a settle between — the rows are rebuilt
   on every click, so a tight loop clicks stale nodes and never descends */
for (let pass = 0; pass < 8; pass++) {
  const n = await pg.evaluate(() => {
    const rows = [...document.querySelectorAll("#ap-at .tv-row")]
      .filter(r => /^\+/.test((r.textContent || "").trim()));
    if (!rows.length) return 0;
    rows[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    return rows.length;
  });
  await pg.waitForTimeout(500);
  if (!n) break;
}
/* then make sure Colocasieae itself is open */
for (let i = 0; i < 12; i++) {
  const done = await pg.evaluate(() => {
    const rows = [...document.querySelectorAll("#ap-at .tv-row")];
    const c = rows.find(r => (r.textContent || "").indexOf("Colocasieae") >= 0);
    if (c && /^\+/.test((c.textContent || "").trim())) {
      c.dispatchEvent(new MouseEvent("click", { bubbles: true })); return false;
    }
    const any = rows.find(r => /^\+/.test((r.textContent || "").trim()));
    if (any) { any.dispatchEvent(new MouseEvent("click", { bubbles: true })); return false; }
    return true;
  });
  await pg.waitForTimeout(450);
  if (done) break;
}

const res = await pg.evaluate(() => {
  const want = ["Colocasieae", "Alocasia", "Colocasia", "Protarum",
                "Steudnera", "Remusatia", "Ariopsis"];
  const out = [];
  document.querySelectorAll("#ap-at [data-timetip]").forEach(r => {
    const t = r.getAttribute("data-timetip") || "";
    const m = t.match(/<i>([^<]+)<\/i>/);
    const nm = m ? m[1] : "(?)";
    if (want.indexOf(nm) >= 0) out.push({ nm: nm, cls: r.getAttribute("class") || "", t: t });
  });
  return { rows: out, total: document.querySelectorAll("#ap-at .tv-row").length };
});

console.log("tv-rows drawn:", res.total);
console.log("page errors:", errs.length ? errs : "none");
console.log("\n=========== TOOLTIPS AS THE READER SEES THEM ===========");
for (const x of res.rows) {
  const cls = x.cls.replace(/tv-row ?|rank-/g, "").trim();
  console.log("\n--- " + x.nm + "   [" + cls + "]");
  console.log("    " + x.t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

/* the VISIBLE legend only */
const leg = await pg.evaluate(() => {
  const vis = el => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.display === "none" || s.visibility === "hidden" || n.hidden) return false;
    }
    return true;
  };
  const keys = [...document.querySelectorAll("#ap-at .ap-at-lg, #ap-at .ap-at-lgnote, #ap-at .ap-at-lgnote2")]
    .filter(vis).map(e => e.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
  return keys;
});
console.log("\n--- VISIBLE legend in the Time view ---");
leg.forEach(k => console.log("   * " + k));
console.log("\n   'Placement uncertain' visible?  " +
            (leg.some(k => /Placement uncertain/i.test(k)) ? "YES  <-- STILL BROKEN" : "no  (correct)"));

await pg.screenshot({ path: "v50-time.png" });
await b.close(); srv.close();
