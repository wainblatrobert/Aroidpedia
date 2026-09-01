import { chromium } from "playwright";
const POSTS = ["johnsonii", "josefbogneri", "julaihii", "juliae"];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
for (const sp of POSTS) {
  const res = await page.goto(`https://www.aroidpedia.com/journal/amorphophallus-${sp}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3500);
  const d = await page.evaluate(() => {
    const mount = document.querySelector("[data-apsc-version]");
    const imgs = [...document.querySelectorAll("img")].filter(i => i.src && i.src.includes("/journal/"));
    const emptyAlt = imgs.filter(i => !i.alt || !i.alt.trim()).map(i => i.src.split("/").pop());
    const hero = imgs.find(i => /\/hero\//.test(i.src));
    const chipEls = [...document.querySelectorAll("[class*=chip]")].map(e => e.textContent.trim()).filter(t => t && t.length < 30);
    // story: find the element whose text starts with "Field note"
    const all = [...document.querySelectorAll("div,section")];
    const storyBox = all.find(e => /^\s*Field note/i.test(e.textContent) && e.querySelectorAll("h1,h2,h3").length && e.getBoundingClientRect().height > 100 && !all.some(o => o !== e && e.contains(o) && /^\s*Field note/i.test(o.textContent) && o.getBoundingClientRect().height > 100));
    let story = null;
    if (storyBox) {
      const im = [...storyBox.querySelectorAll("img")];
      story = {
        title: (storyBox.querySelector("h1,h2,h3")?.textContent || "").trim(),
        imgs: im.map(i => ({ f: i.src.split("/").pop(), renderH: Math.round(i.getBoundingClientRect().height), natural: i.naturalWidth + "x" + i.naturalHeight })),
        buttons: [...storyBox.querySelectorAll("button")].map(b => b.textContent.trim()).filter(Boolean),
      };
    }
    const dupes = {};
    imgs.forEach(i => dupes[i.src] = (dupes[i.src] || 0) + 1);
    const notes = document.body.innerText.includes("NOTES");
    return {
      version: mount?.getAttribute("data-apsc-version"),
      hero: hero?.src.split("/journal/")[1],
      imgCount: imgs.length, emptyAlt,
      chips: [...new Set(chipEls)],
      story,
      olCount: document.querySelectorAll("ol").length,
      climate: document.body.innerText.includes("CLIMATE"),
      distNote: document.body.innerText.includes("Kwahu") || document.body.innerText.includes("Kanchanaburi") || document.body.innerText.includes("Mulu") || document.body.innerText.includes("Merirai"),
    };
  });
  console.log("=".repeat(28), sp, "HTTP", res.status());
  console.log(JSON.stringify(d));
}
await browser.close();
