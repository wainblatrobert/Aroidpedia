/* FILE v24 ("Footer injection 8.10.26 v4.txt") edits, from FILE v23:
   SPECIES CARD v21 -> v22 — the seam fix: rail content was visible in
   the 12px gap between the nav bar and the stuck map. A ::before
   strip in the map's own ground tone extends 12px above its box —
   absolute, so no layout change at rest (it sits invisibly over the
   same panel tone) — and seals the gap flush to the header. */
export const EDITS = [

[`FILE VERSION: v23  (last updated 2026-08-10; SPECIES CARD v21 -`,
`FILE VERSION: v24  (last updated 2026-08-10; SPECIES CARD v22 -
     the sticky-map SEAM fix: rail content was visible scrolling
     through the 12px breathing gap between the nav bar and the
     pinned map; a cover strip in the map's ground tone now seals it.
     And the nav running head steps up 14px -> 16.5px, the menu's own
     optical size. Previously SPECIES CARD v21 -`],

[`       "SPECIES CARD  (v21)"`,
`       "SPECIES CARD  (v22)"`],

[`     AROIDPEDIA · SPECIES CARD  v21  —  8.10.26
     (v21: STICKY MAP`,
`     AROIDPEDIA · SPECIES CARD  v22  —  8.10.26
     (v22: the seam — the 12px gap between nav bar and pinned map let
     the rail's content show through as it scrolled beneath. The map
     now carries a ::before strip, 12px tall, bottom:100%, in the same
     written-out ground tone: absolute, so the rest layout never
     moves, and at rest it sits invisibly over identical panel tone
     below the AT A GLANCE heading. v21: STICKY MAP`],

[`  font-family:"Cormorant Garamond",Georgia,serif;
  font-size:14px;letter-spacing:.2em;color:#f3f1ea;`,
`  font-family:"Cormorant Garamond",Georgia,serif;
  font-size:16.5px;letter-spacing:.2em;color:#f3f1ea;`],

[`/* v21: the sticky map's own ground — the panel composite over the page
   ground, written out — so rail content sliding beneath it reads as
   deliberate. Identical tone unstuck, so nothing changes at rest. */
.apsc .apsc-facts .apsc-map{background:#131a15;}`,
`/* v21: the sticky map's own ground — the panel composite over the page
   ground, written out — so rail content sliding beneath it reads as
   deliberate. Identical tone unstuck, so nothing changes at rest.
   v22: the ::before strip covers the 12px breathing gap between the
   nav bar and the pinned map, where scrolling content showed through.
   Absolute + bottom:100% = zero layout impact at rest. */
.apsc .apsc-facts .apsc-map{background:#131a15;}
.apsc .apsc-facts .apsc-map::before{
  content:"";position:absolute;left:0;right:0;bottom:100%;height:12px;
  background:#131a15;
}`]
];
