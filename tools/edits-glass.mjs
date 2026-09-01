/* FILE v26 ("Footer injection 8.10.26 v6.txt") edits, from FILE v25:
   SPECIES CARD v23 -> v24 — the sticky map's ground (map + both
   breathing strips) becomes the nav bar's glass: 13px backdrop blur
   under a film mixed to the panel composite tone. At rest, over the
   flat panel, it composites to exactly the old solid; in motion,
   passing text reads as a very blurred glow. Solid fallback where
   backdrop-filter is unsupported. */
export const EDITS = [

[`FILE VERSION: v25  (last updated 2026-08-10; SPECIES CARD v23 -`,
`FILE VERSION: v26  (last updated 2026-08-10; SPECIES CARD v24 -
     the sticky map's ground (map + both breathing strips) is GLASS
     now - the nav bar's 13px backdrop blur under a film mixed to the
     panel tone, so the At-a-glance block looks unchanged at rest and
     passing text shows as a very blurred glow beneath the pinned
     map. Solid-tone fallback without backdrop-filter support.
     Previously SPECIES CARD v23 -`],

[`       "SPECIES CARD  (v23)"`,
`       "SPECIES CARD  (v24)"`],

[`     AROIDPEDIA · SPECIES CARD  v23  —  8.10.26
     (v23: the map's ::after`,
`     AROIDPEDIA · SPECIES CARD  v24  —  8.10.26
     (v24: THE GLASS MAP — the pinned map's ground and both breathing
     strips wear the nav bar's material: 13px backdrop blur under
     rgba(19,26,21,.55), a film whose colour IS the panel composite,
     so at rest over the flat panel the tone is pixel-identical to
     the old solid — the user's constraint: the At-a-glance block
     must not change at rest — while text passing beneath the pinned
     map reads as a soft blurred glow through it. Browsers without
     backdrop-filter keep the solid: a film alone would show a SHARP
     ghost, which is worse than no glass. v23: the map's ::after`],

[`/* v21: the sticky map's own ground — the panel composite over the page
   ground, written out — so rail content sliding beneath it reads as
   deliberate. Identical tone unstuck, so nothing changes at rest.
   v22: the ::before strip covers the 12px breathing gap between the
   nav bar and the pinned map, where scrolling content showed through.
   Absolute + bottom:100% = zero layout impact at rest. */
.apsc .apsc-facts .apsc-map{background:#131a15;}
.apsc .apsc-facts .apsc-map::before{
  content:"";position:absolute;left:0;right:0;bottom:100%;height:12px;
  background:#131a15;
}
/* v23: and the same breathing room below the pinned map */
.apsc .apsc-facts .apsc-map::after{
  content:"";position:absolute;left:0;right:0;top:100%;height:12px;
  background:#131a15;
}`,
`/* v21→v24: the sticky map's ground — map box plus the two 12px
   breathing strips — is the nav bar's GLASS: 13px backdrop blur under
   a film whose colour is the panel composite (#131a15 at 55%), so at
   rest over the flat panel it composites back to the very tone the
   old solid painted, and the At-a-glance block looks unchanged —
   while text passing beneath the pinned map shows as a very blurred
   glow through it. The strips are absolute (bottom:100% / top:100%),
   so layout at rest never moves. Without backdrop-filter support the
   solid returns: a film alone would pass a SHARP ghost, worse than
   no glass. */
.apsc .apsc-facts .apsc-map{
  background:rgba(19,26,21,.55);
  -webkit-backdrop-filter:blur(13px);
  backdrop-filter:blur(13px);
}
.apsc .apsc-facts .apsc-map::before{
  content:"";position:absolute;left:0;right:0;bottom:100%;height:12px;
  background:rgba(19,26,21,.55);
  -webkit-backdrop-filter:blur(13px);
  backdrop-filter:blur(13px);
}
.apsc .apsc-facts .apsc-map::after{
  content:"";position:absolute;left:0;right:0;top:100%;height:12px;
  background:rgba(19,26,21,.55);
  -webkit-backdrop-filter:blur(13px);
  backdrop-filter:blur(13px);
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))){
  .apsc .apsc-facts .apsc-map,
  .apsc .apsc-facts .apsc-map::before,
  .apsc .apsc-facts .apsc-map::after{background:#131a15;}
}`]
];
