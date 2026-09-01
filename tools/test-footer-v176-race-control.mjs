/* CONTROL for the v176 ap-subhold guard.
   Same bundle, same race, but with the guard PATCHED BACK OUT in memory —
   so this proves the bug the guard fixes was real and not theoretical.
   Expected: the unconditional version LOSES ap-subhold; v176 keeps it. */
import { chromium } from "playwright";
import fs from "fs";

const BUNDLE = "C:/Users/nli0490/Claude/aroidpedia-climate/footer-v16-scratch.js";
const fixed = fs.readFileSync(BUNDLE, "utf8");

const GUARD = 'if (!item.querySelector(".ap-subnav.ap-sub-open")) {\r\n        item.classList.remove("ap-subhold");\r\n      }';
const GUARD_LF = GUARD.replace(/\r\n/g, "\n");
let broken = null;
for (const g of [GUARD, GUARD_LF]) {
  if (fixed.indexOf(g) >= 0) { broken = fixed.replace(g, 'item.classList.remove("ap-subhold");'); break; }
}
if (!broken) { console.error("ABORT: guard text not found in the built bundle"); process.exit(2); }
console.log("patched the guard out (bundle " + fixed.length + " -> " + broken.length + " chars)\n");

async function race(js, label) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route("**/footer.js*", r =>
    r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
  const page = await ctx.newPage();
  await page.goto("https://www.aroidpedia.com/aroid-morphology",
                  { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4500);

  const title = page.locator(".header-display-desktop .header-nav-folder-title", { hasText: "THE AROID GUIDE" }).first();
  await title.hover();
  await page.waitForTimeout(300);
  await page.locator('.header-display-desktop .header-nav-folder-content a[href="/aroid-morphology"]').first().hover();
  await page.waitForTimeout(500);
  await page.locator('.header-display-desktop .header-nav-folder-content a[href="/aroid-reproduction"]').first().hover();
  await page.waitForTimeout(700);          /* > CLOSE_MS 260 */

  const r = await page.evaluate(() => {
    const item = document.querySelector('.header-display-desktop .header-nav-folder-content a[href="/aroid-reproduction"]').closest(".header-nav-item--folder");
    return {
      hold: item.classList.contains("ap-subhold"),
      openFlyouts: item.querySelectorAll(".ap-subnav.ap-sub-open").length
    };
  });
  console.log(label);
  console.log("   ap-subhold on the folder : " + r.hold);
  console.log("   flyouts still open       : " + r.openFlyouts);
  await browser.close();
  return r;
}

const ctrl = await race(broken, "WITHOUT the guard (the v175 code path)");
console.log("");
const v176 = await race(fixed, "WITH the guard (v176, as built)");

console.log("\n--- verdict ---");
const bugReal = ctrl.openFlyouts === 1 && ctrl.hold === false;
const fixWorks = v176.openFlyouts === 1 && v176.hold === true;
console.log("   the bug was real : " + bugReal +
  "   (a flyout is open but the hold was stripped)");
console.log("   the guard fixes it: " + fixWorks);
process.exit(bugReal && fixWorks ? 0 : 1);
