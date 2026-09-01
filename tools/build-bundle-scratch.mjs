/* ==================================================================
   AROIDPEDIA — FOOTER BUNDLE BUILDER  v1  (8.14.26)

   WHY: the footer master grew to 576 KB and pasting it crashes the
   Squarespace code-injection editor (it tokenizes and highlights the
   whole blob synchronously). The footer injection is now a TWO-LINE
   LOADER; the real code ships as docs/footer.js through the same
   Pages lane as shapes/climate/genus-geo (workflow filter v8).

   THE NEW WORKFLOW, from FILE v61 on:
     1. edit the master  "Footer injection <date> v<N>.txt"  as ever
        (it stays the documented source of truth, banners and all)
     2. node "build-footer-bundle 8.14.26 v1.mjs" "<master file>"
     3. commit docs/footer.js + push  ->  live in ~2 min
     NOTHING IS EVER PASTED AGAIN. The loader stays put.

   WHAT THE BUILD DOES — semantics-preserving, no minification:
     · HTML comment banners are dropped (they live in the master)
     · every <style> block becomes an injected <style> element, in
       file order, before any script body runs
     · every external <script src> becomes an appended script element
     · every inline <script> body is concatenated IN ORDER, separated
       by ";" — top-level scope stays the shared global scope, exactly
       as separate classic <script> tags had it (the blocks are IIFEs
       with window.* handles by house law, so nothing collides)
     · anything else non-whitespace at the top level ABORTS the build
     · the bundle stamps window.__apFooterBundle and logs one line
       naming the FILE version it was built from

   VERSIONING (the version-the-data law): the deployed filename is
   STABLE (footer.js — GitHub Pages caches it ~10 min, so a push is
   live within minutes without a loader change). The version rides
   where it always rode: the console line and the runtime data-*
   stamps (card-vXX-file-vXX, apgm-vX-file-vXX).
   ================================================================== */
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

/* Deliberately NOT fetch(). undici holds the socket open with keep-alive, and
   exiting under it trips a libuv assertion on Windows: the process crashes
   with exit 127 instead of the clean 1 the guard below intends, which makes a
   refusal look like a different kind of failure. `agent: false` gives a
   one-off connection that closes on its own. */
