// Live step-7 verification of the four J posts (8.20.26)
import { chromium } from "playwright";

const POSTS = [
  ["johnsonii", { countries: ["Benin", "Burkina Faso", "Ghana", "Guinea", "Ivory Coast", "Liberia", "Mali"], story: false }],
  ["josefbogneri", { countries: ["Thailand"], subunit: "Kanchanaburi", story: false }],
  ["julaihii", { countries: ["Malaysia"], subunit: "Sarawak", story: true }],
  ["juliae", { countries: ["Malaysia"], subunit: "Sarawak", story: false }],
];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

for (const [sp, want] of POSTS) {
  const url = `https://www.aroidpedia.com/journal/amorphophallus-${sp}`;
  const res = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3500);
  const data = await page.evaluate(() => {
    const mount = document.querySelector("[data-apsc-version]");
    const imgs = [...document.querySelectorAll(".apsc-card img, [class*=apsc] img")].filter(i => i.src);
    const emptyAlt = imgs.filter(i => !i.alt || !i.alt.trim()).length;
    const hero = imgs.find(i => /\/hero\//.test(i.src));
    const chips = [...document.querySelectorAll("[class*=chip]")].map(e => e.textContent.trim()).filter(Boolean);
    const story = document.querySelector("[class*=story]");
    const storyTitle = story ? (story.querySelector("h2,h3")?.textContent || "").trim() : "";
    const storyImgs = story ? [...story.querySelectorAll("img")].map(i => ({ src: i.src.split("/").pop(), h: i.getBoundingClientRect().height, natH: i.naturalHeight })) : [];
    const storyBtns = story ? [...story.querySelectorAll("button")].map(b => b.textContent.trim()) : [];
    const notesOl = !!document.querySelector("ol");
    const climate = !!document.querySelector("[class*=climate], [class*=apcl]") || document.body.textContent.includes("CLIMATE RANGE");
    const bodyImgsInText = document.querySelectorAll(".sqs-block-html img").length;
    const grid = [...document.querySelectorAll("[class*=archive] img, [class*=more] img")].length;
    return {
      version: mount ? mount.getAttribute("data-apsc-version") : null,
      totalImgs: imgs.length, emptyAlt, heroSrc: hero ? hero.src.split("/journal/")[1] : null,
      chips, storyTitle, storyImgs, storyBtns, notesOl, climate, bodyImgsInText, grid,
    };
  });
  console.log("=".repeat(30), sp, "| HTTP", res.status());
  console.log(JSON.stringify(data, null, 1));
}
await browser.close();
