/* NAV v137 — mobile. bindMobile() builds its rows separately from
   bindDesktop() and sets textContent, so a row added to SUBNAV has to be
   confirmed on this path too, not inferred from the desktop pass. */
import { chromium } from "playwright";
import fs from "fs";

const js = fs.readFileSync("C:/Users/nli0490/Claude/aroidpedia-climate/footer-v16-scratch.js", "utf8");
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
  userAgent: "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36"
});
await ctx.route("**/footer.js*", r =>
  r.fulfill({ status: 200, contentType: "application/javascript", body: js }));

const pg = await ctx.newPage();
const errs = [];
pg.on("pageerror", e => errs.push(String(e)));
await pg.goto("https://www.aroidpedia.com/aroid-morphology", { waitUntil: "domcontentloaded", timeout: 60000 });
await pg.waitForTimeout(6000);
console.log("bundle stamp:", await pg.evaluate(() => window.__apFooterBundle || "(none)"));

/* open the burger — pick the one that is actually visible */
const opened = await pg.evaluate(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const cands = [...document.querySelectorAll(
    ".header-burger-btn, .header-menu-icon, .burger, [class*='burger'], [aria-label*='menu' i], button")];
  const vis = cands.filter(e => {
    const r = e.getBoundingClientRect();
    const s2 = getComputedStyle(e);
    return r.width > 8 && r.height > 8 && s2.display !== 'none' && s2.visibility !== 'hidden';
  });
  if (!vis.length) return { ok:false, tried: cands.length };
  vis[0].click();
  await sleep(1400);
  const menu = document.querySelector('.header-menu');
  return { ok:true, clicked: (vis[0].className||'').toString().slice(0,50),
           menuOpen: !!menu && getComputedStyle(menu).display !== 'none' };
});
console.log('burger:', JSON.stringify(opened));
await pg.waitForTimeout(800);

const out = await pg.evaluate(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const menu = document.querySelector(".header-menu") || document;
  /* step into any folder that contains the morphology row */
  for (let i = 0; i < 4; i++) {
    const f = [...menu.querySelectorAll("a,button")]
      .find(e => /morpholog/i.test(e.textContent || "") &&
                 (e.getAttribute("href") || "") !== "/aroid-morphology");
    const hub = [...menu.querySelectorAll("a")]
      .find(a => (a.getAttribute("href") || "") === "/aroid-morphology");
    if (hub) break;
    if (f) { f.click(); await sleep(700); } else break;
  }
  await sleep(600);
  const mob = [...document.querySelectorAll(".ap-subnav-mobile, .ap-subnav-mobile--group, [class*='ap-subnav-mobile']")];
  const links = [...document.querySelectorAll("a")]
    .filter(a => /-morphology$/.test(a.getAttribute("href") || ""))
    .map(a => ({ t: a.textContent.replace(/\s+/g, " ").trim().slice(0, 34),
                 h: a.getAttribute("href"),
                 cls: (a.className || "").toString().slice(0, 40) }));
  return { mobileNodes: mob.length, links: links };
});

console.log("\n=== mobile: every *-morphology link in the open menu ===");
out.links.forEach(l => console.log("   " + l.t.padEnd(34) + " -> " + l.h));
const want = ["/alocasia-morphology", "/anthurium-morphology",
              "/monstera-morphology", "/philodendron-morphology"];
const got = out.links.map(l => l.h);
console.log("\n   all four present:",
  want.every(w => got.includes(w)) ? "YES" : "NO — missing " + want.filter(w => !got.includes(w)));
console.log("   errors:", errs.length ? errs.slice(0, 3) : "none");
await pg.screenshot({ path: "nav-v137-mobile.png", fullPage: false });
await b.close();