function getUrlText(url) {
  return new Promise(resolve => {
    const req = https.get(url, {
      agent: false,
      timeout: 15000,
      headers: { "User-Agent": "aroidpedia-build/1.0" },
    }, res => {
      if (res.statusCode !== 200) { res.resume(); return resolve(null); }
      let body = "";
      res.setEncoding("utf8");
      res.on("data", c => { body += c; });
      res.on("end", () => resolve(body));
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
  });
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = "C:/Users/nli0490/Claude/aroidpedia-climate/footer-v16-scratch.js";

const masterArg = process.argv[2];
if (!masterArg) {
  console.error('usage: node "build-footer-bundle 8.14.26 v1.mjs" "<master footer .txt>"');
  process.exit(1);
}
const masterPath = path.isAbsolute(masterArg) ? masterArg : path.join(HERE, "..", masterArg);
const src = fs.readFileSync(masterPath, "utf8");

const fileVer = (src.match(/FILE VERSION:\s*(v\d+)/) || [])[1] || "v?";

/* ==================================================================
   VERSION COLLISION GUARD  (9.1.26)

   WHY: on 8.30.26 the R2 cutover shipped card-v149-file-v198, which
   resolves journal photo URLs against PHOTO_BASE. Nine hours later a
   second lane, holding a master snapshot taken before that change,
   built its OWN "FILE v198" and deployed it. v199-v207 all descended
   from that line, so PHOTO_BASE was silently gone - and because
   docs/journal now holds only manifests naming content-hashed keys
   that exist ONLY on R2, every photo on every species page became a
   broken link. It stayed broken for 26 hours and was found by a human
   opening a page.

   Both lanes did the documented thing: "take the next free FILE
   version". Both looked at v197. Nothing compared their answer against
   what had actually shipped.

   So: refuse to build a FILE number that is already live, and refuse
   to build a master whose CARD version is BEHIND the live one - that
   second case is the actual regression, and it is invisible in a diff
   of the master you are holding.
   ================================================================== */
{
  const stampIn = t =>
    t.match(/data-apsc-version",\s*"card-v(\d+)-file-v(\d+)"/) || null;

  const mine = stampIn(src);
  if (!mine) {
    console.error("REFUSING: this master carries no data-apsc-version stamp, so");
    console.error("there is no way to tell what it would ship. Fix the stamp first.");
    process.exit(1);
  }
  const myCard = +mine[1], myFile = +mine[2];

  let live = null, source = "";
  const liveText = await getUrlText("https://wainblatrobert.github.io/Aroidpedia/footer.js");
  if (liveText) { live = stampIn(liveText); source = "the LIVE site"; }

  // DEPLOYED is declared further down this file, so it is in the temporal
  // dead zone here; the guard has to run BEFORE anything is written.
  const deployFile = "C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js";
  if (!live && fs.existsSync(deployFile)) {
    live = stampIn(fs.readFileSync(deployFile, "utf8"));
    source = "the local docs/footer.js (COULD NOT REACH THE LIVE SITE)";
  }

  if (!live) {
    console.warn("!! Could not read any shipped stamp - the collision guard is BLIND");
    console.warn("!! for this build. Verify by hand before deploying.");
  } else {
    const liveCard = +live[1], liveFile = +live[2];
    const problems = [];
    if (myFile <= liveFile)
      problems.push(`FILE v${myFile} has already shipped - ${source} carries `
        + `file-v${liveFile}. The next free number is v${liveFile + 1}.`);
    if (myCard < liveCard)
      problems.push(`this master carries card-v${myCard} but card-v${liveCard} is `
        + `live: building it would REVERT ${liveCard - myCard} card version(s), `
        + `including whatever they fixed.`);

    if (problems.length) {
      console.error("\nREFUSING TO BUILD:");
      for (const p of problems) console.error("  - " + p);
      console.error("\nThis almost always means the master you are holding is not the");
      console.error("current one. Identify it by matching its data-apsc-version stamp");
      console.error("against what is live - never by filename, and never by picking the");
      console.error("highest number in the folder. See _CURRENT FOOTER MASTER.md.");
      console.error("\nIf you genuinely intend this, re-run with --force.\n");
      if (!process.argv.includes("--force")) process.exit(1);
      console.error("--force given; building anyway.\n");
    } else {
      console.log(`  version check: card-v${myCard}-file-v${myFile} is ahead of `
        + `${source} (card-v${liveCard}-file-v${liveFile})`);
    }
  }
}

/* ---- parse the master into ordered pieces ---- */
const pieces = [];
const rx = /<!--[\s\S]*?-->|<style>([\s\S]*?)<\/style>|<script\s+src=(["'])(.*?)\2[^>]*><\/script>|<script>([\s\S]*?)<\/script>/g;
let last = 0, m;
let styles = 0, scripts = 0, externals = 0;
while ((m = rx.exec(src))) {
  const between = src.slice(last, m.index).trim();
  if (between) {
    console.error("ABORT: unhandled top-level content before offset " + m.index + ":\n" +
      between.slice(0, 200));
    process.exit(1);
  }
  last = rx.lastIndex;
  if (m[0].startsWith("<!--")) continue;                 /* banners stay in the master */
  if (m[1] !== undefined) { pieces.push({ kind: "css", body: m[1] }); styles++; }
  else if (m[3] !== undefined) { pieces.push({ kind: "ext", src: m[3] }); externals++; }
  else { pieces.push({ kind: "js", body: m[4] }); scripts++; }
}
const tail = src.slice(last).trim();
if (tail) {
  console.error("ABORT: unhandled top-level content at end of file:\n" + tail.slice(0, 200));
  process.exit(1);
}

/* ---- assemble ---- */
const out = [];
out.push("/* AROIDPEDIA footer bundle — built " + new Date().toISOString().slice(0, 10) +
  " from FILE " + fileVer + " by build-footer-bundle v1.");
out.push("   GENERATED FILE — never edit here; edit the master .txt in");
out.push('   "WEBSITE/Squarespace CSS/" and rebuild. ' + styles + " styles, " +
  scripts + " scripts, " + externals + " external. */");
out.push("(function(){");
out.push('  if (window.__apFooterBundle) return;   /* double-include guard */');
out.push('  window.__apFooterBundle = "' + fileVer + '";');
out.push('  if (window.console && console.info) console.info("[footer bundle] FILE ' + fileVer + ' (hosted footer.js)");');

/* styles first, so no script ever runs ahead of its rules */
const cssPieces = pieces.filter(p => p.kind === "css");
out.push("  var css = " + JSON.stringify(cssPieces.map(p => p.body)) + ";");
out.push("  css.forEach(function(t){");
out.push('    var s = document.createElement("style");');
out.push("    s.textContent = t;");
out.push("    (document.head || document.documentElement).appendChild(s);");
out.push("  });");

for (const p of pieces.filter(p => p.kind === "ext")) {
  out.push('  var ex = document.createElement("script");');
  out.push("  ex.src = " + JSON.stringify(p.src) + ";");
  out.push("  ex.defer = true;");
  out.push("  (document.head || document.documentElement).appendChild(ex);");
}
out.push("})();");

/* script bodies verbatim, in order, global scope — as pasted tags had it */
for (const p of pieces) {
  if (p.kind !== "js") continue;
  out.push(";");
  out.push(p.body);
}

fs.writeFileSync(OUT, out.join("\n"), "utf8");
const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log("wrote " + OUT + "  (" + kb + " KB) from FILE " + fileVer +
  " — " + styles + " styles, " + scripts + " scripts, " + externals + " external");

/* ── KEEP THE FOLDER POINTER HONEST ──────────────────────────
   Another lane could not tell which master was current, because the
   stamp lived only in a hand-maintained line that drifted. This
   rewrites it on every build.

   ⚠⚠ A BUILD IS NOT A DEPLOY. This script writes SCRATCH, so it must
   never claim the built version is live. It records two separate
   facts: what was last BUILT (known here), and what is DEPLOYED -
   which it does not assert but READS out of docs/footer.js, the
   actual artifact. If they differ the block says so, which is exactly
   the state a lane needs to see before it starts editing.           */
const POINTER = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/_CURRENT FOOTER MASTER.md";
const DEPLOYED = "C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js";
/* ⚠⚠ MATCH THE RUNTIME STAMP, NOT THE FIRST STAMP-SHAPED STRING.
   A master carries a CHANGELOG that names old versions in prose, and
   a bare /card-v.../ picked "card-v113-file-v132" out of a sentence -
   reporting a build as ten versions older than it was. The only
   authoritative stamp is the one written onto the mount at runtime. */
const STAMP_RE = /data-apsc-version", "(card-v[0-9]+-file-v[0-9]+)"/;
const stampOf = t => (t.match(STAMP_RE) || [])[1] || null;
function syncPointer(){
  if (!fs.existsSync(POINTER)) { console.log("  (pointer file absent — not updated)"); return; }
  const built = stampOf(src) || "unknown";
  let live = "not built to docs/footer.js yet";
  if (fs.existsSync(DEPLOYED)) {
    live = stampOf(fs.readFileSync(DEPLOYED, "utf8")) || "no stamp found";
  }
  /* ⚠⚠ DO NOT LABEL "WHATEVER WAS LAST BUILT" AS CURRENT. A lane that
     builds an older master to inspect it would otherwise rewrite this
     block to point at that older file - which is precisely the wrong
     answer to the question the block exists to answer. Resolve the live
     master by MATCHING STAMPS against the deploy file instead. */
  let liveMaster = "could not resolve - match the stamp by hand";
  try {
    const dir = POINTER.slice(0, POINTER.lastIndexOf("/"));
    const cands = [];
    for (const d2 of [dir, dir + "/Backup"]) {
      if (!fs.existsSync(d2)) continue;
      for (const f of fs.readdirSync(d2)) {
        if (f.indexOf("Footer injection") === 0 && f.slice(-4) === ".txt") cands.push(d2 + "/" + f);
      }
    }
    const hit = cands.filter(f => stampOf(fs.readFileSync(f, "utf8")) === live);
    if (hit.length === 1) liveMaster = hit[0].split("/").join(String.fromCharCode(92));
    else if (hit.length > 1) liveMaster = hit.length + " masters carry that stamp - AMBIGUOUS: " +
      hit.map(f => f.split("/").pop()).join(", ");
    else liveMaster = "NO master carries " + live + " - the live bundle was built from a master that is gone";
  } catch (e) {}
  const d = new Date();
  const stamp = (d.getMonth()+1) + "." + d.getDate() + "." + String(d.getFullYear()).slice(2);
  const agree = (built === live);
  const lines = [
    "**Master matching the local deploy file:**  ",
    "`" + liveMaster + "`",
    "",
    "**Last built from:** `" + masterPath.split("/").pop().split(String.fromCharCode(92)).pop() + "`  ",
    "**Last built:** `" + built + "`  (FILE " + fileVer + ", " + stamp + ")  ",
    "**Local `docs/footer.js`:** `" + live + "`  ",
    "*(the deploy FILE, which can be uncommitted - another lane may be "  +
      "mid-deploy. What is LIVE is a separate question; check it with the "  +
      "curl one-liner below.)*  ",
    "",
    agree
      ? "✅ The build above matches the local deploy file."
      : "⚠⚠ **THE BUILD ABOVE IS NOT IN THE DEPLOY FILE.** Either it has not " +
        "shipped yet, or ANOTHER LANE has written a different build there - " +
        "check before overwriting. " +
        "Copy the scratch file over `docs/footer.js`, then commit and push.",
    "",
    "*Full master path:*  ",
    "`" + masterPath.split("/").join(String.fromCharCode(92)) + "`"
  ];
  const txt = fs.readFileSync(POINTER, "utf8");
  const A = "<!-- AUTO-STAMP:BEGIN", B = "<!-- AUTO-STAMP:END -->";
  const i = txt.indexOf(A), j = txt.indexOf(B);
  if (i < 0 || j < 0) { console.log("  (pointer markers missing — not updated)"); return; }
  /* ⚠ keep the file's own line endings: it is LF and the masters are
     CRLF, and rewriting one as the other makes a whole-file diff. */
  const eol = txt.indexOf(String.fromCharCode(13) + String.fromCharCode(10)) >= 0
    ? String.fromCharCode(13) + String.fromCharCode(10) : String.fromCharCode(10);
  const head = txt.slice(0, txt.indexOf("-->", i) + 3);
  const out = head + eol + lines.join(eol) + eol + txt.slice(j);
  fs.writeFileSync(POINTER, out, "utf8");
  console.log("  pointer updated — built " + built + " / deployed " + live +
    (agree ? "  (in sync)" : "  (NOT YET SHIPPED)"));
}
syncPointer();
