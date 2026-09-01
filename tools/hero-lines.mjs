/* How many lines does each hero title actually render on?
   A <br> is one way to get two lines; natural wrapping is another. What
   matters is the result, so measure the rendered line boxes rather than
   count tags. */
import { chromium } from "playwright";
const G = ["alocasia","amorphophallus","anthurium","arisaema","arum","dieffenbachia",
           "dracunculus","helicodiceros","homalomena","monstera","philodendron",
           "schismatoglottis","spathiphyllum"];
const urls = G.map(g => "/" + g + "-reproduction").concat(["/aroid-reproduction","/chromosomes-and-crossing"]);
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
console.log("PAGE                             lines  <br>  title");
console.log("-".repeat(88));
for (const u of urls) {
  const pg = await ctx.newPage();
  try {
    await pg.goto("https://www.aroidpedia.com" + u, { waitUntil: "domcontentloaded", timeout: 60000 });
    await pg.waitForTimeout(3500);
    const r = await pg.evaluate(() => {
      const h = document.querySelector('h1[class*="title"]');
      if (!h) return null;
      // count distinct line boxes via client rects of a range over the text
      const rng = document.createRange(); rng.selectNodeContents(h);
      const tops = new Set([...rng.getClientRects()].map(r => Math.round(r.top)));
      return { lines: tops.size, br: h.querySelectorAll("br").length,
               txt: h.textContent.replace(/\s+/g," ").trim().slice(0,42),
               fs: getComputedStyle(h).fontSize };
    });
    if (!r) console.log("%-32s (no h1 title found)", u);
    else console.log("%-32s %-6d %-5d %s", u, r.lines, r.br, r.txt);
  } catch (e) { console.log("%-32s ERROR", u); }
  await pg.close();
}
await b.close();
