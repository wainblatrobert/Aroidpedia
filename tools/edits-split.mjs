/* FILE v21 ("Footer injection 8.10.26 v1.txt") edits, from v7/FILE v20:
   SPECIES CARD v18 -> v19 — THE SPLIT. The whole card is two columns:
   hero + every body section in the left column, the At-a-glance rail
   in the right. Removes v18's balance pass entirely (superseded). */
export const EDITS = [

/* ---- file header ---- */
[`FILE VERSION: v20  (last updated 2026-08-09; SPECIES CARD v18 +`,
`FILE VERSION: v21  (last updated 2026-08-10; SPECIES CARD v19 -
     THE SPLIT: the card is two columns for its whole height - hero
     and every body section in the left column at the hero's measure,
     the At-a-glance rail in the right - because nothing ever renders
     to the right below the rail (user's observation), and full-width
     body text ran to a ~200-character measure. Supersedes and REMOVES
     v18's balance pass. Previously SPECIES CARD v18 +`],

/* ---- TOC ---- */
[`       "SPECIES CARD  (v18)"`,
`       "SPECIES CARD  (v19)"`],

/* ---- species card block header ---- */
[`     AROIDPEDIA · SPECIES CARD  v18  —  8.9.26
     (v18: the balance pass`,
`     AROIDPEDIA · SPECIES CARD  v19  —  8.10.26
     (v19: THE SPLIT — the two-column top slab now runs the card's
     whole height: the left cell is a COLUMN holding the hero, the
     protologue and every body section; the rail keeps the right.
     Ends both problems the balance pass was chasing — the dead space
     under a short hero, and body prose set at a ~200-character
     measure across the full card width. The v18 balance code is
     REMOVED, not disabled: moving sections into the photo column is
     meaningless when the body lives there structurally. Mobile keeps
     the reading order hero → At a glance → body via display:contents
     on the column wrapper. v18 (removed): the balance pass`],

/* ---- assembly: the left column wrapper ---- */
[`    /* A post with no usable photograph would otherwise leave the wide
       column empty and the rail stranded at 35% width. Drop to one
       column instead. */
    if (fig.firstChild) top.appendChild(fig);
    else top.style.gridTemplateColumns = "minmax(0,1fr)";`,
`    /* A post with no usable photograph would otherwise leave the wide
       column empty and the rail stranded at 35% width. Drop to one
       column instead. */
    /* v19: the left cell is a COLUMN — hero now, the whole body later
       (appended once it is built). Not appended to the grid yet: the
       order of the two cells depends on whether the rail survives,
       decided below. */
    var colMain = el("div","apsc-colmain");
    if (fig.firstChild) colMain.appendChild(fig);
    else top.style.gridTemplateColumns = "minmax(0,1fr)";`],

/* ---- assembly: cell order ---- */
[`    if (facetsBox.querySelector(".apsc-fact") || facetsBox.querySelector(".apsc-map")){
      top.appendChild(facetsBox);
    } else if (fig.firstChild){
      top.style.gridTemplateColumns = "minmax(0,1fr)";
      fig.style.maxWidth = "620px";
    }
    card.appendChild(top);`,
`    var railLive = !!(facetsBox.querySelector(".apsc-fact") || facetsBox.querySelector(".apsc-map"));
    if (railLive && fig.firstChild){
      top.appendChild(colMain);
      top.appendChild(facetsBox);
    } else if (railLive){
      /* no photo: single column, the glance box first, then the body */
      top.appendChild(facetsBox);
      top.appendChild(colMain);
    } else {
      /* no rail: single column; a hero, if any, stays book-plate sized */
      top.style.gridTemplateColumns = "minmax(0,1fr)";
      if (fig.firstChild) fig.style.maxWidth = "620px";
      top.appendChild(colMain);
    }
    card.appendChild(top);`],

/* ---- assembly: body goes into the column; the balance pass goes away ---- */
[`    card.appendChild(body);

    /* ---- v18: THE EMPTY COLUMN ----
       On a post with a short hero and a long rail (A. baginda:
       landscape photo, essay-length ecology plus the climate row),
       the photo column ended in a page of dark nothing. While the
       rail outruns the photo column by more than a chart's height,
       leading body sections move up under the hero and plates — in
       reading order, always a PREFIX of the body (up to three), so
       nothing is ever read out of sequence. A section only moves if
       it FITS the remaining gap, and only comes home if the left
       column has grown well past the rail (move at >260px, restore
       at <-160px) — the dead zone between the two thresholds is what
       stops image loads from making it thrash. Re-evaluated when the
       rail resizes (the climate row arrives asynchronously and
       lengthens it) and on window resize; the single-column
       breakpoint always sends everything home. */
    (function(){
      if (!fig.firstChild) return;
      var cands = [];
      for (var bi = 0; bi < body.children.length && cands.length < 3; bi++){
        var kid = body.children[bi];
        if (!/\\bapsc-sec\\b/.test(kid.className || "")) break;
        if (kid.id === "apsc-more-photos" || kid.id === "apsc-video") break;
        cands.push(kid);
      }
      if (!cands.length) return;
      var movedStack = [];
      function restoreLast(){
        var m = movedStack.pop();
        m.mark.parentNode.insertBefore(m.sec, m.mark.nextSibling);
        m.mark.parentNode.removeChild(m.mark);
      }
      function balance(){
        if (window.innerWidth <= 820){ while (movedStack.length) restoreLast(); return; }
        var guard = 0;
        while (guard++ < 8){
          var gap = facetsBox.offsetHeight - fig.offsetHeight;
          if (gap > 260 && movedStack.length < cands.length){
            var next = cands[movedStack.length];
            if (next.offsetHeight > gap - 100) break;   /* would overshoot */
            var mark = document.createComment("apsc-balance-home");
            next.parentNode.insertBefore(mark, next);
            fig.appendChild(next);
            movedStack.push({ sec: next, mark: mark });
          } else if (gap < -160 && movedStack.length){
            restoreLast();
          } else break;
        }
      }
      balance();
      var raf = false;
      function schedule(){
        if (raf) return;
        raf = true;
        requestAnimationFrame(function(){ raf = false; balance(); });
      }
      window.addEventListener("resize", schedule);
      if (window.ResizeObserver) new ResizeObserver(schedule).observe(facetsBox);
    })();

    if (na.length){`,
`    /* v19: the body lives in the left column, at the hero's measure */
    colMain.appendChild(body);

    if (na.length){`],

/* ---- CSS: the column ---- */
[`.apsc-top{
  display:grid;gap:var(--gap);align-items:start;
  grid-template-columns:minmax(0,1.35fr) minmax(260px,.85fr);
  padding:var(--gap) 0;
}
@media (max-width:820px){.apsc-top{grid-template-columns:1fr;}}`,
`.apsc-top{
  display:grid;gap:var(--gap);align-items:start;
  grid-template-columns:minmax(0,1.35fr) minmax(260px,.85fr);
  padding:var(--gap) 0;
}
/* v19: the left cell is a column — hero, then the whole body. On a
   phone the wrapper dissolves (display:contents) and order restores
   the reading sequence hero → At a glance → body. */
.apsc-colmain{min-width:0;}
.apsc-colmain .apsc-body{margin-top:34px;}
@media (max-width:820px){
  .apsc-top{grid-template-columns:1fr;}
  .apsc-colmain{display:contents;}
  .apsc-colmain > .apsc-hero{order:0;}
  .apsc-top > .apsc-facts{order:1;}
  .apsc-colmain > .apsc-body{order:2;}
}`],

/* ---- CSS: retire the v18 rule ---- */
[`.apsc-hero{margin:0;}
/* v18: an Original description balanced up into the photo column */
.apsc-hero .apsc-sec{margin-top:26px;}`,
`.apsc-hero{margin:0;}`]
];
