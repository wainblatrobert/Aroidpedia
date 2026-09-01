/* FILE v22 ("Footer injection 8.10.26 v2.txt") edits, from FILE v21:
   SPECIES CARD v19 -> v20 — three refinements to THE SPLIT:
   1. References / More photos / Video break OUT to full width
   2. STICKY AT A GLANCE (prototype)
   3. THE RUNNING HEAD — species name only, once the title scrolls off
   NOTE: no regex literals in these payloads (the template-literal
   backspace lesson); everything is plain strings. */
export const EDITS = [

/* ---- file header ---- */
[`FILE VERSION: v21  (last updated 2026-08-10; SPECIES CARD v19 -`,
`FILE VERSION: v22  (last updated 2026-08-10; SPECIES CARD v20 -
     three refinements to THE SPLIT: References, More photos and Video
     break back OUT of the reading column to the card's full width
     (user ruling - the closing grids deserve the room); the
     At-a-glance rail is STICKY while its column scrolls (fits-viewport
     aware: a tall rail pins its lower half - climate stays in view);
     and a RUNNING HEAD - the species name alone, nothing else - fades
     in under the site header once the title scrolls away.
     Previously SPECIES CARD v19 -`],

/* ---- TOC ---- */
[`       "SPECIES CARD  (v19)"`,
`       "SPECIES CARD  (v20)"`],

/* ---- block header ---- */
[`     AROIDPEDIA · SPECIES CARD  v19  —  8.10.26
     (v19: THE SPLIT`,
`     AROIDPEDIA · SPECIES CARD  v20  —  8.10.26
     (v20: three refinements to the split. THE WIDE TAIL: References,
     More photos and Video leave the reading column for the card's
     full width — by the time a reader reaches them the rail ended
     long ago, and a photo grid at column width was four tiles where
     it could be seven. STICKY AT A GLANCE: the rail rides along
     while its column scrolls; when it is taller than the viewport it
     pins its LOWER edge instead, so the climate charts — not a bare
     tail — stay in view while reading. THE RUNNING HEAD: the species
     name alone (never the diagnosis below it — user ruling) in a
     slim bar under the site header, shown only once the real title
     has scrolled off, desktop only. v19: THE SPLIT`],

/* ---- the wide container ---- */
[`    /* ---- body ---- */
    var body = el("div","apsc-body");
    var na = [];`,
`    /* ---- body ---- */
    var body = el("div","apsc-body");
    /* v20: THE WIDE TAIL. The closing sections — References, More
       photos, Video — append here instead of the body, and this box
       sits AFTER the two-column slab, at full card width. Created
       lazily so a post with none of the three gets no empty box. */
    var wideBox_ = null;
    function wide(){
      if (!wideBox_){ wideBox_ = el("div","apsc-wide"); card.appendChild(wideBox_); }
      return wideBox_;
    }
    var na = [];`],

/* ---- references go wide ---- */
[`        var rbox = el("div","apsc-refs");
        rbox.appendChild(nodesToProse(rsec.nodes));
        body.appendChild(section(referencesDef.label, rbox));`,
`        var rbox = el("div","apsc-refs");
        rbox.appendChild(nodesToProse(rsec.nodes));
        wide().appendChild(section(referencesDef.label, rbox));`],

/* ---- more photos go wide ---- */
[`    if (rest.length) body.appendChild(section("More photos", photoStrip(rest, lb), rest.length));`,
`    if (rest.length) wide().appendChild(section("More photos", photoStrip(rest, lb), rest.length));`],

/* ---- video goes wide ---- */
[`      body.appendChild(section(restVids.length > 1 ? "Video" : "Video", vbox));`,
`      wide().appendChild(section(restVids.length > 1 ? "Video" : "Video", vbox));`],

/* ---- sticky rail + running head ---- */
[`    /* v19: the body lives in the left column, at the hero's measure */
    colMain.appendChild(body);

    if (na.length){`,
`    /* v19: the body lives in the left column, at the hero's measure */
    colMain.appendChild(body);

    /* ---- v20: STICKY AT A GLANCE ----
       The right column below the rail is empty for the whole body —
       so the rail rides along. When it FITS the viewport it sticks
       below the site header; when it is TALLER, top goes negative so
       its lower edge pins ~24px above the viewport bottom and the
       climate charts stay readable while the description scrolls.
       Inline styles, not classes: the offset is a measured number.
       Re-measured when the rail grows (the climate row lands late)
       and on resize; single-column widths clear it. */
    (function(){
      if (!railLive) return;
      function headerH(){
        var hd = document.querySelector("#header");
        if (!hd) return 0;
        var cs = getComputedStyle(hd);
        if (cs.position !== "fixed" && cs.position !== "sticky") return 0;
        return hd.getBoundingClientRect().height || 0;
      }
      function apply(){
        if (window.innerWidth <= 820){
          facetsBox.style.position = "";
          facetsBox.style.top = "";
          return;
        }
        var hh = headerH();
        var fits = facetsBox.offsetHeight + hh + 40 < window.innerHeight;
        facetsBox.style.position = "sticky";
        facetsBox.style.top = (fits
          ? hh + 16
          : window.innerHeight - facetsBox.offsetHeight - 24) + "px";
      }
      apply();
      window.addEventListener("resize", apply);
      if (window.ResizeObserver) new ResizeObserver(apply).observe(facetsBox);
    })();

    /* ---- v20: THE RUNNING HEAD ----
       The species name alone — never the authority line below it —
       in a slim bar under the site header, visible only once the
       real title has scrolled off the top. Fixed to <body> (same
       reason the section rail portals there), rebuilt per card so
       Squarespace ajax navigation gets the new name. Desktop only,
       via its own media rule. */
    (function(){
      var h1 = document.querySelector(".blog-item-title h1, .entry-title, h1.entry-title, h1");
      if (!h1 || !facts.title) return;
      var old = document.querySelector(".apsc-runhead");
      if (old) old.remove();
      var bar = el("div","apsc-runhead");
      bar.appendChild(el("span", null, facts.title));
      document.body.appendChild(bar);
      function place(){
        var hd = document.querySelector("#header");
        var hh = 0;
        if (hd){
          var cs = getComputedStyle(hd);
          if (cs.position === "fixed" || cs.position === "sticky") hh = hd.getBoundingClientRect().height || 0;
        }
        bar.style.top = hh + "px";
      }
      place();
      window.addEventListener("resize", place);
      if ("IntersectionObserver" in window){
        new IntersectionObserver(function(entries){
          var e = entries[0];
          bar.classList.toggle("apsc-runhead--on",
            !e.isIntersecting && e.boundingClientRect.top < 0);
        }, { threshold: 0 }).observe(h1);
      }
    })();

    if (na.length){`],

/* ---- CSS ---- */
[`/* v19: the left cell is a column — hero, then the whole body. On a
   phone the wrapper dissolves (display:contents) and order restores
   the reading sequence hero → At a glance → body. */
.apsc-colmain{min-width:0;}`,
`/* v19: the left cell is a column — hero, then the whole body. On a
   phone the wrapper dissolves (display:contents) and order restores
   the reading sequence hero → At a glance → body. */
.apsc-colmain{min-width:0;}
/* v20: the wide tail — the closing sections at full card width */
.apsc-wide{display:grid;gap:var(--gap);}
/* v20: the running head. Outside .apsc, so no tokens — values are the
   card's own, written out. A solid ground-coloured bar, not glass:
   translucency has nothing to blur here (the comment-bar lesson). */
.apsc-runhead{
  position:fixed;left:0;right:0;top:0;z-index:800;
  text-align:center;padding:10px 16px;
  background:rgba(11,18,13,.94);
  border-bottom:1px solid rgba(243,241,234,.10);
  font-family:"Cormorant Garamond",Georgia,serif;
  font-size:15px;letter-spacing:.22em;color:#f3f1ea;
  opacity:0;transform:translateY(-6px);pointer-events:none;
  transition:opacity .22s ease,transform .22s ease;
}
.apsc-runhead--on{opacity:1;transform:none;}
@media (max-width:820px){.apsc-runhead{display:none;}}
@media (prefers-reduced-motion: reduce){.apsc-runhead{transition:none;}}`]
];
