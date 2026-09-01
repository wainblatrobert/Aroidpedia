/* Card v120 (FILE v141) — THE POINT-LOCALITY DOT.
   Master: Footer injection 8.20.26 v12.txt -> v13.txt

   Reported on Alocasia zebrina: a big blob over Luzon with no hover
   name, covering the shape underneath.

   It is the ALABAT dot. Alabat is one of only three places in the feed
   with no polygon, so it draws as a circle. Three separate defects,
   measured on the live page:

   1. ⚠⚠ THE RADIUS IS IN USER UNITS — i.e. DEGREES. r="1.4" against
      zebrina's 25.3°-wide viewBox rendered a 34px blob spanning about
      310 km; Alabat Island is 19 km long. The same r on the world map
      (379° wide) renders ~3px, which is why this was never noticed:
      the dot's apparent size depends entirely on the zoom.
      ⚠ AND THE MAP ZOOMS AND PANS. A one-time radius would be wrong
      again the moment the reader used + / − or the wheel, so the size
      is recomputed on every viewBox change, inside setVB().
      The factor 0.0037 is 1.4 / 379.4 — the world-map look, now held
      at every zoom instead of only at one.

   2. ⚠ NO <title>, so no hover name and nothing for assistive tech.

   3. ⚠ THE READOUT ONLY LOOKS AT PATHS. nameAt() does
      closest("path"), and a <circle> never matches one — so even with
      a title the custom readout would have stayed blank. It now
      accepts either.

   The blob covering the shape was the radius; at ~3px the dot reads
   as the point locality it is, sitting on the province that contains
   it.                                                              */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.20.26 v12.txt';
const OUT = DIR + 'Footer injection 8.20.26 v13.txt';
let s = fs.readFileSync(SRC, 'utf8');
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
const edits = [];
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error('ABORT: "' + name + '" matched ' + n + ', expected 1'); process.exit(1); }
  s = s.replace(f, () => r);
  edits.push(name);
}

/* 1 + 2: name the dot, and stop hard-coding its size */
cut('dot-title',
`    /* point localities (Himalaya today) that have no polygon */
    hits.forEach(function(name){
      var dot = data.dots && data.dots[name];
      if (!dot) return;
      var c = document.createElementNS(NS,"circle");
      c.setAttribute("cx", dot[0]); c.setAttribute("cy", -dot[1]); c.setAttribute("r", 1.4);
      c.setAttribute("class", doubtful[name] ? "apsc-dot apsc-dot--doubtful" : "apsc-dot");
      svg.appendChild(c);
    });`,
`    /* point localities that have no polygon — Alabat, Himalaya and
       Gilbert Is. today (the comment used to say "Himalaya today"). */
    hits.forEach(function(name){
      var dot = data.dots && data.dots[name];
      if (!dot) return;
      var c = document.createElementNS(NS,"circle");
      c.setAttribute("cx", dot[0]); c.setAttribute("cy", -dot[1]);
      /* r is set by sizeDots() below — see the note there. */
      c.setAttribute("class", doubtful[name] ? "apsc-dot apsc-dot--doubtful" : "apsc-dot");
      /* v120: it never carried a name, so it had no hover text and
         nothing for assistive tech. */
      var dttl = document.createElementNS(NS, "title");
      dttl.textContent = name;
      c.appendChild(dttl);
      svg.appendChild(c);
    });
    /* ⚠⚠ v120: A CIRCLE'S r IS IN USER UNITS — DEGREES HERE — so a
       fixed radius renders at a size that depends entirely on the
       zoom. r=1.4 was ~3px on the world map and a 34px blob on
       zebrina's 25°-wide view, covering ~310 km of ocean and the
       province underneath. Scale it to the viewBox instead, and
       recompute on EVERY viewBox change, because the map zooms and
       pans. 0.0037 = 1.4 / 379.4, i.e. exactly the world-map look,
       now held at every zoom rather than at one. */
    function sizeDots(){
      var vb = String(svg.getAttribute("viewBox") || "").trim().split(/\s+/).map(Number);
      if (vb.length !== 4 || !(vb[2] > 0)) return;
      var rr = (vb[2] * 0.0037).toFixed(4);
      [].slice.call(svg.querySelectorAll("circle.apsc-dot"))
        .forEach(function(c){ c.setAttribute("r", rr); });
    }`);

cut('size-on-first-viewbox',
`    svg.setAttribute("viewBox", zoom.join(" "));
    svg.setAttribute("preserveAspectRatio","xMidYMid meet");`,
`    svg.setAttribute("viewBox", zoom.join(" "));
    sizeDots();
    svg.setAttribute("preserveAspectRatio","xMidYMid meet");`);

cut('size-on-zoom',
`      function setVB(){ svg.setAttribute("viewBox", CUR.join(" ")); syncBtns(); }`,
`      function setVB(){ svg.setAttribute("viewBox", CUR.join(" ")); sizeDots(); syncBtns(); }`);

/* 3: the readout has to see a circle, not just a path */
cut('readout-circle',
`    function nameAt(t){
      var p = t && t.closest ? t.closest("path") : null;
      if (!p) return null;
      var ttl = p.querySelector("title");
      return ttl ? ttl.textContent : null;
    }`,
`    /* ⚠ v120: "path" ALONE MISSED THE DOTS. A point locality draws as
       a <circle>, which never matches closest("path"), so the readout
       stayed blank over it even once it carried a title. */
    function nameAt(t){
      var p = t && t.closest ? (t.closest("path") || t.closest("circle.apsc-dot")) : null;
      if (!p) return null;
      var ttl = p.querySelector("title");
      return ttl ? ttl.textContent : null;
    }`);

/* the mouseover class test is applied separately, in Python: its needle
   contains a regex backslash, and a heredoc + JS template literal eat it
   (the  became a BACKSPACE character and matched nothing). */
cut('stamp', '"card-v119-file-v140"', '"card-v120-file-v141"');
cut('banner', 'FILE VERSION: v140', 'FILE VERSION: v141');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
