/* v7 (FILE v20) edits: SPECIES CARD v17 -> v18 (column balance),
   CLIMATE RANGE v3 -> v4 (band legend + hover typicals). Shared by
   apply and the live-splice verifier. */
export const EDITS = [

/* ---- file header ---- */
[`FILE VERSION: v19  (last updated 2026-08-09; SPECIES CARD v17 +`,
`FILE VERSION: v20  (last updated 2026-08-09; SPECIES CARD v18 +
     CLIMATE RANGE v4 - the typical-day band gets a two-swatch legend
     and the month hover reads the typical values too; and when the
     facts rail outruns a short hero photo, the Original description
     section balances up into the photo column (measured, reversible).
     Previously SPECIES CARD v17 +`],

/* ---- TOC ---- */
[`       "SPECIES CARD  (v17)"`,
`       "SPECIES CARD  (v18)"`],
[`       "CLIMATE RANGE  (v3)"`,
`       "CLIMATE RANGE  (v4)"`],

/* ---- species card block header ---- */
[`     AROIDPEDIA · SPECIES CARD  v17  —  8.9.26
     (v17: the visual pass`,
`     AROIDPEDIA · SPECIES CARD  v18  —  8.9.26
     (v18: the balance pass — when the facts rail outruns a short hero
     (A. baginda: landscape photo, essay-length ecology, a page of
     dark nothing under the picture), the LEADING BODY SECTIONS move
     up into the photo column, in reading order, until the columns
     roughly agree — photo, protologue, original description, then
     description if the gap still yawns. Always a PREFIX of the body,
     so nothing is ever read out of order. Measured against real
     heights, hysteretic so it cannot thrash, reversible, and
     re-evaluated when the climate row lands or the window resizes;
     single-column widths always send everything home. See THE EMPTY
     COLUMN in the render section. v17: the visual pass`],

/* ---- climate block header ---- */
[`     AROIDPEDIA · CLIMATE RANGE  v3  —  8.9.26
     ------------------------------------------------------------------
     v3 (same day): the visual pass.`,
`     AROIDPEDIA · CLIMATE RANGE  v4  —  8.9.26
     ------------------------------------------------------------------
     v4 (same day): the typical-day band was drawn but never NAMED, so
     it read as texture, not information (user: "not apparent to
     anyone else"). Two fixes: a two-swatch legend under the
     temperature chart (range / typical day), and the month hover now
     appends the typical values — "APR · 63–104 °F · typ 70–91°".
     ------------------------------------------------------------------
     v3 (same day): the visual pass.`],

/* ---- climate JS: legend under the temperature chart ---- */
[`    var chartT = el("div");
    box.appendChild(chartT);`,
`    var chartT = el("div");
    box.appendChild(chartT);
    /* v4: the inner band needs naming — a two-swatch key, always
       visible, so "typical day" is a legend entry, not a secret */
    var legend = el("div", "apsc-clim__legend");
    legend.appendChild(el("span", "apsc-clim__key apsc-clim__key--env"));
    legend.appendChild(el("span", null, "range"));
    legend.appendChild(el("span", "apsc-clim__key apsc-clim__key--typ"));
    legend.appendChild(el("span", null, "typical day"));
    box.appendChild(legend);`],

/* ---- climate JS: hover shows typicals ---- */
[`      } else {
        readT.textContent = MONTHS[m] + " · " + tempStr(a.tnLo[m], a.txHi[m], unit);
        readH.textContent = MONTHS[m] + " · " + a.rhLo[m] + "–" + a.rhHi[m] + "% RH";
      }`,
`      } else {
        readT.textContent = MONTHS[m] + " · " + tempStr(a.tnLo[m], a.txHi[m], unit) +
          (a.tnMed ? " · typ " + fmtT(a.tnMed[m], unit) + "–" + fmtT(a.txMed[m], unit) + "°" : "");
        readH.textContent = MONTHS[m] + " · " + a.rhLo[m] + "–" + a.rhHi[m] + "% RH";
      }`],

/* ---- climate CSS: legend ---- */
[`.apsc .apsc-clim__zones{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px;}`,
`.apsc .apsc-clim__legend{
  display:flex;align-items:center;gap:5px;margin:-5px 0 10px;
  font-family:var(--mono);font-size:8px;letter-spacing:.08em;
  text-transform:uppercase;color:var(--dimmer);
}
.apsc .apsc-clim__key{width:14px;height:7px;border-radius:2px;display:inline-block;}
.apsc .apsc-clim__key--typ{margin-left:8px;}
.apsc .apsc-clim__key--env{background:rgba(175,192,144,.16);box-shadow:inset 0 0 0 1px rgba(175,192,144,.45);}
.apsc .apsc-clim__key--typ{background:rgba(175,192,144,.42);}
.apsc .apsc-clim__zones{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px;}`],

/* ---- species JS: the balance pass ---- */
[`    card.appendChild(body);

    if (na.length){`,
`    card.appendChild(body);

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

    if (na.length){`],

/* ---- species CSS: the moved section's breathing room ---- */
[`.apsc-hero{margin:0;}`,
`.apsc-hero{margin:0;}
/* v18: an Original description balanced up into the photo column */
.apsc-hero .apsc-sec{margin-top:26px;}`]
];
