/* FILE v25 ("Footer injection 8.10.26 v5.txt") edits, from FILE v24:
   SPECIES CARD v22 -> v23 — the matching breathing strip BELOW the
   pinned map, so passing text never touches its bottom edge. */
export const EDITS = [

[`FILE VERSION: v24  (last updated 2026-08-10; SPECIES CARD v22 -`,
`FILE VERSION: v25  (last updated 2026-08-10; SPECIES CARD v23 -
     the pinned map's bottom edge gets the same 12px breathing strip
     as its top, so scrolling text keeps its distance on both sides.
     Previously SPECIES CARD v22 -`],

[`       "SPECIES CARD  (v22)"`,
`       "SPECIES CARD  (v23)"`],

[`     AROIDPEDIA · SPECIES CARD  v22  —  8.10.26
     (v22: the seam`,
`     AROIDPEDIA · SPECIES CARD  v23  —  8.10.26
     (v23: the map's ::after — the same 12px ground-tone strip below
     the pinned map as v22 put above it, so text sliding beneath
     clears the bottom edge instead of colliding with it. v22: the seam`],

[`.apsc .apsc-facts .apsc-map::before{
  content:"";position:absolute;left:0;right:0;bottom:100%;height:12px;
  background:#131a15;
}`,
`.apsc .apsc-facts .apsc-map::before{
  content:"";position:absolute;left:0;right:0;bottom:100%;height:12px;
  background:#131a15;
}
/* v23: and the same breathing room below the pinned map */
.apsc .apsc-facts .apsc-map::after{
  content:"";position:absolute;left:0;right:0;top:100%;height:12px;
  background:#131a15;
}`]
];
