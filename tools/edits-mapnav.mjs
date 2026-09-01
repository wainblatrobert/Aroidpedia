/* FILE v23 ("Footer injection 8.10.26 v3.txt") edits, from FILE v22:
   SPECIES CARD v20 -> v21 —
   1. STICKY MAP: the map alone pins below the site header (user: the
      map is the most important part of the rail); the rest of the
      rail scrolls beneath it on its own ground tone. Replaces the
      whole-rail sticky.
   2. NAV RUNNING HEAD: the species name fades in ON the glass nav
      bar, centered in the measured free span between logo and menu —
      no separate row. */
export const EDITS = [

/* ---- file header ---- */
[`FILE VERSION: v22  (last updated 2026-08-10; SPECIES CARD v20 -`,
`FILE VERSION: v23  (last updated 2026-08-10; SPECIES CARD v21 -
     the MAP alone is sticky now (it pins below the site header and
     the rail scrolls beneath it - the user: the map is the most
     important part of the side menu), replacing the whole-rail
     sticky; and the RUNNING HEAD moved INTO the glass nav bar -
     the species name fades in centered between the logo and the
     menu, in the measured free span, no separate row.
     Previously SPECIES CARD v20 -`],

/* ---- TOC ---- */
[`       "SPECIES CARD  (v20)"`,
`       "SPECIES CARD  (v21)"`],

/* ---- block header ---- */
[`     AROIDPEDIA · SPECIES CARD  v20  —  8.10.26
     (v20: three refinements to the split.`,
`     AROIDPEDIA · SPECIES CARD  v21  —  8.10.26
     (v21: STICKY MAP — the map alone pins below the site header once
     it reaches the top; distribution, climate and ecology scroll
     beneath it on the map's own ground tone. Replaces v20's
     whole-rail sticky: pinning the rail's bottom kept the charts but
     lost the map, and the map is the rail's centre of gravity. AND
     THE NAV RUNNING HEAD — the species name no longer takes a row of
     its own; it fades in ON the glass nav bar, centred in the free
     span measured between the logo and the menu links, hidden when
     that span is under 200px. v20: three refinements to the split.`],

/* ---- replace the whole-rail sticky with the sticky map ---- */
[`    /* ---- v20: STICKY AT A GLANCE ----
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
    })();`,
`    /* ---- v21: THE STICKY MAP ----
       The map alone pins below the site header once scrolling brings
       it there — the user's ruling: the map is the most important
       part of the side menu. Everything after it in the rail slides
       beneath; the map carries its own ground tone (the panel's
       composite colour, written out) so the pass-under reads as
       intentional. Sticky WITHIN .apsc-facts, so the map rides out
       naturally when the rail's end scrolls up. Single-column widths
       clear it. */
    (function(){
      if (!railLive) return;
      var mapEl = facetsBox.querySelector(".apsc-map");
      if (!mapEl) return;
      function headerH(){
        var hd = document.querySelector("#header");
        if (!hd) return 0;
        var cs = getComputedStyle(hd);
        if (cs.position !== "fixed" && cs.position !== "sticky") return 0;
        return hd.getBoundingClientRect().height || 0;
      }
      function apply(){
        if (window.innerWidth <= 820){
          mapEl.style.position = "";
          mapEl.style.top = "";
          mapEl.style.zIndex = "";
          return;
        }
        mapEl.style.position = "sticky";
        mapEl.style.top = (headerH() + 12) + "px";
        mapEl.style.zIndex = "3";
      }
      apply();
      window.addEventListener("resize", apply);
    })();`],

/* ---- replace the runhead JS: into the nav bar ---- */
[`    /* ---- v20: THE RUNNING HEAD ----
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
    })();`,
`    /* ---- v21: THE NAV RUNNING HEAD ----
       The species name — alone, never the authority line — fades in
       ON the glass nav bar itself, centred in the free span between
       the logo and the menu links. The span is MEASURED (logo right
       edge to nav left edge) and re-measured on resize and scroll, so
       the name never collides with either; under 200px of room it
       simply stays hidden. Overlaid, not injected: Squarespace owns
       its header DOM, so the name is a fixed element aligned to the
       header's box, one z above it, pointer-events none. Rebuilt per
       card for ajax navigation. Desktop only. */
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
        if (!hd){ bar.style.display = "none"; return; }
        var hr = hd.getBoundingClientRect();
        var logo = hd.querySelector(".header-title-logo, .header-title");
        var nav = hd.querySelector(".header-nav, nav");
        var left = logo ? logo.getBoundingClientRect().right : hr.left + 24;
        var right = nav ? nav.getBoundingClientRect().left : hr.right - 24;
        var room = right - left - 72;
        if (!(room > 180)){ bar.style.display = "none"; return; }
        bar.style.display = "";
        bar.style.left = (left + 36) + "px";
        bar.style.width = room + "px";
        bar.style.top = Math.max(0, hr.top) + "px";
        bar.style.height = hr.height + "px";
        var z = parseInt(getComputedStyle(hd).zIndex, 10);
        bar.style.zIndex = isNaN(z) ? "1001" : String(z + 1);
      }
      place();
      window.addEventListener("resize", place);
      /* the nav's own webfonts shift its left edge as they land */
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
      var ticking = false;
      window.addEventListener("scroll", function(){
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function(){ ticking = false; place(); });
      }, { passive: true });
      if ("IntersectionObserver" in window){
        new IntersectionObserver(function(entries){
          var e = entries[0];
          bar.classList.toggle("apsc-runhead--on",
            !e.isIntersecting && e.boundingClientRect.top < 0);
        }, { threshold: 0 }).observe(h1);
      }
    })();`],

/* ---- CSS: runhead becomes a nav overlay; the map gets its ground ---- */
[`/* v20: the running head. Outside .apsc, so no tokens — values are the
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
@media (prefers-reduced-motion: reduce){.apsc-runhead{transition:none;}}`,
`/* v21: the running head lives ON the glass nav bar — transparent, the
   header's own glass is the ground. Geometry (left/width/top/height/
   z-index) is measured and set inline by the script; this rule is the
   type and the fade. Outside .apsc, so values are written out. */
.apsc-runhead{
  position:fixed;z-index:1001;
  display:flex;align-items:center;justify-content:center;
  padding:0 12px;overflow:hidden;
  font-family:"Cormorant Garamond",Georgia,serif;
  font-size:14px;letter-spacing:.2em;color:#f3f1ea;
  white-space:nowrap;
  opacity:0;transform:translateY(-4px);pointer-events:none;
  transition:opacity .28s ease,transform .28s ease;
}
.apsc-runhead span{overflow:hidden;text-overflow:ellipsis;}
.apsc-runhead--on{opacity:1;transform:none;}
@media (max-width:820px){.apsc-runhead{display:none;}}
@media (prefers-reduced-motion: reduce){.apsc-runhead{transition:none;}}
/* v21: the sticky map's own ground — the panel composite over the page
   ground, written out — so rail content sliding beneath it reads as
   deliberate. Identical tone unstuck, so nothing changes at rest. */
.apsc .apsc-facts .apsc-map{background:#131a15;}`]
];
