import { chromium } from "playwright";
import fs from "node:fs";
const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js", "utf8");
const b = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route("**/footer.js*", (r) =>
  r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
const p = await ctx.newPage();
await p.goto("https://www.aroidpedia.com/journal/amorphophallus-dracontioides",
             { waitUntil: "networkidle", timeout: 60000 });
await p.waitForSelector(".apsc-map svg", { timeout: 30000 });
await p.waitForTimeout(3000);

const r = await p.evaluate(() => {
  const svg = document.querySelector(".apsc-map svg");
  const names = [...svg.querySelectorAll("path")]
    .map((x) => { const t = x.querySelector("title"); return t && t.textContent; })
    .filter(Boolean);
  return { count: names.length, names };
});
console.log("shapes drawn:", r.count);
// anything that looks like a sub-national unit rather than a country
const suspects = ["Texas", "California", "Florida", "Alaska", "Ontario", "Quebec",
  "Bahia", "Amazonas", "Para", "Pará", "Minas Gerais", "São Paulo", "Sao Paulo",
  "Chiapas", "Oaxaca", "Veracruz", "Queensland", "Western Australia",
  "Sarawak", "Sabah", "Luzon", "Kerala", "Karnataka", "Tak", "Uthai Thani"];
const found = suspects.filter((s) => r.names.includes(s));
console.log("sub-national names still drawn:", found.length ? found.join(", ") : "(none)");
console.log("\nfirst 60 drawn:", r.names.slice(0, 60).join(", "));
await b.close();
