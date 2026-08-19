/* AROIDPEDIA footer bundle — built 2026-08-19 from FILE v113 by build-footer-bundle v1.
   GENERATED FILE — never edit here; edit the master .txt in
   "WEBSITE/Squarespace CSS/" and rebuild. 16 styles, 40 scripts, 0 external. */
(function(){
  if (window.__apFooterBundle) return;   /* double-include guard */
  window.__apFooterBundle = "v113";
  if (window.console && console.info) console.info("[footer bundle] FILE v113 (hosted footer.js)");
  var css = ["\r\n  /* Aroidpedia global image-lightbox */\r\n  .ap-lightbox-overlay{\r\n    position:fixed; inset:0;\r\n    background:rgba(0,0,0,.86);\r\n    display:none; align-items:center; justify-content:center;\r\n    z-index:999999;\r\n    padding:24px;\r\n  }\r\n  .ap-lightbox-overlay.ap-open{ display:flex; }\r\n  .ap-lightbox-inner{\r\n    max-width:min(1200px, 96vw);\r\n    max-height:92vh;\r\n    position:relative;\r\n  }\r\n  .ap-lightbox-img{\r\n    max-width:100%;\r\n    max-height:92vh;\r\n    width:auto; height:auto;\r\n    display:block;\r\n    border-radius:10px;\r\n  }\r\n  .ap-lightbox-close{\r\n    position:absolute;\r\n    top:-14px; right:-14px;\r\n    width:34px; height:34px;\r\n    border-radius:999px;\r\n    border:0;\r\n    background:rgba(255,255,255,.9);\r\n    cursor:pointer;\r\n    font-size:20px;\r\n    line-height:34px;\r\n  }\r\n  /* Make non-lightbox images feel clickable */\r\n  .image-block-wrapper.ap-lightbox-enabled img{ cursor: zoom-in; }\r\n","\r\n/* 1) Force cursor on the wrapper */\r\n.image-block-wrapper.ap-lightbox-enabled {\r\n  cursor: pointer !important;\r\n}\r\n\r\n/* 2) Force cursor on the actual rendered image container and everything inside */\r\n.image-block-wrapper.ap-lightbox-enabled .sqs-image-shape-container-element,\r\n.image-block-wrapper.ap-lightbox-enabled .sqs-image-shape-container-element * {\r\n  cursor: pointer !important;\r\n}\r\n\r\n/* Optional: zoom-in on the image itself */\r\n.image-block-wrapper.ap-lightbox-enabled img {\r\n  cursor: zoom-in !important;\r\n}\r\n","\r\n  .ap-genus-italic {\r\n    font-style: italic;\r\n  }\r\n","\r\n  em .ap-upright,\r\n  i  .ap-upright,\r\n  [style*=\"italic\"] .ap-upright,\r\n  .ap-upright {\r\n    font-style: normal !important;\r\n  }\r\n","\r\n/* the genus emphasis — everything else inherits .apsc-runhead */\r\n.apsc-runhead[data-ap-genus-runhead]{\r\n  font-size:21px;font-weight:600;letter-spacing:.24em;\r\n}\r\n","\r\n.apgm{margin:0 0 8px;}\r\n.apgm__head{\r\n  display:flex;align-items:baseline;justify-content:space-between;\r\n  gap:10px 14px;flex-wrap:wrap;margin:0 0 10px;\r\n}\r\n.apgm__label{\r\n  font-family:\"Space Mono\",Menlo,Consolas,monospace;font-size:10px;\r\n  letter-spacing:.26em;color:rgba(175,192,144,.95);\r\n}\r\n.apgm__views{display:flex;gap:4px;flex-wrap:wrap;}\r\n.apgm__view{\r\n  font-family:\"Space Mono\",Menlo,Consolas,monospace;font-size:9.5px;\r\n  letter-spacing:.08em;padding:3px 10px;border-radius:999px;cursor:pointer;\r\n  border:1px solid rgba(243,241,234,.13);background:none;\r\n  color:rgba(243,241,234,.45);\r\n  transition:color .15s ease,border-color .15s ease;\r\n}\r\n.apgm__view:hover{color:rgba(243,241,234,.75);border-color:rgba(243,241,234,.3);}\r\n.apgm__view[aria-pressed=\"true\"]{\r\n  color:rgb(175,192,144);border-color:rgba(175,192,144,.5);\r\n  background:rgba(175,192,144,.07);\r\n}\r\n.apgm__view:focus-visible{outline:2px solid rgb(175,192,144);outline-offset:2px;}\r\n.apgm__box{\r\n  position:relative;background:#131a15;border:1px solid rgba(243,241,234,.13);\r\n  border-radius:3px;padding:10px;\r\n}\r\n.apgm__box svg{display:block;width:100%;height:auto;max-height:74vh;cursor:grab;}\r\n.apgm__box svg.apgm--panning{cursor:grabbing;}\r\n/* v3: pixel-width strokes via non-scaling-stroke, so zooming in never\r\n   fattens an outline into a border-drawn continent */\r\n.apgm-borders{\r\n  fill:none;stroke:rgba(243,241,234,.08);stroke-width:.45px;\r\n  vector-effect:non-scaling-stroke;pointer-events:none;\r\n}\r\n.apgm--borders-on .apgm-borders{stroke:rgba(243,241,234,.32);stroke-width:.8px;}\r\n.apgm-zone{\r\n  fill:rgb(175,192,144);stroke:#eff0e8;stroke-opacity:.45;stroke-width:.6px;\r\n  vector-effect:non-scaling-stroke;\r\n  cursor:pointer;transition:fill-opacity .15s ease;\r\n}\r\n.apgm-zone--merged{stroke-opacity:0;}\r\n.apgm-zone.is-hot{fill-opacity:1 !important;stroke-opacity:.85;}\r\n.apgm-doubt{\r\n  fill:rgba(200,214,191,.10);stroke:rgba(200,214,191,.55);\r\n  stroke-width:.7px;vector-effect:non-scaling-stroke;\r\n  stroke-dasharray:.5 .35;cursor:pointer;\r\n}\r\n/* v7: SUBUNIT ZONES LIVE IN THE SUBZONES VIEW (svg.apgm--vsub).\r\n   Outside it they are invisible AND inert (pointer-events:none — so\r\n   Borneo's own hover works again in Zones); inside it they are real\r\n   choropleth zones over their dimmed parent. A selected subunit\r\n   (.is-sel / .is-dsel) shows in every view — the selection is the\r\n   species' true coverage. */\r\n.apgm-zone.apgm-sub{stroke-opacity:0;pointer-events:none;}\r\n.apgm--vsub .apgm-zone.apgm-sub:not(.apgm-zone--merged){stroke-opacity:.55;pointer-events:auto;}\r\n.apgm--vsub .apgm-zone.apgm-sub.is-hot{stroke-opacity:.85;}\r\n.apgm-zone.apgm-sub.is-sel,\r\n.apgm-zone.apgm-sub.is-dsel{stroke-opacity:.9;pointer-events:auto;}\r\n/* doubtful subunits: dashed, Subzones view only — unless selected */\r\n.apgm-doubt.apgm-sub{opacity:0;pointer-events:none;}\r\n.apgm--vsub .apgm-doubt.apgm-sub{opacity:1;pointer-events:auto;}\r\n/* the doubtful-in-selection treatments */\r\n.apgm-doubt.is-sel{opacity:1;pointer-events:auto;stroke-opacity:.95;fill:rgba(200,214,191,.28);}\r\n.apgm-zone.is-dsel{\r\n  fill-opacity:.3 !important;stroke:#f3f1ea;stroke-opacity:.95;\r\n  stroke-dasharray:2 1.4;\r\n}\r\n/* v3: the zoom pills — the journal map's World-pill look, top-right */\r\n.apgm__zoom{\r\n  position:absolute;top:16px;right:16px;display:flex;gap:4px;\r\n}\r\n.apgm__zoom button{\r\n  font-family:\"Space Mono\",Menlo,Consolas,monospace;font-size:10px;\r\n  letter-spacing:.08em;min-width:26px;padding:3px 8px;border-radius:999px;\r\n  cursor:pointer;border:1px solid rgba(243,241,234,.2);\r\n  background:rgba(11,18,13,.72);color:rgba(243,241,234,.65);\r\n  transition:color .15s ease,border-color .15s ease;\r\n}\r\n.apgm__zoom button:hover{color:#f3f1ea;border-color:rgb(175,192,144);}\r\n.apgm__zoom button:focus-visible{outline:2px solid rgb(175,192,144);outline-offset:2px;}\r\n/* v5: the species search — house glass, top-left (the zoom pills'\r\n   mirror). The dropdown reuses the species panel's list voice. */\r\n.apgm__search{position:absolute;top:16px;left:16px;z-index:5;width:238px;max-width:58%;}\r\n.apgm__search-box{position:relative;}\r\n.apgm__search input{\r\n  width:100%;box-sizing:border-box;\r\n  font-family:\"Space Mono\",Menlo,Consolas,monospace;font-size:10.5px;\r\n  letter-spacing:.06em;padding:6px 28px 6px 12px;border-radius:999px;\r\n  border:1px solid rgba(243,241,234,.2);\r\n  background:rgba(11,18,13,.72);color:#f3f1ea;\r\n  -webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);\r\n  transition:border-color .15s ease;\r\n}\r\n.apgm__search input::placeholder{color:rgba(243,241,234,.4);}\r\n.apgm__search input:focus{outline:none;border-color:rgba(175,192,144,.6);}\r\n.apgm__search-x{\r\n  position:absolute;top:50%;right:7px;transform:translateY(-50%);\r\n  border:none;background:none;cursor:pointer;padding:2px 5px;\r\n  font-family:\"Space Mono\",Menlo,Consolas,monospace;font-size:13px;\r\n  line-height:1;color:rgba(243,241,234,.5);display:none;\r\n  transition:color .15s ease;\r\n}\r\n.apgm__search-x:hover{color:#f3f1ea;}\r\n.apgm__search[data-active=\"1\"] .apgm__search-x{display:block;}\r\n.apgm__search-list{\r\n  list-style:none;margin:6px 0 0;padding:6px 10px;\r\n  max-height:min(300px,52vh);overflow-y:auto;\r\n  scrollbar-width:thin;scrollbar-color:rgba(175,192,144,.35) transparent;\r\n  background:rgba(11,18,13,.78);\r\n  -webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);\r\n  border:1px solid rgba(255,255,255,.28);border-radius:3px;\r\n  box-shadow:inset 0 1px 0 rgba(255,255,255,.12);\r\n  display:none;\r\n}\r\n@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))){\r\n  .apgm__search-list{background:#10160f;}\r\n  .apgm__search input{background:#10160f;}\r\n}\r\n.apgm__search-list[data-open=\"1\"]{display:block;}\r\n.apgm__search-list li{padding:0;}\r\n.apgm__search-list button{\r\n  display:block;width:100%;text-align:left;border:none;background:none;\r\n  cursor:pointer;font-size:12.5px;line-height:1.45;padding:3px 2px;\r\n  color:rgb(200,214,191);font-family:inherit;\r\n}\r\n.apgm__search-list button i{font-style:italic;}\r\n.apgm__search-list button:hover{color:#f3f1ea;}\r\n.apgm__search-empty{\r\n  font-family:\"Space Mono\",Menlo,Consolas,monospace;font-size:8.5px;\r\n  letter-spacing:.1em;color:rgba(243,241,234,.4);padding:3px 2px;\r\n}\r\n/* the selection: the chosen species' zones lit, the rest receded.\r\n   !important beats the choropleth's inline fill-opacity, so the\r\n   selection survives view switches; :not(.is-hot) keeps group hover\r\n   readable while a selection is active. */\r\n.apgm--sel .apgm-zone:not(.is-hot):not(.is-sel):not(.is-dsel){fill-opacity:.06 !important;}\r\n/* outside the Subzones view an unselected subunit stays fully\r\n   invisible even while a selection dims everything else */\r\n.apgm--sel:not(.apgm--vsub) .apgm-zone.apgm-sub:not(.is-sel):not(.is-dsel){fill-opacity:0 !important;}\r\n.apgm--sel .apgm-doubt:not(.is-sel){opacity:.12;}\r\n.apgm--sel .apgm-zone.is-sel{\r\n  fill-opacity:.88 !important;stroke:#f3f1ea;stroke-opacity:.9;\r\n}\r\n@media (max-width:820px){.apgm__search{display:none;}}\r\n/* v4: the species panel — the house glass, height-capped, inner scroll */\r\n.apgm__panel{\r\n  position:absolute;top:52px;right:16px;width:270px;\r\n  max-height:calc(100% - 68px);\r\n  display:flex;flex-direction:column;z-index:4;\r\n  background:rgba(11,18,13,.72);\r\n  -webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);\r\n  border:1px solid rgba(255,255,255,.28);border-radius:3px;\r\n  box-shadow:inset 0 1px 0 rgba(255,255,255,.12);\r\n}\r\n@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))){\r\n  .apgm__panel{background:#10160f;}\r\n}\r\n.apgm__panel-head{\r\n  display:flex;align-items:baseline;gap:8px;flex:0 0 auto;\r\n  padding:10px 12px 8px;border-bottom:1px solid rgba(243,241,234,.13);\r\n}\r\n.apgm__panel-title{flex:1;min-width:0;}\r\n.apgm__panel-title em{\r\n  font-style:normal;font-family:\"Cormorant Garamond\",Georgia,serif;\r\n  font-size:16.5px;color:#f3f1ea;letter-spacing:.03em;\r\n}\r\n.apgm__panel-n{\r\n  display:block;font-family:\"Space Mono\",Menlo,Consolas,monospace;\r\n  font-size:8.5px;letter-spacing:.18em;text-transform:uppercase;\r\n  color:rgba(243,241,234,.45);margin-top:2px;\r\n}\r\n.apgm__panel-x{\r\n  flex:0 0 auto;border:none;background:none;cursor:pointer;\r\n  font-family:\"Space Mono\",Menlo,Consolas,monospace;font-size:15px;\r\n  line-height:1;color:rgba(243,241,234,.5);padding:2px 4px;\r\n  transition:color .15s ease;\r\n}\r\n.apgm__panel-x:hover{color:#f3f1ea;}\r\n.apgm__panel-list{\r\n  list-style:none;margin:0;padding:8px 12px 10px;\r\n  overflow-y:auto;flex:1 1 auto;min-height:0;\r\n  scrollbar-width:thin;scrollbar-color:rgba(175,192,144,.35) transparent;\r\n}\r\n.apgm__panel-list li{font-size:12.5px;line-height:1.45;padding:2.5px 0;}\r\n.apgm__panel-list i{font-style:italic;}\r\n.apgm__panel-list a{\r\n  color:rgb(200,214,191);text-decoration:none;\r\n  border-bottom:1px solid rgba(200,214,191,.28);\r\n  transition:color .15s ease,border-color .15s ease;\r\n}\r\n.apgm__panel-list a:hover{color:#f3f1ea;border-color:rgb(175,192,144);}\r\n.apgm__panel-off{color:rgba(243,241,234,.4);}\r\n.apgm__panel-note{\r\n  padding:0 12px 10px;font-family:\"Space Mono\",Menlo,Consolas,monospace;\r\n  font-size:8px;letter-spacing:.06em;color:rgba(243,241,234,.35);flex:0 0 auto;\r\n}\r\n@media (max-width:820px){.apgm__panel{display:none;}}\r\n.apgm__hover{\r\n  position:absolute;left:16px;bottom:12px;pointer-events:none;\r\n  font-family:\"Space Mono\",Menlo,Consolas,monospace;font-size:11px;\r\n  color:rgba(243,241,234,.55);\r\n  opacity:0;transition:opacity .12s ease;\r\n}\r\n.apgm__hover[data-on=\"1\"]{opacity:1;}\r\n.apgm__hover em{\r\n  font-style:normal;font-family:\"Cormorant Garamond\",Georgia,serif;\r\n  font-size:15.5px;color:#f3f1ea;letter-spacing:.04em;margin-right:2px;\r\n}\r\n.apgm__legend{\r\n  display:flex;align-items:center;gap:7px;margin:9px 2px 0;\r\n  font-family:\"Space Mono\",Menlo,Consolas,monospace;font-size:9px;\r\n  color:rgba(243,241,234,.45);\r\n}\r\n.apgm__legend-bar{\r\n  display:inline-block;width:140px;height:8px;border-radius:2px;\r\n  background:linear-gradient(90deg,rgba(175,192,144,.16),rgba(175,192,144,.84));\r\n  border:1px solid rgba(175,192,144,.3);\r\n}\r\n.apgm__legend-t{letter-spacing:.08em;text-transform:uppercase;}\r\n.apgm__note{\r\n  margin:4px 2px 0;font-family:\"Space Mono\",Menlo,Consolas,monospace;\r\n  font-size:8.5px;letter-spacing:.06em;color:rgba(243,241,234,.35);\r\n}\r\n@media (max-width:640px){\r\n  .apgm__box svg{max-height:60vh;}\r\n  .apgm__hover{position:static;margin-top:8px;opacity:1;min-height:18px;}\r\n}\r\n","\r\n  .gn-rail,\r\n  .gn-cue{\r\n    --gn-cream:#F3F1EA;\r\n    --gn-sage:#C8D6BF;\r\n    --gn-sage-pale:#A9C199;\r\n    --gn-spadix:#CDE86B;\r\n    --gn-mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,monospace;\r\n  }\r\n\r\n  /* ---------------- CHAPTER RAIL ---------------- */\r\n  .gn-rail{\r\n    --gn-rail-left:28px;\r\n    --gn-rail-h:min(46vh,360px);\r\n    position:fixed; z-index:60;\r\n    left:var(--gn-rail-left); top:50%;\r\n    transform:translateY(-50%);\r\n    height:var(--gn-rail-h); width:1px;\r\n    opacity:0;\r\n    pointer-events:none;\r\n    transition:opacity .55s ease;\r\n  }\r\n  .gn-rail.is-ready.is-visible{opacity:1; pointer-events:auto}\r\n\r\n  /* The two coincident drawings of the same rail. All colour flows\r\n     through the --gn-ink-* / --gn-fill-* variables, so both layers\r\n     share one ruleset and differ only in their values. */\r\n  .gn-rail__layer{\r\n    position:absolute;\r\n    top:0; bottom:0; left:0; width:1px;\r\n    --gn-ink-dim:rgba(243,241,234,.40);\r\n    --gn-ink-passed:var(--gn-sage-pale);\r\n    --gn-ink-current:var(--gn-cream);\r\n    --gn-line:rgba(200,214,191,.22);\r\n    --gn-fill-a:var(--gn-spadix);\r\n    --gn-fill-b:var(--gn-sage);\r\n    --gn-glow:rgba(205,232,107,.5);\r\n  }\r\n  .gn-rail__layer--dark{\r\n    /* v3, LOAD-BEARING: the mask only covers THIS BOX, and the tick\r\n       labels sit ~90px to the right of the 1px rail. At `width:1px`\r\n       every label fell outside the mask and was erased — which is why\r\n       the dark ink never showed. Width is measured from the real\r\n       labels at build time; this is the floor. */\r\n    width:var(--gn-mask-w,240px);\r\n    --gn-ink-dim:rgba(47,42,36,.50);\r\n    --gn-ink-passed:#5f6f52;\r\n    --gn-ink-current:#2f2a24;\r\n    --gn-line:rgba(47,42,36,.24);\r\n    --gn-fill-a:#5f6f52;\r\n    --gn-fill-b:#8a9a7b;\r\n    --gn-glow:rgba(95,111,82,.28);\r\n    pointer-events:none;\r\n    -webkit-mask-image:var(--gn-dark-mask, linear-gradient(#0000 0 100%));\r\n            mask-image:var(--gn-dark-mask, linear-gradient(#0000 0 100%));\r\n    -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;\r\n    -webkit-mask-size:100% 100%;   mask-size:100% 100%;\r\n  }\r\n\r\n  /* v3: pinned to 1px. These were `inset:0`, which was harmless while\r\n     every layer box was 1px wide and would now stretch the line and\r\n     the fill across the dark layer's 240px mask box. */\r\n  .gn-rail__line{\r\n    position:absolute; top:0; bottom:0; left:0; width:1px;\r\n    background:var(--gn-line);\r\n  }\r\n  .gn-rail__fill{\r\n    position:absolute; top:0; left:0; width:1px; height:0;\r\n    background:linear-gradient(var(--gn-fill-a),var(--gn-fill-b));\r\n    box-shadow:0 0 12px var(--gn-glow);\r\n    transition:height .25s cubic-bezier(.23,1,.32,1);\r\n  }\r\n  .gn-rail__tick{\r\n    position:absolute; left:-3px;\r\n    width:7px; height:1px;\r\n    padding:0; margin:0; border:0;\r\n    background:var(--gn-ink-dim);\r\n    cursor:pointer; outline-offset:10px;\r\n  }\r\n  .gn-rail__tick::before{\r\n    content:\"\"; position:absolute; inset:-9px -130px -9px -9px;\r\n  }\r\n  .gn-rail__layer--dark .gn-rail__tick{cursor:default}\r\n  .gn-rail__layer--dark .gn-rail__tick::before{content:none}\r\n  .gn-rail__tick span{\r\n    position:absolute; left:16px; top:-5px; white-space:nowrap;\r\n    font-family:var(--gn-mono);\r\n    font-size:8.5px; letter-spacing:.16em; text-transform:uppercase;\r\n    color:var(--gn-ink-dim);\r\n    transition:color .3s ease;\r\n  }\r\n  .gn-rail__tick.is-passed span{color:var(--gn-ink-passed)}\r\n  .gn-rail__tick.is-current span{color:var(--gn-ink-current)}\r\n  .gn-rail__layer--light .gn-rail__tick:hover span{color:var(--gn-ink-current)}\r\n  .gn-rail__tick:focus-visible{outline:1px solid var(--gn-sage-pale)}\r\n\r\n  /* ---------------- SCROLL CUE (bottom, handed) ---------------- */\r\n  .gn-cue{\r\n    --gn-cue-right:28px;\r\n    --gn-cue-bottom:30px;\r\n    position:fixed; z-index:59;\r\n    right:var(--gn-cue-right); bottom:var(--gn-cue-bottom);\r\n    pointer-events:none;\r\n    opacity:var(--gn-cue-o,1);\r\n    transition:opacity .45s ease;\r\n  }\r\n  .gn-cue__in{\r\n    display:flex; flex-direction:column; align-items:center; gap:10px;\r\n    font-family:var(--gn-mono);\r\n    font-size:9.5px; letter-spacing:.26em; text-transform:uppercase;\r\n    color:var(--gn-sage-pale);\r\n  }\r\n  .gn-cue__line{\r\n    width:1px; height:38px;\r\n    background:linear-gradient(var(--gn-sage-pale),transparent);\r\n    position:relative; overflow:hidden;\r\n  }\r\n  .gn-cue__line::after{\r\n    content:\"\"; position:absolute; top:0; left:0; width:100%; height:40%;\r\n    background:var(--gn-spadix);\r\n    animation:gnCuePulse 1.8s cubic-bezier(.4,0,.2,1) infinite;\r\n  }\r\n  @keyframes gnCuePulse{\r\n    0%{transform:translateY(-100%)}\r\n    60%,100%{transform:translateY(320%)}\r\n  }\r\n  /* v4: mirrored for a left-handed genus. `right:auto` is LOAD-BEARING\r\n     — with both offsets set the element stretches across the viewport\r\n     instead of moving. */\r\n  .gn-cue[data-hand=\"left\"]{\r\n    right:auto;\r\n    left:var(--gn-cue-right);\r\n  }\r\n\r\n  /* ---------------- SMALL SCREENS: NO FLOATING CHROME ----------------\r\n     ONE breakpoint for both overlays. A touch reader doesn't need to\r\n     be told to scroll, and neither element has room to sit clear of\r\n     the content. 820px, not 600px, so a phone in LANDSCAPE (812px\r\n     wide, and the least vertical room of any screen) is covered too.\r\n     Raising the cue back onto phones = lower this number and restore\r\n     the v4 type-scaling rules it made redundant:\r\n         .gn-cue__in{font-size:8.5px;letter-spacing:.2em}\r\n         .gn-cue__line{height:28px}\r\n         .gn-cue{--gn-cue-right:16px;--gn-cue-bottom:20px}         */\r\n  @media (max-width:820px){\r\n    .gn-rail{display:none}\r\n    .gn-cue{display:none}\r\n  }\r\n\r\n  body.sqs-edit-mode-active .gn-rail,\r\n  body.sqs-edit-mode-active .gn-cue{display:none}\r\n\r\n  @media (prefers-reduced-motion: reduce){\r\n    .gn-cue__line::after{animation:none}\r\n    .gn-rail__fill{transition:none}\r\n    .gn-rail{transition:none}\r\n  }\r\n","\r\n  .header-actions-action--cta {\r\n    display: inline-flex !important;\r\n    align-items: center !important;\r\n  }\r\n\r\n  /* Circle at rest: 40x40, icon dead-center - visually identical to the\r\n     old native button. On open this SAME box widens into the pill; the\r\n     icon doesn't need its own slide transform at all, because it has a\r\n     fixed 40px width and sits first in the row - as the container grows\r\n     around it, the icon is naturally left where it always was (the left\r\n     edge) while the input reveals in the new space beside it. */\r\n  .ap-hsearch-field {\r\n    position: relative;\r\n    display: flex;\r\n    align-items: center;\r\n    width: 40px;\r\n    height: 40px;\r\n    overflow: hidden;\r\n    background: var(--cream, #EFE9DC);   /* cream at rest, matches the expanded pill */\r\n    border: 2px solid rgba(239, 233, 220, .28);   /* cream tint at rest, thickened from 1px */\r\n    border-radius: 999px;\r\n    cursor: pointer;\r\n    /* Closing: pill shrinks back to a circle a beat AFTER the text has\r\n       faded (see input transition below) so nothing looks clipped. */\r\n    transition: width .5s cubic-bezier(.4, 0, .2, 1) .12s,\r\n                border-color .35s ease, background .35s ease;\r\n  }\r\n  /* Gradient lives on a ::before overlay rather than swapping the base\r\n     `background` directly - a plain color can't cross-fade smoothly into\r\n     a gradient via CSS transitions (background-image isn't interpolable),\r\n     it would just pop in instantly. Fading this overlay's opacity instead\r\n     gives a genuinely smooth reveal. ::before paints underneath the icon/\r\n     input (which come later in the markup), so it never covers them. */\r\n  .ap-hsearch-field::before {\r\n    content: \"\";\r\n    position: absolute;\r\n    inset: 0;\r\n    background: linear-gradient(135deg, transparent 0%, var(--sage-pale, #C8D6BF) 100%);\r\n    opacity: 0;\r\n    transition: opacity .4s ease;\r\n    pointer-events: none;\r\n  }\r\n  .ap-hsearch-field.ap-hsearch-open {\r\n    width: 260px;\r\n    border-color: rgba(11, 18, 13, .16);\r\n    /* Opening: pill leads immediately, no delay - text catches up after. */\r\n    transition: width .5s cubic-bezier(.4, 0, .2, 1) 0s,\r\n                border-color .35s ease, background .35s ease;\r\n  }\r\n  .ap-hsearch-field.ap-hsearch-open::before {\r\n    opacity: .6;   /* subtle - a hint of sage sheen, not a strong color shift */\r\n    transition: opacity .4s ease .1s;   /* fades in just behind the width expand */\r\n  }\r\n\r\n  .ap-hsearch-icon {\r\n    flex: 0 0 40px;\r\n    width: 40px;\r\n    height: 40px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    /* Now a real inline SVG (see script below), not the 🔍 emoji - emoji\r\n       render in their own fixed color on every platform and ignore\r\n       `color` entirely, which looked mismatched against a solid fill.\r\n       An actual vector icon lets color genuinely control it. */\r\n    color: var(--cta, #2F6B45);\r\n    transition: color .35s ease;\r\n    pointer-events: none;   /* click is handled by the field wrapper, not the glyph itself */\r\n  }\r\n  .ap-hsearch-icon svg {\r\n    width: 17px;\r\n    height: 17px;\r\n    display: block;\r\n  }\r\n  .ap-hsearch-field.ap-hsearch-open .ap-hsearch-icon {\r\n    /* Deep green from the page background, now reading as ink against\r\n       the cream pill instead of a light glyph on a dark one. */\r\n    color: var(--bg, #0B120D);\r\n  }\r\n\r\n  .ap-hsearch-field input {\r\n    flex: 1 1 auto;\r\n    min-width: 0;\r\n    width: 100%;\r\n    padding-right: 16px;\r\n    border: 0;\r\n    outline: 0;\r\n    background: transparent;\r\n    color: var(--bg, #0B120D);\r\n    font-family: \"Cormorant Garamond\", serif;\r\n    font-size: 13px;\r\n    letter-spacing: .02em;\r\n    opacity: 0;\r\n    pointer-events: none;\r\n    /* Closing: fade out fast and immediately, well before the pill has\r\n       finished shrinking, so text never looks squashed mid-collapse. */\r\n    transition: opacity .15s ease 0s;\r\n  }\r\n  .ap-hsearch-field.ap-hsearch-open input {\r\n    opacity: 1;\r\n    pointer-events: auto;\r\n    /* Opening: wait until the pill is most of the way open before the\r\n       text fades in, so it reveals into space that's already there. */\r\n    transition: opacity .3s ease .2s;\r\n  }\r\n  .ap-hsearch-field input::placeholder {\r\n    /* Same deep background-green as the input text, softened toward\r\n       transparent so it still reads as a placeholder rather than a value. */\r\n    color: rgba(11, 18, 13, .62);\r\n    text-transform: uppercase;\r\n    letter-spacing: .08em;\r\n    font-size: 11px;\r\n    font-weight: 600;   /* was default/normal - bumped for more presence at this size */\r\n  }\r\n","\r\n/* ============================================================\r\n   AROIDPEDIA - narrow-screen overflow (8.5.26)\r\n\r\n   Journal posts scrolled sideways on phones: measured live at a\r\n   375px viewport on /journal/amorphophallus-coudercii, the document\r\n   was 420px wide. TWO UNRELATED CAUSES, found by hiding each\r\n   candidate and re-reading scrollWidth rather than by eye.\r\n\r\n   1. THE NEXT/PREV PAGINATION - 41 of the 45px.\r\n      .item-pagination-link is capped at max-width:50% and is a flex\r\n      container, but its children default to min-width:auto, which\r\n      means they refuse to shrink below min-content. The next post's\r\n      title measured 189px inside a 165px link and shoved the arrow\r\n      icon out to x=420. min-width:0 restores shrinking.\r\n\r\n      This one is INTERMITTENT - it depends on the neighbouring\r\n      posts' title lengths, so it appears on some posts and not\r\n      others. /journal/alocasia-kondosapata does not overflow at all.\r\n      That is why it reads as \"sometimes\" rather than \"always\", and\r\n      why it is easy to mistake for something else on the page.\r\n\r\n   2. THE EYEBROW PILL - the remaining 4px. See .ap-eb-fit below.\r\n\r\n   Both live here rather than in Custom CSS on purpose: every rule\r\n   these override is !important, and this file loads after Custom\r\n   CSS, so a tie on specificity resolves here.\r\n   ============================================================ */\r\n.item-pagination-link { min-width: 0 !important; }\r\n.item-pagination-link .pagination-title-wrapper { min-width: 0 !important; overflow: hidden !important; }\r\n.item-pagination-link .item-pagination-title { overflow-wrap: anywhere; }\r\n\r\n/* ------------------------------------------------------------\r\n   THE EYEBROW FIT.\r\n\r\n   The pill is white-space:nowrap carrying fixed 32/36px padding and\r\n   .3em tracking at every screen width, so it cannot shrink:\r\n   \"Amorphophallus\" makes it 384px against a 375px screen, and it\r\n   hangs 4px off each side.\r\n\r\n   Deliberately NOT a breakpoint with a hand-picked padding value.\r\n   The genus runs from 8 characters (Alocasia) to 16\r\n   (Schismatoglottis), so any single number is either too loose for\r\n   the short names or still too wide for the long ones. Instead the\r\n   script measures the assembled pill and solves for one scale\r\n   factor k, applied to the padding and the letter-spacing - which\r\n   is where the slack actually is. At 375px those two account for\r\n   215px of the pill's 384px, so shedding the 33px it needs costs\r\n   k=0.85: visible only if you are looking for it.\r\n\r\n   Type size is left alone unless k bottoms out, which no real aroid\r\n   genus reaches - the worst case tested, Schismatoglottis at a\r\n   320px viewport, wanted k=0.55 against a 0.42 floor.\r\n\r\n   These rules only bite when the script adds .ap-eb-fit, and it only\r\n   does that when the pill genuinely overflows. At any width where\r\n   the eyebrow already fits, nothing here applies at all.\r\n\r\n   THE THREE-CLASS SELECTORS ARE DELIBERATE. Every declaration being\r\n   overridden in Custom CSS is !important, so !important alone loses;\r\n   specificity is what decides. Two classes would tie with\r\n   .ap-eyebrow-3part .ap-eyebrow-genus-link and lose to nothing.\r\n\r\n   THE :not(.ap-eyebrow-3part) IS ALSO DELIBERATE. Under 767px the\r\n   3-part cultivar eyebrow is restructured by Custom CSS into a\r\n   two-row grid with symmetric 14px/16px padding, and it already\r\n   fits. Scaling that padding turns it lopsided - confirmed live by\r\n   forcing the fit on and watching 14px 16px become\r\n   14px 21.6px 14px 19.2px. The script also guards against this, but\r\n   scoping it here means the mobile grid cannot be damaged even if\r\n   the script's guard is ever wrong.\r\n   ------------------------------------------------------------ */\r\n.blog-item-category-wrapper.ap-eb-fit:not(.ap-eyebrow-3part) .blog-item-category,\r\n.blog-item-category-wrapper.ap-eb-fit:not(.ap-eyebrow-3part) .ap-eyebrow-genus-link,\r\n.blog-item-category-wrapper.ap-eb-fit:not(.ap-eyebrow-3part) .ap-eyebrow-species {\r\n  letter-spacing: calc(.3em * var(--ap-eb-k, 1)) !important;\r\n  font-size: calc(12.5px * var(--ap-eb-f, 1)) !important;\r\n}\r\n.blog-item-category-wrapper.ap-eb-fit:not(.ap-eyebrow-3part) .blog-item-category {\r\n  padding: 14px calc(36px * var(--ap-eb-k, 1)) 14px calc(32px * var(--ap-eb-k, 1)) !important;\r\n}\r\n.blog-item-category-wrapper.ap-eb-fit:not(.ap-eyebrow-3part) .ap-eyebrow-genus-link,\r\n.blog-item-category-wrapper.ap-eb-fit:not(.ap-eyebrow-3part) .ap-eyebrow-species {\r\n  padding: 14px calc(32px * var(--ap-eb-k, 1)) 14px calc(36px * var(--ap-eb-k, 1)) !important;\r\n}\r\n\r\n/* The 3-part cultivar pill is a single row again at 768px and up, so\r\n   it can be fitted there like any other - but only there. The media\r\n   query is what makes that provable rather than merely intended. */\r\n@media screen and (min-width: 768px) {\r\n  .blog-item-category-wrapper.ap-eb-fit.ap-eyebrow-3part .blog-item-category,\r\n  .blog-item-category-wrapper.ap-eb-fit.ap-eyebrow-3part .ap-eyebrow-genus-link,\r\n  .blog-item-category-wrapper.ap-eb-fit.ap-eyebrow-3part .ap-eyebrow-species {\r\n    letter-spacing: calc(.3em * var(--ap-eb-k, 1)) !important;\r\n    font-size: calc(12.5px * var(--ap-eb-f, 1)) !important;\r\n  }\r\n  .blog-item-category-wrapper.ap-eb-fit.ap-eyebrow-3part .blog-item-category {\r\n    padding: 14px calc(36px * var(--ap-eb-k, 1)) 14px calc(32px * var(--ap-eb-k, 1)) !important;\r\n  }\r\n  .blog-item-category-wrapper.ap-eb-fit.ap-eyebrow-3part .ap-eyebrow-genus-link {\r\n    padding: 14px calc(26px * var(--ap-eb-k, 1)) !important;\r\n  }\r\n  .blog-item-category-wrapper.ap-eb-fit.ap-eyebrow-3part .ap-eyebrow-species {\r\n    padding: 14px calc(32px * var(--ap-eb-k, 1)) 14px calc(36px * var(--ap-eb-k, 1)) !important;\r\n  }\r\n}\r\n","\r\n  /* The journal's glass, verbatim: wash over deep green, blur+saturate,\r\n     soft inset top edge, .16s drop-in. */\r\n  .ap-suggest{\r\n    position:fixed;z-index:99999;box-sizing:border-box;\r\n    display:flex;align-items:stretch;\r\n    padding:7px;\r\n    border:1px solid rgba(255,255,255,.18);\r\n    border-radius:16px;\r\n    background:\r\n      linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,0) 46%),\r\n      rgba(11,18,13,.92);\r\n    -webkit-backdrop-filter:blur(13px) saturate(1.3);\r\n    backdrop-filter:blur(13px) saturate(1.3);\r\n    box-shadow:inset 0 1px 0 rgba(255,255,255,.38),\r\n               0 26px 60px -20px rgba(0,0,0,.8);\r\n    overflow:hidden;\r\n    font-family:'Manrope',sans-serif;\r\n    animation:ap-sg-drop .16s cubic-bezier(.33,1,.68,1) both;\r\n  }\r\n  @keyframes ap-sg-drop{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}\r\n  /* !important is load-bearing (law, 7.27): the panel is display:flex\r\n     now, and [hidden] loses to any display rule without it. */\r\n  .ap-suggest[hidden]{display:none!important}\r\n\r\n  /* ---- the rail ---- */\r\n  .ap-suggest__rail{\r\n    flex:none;width:168px;min-height:0;\r\n    display:flex;flex-direction:column;gap:3px;\r\n    padding:4px 10px 4px 3px;margin-right:9px;\r\n    border-right:1px solid rgba(200,214,191,.12);\r\n    overflow-y:auto;\r\n  }\r\n  .ap-suggest__tab{\r\n    -webkit-appearance:none;appearance:none;cursor:pointer;\r\n    display:flex;align-items:center;justify-content:space-between;gap:8px;\r\n    padding:8px 10px;border-radius:9px;\r\n    background:none;border:1px solid transparent;\r\n    font-family:'IBM Plex Mono',monospace;font-size:9px;line-height:1.4;\r\n    letter-spacing:.13em;text-transform:uppercase;text-align:left;\r\n    color:rgba(243,241,234,.55);\r\n    transition:color .18s ease,border-color .18s ease,background-color .18s ease;\r\n  }\r\n  .ap-suggest__tab:hover{color:#EFE9DC;border-color:rgba(200,214,191,.28)}\r\n  .ap-suggest__tab[disabled]{opacity:.32;cursor:default}\r\n  .ap-suggest__tab[disabled]:hover{color:rgba(243,241,234,.55);border-color:transparent}\r\n  .ap-suggest__tab-n{\r\n    flex:none;font-size:8.5px;letter-spacing:.06em;\r\n    color:rgba(200,214,191,.45);\r\n  }\r\n  .ap-suggest__tab[aria-pressed=\"true\"]{\r\n    color:#EFE9DC;border-color:rgba(200,214,191,.4);\r\n    background:rgba(200,214,191,.14);\r\n  }\r\n  .ap-suggest__tab[aria-pressed=\"true\"] .ap-suggest__tab-n{color:inherit}\r\n  /* pressed tabs wear their own kind's colour — the same four keys as\r\n     the journal facets and the archive cards */\r\n  .ap-suggest__tab[data-cat=\"species\"][aria-pressed=\"true\"]{background:rgba(56,80,47,.55);border-color:#6E7C5A;color:#E8F0E0}\r\n  .ap-suggest__tab[data-cat=\"cultivar\"][aria-pressed=\"true\"]{background:rgba(110,84,38,.55);border-color:rgba(184,151,90,.7);color:#F4E9CE}\r\n  .ap-suggest__tab[data-cat=\"hybrid\"][aria-pressed=\"true\"]{background:rgba(75,63,107,.55);border-color:rgba(125,107,168,.8);color:#EDE7F8}\r\n  .ap-suggest__tab[data-cat=\"hybrid-cultivar\"][aria-pressed=\"true\"]{background:rgba(44,81,112,.55);border-color:rgba(108,152,190,.8);color:#E3EEFB}\r\n\r\n  /* ---- the list ---- */\r\n  .ap-suggest__main{flex:1;min-width:0;min-height:0;overflow-y:auto;padding:2px}\r\n\r\n  .ap-suggest__row{\r\n    display:flex;align-items:center;gap:11px;\r\n    padding:6px 10px;border-radius:9px;cursor:pointer;\r\n    color:rgba(243,241,234,.82);\r\n  }\r\n  .ap-suggest__row.is-active{background:rgba(200,214,191,.1);color:#EFE9DC}\r\n\r\n  /* 44px thumb on a category-tinted plate. The dot only shows when the\r\n     plate is :empty — i.e. no image was indexed, or it 404'd and was\r\n     removed. (A pseudo-element paints over child content, so without\r\n     :empty the dot would sit ON the photograph.) */\r\n  .ap-suggest__thumb{\r\n    flex:none;width:44px;height:44px;position:relative;\r\n    border-radius:9px;overflow:hidden;\r\n    background:rgba(200,214,191,.07);\r\n    box-shadow:inset 0 0 0 1px rgba(200,214,191,.16);\r\n  }\r\n  .ap-suggest__thumb img{\r\n    width:100%;height:100%;object-fit:cover;display:block;\r\n  }\r\n  .ap-suggest__thumb:empty::after{\r\n    content:\"\";position:absolute;inset:0;margin:auto;\r\n    width:8px;height:8px;border-radius:50%;\r\n    background:rgba(200,214,191,.35);\r\n  }\r\n  /* plate dot in the journal card plate colours */\r\n  .ap-suggest__thumb--species:empty::after{background:#7E9E6B}\r\n  .ap-suggest__thumb--cultivar:empty::after{background:#C79E4E}\r\n  .ap-suggest__thumb--hybrid:empty::after{background:#9179C4}\r\n  .ap-suggest__thumb--hybrid-cultivar:empty::after{background:#7BA6CE}\r\n\r\n  .ap-suggest__thumb--genus{\r\n    display:flex;align-items:center;justify-content:center;\r\n    font-family:'Cormorant Garamond',serif;font-style:italic;\r\n    font-weight:600;font-size:21px;line-height:1;\r\n    color:rgba(200,214,191,.75);\r\n    background:rgba(200,214,191,.09);\r\n  }\r\n\r\n  /* Genus names in italic serif, per the site convention. The typed\r\n     portion is bolded rather than colour-shifted, so the italic\r\n     stays intact. */\r\n  .ap-suggest__name{\r\n    flex:1;min-width:0;\r\n    font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500;\r\n    font-size:17px;line-height:1.2;\r\n  }\r\n  .ap-suggest__name b{font-weight:700;color:#fff}\r\n  .ap-suggest .ap-rom{font-style:normal}\r\n  /* Genus rows keep the italic serif; entry rows are set in Manrope so\r\n     the two kinds of result are distinguishable at a glance. Names\r\n     wrap to two lines rather than ellipsizing (v8) — the clamp keeps\r\n     one runaway title from pushing the list off screen. */\r\n  .ap-suggest__row:not(.ap-suggest__row--genus) .ap-suggest__name{\r\n    font-family:'Manrope',sans-serif;font-style:normal;font-weight:500;\r\n    font-size:13.5px;letter-spacing:.01em;line-height:1.35;\r\n    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;\r\n    overflow:hidden;\r\n  }\r\n  .ap-suggest__row:not(.ap-suggest__row--genus) .ap-suggest__name b{color:#fff}\r\n\r\n  .ap-suggest__cat{\r\n    font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:.16em;\r\n    text-transform:uppercase;color:rgba(200,214,191,.4);flex:none;\r\n  }\r\n  .ap-suggest__n{\r\n    font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.06em;\r\n    color:rgba(200,214,191,.5);flex:none;\r\n  }\r\n\r\n  /* Fallback row, visually separated from the list. */\r\n  .ap-suggest__row--search{\r\n    justify-content:flex-start;\r\n    margin-top:4px;padding-top:12px;\r\n    border-top:1px solid rgba(200,214,191,.12);\r\n    border-radius:0 0 9px 9px;\r\n    font-size:12px;letter-spacing:.02em;\r\n    color:rgba(243,241,234,.6);\r\n  }\r\n  .ap-suggest__row--search svg{flex:none;opacity:.65}\r\n\r\n  .ap-suggest__main::-webkit-scrollbar,\r\n  .ap-suggest__rail::-webkit-scrollbar{width:8px}\r\n  .ap-suggest__main::-webkit-scrollbar-thumb,\r\n  .ap-suggest__rail::-webkit-scrollbar-thumb{background:rgba(200,214,191,.22);border-radius:8px}\r\n  .ap-suggest__main::-webkit-scrollbar-track,\r\n  .ap-suggest__rail::-webkit-scrollbar-track{background:transparent}\r\n\r\n  /* ---- narrow: the rail becomes a pill row on top ---- */\r\n  .ap-suggest--narrow{flex-direction:column}\r\n  .ap-suggest--narrow .ap-suggest__rail{\r\n    width:auto;flex-direction:row;\r\n    overflow-x:auto;overflow-y:hidden;\r\n    padding:2px 2px 8px;margin:0 0 6px;\r\n    border-right:0;border-bottom:1px solid rgba(200,214,191,.12);\r\n  }\r\n  .ap-suggest--narrow .ap-suggest__tab{flex:none;padding:6px 9px}\r\n  .ap-suggest--narrow .ap-suggest__rail::-webkit-scrollbar{height:6px}\r\n\r\n  @media screen and (max-width:767px){\r\n    .ap-suggest__row--genus .ap-suggest__name{font-size:16px}\r\n  }\r\n","\r\n  /* Transparent anchor over the whole card. Sits above the card but\r\n     below its own headings and controls, so text selection and any\r\n     real links inside keep working. */\r\n  .ap-result-link{\r\n    position:absolute;\r\n    inset:0;\r\n    z-index:1;\r\n    display:block;\r\n    background:transparent;\r\n    -webkit-user-select:none;\r\n    user-select:none;\r\n  }\r\n  [data-ap-linked=\"1\"] h1,\r\n  [data-ap-linked=\"1\"] h2,\r\n  [data-ap-linked=\"1\"] h3,\r\n  [data-ap-linked=\"1\"] h4,\r\n  [data-ap-linked=\"1\"] a:not(.ap-result-link),\r\n  [data-ap-linked=\"1\"] button{\r\n    position:relative;\r\n    z-index:2;\r\n  }\r\n  [data-ap-linked=\"1\"]{cursor:pointer}\r\n\r\n  /* The overlay is now the card's keyboard stop, so give it a visible\r\n     focus ring - the div's tabindex was removed. */\r\n  .ap-result-link:focus-visible{\r\n    outline:2px solid var(--sage-bright, #A9C199);\r\n    outline-offset:3px;\r\n    border-radius:6px;\r\n  }\r\n","\r\n/* NO ARITHMETIC IN THIS BLOCK. It is safe here (code injection is\r\n   not LESS-compiled), but keeping it arithmetic-free means these\r\n   rules can be moved back into Custom CSS unchanged if the file\r\n   ever has room again. Anything that needs adding up is either\r\n   pre-added into a single knob (--ap-subnav-bridge) or computed in\r\n   the script, where arithmetic is free. */\r\n:root {\r\n  /* Gap between the parent dropdown's left edge and the flyout's\r\n     right edge. ZERO ON PURPOSE - the two panels meet flush and\r\n     read as one surface. An earlier 8px gap made the flyout look\r\n     like a separate card floating beside the menu. READ BY THE\r\n     SCRIPT, which does the positioning arithmetic. */\r\n  --ap-subnav-gap:    0px;\r\n\r\n  /* Width floor. 260px is the parent dropdown's own min-width, so\r\n     the two panels come out the same width. */\r\n  --ap-subnav-minw:   260px;\r\n\r\n  /* Width of the invisible hover bridge = the dropdown's own 12px\r\n     padding + its 1px border, i.e. the strip between the parent\r\n     row's left edge and the panel's left edge, which belongs to\r\n     neither element. A MEASUREMENT, not a preference: too short\r\n     and the menu closes while the cursor is mid-travel. If\r\n     --ap-subnav-gap ever goes back above 0, add it to this. */\r\n  --ap-subnav-bridge: 13px;\r\n\r\n  /* How far the panel travels on open. It starts tucked BEHIND the\r\n     parent dropdown and slides out to the left, so it reads as\r\n     emerging from the menu rather than appearing beside it. */\r\n  --ap-subnav-slide:  14px;\r\n}\r\n\r\n/* ---- The flyout panel -------------------------------------\r\n   WHY IT IS A SIBLING OF THE DROPDOWN PANEL, NOT A CHILD OF THE\r\n   ROW. Two constraints, both measured on the live page, rule out\r\n   nesting it inside .header-nav-folder-content:\r\n     1. That panel is `overflow: hidden`, so anything nested inside\r\n        it that sticks out sideways is CLIPPED AWAY entirely.\r\n     2. That panel carries `backdrop-filter: blur(6px)`, making it\r\n        a BACKDROP ROOT - which silently no-ops backdrop-filter on\r\n        every DESCENDANT. A nested flyout could never carry the\r\n        glass blur, so it could never match the menu it belongs to.\r\n        (Same trap that forced the header glass onto #header::before.)\r\n   Appending to .header-nav-item--folder clears both, and keeps the\r\n   flyout a descendant of the folder item so the parent dropdown\r\n   stays :hover-ed and never closes out from under it.\r\n\r\n   `top`, `left` and `right` below are only a resting position -\r\n   the script measures the row that opened the flyout and writes\r\n   the real values inline before ever revealing it.\r\n\r\n   ⚠ THESE THREE CARRY NO !important, DELIBERATELY. An inline style\r\n   without !important LOSES to a stylesheet rule that has it, so\r\n   marking them !important here silently defeats the script: the\r\n   panel would sit wherever this rule says regardless of what was\r\n   measured, and the open-to-the-right fallback could never fire at\r\n   all. Nothing on the site targets .ap-subnav, so there is nothing\r\n   for them to out-specify anyway. Leave them plain. */\r\n.header-nav-item--folder .ap-subnav {\r\n  position: absolute !important;\r\n  top: 0;\r\n  left: auto;\r\n  right: 100%;\r\n\r\n  /* BELOW the dropdown panel, which computes z-index:10. This is\r\n     what makes the open animation read as the flyout sliding OUT\r\n     FROM UNDER the menu instead of a card sliding over it: during\r\n     the travel its right edge is behind the parent's frosted\r\n     glass, and the parent's backdrop-filter even blurs it. At rest\r\n     the two are flush, so nothing overlaps and the stacking is\r\n     invisible. Must stay below the panel's z-index for the effect;\r\n     still positive, so it stays above all page content. */\r\n  z-index: 9 !important;\r\n\r\n  min-width: var(--ap-subnav-minw) !important;\r\n  margin: 0 !important;\r\n  padding: 12px !important;\r\n  text-align: left !important;\r\n\r\n  /* Same glass family as .header-nav-folder-content, reading the\r\n     SAME two knobs, so the two panels can never drift apart. */\r\n  background: var(--ap-home-menu-bg, rgba(8, 14, 10, .62)) !important;\r\n  -webkit-backdrop-filter: blur(var(--ap-home-menu-blur, 6px)) !important;\r\n  backdrop-filter: blur(var(--ap-home-menu-blur, 6px)) !important;\r\n  border: 1px solid rgba(255, 255, 255, .08) !important;\r\n\r\n  /* THE SEAM. The flyout meets the dropdown flush, so the edge\r\n     where they join is squared off and its own right border is\r\n     dropped - otherwise two hairlines sit side by side and the\r\n     panels read as two separate cards. The parent's left border\r\n     becomes the single fold line between two facets of one glass\r\n     surface. The outer three corners keep the house 12px. */\r\n  border-right: none !important;\r\n  border-radius: 12px 0 0 12px !important;\r\n\r\n  /* Shadow throws LEFT and down, away from the seam. The parent's\r\n     own shadow (0 18px 40px) would darken the join if this one\r\n     spread rightward into it. */\r\n  box-shadow: -14px 20px 42px rgba(0, 0, 0, .34) !important;\r\n\r\n  /* visibility, not display: the panel keeps its layout box while\r\n     closed, and the script measures its inner padding BEFORE\r\n     revealing it. A display:none panel measures as zero. */\r\n  opacity: 0;\r\n  visibility: hidden;\r\n  pointer-events: none;\r\n  transform: translateX(var(--ap-subnav-slide));\r\n  /* Exit is quicker than entry and eases IN - the standard pairing:\r\n     arriving should feel unhurried, leaving should get out of the\r\n     way. */\r\n  transition:\r\n    opacity .13s ease,\r\n    transform .17s cubic-bezier(.4, 0, .7, 1),\r\n    visibility 0s linear .3s;\r\n}\r\n.header-nav-item--folder .ap-subnav.ap-sub-open {\r\n  opacity: 1;\r\n  visibility: visible;\r\n  pointer-events: auto;\r\n  transform: translateX(0);\r\n  /* Decelerating curve: quick off the mark, settles softly. */\r\n  transition:\r\n    opacity .19s ease,\r\n    transform .29s cubic-bezier(.16, .84, .34, 1);\r\n  transition-delay: 0s;\r\n}\r\n\r\n/* Hover bridge. The 13px of dropdown padding between the parent\r\n   row's left edge and the panel's left edge belongs to neither\r\n   element, and crossing it used to close the menu.\r\n\r\n   IT HAS TO LIVE ON THE ROW, NOT ON THE FLYOUT. The obvious place\r\n   is an ::after on the flyout reaching rightward - but the flyout\r\n   now sits BELOW the dropdown in the stacking order, and that\r\n   strip is inside the dropdown's own box, so the dropdown wins\r\n   every hit-test there and the bridge is dead (measured: 13 of 16\r\n   sample points missed). Hung off the row instead it sits inside\r\n   the dropdown's stacking context and stays hit-testable.\r\n\r\n   Only rows the script actually wired get one. */\r\n.header-nav-folder-item[data-ap-subnav=\"1\"] {\r\n  position: relative;\r\n}\r\n.header-nav-folder-item[data-ap-subnav=\"1\"]::before {\r\n  content: \"\";\r\n  position: absolute;\r\n  top: 0;\r\n  bottom: 0;\r\n  right: 100%;\r\n  width: var(--ap-subnav-bridge);\r\n}\r\n\r\n/* ---- Flyout rows ------------------------------------------\r\n   These links live OUTSIDE .header-nav-folder-content, so none of\r\n   the dropdown's own row styling reaches them. Every property is\r\n   restated on purpose - keep the two in step by hand if the\r\n   dropdown rows are ever restyled.\r\n\r\n   LINE-HEIGHT IS PART OF \"EVERY PROPERTY\". Leaving it out is what\r\n   made these rows visibly taller than the dropdown's: they\r\n   inherited 34.624px from the page while the dropdown rows get\r\n   23.4px, so every flyout row came out 56.63px against the\r\n   dropdown's 45.40px. An 11.2px difference per row reads wrong\r\n   immediately in a panel that is meant to continue the menu\r\n   beside it. 1.3 x 18px = the 23.4px the dropdown computes;\r\n   written as a ratio so it tracks the font-size above. */\r\n.header-nav-item--folder .ap-subnav a {\r\n  display: flex !important;\r\n  align-items: center !important;\r\n  justify-content: space-between !important;\r\n  gap: 18px !important;\r\n  font-family: \"Cormorant Garamond\", serif !important;\r\n  font-style: normal !important;\r\n  font-weight: 500 !important;\r\n  font-size: 18px !important;\r\n  line-height: 1.3 !important;\r\n  letter-spacing: 0 !important;\r\n  text-transform: none !important;\r\n  text-decoration: none !important;\r\n  color: #EEF0E8 !important;\r\n  border-radius: 8px !important;\r\n  padding: 11px 14px !important;\r\n  transition: background .16s ease, color .16s ease !important;\r\n}\r\n.header-nav-item--folder .ap-subnav a:hover,\r\n.header-nav-item--folder .ap-subnav a:focus-visible {\r\n  background: rgba(200, 214, 191, .08) !important;\r\n  color: #fff !important;\r\n}\r\n\r\n/* ---- The \"there is more in here\" cue -----------------------\r\n   A chevron on the parent row's right edge, pointing LEFT toward\r\n   where the flyout opens. It rides the row's existing\r\n   space-between, which is what keeps every label in the dropdown\r\n   aligned at the same left edge, and is where .ap-genus-count sits\r\n   in the GENERA dropdown - so the two menus stay consistent.\r\n   Drawn from two borders on a rotated box, so it needs no icon\r\n   font and inherits the row's colour.\r\n     rotate(45deg)   points LEFT   <- current, matches the flyout\r\n     rotate(-135deg) points RIGHT  <- conventional \"has submenu\" */\r\n.header-nav-folder-item a .ap-subcue {\r\n  flex: 0 0 auto !important;\r\n  width: 6px;\r\n  height: 6px;\r\n  border-left: 1.5px solid currentColor !important;\r\n  border-bottom: 1.5px solid currentColor !important;\r\n  /* translate BEFORE rotate, so the nudge below travels straight\r\n     left rather than diagonally in the rotated frame. */\r\n  transform: translateX(0) rotate(45deg);\r\n  margin-right: 2px;\r\n  opacity: .5;\r\n  transition:\r\n    opacity .16s ease,\r\n    transform .22s cubic-bezier(.16, .84, .34, 1);\r\n}\r\n.header-nav-folder-item a:hover .ap-subcue,\r\n.header-nav-folder-item a:focus-visible .ap-subcue {\r\n  opacity: 1;\r\n}\r\n\r\n/* ---- The parent row stays lit while its flyout is open -----\r\n   THE SINGLE BIGGEST FIX FOR \"IT FEELS DISJOINTED\". Without this\r\n   the row's highlight dies the instant the cursor steps off it\r\n   onto the flyout - so at the exact moment the reader is looking\r\n   at the submenu, nothing in the parent menu shows where it came\r\n   from, and the two panels stop looking related. Holding the\r\n   highlight keeps a continuous lit path from the row into the\r\n   panel. The script adds .ap-sub-parent for the life of the open\r\n   state; the values match the row's own :hover exactly. */\r\n.header-nav-folder-item.ap-sub-parent > a {\r\n  background: rgba(200, 214, 191, .08) !important;\r\n  color: #fff !important;\r\n}\r\n.header-nav-folder-item.ap-sub-parent > a .ap-subcue {\r\n  opacity: 1;\r\n  transform: translateX(-3px) rotate(45deg);   /* leans toward the panel */\r\n}\r\n\r\n/* Motion is decoration here - the menu is fully usable without it. */\r\n@media (prefers-reduced-motion: reduce) {\r\n  .header-nav-item--folder .ap-subnav,\r\n  .header-nav-item--folder .ap-subnav.ap-sub-open {\r\n    transform: none;\r\n  }\r\n  .header-nav-folder-item.ap-sub-parent > a .ap-subcue {\r\n    transform: rotate(45deg);\r\n  }\r\n}\r\n\r\n/* ---- Keep the parent dropdown open -------------------------\r\n   DELIBERATELY A SEPARATE CLASS from the \"NAV FOLDER keeper\"\r\n   script's .ap-hold. That keeper starts its own 350ms close timer\r\n   the moment the cursor leaves the dropdown panel - and stepping\r\n   onto the flyout IS leaving the panel, since the flyout is a\r\n   sibling of it. Two scripts sharing one class would race:\r\n   whichever timer fired last would win, and the dropdown would\r\n   blink shut under a menu the reader was still using. */\r\n.header-nav-item--folder.ap-subhold .header-nav-folder-content {\r\n  display: block !important;\r\n  visibility: visible !important;\r\n  opacity: 1 !important;\r\n  pointer-events: auto !important;\r\n}\r\n\r\n/* ---- Mobile ------------------------------------------------\r\n   No hover on a phone, so the flyout is switched off and the\r\n   children are folded into the full-screen overlay as indented\r\n   rows under their parent. Without this, /alocasia-pollination\r\n   would be reachable from the menu on desktop and from nowhere at\r\n   all on a phone. */\r\n@media screen and (max-width: 767px) {\r\n  .ap-subnav,\r\n  .ap-subcue {\r\n    display: none !important;\r\n  }\r\n\r\n  .header-menu .ap-subnav-mobile .header-menu-nav-item-content {\r\n    position: relative !important;\r\n    padding-left: 30px !important;\r\n    font-size: 21px !important;   /* parent rows are 27px */\r\n    opacity: .84;\r\n  }\r\n  /* Short leading rule: says \"child of the row above\" without\r\n     relying on the indent alone. */\r\n  .header-menu .ap-subnav-mobile .header-menu-nav-item-content::before {\r\n    content: \"\";\r\n    position: absolute;\r\n    left: 2px;\r\n    top: 50%;\r\n    width: 16px;\r\n    height: 1px;\r\n    background: currentColor;\r\n    opacity: .45;\r\n  }\r\n}\r\n","\r\n/* ==================================================================\r\n   TOKENS\r\n   Measured off the live site rather than guessed. --ground and --ink\r\n   are the body values; --accent is the menu-page hero green and\r\n   --sage is the article system's accent — two different greens, kept\r\n   apart on purpose (see the Amorphophallus hero's own note).\r\n   ================================================================== */\r\n.apsc{\r\n  --ground:#0b120d;\r\n  --ink:#f3f1ea;\r\n  --ink-bright:#f7f5ef;\r\n  --accent:#afc090;          /* menu-page green — headings, map fill  */\r\n  --sage:#c8d6bf;            /* article accent — italic subtitles     */\r\n  --deep:#2f6b45;\r\n  --rule:rgba(243,241,234,.13);\r\n  --rule-soft:rgba(243,241,234,.07);\r\n  --panel:rgba(243,241,234,.035);\r\n  --dim:rgba(243,241,234,.62);\r\n  --dimmer:rgba(243,241,234,.42);\r\n\r\n  --serif:\"Cormorant Garamond\",Georgia,serif;\r\n  --body:\"Helvetica Neue\",Helvetica,Arial,sans-serif;\r\n  --mono:\"IBM Plex Mono\",ui-monospace,SFMono-Regular,Menlo,monospace;\r\n\r\n  --gap:clamp(22px,3.4vw,40px);\r\n  --measure:74ch;\r\n\r\n  isolation:isolate;         /* the lightbox and the map hover layer\r\n                                stay inside the card's own stacking\r\n                                context, so nothing of the site's can\r\n                                punch through them */\r\n  display:block;\r\n  color:var(--ink);\r\n  font-family:var(--body);\r\n  font-size:15px;\r\n  line-height:1.62;\r\n  -webkit-font-smoothing:antialiased;\r\n}\r\n.apsc *{box-sizing:border-box;}\r\n.apsc a{color:var(--sage);text-decoration:none;border-bottom:1px solid rgba(200,214,191,.32);transition:color .15s ease,border-color .15s ease;}\r\n.apsc a:hover{color:var(--ink-bright);border-color:var(--ink-bright);}\r\n.apsc a:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:2px;}\r\n.apsc em,.apsc i{font-style:italic;}\r\n\r\n/* hidden source blocks. A class, not an inline style, so it is one\r\n   toggle to undo and so Squarespace's own inline styles do not fight\r\n   it. */\r\n.apsc-hidden{display:none !important;}\r\n\r\n/* ---- header ----------------------------------------------------\r\n   CENTRED, because the theme's title is. The live blog item runs\r\n   tweak-blog-item-text-alignment-center and meta-position-above-title,\r\n   so the pill and the H1 are both centred on the real page — an\r\n   earlier mockup drew them left and made it look otherwise. The lead\r\n   line under the title is part of that masthead and has to agree with\r\n   it; left-aligning it under a centred title was the one thing that\r\n   actually looked wrong.\r\n\r\n   The BODY of the card stays left-aligned. A centred masthead over\r\n   left-aligned columns is a normal editorial arrangement; centred\r\n   body copy is not. */\r\n.apsc-head{padding:0 0 22px;border-bottom:1px solid var(--rule);text-align:center;}\r\n/* ---- the eyebrow pill ------------------------------------------\r\n   The site's own two-tone pill — green half / gold rhombus / dark\r\n   genus half — reproduced here from the live values so the card's\r\n   copy and the theme's are the same object. It is only ever drawn\r\n   when the theme is NOT already showing one (see dupCats in the\r\n   script); on a normal journal entry the theme's pill is above the\r\n   title already and this never renders. It exists so the header\r\n   still looks right if the meta position is ever changed.\r\n\r\n   --apsc-eyebrow-scale is the \"make it smaller\" knob: 1 is the\r\n   theme's exact size, .88 is the card's default. It scales the type,\r\n   the padding and the rhombus together, so the proportions hold. */\r\n.apsc-eyebrow{\r\n  --apsc-eyebrow-scale:.88;\r\n  margin:0 0 18px; display:flex; justify-content:center;\r\n}\r\n.apsc-eyebrow__pill{\r\n  display:inline-flex; align-items:center;\r\n  font-family:var(--serif);\r\n  font-size:calc(12.5px * var(--apsc-eyebrow-scale));\r\n  font-weight:600; letter-spacing:.3em; text-transform:uppercase;\r\n  line-height:1;\r\n}\r\n.apsc-eyebrow__pill a{border:0;}\r\n.apsc-eyebrow__cat,\r\n.apsc-eyebrow__genus{\r\n  padding:calc(14px * var(--apsc-eyebrow-scale)) calc(32px * var(--apsc-eyebrow-scale));\r\n  white-space:nowrap;\r\n}\r\n.apsc-eyebrow__cat{\r\n  background:linear-gradient(135deg,#38502f,#2b3e24);\r\n  color:#f2f7ec;\r\n  border-radius:999px 0 0 999px;\r\n  padding-right:calc(36px * var(--apsc-eyebrow-scale));\r\n}\r\n.apsc-eyebrow__genus{\r\n  background:var(--ground);\r\n  color:#f0e6c4;\r\n  border-radius:0 999px 999px 0;\r\n  padding-left:calc(36px * var(--apsc-eyebrow-scale));\r\n}\r\n.apsc-eyebrow__genus:hover{color:#fff6dd;}\r\n/* the rhombus. Its 4px ring is the ground colour, which is what makes\r\n   it read as sitting ON the seam rather than beside it. */\r\n.apsc-eyebrow__gem{\r\n  width:calc(22px * var(--apsc-eyebrow-scale));\r\n  height:calc(22px * var(--apsc-eyebrow-scale));\r\n  margin:0 calc(-9px * var(--apsc-eyebrow-scale));\r\n  background:linear-gradient(135deg,#f0d489,#c9a95c);\r\n  border-radius:4px; transform:rotate(45deg);\r\n  box-shadow:0 0 0 4px var(--ground), 0 0 18px rgba(232,200,122,.35);\r\n  z-index:1; flex:none;\r\n}\r\n@media (max-width:600px){\r\n  .apsc-eyebrow{--apsc-eyebrow-scale:.72;}\r\n}\r\n/* ---- THE NATIVE TITLE'S LEADING  (FILE v33, 8.11.26) -------------\r\n   Squarespace's own h1.entry-title (the big binomial ABOVE the card)\r\n   computed line-height 1.30 against 0.88–1.02 on every other\r\n   Cormorant display on the site — two-line names like AMORPHOPHALLUS\r\n   CURVISTYLIS visibly floated apart (site review §1.4). .95 = the\r\n   hero family's leading. ⚠ !important is load-bearing: the theme\r\n   sheet reaches this h1 with selectors a code-block rule cannot\r\n   outrank — measured live, a plain body-end rule does not take. */\r\n.blog-item-title h1.entry-title{ line-height:.95 !important; }\r\n\r\n.apsc-title{\r\n  margin:0;font-family:var(--serif);font-weight:400;\r\n  font-size:clamp(2rem,5.2vw,3.35rem);line-height:1.02;\r\n  letter-spacing:-.005em;color:var(--ink-bright);hyphens:none;\r\n}\r\n/* the binomial stays upright in the title — it is the page's subject,\r\n   not a citation of one (law 14). */\r\n.apsc-title .apsc-up{font-style:normal;}\r\n.apsc-authority{\r\n  margin:10px auto 0;font-family:var(--serif);font-style:italic;\r\n  font-size:clamp(15px,2vw,18.5px);color:var(--sage);letter-spacing:.01em;\r\n  /* a measure, so a long protologue citation does not run the full\r\n     872px as a single centred line */\r\n  max-width:62ch;\r\n}\r\n\r\n/* A long protologue is a paragraph, not a masthead line.\r\n   NOT two columns. Columns work in print because the column height is\r\n   bounded by the page; on a web page a two-column block makes the\r\n   reader travel all the way down the first column and back up to the\r\n   top of the second before the article has even started, and a\r\n   protologue that fills six lines and two spills the balance badly.\r\n   One column, set to a measure — about 68 characters, the range where\r\n   the eye finds the start of the next line without hunting.\r\n\r\n   Roman, not italic. The short citation line stays italic because it\r\n   is one line; a thousand characters of italic is tiring, and in\r\n   botanical setting the protologue is roman anyway — it is the names\r\n   inside it that are italic, which the site's own italicizer handles. */\r\n.apsc-authority--long{\r\n  max-width:68ch;\r\n  text-align:left;\r\n  font-style:normal;\r\n  font-size:clamp(15px,1.8vw,17px);\r\n  line-height:1.66;\r\n  color:rgba(200,214,191,.82);\r\n}\r\n.apsc-authority--long em,\r\n.apsc-authority--long i,\r\n.apsc-authority--long .ap-genus-italic{font-style:italic;}\r\n\r\n/* The clickable parentage, directly under the formula. Smaller and\r\n   quieter than the formula line — it is the same statement with links\r\n   on it, not a second headline. */\r\n.apsc-parentage{\r\n  margin:6px auto 0;max-width:70ch;\r\n  font-family:var(--body);font-size:13.5px;line-height:1.6;\r\n  color:var(--dim);\r\n}\r\n.apsc-parentage a{color:var(--sage);}\r\n\r\n/* When the theme is already showing the title immediately above, the\r\n   card's head sits directly under it and the default gap reads as a\r\n   gulf — particularly on a hybrid, where the formula belongs tight to\r\n   the name. --apsc-pull claws back the content area's top margin. */\r\n.apsc--tight{margin-top:var(--apsc-pull,-16px);}\r\n.apsc--tight .apsc-head{padding-top:0;}\r\n.apsc--tight .apsc-authority{margin-top:6px;}\r\n\r\n/* ---- name lists (cultivars, hybrids) ---------------------------\r\n   ONE PER LINE. A two-column set of these reads as a grid you have to\r\n   scan in two directions, and half the entries carry a parenthetical\r\n   cross that wraps anyway. A plain vertical list is read straight\r\n   down, which is what a list of names is for. */\r\n.apsc-names{\r\n  margin:0;padding:0;list-style:none;max-width:var(--measure);\r\n}\r\n.apsc-names li{\r\n  margin:0 0 7px;padding-left:15px;position:relative;\r\n  font-size:14.5px;line-height:1.5;\r\n}\r\n.apsc-names li::before{\r\n  content:\"\";position:absolute;left:0;top:.62em;\r\n  width:4px;height:4px;border-radius:50%;background:var(--accent);opacity:.75;\r\n}\r\n\r\n\r\n/* ---- the top slab: hero photo + facts -------------------------- */\r\n.apsc-top{\r\n  display:grid;gap:var(--gap);align-items:start;\r\n  grid-template-columns:minmax(0,1.35fr) minmax(260px,.85fr);\r\n  padding:var(--gap) 0;\r\n}\r\n/* v19: the left cell is a column — hero, then the whole body. On a\r\n   phone the wrapper dissolves (display:contents) and order restores\r\n   the reading sequence hero → At a glance → body. */\r\n.apsc-colmain{min-width:0;}\r\n/* v20: the wide tail — the closing sections at full card width */\r\n.apsc-wide{display:grid;gap:var(--gap);}\r\n\r\n/* ---- v72: THE STORY PLATE ----------------------------------------\r\n   A feature narrative about the species, given the card's full width\r\n   and its own frame. Built from the site's existing glass: the nav\r\n   bar's blur under a film whose colour IS the panel composite, so it\r\n   reads as a lifted pane rather than a new colour. The gold hairline\r\n   is the eyebrow rhombus' accent, used once, at the top edge only -\r\n   a full gold border would shout louder than the plant. */\r\n/* v76: THE CARD MUST NOT OUTRUN ITS CONTENT. Measured across widths,\r\n   .apsc-story is fluid and caps at 1234px, so on a 1728px+ screen the\r\n   620px text column left 281px of empty glass EACH SIDE (123px at the\r\n   1280px I had been testing at - the whole reason I kept declaring it\r\n   fixed). Text cannot simply grow to meet it: past ~85 characters a\r\n   line is hard to track however much air it has. So the panel is\r\n   capped instead, and the two meet in the middle. */\r\n.apsc-story{\r\n  /* ⚠ width:100% is LOAD-BEARING. .apsc-wide is a GRID, and auto\r\n     margins on a grid item make it SHRINK-TO-FIT rather than fill its\r\n     track - capping with max-width alone collapsed the whole panel to\r\n     671px at every viewport. A definite width restores the stretch and\r\n     max-width then does the capping. */\r\n  width:100%;max-width:960px;justify-self:center;\r\n  margin-left:auto;margin-right:auto;\r\n  position:relative;padding:26px 26px 24px;border-radius:3px;\r\n  background:rgba(19,26,21,.55);\r\n  -webkit-backdrop-filter:blur(13px);backdrop-filter:blur(13px);\r\n  border:1px solid var(--rule);\r\n  box-shadow:inset 0 1px 0 rgba(255,255,255,.055);\r\n}\r\n@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))){\r\n  /* a film alone over the page passes a SHARP ghost of the text\r\n     underneath - worse than no glass. Fall back to the solid tone. */\r\n  .apsc-story{background:#131a15;}\r\n}\r\n.apsc-story::before{\r\n  content:\"\";position:absolute;left:0;right:0;top:0;height:1px;\r\n  background:linear-gradient(90deg,\r\n    rgba(232,200,122,0) 0%, rgba(232,200,122,.45) 18%,\r\n    rgba(232,200,122,.45) 82%, rgba(232,200,122,0) 100%);\r\n}\r\n.apsc-story__eyebrow{\r\n  font-family:var(--mono);font-size:9.5px;letter-spacing:.28em;\r\n  text-transform:uppercase;color:#e8c87a;margin-bottom:10px;\r\n}\r\n.apsc-story__title{\r\n  margin:0 0 14px;font-family:\"Cormorant Garamond\",Georgia,serif;\r\n  font-size:clamp(21px,2.4vw,29px);font-weight:600;line-height:1.18;\r\n  letter-spacing:.005em;color:var(--ink-bright);\r\n}\r\n/* v73: SET FOR READING, THEN CENTRED. Measured on the live page, the\r\n   story ran 617px at 15px = 87 CHARACTERS PER LINE - past the readable\r\n   limit (45-75) and LONGER than the article body's own 76, because in\r\n   the wide tail nothing constrained --measure (74ch) the way the body\r\n   column does. The empty space was the SYMPTOM: type set too wide and\r\n   too small for six thousand characters of narrative. Widening it\r\n   further would have made the reading worse, not better.\r\n   32em at 16px lands at ~68 characters; the column is centred so the\r\n   leftover width reads as a page margin rather than a void on one\r\n   side, and the leading opens to 1.7 for long-form. The plate keeps\r\n   the full width - it is a map, and wants every pixel. */\r\n/* v74: 36em ≈ 76 characters - the SAME measure the article body already\r\n   reads at, so the story is no longer the odd one out (user wanted it\r\n   wider than v73's 64; 76 is the top of the readable band, not past it).\r\n   ⚠⚠ LINE-HEIGHT MUST BE SET ON THE PARAGRAPH, NOT THE CONTAINER. v73\r\n   put line-height:1.7 on .apsc-story__prose and INHERITANCE LOSES to any\r\n   rule that matches the <p> itself - the theme sets one, so every\r\n   paragraph rendered at 22.4px (1.4) while the first, which I had styled\r\n   directly, got 27.5px. That mismatch is exactly what the user's eye\r\n   caught. Same trap as \".ap-panel p beats a bare child class\". */\r\n/* v75: 620px IN PIXELS ON PURPOSE. v74 asked for 36em and got 540px,\r\n   not the ~576 intended: `em` resolves against THIS element's own\r\n   font-size, and the font-size now lives on the <p> - so 36em measured\r\n   against the card's inherited 15px. A reading measure must never\r\n   depend on where the font-size happens to be declared.\r\n   620px at 16px is ~82 characters. That is longer than the classic\r\n   45-75 band, and it is the right call HERE because the leading is now\r\n   27.5px (1.72): line-length tolerance rises with leading, and the\r\n   pre-v73 version that genuinely read badly was 617px at 15px with\r\n   22.4px leading - same width, two-thirds the air. Third request for\r\n   \"wider\", so this is a deliberate, measured trade, not a drift. */\r\n.apsc-story__head{max-width:min(100%,680px);margin-left:auto;margin-right:auto;}\r\n.apsc-story__prose{\r\n  max-width:min(100%,680px);margin-left:auto;margin-right:auto;\r\n  color:rgba(243,241,234,.86);\r\n}\r\n.apsc-story__prose p{\r\n  font-size:16px;line-height:1.72;margin:0 0 1.05em;\r\n}\r\n.apsc-story__prose p:last-child{margin-bottom:0;}\r\n.apsc-story__prose strong{color:var(--ink-bright);font-weight:600;}\r\n.apsc-story__prose em{color:var(--sage);}\r\n/* the opening paragraph carries the reader in - a shade larger, and its\r\n   leading matched to the body's PIXEL pitch (17 x 1.62 = 27.5 vs\r\n   16 x 1.72 = 27.5) so the rhythm never breaks between paragraphs */\r\n.apsc-story__prose p:first-child{\r\n  font-size:17px;line-height:1.62;color:rgba(243,241,234,.94);\r\n}\r\n.apsc-story__plate{margin:20px 0 0;}\r\n.apsc-story__plate img{\r\n  display:block;width:100%;height:auto;border:1px solid var(--rule);\r\n  background:rgba(243,241,234,.04);\r\n}\r\n.apsc-story__cap{\r\n  font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;\r\n  text-transform:uppercase;color:var(--dim);margin-top:8px;\r\n}\r\n.apsc-story__picks{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;}\r\n.apsc-story__pick{\r\n  font-family:var(--mono);font-size:9.5px;letter-spacing:.12em;\r\n  text-transform:uppercase;padding:5px 11px;border-radius:999px;\r\n  border:1px solid rgba(175,192,144,.28);background:rgba(175,192,144,.05);\r\n  color:var(--dim);cursor:pointer;\r\n  transition:background .15s ease,border-color .15s ease,color .15s ease;\r\n}\r\n.apsc-story__pick:hover{border-color:var(--accent);color:var(--ink-bright);}\r\n.apsc-story__pick[aria-pressed=\"true\"]{\r\n  border-color:rgba(232,200,122,.5);background:rgba(232,200,122,.10);\r\n  color:#f0e6c4;\r\n}\r\n@media (max-width:820px){ .apsc-story{padding:20px 16px 18px;} }\r\n\r\n/* ---- v78: TWO COLUMNS ON A WIDE SCREEN (user request 8.17.26,\r\n   \"kind of like a newspaper\") --------------------------------------\r\n   Only above 1500px, and there the panel gives up its 960px cap and\r\n   takes the full 1234px it is allowed - because two columns are only\r\n   worth having if EACH one still gets a proper measure. 1182px of\r\n   inner width minus a 52px gutter leaves ~565px a column, about 63\r\n   characters: a real newspaper measure, and tighter than the single\r\n   column it replaces.\r\n   ⚠⚠ THE KNOWN OBJECTION, MEASURED, NOT ASSUMED. The user rejected\r\n   two columns on the protologue because on screen a column block sends\r\n   the reader DOWN and then BACK UP. Two columns cut this story from\r\n   2119px to 1156px - a big improvement, but 1156px is still TALLER\r\n   than the ~1050px of usable viewport on a 1200px-high screen, so a\r\n   reader does have to drop to the foot of column one and climb back\r\n   for column two. It is one deliberate return trip on a self-contained\r\n   feature, not an unbounded block sitting in front of the article,\r\n   which is the difference from the protologue case - but it is a real\r\n   cost and it is the user's call, made with the number in hand.\r\n   A story appreciably longer than this one should stay single-column.\r\n   The head spans the full width above the columns; the plate keeps the\r\n   full width below them. */\r\n@media (min-width:1500px){\r\n  .apsc-story{max-width:1234px;}\r\n  .apsc-story__head{max-width:none;}\r\n  .apsc-story__prose{\r\n    max-width:none;\r\n    column-count:2;column-gap:52px;column-fill:balance;\r\n  }\r\n  /* a lone line stranded at a column break is the one thing that makes\r\n     columns feel broken rather than typeset */\r\n  .apsc-story__prose p{orphans:3;widows:3;}\r\n  /* the lead-in sits in column one and must not straddle the break */\r\n  .apsc-story__prose p:first-child{break-inside:avoid;}\r\n}\r\n/* v21: the running head lives ON the glass nav bar — transparent, the\r\n   header's own glass is the ground. Geometry (left/width/top/height/\r\n   z-index) is measured and set inline by the script; this rule is the\r\n   type and the fade. Outside .apsc, so values are written out. */\r\n.apsc-runhead{\r\n  position:fixed;z-index:1001;\r\n  display:flex;align-items:center;justify-content:center;\r\n  padding:0 12px;overflow:hidden;\r\n  font-family:\"Cormorant Garamond\",Georgia,serif;\r\n  font-size:16.5px;letter-spacing:.2em;color:#f3f1ea;\r\n  white-space:nowrap;\r\n  opacity:0;transform:translateY(-4px);pointer-events:none;\r\n  transition:opacity .28s ease,transform .28s ease;\r\n}\r\n.apsc-runhead span{overflow:hidden;text-overflow:ellipsis;}\r\n.apsc-runhead--on{opacity:1;transform:none;}\r\n@media (max-width:820px){.apsc-runhead{display:none;}}\r\n@media (prefers-reduced-motion: reduce){.apsc-runhead{transition:none;}}\r\n/* v21→v24→v35: the traveling group's ground. v24 gave the sticky MAP\r\n   the nav bar's glass — 13px backdrop blur under a film whose colour\r\n   is the panel composite (#131a15 at 55%), so at rest over the page\r\n   it composites back to the very tone the panel paints, while text\r\n   passing beneath the pinned element shows as a very blurred glow.\r\n   v35: the sticky element is the whole FOLLOW PANEL (map +\r\n   Distribution + the climate yearly line), so the glass and both\r\n   12px breathing strips move from .apsc-map to .apsc-facts--follow.\r\n   The strips are absolute (bottom:100% / top:100%), so layout at\r\n   rest never moves; they seal the header gap and the emergence edge\r\n   exactly as they did for the naked map (the v22/v23 seam lessons).\r\n   Without backdrop-filter support the solid returns: a film alone\r\n   would pass a SHARP ghost, worse than no glass. */\r\n.apsc .apsc-railcell{\r\n  min-width:0;align-self:stretch;\r\n  display:flex;flex-direction:column;gap:var(--gap);\r\n}\r\n.apsc .apsc-facts--follow{\r\n  position:relative;\r\n  background:rgba(19,26,21,.55);\r\n  -webkit-backdrop-filter:blur(13px);\r\n  backdrop-filter:blur(13px);\r\n}\r\n/* v51: the 12px ::before/::after seam strips are GONE. They belonged\r\n   to the v21-v24 map-alone-pins era, masking rail content that slid\r\n   beneath the pinned map in the same column; the v35/v45 panel stack\r\n   ended that under-slide, and the strips only painted artifacts (a\r\n   glass lip above the border, film over the rest panel's top edge —\r\n   user report 8.15.26). Do not reintroduce them without a measured\r\n   see-through to seal. */\r\n/* the rest panel earns its box only once it holds something — the\r\n   climate block may still be about to insert the charts row */\r\n.apsc .apsc-facts--rest:empty{display:none;}\r\n/* v38: THE COMPACT TRAVEL — pinned mid-scroll the panel condenses so\r\n   the charts beneath surface earlier; at rest it is the full panel. */\r\n.apsc .apsc-facts--follow h2{overflow:hidden;max-height:48px;transition:max-height .28s ease,opacity .28s ease,margin .28s ease;}\r\n.apsc .apsc-facts--follow.apsc--compact h2{max-height:0;opacity:0;margin:0;}\r\n.apsc .apsc-facts--follow .apsc-map svg{transition:max-height .28s ease;}\r\n.apsc .apsc-facts--follow.apsc--compact .apsc-map svg{max-height:clamp(110px,17vh,170px);}\r\n.apsc .apsc-facts--follow.apsc--compact .apsc-map{margin-bottom:6px;}\r\n.apsc .apsc-facts--follow .apsc-chips{max-height:420px;transition:max-height .28s ease;}\r\n.apsc .apsc-facts--follow.apsc--compact .apsc-chips{max-height:34px;overflow:hidden;}\r\n.apsc .apsc-chip--more{cursor:default;opacity:.85;border-style:dashed;}\r\n/* v42: while pinned the continent pill packs inline on row one.\r\n   v88: and LEADS it - \"Asia - Thailand - Uthai Thani\" reads as a\r\n   widening statement, where the continent trailing the provinces read\r\n   as an afterthought. Done with order and NOT by moving the chip in\r\n   the DOM, because the expanded row relies on the continent being\r\n   last to earn its own full-width line (see the append order in the\r\n   chip builder). Trade-off: while pinned, tab order keeps the DOM\r\n   sequence and so no longer matches what is on screen. */\r\n.apsc .apsc-facts--follow.apsc--compact .apsc-chips .apsc-chip--continent{flex:0 0 auto;width:auto;order:-1;}\r\n.apsc .apsc-chip-pop{\r\n  display:none;position:absolute;z-index:5;\r\n  flex-wrap:wrap;gap:6px;padding:10px;\r\n  background:#131a15;border:1px solid var(--rule);border-radius:3px;\r\n  box-shadow:0 8px 24px rgba(0,0,0,.5);\r\n}\r\n/* v39: the tighter cut — half the row and panel chrome while pinned,\r\n   and the distribution note reads at rest, not in motion */\r\n.apsc .apsc-facts--follow.apsc--compact{padding:10px 18px 8px;}\r\n.apsc .apsc-facts--follow.apsc--compact .apsc-fact{padding:7px 0;}\r\n.apsc .apsc-facts--follow.apsc--compact .apsc-dist-note{display:none;}\r\n/* v40: the seam standoff — compensate part of the compact shrink so\r\n   the rest panel does not leap straight to the pinned panel's seam */\r\n.apsc .apsc-facts--rest{transition:margin-top .28s ease;}\r\n.apsc .apsc-facts--follow.apsc--compact + .apsc-facts--rest{margin-top:50px;}\r\n@media (prefers-reduced-motion: reduce){\r\n  .apsc .apsc-facts--follow,\r\n  .apsc .apsc-facts--follow h2,\r\n  .apsc .apsc-facts--follow .apsc-map svg,\r\n  .apsc .apsc-facts--follow .apsc-chips{transition:none;}\r\n}\r\n@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))){\r\n  .apsc .apsc-facts--follow{background:#131a15;}\r\n}\r\n.apsc-colmain .apsc-body{margin-top:34px;}\r\n@media (max-width:820px){\r\n  /* v32: minmax(0,1fr), NOT 1fr. A 1fr track cannot shrink below its\r\n     content's min-content width, and the climate note's nowrap line\r\n     (434px) propagated up: the column computed to 472px inside a\r\n     364px container, the phone's layout viewport inflated to 478,\r\n     and the whole page rendered zoomed-out and off-centre. The\r\n     desktop columns above already use minmax(0,…) for this reason. */\r\n  .apsc-top{grid-template-columns:minmax(0,1fr);}\r\n  .apsc-colmain{display:contents;}\r\n  .apsc-colmain > .apsc-hero{order:0;}\r\n  .apsc-top > .apsc-railcell{order:1;}\r\n  .apsc-colmain > .apsc-body{order:2;}\r\n}\r\n\r\n.apsc-hero{margin:0;}\r\n.apsc-hero img{\r\n  display:block;width:100%;height:auto;border-radius:2px;\r\n  background:var(--panel);\r\n}\r\n/* ANCHORED RIGHT (v6). The credits were inheriting whatever alignment\r\n   the original caption block happened to carry, so \"Photo by …\" sat\r\n   left on some entries and right on others. Forced to one edge, and\r\n   any inline text-align on the caption's own markup is overridden —\r\n   otherwise a caption authored as centred would still win. */\r\n.apsc-hero figcaption{\r\n  margin-top:9px;font-family:var(--serif);font-style:italic;\r\n  font-size:14.5px;color:var(--dim);\r\n  text-align:right;\r\n}\r\n.apsc-hero figcaption *{text-align:inherit !important;}\r\n.apsc-hero figcaption p{margin:0;}\r\n\r\n/* protologue plates — the scanned description pages. Small, side by\r\n   side, click to enlarge. They are evidence, not illustration, so they\r\n   are sized like footnotes. */\r\n.apsc-plates__label{\r\n  margin-top:14px;font-family:var(--mono);font-size:8.5px;\r\n  letter-spacing:.22em;text-transform:uppercase;color:var(--dimmer);\r\n}\r\n.apsc-plates{display:flex;gap:10px;margin-top:6px;flex-wrap:wrap;}\r\n.apsc-plates button{\r\n  padding:0;border:1px solid var(--rule);background:none;cursor:zoom-in;\r\n  border-radius:2px;overflow:hidden;line-height:0;\r\n  transition:border-color .15s ease;\r\n}\r\n.apsc-plates button:hover{border-color:var(--accent);}\r\n.apsc-plates img{width:74px;height:96px;object-fit:cover;object-position:top;display:block;}\r\n\r\n/* ---- facts rail ------------------------------------------------ */\r\n.apsc-facts{\r\n  border:1px solid var(--rule);border-radius:3px;background:var(--panel);\r\n  padding:18px 18px 16px;\r\n}\r\n.apsc-facts h2{\r\n  margin:0 0 12px;font-family:var(--mono);font-size:10px;font-weight:400;\r\n  letter-spacing:.28em;text-transform:uppercase;color:var(--accent);\r\n}\r\n.apsc-fact{padding:12px 0;border-top:1px solid var(--rule-soft);}\r\n.apsc-fact:first-of-type{border-top:0;padding-top:0;}\r\n.apsc-fact__label{\r\n  font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;\r\n  text-transform:uppercase;color:var(--dimmer);margin-bottom:5px;\r\n}\r\n.apsc-fact__value{font-size:14px;line-height:1.55;}\r\n/* v30: the DISTRIBUTION NOTE under the chips — quieter than the value\r\n   type, so the chips stay the row's voice. */\r\n.apsc .apsc-dist-note{margin-top:8px;font-size:12.5px;line-height:1.55;color:var(--dimmer);}\r\n\r\n/* ---- region chips ----------------------------------------------\r\n   Every chip is a link to its own journal tag page — the pill IS the\r\n   navigation, which is why there is no repeated plain-text list of\r\n   the same places underneath it any more.\r\n\r\n   Three states, and they have to be tellable apart at a glance:\r\n     · default   a place shapes.json can draw. Sage, solid border.\r\n     · --off     a place tagged on the post that shapes.json has no\r\n                 shape for. Kept, because dropping it would hide a\r\n                 real part of the range, but dashed and dimmed so it\r\n                 is obviously not on the map. Title attribute says so.\r\n     · --continent  a different thing entirely, not a country. Gold,\r\n                 and it takes the full width on its own row. */\r\n.apsc-chips{display:flex;flex-wrap:wrap;gap:6px;}\r\n.apsc-chip{\r\n  font-family:var(--body);font-size:11.5px;letter-spacing:.02em;line-height:1.5;\r\n  padding:3px 10px;border-radius:999px;border:1px solid rgba(175,192,144,.34);\r\n  color:var(--sage);background:rgba(175,192,144,.07);white-space:nowrap;\r\n  text-decoration:none;\r\n  transition:background .15s ease,border-color .15s ease,color .15s ease;\r\n}\r\n.apsc-chip:hover{\r\n  background:rgba(175,192,144,.16);border-color:var(--accent);color:var(--ink-bright);\r\n}\r\n.apsc-chip:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}\r\n\r\n.apsc-chip--off{\r\n  border-style:dashed;border-color:rgba(243,241,234,.22);\r\n  color:var(--dimmer);background:none;\r\n}\r\n.apsc-chip--off:hover{border-color:rgba(243,241,234,.5);color:var(--dim);background:none;}\r\n\r\n/* v48: no \"?\" glyph (user ruling 8.14.26 - the chip reads just\r\n   \"Myanmar\"); instead the pill wears a mild 45-degree stripe, the\r\n   same weave as the map hatch at chip scale. Doubt still speaks\r\n   through the dashed border, the stripes and the hover title. */\r\n.apsc-chip--doubtful{\r\n  border-style:dashed;\r\n  background:repeating-linear-gradient(45deg,\r\n    rgba(175,192,144,.16) 0 3px, rgba(175,192,144,.05) 3px 8px);\r\n}\r\n.apsc-chip--doubtful:hover{\r\n  background:repeating-linear-gradient(45deg,\r\n    rgba(175,192,144,.24) 0 3px, rgba(175,192,144,.10) 3px 8px);\r\n}\r\n.apsc-map .apsc-on--doubtful{stroke-dasharray:.7 .5;}\r\n.apsc-map .apsc-dot--doubtful{fill:none;stroke:var(--accent);stroke-width:.5;}\r\n/* v68: a fact row that exists only so the climate block can read it\r\n   (the Distribution chips on a cultivar). Never shown. */\r\n.apsc .apsc-fact--muted{display:none;}\r\n/* v66: the CONTAINING-PLACE pill. Present so nobody has to already know\r\n   where Kanchanaburi is, but quieter than a record: the same wash the\r\n   map gives its parent shape, no fill of its own. */\r\n.apsc-chip--parent{\r\n  background:rgba(175,192,144,.035);\r\n  border-color:rgba(175,192,144,.20);\r\n  color:var(--dim);\r\n}\r\n.apsc-chip--parent:hover{\r\n  background:rgba(175,192,144,.10);\r\n  border-color:rgba(175,192,144,.42);\r\n  color:var(--sage);\r\n}\r\n.apsc-chip--continent{\r\n  flex:1 0 100%;                      /* its own full-width row */\r\n  text-align:center;\r\n  border-color:rgba(232,200,122,.34);\r\n  color:#f0e6c4;\r\n  background:rgba(232,200,122,.07);\r\n  letter-spacing:.16em;text-transform:uppercase;font-size:10px;\r\n  padding:5px 10px;\r\n}\r\n.apsc-chip--continent:hover{\r\n  background:rgba(232,200,122,.16);border-color:#e8c87a;color:#fff6dd;\r\n}\r\n\r\n/* ---- map ------------------------------------------------------- */\r\n.apsc-map{position:relative;margin:0 0 14px;}\r\n/* The frame follows the range's proportions, so a Costa Rica → Peru\r\n   species produces a portrait box. Unchecked, on a post with no hero\r\n   photo — where the rail spans the full measure — that renders a map\r\n   nearly a thousand pixels tall. The cap plus preserveAspectRatio\r\n   \"meet\" scales the content down and centres it instead. */\r\n.apsc-map svg{display:block;width:100%;height:auto;max-height:clamp(200px,38vh,360px);}\r\n.apsc-map .apsc-base{fill:rgba(243,241,234,.055);stroke:rgba(243,241,234,.10);stroke-width:.14;}\r\n.apsc-map .apsc-on{fill:var(--accent);fill-opacity:.82;stroke:#eff0e8;stroke-width:.16;stroke-opacity:.75;}\r\n/* v66: the CONTEXT WASH - the tagged parent of a lit subunit. Same\r\n   accent, a sixth of the ink, and a slightly firmer edge than a base\r\n   shape so the containing outline reads without competing with the\r\n   record itself. Drawn in the feed's containment order, so the lit\r\n   subunit always paints on top of it. */\r\n.apsc-map .apsc-ctx{fill:var(--accent);fill-opacity:.16;stroke:rgba(239,240,232,.45);stroke-width:.13;}\r\n.apsc-map .apsc-ctx:hover{fill-opacity:.26;}\r\n.apsc-map .apsc-dot{fill:var(--accent);}\r\n/* ---- hover readout ----\r\n   The shapes already carried a <title>, which gets you the browser's\r\n   own tooltip: a second of delay, an OS-styled box, and nothing at all\r\n   on a touch screen. This is the same information without the wait —\r\n   and it is the reason the base shapes are hoverable at all, since a\r\n   reader who does not know where Borneo is is exactly the reader who\r\n   needs to be told. */\r\n.apsc-map svg path{transition:fill-opacity .12s ease;}\r\n.apsc-map .apsc-base:hover{fill:rgba(243,241,234,.14);}\r\n.apsc-map .apsc-on:hover{fill-opacity:1;}\r\n.apsc-map__hover{\r\n  position:absolute;left:8px;top:8px;right:8px;\r\n  pointer-events:none;opacity:0;transition:opacity .14s ease;\r\n  font-family:var(--mono);font-size:9.5px;letter-spacing:.18em;\r\n  text-transform:uppercase;color:var(--ink-bright);\r\n  text-shadow:0 1px 8px rgba(0,0,0,.95),0 0 3px rgba(0,0,0,.9);\r\n}\r\n.apsc-map__hover[data-on=\"1\"]{opacity:1;}\r\n.apsc-map__hover em{\r\n  font-style:normal;color:var(--accent);\r\n  margin-left:8px;letter-spacing:.14em;\r\n}\r\n.apsc-map__zoom{\r\n  position:absolute;right:6px;bottom:6px;font-family:var(--mono);\r\n  font-size:9px;letter-spacing:.16em;text-transform:uppercase;\r\n  padding:4px 8px;border:1px solid var(--rule);border-radius:999px;\r\n  background:rgba(11,18,13,.72);color:var(--dim);cursor:pointer;\r\n  transition:color .15s ease,border-color .15s ease;\r\n}\r\n.apsc-map__zoom:hover{color:var(--ink-bright);border-color:var(--accent);}\r\n/* v88: + / - sit BESIDE the World pill rather than replacing it - the\r\n   whole-world snapshot is the point of that button, and incremental\r\n   zoom is a different job. The group owns the corner now, so the\r\n   World pill drops its own absolute placement inside it. */\r\n.apsc-map__zoomui{\r\n  position:absolute;right:6px;bottom:6px;\r\n  display:flex;gap:4px;align-items:center;\r\n}\r\n.apsc-map__zoomui .apsc-map__zoom{position:static;right:auto;bottom:auto;}\r\n.apsc-map__zoomui .apsc-map__step{\r\n  font-family:var(--mono);font-size:12px;line-height:1;\r\n  width:22px;height:22px;padding:0;\r\n  display:flex;align-items:center;justify-content:center;\r\n  border:1px solid var(--rule);border-radius:999px;\r\n  background:rgba(11,18,13,.72);color:var(--dim);cursor:pointer;\r\n  transition:color .15s ease,border-color .15s ease;\r\n}\r\n.apsc-map__zoomui .apsc-map__step:hover{color:var(--ink-bright);border-color:var(--accent);}\r\n.apsc-map__zoomui .apsc-map__step:disabled{opacity:.35;cursor:default;}\r\n/* v93: the map drags, so say so */\r\n.apsc-map svg{cursor:grab;}\r\n.apsc-map svg.apsc-map--panning{cursor:grabbing;}\r\n.apsc-map__zoomui button{cursor:pointer;}\r\n\r\n/* ---- prose sections -------------------------------------------- */\r\n.apsc-body{display:grid;gap:var(--gap);}\r\n.apsc-sec{border-top:1px solid var(--rule);padding-top:20px;}\r\n.apsc-sec__h{\r\n  margin:0 0 12px;font-family:var(--mono);font-size:10px;font-weight:400;\r\n  letter-spacing:.28em;text-transform:uppercase;color:var(--accent);\r\n  display:flex;align-items:baseline;gap:12px;\r\n}\r\n.apsc-sec__h .apsc-n{color:var(--dimmer);font-size:9px;letter-spacing:.18em;}\r\n.apsc-prose{max-width:var(--measure);}\r\n.apsc-prose p{margin:0 0 .85em;}\r\n.apsc-prose p:last-child{margin-bottom:0;}\r\n.apsc-prose ol,.apsc-prose ul{margin:0 0 .85em;padding-left:1.35em;}\r\n\r\n/* ---- v79: A TABLE OR KEY LIFTED OUT OF A CODE BLOCK ----------------\r\n   The four posts that carry one typed their own look into the markup -\r\n   14px, 2px solid borders, their own greys - against a card that sets\r\n   its own type everywhere else. scrub() drops those style attributes on\r\n   the way in and the card dresses the table itself, the same bargain\r\n   .apsc-prose already strikes with <pre> and <code>.\r\n   ⚠ Scrolls INSIDE its own box. The bantae table is 18 rows x 3 columns\r\n   of trait comparisons and the card body is a fixed measure; without\r\n   this the page itself scrolls sideways, which is the mobile bug the\r\n   journal pagination already cost a release. */\r\n/* MEASURED AT 375px: the bantae table is 662px of min-content and\r\n   .apsc-sec is a GRID ITEM, whose default `min-width:auto` refuses to\r\n   shrink below that - so the section blew its 364px track and pushed\r\n   THE WHOLE PAGE sideways (documentElement 668 vs 375). The embed's own\r\n   overflow-x never got a chance, because its box had already been\r\n   granted 662px. `min-width:0` is the fix, scoped with :has() to the\r\n   four sections that carry an embed so no other card layout moves.\r\n   This is the same mobile-sideways-scroll class the journal pagination\r\n   cost a release over: find the element that will not shrink, do not\r\n   trust the widest-looking one. */\r\n.apsc-sec:has(.apsc-embed){min-width:0;}\r\n/* ⚠ A WIDE TABLE MUST SAY IT IS WIDE. Amorphophallus bantae compares\r\n   SIX species over 18 traits: 662px of min-content in a 606px column, so\r\n   it scrolls — and a table that is silently cut off at the right edge\r\n   reads as a table with five species, not six. Squeezing it to fit needs\r\n   13px type and 5px padding (measured), which would shrink the two\r\n   3-column tables that are already comfortable, to save one gesture.\r\n   So the type stays and the overflow is made visible instead.\r\n   The classic pure-CSS scroll shadow: the two `local` gradients scroll\r\n   WITH the content and so cover the shadow when you are at that end,\r\n   while the `scroll` radial ones stay put — the cue therefore appears\r\n   only on the side that actually has more table, and disappears when\r\n   you reach it. No JS, no resize listener, nothing to keep in sync. */\r\n.apsc-embed{\r\n  margin:16px 0 0;max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;\r\n  background:\r\n    linear-gradient(to right,  var(--ground) 40%, rgba(11,18,13,0)) left center,\r\n    linear-gradient(to left,   var(--ground) 40%, rgba(11,18,13,0)) right center,\r\n    radial-gradient(farthest-side at 0 50%,   rgba(0,0,0,.55), rgba(0,0,0,0)) left center,\r\n    radial-gradient(farthest-side at 100% 50%,rgba(0,0,0,.55), rgba(0,0,0,0)) right center;\r\n  background-repeat:no-repeat;\r\n  background-size:34px 100%,34px 100%,14px 100%,14px 100%;\r\n  background-attachment:local,local,scroll,scroll;\r\n}\r\n.apsc-embed:first-child{margin-top:0;}\r\n.apsc-embed table{\r\n  border-collapse:collapse;width:100%;min-width:min(100%,420px);\r\n  font-family:var(--body);font-size:14px;line-height:1.55;color:var(--ink);\r\n}\r\n.apsc-embed th,.apsc-embed td{\r\n  padding:7px 12px;text-align:left;vertical-align:top;\r\n  border-bottom:1px solid var(--line);\r\n}\r\n.apsc-embed th{\r\n  font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;\r\n  text-transform:uppercase;color:var(--dimmer);font-weight:400;\r\n  border-bottom:1px solid var(--line-strong,var(--line));\r\n}\r\n.apsc-embed tr:last-child td{border-bottom:0;}\r\n.apsc-embed table table{margin:0;}\r\n/* the key on Amorphophallus commutatus brings its own grid CSS; give it\r\n   the card's type and stay out of the way of its layout */\r\n.apsc-embed .amorph-key{font-family:var(--body);color:var(--ink);}\r\n.apsc-embed .amorph-key__title{\r\n  font-family:var(--mono);font-size:10px;letter-spacing:.16em;\r\n  text-transform:uppercase;color:var(--dimmer);margin:0 0 10px;font-weight:400;\r\n}\r\n\r\n/* v31: the rebuilt NOTES list. Items breathe like paragraphs; a\r\n   continuation paragraph inside an item keeps a smaller gap so it\r\n   reads as part of its item, indented with it. */\r\n.apsc-prose ol.apsc-notes{padding-left:1.5em;}\r\n.apsc-notes > li{margin:0 0 .85em;}\r\n.apsc-notes > li:last-child{margin-bottom:0;}\r\n.apsc-notes > li > p{margin:0 0 .5em;}\r\n.apsc-notes > li > p:last-child{margin-bottom:0;}\r\n\r\n/* NESTED LISTS GET A DIFFERENT MARKER.\r\n   A numbered list inside a numbered list inherits `decimal`, so the\r\n   second level restarts at 1 directly under a parent item also\r\n   numbered 1 — two counting sequences on screen at once, and no way to\r\n   tell which level you are reading. Alocasia macrorrhizos' ETYMOLOGY\r\n   is the case that showed it. Letters at the second level, roman\r\n   numerals at the third; bullets change shape the same way. */\r\n.apsc-prose ol ol{list-style-type:lower-alpha;}\r\n.apsc-prose ol ol ol{list-style-type:lower-roman;}\r\n.apsc-prose ul ul{list-style-type:circle;}\r\n.apsc-prose ul ul ul{list-style-type:square;}\r\n/* a nested list is part of its parent item, so it sits tighter */\r\n.apsc-prose li > ol,\r\n.apsc-prose li > ul{margin:.45em 0 .25em;}\r\n.apsc-prose li::marker{color:var(--dimmer);}\r\n.apsc-prose li{margin:0 0 .5em;}\r\n.apsc-prose li p{margin:0 0 .5em;}\r\n\r\n/* ---- SUB-HEADINGS INSIDE A SECTION ----------------------------\r\n   A long section like Alocasia macrorrhizos' ETYMOLOGY has its own\r\n   internal headings. In the source they are either <h4> or, more\r\n   often, a short paragraph that is entirely bold — and bold Helvetica\r\n   at body size is a very weak heading. Against a paragraph in the same\r\n   face, same size and same colour, the only difference is weight, so\r\n   the section reads as one flat run of text.\r\n\r\n   ⚠ THE INDENTS ARE NOT THE ANSWER. Squarespace marks those\r\n   paragraphs data-indent=\"1\" with a margin-left:40px, and the card\r\n   strips it. Restoring it would not restore any hierarchy, because on\r\n   that page EVERY element below the lead carries the same\r\n   data-indent=\"1\" — the sub-heads, the body paragraphs and the lists\r\n   alike. The indent is uniform, so it moves the whole block right by\r\n   40px and says nothing about structure. The hierarchy has to come\r\n   from the type.\r\n\r\n   Third level in the card's scale, sitting between the mono section\r\n   label and the body: the serif, larger, sage. Different face,\r\n   different colour, different size — three signals instead of one. */\r\n.apsc-prose h1,.apsc-prose h2,.apsc-prose h3,\r\n.apsc-prose h4,.apsc-prose h5,.apsc-prose h6,\r\n.apsc-prose .apsc-subhead{\r\n  font-family:var(--serif);\r\n  font-size:clamp(16.5px,1.9vw,18.5px);\r\n  font-weight:600;\r\n  line-height:1.3;\r\n  letter-spacing:.005em;\r\n  color:var(--sage);\r\n  margin:28px 0 9px;\r\n}\r\n/* binds the heading to the text under it rather than floating between */\r\n.apsc-prose h1 + *,.apsc-prose h2 + *,.apsc-prose h3 + *,\r\n.apsc-prose h4 + *,.apsc-prose h5 + *,.apsc-prose h6 + *,\r\n.apsc-prose .apsc-subhead + *{margin-top:0;}\r\n.apsc-prose > *:first-child{margin-top:0;}\r\n\r\n/* Someone pasted a description into a CODE block on at least one entry\r\n   (Alocasia beccarii's INFLORESCENCE), which renders monospace and\r\n   pre-wrapped while every neighbouring section is Helvetica. The card\r\n   shows the words, not the container they were typed into.\r\n   ⚠ An earlier attempt at this rule was inserted against an anchor\r\n   comment that no longer existed, so it silently never shipped — the\r\n   font stayed monospace and the build reported no error. */\r\n.apsc-prose pre,\r\n.apsc-prose code,\r\n.apsc-prose kbd,\r\n.apsc-prose samp,\r\n.apsc-prose tt{\r\n  font-family:var(--body) !important;\r\n  font-size:inherit;line-height:inherit;color:inherit;\r\n  background:none;border:0;padding:0;\r\n  white-space:pre-wrap;word-break:normal;overflow-wrap:anywhere;\r\n}\r\n.apsc-prose pre{display:block;margin:0 0 .85em;}\r\n.apsc-prose code,.apsc-prose kbd,.apsc-prose samp,.apsc-prose tt{display:inline;}\r\n\r\n/* Long prose CAN collapse, but starts OPEN. The reader came for the\r\n   text; hiding it behind a \"read more\" makes them work for what they\r\n   already asked for. The control is there to get a long Notes block\r\n   out of the way once you have read it, not to gate it. */\r\n.apsc-fold{position:relative;}\r\n.apsc-fold[data-folded=\"1\"] .apsc-prose{\r\n  max-height:11.5em;overflow:hidden;\r\n  -webkit-mask-image:linear-gradient(to bottom,#000 62%,transparent 100%);\r\n          mask-image:linear-gradient(to bottom,#000 62%,transparent 100%);\r\n}\r\n.apsc-more{\r\n  margin-top:10px;font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;\r\n  text-transform:uppercase;color:var(--sage);background:none;cursor:pointer;\r\n  border:0;border-bottom:1px solid rgba(200,214,191,.35);padding:0 0 2px;\r\n}\r\n.apsc-more:hover{color:var(--ink-bright);border-color:var(--ink-bright);}\r\n\r\n/* ---- synonyms table -------------------------------------------- */\r\n.apsc-syn{display:grid;gap:0;max-width:var(--measure);}\r\n.apsc-syn__row{\r\n  display:grid;grid-template-columns:minmax(140px,168px) minmax(0,1fr);\r\n  gap:16px;padding:9px 0;border-top:1px solid var(--rule-soft);\r\n}\r\n.apsc-syn__row:first-child{border-top:0;}\r\n.apsc-syn__k{\r\n  font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;\r\n  text-transform:uppercase;color:var(--dimmer);padding-top:4px;\r\n}\r\n.apsc-syn__v p{margin:0 0 .4em;}\r\n.apsc-syn__v p:last-child{margin:0;}\r\n@media (max-width:600px){\r\n  .apsc-syn__row{grid-template-columns:1fr;gap:4px;}\r\n}\r\n\r\n/* ---- the not-recorded line ------------------------------------- */\r\n/* Every N/A section on the page collapses to this. On a typical post\r\n   that is five or six headings replaced by one line, which is the\r\n   single biggest reason the card is shorter than the page. */\r\n.apsc-na{\r\n  border-top:1px solid var(--rule);padding-top:16px;\r\n  font-size:13px;color:var(--dimmer);\r\n}\r\n.apsc-na strong{\r\n  font-family:var(--mono);font-size:9.5px;font-weight:400;letter-spacing:.22em;\r\n  text-transform:uppercase;color:var(--dimmer);margin-right:10px;\r\n}\r\n.apsc-na span{\r\n  display:inline-block;margin:0 12px 0 0;\r\n  font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;\r\n  color:rgba(243,241,234,.34);\r\n}\r\n\r\n/* ---- photo strip ----------------------------------------------- */\r\n/* v47: comparison plates - full-width inline figures after NOTES */\r\n.apsc-cmp{margin:16px 0 0;}\r\n.apsc-cmp button{display:block;width:100%;padding:0;border:1px solid var(--rule);background:none;cursor:zoom-in;}\r\n.apsc-cmp button:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}\r\n.apsc-cmp img{display:block;width:100%;height:auto;}\r\n.apsc-cmp__cap{font-family:var(--mono);font-size:10px;letter-spacing:.06em;color:var(--dim);margin-top:6px;}\r\n.apsc-strip{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:8px;}\r\n.apsc-strip button{\r\n  padding:0;border:0;background:var(--panel);cursor:zoom-in;line-height:0;\r\n  border-radius:2px;overflow:hidden;aspect-ratio:1;\r\n  /* v17: while a lazy image is still loading the tile used to be a\r\n     void; the panel tone + inset hairline make waiting look designed */\r\n  position:relative;\r\n  box-shadow:inset 0 0 0 1px var(--rule-soft);\r\n}\r\n.apsc-strip img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s cubic-bezier(.2,.7,.3,1),opacity .2s ease;}\r\n.apsc-strip button:hover img{transform:scale(1.045);}\r\n.apsc-strip button:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}\r\n/* v17: hover caption — one line, solid film (no gradients on this site) */\r\n.apsc-strip__cap{\r\n  position:absolute;left:0;right:0;bottom:0;\r\n  padding:6px 8px;background:rgba(11,18,13,.85);\r\n  font-family:var(--body);font-size:10.5px;line-height:1.35;color:var(--dim);\r\n  text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\r\n  opacity:0;transition:opacity .18s ease;pointer-events:none;\r\n}\r\n.apsc-strip button:hover .apsc-strip__cap,\r\n.apsc-strip button:focus-visible .apsc-strip__cap{opacity:1;}\r\n\r\n/* ---- video ------------------------------------------------------\r\n   Rebuilt from the block's own data-html rather than left behind on\r\n   the page. Squarespace ships the <iframe> HTML escaped in that\r\n   attribute and its own script swaps it in on demand; we do the same\r\n   thing, so the embed works with the original block hidden. */\r\n/* THE HEIGHT CAP. These clips are phone footage: 288x640 is a 222%\r\n   aspect, so at the card's full width a single video would run well\r\n   over a thousand pixels tall and push everything after it off the\r\n   screen. On the old pages a hand-placed spacer column kept that in\r\n   check; there are no spacers here.\r\n\r\n   The cap is applied as a MAX-WIDTH, not a max-height. Height comes\r\n   from padding-bottom, which is a percentage of the width, so\r\n   capping the height directly would leave the box wide and stretch\r\n   the iframe inside it. Working backwards — width = cap ÷ aspect —\r\n   shrinks the whole frame and keeps the video's real proportions.\r\n   A 16:9 clip is unaffected: its natural width is far below the cap. */\r\n/* LEFT-ALIGNED, not centred. A capped portrait clip is narrow, and\r\n   centring it left a column of white space down both sides that read\r\n   as a mistake rather than a choice. Flush left it lines up with the\r\n   prose above it. */\r\n.apsc-video{\r\n  --apsc-vid-cap:min(62vh,560px);\r\n  margin:16px 0 0;\r\n  max-width:calc(var(--apsc-vid-cap) * 100 / var(--apsc-vr, 56.25));\r\n}\r\n.apsc-video__frame{\r\n  position:relative;width:100%;background:#000;border-radius:2px;overflow:hidden;\r\n  padding-bottom:calc(var(--apsc-vr, 56.25) * 1%);\r\n}\r\n.apsc-video__frame iframe,\r\n.apsc-video__frame video{\r\n  position:absolute;inset:0;width:100%;height:100%;border:0;display:block;\r\n}\r\n.apsc-video figcaption{\r\n  margin-top:9px;font-family:var(--serif);font-style:italic;\r\n  font-size:14.5px;color:var(--dim);\r\n}\r\n\r\n/* ---- references ------------------------------------------------ */\r\n.apsc-refs{font-size:13.5px;color:var(--dim);max-width:var(--measure);}\r\n.apsc-refs ol{margin:0;padding-left:1.2em;}\r\n.apsc-refs li{margin:0 0 .4em;}\r\n\r\n/* ---- footer control -------------------------------------------- */\r\n.apsc-foot{\r\n  border-top:1px solid var(--rule);margin-top:var(--gap);padding-top:14px;\r\n  display:flex;justify-content:space-between;align-items:center;gap:16px;\r\n  font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;\r\n  color:var(--dimmer);flex-wrap:wrap;\r\n}\r\n.apsc-foot button{\r\n  font:inherit;letter-spacing:inherit;text-transform:inherit;color:var(--sage);\r\n  background:none;border:0;border-bottom:1px solid rgba(200,214,191,.35);\r\n  padding:0 0 2px;cursor:pointer;\r\n}\r\n.apsc-foot button:hover{color:var(--ink-bright);border-color:var(--ink-bright);}\r\n\r\n/* ---- lightbox ---------------------------------------------------\r\n   THE CONTROLS BELONG TO THE PHOTO, NOT THE VIEWPORT.\r\n   They used to be absolutely positioned at 3vmin from each screen\r\n   edge. On a 1280px desktop showing a 398px-wide photo that put each\r\n   arrow about 400px away from the image it operates — out at the far\r\n   edges, where the left one lands under the site's nav. They are flex\r\n   siblings of the picture now, so they sit against its edges whatever\r\n   its size.\r\n\r\n   The stage is sized to the WIDEST image in the set (see maxStageWidth\r\n   in the script), so the arrows hold still while you page through\r\n   rather than stepping in and out with each photo's width.\r\n\r\n   GLASS, the house recipe — the same dark translucent + blur used by\r\n   the header shell. The controls used to be a 1px hairline over a\r\n   transparent background: legible over the dark scrim, nearly\r\n   invisible against a bright photograph, which is exactly where the\r\n   arrows sit on a phone. */\r\n.apsc-lb{\r\n  /* ⚠ ITS OWN TOKENS. The overlay is portalled to <body> (see the note\r\n     in makeLightbox), so it is no longer a descendant of .apsc and\r\n     inherits none of the card's custom properties. Without this block\r\n     every colour below silently falls back to nothing. */\r\n  --ground:#0b120d;\r\n  --ink:#f3f1ea;\r\n  --ink-bright:#f7f5ef;\r\n  --accent:#afc090;\r\n  --sage:#c8d6bf;\r\n  --dim:rgba(243,241,234,.62);\r\n  --dimmer:rgba(243,241,234,.42);\r\n  --serif:\"Cormorant Garamond\",Georgia,serif;\r\n  --body:\"Helvetica Neue\",Helvetica,Arial,sans-serif;\r\n  --mono:\"IBM Plex Mono\",ui-monospace,SFMono-Regular,Menlo,monospace;\r\n\r\n  --apsc-lb-stage:min(92vw,1100px);\r\n  /* ⚠ AND ITS OWN BOX-SIZING. `.apsc *{box-sizing:border-box}` stops\r\n     applying the moment the overlay is portalled to <body> — so the\r\n     3vmin padding started ADDING to the width instead of fitting\r\n     inside it, and a 375px overlay measured 398. Second thing the\r\n     portal quietly took away, after the custom properties above. */\r\n  /* ⚠ NOT `inset:0`. A fixed element with inset:0 is sized to the\r\n     LAYOUT viewport, and this page's layout viewport is wider than the\r\n     screen — the site's eyebrow pill is 384px on a 375px phone, so the\r\n     document scrolls to 406. The overlay inherited that 406 and\r\n     `right:14px` put the close button 17px off the right edge of the\r\n     screen, unreachable. Pinned to 100vw/100dvh instead, so the\r\n     overlay is the SCREEN whatever the document behind it is doing.\r\n     100vw is only the default — fit() in the script sets an exact\r\n     pixel width from documentElement.clientWidth, because on a page\r\n     that overflows, 100vw is not the visible width either. */\r\n  position:fixed;top:0;left:0;\r\n  width:100vw;\r\n  height:100vh;height:100dvh;\r\n  /* ⚠ 2147483647 — the maximum 32-bit signed integer, and not a\r\n     flourish. THE SITE HEADER IS SET TO EXACTLY THIS VALUE. At 99999\r\n     the header painted over the top of the overlay even after the\r\n     overlay was portalled to <body>: on a phone the close button sits\r\n     at y=14 and the header logo sits on top of it, so the button was\r\n     rendering perfectly and could not be seen or clicked.\r\n     Matching the value is enough because equal z-index is resolved by\r\n     DOM order and the overlay is re-appended to <body> on every open,\r\n     making it the last child. Nothing can be raised above this one. */\r\n  z-index:2147483647;display:none;\r\n  background:rgba(6,10,7,.95);\r\n  align-items:center;justify-content:center;\r\n  padding:max(3vmin,env(safe-area-inset-top)) 3vmin;\r\n  flex-direction:column;gap:14px;\r\n}\r\n.apsc-lb,.apsc-lb *{box-sizing:border-box;}\r\n.apsc-lb[open],.apsc-lb.is-open{display:flex;}\r\n\r\n.apsc-lb__stage{\r\n  display:flex;align-items:center;justify-content:center;\r\n  gap:clamp(10px,2vw,22px);\r\n  /* 100%, NOT 96vw. The overlay already carries 3vmin of padding, so a\r\n     vw-based cap here adds to it and pushed the stage 8px past the\r\n     viewport on a 375px screen. */\r\n  max-width:100%;\r\n  width:100%;\r\n}\r\n.apsc-lb__fig{\r\n  margin:0;flex:0 1 auto;\r\n  width:var(--apsc-lb-stage);\r\n  max-width:100%;\r\n  display:flex;align-items:center;justify-content:center;\r\n}\r\n.apsc-lb img{\r\n  max-width:100%;max-height:min(80vh,900px);\r\n  object-fit:contain;display:block;border-radius:2px;\r\n}\r\n.apsc-lb__cap{\r\n  text-align:center;max-width:min(100%,70ch);\r\n  font-family:var(--serif);font-style:italic;font-size:15px;color:var(--dim);\r\n}\r\n.apsc-lb__cap a{color:var(--sage);}\r\n\r\n/* the house glass */\r\n.apsc-lb__x,.apsc-lb__nav{\r\n  flex:none;\r\n  background:rgba(11,18,13,.72);\r\n  -webkit-backdrop-filter:blur(12px);\r\n          backdrop-filter:blur(12px);\r\n  border:1px solid rgba(255,255,255,.28);\r\n  box-shadow:inset 0 1px 0 rgba(255,255,255,.18), 0 2px 14px rgba(0,0,0,.45);\r\n  color:var(--ink-bright);cursor:pointer;border-radius:999px;\r\n  width:46px;height:46px;line-height:1;\r\n  display:flex;align-items:center;justify-content:center;\r\n  transition:background .15s ease,border-color .15s ease,color .15s ease,transform .12s ease;\r\n}\r\n.apsc-lb__x:hover,.apsc-lb__nav:hover{\r\n  background:rgba(11,18,13,.9);border-color:var(--accent);color:var(--accent);\r\n}\r\n.apsc-lb__x:active,.apsc-lb__nav:active{transform:scale(.94);}\r\n\r\n/* The arrows were the ‹ › characters at 20px, which sit small and light\r\n   inside a 46px circle — a lot of glass around very little mark. Drawn\r\n   as SVG instead: the stroke weight and the size are set here rather\r\n   than inherited from whatever the font does with an angle quote. */\r\n.apsc-lb__nav svg{width:22px;height:22px;display:block;}\r\n.apsc-lb__nav svg path{\r\n  fill:none;stroke:currentColor;stroke-width:2.25;\r\n  stroke-linecap:round;stroke-linejoin:round;\r\n}\r\n.apsc-lb__x:focus-visible,.apsc-lb__nav:focus-visible{\r\n  outline:2px solid var(--accent);outline-offset:3px;\r\n}\r\n\r\n/* CLOSE — pinned to the overlay's top right, and labelled.\r\n   \"Not readily apparent how to exit\" was the report, and a bare ×\r\n   hairline in a corner is easy to miss. The word carries it. */\r\n.apsc-lb__x{\r\n  position:absolute;\r\n  top:max(14px,env(safe-area-inset-top));right:14px;\r\n  width:auto;height:42px;padding:0 16px;gap:9px;\r\n  font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;\r\n}\r\n.apsc-lb__x b{font-family:var(--body);font-size:19px;font-weight:400;line-height:1;}\r\n.apsc-lb__hint{\r\n  font-family:var(--mono);font-size:9px;letter-spacing:.18em;\r\n  text-transform:uppercase;color:var(--dimmer);\r\n}\r\n\r\n@media (max-width:820px){\r\n  /* On a phone there is no room beside the photo, so the arrows go\r\n     over it — which is why they need the glass most here. */\r\n  .apsc-lb{--apsc-lb-stage:100%;}\r\n  .apsc-lb__stage{position:relative;width:100%;}\r\n  .apsc-lb__nav{position:absolute;top:50%;transform:translateY(-50%);}\r\n  .apsc-lb__nav--prev{left:8px;}\r\n  .apsc-lb__nav--next{right:8px;}\r\n  /* bigger touch target, and a mark big enough to read at arm's length */\r\n  .apsc-lb__nav{width:52px;height:52px;}\r\n  .apsc-lb__nav svg{width:27px;height:27px;}\r\n  .apsc-lb__nav svg path{stroke-width:2.5;}\r\n  .apsc-lb__nav:active{transform:translateY(-50%) scale(.94);}\r\n  .apsc-lb__x span{display:none;}     /* just the × on a small screen */\r\n  .apsc-lb__x{padding:0;width:44px;}\r\n  .apsc-lb__hint{display:none;}\r\n}\r\n\r\n@media (prefers-reduced-motion:reduce){\r\n  .apsc *{transition:none !important;animation:none !important;}\r\n}\r\n\r\n/* ==================================================================\r\n   THE SECTION RAIL — desktop only\r\n   Ported from AROID POLLINATION — SECTION NAV v9, same visual\r\n   language: a 1px rail on the left, a tick and a mono label per\r\n   section, a progress fill that tracks reading position. Three of\r\n   that file's hard-won behaviours are carried over deliberately:\r\n\r\n     · PORTAL TO <body>. A fixed element's z-index resolves inside the\r\n       nearest ancestor stacking context; the rail is built inside the\r\n       post body, which sits under several positioned wrappers. Moving\r\n       it to <body> is the only reliable fix.\r\n     · 820px BREAKPOINT, not 600 — a phone in landscape is 812px wide\r\n       and has the least vertical room of any screen, so at 600 it\r\n       would be the one device that kept the floating chrome.\r\n     · TWO SECTIONS MINIMUM. One tick is decoration, not navigation.\r\n\r\n   What is different: this rail's sections come from the CARD, which\r\n   built them a moment ago and therefore knows their labels exactly.\r\n   There is no LABELS table to keep in sync, because there is nothing\r\n   to keep in sync with — that was the pollination pages' problem, not\r\n   this one's.\r\n   ================================================================== */\r\n.apsc-rail{\r\n  --apsc-rail-left:28px;\r\n  --apsc-rail-h:min(62vh,470px);\r\n  position:fixed; z-index:60;\r\n  left:var(--apsc-rail-left); top:50%;\r\n  transform:translateY(-50%);\r\n  height:var(--apsc-rail-h); width:1px;\r\n  opacity:0; pointer-events:none;\r\n  transition:opacity .55s ease;\r\n  font-family:\"IBM Plex Mono\",ui-monospace,SFMono-Regular,monospace;\r\n}\r\n.apsc-rail.is-ready.is-visible{opacity:1;pointer-events:auto;}\r\n.apsc-rail__line{position:absolute;top:0;bottom:0;left:0;width:1px;background:rgba(200,214,191,.22);}\r\n.apsc-rail__fill{\r\n  position:absolute;top:0;left:0;width:1px;height:0;\r\n  background:linear-gradient(#cde86b,#c8d6bf);\r\n  box-shadow:0 0 12px rgba(205,232,107,.5);\r\n  transition:height .25s cubic-bezier(.23,1,.32,1);\r\n}\r\n.apsc-rail__tick{\r\n  position:absolute;left:-3px;width:7px;height:1px;\r\n  padding:0;margin:0;border:0;background:rgba(243,241,234,.40);\r\n  cursor:pointer;outline-offset:10px;\r\n}\r\n/* an invisible hit area, so a 1px tick and its label are one target\r\n   rather than a 7x1px pixel-hunt */\r\n.apsc-rail__tick::before{content:\"\";position:absolute;inset:-9px -150px -9px -9px;}\r\n.apsc-rail__tick span{\r\n  position:absolute;left:16px;top:-5px;white-space:nowrap;\r\n  font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;\r\n  color:rgba(243,241,234,.40);\r\n  text-shadow:0 1px 6px rgba(0,0,0,.85);\r\n  transition:color .3s ease;\r\n}\r\n.apsc-rail__tick.is-passed span{color:#a9c199;}\r\n.apsc-rail__tick.is-current span{color:#f3f1ea;}\r\n.apsc-rail__tick:hover span{color:#f3f1ea;}\r\n.apsc-rail__tick:focus-visible{outline:1px solid #a9c199;}\r\n\r\n@media (max-width:820px){ .apsc-rail{display:none;} }\r\nbody.sqs-edit-mode-active .apsc-rail{display:none;}\r\n@media (prefers-reduced-motion:reduce){\r\n  .apsc-rail,.apsc-rail__fill{transition:none;}\r\n}\r\n","\r\n/* ==================================================================\r\n   TOKENS\r\n   The hero bar's own values, carried across verbatim except the one\r\n   that CANNOT be: the fill. See \"THE ONE VALUE THAT CHANGED\".\r\n   ================================================================== */\r\n.blog-item-comments{\r\n  --apcm-ink:#f3f1ea;\r\n  --apcm-sage:#c8d6bf;                /* placeholder + button letter */\r\n  --apcm-accent:#afc090;              /* focus + control hover       */\r\n  --apcm-serif:\"Cormorant Garamond\",Georgia,serif;\r\n  --apcm-sans:\"Manrope\",-apple-system,BlinkMacSystemFont,sans-serif;\r\n  --apcm-body:\"Helvetica Neue\",Helvetica,Arial,sans-serif;\r\n  --apcm-mono:\"IBM Plex Mono\",ui-monospace,SFMono-Regular,Menlo,monospace;\r\n\r\n  --apcm-radius:5px;                  /* hero --apc-panel-radius     */\r\n  --apcm-blur:13px;                   /* hero --apc-panel-blur       */\r\n  --apcm-line:rgba(255,255,255,.22);  /* hero half border            */\r\n  --apcm-line-focus:rgba(175,192,144,.55);\r\n  --apcm-hair:rgba(243,241,234,.10);\r\n  --apcm-gutter:52px;                 /* text clearance for the icon  */\r\n\r\n  /* THE ONE VALUE THAT CHANGED. The hero's colour layer is\r\n     rgba(3,17,12,.35) — a DARKENING film, tuned to sit over bright\r\n     video. The journal post background is flat #0b120d, so that same\r\n     film is invisible here: dark on dark. The pane therefore lightens\r\n     instead of darkens, at the species card's own --panel alpha\r\n     family. Everything else — wash, blur, hairline, inset top light,\r\n     edge lights, radius, focus behaviour, type, button — is the\r\n     hero's, unchanged. */\r\n  --apcm-fill:rgba(243,241,234,.045);\r\n  --apcm-fill-focus:rgba(243,241,234,.075);\r\n\r\n  --apcm-time-in:480ms;\r\n  --apcm-time-out:750ms;\r\n  --apcm-ease:cubic-bezier(.45,.05,.35,.95);\r\n}\r\n\r\n/* ==================================================================\r\n   1) THE HEADER — \"Comments (n)\" and the sort control\r\n   Squarespace floats these. Flex instead, so they baseline together\r\n   at any width and stack cleanly on a phone.\r\n   ================================================================== */\r\n.blog-item-comments .squarespace-comments .header-controls .controls{\r\n  display:flex; align-items:baseline; justify-content:space-between;\r\n  gap:16px; flex-wrap:wrap;\r\n  padding:0 0 14px;\r\n  margin:0 0 22px;\r\n  border-bottom:1px solid var(--apcm-hair);\r\n  overflow:visible;                   /* was hidden, for the floats  */\r\n}\r\n.blog-item-comments .squarespace-comments .header-controls .controls .comment-count{\r\n  float:none; display:block; margin:0;\r\n  font-family:var(--apcm-serif);\r\n  font-size:clamp(24px,2.4vw,30px);\r\n  font-weight:600; letter-spacing:-.01em; line-height:1.1;\r\n  color:var(--apcm-ink);\r\n}\r\n.blog-item-comments .squarespace-comments .header-controls .controls .comment-controls{\r\n  float:none; width:auto; margin:0;\r\n}\r\n/* The sort label reads as a control, not as body text: the site's\r\n   mono caps register, same as the journal facets. */\r\n.blog-item-comments .squarespace-comments .header-controls .controls .comment-controls .comment-sort{\r\n  margin-right:0;\r\n  font-family:var(--apcm-mono);\r\n  font-size:10px; letter-spacing:.13em; text-transform:uppercase;\r\n  color:rgba(243,241,234,.55);\r\n  transition:color 200ms ease;\r\n}\r\n.blog-item-comments .squarespace-comments .header-controls .controls .comment-controls .comment-sort:hover{\r\n  color:var(--apcm-ink);\r\n}\r\n/* .hidden-ordering is the real <select>, laid invisibly over the\r\n   label. Position and hit area are Squarespace's — only the popup's\r\n   own colours are set here, so the menu is legible on macOS/Windows\r\n   dark chrome. Do NOT give this display/size rules. */\r\n.blog-item-comments .squarespace-comments .comment-sort .hidden-ordering{\r\n  color:var(--apcm-ink);\r\n  background:#0b120d;\r\n}\r\n\r\n/* ==================================================================\r\n   2) THE PANE — the hero bar, grown into a box\r\n   One piece of glass holding the field and the button row, exactly\r\n   as the hero holds its field and its SEARCH half. Squarespace's\r\n   white slab, its 3px radius and the two hairline boxes it draws\r\n   around .input and .comment-btn-wrapper are all replaced here.\r\n   ================================================================== */\r\n.blog-item-comments .squarespace-comments .new-comment-area{\r\n  position:relative;\r\n  margin:0 0 26px;\r\n  border:1px solid var(--apcm-line);\r\n  border-radius:var(--apcm-radius);\r\n  /* hero: top wash over the colour layer */\r\n  background:\r\n    linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0) 55%),\r\n    var(--apcm-fill);\r\n  -webkit-backdrop-filter:blur(var(--apcm-blur));\r\n  backdrop-filter:blur(var(--apcm-blur));\r\n  /* hero, verbatim */\r\n  box-shadow:\r\n    inset 0 1px 0 rgba(255,255,255,.30),\r\n    inset 0 -1px 0 rgba(255,255,255,.07),\r\n    inset 0 0 2px 1px rgba(255,255,255,.07),\r\n    0 24px 50px -24px rgba(0,0,0,.6);\r\n  transition:border-color 200ms ease, background-color 200ms ease;\r\n}\r\n/* The hero's edge lights. Inset from the corners rather than clipped\r\n   with overflow:hidden — .comment-btn.hasavatar hangs an absolutely\r\n   positioned avatar off the button, and a logged-in flyout opens out\r\n   of this box; neither may be clipped. */\r\n.blog-item-comments .squarespace-comments .new-comment-area::before{\r\n  content:\"\"; position:absolute; top:0; left:10px; right:10px; height:1px;\r\n  background:linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);\r\n  pointer-events:none;\r\n}\r\n.blog-item-comments .squarespace-comments .new-comment-area::after{\r\n  content:\"\"; position:absolute; top:8px; bottom:8px; left:0; width:1px;\r\n  background:linear-gradient(180deg, rgba(255,255,255,.45), transparent 55%, rgba(255,255,255,.14));\r\n  pointer-events:none;\r\n}\r\n/* Focus lights the WHOLE PANE — the hero's :focus-within rule. The\r\n   textarea itself carries no outline. */\r\n.blog-item-comments .squarespace-comments .new-comment-area:focus-within{\r\n  border-color:var(--apcm-line-focus);\r\n  background:\r\n    linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0) 55%),\r\n    var(--apcm-fill-focus);\r\n}\r\n\r\n/* Squarespace's inner hairline box around the textarea — gone. */\r\n.blog-item-comments .squarespace-comments .new-comment-area .input{\r\n  position:relative;\r\n  border:0; border-radius:0; background:none;\r\n}\r\n/* The hero's leading mark. There it is a magnifier at 18px, stroke\r\n   rgba(200,214,191,.6), 20px in from the left edge; here it is a note\r\n   glyph at the same size, colour and inset, so the two controls open\r\n   the same way. The textarea's left padding clears it — every line\r\n   indents, which is what the hero does too. Delete this rule and the\r\n   --apcm-gutter line below to drop the icon. */\r\n.blog-item-comments .squarespace-comments .new-comment-area .input::before{\r\n  content:\"\";\r\n  position:absolute; top:20px; left:20px;\r\n  width:18px; height:18px;\r\n  background:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c8d6bf' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5a8.4 8.4 0 0 1-.9-3.8 8.4 8.4 0 0 1 8.4-9h.5a8.4 8.4 0 0 1 8 8v.3z'/%3E%3C/svg%3E\") center/contain no-repeat;\r\n  opacity:.6;\r\n  pointer-events:none;\r\n}\r\n\r\n/* ---- the field ------------------------------------------------- */\r\n.blog-item-comments .squarespace-comments .new-comment-area .input form.comment-form{\r\n  margin:0;\r\n}\r\n.blog-item-comments .squarespace-comments .new-comment-area .input form.comment-form textarea{\r\n  box-sizing:border-box; width:100%;\r\n  height:auto; min-height:132px; max-height:420px;\r\n  margin:0; padding:18px 20px 18px var(--apcm-gutter);\r\n  border:0; background:transparent;\r\n  outline:none !important;            /* the pane carries focus      */\r\n  -webkit-appearance:none; appearance:none;\r\n  /* resize:none because the field grows itself (see the script). The\r\n     native grip is a light triangle sitting on the hairline — it read\r\n     as an artefact on the glass, and an auto-growing field is the\r\n     better control anyway. */\r\n  resize:none; overflow-y:auto;\r\n  /* hero: 400, not 300 — light weights thin out on dark glass. 16px\r\n     is a FLOOR; iOS zooms the viewport on focus below it. */\r\n  font-family:var(--apcm-sans); font-weight:400;\r\n  font-size:16px; line-height:1.6; letter-spacing:.01em;\r\n  color:var(--apcm-ink);\r\n}\r\n/* hero: the placeholder is the archive's voice — serif italic, sage.\r\n   Typed text stays Manrope (the rule above): the serif is only the\r\n   invitation, never the input. */\r\n.blog-item-comments .squarespace-comments .new-comment-area .input form.comment-form textarea::placeholder{\r\n  font-family:var(--apcm-serif);\r\n  font-style:italic; font-weight:500;\r\n  font-size:18px;                     /* Cormorant's small x-height  */\r\n  letter-spacing:.015em;\r\n  color:rgba(200,214,191,.6);\r\n  opacity:1;\r\n}\r\n.blog-item-comments .squarespace-comments textarea:-webkit-autofill{\r\n  -webkit-text-fill-color:var(--apcm-ink);\r\n  transition:background-color 999999s ease-out;\r\n}\r\n\r\n/* ==================================================================\r\n   3) THE BUTTON ROW\r\n   Sits inside the pane on a hairline, right-aligned, the two controls\r\n   in one family: Preview quiet, Post Comment the hero's SEARCH half.\r\n   ================================================================== */\r\n.blog-item-comments .squarespace-comments .comment-btn-wrapper{\r\n  display:flex; align-items:center; justify-content:flex-end;\r\n  gap:20px;\r\n  padding:12px 14px;\r\n  border:0; border-top:1px solid var(--apcm-hair);\r\n  border-radius:0;\r\n  background:rgba(255,255,255,.02);\r\n  text-align:right;\r\n  font-size:12px;\r\n}\r\n.blog-item-comments .squarespace-comments .comment-btn-wrapper .btn-text{\r\n  margin:0; line-height:1;\r\n  font-family:var(--apcm-sans); font-weight:600;\r\n  font-size:11px; letter-spacing:.14em; text-transform:uppercase;\r\n  color:rgba(243,241,234,.5);\r\n  transition:color 200ms ease;\r\n}\r\n.blog-item-comments .squarespace-comments .comment-btn-wrapper .btn-text:hover{\r\n  color:var(--apcm-ink);\r\n}\r\n\r\n/* ---- Post Comment — the hero's SEARCH half ---------------------\r\n   .comment-btn is .sqs-system-button .sqs-editable-button-font, so\r\n   the site's global button settings reach it (they were rendering it\r\n   at Cormorant 27px with 5.5px tracking, 364x101px). Those are the\r\n   declarations !important is spent on, and nowhere else. */\r\n.blog-item-comments .squarespace-comments .comment-btn{\r\n  position:relative;\r\n  flex:0 0 auto;\r\n  display:inline-block;\r\n  padding:14px 26px !important;\r\n  border:1px solid var(--apcm-line) !important;\r\n  border-radius:var(--apcm-radius) !important;\r\n  overflow:hidden;                    /* 1px edge lights + avatar in */\r\n  background:\r\n    linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0) 55%),\r\n    var(--apcm-fill) !important;\r\n  -webkit-backdrop-filter:blur(var(--apcm-blur));\r\n  backdrop-filter:blur(var(--apcm-blur));\r\n  box-shadow:\r\n    inset 0 1px 0 rgba(255,255,255,.30),\r\n    inset 0 -1px 0 rgba(255,255,255,.07);\r\n  font-family:var(--apcm-sans) !important;\r\n  font-size:12px !important;\r\n  font-weight:600 !important;\r\n  line-height:1 !important;\r\n  letter-spacing:.14em !important;\r\n  text-transform:uppercase !important;\r\n  color:var(--apcm-sage) !important;\r\n  cursor:pointer; text-align:center;\r\n  /* hero organic register: melts slower than it forms. */\r\n  transition:background-color var(--apcm-time-out) var(--apcm-ease),\r\n             color var(--apcm-time-out) var(--apcm-ease),\r\n             border-color var(--apcm-time-out) var(--apcm-ease);\r\n}\r\n.blog-item-comments .squarespace-comments .comment-btn::before{\r\n  content:\"\"; position:absolute; top:0; left:0; right:0; height:1px;\r\n  background:linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);\r\n  pointer-events:none;\r\n}\r\n.blog-item-comments .squarespace-comments .comment-btn::after{\r\n  content:\"\"; position:absolute; top:0; right:0; width:1px; height:100%;\r\n  background:linear-gradient(180deg, rgba(255,255,255,.35), transparent 55%, rgba(255,255,255,.12));\r\n  pointer-events:none;\r\n}\r\n.blog-item-comments .squarespace-comments .comment-btn:hover{\r\n  background:var(--apcm-ink) !important;\r\n  border-color:var(--apcm-ink) !important;\r\n  color:#0b120d !important;\r\n  transition-duration:var(--apcm-time-in);\r\n}\r\n.blog-item-comments .squarespace-comments .comment-btn:focus-visible{\r\n  outline:2px solid rgba(200,214,191,.7);\r\n  outline-offset:-2px;\r\n}\r\n/* logged-in avatar chip, if the visitor has one */\r\n.blog-item-comments .squarespace-comments .comment-btn.hasavatar{\r\n  padding-left:52px !important;\r\n}\r\n.blog-item-comments .squarespace-comments .comment-btn.hasavatar img{\r\n  border-radius:var(--apcm-radius) 0 0 var(--apcm-radius);\r\n  height:100%; top:0; left:0;\r\n}\r\n\r\n/* ==================================================================\r\n   4) THE LIST\r\n   Squarespace draws this on a light theme: black hairlines, bold\r\n   1.3em names, PNG icon buttons on white. Re-set for the dark ground.\r\n   ⚠ Verified against Squarespace's own comments stylesheet, and\r\n   rendered here against a node built to that markup — not against a\r\n   real posted comment, because there are none on the site yet.\r\n   ================================================================== */\r\n.blog-item-comments .squarespace-comments .comments-content .comment-list .comment{\r\n  border-top:1px solid var(--apcm-hair);\r\n  margin-bottom:8px;\r\n}\r\n.blog-item-comments .squarespace-comments .comments-content .comment-list .comment .comment-header{\r\n  padding:18px 0 10px 49px;\r\n}\r\n.blog-item-comments .squarespace-comments .comment-list .comment .comment-header .user-info .avatar img{\r\n  border-radius:50%;\r\n}\r\n.blog-item-comments .squarespace-comments .comment-list .comment .comment-header .user-info .author{\r\n  font-family:var(--apcm-sans);\r\n  font-size:14px; font-weight:600; letter-spacing:.005em;\r\n  color:var(--apcm-ink);\r\n}\r\n.blog-item-comments .squarespace-comments .comment-list .comment .comment-header .user-info .date,\r\n.blog-item-comments .squarespace-comments .comment-list .comment .comment-header .user-info .likes,\r\n.blog-item-comments .squarespace-comments .comment-list .comment .comment-header .user-info .posting-text{\r\n  font-family:var(--apcm-mono);\r\n  font-size:10px; letter-spacing:.11em; text-transform:uppercase;\r\n  color:rgba(243,241,234,.42);\r\n}\r\n/* The <p> inside carries the theme's own paragraph size, so the size\r\n   has to be set on both — setting it on .comment-body alone left the\r\n   text at the theme's larger body size. */\r\n.blog-item-comments .squarespace-comments .comment-list .comment .comment-body,\r\n.blog-item-comments .squarespace-comments .comment-list .comment .comment-body p{\r\n  font-family:var(--apcm-body);\r\n  font-size:15px; line-height:1.65;\r\n  color:rgba(243,241,234,.86);\r\n}\r\n.blog-item-comments .squarespace-comments .comment-list .comment .comment-body p:last-child{\r\n  margin-bottom:0;\r\n}\r\n/* The control row: Squarespace's icon chips are PNGs made for a light\r\n   background. Turned into quiet mono caps in the site's register. */\r\n.blog-item-comments .squarespace-comments .comment-list .comment .comment-header .controls .squarespace-comment-buttons .comment-control{\r\n  background-image:none !important;\r\n  background-color:transparent !important;\r\n  width:auto; height:auto;\r\n  padding:2px 0; margin-left:16px;\r\n  text-indent:0;\r\n  font-family:var(--apcm-mono);\r\n  font-size:10px; letter-spacing:.11em; text-transform:uppercase;\r\n  color:rgba(243,241,234,.5);\r\n  transition:color 200ms ease;\r\n}\r\n.blog-item-comments .squarespace-comments .comment-list .comment .comment-header .controls .squarespace-comment-buttons .comment-control:hover{\r\n  background-color:transparent !important;\r\n  color:var(--apcm-accent);\r\n}\r\n/* Reply boxes are the same pane, one step quieter. */\r\n.blog-item-comments .squarespace-comments .comment-list .reply-area-wrapper .new-comment-area{\r\n  background:\r\n    linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,0) 55%),\r\n    rgba(243,241,234,.03);\r\n}\r\n\r\n/* ==================================================================\r\n   5) PHONE\r\n   The pane keeps its shape; the button row goes full width so the\r\n   thumb has a real target, and the header stacks.\r\n   ================================================================== */\r\n@media (max-width:640px){\r\n  .blog-item-comments .squarespace-comments .header-controls .controls{\r\n    align-items:flex-start; flex-direction:column; gap:8px;\r\n  }\r\n  .blog-item-comments{ --apcm-gutter:46px; }\r\n  .blog-item-comments .squarespace-comments .new-comment-area .input::before{\r\n    top:18px; left:17px;\r\n  }\r\n  .blog-item-comments .squarespace-comments .new-comment-area .input form.comment-form textarea{\r\n    padding:16px 16px 16px var(--apcm-gutter);\r\n    min-height:120px;\r\n  }\r\n  .blog-item-comments .squarespace-comments .comment-btn-wrapper{\r\n    gap:14px; padding:11px 12px;\r\n  }\r\n  .blog-item-comments .squarespace-comments .comment-btn{\r\n    flex:1 1 auto;\r\n    padding:14px 18px !important;\r\n  }\r\n}\r\n\r\n/* ==================================================================\r\n   6) THE ANCHOR-AD CLEARANCE  (v7, 8.10.26)\r\n   Google's anchor ad bars the bottom ~84px of a phone viewport\r\n   (measured live 8.10.26: 375×84 at y 728–812). Any focus scroll\r\n   that lands the composer at the viewport bottom lands the button\r\n   inside that band. scroll-margin makes every scrollIntoView —\r\n   the browser's own focus scrolls included — stop 112px short of\r\n   the bottom edge instead (84px anchor + 28px breathing room).\r\n   The interactive half of the fix is the nudge at the end of the\r\n   script block below. 1000px matches the AdSense dashboard setting\r\n   (8.10.26): anchors only on screens up to 1000px wide.\r\n   ================================================================== */\r\n@media (max-width:1000px){\r\n  .blog-item-comments .squarespace-comments .new-comment-area{\r\n    scroll-margin-bottom:112px;\r\n  }\r\n}\r\n","\r\n/* ==================================================================\r\n   CLIMATE RANGE — all styling scoped under .apsc so the card's own\r\n   tokens (--mono, --accent, --sage, --dim, --dimmer, --rule) resolve.\r\n   The row itself is a standard .apsc-fact, so spacing and the label\r\n   style are inherited, not copied.\r\n   ================================================================== */\r\n.apsc .apsc-clim{margin-top:2px;}\r\n\r\n.apsc .apsc-clim__row{\r\n  display:flex;align-items:baseline;justify-content:space-between;\r\n  gap:10px;margin:0 0 1px;\r\n}\r\n.apsc .apsc-clim__sub{\r\n  font-family:var(--mono);font-size:8.5px;letter-spacing:.2em;\r\n  text-transform:uppercase;color:var(--dimmer);\r\n}\r\n/* the readout doubles as the month-hover display, so it is the one\r\n   piece of type in the widget set at reading size */\r\n.apsc .apsc-clim__read{\r\n  font-size:15px;line-height:1.4;color:var(--ink-bright);\r\n  font-variant-numeric:tabular-nums;\r\n}\r\n\r\n/* unit toggle — two mono pills, the active one lit in accent */\r\n.apsc .apsc-clim__units{display:flex;gap:4px;}\r\n.apsc .apsc-clim__unit{\r\n  font-family:var(--mono);font-size:9px;letter-spacing:.08em;\r\n  padding:2px 8px;border-radius:999px;cursor:pointer;\r\n  border:1px solid var(--rule);background:none;color:var(--dimmer);\r\n  transition:color .15s ease,border-color .15s ease;\r\n}\r\n.apsc .apsc-clim__unit:hover{color:var(--dim);border-color:rgba(243,241,234,.3);}\r\n.apsc .apsc-clim__unit[aria-pressed=\"true\"]{\r\n  color:var(--accent);border-color:rgba(175,192,144,.5);\r\n  background:rgba(175,192,144,.07);\r\n}\r\n.apsc .apsc-clim__unit:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}\r\n/* v6: the Temp|Humidity switch — exists only in the condensed mode\r\n   (see the media block below); same pill voice as the unit toggle */\r\n.apsc .apsc-clim__switch{display:none;gap:4px;margin:0 0 8px;}\r\n.apsc .apsc-clim__swbtn{\r\n  font-family:var(--mono);font-size:9px;letter-spacing:.08em;\r\n  text-transform:uppercase;\r\n  padding:2px 10px;border-radius:999px;cursor:pointer;\r\n  border:1px solid var(--rule);background:none;color:var(--dimmer);\r\n  transition:color .15s ease,border-color .15s ease;\r\n}\r\n.apsc .apsc-clim__swbtn:hover{color:var(--dim);border-color:rgba(243,241,234,.3);}\r\n.apsc .apsc-clim__swbtn[aria-pressed=\"true\"]{\r\n  color:var(--accent);border-color:rgba(175,192,144,.5);\r\n  background:rgba(175,192,144,.07);\r\n}\r\n.apsc .apsc-clim__swbtn:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}\r\n\r\n/* ---- v80: THE REST-SEASON CALENDAR (Amorphophallus only) ----------\r\n   data-apclim-collapse repeats the short-viewport rules WITHOUT the\r\n   media query, so on this genus the two monthly charts are always one\r\n   at a time and the calendar has the room. The media block below is\r\n   left exactly as it was: on a short viewport both paths agree. */\r\n.apsc .apsc-clim[data-apclim-collapse=\"1\"] .apsc-clim__switch{display:flex;}\r\n.apsc .apsc-clim[data-apclim-collapse=\"1\"][data-apclim-view=\"t\"] .apsc-clim__h{display:none;}\r\n.apsc .apsc-clim[data-apclim-collapse=\"1\"][data-apclim-view=\"h\"] .apsc-clim__t{display:none;}\r\n\r\n.apsc .apclim-rest{margin:14px 0 0;padding:13px 0 0;border-top:1px solid rgba(243,241,234,.12);}\r\n/* v87: the Köppen zones + at-elevation lines under the charts */\r\n.apsc .apclim-kz{margin:12px 0 0;padding:10px 0 0;border-top:1px solid rgba(243,241,234,.12);\r\n  display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;}\r\n.apsc .apclim-kz+.apclim-kz{margin-top:7px;padding-top:0;border-top:0;}\r\n.apsc .apclim-kz__label{font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;\r\n  color:var(--dimmer);white-space:nowrap;}\r\n.apsc .apclim-kz__val{font-size:12.5px;line-height:1.55;color:var(--dim);}\r\n.apsc .apclim-kz__fine{margin:7px 0 0;font-size:10.5px;line-height:1.5;color:var(--dimmer);}\r\n.apsc .apclim-rest__top{display:flex;align-items:center;justify-content:space-between;margin:0 0 6px;}\r\n.apsc .apclim-rest__hemi{display:flex;gap:2px;}\r\n.apsc .apclim-rest__chart svg{width:100%;height:auto;display:block;}\r\n/* ⚠ ONE LINE, ONE SIZE, SIZED TO THE CONTAINER — NOT THE VIEWPORT.\r\n   The callout runs ~432 px at 15 px, and the panel is only 301 px wide\r\n   at a 1280 viewport (the card goes two-column there), so it wrapped\r\n   to two lines on desktop while fitting on a phone. A vw-based clamp\r\n   would have read the WRONG box for exactly that reason; cqw measures\r\n   the panel itself. Both halves are now one size — only weight\r\n   separates them. */\r\n.apsc .apclim-rest{container-type:inline-size;}\r\n.apsc .apclim-rest__head{\r\n  margin:7px 0 0;color:var(--accent);line-height:1.4;\r\n  white-space:nowrap;font-size:clamp(8px, 3cqw, 13px);\r\n}\r\n.apsc .apclim-rest__head b{font-weight:600;}\r\n/* ⚠ 3cqw IS MEASURED, NOT GUESSED. The first cut used 3.3cqw from a\r\n   0.5em-per-character estimate and clipped the callout by 12-13px at\r\n   three of four widths — and the check that passed it asserted \"one\r\n   line\", which white-space:nowrap guarantees whether the text fits or\r\n   not. The real figure is 31.4px of text per 1px of font-size for this\r\n   string in this face, constant across widths, so an exact fit is\r\n   ~3.19cqw; 3 leaves about 6% for the longest month pair.\r\n   VERIFY WITH scrollWidth > clientWidth, NEVER by line count. */\r\n/* no container-query support: fall back to a size that fits the\r\n   narrowest panel rather than to a wrapped headline */\r\n@supports not (font-size: 1cqw){\r\n  .apsc .apclim-rest__head{font-size:9px;}\r\n}\r\n.apsc .apclim-rest__bar{color:rgba(243,241,234,.28);margin:0 .5em;}\r\n.apsc .apclim-rest__grow{color:rgba(243,241,234,.8);font-weight:400;}\r\n.apsc .apclim-rest__hemi button{cursor:pointer;}\r\n.apsc .apclim-rest__native{\r\n  color:rgba(243,241,234,.42);margin:0 0 5px;letter-spacing:.02em;\r\n  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\r\n  font-size:clamp(8px, 2.5cqw, 11px);\r\n}\r\n@supports not (font-size: 1cqw){ .apsc .apclim-rest__native{font-size:9px;} }\r\n.apsc .apclim-rest__hint{\r\n  color:rgba(243,241,234,.55);margin:3px 0 0;min-height:1.5em;\r\n  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\r\n  font-size:clamp(8px, 2.6cqw, 11.5px);\r\n}\r\n@supports not (font-size: 1cqw){ .apsc .apclim-rest__hint{font-size:9px;} }\r\n.apsc .apclim-col{fill:transparent;pointer-events:all;cursor:default;}\r\n.apsc .apclim-rest__body{font-size:13px;color:rgba(243,241,234,.72);margin:2px 0 0;}\r\n.apsc .apclim-rest__flower{\r\n  font-size:12px;color:rgba(243,241,234,.66);margin:4px 0 0;\r\n  padding-left:9px;border-left:2px solid rgba(243,241,234,.32);\r\n}\r\n.apsc .apclim-rest__note{font-size:11.5px;color:rgba(243,241,234,.45);margin:7px 0 0;line-height:1.45;}\r\n/* the old max-width override is gone: it fought the container clamp,\r\n   and the phone is not the narrow case here — the two-column desktop\r\n   panel is. */\r\n\r\n.apsc .apsc-clim svg{display:block;width:100%;height:auto;margin:3px 0 10px;}\r\n.apsc .apsc-clim svg text{font-family:var(--mono);}\r\n.apsc .apclim-grid{stroke:rgba(243,241,234,.08);stroke-width:1;}\r\n.apsc .apclim-ylab{font-size:8px;fill:var(--dim);}\r\n.apsc .apclim-mlab{font-size:7.5px;fill:var(--dim);}\r\n.apsc .apclim-mlab--now{fill:var(--accent);}\r\n.apsc .apclim-now{stroke:rgba(243,241,234,.22);stroke-width:1;}\r\n/* temperature band in the map's accent green; humidity in sage — the\r\n   card's two greens, kept apart on purpose like everywhere else */\r\n.apsc .apclim-band--t{fill:rgba(175,192,144,.16);}\r\n.apsc .apclim-band--t-in{fill:rgba(175,192,144,.26);}\r\n.apsc .apclim-edge--t{fill:none;stroke:var(--accent);stroke-width:1.1;stroke-linejoin:round;}\r\n.apsc .apclim-band--h{fill:rgba(200,214,191,.12);}\r\n.apsc .apclim-edge--h{fill:none;stroke:var(--sage);stroke-width:1;stroke-opacity:.8;stroke-linejoin:round;}\r\n/* invisible hover columns; the lit one echoes the map-hover habit */\r\n.apsc .apclim-col{fill:transparent;}\r\n.apsc .apclim-col:hover{fill:rgba(243,241,234,.05);}\r\n\r\n/* zone chips — the place-chip look, but they are facts, not links */\r\n.apsc .apsc-clim__legend{\r\n  display:flex;align-items:center;gap:5px;margin:-5px 0 10px;\r\n  font-family:var(--mono);font-size:8px;letter-spacing:.08em;\r\n  text-transform:uppercase;color:var(--dimmer);\r\n}\r\n.apsc .apsc-clim__key{width:14px;height:7px;border-radius:2px;display:inline-block;}\r\n.apsc .apsc-clim__key--typ{margin-left:8px;}\r\n.apsc .apsc-clim__key--env{background:rgba(175,192,144,.16);box-shadow:inset 0 0 0 1px rgba(175,192,144,.45);}\r\n.apsc .apsc-clim__key--typ{background:rgba(175,192,144,.42);}\r\n.apsc .apsc-clim__zones{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px;}\r\n.apsc .apsc-clim__zone{\r\n  font-family:var(--body);font-size:11px;letter-spacing:.02em;line-height:1.5;\r\n  padding:2px 9px;border-radius:999px;border:1px solid rgba(175,192,144,.26);\r\n  color:var(--sage);background:rgba(175,192,144,.05);white-space:nowrap;\r\n  cursor:default;\r\n}\r\n.apsc .apsc-clim__zone b{font-weight:400;color:var(--dimmer);margin-left:4px;}\r\n\r\n/* v43: the small-screen (i) dot and its hover panel */\r\n.apsc .apsc-clim__info{\r\n  /* v7: always shown — the provenance line is always collapsed now */\r\n  display:inline-block;position:relative;margin-left:8px;\r\n  width:15px;height:15px;line-height:14px;text-align:center;\r\n  border-radius:50%;border:1px solid rgba(175,192,144,.4);\r\n  color:var(--sage);font-family:var(--mono);font-size:10px;\r\n  cursor:default;vertical-align:middle;\r\n  /* v46: the dot sits inside the fact label, whose uppercase\r\n     transform inherits - without this the \"i\" renders as \"I\" */\r\n  text-transform:none;\r\n}\r\n.apsc .apsc-clim__infopop{\r\n  display:none;position:absolute;z-index:6;top:15px;left:-12px;\r\n  width:280px;padding:10px;text-align:left;\r\n  background:#131a15;border:1px solid var(--rule);border-radius:3px;\r\n  box-shadow:0 8px 24px rgba(0,0,0,.5);\r\n  text-transform:none;letter-spacing:normal;white-space:normal;\r\n}\r\n.apsc .apsc-clim__info:hover .apsc-clim__infopop,\r\n.apsc .apsc-clim__info.is-open .apsc-clim__infopop{display:block;}\r\n.apsc .apsc-clim__infopop .apsc-clim__note{white-space:normal;overflow:visible;max-width:none;}\r\n/* min-width guard: phone portrait heights are under 900px too, but\r\n   there the rail is single-column and nothing needs the height back -\r\n   and the (i) dot's hover panel has no reliable touch equivalent */\r\n/* v7: the provenance line is collapsed at EVERY viewport (user\r\n   ruling 8.16.26) — the pop carries it always; only the zone chips\r\n   still come and go with the viewport height */\r\n.apsc .apsc-facts--rest .apsc-clim__note{display:none;}\r\n.apsc .apsc-clim__infopop .apsc-clim__note{display:block;}\r\n@media (min-width:821px) and (max-height:899px){\r\n  .apsc .apsc-clim__zones{display:none;}\r\n  /* v6: one monthly chart at a time — the switch appears, and the\r\n     [data-apclim-view] side wins. The °F/°C pills sit in the\r\n     temperature header (__t), so the humidity view hides them too.\r\n     The --mini yearly line carries no view attribute and no __t/__h\r\n     children, so it is untouched. */\r\n  .apsc .apsc-clim__switch{display:flex;}\r\n  .apsc .apsc-clim[data-apclim-view=\"t\"] .apsc-clim__h{display:none;}\r\n  .apsc .apsc-clim[data-apclim-view=\"h\"] .apsc-clim__t{display:none;}\r\n}\r\n/* v6 (was v43): the condensed mode used to hide the panel's yearly\r\n   line because its height buried the CLIMATE RANGE heading. With the\r\n   charts collapsed to one (the switch above), the stack fits WITH\r\n   the yearly line, and the user wants it kept — the hide is deleted. */\r\n/* v43: shorter still, the compact map gives up more height so the\r\n   chart stack loses as little as possible under the seam */\r\n@media (min-width:821px) and (max-height:767px){\r\n  .apsc .apsc-facts--follow.apsc--compact .apsc-map svg{max-height:88px;}\r\n}\r\n.apsc .apsc-clim__note{\r\n  font-family:var(--mono);font-size:8px;letter-spacing:.06em;\r\n  color:var(--dimmer);line-height:1.7;cursor:help;\r\n  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\r\n}\r\n","\r\n  .pn-rail{\r\n    --pn-cream:#F3F1EA;\r\n    --pn-sage:#C8D6BF;\r\n    --pn-sage-pale:#A9C199;\r\n    --pn-spadix:#CDE86B;\r\n    --pn-mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,monospace;\r\n\r\n    --pn-rail-left:28px;\r\n    /* Taller than the genus rail's min(46vh,360px): the Alocasia page\r\n       has TWELVE sections against the genus pages' eight, and at 360px\r\n       twelve ticks sit 30px apart, which reads as a stack rather than a\r\n       scale. */\r\n    --pn-rail-h:min(62vh,470px);\r\n\r\n    position:fixed; z-index:60;\r\n    left:var(--pn-rail-left); top:50%;\r\n    transform:translateY(-50%);\r\n    height:var(--pn-rail-h); width:1px;\r\n    opacity:0;\r\n    pointer-events:none;\r\n    transition:opacity .55s ease;\r\n  }\r\n  .pn-rail.is-ready.is-visible{opacity:1; pointer-events:auto}\r\n\r\n  .pn-rail__line{\r\n    position:absolute; top:0; bottom:0; left:0; width:1px;\r\n    background:rgba(200,214,191,.22);\r\n  }\r\n  .pn-rail__fill{\r\n    position:absolute; top:0; left:0; width:1px; height:0;\r\n    background:linear-gradient(var(--pn-spadix),var(--pn-sage));\r\n    box-shadow:0 0 12px rgba(205,232,107,.5);\r\n    transition:height .25s cubic-bezier(.23,1,.32,1);\r\n  }\r\n\r\n  .pn-rail__tick{\r\n    position:absolute; left:-3px;\r\n    width:7px; height:1px;\r\n    padding:0; margin:0; border:0;\r\n    background:rgba(243,241,234,.40);\r\n    cursor:pointer; outline-offset:10px;\r\n  }\r\n  /* An invisible hit area, so a 1px tick and its label are one target\r\n     rather than a 7x1px pixel-hunt. */\r\n  .pn-rail__tick::before{\r\n    content:\"\"; position:absolute; inset:-9px -150px -9px -9px;\r\n  }\r\n  .pn-rail__tick span{\r\n    position:absolute; left:16px; top:-5px; white-space:nowrap;\r\n    font-family:var(--pn-mono);\r\n    font-size:8.5px; letter-spacing:.16em; text-transform:uppercase;\r\n    color:rgba(243,241,234,.40);\r\n    /* stands in for the genus rail's dark-ink twin: enough to hold up\r\n       if a photo section scrolls past behind the rail */\r\n    text-shadow:0 1px 6px rgba(0,0,0,.85);\r\n    transition:color .3s ease;\r\n  }\r\n  /* ================= THE HUB MARK — genus pages only =================\r\n     A rhombus sitting above the first tick, with its own short connector\r\n     running down into the rail line so it reads as the top of the same\r\n     scale rather than a link floating next to it.\r\n\r\n     Deliberately NOT a .pn-rail__tick: it is a different kind of thing\r\n     (it leaves the page), so it gets a different shape, a slightly\r\n     larger label, and its own hover colour. A reader should be able to\r\n     tell at a glance that the diamond goes somewhere else.\r\n\r\n     It is suppressed on the hub itself — see build(). */\r\n  .pn-rail__hub{\r\n    position:absolute; left:-4px; top:-34px;\r\n    width:9px; height:9px;\r\n    padding:0; margin:0; text-decoration:none;\r\n    outline-offset:10px;\r\n  }\r\n  .pn-rail__hub i{\r\n    position:absolute; inset:0;\r\n    background:rgba(243,241,234,.55);\r\n    transform:rotate(45deg);\r\n    transition:background .3s ease, box-shadow .3s ease;\r\n  }\r\n  /* the connector down to the top of the rail line */\r\n  .pn-rail__hub::after{\r\n    content:\"\"; position:absolute;\r\n    left:4px; top:9px; width:1px; height:25px;\r\n    background:rgba(200,214,191,.22);\r\n  }\r\n  /* one hit area covering rhombus + label, same trick as the ticks */\r\n  .pn-rail__hub::before{\r\n    content:\"\"; position:absolute; inset:-9px -200px -9px -9px;\r\n  }\r\n  .pn-rail__hub span{\r\n    position:absolute; left:21px; top:-3px; white-space:nowrap;\r\n    font-family:var(--pn-mono);\r\n    font-size:9.5px;                    /* larger than a tick's 8.5px */\r\n    letter-spacing:.18em; text-transform:uppercase;\r\n    color:rgba(243,241,234,.55);\r\n    text-shadow:0 1px 6px rgba(0,0,0,.85);\r\n    transition:color .3s ease;\r\n  }\r\n  .pn-rail__hub:hover i,\r\n  .pn-rail__hub:focus-visible i{\r\n    background:var(--pn-spadix);\r\n    box-shadow:0 0 10px rgba(205,232,107,.55);\r\n  }\r\n  .pn-rail__hub:hover span,\r\n  .pn-rail__hub:focus-visible span{color:var(--pn-cream)}\r\n  .pn-rail__hub:focus-visible{outline:1px solid var(--pn-sage-pale)}\r\n\r\n  .pn-rail__tick.is-passed span{color:var(--pn-sage-pale)}\r\n  .pn-rail__tick.is-current span{color:var(--pn-cream)}\r\n  .pn-rail__tick:hover span{color:var(--pn-cream)}\r\n  .pn-rail__tick:focus-visible{outline:1px solid var(--pn-sage-pale)}\r\n\r\n  /* ---- NO FLOATING CHROME ON SMALL SCREENS ----\r\n     820px, not 600px, so a phone in LANDSCAPE (812px wide, the least\r\n     vertical room of any screen) is covered too. The reading path block\r\n     is the on-page navigation there, and it is better than a rail. */\r\n  @media (max-width:820px){\r\n    .pn-rail{display:none}\r\n  }\r\n\r\n  body.sqs-edit-mode-active .pn-rail{display:none}\r\n\r\n  @media (prefers-reduced-motion: reduce){\r\n    .pn-rail__fill{transition:none}\r\n    .pn-rail{transition:none}\r\n  }\r\n"];
  css.forEach(function(t){
    var s = document.createElement("style");
    s.textContent = t;
    (document.head || document.documentElement).appendChild(s);
  });
})();
;

(()=>{if(window.self!==window.top&&window.top.Static.SQUARESPACE_CONTEXT.authenticatedAccount){var e="beyondspace--classic-gallery";if(!window.top.document.getElementById(e)){var t=window.top.document.createElement("script");t.id=e,t.src="https://cdn.jsdelivr.net/gh/BeyondspaceStudio/beyondspace-snippets@0.0.44/src/classic-gallery-block/index.min.js",window.top.document.body.appendChild(t)}}})();

;

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(
    '.sqs-search-ui-text-input input[type="search"]'
  );
  if (searchInput) {
    searchInput.placeholder = "SEARCH AROIDPEDIA";
    searchInput.setAttribute("aria-label", "Search Aroidpedia");
  }
});

;

document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(
    '.blog-item-category-wrapper a.blog-item-category--Species'
  )) {
    document.body.classList.add('aroid-is-species');
  }
});

;

(function(){
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  const OVERLAY_ID = 'ap-lightbox-overlay';

  function ensureOverlay(){
    let ov = document.getElementById(OVERLAY_ID);
    if (ov) return ov;

    ov = document.createElement('div');
    ov.id = OVERLAY_ID;
    ov.className = 'ap-lightbox-overlay';
    ov.innerHTML = `
      <div class="ap-lightbox-inner" role="dialog" aria-modal="true" aria-label="Image preview">
        <button class="ap-lightbox-close" type="button" aria-label="Close">×</button>
        <img class="ap-lightbox-img" alt="">
      </div>
    `;
    document.body.appendChild(ov);

    // close behaviors
    ov.addEventListener('click', (e) => {
      if (e.target === ov) closeOverlay();
    });
    ov.querySelector('.ap-lightbox-close').addEventListener('click', closeOverlay);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeOverlay();
    });

    return ov;
  }

  function openOverlay(src, alt){
    const ov = ensureOverlay();
    const img = ov.querySelector('.ap-lightbox-img');
    img.src = src;
    img.alt = alt || '';
    ov.classList.add('ap-open');
  }

  function closeOverlay(){
    const ov = document.getElementById(OVERLAY_ID);
    if (!ov) return;
    const img = ov.querySelector('.ap-lightbox-img');
    ov.classList.remove('ap-open');
    // clear src after animation tick to stop large downloads if user closes quickly
    setTimeout(()=>{ img.src = ''; }, 50);
  }

  function isSquarespaceNativeLightboxEnabled(wrapper){
    // If Squarespace has already added its own lightbox button/behavior, leave it alone.
    return !!wrapper.querySelector('.sqs-block-image-button.lightbox');
  }

  function getBestSrc(img){
    // Prefer the canonical image URL Squarespace stores
    return img.getAttribute('data-image') ||
           img.getAttribute('data-src') ||
           img.currentSrc ||
           img.src;
  }

  function enableForImageBlocks(root=document){
    const wrappers = root.querySelectorAll('.image-block-wrapper');
    wrappers.forEach(wrapper => {
      if (isSquarespaceNativeLightboxEnabled(wrapper)) return;

      const img = wrapper.querySelector('img');
      if (!img) return;

      // Avoid double-binding
      if (wrapper.dataset.apLightboxBound === '1') return;
      wrapper.dataset.apLightboxBound = '1';
      wrapper.classList.add('ap-lightbox-enabled');

      wrapper.addEventListener('click', (e) => {
        // Don’t hijack clicks on actual links/buttons inside the block
        if (e.target.closest('a, button')) return;

        const src = getBestSrc(img);
        if (!src) return;

        e.preventDefault();
        e.stopPropagation();
        openOverlay(src, img.getAttribute('alt'));
      });
    });
  }

  // Initial load
  document.addEventListener('DOMContentLoaded', () => enableForImageBlocks());

  // Squarespace can lazy-load / inject content after load; watch for new blocks
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes && m.addedNodes.forEach(node => {
        if (node.nodeType === 1) enableForImageBlocks(node);
      });
    }
  });
  mo.observe(document.documentElement, { childList:true, subtree:true });
})();

;

      /* ON MOBILE MAKE THE LARGEST PHOTO SHOW FIRST FOR FRINGE CASES WHERE PARENT PHOTOS ARE IN */
(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  // ✅ Change this to the block id of the MAIN image on that page
  const HERO_BLOCK_ID = "block-3f425759eb5e9b64c9bb";

  const mq = window.matchMedia("(max-width: 767px)");

  function moveHeroColumnToTop() {
    if (!mq.matches) return;

    const heroBlock = document.getElementById(HERO_BLOCK_ID);
    if (!heroBlock) return;

    // Find the column that contains the hero image block
    const heroCol = heroBlock.closest('[class*="sqs-col-"]');
    if (!heroCol) return;

    // Find the row that contains that column
    const row = heroCol.closest(".sqs-row");
    if (!row) return;

    // If it's not already first, move it to the top of the row
    if (row.firstElementChild !== heroCol) {
      row.insertBefore(heroCol, row.firstElementChild);
    }
  }

  // Run once when ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", moveHeroColumnToTop);
  } else {
    moveHeroColumnToTop();
  }

  // Run on orientation/resize changes
  if (mq.addEventListener) mq.addEventListener("change", moveHeroColumnToTop);
  else mq.addListener(moveHeroColumnToTop);

  // Run again after Squarespace finishes reflowing content
  const obs = new MutationObserver(() => moveHeroColumnToTop());
  obs.observe(document.body, { childList: true, subtree: true });
})();

;

(function () {
  // Editor guard — don't run inside Squarespace's editor
  try {
    if (window.self !== window.top) return;
    if (document.body && document.body.classList.contains('sqs-edit-mode')) return;
    if (document.documentElement.classList.contains('squarespace-damask')) return;
    if (window.Static && window.Static.SQUARESPACE_CONTEXT &&
        window.Static.SQUARESPACE_CONTEXT.authenticatedAccount) return;
  } catch (e) { return; }

  // Curly → straight mapping
  // \u2018 = left single quote   '
  // \u2019 = right single quote  '  (also used as apostrophe)
  // \u201C = left double quote   "
  // \u201D = right double quote  "
  var CURLY_RE = /[\u2018\u2019\u201C\u201D]/g;
  var MAP = {
    '\u2018': "'",
    '\u2019': "'",
    '\u201C': '"',
    '\u201D': '"'
  };

  function normalizeTextNode(textNode) {
    var text = textNode.nodeValue;
    if (!CURLY_RE.test(text)) return;
    CURLY_RE.lastIndex = 0;
    textNode.nodeValue = text.replace(CURLY_RE, function (ch) { return MAP[ch]; });
  }

  function normalizeQuotes(root) {
    // Only touch rich-text content blocks. Skip page titles, nav, meta, form fields, etc.
    var containers = root.querySelectorAll(
      '.sqs-html-content, .blog-item-content, .entry-title, .item-pagination-title, .image-caption'
    );
    containers.forEach(function (container) {
      if (container.dataset.apQuotesNormalized === '1') return;

      var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
      var textNodes = [];
      var node;
      while ((node = walker.nextNode())) textNodes.push(node);

      textNodes.forEach(normalizeTextNode);
      container.dataset.apQuotesNormalized = '1';
    });
  }

  function run() { normalizeQuotes(document.body); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  var mo = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var added = mutations[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        if (added[j].nodeType === 1) normalizeQuotes(added[j]);
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

;

(function () {
  // Editor guard — don't run inside Squarespace's editor
  try {
    if (window.self !== window.top) return;
    if (document.body && document.body.classList.contains('sqs-edit-mode')) return;
    if (document.documentElement.classList.contains('squarespace-damask')) return;
    if (window.Static && window.Static.SQUARESPACE_CONTEXT &&
        window.Static.SQUARESPACE_CONTEXT.authenticatedAccount) return;
  } catch (e) { return; }

  // Case A: after </a>, restore space before "(" or "x " (existing behavior)
  function restoreSpacesAfterLinks(root) {
    var links = root.querySelectorAll('.sqs-html-content a, .image-caption a');
    links.forEach(function (a) {
      if (a.dataset.apSpaceFixed === '1') return;
      var next = a.nextSibling;
      if (!next || next.nodeType !== Node.TEXT_NODE) return;
      var text = next.nodeValue;
      if (/^\(/.test(text) || /^x\s/.test(text)) {
        next.nodeValue = ' ' + text;
        a.dataset.apSpaceFixed = '1';
      }
    });
  }

  // Case B: inside text nodes, find word-character directly touching an opening
  // quote (straight or curly) and insert a space. This catches the
  // "cuprea'Red Secret'" pattern — where Squarespace stripped the space inside
  // a single <em> block between a word and the opening quote of a cultivar name.
  // The regex requires the character BEFORE to be a letter (lowercase or upper)
  // and the character AFTER the quote to be a capital letter, so we don't match
  // contractions like "don't" or possessives like "Mauro's".
  var WORD_QUOTE_RE = /([a-z])(['\u2018"\u201C])([A-Z])/g;

  function restoreSpacesInsideText(root) {
    var containers = root.querySelectorAll('.sqs-html-content, .image-caption');
    containers.forEach(function (container) {
      if (container.dataset.apInnerSpaceFixed === '1') return;

      var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
      var textNodes = [];
      var node;
      while ((node = walker.nextNode())) textNodes.push(node);

      textNodes.forEach(function (textNode) {
        var text = textNode.nodeValue;
        WORD_QUOTE_RE.lastIndex = 0;
        if (!WORD_QUOTE_RE.test(text)) return;
        textNode.nodeValue = text.replace(WORD_QUOTE_RE, '$1 $2$3');
      });

      container.dataset.apInnerSpaceFixed = '1';
    });
  }

  // Case C: after closing </em> or </i>, if the next text starts with an
  // opening quote or capital letter, restore the space.
  function restoreSpacesAfterItalics(root) {
    var italics = root.querySelectorAll('.sqs-html-content em, .sqs-html-content i, .image-caption em, .image-caption i');
    italics.forEach(function (el) {
      if (el.dataset.apItalicSpaceFixed === '1') return;
      var next = el.nextSibling;
      if (!next || next.nodeType !== Node.TEXT_NODE) return;
      var text = next.nodeValue;
      // Insert a space if next char is: opening quote (straight/curly),
      // opening paren, or a capital letter (A–Z).
      if (/^['\u2018"\u201C(]/.test(text) || /^[A-Z]/.test(text)) {
        next.nodeValue = ' ' + text;
        el.dataset.apItalicSpaceFixed = '1';
      }
    });
  }

  function run() {
    // Order: Case B (text-internal) first, so subsequent scripts see clean
    // text. Cases A and C operate on tag boundaries and don't conflict.
    restoreSpacesInsideText(document.body);
    restoreSpacesAfterLinks(document.body);
    restoreSpacesAfterItalics(document.body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  var mo = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var added = mutations[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        if (added[j].nodeType === 1) {
          restoreSpacesInsideText(added[j]);
          restoreSpacesAfterLinks(added[j]);
          restoreSpacesAfterItalics(added[j]);
        }
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

;

(function () {
  // Editor guard
  try {
    if (window.self !== window.top) return;
    if (document.body && document.body.classList.contains('sqs-edit-mode')) return;
    if (document.documentElement.classList.contains('squarespace-damask')) return;
    if (window.Static && window.Static.SQUARESPACE_CONTEXT &&
        window.Static.SQUARESPACE_CONTEXT.authenticatedAccount) return;
  } catch (e) { return; }

  // All currently accepted Araceae genera (Plants of the World Online).
  // Add new genera here as taxonomy updates. Case-sensitive: capitalized form only.
var GENERA = [
  "Adelonema","Aglaodorum","Aglaonema","Aia","Alloschemone","Alocasia","Ambrosina",
  "Amorphophallus","Amydrium","Anadendrum","Anaphyllopsis","Anaphyllum","Anchomanes",
  "Anthurium","Anubias","Apoballis","Aridarum","Ariopsis","Arisaema","Arisarum",
  "Arophyton","Arum","Asterostigma","Ayuantha","Bakoa","Bakoaella","Bau","Biarum",
  "Bidayuha","Bognera","Borneoa","Boycea","Bucephalandra","Burttianthus","Caladium",
  "Calla","Callopsis","Carlephyton","Cercestis","Chlorospatha","Colletogyne",
  "Colobogynium","Colocasia","Croatiella","Cryptocoryne","Culcasia","Cyrtosperma",
  "Dieffenbachia","Dracontioides","Dracontium","Dracunculus","Eminium","Englerarum",
  "Epipremnum","Fenestratarum","Filarum","Furtadoa","Galantharum","Gamogyne","Gearum",
  "Gonatopus","Gorgonidium","Gosong","Gymnostachys","Hapaline","Helicodiceros","Hera",
  "Heteroaridarum","Heteropsis","Holochlamys","Homalomena","Hottarum","Ibania",
  "Idimanthus","Incarum","Jasarum","Josefia","Kiewia","Lagenandra","Lasia","Lasimorpha",
  "Lazarum","Lemna","Leucocasia","Lorenzia","Lysichiton","Mangonia","Monstera",
  "Montrichardia","Nabalu","Naiadia","Nephthytis","Ooia","Orontium","Peltandra",
  "Philodendron","Philonotion","Phyllotaenium","Phymatarum","Pichinia","Pinellia",
  "Piptospatha","Pistia","Podolasia","Pothoidium","Pothos","Protarum","Pseudohydrosme",
  "Pursegloveia","Pycnospatha","Remusatia","Rhaphidophora","Rhodospatha","Rhynchopyle",
  "Sarawakia","Sauromatum","Scaphispatha","Schismatoglottis","Schottarum","Schottariella",
  "Scindapsus","Spathantheum","Spathicarpa","Spathiphyllum","Spirodela","Stenospermation",
  "Steudnera","Stylochiton","Symplocarpus","Synandrospadix","Syngonium",
  "Taccarum","Tawaia","Theriophonum","Toga","Tweeddalea","Typhonium","Typhonodorum",
  "Ulearum","Urospatha","Vesta","Vietnamocasia","Vivaria","Wolffia","Wolffiella",
  "Xanthosoma","Zamioculcas","Zantedeschia","Zomicarpa","Zomicarpella"
];

  // Sort by length descending so longer names match first (prevents e.g. "Anthurium"
  // from being partially matched as "Arum" embedded inside). \b ensures whole-word.
  GENERA.sort(function(a, b) { return b.length - a.length; });
  var GENUS_RE = new RegExp('\\b(' + GENERA.join('|') + ')\\b', 'g');

  /* ==================================================================
     EPITHETS  (added 2026-08-04)
     ------------------------------------------------------------------
     Previously this block italicised the GENUS WORD only, so
     "Alocasia macrorrhizos" came out with the genus in italic and the
     epithet upright — correct for a mention of the genus alone, wrong
     for a binomial, and it is a binomial most of the time.

     A lowercase word after a genus is treated as an epithet UNLESS it
     is in STOP. That list is the whole safety mechanism: without it,
     "Alocasia is a genus of…" italicises "is", and "Alocasia and
     Colocasia" italicises "and". Latin epithets never collide with
     English function words, so the test is reliable in both
     directions.

     Also handled, because botanical style wants the rank abbreviation
     ROMAN between two italic words:
         Alocasia longiloba var. watsoniana
         Colocasia esculenta subsp. antiquorum
     A cultivar in quotes is left alone — it starts with a capital and
     a quote, so the lowercase test already excludes it, and the
     UNITALICIZE block downstream is unaffected.
     ================================================================== */
  var STOP = {};
  ('is are was were be been being am has have had having ' +
   'and or but nor not also only both all most many some few several other others another ' +
   'in on at to from of for with by as into onto than then that this these those there here ' +
   'can could may might will would shall should must does do did done ' +
   'it its they their them which who whose when where while if so such same ' +
   'a an the its his her our your my ' +
   'species genus genera section sections subgenus subgenera group groups complex clade ' +
   'plant plants hybrid hybrids cultivar cultivars variety varieties form forms type types ' +
   'leaf leaves leaflet leaflets stem stems petiole petioles blade blades ' +
   'spathe spathes spadix inflorescence inflorescences flower flowers fruit fruits ' +
   'berry berries seed seeds corm corms tuber tubers rhizome rhizomes root roots ' +
   'resembles resembling differs differing occurs occurring grows growing produces producing ' +
   'appears appearing described describing named naming known found used using collected ' +
   'reported remains belongs including includes shows showing considered treated placed ' +
   'during about between among near across within without along around under over above below ' +
   'new old first second third last similar different small large young mature common rare ' +
   'sp spp ssp subsp var cf aff indet nov ined sensu ex et al etc ie eg ' +
   'often usually rarely sometimes always never generally typically probably possibly ' +
   'according based due prior since until before after through per via'
  ).split(' ').forEach(function (w) { if (w) STOP[w] = 1; });

  // rank abbreviations that sit ROMAN between two italic words
  var RANK_RE = /^(\s+)(var\.|subsp\.|ssp\.|f\.|forma|cv\.)(\s+)([a-z][a-z\-]{2,})\b/;
  var EPITHET_RE = /^(\s+)([a-z][a-z\-]{2,})\b/;

  function isEpithet(w) {
    return w && w.length >= 3 && !STOP[w];
  }

  // Detects if a node (or any ancestor up to body) is already in italic context
  function isInsideItalic(node) {
    var el = node.parentNode;
    while (el && el !== document.body) {
      if (el.nodeType === 1) {
        var tag = el.tagName;
        if (tag === 'EM' || tag === 'I') return true;
        var style = el.getAttribute && el.getAttribute('style');
        if (style && /italic/i.test(style)) return true;
        if (el.className && typeof el.className === 'string' &&
            el.className.indexOf('ap-genus-italic') !== -1) return true;
      }
      el = el.parentNode;
    }
    return false;
  }

  function ital(text) {
    var span = document.createElement('span');
    span.className = 'ap-genus-italic';
    span.textContent = text;
    return span;
  }

  function italicizeGenera(root) {
    if (!root || !root.querySelectorAll) return;
    // Restrict scope to rich-text content. Skip titles (already ALL CAPS), meta, nav, etc.
    var containers = root.querySelectorAll('.sqs-html-content, .image-caption');
    containers.forEach(function (container) {
      if (container.dataset.apGeneraItalicized === '1') return;

      var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (isInsideItalic(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      var textNodes = [];
      var node;
      while ((node = walker.nextNode())) textNodes.push(node);

      textNodes.forEach(function (textNode) {
        var text = textNode.nodeValue;
        GENUS_RE.lastIndex = 0;
        if (!GENUS_RE.test(text)) return;
        GENUS_RE.lastIndex = 0;

        var frag = document.createDocumentFragment();
        var lastIndex = 0;
        var match;
        while ((match = GENUS_RE.exec(text)) !== null) {
          if (match.index > lastIndex) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
          }
          frag.appendChild(ital(match[1]));
          var cursor = match.index + match[0].length;

          // the species epithet
          var rest = text.slice(cursor);
          var m = EPITHET_RE.exec(rest);
          if (m && isEpithet(m[2])) {
            frag.appendChild(document.createTextNode(m[1]));
            frag.appendChild(ital(m[2]));
            cursor += m[0].length;

            // an infraspecific rank keeps its abbreviation roman
            var r = RANK_RE.exec(text.slice(cursor));
            if (r && isEpithet(r[4])) {
              frag.appendChild(document.createTextNode(r[1] + r[2] + r[3]));
              frag.appendChild(ital(r[4]));
              cursor += r[0].length;
            }
          }

          lastIndex = cursor;
          GENUS_RE.lastIndex = cursor;   // never rescan what we just consumed
        }
        if (lastIndex < text.length) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        textNode.parentNode.replaceChild(frag, textNode);
      });

      container.dataset.apGeneraItalicized = '1';
    });
  }

  function run() { italicizeGenera(document.body); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  var mo = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var added = mutations[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        if (added[j].nodeType === 1) italicizeGenera(added[j]);
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // Self-report, same convention as the other blocks.
  window.__apItalics = {
    rerun: function (el) { italicizeGenera(el || document.body); },
    get state() {
      return {
        genera: GENERA.length,
        stopWords: Object.keys(STOP).length,
        spans: document.querySelectorAll('.ap-genus-italic').length
      };
    }
  };
})();

;

(function () {
  // Editor guard - same pattern used by every other DOM-mutating block
  // in this file.
  try {
    if (window.self !== window.top) return;
    if (document.body && document.body.classList.contains('sqs-edit-mode')) return;
    if (document.documentElement.classList.contains('squarespace-damask')) return;
    if (window.Static && window.Static.SQUARESPACE_CONTEXT &&
        window.Static.SQUARESPACE_CONTEXT.authenticatedAccount) return;
  } catch (e) { return; }

  /* WHY THIS EXISTS
     The "auto-italicize Araceae" block above only knows GENUS names -
     it has no species-epithet list, so it can only italicize the first
     word of "Alocasia alba x Alocasia 'Sintang'". That's invisible
     almost everywhere because body prose is typed with the full
     binomial already manually italicized. The one place it shows is
     the hybrid-parentage subtitle heading (an <h4>, first element of
     the first content block on hybrid pages) - that heading is plain
     text with nothing manually italicized, so only "Alocasia" got
     styled and "alba" / the cultivar name stayed upright.

     This block finds that specific heading and re-sets it using the
     same "italic outside quotes, roman inside quotes" convention the
     SEARCH TYPEAHEAD block already documents and uses (see its v7
     notes above) - positional, not a name lookup, so it handles any
     genus/species/cultivar combination without a species dictionary.

     Scope is kept narrow on purpose so this can never mis-fire on an
     ordinary section heading elsewhere in a post: it only acts on an
     H4 that is (a) the first element inside a .sqs-html-content block
     and (b) built entirely out of recognised genus names, lowercase
     epithet-shaped words, and the hybrid "x" - anything else in the
     heading (an ordinary word like "Care" or "Guide") disqualifies it. */

  // Same accepted genera as the sitewide genus-italicizer (kept in
  // sync by hand - add new genera in both places as taxonomy updates).
  var GENERA = [
  "Adelonema","Aglaodorum","Aglaonema","Aia","Alloschemone","Alocasia","Ambrosina",
  "Amorphophallus","Amydrium","Anadendrum","Anaphyllopsis","Anaphyllum","Anchomanes",
  "Anthurium","Anubias","Apoballis","Aridarum","Ariopsis","Arisaema","Arisarum",
  "Arophyton","Arum","Asterostigma","Ayuantha","Bakoa","Bakoaella","Bau","Biarum",
  "Bidayuha","Bognera","Borneoa","Boycea","Bucephalandra","Burttianthus","Caladium",
  "Calla","Callopsis","Carlephyton","Cercestis","Chlorospatha","Colletogyne",
  "Colobogynium","Colocasia","Croatiella","Cryptocoryne","Culcasia","Cyrtosperma",
  "Dieffenbachia","Dracontioides","Dracontium","Dracunculus","Eminium","Englerarum",
  "Epipremnum","Fenestratarum","Filarum","Furtadoa","Galantharum","Gamogyne","Gearum",
  "Gonatopus","Gorgonidium","Gosong","Gymnostachys","Hapaline","Helicodiceros","Hera",
  "Heteroaridarum","Heteropsis","Holochlamys","Homalomena","Hottarum","Ibania",
  "Idimanthus","Incarum","Jasarum","Josefia","Kiewia","Lagenandra","Lasia","Lasimorpha",
  "Lazarum","Lemna","Leucocasia","Lorenzia","Lysichiton","Mangonia","Monstera",
  "Montrichardia","Nabalu","Naiadia","Nephthytis","Ooia","Orontium","Peltandra",
  "Philodendron","Philonotion","Phyllotaenium","Phymatarum","Pichinia","Pinellia",
  "Piptospatha","Pistia","Podolasia","Pothoidium","Pothos","Protarum","Pseudohydrosme",
  "Pursegloveia","Pycnospatha","Remusatia","Rhaphidophora","Rhodospatha","Rhynchopyle",
  "Sarawakia","Sauromatum","Scaphispatha","Schismatoglottis","Schottarum","Schottariella",
  "Scindapsus","Spathantheum","Spathicarpa","Spathiphyllum","Spirodela","Stenospermation",
  "Steudnera","Stylochiton","Symplocarpus","Synandrospadix","Syngonium",
  "Taccarum","Tawaia","Theriophonum","Toga","Tweeddalea","Typhonium","Typhonodorum",
  "Ulearum","Urospatha","Vesta","Vietnamocasia","Vivaria","Wolffia","Wolffiella",
  "Xanthosoma","Zamioculcas","Zantedeschia","Zomicarpa","Zomicarpella"
  ];
  var GENUS_SET = {};
  GENERA.forEach(function (g) { GENUS_SET[g] = true; });

  var QUOTE_RE = /['\u2018\u2019"\u201C\u201D]/;
  var HYBRID_X = /^(x|×)$/;
  var EPITHET_RE = /^[a-z][a-z-]*\.?$/;   // lowercase species-epithet shape

  // True only if, once quoted cultivar text is removed, every remaining
  // word is a recognised genus, an epithet-shaped word, or the hybrid
  // "x" - and at least one genus is present.
  function looksLikeTaxonHeading(text) {
    var stripped = '', inQuote = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (QUOTE_RE.test(ch)) { inQuote = !inQuote; continue; }
      stripped += inQuote ? ' ' : ch;
    }
    var words = stripped.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return false;
    var hasGenus = false;
    for (var w = 0; w < words.length; w++) {
      var word = words[w];
      if (HYBRID_X.test(word)) continue;
      if (GENUS_SET[word]) { hasGenus = true; continue; }
      if (EPITHET_RE.test(word)) continue;
      return false;
    }
    return hasGenus;
  }

  // Rebuilds the heading as a DOM fragment: <em> around each run of
  // genus/species text, plain text around the hybrid "x", and
  // span.ap-upright (the same roman-text class the rest of the site
  // uses) around quoted cultivar names.
  function buildFormatted(text) {
    var frag = document.createDocumentFragment();
    var i = 0;
    while (i < text.length) {
      var ch = text.charAt(i);
      if (QUOTE_RE.test(ch)) {
        var j = i + 1;
        while (j < text.length && !QUOTE_RE.test(text.charAt(j))) j++;
        j = Math.min(j + 1, text.length);
        var rom = document.createElement('span');
        rom.className = 'ap-upright';
        rom.textContent = text.slice(i, j);
        frag.appendChild(rom);
        i = j;
      } else {
        var k = i;
        while (k < text.length && !QUOTE_RE.test(text.charAt(k))) k++;
        var seg = text.slice(i, k);
        var pieces = seg.split(/(\s+(?:x|×)\s+)/);
        pieces.forEach(function (piece) {
          if (!piece) return;
          if (/^\s+(?:x|×)\s+$/.test(piece)) {
            frag.appendChild(document.createTextNode(piece));
          } else {
            var em = document.createElement('em');
            em.textContent = piece;
            frag.appendChild(em);
          }
        });
        i = k;
      }
    }
    return frag;
  }

  function processHeading(h) {
    if (h.dataset.apTaxonHeading === '1') return;
    // Must be the first element of its content block - this is what
    // keeps the check from ever touching an ordinary section heading
    // further down the page.
    if (h.parentElement && h.parentElement.firstElementChild !== h) return;
    if (!h.parentElement || !h.parentElement.classList.contains('sqs-html-content')) return;

    var text = h.textContent;
    if (!text || !text.trim()) return;
    if (!looksLikeTaxonHeading(text)) return;

    h.dataset.apTaxonHeading = '1';
    h.innerHTML = '';
    h.appendChild(buildFormatted(text));
  }

  function scan(root) {
    if (root.nodeType !== 1) return;
    if (root.matches && root.matches('h4') && root.closest('.sqs-html-content')) {
      processHeading(root);
    }
    var headings = root.querySelectorAll ? root.querySelectorAll('.sqs-html-content h4') : [];
    headings.forEach(processHeading);
  }

  function run() { scan(document.body); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  var mo = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var added = mutations[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        scan(added[j]);
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

;

(function () {
  // Bail out entirely inside the Squarespace editor — this script mutates the DOM
  // and would fight the editor's own edit-mode bindings.
  try {
    if (window.self !== window.top) return;                    // loaded in editor iframe
    if (document.body && document.body.classList.contains('sqs-edit-mode')) return;
    if (document.documentElement.classList.contains('squarespace-damask')) return;
    if (window.Static && window.Static.SQUARESPACE_CONTEXT &&
        window.Static.SQUARESPACE_CONTEXT.authenticatedAccount) return;
  } catch (e) { /* cross-origin access can throw — treat as editor and bail */ return; }

  var QUOTE_RE = /(['"\u2018\u201C])([^'"\u2019\u201D]+?)(['"\u2019\u201D])/g;

  function unitalicizeQuotedText(root) {
    var italics = root.querySelectorAll('em, i, [style*="italic"], .ap-genus-italic');
    italics.forEach(function (el) {
      if (el.dataset.apUnitalicized === '1') return;

      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      var textNodes = [];
      var node;
      while ((node = walker.nextNode())) textNodes.push(node);

      textNodes.forEach(function (textNode) {
        var text = textNode.nodeValue;
        if (!QUOTE_RE.test(text)) return;
        QUOTE_RE.lastIndex = 0;

        var frag = document.createDocumentFragment();
        var lastIndex = 0;
        var match;
        while ((match = QUOTE_RE.exec(text)) !== null) {
          if (match.index > lastIndex) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
          }
          var span = document.createElement('span');
          span.className = 'ap-upright';
          span.textContent = match[1] + match[2] + match[3];
          frag.appendChild(span);
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        textNode.parentNode.replaceChild(frag, textNode);
      });

      el.dataset.apUnitalicized = '1';
    });
  }

  function run() { unitalicizeQuotedText(document.body); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  var mo = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var added = mutations[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        if (added[j].nodeType === 1) unitalicizeQuotedText(added[j]);
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

;

(function () {
  const COUNTER_SELECTOR = ".ap-home-counter";
  const COUNTS_URL = "https://wainblatrobert.github.io/Aroidpedia/counts.json";

  // Used only if the fetch fails - reasonable last-known numbers so the
  // hero never shows a bare "0" to a visitor.
  // 7.26.26 v1: refreshed from the live feed (run #31, 23:56Z) and
  // given hybridCultivars, WITHOUT which the fallback path would sum
  // to the un-aggregated 149 while the live path shows 157.
  const FALLBACK = { genera: 2, species: 174, cultivars: 53, hybrids: 149, hybridCultivars: 8 };

  /* 7.26.26 v1: resolve a data-key against the counts object.
     "species"                 -> counts.species
     "hybrids+hybridCultivars" -> counts.hybrids + counts.hybridCultivars
     Missing or non-numeric fields contribute 0, so a key naming a
     field the feed does not carry degrades to the old `|| 0`
     behaviour rather than rendering NaN. */
  function readCount(counts, key) {
    if (!counts || !key) return 0;
    return String(key).split("+").reduce(function (sum, part) {
      var value = counts[part.trim()];
      return sum + (typeof value === "number" && isFinite(value) ? value : 0);
    }, 0);
  }

  function animateCount(el, target, duration) {
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderCounts(root, counts) {
    var nums = root.querySelectorAll(".ap-gc-num");
    nums.forEach(function (n) {
      var key = n.getAttribute("data-key");
      animateCount(n, readCount(counts, key), 900);
    });
  }

  async function run() {
    var root = document.querySelector(COUNTER_SELECTOR);
    if (!root || root.dataset.apInit) return;
    root.dataset.apInit = "1";

    try {
      /*
        Daily cache-buster.
        This lets browsers reuse the same file during the day,
        then check for a fresh GitHub-generated count tomorrow.
      */
      const today = new Date().toISOString().slice(0, 10);
      const response = await fetch(COUNTS_URL + "?v=" + today);
      if (!response.ok) throw new Error("Could not load Aroidpedia counts.");

      const counts = await response.json();
      renderCounts(root, counts);
    } catch (error) {
      console.warn("Aroidpedia counts failed:", error);
      renderCounts(root, FALLBACK);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();

;

(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  const COUNTS_URL = "https://wainblatrobert.github.io/Aroidpedia/counts.json";

  /* 7.26.26 v2: counts.json builder v4 made the four categories
     mutually exclusive — `hybrids` is plain hybrids only now, with
     `hybridCultivars` its own disjoint bucket. data-key="hybrids"
     stays as-is (it is a CSS hook and a jump-link key in the genus
     blocks); only the arithmetic changes. */
  const SUM_KEYS = { hybrids: "hybrids+hybridCultivars" };

  function readCount(source, key) {
    var spec = SUM_KEYS[key] || key;
    return String(spec).split("+").reduce(function (sum, part) {
      var value = Number(source && source[part.trim()]);
      return sum + (isFinite(value) ? value : 0);
    }, 0);
  }

  function animateCount(el, target, duration) {
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderCounts(root, genusData) {
    var nums = root.querySelectorAll(".ap-gc-num");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        nums.forEach(function (n) {
          var key = n.getAttribute("data-key");
          /* 7.26.26 v2: was genusData[key] || 0 — see SUM_KEYS. */
          animateCount(n, readCount(genusData, key), 900);
        });
        io.disconnect();
      });
    }, { threshold: .4 });
    io.observe(root);
  }

  async function init(root) {
    if (root.dataset.apInit) return;
    root.dataset.apInit = "1";

    var genus = root.getAttribute("data-genus");
    if (!genus || !root.querySelector(".ap-gc-num")) return;

    try {
      /*
        Daily cache-buster, matching the homepage counter above -
        browsers reuse the same file during the day, then check for
        a fresh GitHub-generated count tomorrow.
      */
      const today = new Date().toISOString().slice(0, 10);
      const response = await fetch(COUNTS_URL + "?v=" + today);
      if (!response.ok) throw new Error("Could not load Aroidpedia counts.");

      const counts = await response.json();
      const genusData = counts.byGenus && counts.byGenus[genus];
      if (!genusData) return;

      renderCounts(root, genusData);
    } catch (error) {
      console.warn("Aroidpedia genus counts failed:", error);
      // No fallback numbers here (unlike the homepage) since a wrong
      // per-genus count would be actively misleading rather than just
      // generic filler - leaving the static "0" placeholders is safer.
    }
  }

  function scan() {
    document.querySelectorAll(".ap-genus-counter").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }

  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();

;

(function(){
  "use strict";
  /* EDITOR GUARD — same reason as every other observing block */
  if (window.self !== window.top) return;

  function squash(s){ return String(s || "").replace(/\s+/g, " ").trim(); }
  function noop(){}

  var state = null;   /* { bar, place, onScroll, io, heroObs } */

  function teardown(){
    if (!state) return;
    window.removeEventListener("resize", state.place);
    window.removeEventListener("scroll", state.onScroll);
    if (state.io) state.io.disconnect();
    if (state.heroObs) state.heroObs.disconnect();
    if (state.bar && state.bar.parentNode) state.bar.parentNode.removeChild(state.bar);
    state = null;
  }

  function build(){
    teardown();
    if (document.body.classList.contains("view-item")) return;

    /* v2: the genus hero title when there is one, else the first
       visible, non-header h1 with text */
    var isGenus = false;
    var titleEl = document.querySelector(".ap-gh-title");
    if (titleEl){
      isGenus = true;
      if (!squash(titleEl.textContent)){
        /* the hero fills its h1 at runtime — wait for the text,
           then build for real */
        var mo = new MutationObserver(function(){
          if (squash(titleEl.textContent)) build();
        });
        mo.observe(titleEl, { childList: true, characterData: true, subtree: true });
        state = { bar: null, place: noop, onScroll: noop, io: null, heroObs: mo };
        return;
      }
    } else {
      var cands = document.querySelectorAll("h1");
      for (var i = 0; i < cands.length; i++){
        var h = cands[i];
        if (h.closest("#header")) continue;
        var r = h.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;   /* hidden or template h1 */
        if (!squash(h.textContent)) continue;
        titleEl = h;
        break;
      }
      if (!titleEl) return;   /* a page with no title gets no bar */
    }
    var name = squash(titleEl.textContent).toUpperCase().replace(/\.$/, "");
    /* the homepage's visible h1 is the brand itself — a bar reading
       AROIDPEDIA beside the Aroidpedia logo is the same fact twice */
    if (!name || name === "AROIDPEDIA") return;

    /* a stale bar from a journal card survives ajax nav — take it out
       (the card does the same to this one when it builds) */
    var stale = document.querySelector(".apsc-runhead");
    if (stale) stale.remove();

    var bar = document.createElement("div");
    bar.className = "apsc-runhead";
    bar.setAttribute("data-ap-page-runhead", "1");
    if (isGenus) bar.setAttribute("data-ap-genus-runhead", "1");
    var span = document.createElement("span");
    span.textContent = name;
    bar.appendChild(span);
    document.body.appendChild(bar);

    /* geometry — deliberately identical to the card's v21 place() */
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
    /* the genus emphasis can overflow the measured span on long
       names — AMORPHOPHALLUS at 21px/.24em truncates at 1280 — so
       step the size down half-pixels until the word fits, never
       below the 16.5px base. Runs after place() (the room decides),
       on resize and on font load — NOT on scroll, where the room
       never changes and the reflow loop would thrash. */
    function fit(){
      if (!isGenus) return;
      bar.style.fontSize = "";
      var guard = 0;
      while (span.scrollWidth > span.clientWidth && guard++ < 12){
        var cur = parseFloat(getComputedStyle(bar).fontSize);
        if (cur <= 16.5) break;
        bar.style.fontSize = (cur - 0.5) + "px";
      }
    }
    function placeFit(){ place(); fit(); }
    var ticking = false;
    function onScroll(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function(){ ticking = false; place(); });
    }
    placeFit();
    window.addEventListener("resize", placeFit);
    /* the nav's own webfonts shift its left edge as they land */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeFit);
    window.addEventListener("scroll", onScroll, { passive: true });

    var io = null;
    if ("IntersectionObserver" in window){
      io = new IntersectionObserver(function(entries){
        var e = entries[0];
        bar.classList.toggle("apsc-runhead--on",
          !e.isIntersecting && e.boundingClientRect.top < 0);
      }, { threshold: 0 });
      io.observe(titleEl);
    }
    /* state.place is the RESIZE listener — placeFit, not place, or
       teardown would leave the fit handler attached */
    state = { bar: bar, place: placeFit, onScroll: onScroll, io: io, heroObs: null };
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
  window.addEventListener("load", build);
  document.addEventListener("mercury:load", build);
})();

;

(function(){
  "use strict";
  /* EDITOR GUARD — same reason as every other observing block */
  if (window.self !== window.top) return;

  var SHAPES_URL = "https://wainblatrobert.github.io/Aroidpedia/shapes-hd.json";
  var GEO_URL = "https://wainblatrobert.github.io/Aroidpedia/genus-geo.json";
  /* v4: journal availability for the species panel — the published
     post list, never a crawl (house law) */
  var SEARCH_URL = "https://wainblatrobert.github.io/Aroidpedia/search-index.json";
  var VERSION = "apgm-v7-file-v97";
  var NS = "http://www.w3.org/2000/svg";

  function el(t, c, txt){
    var n = document.createElement(t);
    if (c) n.className = c;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function svgEl(t){ return document.createElementNS(NS, t); }
  function squash(s){ return String(s || "").replace(/\s+/g, " ").trim(); }

  /* both feeds, fetched once per page; escape hatches for harnesses */
  var fetched = null;
  function feeds(){
    if (window.APGM_DATA) return Promise.resolve(window.APGM_DATA);
    if (!fetched){
      fetched = Promise.all([
        fetch(SHAPES_URL, {mode:"cors"}).then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); }),
        fetch(GEO_URL, {mode:"cors"}).then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      ]).catch(function(){ return null; });   /* optional, never fatal — the Tableau stays */
    }
    return fetched;
  }

  function bboxInto(d, bb){
    var n = String(d).match(/-?\d+(?:\.\d+)?/g) || [];
    for (var i = 0; i + 1 < n.length; i += 2){
      var x = +n[i], y = +n[i + 1];
      if (x < bb[0]) bb[0] = x; if (x > bb[2]) bb[2] = x;
      if (y < bb[1]) bb[1] = y; if (y > bb[3]) bb[3] = y;
    }
  }

  function render(host, genus, shapes, geo, g){
    var zones = [], missing = [];
    Object.keys(g.places).forEach(function(n){
      if (shapes.shapes[n]) zones.push(n); else missing.push(n);
    });
    /* doubtful-only places draw dashed; a place both native and
       doubtful renders as native */
    var doubt = Object.keys(g.doubtful || {}).filter(function(n){
      return shapes.shapes[n] && !g.places[n];
    });
    if (!zones.length) return;
    /* v6: which zones are journal-tag subunits (genus-geo 1.4.0) */
    var SUB = geo.subunits || {};

    var bb = [1e9, 1e9, -1e9, -1e9];
    zones.concat(doubt).forEach(function(n){ bboxInto(shapes.shapes[n], bb); });
    var padX = (bb[2] - bb[0]) * 0.04, padY = (bb[3] - bb[1]) * 0.07;

    var wrap = el("div", "apgm");
    wrap.setAttribute("data-apgm-version", VERSION);
    var head = el("div", "apgm__head");
    var label = el("div", "apgm__label", "NATIVE RANGE · SPECIES PER REGION");
    var views = el("div", "apgm__views");
    head.appendChild(label); head.appendChild(views);
    wrap.appendChild(head);

    var box = el("div", "apgm__box");
    var svg = svgEl("svg");
    /* v3: the viewBox is live state now — HOME is the fitted frame,
       CUR is wherever zoom/pan has taken it */
    var HOME = [bb[0] - padX, bb[1] - padY,
                (bb[2] - bb[0]) + padX * 2, (bb[3] - bb[1]) + padY * 2];
    var CUR = HOME.slice();
    function setVB(){
      /* view centre clamped inside the home extent, so a pan can
         never strand the range off-screen */
      var cx = CUR[0] + CUR[2] / 2, cy = CUR[1] + CUR[3] / 2;
      cx = Math.max(HOME[0], Math.min(HOME[0] + HOME[2], cx));
      cy = Math.max(HOME[1], Math.min(HOME[1] + HOME[3], cy));
      CUR[0] = cx - CUR[2] / 2; CUR[1] = cy - CUR[3] / 2;
      svg.setAttribute("viewBox", CUR.map(function(v){ return +v.toFixed(3); }).join(" "));
      svg.style.touchAction = CUR[2] < HOME[2] * 0.999 ? "none" : "pan-y";
    }
    setVB();
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", genus + " native range, species per region");
    box.appendChild(svg);
    var hover = el("div", "apgm__hover");
    box.appendChild(hover);

    /* ---- v3: ZOOM + PAN (user request: like the journal map) ---- */
    function userPoint(clientX, clientY){
      var ctm = svg.getScreenCTM();
      if (!ctm) return null;
      var pt = svg.createSVGPoint();
      pt.x = clientX; pt.y = clientY;
      return pt.matrixTransform(ctm.inverse());
    }
    function zoomAt(fx, fy, factor){
      var w = CUR[2] / factor;
      w = Math.max(HOME[2] / 18, Math.min(HOME[2] * 1.2, w));
      var s = w / CUR[2];
      if (Math.abs(s - 1) < 1e-6) return;
      CUR[0] = fx - (fx - CUR[0]) * s;
      CUR[1] = fy - (fy - CUR[1]) * s;
      CUR[2] = CUR[2] * s;
      CUR[3] = CUR[3] * s;
      setVB();
    }
    /* ctrl+wheel (a trackpad pinch arrives as the same event) zooms
       on the cursor. Plain wheel scrolls the page as always — that is
       why the listener is non-passive but only ever preventDefaults
       with ctrl held. */
    box.addEventListener("wheel", function(ev){
      if (!ev.ctrlKey) return;
      ev.preventDefault();
      var d = ev.deltaY * (ev.deltaMode === 1 ? 16 : 1);
      var p = userPoint(ev.clientX, ev.clientY);
      if (!p) return;
      zoomAt(p.x, p.y, Math.exp(-d * 0.0016));
    }, { passive: false });
    /* drag pans. Touch keeps scrolling the page until the map is
       actually zoomed (touch-action flips in setVB), and a touch drag
       at home zoom is left alone here too. */
    var pan = null;
    var dragged = false;   /* v4: a real drag must not read as a click */
    svg.addEventListener("pointerdown", function(ev){
      if (ev.button !== 0) return;
      if (ev.pointerType !== "mouse" && !(CUR[2] < HOME[2] * 0.999)) return;
      pan = { x: ev.clientX, y: ev.clientY, vx: CUR[0], vy: CUR[1],
              a: (svg.getScreenCTM() || { a: 1 }).a, captured: false };
      svg.classList.add("apgm--panning");
      /* v4: capture is taken on the FIRST REAL MOVE, not here — a
         captured pointer retargets the derived click to the svg, so
         capturing on pointerdown made every clean click lose its
         data-zone and the species panel never opened. */
    });
    svg.addEventListener("pointermove", function(ev){
      if (!pan) return;
      if (Math.abs(ev.clientX - pan.x) + Math.abs(ev.clientY - pan.y) > 4){
        dragged = true;
        if (!pan.captured && svg.setPointerCapture){
          try { svg.setPointerCapture(ev.pointerId); pan.captured = true; } catch (e) {}
        }
      }
      CUR[0] = pan.vx - (ev.clientX - pan.x) / pan.a;
      CUR[1] = pan.vy - (ev.clientY - pan.y) / pan.a;
      setVB();
    });
    function endPan(ev){
      if (!pan) return;
      pan = null;
      svg.classList.remove("apgm--panning");
      if (svg.releasePointerCapture && ev.pointerId != null){
        try { svg.releasePointerCapture(ev.pointerId); } catch (e) {}
      }
    }
    svg.addEventListener("pointerup", endPan);
    svg.addEventListener("pointercancel", endPan);
    var zoomUI = el("div", "apgm__zoom");
    [["+", "Zoom in", function(){ zoomAt(CUR[0] + CUR[2] / 2, CUR[1] + CUR[3] / 2, 1.4); }],
     ["−", "Zoom out", function(){ zoomAt(CUR[0] + CUR[2] / 2, CUR[1] + CUR[3] / 2, 1 / 1.4); }],
     ["FIT", "Fit the range", function(){ CUR = HOME.slice(); setVB(); }]
    ].forEach(function(z){
      var b = el("button", null, z[0]);
      b.type = "button";
      b.setAttribute("aria-label", z[1]);
      b.addEventListener("click", z[2]);
      zoomUI.appendChild(b);
    });
    box.appendChild(zoomUI);

    /* ---- v5: THE SPECIES SEARCH (user request 8.15.26) ----
       Focus or type = the genus's species list (speciesPlaces keys);
       choosing one highlights exactly its native zones via
       svg.apgm--sel + per-path .is-sel — CSS-only, so the selection
       survives apply()'s inline choropleth fills and view switches.
       The × (and Escape) clears, so nobody is stuck with their
       first search. Desktop only, same gate as the species panel. */
    var selEp = null;
    var selInfo = null;
    var searchUI = null;
    var allEps = Object.keys(g.speciesPlaces || {}).sort();
    function selReadout(){
      if (!selEp || !selInfo) return;
      hover.setAttribute("data-on", "1");
      hover.innerHTML = "";
      var em = document.createElement("em");
      em.textContent = genus + " " + selEp;   /* never contract a genus */
      hover.appendChild(em);
      hover.appendChild(document.createTextNode(" · present in " + selInfo.nat +
        (selInfo.nat === 1 ? " region" : " regions") +
        (selInfo.dbt ? " (+" + selInfo.dbt + " doubtful)" : "") +
        (selInfo.un ? " (+" + selInfo.un + " unmapped)" : "")));
    }
    function clearSel(){
      selEp = null;
      selInfo = null;
      svg.classList.remove("apgm--sel");
      order.forEach(function(z){
        paths[z].classList.remove("is-sel");
        paths[z].classList.remove("is-dsel");
      });
      Object.keys(dpaths).forEach(function(z){ dpaths[z].classList.remove("is-sel"); });
      if (searchUI){
        searchUI.input.value = "";
        searchUI.root.removeAttribute("data-active");
        searchUI.list.removeAttribute("data-open");
      }
      hover.removeAttribute("data-on");
    }
    function selectEp(ep){
      selEp = ep;
      closePanel();                 /* one focus at a time */
      /* v7: TRUE COVERAGE (user ruling) — the species' native zones
         plus its doubtful zones, with any L3 parent SUPPRESSED when
         this species has subunit info under it (native or doubtful):
         sarawakensis lights Sarawak + Sabah + Kalimantan, never all
         of Borneo. A species with no subunit info keeps its L3. */
      var natZ = (g.speciesPlaces[ep] || []);
      var ds = g.doubtfulSpecies || {};
      var dbtZ = [];
      Object.keys(ds).forEach(function(z){
        if ((ds[z] || []).indexOf(ep) >= 0) dbtZ.push(z);
      });
      var have = {}, natSet = {}, suppress = {};
      natZ.concat(dbtZ).forEach(function(z){ have[z] = 1; });
      natZ.forEach(function(z){ natSet[z] = 1; });
      natZ.concat(dbtZ).forEach(function(z){
        if (SUB[z] && have[SUB[z]]) suppress[SUB[z]] = 1;
      });
      svg.classList.add("apgm--sel");
      var nNat = 0, nDbt = 0, nUn = 0;
      order.forEach(function(z){
        var on = !!(natSet[z] && !suppress[z]);
        paths[z].classList.toggle("is-sel", on);
        paths[z].classList.remove("is-dsel");
        if (on) nNat++;
      });
      natZ.forEach(function(z){ if (!paths[z] && !suppress[z]) nUn++; });
      Object.keys(dpaths).forEach(function(z){ dpaths[z].classList.remove("is-sel"); });
      dbtZ.forEach(function(z){
        if (suppress[z] || natSet[z]) return;
        if (dpaths[z]){ dpaths[z].classList.add("is-sel"); nDbt++; }
        else if (paths[z]){ paths[z].classList.add("is-dsel"); nDbt++; }
      });
      selInfo = { nat: nNat, dbt: nDbt, un: nUn };
      if (searchUI){
        searchUI.input.value = genus + " " + ep;
        searchUI.root.setAttribute("data-active", "1");
        searchUI.list.removeAttribute("data-open");
      }
      selReadout();
    }
    if (allEps.length){
      var sroot = el("div", "apgm__search");
      var sbox = el("div", "apgm__search-box");
      var sinput = document.createElement("input");
      sinput.type = "text";
      sinput.setAttribute("placeholder", "Find a species…");
      sinput.setAttribute("aria-label", "Find a species of " + genus);
      sinput.setAttribute("autocomplete", "off");
      sinput.setAttribute("spellcheck", "false");
      sbox.appendChild(sinput);
      var sx = el("button", "apgm__search-x", "×");
      sx.type = "button";
      sx.setAttribute("aria-label", "Clear the species search");
      sx.addEventListener("click", function(){ clearSel(); sinput.focus(); });
      sbox.appendChild(sx);
      sroot.appendChild(sbox);
      var slist = el("ul", "apgm__search-list");
      sroot.appendChild(slist);
      box.appendChild(sroot);
      searchUI = { root: sroot, input: sinput, list: slist };
      var renderList = function(){
        var q = squash(sinput.value).toLowerCase();
        /* a chosen name fills the input; unedited, it lists everything
           again rather than only itself */
        if (selEp && q === (genus + " " + selEp).toLowerCase()) q = "";
        var eps = allEps.filter(function(ep){
          return !q || (genus + " " + ep).toLowerCase().indexOf(q) >= 0;
        });
        slist.innerHTML = "";
        if (!eps.length){
          var liE = document.createElement("li");
          liE.appendChild(el("div", "apgm__search-empty", "no species matches"));
          slist.appendChild(liE);
        }
        eps.forEach(function(ep){
          var li = document.createElement("li");
          var b = document.createElement("button");
          b.type = "button";
          var it = document.createElement("i");
          it.textContent = genus + " " + ep;
          b.appendChild(it);
          b.addEventListener("click", function(){ selectEp(ep); });
          li.appendChild(b);
          slist.appendChild(li);
        });
        slist.setAttribute("data-open", "1");
      };
      sinput.addEventListener("focus", renderList);
      sinput.addEventListener("input", function(){
        if (sinput.value || selEp) sroot.setAttribute("data-active", "1");
        else sroot.removeAttribute("data-active");
        renderList();
      });
      sinput.addEventListener("keydown", function(ev){
        if (ev.key === "Escape"){
          if (slist.getAttribute("data-open")) slist.removeAttribute("data-open");
          else clearSel();
          sinput.blur();
        } else if (ev.key === "Enter"){
          ev.preventDefault();
          var first = slist.querySelector("button");
          if (first) first.click();
        }
      });
      /* clicking anywhere off the search closes the dropdown; the
         listener no-ops once this render is gone (ajax nav) */
      document.addEventListener("pointerdown", function(ev){
        if (!sroot.isConnected) return;
        if (!sroot.contains(ev.target)) slist.removeAttribute("data-open");
      });
    }

    wrap.appendChild(box);
    var legend = el("div", "apgm__legend");
    wrap.appendChild(legend);
    wrap.appendChild(el("div", "apgm__note",
      g.speciesTotal + " accepted species · native range only, per POWO/WCVP · " +
      "hover a region for its species count"));

    var borders = svgEl("path");
    borders.setAttribute("class", "apgm-borders");
    borders.setAttribute("d", shapes.borders || "");
    svg.appendChild(borders);

    /* largest-first so contained zones (India > Assam) stay hoverable */
    var order = (shapes.order || []).filter(function(n){ return zones.indexOf(n) >= 0; });
    zones.forEach(function(n){ if (order.indexOf(n) < 0) order.push(n); });
    var paths = {};
    order.forEach(function(n){
      var p = svgEl("path");
      p.setAttribute("class", "apgm-zone");
      if (SUB[n]) p.classList.add("apgm-sub");
      p.setAttribute("d", shapes.shapes[n]);
      p.setAttribute("data-zone", n);
      svg.appendChild(p);
      paths[n] = p;
    });
    var dpaths = {};
    doubt.forEach(function(n){
      var p = svgEl("path");
      p.setAttribute("class", "apgm-doubt");
      if (SUB[n]) p.classList.add("apgm-sub");   /* v7: Subzones-view only */
      p.setAttribute("d", shapes.shapes[n]);
      p.setAttribute("data-zone", n);
      svg.appendChild(p);
      dpaths[n] = p;
    });
    /* v7: which L3 parents have subunit data in THIS genus */
    var PARENTS = {};
    zones.concat(doubt).forEach(function(z){
      if (SUB[z] && paths[SUB[z]]) PARENTS[SUB[z]] = 1;
    });

    /* ---- the zoom hierarchy: zone -> {name, count} per view ---- */
    function groupsFor(view){
      var m = {};
      if (view === "range"){
        zones.forEach(function(z){ m[z] = { name: genus, count: g.speciesTotal, merged: 1 }; });
        return m;
      }
      if (view === "continents" || view === "regions"){
        var src = (view === "continents" ? g.continents : g.regions) || {};
        Object.keys(src).forEach(function(nm){
          (src[nm].members || []).forEach(function(z){
            if (paths[z]) m[z] = { name: nm, count: src[nm].count, merged: 1 };
          });
        });
      }
      zones.forEach(function(z){ if (!m[z]) m[z] = { name: z, count: g.places[z] }; });
      return m;
    }

    function ramp(count, max){
      if (max <= 1) return 0.78;
      return 0.16 + 0.68 * (Math.log(1 + count) / Math.log(1 + max));
    }

    var groupMap = {};
    var currentView = "zones";

    /* ---- v4: THE SPECIES PANEL ----
       zone -> species built once by inverting speciesPlaces (names
       are stored once per species in the feed). */
    var zoneEps = null;
    function zoneSpecies(){
      if (zoneEps) return zoneEps;
      zoneEps = {};
      var sp = g.speciesPlaces || {};
      Object.keys(sp).forEach(function(ep){
        (sp[ep] || []).forEach(function(z){
          (zoneEps[z] = zoneEps[z] || []).push(ep);
        });
      });
      return zoneEps;
    }
    var journalSet = null, journalReq = null;
    function journalSlugs(){
      if (journalReq) return journalReq;
      journalReq = fetch(SEARCH_URL, {mode:"cors"})
        .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function(j){
          journalSet = {};
          ((j && j.entries) || []).forEach(function(e){ if (e.u) journalSet[e.u] = 1; });
          return journalSet;
        })
        .catch(function(){ journalSet = {}; return journalSet; });
      return journalReq;
    }
    var panel = null;
    function closePanel(){
      if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
      panel = null;
    }
    function openPanel(zone, doubtful){
      if (currentView === "range") return;      /* the range is one block */
      if (window.innerWidth <= 820) return;     /* desktop feature */
      var title, eps;
      if (doubtful){
        title = zone;
        eps = (g.doubtfulSpecies && g.doubtfulSpecies[zone] || []).slice();
      } else {
        var gr = groupMap[zone];
        if (!gr) return;
        title = gr.name;
        /* the clicked zone's whole CURRENT GROUP — the zone itself in
           Zones/Countries, the region in Regions, the continent in
           Continents */
        var seen = {};
        var inv = zoneSpecies();
        order.forEach(function(z){
          if (groupMap[z] && groupMap[z].name === gr.name){
            (inv[z] || []).forEach(function(ep){ seen[ep] = 1; });
          }
        });
        eps = Object.keys(seen);
      }
      eps.sort();
      if (!eps.length) return;
      closePanel();
      panel = el("div", "apgm__panel");
      var head = el("div", "apgm__panel-head");
      var ttl = el("div", "apgm__panel-title");
      var em = document.createElement("em");
      em.textContent = title;
      ttl.appendChild(em);
      ttl.appendChild(el("span", "apgm__panel-n",
        eps.length + (eps.length === 1 ? " species" : " species") +
        (doubtful ? " · doubtfully present" : "")));
      head.appendChild(ttl);
      var x = el("button", "apgm__panel-x", "×");
      x.type = "button";
      x.setAttribute("aria-label", "Close the species list");
      x.addEventListener("click", closePanel);
      head.appendChild(x);
      panel.appendChild(head);
      var ul = el("ul", "apgm__panel-list");
      panel.appendChild(ul);
      box.appendChild(panel);
      var myPanel = panel;
      journalSlugs().then(function(set){
        if (panel !== myPanel || !ul.isConnected) return;
        var linked = 0;
        eps.forEach(function(ep){
          var li = document.createElement("li");
          var it = document.createElement("i");
          it.textContent = genus + " " + ep;   /* never contract a genus */
          var slug = "/journal/" + (genus + "-" + ep).toLowerCase()
            .replace(/\s+/g, "-");
          if (set[slug]){
            var a = document.createElement("a");
            a.href = slug;
            a.appendChild(it);
            li.appendChild(a);
            linked++;
          } else {
            li.className = "apgm__panel-off";
            li.appendChild(it);
          }
          ul.appendChild(li);
        });
        if (linked){
          myPanel.appendChild(el("div", "apgm__panel-note",
            linked + " with a journal entry — underlined"));
        }
      });
    }

    function setHot(zone){
      var gr = zone && groupMap[zone];
      order.forEach(function(z){
        paths[z].classList.toggle("is-hot",
          !!(gr && groupMap[z] && groupMap[z].name === gr.name));
      });
      /* v5: with a species selected, empty ground restores the
         selection readout instead of clearing */
      if (!gr){
        if (selEp) selReadout(); else hover.removeAttribute("data-on");
        return;
      }
      hover.setAttribute("data-on", "1");
      hover.innerHTML = "";
      var em = document.createElement("em");
      em.textContent = gr.name;
      hover.appendChild(em);
      /* v6: a subunit's readout carries its L3 parent for context */
      var tail = " · " + gr.count +
        (gr.count === 1 ? " species" : " species recorded");
      if (!gr.merged && SUB[zone] && groupMap[SUB[zone]]){
        tail = " · " + gr.count + " of " + SUB[zone] + "'s " +
          groupMap[SUB[zone]].count + " species recorded here";
      }
      hover.appendChild(document.createTextNode(tail));
    }
    function setDoubt(zone){
      order.forEach(function(z){ paths[z].classList.remove("is-hot"); });
      hover.setAttribute("data-on", "1");
      hover.innerHTML = "";
      var em = document.createElement("em");
      em.textContent = zone;
      hover.appendChild(em);
      hover.appendChild(document.createTextNode(" · " +
        (g.doubtful[zone] || 1) + " species doubtfully present"));
    }

    function apply(view){
      currentView = view;
      closePanel();     /* the group semantics just changed under it */
      var subView = view === "subzones";
      svg.classList.toggle("apgm--vsub", subView);
      groupMap = groupsFor(view === "countries" || subView ? "zones" : view);
      var max = 1;
      Object.keys(groupMap).forEach(function(z){
        /* v7: in Subzones the parents dim to an underlay, so they sit
           outside the ramp — otherwise Borneo's 27 would flatten the
           subunit differences the view exists to show */
        if (subView && PARENTS[z]) return;
        if (groupMap[z].count > max) max = groupMap[z].count;
      });
      order.forEach(function(z){
        var gr = groupMap[z];
        var fo;
        if (view === "range")   fo = SUB[z] ? 0 : 0.8;
        else if (subView)       fo = PARENTS[z] ? 0.07 : ramp(gr.count, max);
        else                    fo = SUB[z] ? 0 : ramp(gr.count, max);
        paths[z].style.fillOpacity = fo;
        paths[z].classList.toggle("apgm-zone--merged", !!gr.merged);
      });
      svg.classList.toggle("apgm--borders-on", view === "countries");
      legend.innerHTML = "";
      if (view === "range"){
        legend.appendChild(el("span", "apgm__legend-t",
          "the whole native range · " + g.speciesTotal + " species"));
      } else {
        legend.appendChild(el("span", "apgm__legend-n", "1"));
        legend.appendChild(el("span", "apgm__legend-bar"));
        legend.appendChild(el("span", "apgm__legend-n", String(max)));
        legend.appendChild(el("span", "apgm__legend-t", "species per " +
          (view === "continents" ? "continent" :
           view === "regions" ? "region" :
           subView ? "subzone" : "zone")));
      }
      [].slice.call(views.children).forEach(function(b){
        b.setAttribute("aria-pressed",
          b.getAttribute("data-view") === view ? "true" : "false");
      });
      setHot(null);
    }

    [["range", "Range"], ["continents", "Continents"], ["regions", "Regions"],
     ["countries", "Countries"], ["zones", "Zones"],
     ["subzones", "Subzones"]].forEach(function(v){
      /* v7: a genus with no subunit data gets no Subzones pill —
         the view would be Zones twice */
      if (v[0] === "subzones" && !Object.keys(PARENTS).length) return;
      var b = el("button", "apgm__view", v[1]);
      b.type = "button";
      b.setAttribute("data-view", v[0]);
      b.addEventListener("click", function(){ apply(v[0]); });
      views.appendChild(b);
    });

    svg.addEventListener("mouseover", function(ev){
      var t = ev.target;
      if (!t || !t.getAttribute) return;
      var z = t.getAttribute("data-zone");
      /* v4.1 (user report): entering EMPTY GROUND — the svg itself,
         the borders being pointer-events:none — must CLEAR the hover,
         not keep the last zone lit. Before this, the readout only
         reset on leaving the whole map. */
      if (!z){ setHot(null); return; }
      if (paths[z]) setHot(z); else setDoubt(z);
    });
    svg.addEventListener("mouseleave", function(){ setHot(null); });
    /* v4: click opens the species panel (never after a drag) */
    svg.addEventListener("click", function(ev){
      if (dragged){ dragged = false; return; }
      var t = ev.target;
      if (!t || !t.getAttribute) return;
      var z = t.getAttribute("data-zone");
      if (!z) return;
      openPanel(z, !paths[z]);
    });

    apply("zones");   /* the default: the actual zones (user ruling) */

    if (host.hasAttribute("data-ap-genus-map")){
      /* explicit mount: render inside it; a Tableau elsewhere on the
         page is retired too */
      host.appendChild(wrap);
      var tab2 = document.querySelector(
        '.tableauPlaceholder, iframe[src*="tableau"], object.tableauViz');
      if (tab2){
        var tb = tab2.closest(".sqs-block") || tab2.parentNode;
        if (tb && !tb.contains(host)) tb.style.display = "none";
      }
    } else {
      host.style.display = "none";
      host.parentNode.insertBefore(wrap, host);
    }

    /* v4: THE NAV PIT STOP (user request 8.14.26): genus pages run
       their own rail (GENUS SECTION NAV, a per-page block — NOT the
       guide pages' apnav). Its "explorer" chapter is the old Tableau
       section, already sitting between THE GENUS and FORM & CARE, and
       an explicit data-ap-genus-chapter beats its detectors — so the
       map claims that chapter, and the hidden Tableau loses its
       detector classes (original className kept in data-apgm-was) so
       a stale hidden section can never hold the tick. GENUS SECTION
       NAV v7 relabels the tick "Range"; pages still on v6 read
       "Explorer". refresh() covers the map rendering after the rail
       built. */
    wrap.setAttribute("data-ap-genus-chapter", "explorer");
    [].slice.call(document.querySelectorAll(".tableauPlaceholder, .tableauViz"))
      .forEach(function(t){
        if (t.closest(".apgm")) return;
        t.setAttribute("data-apgm-was", t.className);
        t.classList.remove("tableauPlaceholder");
        t.classList.remove("tableauViz");
      });
    if (window.apGenusNav){
      /* rebuild, not refresh — the rail must re-DETECT chapters to
         see the map's claim, not just restyle the ones it has */
      try { (window.apGenusNav.rebuild || window.apGenusNav.refresh)(); } catch (e) {}
    }

    if (window.console && console.info){
      console.info("[genus map] " + VERSION + " · " + genus + " · " +
        zones.length + " zones" +
        (missing.length ? " (" + missing.length + " unmapped: " + missing.join(", ") + ")" : "") +
        " · genus-geo v" + (geo.version || "?"));
    }
  }

  function build(){
    var hero = document.querySelector(".ap-gh-title");
    if (!hero) return;
    /* v2: an explicit mount wins — a code block containing
       <div data-ap-genus-map></div> anywhere on the page. Without
       one, the Tableau embed's block is the mount (replaced in
       place), which is also why a page with neither gets nothing. */
    var marker = document.querySelector("[data-ap-genus-map]");
    var tab = document.querySelector(
      '.tableauPlaceholder, iframe[src*="tableau"], object.tableauViz');
    var host = marker || (tab ? (tab.closest(".sqs-block") || tab.parentNode) : null);
    if (!host || host.getAttribute("data-apgm-done")) return;

    var heroRoot = hero.closest("[data-genus]");
    var genus = heroRoot ? squash(heroRoot.getAttribute("data-genus")) : "";
    if (!genus || genus.toLowerCase() === "auto"){
      genus = squash(hero.textContent).split(" ")[0] || "";
    }
    if (!genus) return;              /* hero not painted yet — a later event retries */
    genus = genus.charAt(0).toUpperCase() + genus.slice(1).toLowerCase();
    host.setAttribute("data-apgm-done", "1");

    feeds().then(function(res){
      if (!res || !host.isConnected) return;
      var shapes = res[0], geo = res[1];
      if (!shapes || !geo) return;
      var g = geo.genera && geo.genera[genus];
      if (!g || !g.places || !Object.keys(g.places).length){
        if (window.console && console.info){
          console.info("[genus map] no genus-geo entry for " + genus + " — Tableau stays.");
        }
        return;
      }
      try { render(host, genus, shapes, geo, g); }
      catch (err){
        host.style.display = "";     /* never leave the page mapless */
        if (window.console) console.error("[genus map]", err);
      }
    });
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
  window.addEventListener("load", build);
  document.addEventListener("mercury:load", build);
  /* the hero resolves data-genus at runtime; one late retry covers a
     slow paint without a standing observer */
  setTimeout(build, 2500);
})();

;

(function(){
  "use strict";

  var RM = window.matchMedia &&
           window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var RAIL_MIN_WIDTH = 820;
  /* When the rail appears, measured from the hero's bottom edge and
     expressed as a FRACTION OF THE VIEWPORT — not pixels.

     The hero is 100svh, so a fixed pixel offset means something
     different on every screen: -225px is a quarter of the hero on a
     900px laptop and a seventh of it on a 1600px monitor. As a
     fraction the reveal lands at the same point in the composition
     everywhere.

        0     the moment the hero has fully cleared
     -0.25    a quarter-screen early  <- current
     -0.5     half-screen early (this is where v2 fired, and it read
              as too soon — the hero still filled the top half)
     +0.1     a beat after the hero clears

     Recomputed on every frame from the live viewport height, so it
     stays correct through a window resize or a phone rotating. */
  var REVEAL_OFFSET_VH = -0.25;
  /* Relative luminance above which a section counts as a light ground. */
  var LIGHT_LUMA = 0.55;
  /* Floor for the dark layer's mask box — see note (1). */
  var MASK_MIN_W = 240;

  /* Last-resort handedness if the header injection's AP.GENERA has no
     row for this genus AND the page has no hero to read it from.
     "right" = the Alocasia composition. */
  var LOCAL_HAND = "right";

  var LABELS = {
    overview:   "Overview",
    genus:      "The genus",
    explorer:   "Range",       /* v7: the map's chapter — see header */
    form:       "Form & care",
    timeline:   "Timeline",
    species:    "Species",
    hybrids:    "Hybrids",
    references: "References"
  };

  /* Detectors IN PRIORITY ORDER — first match claims the section. The
     timeline must be matched by its .ax-index wrapper BEFORE the bare
     Tableau test, because this page has TWO Tableau embeds. */
  var DETECTORS = [
    ["overview",   function(s){ return s.querySelector(".ap-genus-hero, .ap-genus-counter"); }],
    ["genus",      function(s){ return s.querySelector(".apx-intro"); }],
    ["form",       function(s){ return s.querySelector(".apx-tabs"); }],
    ["references", function(s){ return s.querySelector("#apx-biblio"); }],
    ["timeline",   function(s){ return s.querySelector(".ax-index.ax-static, .ax-index.ax-on-cream"); }],
    ["species",    function(s){ return s.querySelector('.ax-index[data-mode="species"]'); }],
    ["hybrids",    function(s){ return s.querySelector('.ax-index[data-mode="hybrids"]'); }],
    ["species",    function(s){
        var i = s.querySelector(".ax-index");
        return i && /species|cultivar/i.test(i.textContent.slice(0,400)) &&
               !/hybrid/i.test((i.querySelector(".ax-heading")||{}).textContent||"");
      }],
    ["hybrids",    function(s){
        var i = s.querySelector(".ax-index");
        return i && /hybrid/i.test((i.querySelector(".ax-heading")||{}).textContent||"");
      }],
    ["explorer",   function(s){ return s.querySelector(".tableauPlaceholder, .tableauViz"); }]
  ];

  /* FOOTER BUILD (nav v8): the rail and cue are CREATED here, not
     shipped as page markup - this injection renders on EVERY page and
     only genus pages should grow them. Deliberately NO id="gnRail"/
     "gnCue": a stale per-page copy's getElementById must never grab
     these (the apnav v14 lesson, applied verbatim). data-gn marks the
     sitewide copies for the migration sweep in build(). */
  console.info("[gn-rail] genus section nav v8 (sitewide, footer FILE v61)");
  var rail = document.createElement("nav");
  rail.className = "gn-rail";
  rail.setAttribute("aria-label", "Page sections");
  rail.setAttribute("data-gn", "footer");
  rail.innerHTML =
    '<div class="gn-rail__layer gn-rail__layer--light" data-gn-layer="light">' +
      '<i class="gn-rail__line" aria-hidden="true"></i>' +
      '<i class="gn-rail__fill" aria-hidden="true"></i></div>' +
    '<div class="gn-rail__layer gn-rail__layer--dark" data-gn-layer="dark" aria-hidden="true">' +
      '<i class="gn-rail__line"></i><i class="gn-rail__fill"></i></div>';
  var cue = document.createElement("div");
  cue.className = "gn-cue";
  cue.setAttribute("data-hand", "right");
  cue.setAttribute("aria-hidden", "true");
  cue.setAttribute("data-gn", "footer");
  cue.innerHTML = '<div class="gn-cue__in"><span>Scroll to descend</span>' +
                  '<i class="gn-cue__line"></i></div>';
  var layers = {
    light: rail.querySelector('[data-gn-layer="light"]'),
    dark:  rail.querySelector('[data-gn-layer="dark"]')
  };
  var chapters = [];
  var lightSections = [];
  var heroBottom = 0;      /* document Y of the hero's bottom edge */
  var revealAt = 0;        /* derived per frame — see update() */
  var portalled = false;

  /* A fixed element's z-index is resolved INSIDE the nearest ancestor
     stacking context. On the live page the rail sat inside
     .fe-block(z:3) > .content-wrapper(z:5), while later sections carry
     z-index 3-7 — so they painted over it and no z-index here could
     win. Moving to <body> is the fix. */
  function portal(){
    if (portalled || !document.body) return;
    document.body.appendChild(rail);
    document.body.appendChild(cue);
    portalled = true;
  }

  function docTop(el){
    var t = 0;
    while (el) { t += el.offsetTop; el = el.offsetParent; }
    return t;
  }

  /* ---- HANDEDNESS -------------------------------------------------
     Which side the video subject sits on, so the cue can sit with the
     footage instead of on top of the title stack. Five sources, first
     hit wins — see the header. Step 3 (reading the hero's own
     attribute) is what makes this correct before the roster is
     edited. */
  function resolveHand(){
    var ok = function(v){ return v === "left" || v === "right" ? v : null; };

    /* 1. per-page override on this block */
    var v = ok((cue.getAttribute("data-gn-hand") || "").toLowerCase());
    if (v) return v;

    /* 2. the central roster in the header injection */
    var slug = location.pathname.replace(/\/+$/, "").split("/").pop().toLowerCase();
    try {
      var row = window.AP && window.AP.GENERA && window.AP.GENERA[slug];
      v = ok(row && String(row.hand || "").toLowerCase());
      if (v) return v;
    } catch (e) {}

    /* 3. the hero on this very page already states it */
    var hero = document.querySelector("[data-video-focus]");
    if (hero) {
      v = ok((hero.getAttribute("data-video-focus") || "").toLowerCase());
      if (v) return v;
    }

    /* 4 & 5 */
    return ok(LOCAL_HAND) || "right";
  }

  function applyHand(){
    if (!cue) return;
    cue.setAttribute("data-hand", resolveHand());
  }

  function luma(color){
    var m = String(color).match(/[\d.]+/g);
    if (!m || m.length < 3) return 0;
    if (m.length > 3 && parseFloat(m[3]) < 0.5) return 0;
    var f = function(v){ v = v/255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); };
    return .2126*f(+m[0]) + .7152*f(+m[1]) + .0722*f(+m[2]);
  }

  /* Measured, not listed, so a future cream section needs no edit.
     Sections carrying media are excluded: their computed background
     colour is whatever sits behind the image and says nothing about
     what the eye sees. */
  function findLightSections(){
    return [].slice.call(document.querySelectorAll("#page section.page-section"))
      .filter(function(s){
        if (s.querySelector(".section-background img, .section-background video")) return false;
        var bgEl = s.querySelector(".section-background") || s;
        return luma(getComputedStyle(bgEl).backgroundColor) > LIGHT_LUMA;
      });
  }

  function detect(){
    var secs = [].slice.call(document.querySelectorAll("#page section.page-section"));
    var out = [], used = {};
    secs.forEach(function(s){
      /* FOOTER (v8): a section can hold TWO chapters. The live layout
         puts the intro prose AND the range map in ONE page-section;
         under the old explicit-attr-wins rule the map's
         data-ap-genus-chapter="explorer" hijacked the whole section
         and evicted "The genus" (measured live 8.14.26). Now the
         DETECTOR key claims the SECTION (scroll target = section
         top) and an explicit-attr node ADDITIONALLY claims its own
         chapter anchored to the NODE, when the keys differ. A
         section where only the attr matches keeps the old behaviour. */
      var key = null;
      for (var i = 0; i < DETECTORS.length; i++) {
        try { if (DETECTORS[i][1](s)) { key = DETECTORS[i][0]; break; } }
        catch (e) {}
      }
      var ex = s.querySelector("[data-ap-genus-chapter]");
      var exKey = ex ? ex.getAttribute("data-ap-genus-chapter") : null;
      if (key && LABELS[key] && !used[key]) {
        used[key] = 1;
        out.push({ key: key, el: s });
      }
      if (exKey && LABELS[exKey] && !used[exKey] && exKey !== key) {
        used[exKey] = 1;
        out.push({ key: exKey, el: ex });
      }
    });
    return out;
  }

  /* The dark layer's mask box must contain the labels it paints. */
  function sizeMaskBox(){
    var railLeft = rail.getBoundingClientRect().left;
    var widest = 0;
    [].forEach.call(layers.light.querySelectorAll(".gn-rail__tick span"), function(s){
      widest = Math.max(widest, s.getBoundingClientRect().right - railLeft);
    });
    rail.style.setProperty("--gn-mask-w",
      Math.max(MASK_MIN_W, Math.ceil(widest) + 24) + "px");
  }

  function build(){
    if (!rail) return;
    /* FOOTER GATE: genus pages only - they are the pages that carry a
       genus hero. Everything else never grows a rail or a cue. */
    if (!document.querySelector(".ap-gh-title")) return;
    /* MIGRATION SWEEP: while any genus page still carries the old
       per-page GENUS SECTION NAV Code Block, its markup would draw a
       SECOND rail and cue. Remove every copy that is not this footer
       one - re-run on every build, so a late-painted page copy is
       swept too. Harmless once the old blocks are deleted: the
       selectors then match nothing. (The old block's own script keeps
       running against its detached nodes, which browsers treat as a
       no-op - same accepted cost as the apnav v14 migration.) */
    [].forEach.call(document.querySelectorAll('.gn-rail:not([data-gn="footer"])'),
                    function(n){ if (n !== rail) n.remove(); });
    [].forEach.call(document.querySelectorAll('.gn-cue:not([data-gn="footer"])'),
                    function(n){ if (n !== cue) n.remove(); });
    portal();
    applyHand();
    rail.classList.remove("is-ready");
    [].forEach.call(rail.querySelectorAll(".gn-rail__tick"), function(t){ t.remove(); });
    chapters = [];

    if (window.innerWidth < RAIL_MIN_WIDTH) return;

    chapters = detect();
    if (chapters.length < 2) {
      /* v6, LOAD-BEARING — DO NOT DROP THE `chapters = []`.
         `chapters` was just assigned a real, NON-EMPTY array by detect(),
         and we are bailing out BEFORE the loop below that gives each
         entry its `.btn` and its `.twin`. update() guards on
         `chapters.length` alone, so with exactly ONE detected chapter it
         would sail past that guard and throw `Cannot read properties of
         undefined (reading 'classList')` on `c.btn` — once per rAF frame,
         for as long as the reader scrolls.
         Clearing restores the invariant update() actually relies on: a
         non-empty `chapters` means every entry is fully built.
         (`lightSections` below rides on the same invariant — it is only
         ever read from updateMask(), downstream of that guard.)

         LAW: an early return must not leave half-initialised state where
         another function can see it. Either finish initialising or clear.

         ONE tick is not navigation, it is decoration — so an empty rail
         on a part-built genus page is the CORRECT outcome and not a
         regression. Measured on the pollination rail (v2), which was
         ported from this file and inherited this bug. */
      chapters = [];
      return;
    }

    lightSections = findLightSections();

    /* The hero's geometry is cached here; the reveal point itself is
       derived in update(), because it depends on the viewport height
       and that changes without a rebuild. */
    var hero = chapters[0].el;
    heroBottom = docTop(hero) + hero.offsetHeight;

    var last = chapters.length - 1;
    chapters.forEach(function(c, i){
      c.top  = docTop(c.el);
      c.frac = i / last;                 /* EVEN spacing — see v1 notes */

      var b = document.createElement("button");
      b.type = "button";
      b.className = "gn-rail__tick";
      b.style.top = (c.frac * 100).toFixed(2) + "%";
      b.setAttribute("aria-label", "Go to " + LABELS[c.key]);
      var s = document.createElement("span");
      s.textContent = LABELS[c.key];
      b.appendChild(s);
      b.addEventListener("click", function(){
        window.scrollTo({ top: c.top, behavior: RM ? "auto" : "smooth" });
      });
      layers.light.appendChild(b);

      /* dark-ink twin — a span, so the tab order and the accessibility
         tree still see exactly one rail */
      var d = document.createElement("span");
      d.className = "gn-rail__tick";
      d.style.top = (c.frac * 100).toFixed(2) + "%";
      var ds = document.createElement("span");
      ds.textContent = LABELS[c.key];
      d.appendChild(ds);
      layers.dark.appendChild(d);

      c.btn = b;
      c.twin = d;
    });

    sizeMaskBox();
    rail.classList.add("is-ready");
    update();
  }

  /* One hard-stop gradient with a band per light section currently
     overlapping the rail, rebuilt every scroll frame so the seam
     tracks the ground exactly instead of easing towards it. */
  function updateMask(){
    var r = rail.getBoundingClientRect();
    if (!r.height) return;

    var bands = [];
    lightSections.forEach(function(s){
      var b = s.getBoundingClientRect();
      var a = Math.max(0, b.top - r.top);
      var z = Math.min(r.height, b.bottom - r.top);
      if (z > a) bands.push([a, z]);
    });

    if (!bands.length) {
      rail.style.setProperty("--gn-dark-mask", "linear-gradient(#0000 0 100%)");
      return;
    }

    bands.sort(function(p, q){ return p[0] - q[0]; });
    var stops = [], cursor = 0;
    bands.forEach(function(bd){
      if (bd[0] > cursor) stops.push("#0000 " + cursor.toFixed(1) + "px " + bd[0].toFixed(1) + "px");
      stops.push("#000 " + bd[0].toFixed(1) + "px " + bd[1].toFixed(1) + "px");
      cursor = bd[1];
    });
    if (cursor < r.height) stops.push("#0000 " + cursor.toFixed(1) + "px " + r.height.toFixed(1) + "px");

    rail.style.setProperty("--gn-dark-mask",
      "linear-gradient(to bottom," + stops.join(",") + ")");
  }

  function update(){
    var y  = window.scrollY || window.pageYOffset || 0;
    var vh = window.innerHeight;

    if (cue) {
      var o = 1 - (y / (vh * 0.45));
      cue.style.setProperty("--gn-cue-o", Math.max(0, Math.min(1, o)).toFixed(3));
    }

    if (!rail || !chapters.length) return;

    /* ARRIVAL POSITIONS — a section is arrived at when its top reaches
       the viewport's MIDDLE. idx and progress are measured from the
       same reference (raw y), which is what makes the fill start at a
       true 0 and land exactly on tick i as section i arrives. */
    var last = chapters.length - 1;
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);

    var arrive = chapters.map(function(c, i){
      return i === 0 ? 0 : Math.min(maxScroll, Math.max(0, c.top - vh * 0.5));
    });
    for (var m = 1; m < arrive.length; m++) {
      if (arrive[m] <= arrive[m - 1]) arrive[m] = arrive[m - 1] + 1;
    }

    var idx = 0;
    for (var i = 0; i < arrive.length; i++) {
      if (y >= arrive[i]) idx = i; else break;
    }

    var start  = arrive[idx];
    var end    = (idx + 1 < arrive.length) ? arrive[idx + 1] : maxScroll;
    var within = Math.min(1, Math.max(0, (y - start) / Math.max(1, end - start)));

    var f = last > 0 ? (idx + within) / last : 1;
    var pct = (Math.min(1, Math.max(0, f)) * 100).toFixed(2) + "%";
    layers.light.querySelector(".gn-rail__fill").style.height = pct;
    layers.dark.querySelector(".gn-rail__fill").style.height  = pct;

    chapters.forEach(function(c, i){
      var passed = i <= idx, current = i === idx;
      c.btn.classList.toggle("is-passed", passed);
      c.btn.classList.toggle("is-current", current);
      c.twin.classList.toggle("is-passed", passed);
      c.twin.classList.toggle("is-current", current);
    });

    /* Nothing until the hero is (nearly) off screen. Derived here
       rather than at build time so the offset stays a true fraction
       of the CURRENT viewport through any resize. */
    revealAt = Math.max(0, heroBottom + REVEAL_OFFSET_VH * vh);
    rail.classList.toggle("is-visible", y >= revealAt);

    updateMask();
  }

  var ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){ ticking = false; update(); });
  }

  window.addEventListener("scroll", onScroll, { passive:true });
  window.addEventListener("resize", function(){ build(); }, { passive:true });
  window.addEventListener("load", function(){ build(); });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }

  /* The Tableau embeds and both index blocks change section heights
     long after load, and every tick position and the hero's own height
     derive from those. Re-measure rather than trusting first paint. */
  document.addEventListener("mercury:load", function(){ setTimeout(build, 400); });
  setTimeout(build, 2500);
  setTimeout(build, 6000);
  setTimeout(build, 12000);

  /* `refresh` recomputes state WITHOUT a scroll event — the scroll path
     is rAF-gated, and a hidden tab never runs rAF. NOTE for debugging:
     this site sets `scroll-behavior:smooth` on <html>, so a scripted
     window.scrollTo does nothing at all while the tab is not
     compositing. Set documentElement.scrollTop directly instead. */
  window.apGenusNav = {
    rebuild:  build,
    refresh:  update,
    chapters: function(){ return chapters; },
    light:    function(){ return lightSections; },
    revealAt: function(){ return revealAt; },
    hand:     resolveHand
  };
})();

;

(function () {
  try {
    if (window.self !== window.top) return;
    if (window.Static && window.Static.SQUARESPACE_CONTEXT &&
        window.Static.SQUARESPACE_CONTEXT.authenticatedAccount) return;
  } catch (e) { return; }

  var SEARCH_URL = "https://www.aroidpedia.com/search";

  function init() {
    var cta = document.querySelector('.header-actions-action--cta');
    if (!cta) {
      var b = document.querySelector('.header-actions .btn');
      cta = b && b.closest('.header-actions-action');
    }
    if (!cta || cta.dataset.apSearchBound === '1') return;
    var btn = cta.querySelector('.btn, a, button');
    if (!btn) return;
    cta.dataset.apSearchBound = '1';

    // Squarespace's native icon/button is no longer used for anything -
    // our own icon + field fully replace it, both visually and for clicks.
    // Removed outright rather than just hidden, so it isn't sitting
    // invisible in the DOM (Squarespace regenerates it on future page
    // loads/navigations, so this runs again each time via the observer
    // below - it's not a one-time deletion of something needed later).
    var nativeBtn = btn;
    btn = null; // avoid any accidental reference to the removed node below
    nativeBtn.remove();

    var field = document.createElement('div');
    field.className = 'ap-hsearch-field';
    field.setAttribute('role', 'button');
    field.setAttribute('tabindex', '0');
    field.setAttribute('aria-label', 'Search Aroidpedia');
    // type="text" and NO name= on purpose, so the /journal custom-filter
    // search does not bind to this header input.
    field.innerHTML =
      '<span class="ap-hsearch-icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>' +
          '<line x1="16.4" y1="16.4" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
        '</svg>' +
      '</span>' +
      '<input type="text" placeholder="Search Aroidpedia" ' +
      'aria-label="Search Aroidpedia" autocomplete="off">';
    cta.appendChild(field);
    var input = field.querySelector('input');

    function open()  {
      field.classList.add('ap-hsearch-open');
      setTimeout(function () { input.focus(); }, 320);
    }
    function close() {
      field.classList.remove('ap-hsearch-open');
      input.blur();
    }
    function toggle() {
      field.classList.contains('ap-hsearch-open') ? close() : open();
    }

    field.addEventListener('click', function (e) {
      // Once open, clicks inside the input itself should just place the
      // caret/type - only toggle if the click landed on the pill chrome
      // (the icon or empty space), not the live text field.
      if (field.classList.contains('ap-hsearch-open') && e.target === input) return;
      e.preventDefault(); e.stopPropagation();
      toggle();
    });
    field.addEventListener('keydown', function (e) {
      if (e.target !== field) return;   // let the input handle its own keys below
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var q = input.value.trim();
        window.location.href = SEARCH_URL + (q ? ('?q=' + encodeURIComponent(q)) : '');
      } else if (e.key === 'Escape') {
        close();
      }
    });
    document.addEventListener('click', function (e) {
      if (field.classList.contains('ap-hsearch-open') && !field.contains(e.target)) close();
    });
  }

  function start() {
    init();
    // Observe ONLY the header, so journal-grid filtering never triggers us.
    var target = document.querySelector('.header') || document.body;
    var mo = new MutationObserver(function () { init(); });
    mo.observe(target, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();

;

(function () {
  try {
    if (window.self !== window.top) return;
    if (window.Static && window.Static.SQUARESPACE_CONTEXT &&
        window.Static.SQUARESPACE_CONTEXT.authenticatedAccount) return;
  } catch (e) { return; }

  var COUNTS_URL = "https://wainblatrobert.github.io/Aroidpedia/counts.json";
  var DEBUG = false;
  var countsPromise = null;
  var logged = false;

  function getCounts() {
    if (!countsPromise) {
      var today = new Date().toISOString().slice(0, 10);
      countsPromise = fetch(COUNTS_URL + "?v=" + today)
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    }
    return countsPromise;
  }

  function alpha(s) { return String(s || '').toLowerCase().replace(/[^a-z]/g, ''); }

  function generaFolders() {
    var out = [];
    document.querySelectorAll('.header-nav-item--folder').forEach(function (folder) {
      var title = folder.querySelector('.header-nav-folder-title');
      if (title && alpha(title.textContent) === 'genera') out.push(folder);
    });
    return out;
  }

  function folderLinks(folder) {
    var links = folder.querySelectorAll('.header-nav-folder-content a');
    if (!links.length) {
      links = Array.prototype.filter.call(
        folder.querySelectorAll('a'),
        function (a) { return !a.classList.contains('header-nav-folder-title'); }
      );
    }
    return links;
  }

  function applyCounts(counts) {
    var folders = generaFolders();

    if (DEBUG && !logged) {
      logged = true;
      var sampleLinks = [];
      folders.forEach(function (f) {
        folderLinks(f).forEach(function (a) { sampleLinks.push(a.textContent.trim()); });
      });
      console.log('[AP counts] Genera folders found:', folders.length,
        '| byGenus present:', !!(counts && counts.byGenus),
        '| byGenus keys:', counts && counts.byGenus ? Object.keys(counts.byGenus) : null,
        '| dropdown link texts:', sampleLinks);
    }

    if (!counts || !counts.byGenus) return;

    var lookup = {};
    Object.keys(counts.byGenus).forEach(function (k) {
      var v = counts.byGenus[k];
      lookup[alpha(k)] = (v && typeof v === 'object') ? (v.total || 0) : (v || 0);
    });
    var keys = Object.keys(lookup);

    function resolve(linkAlpha) {
      if (linkAlpha in lookup) return lookup[linkAlpha];
      var best = '';
      keys.forEach(function (k) {
        if ((linkAlpha.indexOf(k) === 0 || k.indexOf(linkAlpha) === 0) && k.length > best.length) best = k;
      });
      return best ? lookup[best] : null;
    }

    folders.forEach(function (folder) {
      folderLinks(folder).forEach(function (a) {
        if (a.dataset.apCountBound === '1') return;

        var nameText = a.textContent.trim();
        var total = resolve(alpha(nameText));
        if (total === null) return;

        var name = document.createElement('span');
        name.className = 'ap-genus-name';
        name.textContent = nameText;

        var count = document.createElement('span');
        count.className = 'ap-genus-count';
        count.textContent = Number(total).toLocaleString('en-US');

        a.textContent = '';
        a.appendChild(name);
        a.appendChild(count);
        a.dataset.apCountBound = '1';
      });
    });
  }

  function run() {
    if (!generaFolders().length) return;
    getCounts().then(applyCounts);
  }

  function start() {
    run();
    // Observe ONLY the header, so journal-grid filtering never triggers us.
    var target = document.querySelector('.header') || document.body;
    var mo = new MutationObserver(function () { run(); });
    mo.observe(target, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();

;

(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  var SECTION_SEL = '.collection-type-blog-basic-grid';
  var CURLY_RE = /[\u2018\u2019\u201C\u201D]/g;
  var CURLY_MAP = { '\u2018': "'", '\u2019': "'", '\u201C': '"', '\u201D': '"' };

  function straighten(s) {
    return s.replace(CURLY_RE, function (c) { return CURLY_MAP[c]; });
  }

  function getCategory(item) {
    // Prefer the plugin's category-* classes (reliable), skip category-all.
    //
    // 2026-07-24: collect ALL of them and keep the LONGEST, rather than
    // taking the first match. A post carrying both Hybrid and Hybrid
    // Cultivar gets class="category-hybrid category-hybrid-cultivar",
    // and a first-match regex would return 'hybrid' - colouring a hybrid
    // cultivar card as a plain hybrid, depending only on which class
    // Squarespace happened to emit first. Longest wins means the more
    // specific category always does. Single-category posts are
    // unaffected, since there is only one candidate.
    var all = String(item.className).match(/(?:^|\s)category-(?!all\b)([a-z0-9-]+)/g) || [];
    var slug = all
      .map(function (c) { return c.trim().replace(/^category-/, ''); })
      .sort(function (a, b) { return b.length - a.length; })[0] || '';

    // Pretty label from the visible category link if present. With two
    // categories present there are two links, so pick the one whose text
    // slugifies to the class we chose above - otherwise the eyebrow could
    // read "Hybrid" on a card coloured as Hybrid Cultivar.
    var links = item.querySelectorAll('.blog-categories-list a.blog-categories, a.blog-categories');
    var label = '';
    Array.prototype.forEach.call(links, function (a) {
      var t = (a.textContent || '').trim();
      if (!t) return;
      var s = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (s === slug) label = t;
      else if (!label && !slug) label = t;
    });
    if (!label && links.length && !slug) label = (links[0].textContent || '').trim();

    if (!label && slug) {
      label = slug.split('-').map(function (w) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      }).join(' ');
    }
    if (!slug && label) {
      slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    // A renamed category can linger in the plugin's cached summary data
    // (e.g. Hybrids -> Hybrid) and re-render stale. Canonicalize so cards
    // stay consistent no matter which spelling arrives.
    var CANON = { hybrids: { slug: 'hybrid', label: 'Hybrid' } };
    var fix = CANON[slug] || (label && CANON[label.toLowerCase()]);
    if (fix) { slug = fix.slug; label = fix.label; }

    return { slug: slug, label: label };
  }

  function processCard(item) {
    var textWrap = item.querySelector('.blog-basic-grid--text');
    if (!textWrap || textWrap.querySelector('.ap-plate')) return;

    var titleLink = item.querySelector('.blog-title a');
    if (!titleLink) return;

    var href = titleLink.getAttribute('href') || '#';
    var full = straighten((titleLink.textContent || '').trim().replace(/\s+/g, ' '));
    if (!full) return;

    var cat = getCategory(item);
    if (cat.slug) item.setAttribute('data-ap-cat', cat.slug);

    var sp = full.indexOf(' ');
    var genus = sp > 0 ? full.slice(0, sp) : '';
    var epithet = sp > 0 ? full.slice(sp + 1) : full;

    var plate = document.createElement('a');
    plate.className = 'ap-plate';
    plate.setAttribute('href', href);
    plate.setAttribute('aria-label', full);

    if (cat.label) {
      var c = document.createElement('span');
      c.className = 'ap-plate-cat';
      c.textContent = cat.label;
      plate.appendChild(c);
    }
    if (genus) {
      var g = document.createElement('span');
      g.className = 'ap-plate-genus';
      g.textContent = genus;
      plate.appendChild(g);
    }
    var e = document.createElement('span');
    e.className = 'ap-plate-epithet';
    // Botanical italics: the epithet is italic via CSS; keep any
    // single-quoted cultivar/hybrid name upright (.ap-upright).
    epithet.split(/('[^']*')/).forEach(function (part) {
      if (!part) return;
      if (part.charAt(0) === "'") {
        var up = document.createElement('span');
        up.className = 'ap-upright';
        up.textContent = part;
        e.appendChild(up);
      } else {
        e.appendChild(document.createTextNode(part));
      }
    });
    plate.appendChild(e);

    textWrap.insertBefore(plate, textWrap.firstChild);
  }

  function processAll() {
    var items = document.querySelectorAll(SECTION_SEL + ' article.blog-item');
    for (var i = 0; i < items.length; i++) processCard(items[i]);
  }

  function init() {
    var section = document.querySelector(SECTION_SEL);
    if (!section) return;   // not a journal page

    processAll();

    var pending = null;
    var mo = new MutationObserver(function () {
      if (pending) return;
      pending = setTimeout(function () {
        pending = null;
        processAll();
      }, 80);
    });
    mo.observe(section, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

;

/* ============================================================
   Aroidpedia - Journal card mouse-parallax (v14)
   Feeds --ap-mx / --ap-my (-1..1) onto each .blog-item so the
   "JOURNAL CARDS: organic hover (v24)" CSS block (photo/eyebrow/
   title drift via calc(var(--ap-mx) * ...)) actually has live
   cursor data to react to, instead of sitting frozen at 0.
   Skipped on touch/coarse pointers where :hover doesn't apply.
   ============================================================ */
(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var SEL = '.collection-type-blog-basic-grid .blog-item';

  function bind(card) {
    if (card.dataset.apParallaxBound) return;
    card.dataset.apParallaxBound = '1';

    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      var my = ((e.clientY - r.top) / r.height) * 2 - 1;
      card.style.setProperty('--ap-mx', mx.toFixed(3));
      card.style.setProperty('--ap-my', my.toFixed(3));
    });

    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--ap-mx', 0);
      card.style.setProperty('--ap-my', 0);
    });
  }

  function scan() {
    document.querySelectorAll(SEL).forEach(bind);
  }

  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();

;

/* ============================================================
   Aroidpedia - Journal card adjacent-hover ripple (v15)
   When a card is hovered, finds the cards that are actually
   touching it in the rendered grid (left/right/above/below) and
   toggles .ap-adjacent on them so the CSS ripple rule can apply
   the ~20% lift+grow. Uses offsetTop/offsetLeft (layout position,
   unaffected by the hover transform itself) rather than
   getBoundingClientRect, so the adjacency check stays accurate
   even while the hovered card is mid-animation. Column count is
   never hardcoded - this adapts automatically to every
   breakpoint just by measuring actual rendered positions.
   ============================================================ */
(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var SEL = '.collection-type-blog-basic-grid .blog-item';
  var GAP_TOL = 40;      // a little over the 26px grid gap, plus rounding slop
  var OVERLAP_MIN = 0.5; // neighbor must share at least half its span

  function rectOf(card) {
    return {
      top: card.offsetTop,
      left: card.offsetLeft,
      right: card.offsetLeft + card.offsetWidth,
      bottom: card.offsetTop + card.offsetHeight,
      width: card.offsetWidth,
      height: card.offsetHeight
    };
  }

  function isNeighbor(a, b) {
    var vOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    var vRatio = vOverlap / Math.min(a.height, b.height);
    var hGap = Math.max(b.left - a.right, a.left - b.right);
    var horizNeighbor = vRatio > OVERLAP_MIN && hGap <= GAP_TOL;

    var hOverlap = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    var hRatio = hOverlap / Math.min(a.width, b.width);
    var vGap = Math.max(b.top - a.bottom, a.top - b.bottom);
    var vertNeighbor = hRatio > OVERLAP_MIN && vGap <= GAP_TOL;

    return horizNeighbor || vertNeighbor;
  }

  function clearAdjacent(cards) {
    cards.forEach(function (c) { c.classList.remove('ap-adjacent'); });
  }

  function bind(card, allCardsGetter) {
    if (card.dataset.apRippleBound) return;
    card.dataset.apRippleBound = '1';

    card.addEventListener('mouseenter', function () {
      var all = allCardsGetter();
      var a = rectOf(card);
      all.forEach(function (other) {
        if (other === card) return;
        if (isNeighbor(a, rectOf(other))) other.classList.add('ap-adjacent');
      });
    });

    card.addEventListener('mouseleave', function () {
      clearAdjacent(allCardsGetter());
    });
  }

  function scan() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(SEL));
    cards.forEach(function (card) { bind(card, function () { return cards; }); });
  }

  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();

;

/* ============================================================
   Aroidpedia - Equalize card header plates per visual row
   Pads shorter plates UP to the tallest plate in the SAME row,
   so headers (and therefore photos) line up across each row.
   Card heights are already equalized by the grid; this only
   evens out the plate/photo split within a row.
   ============================================================ */
(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  var GRID_SEL  = '.collection-type-blog-basic-grid .blog-basic-grid';
  var CARD_SEL  = '.blog-item';
  var PLATE_SEL = '.ap-plate';

  function equalizeGrid(grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(CARD_SEL));
    if (!cards.length) return;

    // 1) reset any prior forced height so we measure the NATURAL plate height
    var items = [];
    cards.forEach(function (card) {
      var plate = card.querySelector(PLATE_SEL);
      if (plate) {
        plate.style.removeProperty('min-height');
        items.push({ card: card, plate: plate });
      }
    });
    if (!items.length) return;

    // On single-column (mobile) layouts there's one card per row - leave natural.
    if (window.matchMedia('(max-width: 767px)').matches) return;

    // 2) batch-read: row key (offsetTop ignores hover transform) + natural height
    items.forEach(function (o) {
      o.top = Math.round(o.card.offsetTop);
      o.h   = o.plate.getBoundingClientRect().height;
    });

    // 3) group by visual row
    var rows = {};
    items.forEach(function (o) { (rows[o.top] = rows[o.top] || []).push(o); });

    // 4) batch-write: pad every plate in a row up to that row's tallest
    Object.keys(rows).forEach(function (key) {
      var group = rows[key], max = 0;
      group.forEach(function (o) { if (o.h > max) max = o.h; });
      group.forEach(function (o) {
        o.plate.style.setProperty('min-height', Math.ceil(max) + 'px', 'important');
      });
    });
  }

  function equalizeAll() {
    document.querySelectorAll(GRID_SEL).forEach(equalizeGrid);
  }

  var t;
  function schedule() { clearTimeout(t); t = setTimeout(equalizeAll, 60); }

  function init() {
    equalizeAll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalizeAll);
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    // Re-run when the plugin re-renders the grid (filter / sort) or plates inject.
    var host = document.querySelector('.collection-type-blog-basic-grid') || document.body;
    new MutationObserver(schedule).observe(host, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

;

/* ============================================================
   Aroidpedia - Journal pagination sliding highlight
   Adapts the "sliding dot" animation concept to Squarespace's
   plugin-generated pagination, which (a) shows real page numbers
   rather than dots, (b) has a page count/visible-window that can
   change (ellipsis truncation), and (c) is driven by AJAX rather
   than a fixed, hardcoded set of tabs - so instead of a compiled
   nth-child position table, this measures the actual DOM position
   of whichever item currently carries .active and slides one
   shared highlight <div> there via transform. Works the same way
   regardless of how many pages exist or which window is visible.
   ============================================================ */
(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  var NAV_SEL = '.pagination-block';

  function ensureHighlight(nav) {
    var el = nav.querySelector(':scope > .ap-page-highlight');
    if (el) return el;
    el = document.createElement('div');
    el.className = 'ap-page-highlight';
    el.setAttribute('data-ap-ready', '0');
    nav.insertBefore(el, nav.firstChild);
    return el;
  }

  function reposition(nav, highlight) {
    var active = nav.querySelector('.pagination-item.active');
    if (!active) { highlight.setAttribute('data-ap-ready', '0'); return; }

    // offsetLeft/Top of a direct child are relative to its offsetParent;
    // the nav has position:relative (see CSS), so as long as .pagination-item
    // is a direct child this is exactly the coordinate space we want -
    // no getBoundingClientRect/scroll-offset math needed.
    highlight.style.width = active.offsetWidth + 'px';
    highlight.style.height = active.offsetHeight + 'px';
    highlight.style.transform =
      'translate(' + active.offsetLeft + 'px,' + active.offsetTop + 'px)';
    highlight.setAttribute('data-ap-ready', '1');
  }

  function bind(nav) {
    if (nav.dataset.apPagingBound) return;
    nav.dataset.apPagingBound = '1';

    var highlight = ensureHighlight(nav);

    var t;
    function schedule() { clearTimeout(t); t = setTimeout(function () { reposition(nav, highlight); }, 30); }

    schedule();
    // Catches: the plugin swapping which item has .active (AJAX page
    // change), and the plugin rebuilding the whole nav (new page range).
    new MutationObserver(schedule).observe(nav, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['class']
    });
    window.addEventListener('resize', schedule);
  }

  function scan() {
    document.querySelectorAll(NAV_SEL).forEach(bind);
  }

  function start() {
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

;

/* ============================================================
   Aroidpedia - Fix the mobile menu's native search button
   Squarespace ships this button with an empty href="", so tapping
   it just reloads the current page instead of going anywhere. This
   sets a real destination so it actually works, matching the header
   pill's Enter-to-search behavior on desktop.
   ============================================================ */
(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  var SEARCH_URL = "https://www.aroidpedia.com/search";

  function fix(btn) {
    if (btn.dataset.apSearchFixed) return;
    btn.dataset.apSearchFixed = '1';
    if (!btn.getAttribute('href')) {
      btn.setAttribute('href', SEARCH_URL);
    }
  }

  function scan() {
    document.querySelectorAll(
      '.header-menu .theme-btn--primary.btn.sqs-button-element--primary'
    ).forEach(fix);
  }

  function start() {
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

;

/* ============================================================
   Aroidpedia - Homepage "Featured" gallery: build Journal-style
   category plates
   Scoped entirely to #block-68d517405b0cf4e6534e (this Summary
   Block's own unique ID). This block's native markup has no colored
   header plate - just a plain thumbnail + title below it - so this
   builds one from the category link and title text Squarespace
   already renders (category display had to be enabled in this
   block's own metadata settings first for the category text to even
   exist in the DOM at all).
   Title parsing: genus = first word, epithet = everything after -
   matches the "GENUS 'Epithet'" / "GENUS epithet" convention already
   used sitewide (species un-quoted, cultivars/hybrids quoted).
   ============================================================ */
(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  var ROOT_SEL = '#block-68d517405b0cf4e6534e .summary-item';

  function buildPlate(item) {
    if (item.dataset.apPlateBuilt) return;

    var catLink = item.querySelector('.summary-metadata-item--cats a');
    var titleLink = item.querySelector('.summary-title-link');
    if (!catLink || !titleLink) return;

    item.dataset.apPlateBuilt = '1';

    var category = catLink.textContent.trim();
    var fullTitle = titleLink.textContent.trim().replace(/\s+/g, ' ');
    var firstSpace = fullTitle.indexOf(' ');
    var genus = firstSpace > -1 ? fullTitle.slice(0, firstSpace) : fullTitle;
    var epithet = firstSpace > -1 ? fullTitle.slice(firstSpace + 1) : '';
    var href = titleLink.getAttribute('href') || '#';

    var plate = document.createElement('a');
    plate.className = 'ap-plate';
    plate.href = href;
    plate.setAttribute('data-cat', category.toLowerCase());
    plate.innerHTML =
      '<span class="ap-plate-cat">' + category + '</span>' +
      '<span class="ap-plate-genus">' + genus + '</span>' +
      '<span class="ap-plate-epithet"><span class="ap-upright">' + epithet + '</span></span>';

    item.appendChild(plate);
  }

  function scan() {
    document.querySelectorAll(ROOT_SEL).forEach(buildPlate);
  }

  function start() {
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

;

/* ============================================================
   Aroidpedia - Featured gallery: equalize plate heights per row
   Same mechanism as the Journal's row-equalizer (pads shorter plates
   UP to the tallest plate in the same visual row, e.g. when a title
   like 'DARK BUTTERFLY' wraps to two lines) - just retargeted at this
   Summary Block's grid/card/plate selectors instead of the Journal's.
   Scoped entirely to #block-68d517405b0cf4e6534e.
   Relies on align-items:start already being set on .summary-item-list
   (see CSS) so each card can size independently in the first place -
   this script is what then makes them uniform again, deliberately,
   rather than the browser's own auto-stretch (which caused a
   different, undesired gap earlier).
   ============================================================ */
(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  var GRID_SEL  = '#block-68d517405b0cf4e6534e .summary-item-list';
  var CARD_SEL  = '.summary-item';
  var PLATE_SEL = '.ap-plate';

  function equalizeGrid(grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(CARD_SEL));
    if (!cards.length) return;

    var items = [];
    cards.forEach(function (card) {
      var plate = card.querySelector(PLATE_SEL);
      if (plate) {
        plate.style.removeProperty('min-height');
        items.push({ card: card, plate: plate });
      }
    });
    if (!items.length) return;

    // Unlike the Journal (which drops to a single column on mobile,
    // where "matching row" is meaningless since there's only one card
    // per row), this gallery stays multi-column at every width - so,
    // unlike the Journal's version of this script, there's no
    // skip-on-mobile check here at all.

    items.forEach(function (o) {
      o.top = Math.round(o.card.offsetTop);
      o.h   = o.plate.getBoundingClientRect().height;
    });

    var rows = {};
    items.forEach(function (o) { (rows[o.top] = rows[o.top] || []).push(o); });

    Object.keys(rows).forEach(function (key) {
      var group = rows[key], max = 0;
      group.forEach(function (o) { if (o.h > max) max = o.h; });
      group.forEach(function (o) {
        o.plate.style.setProperty('min-height', Math.ceil(max) + 'px', 'important');
      });
    });
  }

  function equalizeAll() {
    document.querySelectorAll(GRID_SEL).forEach(equalizeGrid);
  }

  var t;
  function schedule() { clearTimeout(t); t = setTimeout(equalizeAll, 60); }

  function init() {
    equalizeAll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalizeAll);
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    var host = document.querySelector('#block-68d517405b0cf4e6534e') || document.body;
    new MutationObserver(schedule).observe(host, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

;

/* ============================================================
   Aroidpedia - Featured/Latest-Additions gallery: adjacent-card
   ripple, adapted from the Journal's version. Same logic
   (measures actual rendered neighbor positions via offsetTop/
   offsetLeft, so it adapts to any column count/breakpoint without
   hardcoding a number), just retargeted at .summary-item and scoped
   to #block-68d517405b0cf4e6534e.
   ============================================================ */
(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var SEL = '#block-68d517405b0cf4e6534e .summary-item';
  var GAP_TOL = 40;
  var OVERLAP_MIN = 0.5;

  function rectOf(card) {
    return {
      top: card.offsetTop,
      left: card.offsetLeft,
      right: card.offsetLeft + card.offsetWidth,
      bottom: card.offsetTop + card.offsetHeight,
      width: card.offsetWidth,
      height: card.offsetHeight
    };
  }

  function isNeighbor(a, b) {
    var vOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    var vRatio = vOverlap / Math.min(a.height, b.height);
    var hGap = Math.max(b.left - a.right, a.left - b.right);
    var horizNeighbor = vRatio > OVERLAP_MIN && hGap <= GAP_TOL;

    var hOverlap = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    var hRatio = hOverlap / Math.min(a.width, b.width);
    var vGap = Math.max(b.top - a.bottom, a.top - b.bottom);
    var vertNeighbor = hRatio > OVERLAP_MIN && vGap <= GAP_TOL;

    return horizNeighbor || vertNeighbor;
  }

  function clearAdjacent(cards) {
    cards.forEach(function (c) { c.classList.remove('ap-adjacent'); });
  }

  function bind(card, allCardsGetter) {
    if (card.dataset.apRippleBound) return;
    card.dataset.apRippleBound = '1';

    card.addEventListener('mouseenter', function () {
      var all = allCardsGetter();
      var a = rectOf(card);
      all.forEach(function (other) {
        if (other === card) return;
        if (isNeighbor(a, rectOf(other))) other.classList.add('ap-adjacent');
      });
    });

    card.addEventListener('mouseleave', function () {
      clearAdjacent(allCardsGetter());
    });
  }

  function scan() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(SEL));
    cards.forEach(function (card) { bind(card, function () { return cards; }); });
  }

  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();

;

/* ============================================================
   Aroidpedia - Individual plant page eyebrow: "diamond hinge" design.
   Genus NAME is read from the first tag (.blog-item-tag-wrapper's
   first <a>), which is always the genus per the site's own tagging
   convention - more reliable than parsing the URL slug, since that
   would misfire on hybrid slugs or a genus name containing a hyphen.
   The LINK itself is still built as /{genus}, NOT the tag's own href
   - that points to a filtered tag-archive page (/journal/tag/...),
   not the actual genus page.

   Cultivar pages additionally get a THIRD segment: the species
   epithet (e.g. "CATEGORY | GENUS | AEQUILOBA"). Parsed from the H1
   title rather than the URL slug, since the URL can't reliably tell
   where the species epithet ends and a multi-word cultivar name
   begins (both are just hyphen-joined) - but the title's opening
   quote mark makes that boundary unambiguous: everything before the
   quote is "Genus Species", everything from the quote on is the
   cultivar name itself. Species/Hybrid pages don't get this segment
   at all (species pages describe the species itself; hybrids have no
   single parent species to name).

   A small gold diamond connects each pair of segments - two diamonds
   in the 3-part Cultivar case. When there's a 3rd segment, the
   wrapper gets an .ap-eyebrow-3part class so CSS can flatten the
   genus segment's borders (it's now in the middle, not the end).
   ============================================================ */
(function () {
  /* v0.2: skip entirely inside the Squarespace editor (canvas iframe) */
  if (window.self !== window.top) return;
  function makeDiamond() {
    var d = document.createElement('span');
    d.className = 'ap-eyebrow-diamond';
    d.setAttribute('aria-hidden', 'true');
    return d;
  }

  function injectGenusEyebrow() {
    var wrapper = document.querySelector('.blog-meta-item--categories .blog-item-category-wrapper');
    if (!wrapper || wrapper.dataset.apGenusInjected) return;

    var genusTagLink = document.querySelector('.blog-meta-item--tags .blog-item-tag-wrapper:first-child a');
    if (!genusTagLink) return;

    var genusName = genusTagLink.textContent.trim();
    if (!genusName) return;
    var genusSlug = genusName.toLowerCase();

    wrapper.dataset.apGenusInjected = '1';

    wrapper.appendChild(makeDiamond());

    var genusLink = document.createElement('a');
    genusLink.href = '/' + genusSlug;
    genusLink.className = 'ap-eyebrow-genus-link';
    genusLink.textContent = genusName;
    wrapper.appendChild(genusLink);

    var isCultivar = !!wrapper.querySelector('.blog-item-category--Cultivar');
    if (isCultivar) {
      var titleEl = document.querySelector('.blog-item-title h1.entry-title');
      if (titleEl) {
        var titleText = titleEl.textContent.trim();
        var quoteMatch = titleText.match(/[\u2018\u2019']/);
        var beforeQuote = quoteMatch ? titleText.slice(0, quoteMatch.index).trim() : titleText;
        var words = beforeQuote.split(/\s+/);
        if (words.length >= 2) {
          var speciesEpithet = words[1];
          var speciesSlug = speciesEpithet.toLowerCase();

          wrapper.classList.add('ap-eyebrow-3part');
          wrapper.appendChild(makeDiamond());

          // Parent species page: /journal/{genus}-{species}, e.g.
          // .../journal/alocasia-peltata-silver-grey (this cultivar)
          // links to .../journal/alocasia-peltata (the species page).
          var speciesLink = document.createElement('a');
          speciesLink.href = '/journal/' + genusSlug + '-' + speciesSlug;
          speciesLink.className = 'ap-eyebrow-species';
          speciesLink.textContent = speciesEpithet;
          wrapper.appendChild(speciesLink);
        }
      }
    }

    scheduleFit();
  }

  /* ---- narrow-screen fit -------------------------------------
     The pill cannot shrink on its own (nowrap + fixed padding +
     fixed tracking), so it is measured and scaled here. See the
     .ap-eb-fit comment in the <style> block above for why this is a
     measurement rather than a breakpoint.
     ------------------------------------------------------------ */
  var FIT_MIN_K = 0.42;   /* floor for padding + tracking */
  var FIT_MIN_F = 0.80;   /* floor for type size; only used if k bottoms out */
  var FIT_GUTTER = 12;    /* breathing room to leave at each edge */

  function fitEyebrow() {
    var wrap = document.querySelector('.blog-meta-item--categories .blog-item-category-wrapper');
    if (!wrap) return;

    /* Measure from the UNFITTED state every time. Without this each
       resize would scale an already-scaled pill and it would walk
       itself down to the floor. */
    wrap.classList.remove('ap-eb-fit');
    wrap.style.removeProperty('--ap-eb-k');
    wrap.style.removeProperty('--ap-eb-f');

    /* If CSS has already restructured the pill, leave it alone. The
       3-part cultivar eyebrow becomes a two-row grid under 767px and
       fits on its own. Reading the computed display asks whether that
       layout is actually in force, rather than repeating its 767px
       breakpoint here where the two could silently drift apart. */
    if (getComputedStyle(wrap).display === 'grid') return;

    var natural = wrap.getBoundingClientRect().width;
    var budget = document.documentElement.clientWidth - FIT_GUTTER * 2;
    if (!natural || natural <= budget) return;

    /* How much of the pill's width is padding and tracking - the part
       that can give. The glyphs and borders are the part that cannot. */
    var segs = wrap.querySelectorAll('.blog-item-category, .ap-eyebrow-genus-link, .ap-eyebrow-species');
    var shrinkable = 0;
    for (var i = 0; i < segs.length; i++) {
      var cs = getComputedStyle(segs[i]);
      shrinkable += parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      shrinkable += parseFloat(cs.letterSpacing) * segs[i].textContent.trim().length;
    }
    if (!shrinkable) return;

    /* Width is linear in k across those two, so the needed factor
       solves in one step - no search loop, one reflow. */
    var k = Math.max(FIT_MIN_K, 1 - (natural - budget) / shrinkable);
    wrap.classList.add('ap-eb-fit');
    wrap.style.setProperty('--ap-eb-k', k.toFixed(4));

    /* Reached only if k hit its floor, which no real aroid genus
       does. Kept so a pathological name degrades instead of bleeding. */
    var fitted = wrap.getBoundingClientRect().width;
    if (fitted > budget) {
      wrap.style.setProperty('--ap-eb-f', Math.max(FIT_MIN_F, budget / fitted).toFixed(4));
    }
  }

  var fitFrame = 0;
  function scheduleFit() {
    if (fitFrame) return;
    fitFrame = requestAnimationFrame(function () { fitFrame = 0; fitEyebrow(); });
  }

  function start() {
    injectGenusEyebrow();
    new MutationObserver(injectGenusEyebrow).observe(document.body, { childList: true, subtree: true });

    /* Cormorant Garamond arrives after first paint, and the pill is
       measured in it - so a fit computed before the swap is computed
       against the fallback's metrics and is simply wrong. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleFit);

    var resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fitEyebrow, 120);
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

;

/* Aroidpedia — footer citation. Pairs with the #apf-footer code block. */
(function () {
  'use strict';

  var SITE_NAME = 'Aroidpedia';
  var SITE_HOST = 'aroidpedia.com';

  function tidy(s) {
    return String(s || '').replace(/\s+/g, ' ').trim();
  }

  /* Strip a trailing " — Aroidpedia" / " | Aroidpedia" style suffix. */
  function stripSiteSuffix(s) {
    var parts = tidy(s).split(/\s+[\u2014\u2013|]\s+/);
    if (parts.length > 1 &&
        parts[parts.length - 1].toLowerCase().indexOf(SITE_NAME.toLowerCase()) !== -1) {
      parts.pop();
    }
    return parts.join(' \u2014 ').trim();
  }

  /* Prefer the page's visible H1; fall back to og:title, then <title>. */
  function pageTitle() {
    var nodes = document.querySelectorAll('#page h1, main h1, article h1, .sqs-block-content h1');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.closest && n.closest('header, nav, #header, .header, .sqs-announcement-bar')) continue;
      if (n.closest && n.closest('#apf-footer')) continue;
      var t = tidy(n.textContent);
      if (t && t.toLowerCase() !== SITE_NAME.toLowerCase()) return t;
    }

    var og = document.querySelector('meta[property="og:title"]');
    if (og && og.getAttribute('content')) return stripSiteSuffix(og.getAttribute('content'));

    return stripSiteSuffix(document.title) || SITE_NAME;
  }

  function citation() {
    var date = new Date().toLocaleDateString('en-US', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    var url = window.location.origin + window.location.pathname;
    return SITE_NAME + '. \u201C' + pageTitle() + '.\u201D ' + SITE_HOST +
           ', accessed ' + date + '. ' + url;
  }

  function init() {
    var root = document.getElementById('apf-footer');
    if (!root || root.dataset.apfReady === '1') return;
    root.dataset.apfReady = '1';

    var out    = root.querySelector('[data-apf-cite]');
    var btn    = root.querySelector('[data-apf-copy]');
    var status = root.querySelector('[data-apf-status]');
    var yearEl = root.querySelector('[data-apf-year]');

    if (yearEl) yearEl.textContent = new Date().getFullYear();

    function render() { if (out) out.textContent = citation(); }
    render();

    if (!btn) return;

    btn.addEventListener('click', function () {
      var text = citation();
      render();

      function done() {
        btn.classList.add('is-copied');
        if (status) status.textContent = 'Citation copied to clipboard';
        window.setTimeout(function () {
          btn.classList.remove('is-copied');
          if (status) status.textContent = '';
        }, 2200);
      }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Squarespace AJAX page loads: re-init when the footer is swapped in. */
  window.addEventListener('mercury:load', init);
})();

;

(function () {
  "use strict";

  if (window.self !== window.top) return;              /* editor: do nothing */

  /* Every search field the suggestions attach to. The header pill is
     ours; .sqs-search-page-input is Squarespace's on /search. */
  var FIELD_SELECTOR = ".ap-hsearch-field, .sqs-search-page-input";

  /* Tried in order; first one returning valid JSON wins. */
  var INDEX_URLS = [
    "https://wainblatrobert.github.io/Aroidpedia/search-index.json",
    "https://raw.githubusercontent.com/wainblatrobert/Aroidpedia/main/docs/search-index.json"
  ];
  var SEARCH_URL = "/search?q=";
  var MAX_GENERA = 3;     /* genera are shown first, capped so entries always show */
  var MAX_ENTRIES = 12;   /* per paint — the list scrolls; the search row catches the rest */

  /* The rail. `k` matches the index's `c` field (lowercase); "" = all.
     Labels are plural because they name the shelf, not the item. */
  var FILTERS = [
    { k: "",                label: "All"              },
    { k: "species",         label: "Species"          },
    { k: "cultivar",        label: "Cultivars"        },
    { k: "hybrid",          label: "Hybrids"          },
    { k: "hybrid cultivar", label: "Hybrid Cultivars" }
  ];

  /* ---------- data ---------- */
  var indexPromise = null;

  function fetchOne(url) {
    /* YYYY-MM-DDTHH - caches within the hour, refreshes across one.
       A date-only key meant a same-day rebuild stayed invisible until
       the following midnight. */
    var key = new Date().toISOString().slice(0, 13);
    return fetch(url + "?v=" + key).then(function (r) {
      /* A 404 from Pages returns an HTML error page. Without this check
         it parses as "no entries" and the dropdown just looks empty,
         which is what made the original failure so hard to spot. */
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (json) {
      if (!json || !json.entries) throw new Error("no entries in payload");
      return json;
    });
  }

  function getIndex() {
    if (!indexPromise) {
      var chain = Promise.reject();
      INDEX_URLS.forEach(function (url) {
        chain = chain.catch(function () { return fetchOne(url); });
      });
      indexPromise = chain
        .then(function (json) {
          return { genera: json.genera || [], entries: json.entries || [] };
        })
        .catch(function (err) {
          /* Visible in devtools rather than a silently empty dropdown. */
          if (window.console) {
            console.warn("[typeahead] no index source reachable:", err);
          }
          return { genera: [], entries: [] };
        });
    }
    return indexPromise;
  }

  /* ---------- matching ---------- */
  function norm(s) { return String(s || "").toLowerCase().trim(); }

  /* Token-wise matching: every word of the query must appear somewhere
     in the row's prebuilt search string. That's what lets "aloc alba"
     find Alocasia 'Albatuwan' - a plain substring test would not. */
  function tokens(q) { return norm(q).split(" ").filter(Boolean); }

  function matchGenera(genera, toks, q) {
    var n = norm(q), starts = [], contains = [];
    genera.forEach(function (g) {
      var i = norm(g.n).indexOf(n);
      if (i === 0) starts.push(g);
      else if (i > 0) contains.push(g);
    });
    return starts.concat(contains).slice(0, MAX_GENERA);
  }

  /* UNCAPPED (v9). This used to stop at 60 because it only showed 6;
     the rail's counts have to be true counts, so it now scans the
     whole index. 384 rows against a few tokens is nothing. */
  function matchEntries(entries, toks) {
    if (!toks.length) return [];
    var starts = [], rest = [];
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var ok = true;
      for (var j = 0; j < toks.length; j++) {
        if (e.s.indexOf(toks[j]) < 0) { ok = false; break; }
      }
      if (!ok) continue;
      /* A row whose search string BEGINS with the first token ranks
         above one that merely contains it somewhere. */
      (e.s.indexOf(toks[0]) === 0 ? starts : rest).push(e);
    }
    return starts.concat(rest);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var QUOTE = /['‘’"“”]/;
  var HAS_LETTER = /[a-zÀ-ɏ]/i;

  /* Set a taxon name the way the site does: italic outside quotes
     (genus, species), roman inside them (cultivar epithets).

     Positional, not a lookup - "inside quotes is roman" covers
     cultivars, multi-word epithets and anything else without needing
     to recognise the name. Segments with no letters (a trailing
     asterisk, stray punctuation) stay roman: italicising punctuation
     conveys nothing.

     The typed portion is bolded in the same pass, because doing it
     afterwards would mean regex-ing markup that this just produced. */
  function fmtName(name, q) {
    name = String(name == null ? "" : name);
    var toks = tokens(q);
    var tok = toks.length ? toks[0] : "";

    /* Measured on the ORIGINAL string. Measuring on the normalised one
       and slicing the original shifted the bold whenever punctuation
       preceded the match. */
    var hs = tok ? name.toLowerCase().indexOf(tok) : -1;
    var he = hs >= 0 ? hs + tok.length : -1;

    function emit(seg, at) {
      if (hs < 0) return esc(seg);
      var s = Math.max(hs - at, 0);
      var e = Math.min(he - at, seg.length);
      if (s >= e) return esc(seg);
      return esc(seg.slice(0, s)) + "<b>" + esc(seg.slice(s, e)) + "</b>" +
             esc(seg.slice(e));
    }

    var out = "", i = 0;
    while (i < name.length) {
      var j;
      if (QUOTE.test(name.charAt(i))) {
        /* Quoted run, closing quote included - roman. */
        j = i + 1;
        while (j < name.length && !QUOTE.test(name.charAt(j))) j++;
        j = Math.min(j + 1, name.length);
        out += '<span class="ap-rom">' + emit(name.slice(i, j), i) + "</span>";
      } else {
        j = i;
        while (j < name.length && !QUOTE.test(name.charAt(j))) j++;
        var seg = name.slice(i, j);
        out += HAS_LETTER.test(seg)
          ? "<i>" + emit(seg, i) + "</i>"
          : '<span class="ap-rom">' + emit(seg, i) + "</span>";
      }
      i = j;
    }
    return out;
  }

  /* Category -> single CSS-class token. "Hybrid Cultivar" becomes
     "hybrid-cultivar" rather than being interpolated raw, which would
     split into two classes at the space. Falls back to "none" so the
     plate still gets its neutral default rule. */
  function catSlug(cat) {
    var s = String(cat || "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return s || "none";
  }

  /* Thumbs ride the CDN resizer: ~100px instead of the full photo.
     (The favicon rule — never append ?format= — is about pixel-exact
     icons; a cover-cropped thumbnail WANTS the resize.) */
  function thumbSrc(u) {
    return u + (u.indexOf("?") < 0 ? "?format=100w" : "&format=100w");
  }

  /* ---------- panel ---------- */
  var panel = document.createElement("div");
  panel.className = "ap-suggest";
  panel.hidden = true;
  panel.innerHTML =
    '<div class="ap-suggest__rail" role="group" aria-label="Filter suggestions by category"></div>' +
    '<div class="ap-suggest__main"><div class="ap-suggest__list" role="listbox"></div></div>';
  var rail = panel.querySelector(".ap-suggest__rail");
  var list = panel.querySelector(".ap-suggest__list");

  var activeInput = null;
  var items = [];       /* rows currently painted, in list order */
  var cursor = -1;
  var q = "";           /* the query hitsG/hitsE answer */
  var hitsG = [];       /* matched genera, capped */
  var hitsE = [];       /* matched entries, ALL of them — the rail counts these */
  var filter = "";      /* rail selection; "" = all */

  function place() {
    if (!activeInput || panel.hidden) return;
    var field = activeInput.closest(FIELD_SELECTOR) || activeInput;
    var r = field.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var vh = document.documentElement.clientHeight;
    var PAD = 12;

    var width = Math.min(620, vw - PAD * 2);
    /* Below ~520px the rail can't sit beside the list; it becomes a
       pill row on top. Class, not media query — the panel's width is
       decided here, not by the viewport alone. */
    panel.classList.toggle("ap-suggest--narrow", width < 520);

    /* Anchor to whichever field edge keeps the panel on screen: a
       field in the right half of the viewport (the header pill)
       anchors by its RIGHT edge and the panel opens leftward; the
       /search input, which spans the page, keeps the old left
       anchor. Then clamp — no geometry may put any part off-screen. */
    var left = (r.left + r.right) / 2 > vw / 2 ? r.right - width : r.left;
    left = Math.max(PAD, Math.min(left, vw - PAD - width));

    var top = r.bottom + 8;
    panel.style.top = top + "px";
    panel.style.left = left + "px";
    panel.style.width = width + "px";
    /* Height is clamped too — the old 60vh could still poke past the
       bottom when the field sat low on the page. */
    panel.style.maxHeight =
      Math.max(180, Math.min(vh * 0.72, vh - top - PAD)) + "px";
  }

  function close() {
    panel.hidden = true;
    cursor = -1;
    items = [];
    filter = "";        /* a stale filter on the next search would hide matches */
    if (activeInput) activeInput.setAttribute("aria-expanded", "false");
  }

  function countFor(k) {
    if (!k) return hitsE.length;
    var n = 0;
    for (var i = 0; i < hitsE.length; i++) {
      if (norm(hitsE[i].c) === k) n++;
    }
    return n;
  }

  function paintRail() {
    rail.innerHTML = FILTERS.map(function (f) {
      var n = countFor(f.k);
      /* Zero-count categories are DISABLED, not hidden — a rail that
         reshuffles on every keystroke can't be aimed at. */
      return '<button type="button" class="ap-suggest__tab"' +
        ' data-k="' + esc(f.k) + '"' +
        ' data-cat="' + (f.k ? esc(catSlug(f.k)) : "all") + '"' +
        ' aria-pressed="' + (filter === f.k) + '"' +
        (n || !f.k ? "" : " disabled") + ">" +
        '<span class="ap-suggest__tab-lab">' + esc(f.label) + "</span>" +
        '<span class="ap-suggest__tab-n">' + n + "</span></button>";
    }).join("");
  }

  function paintList() {
    list.innerHTML = items.map(function (it, i) {
      if (it.type === "search") {
        return '<div class="ap-suggest__row ap-suggest__row--search" role="option" data-i="' + i + '">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
          '<circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>' +
          '<span>Search Aroidpedia for &ldquo;' + esc(q) + '&rdquo;</span></div>';
      }
      if (it.type === "genus") {
        /* Genera have no photo in the index; a serif monogram plate
           keeps the row aligned with the pictured ones and keeps the
           two row kinds tellable apart. */
        return '<div class="ap-suggest__row ap-suggest__row--genus" role="option" data-i="' + i + '" title="' + esc(it.name) + '">' +
          '<span class="ap-suggest__thumb ap-suggest__thumb--genus" aria-hidden="true">' + esc(String(it.name || "?").charAt(0)) + "</span>" +
          '<span class="ap-suggest__name">' + fmtName(it.name, q) + "</span>" +
          '<span class="ap-suggest__n">' + it.total + "</span></div>";
      }
      /* Entry row. The plate behind the image is category-tinted and
         carries the category dot via :empty — if the <img> errors and
         is removed (see the capture listener below), the plate simply
         stands. catSlug() is NOT decoration: "hybrid cultivar"
         interpolated raw would emit TWO classes at the space. */
      var slug = catSlug(it.cat);
      return '<div class="ap-suggest__row" role="option" data-i="' + i + '" title="' + esc(it.name) + '">' +
        '<span class="ap-suggest__thumb ap-suggest__thumb--' + esc(slug) + '" aria-hidden="true">' +
        (it.img ? '<img src="' + esc(thumbSrc(it.img)) + '" alt="" loading="lazy" decoding="async">' : "") +
        "</span>" +
        '<span class="ap-suggest__name">' + fmtName(it.name, q) + "</span>" +
        '<span class="ap-suggest__cat">' + esc(it.cat || "") + "</span></div>";
    }).join("");
  }

  function render() {
    /* An active filter whose count fell to zero on a later keystroke
       would paint an empty list while matches sit behind the rail —
       that reads as "no results", which is a lie. Drop back to All. */
    if (filter && !countFor(filter)) filter = "";

    items = [];
    if (!filter) {
      /* Genus rows carry no category, so they belong to All only. */
      hitsG.forEach(function (g) {
        items.push({ type: "genus", name: g.n, total: g.c, url: g.u });
      });
    }
    var pool = filter
      ? hitsE.filter(function (e) { return norm(e.c) === filter; })
      : hitsE;
    pool.slice(0, MAX_ENTRIES).forEach(function (e) {
      items.push({ type: "entry", name: e.t, cat: e.c, img: e.i, url: e.u });
    });
    items.push({ type: "search", url: SEARCH_URL + encodeURIComponent(q) });

    paintRail();
    paintList();
    panel.hidden = false;
    if (activeInput) activeInput.setAttribute("aria-expanded", "true");
    place();
    mark();
  }

  function mark() {
    Array.prototype.forEach.call(list.children, function (el, i) {
      el.classList.toggle("is-active", i === cursor);
      if (i === cursor && el.scrollIntoView) {
        el.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function go(i) {
    var it = items[i];
    if (!it) return;
    window.location.href = it.url;
  }

  /* ---------- wiring ---------- */
  var t;
  function onInput(e) {
    var input = e.target;
    if (!input.closest || !input.closest(FIELD_SELECTOR)) return;
    activeInput = input;
    var typed = input.value.trim();
    clearTimeout(t);
    if (!typed) { close(); return; }
    t = setTimeout(function () {
      getIndex().then(function (idx) {
        if (input.value.trim() !== typed) return;      /* stale keystroke */
        q = typed;
        var toks = tokens(q);
        hitsG = matchGenera(idx.genera, toks, q);
        hitsE = matchEntries(idx.entries, toks);
        cursor = -1;
        render();
      });
    }, 90);
  }

  /* Everything below touches document.body, so it waits for the DOM.
     Without this the block only works when it happens to run late. */
  function setup() {
    document.body.appendChild(panel);
    document.addEventListener("input", onInput, true);

    document.addEventListener("keydown", function (e) {
      if (!activeInput || panel.hidden) return;
      if (e.target !== activeInput) return;
      if (e.key === "ArrowDown") {
        e.preventDefault(); cursor = (cursor + 1) % items.length; mark();
      } else if (e.key === "ArrowUp") {
        e.preventDefault(); cursor = (cursor - 1 + items.length) % items.length; mark();
      } else if (e.key === "Enter") {
        /* With nothing highlighted, fall through to the normal search. */
        if (cursor >= 0) { e.preventDefault(); go(cursor); }
      } else if (e.key === "Escape") {
        close();
      }
    }, true);

    /* Rail: mousedown, not click, and preventDefault — the field must
       keep focus or the panel blur-closes under the pointer. */
    rail.addEventListener("mousedown", function (e) {
      var b = e.target.closest(".ap-suggest__tab");
      if (!b || b.disabled) return;
      e.preventDefault();
      filter = b.dataset.k || "";
      cursor = -1;
      render();
    });

    panel.addEventListener("mousedown", function (e) {
      /* mousedown, not click — the field may blur-and-collapse first. */
      var row = e.target.closest(".ap-suggest__row");
      if (!row) return;
      e.preventDefault();
      go(parseInt(row.dataset.i, 10));
    });
    panel.addEventListener("mouseover", function (e) {
      var row = e.target.closest(".ap-suggest__row");
      if (row) { cursor = parseInt(row.dataset.i, 10); mark(); }
    });

    /* A dead thumbnail removes itself and leaves the tinted plate.
       Error events don't bubble — capture phase is the only way to
       hear them from up here. */
    panel.addEventListener("error", function (e) {
      if (e.target && e.target.tagName === "IMG") e.target.remove();
    }, true);

    /* Outside-press closes. mousedown + composedPath, NOT a click
       listener with closest(): a rail filter click RE-RENDERS the
       rail mid-event, so by the time anything later inspects the
       event's target, the pressed tab is a DETACHED node — closest()
       can't see the panel from it, and a subsequent click's target
       is whatever the browser re-derives after the DOM changed.
       The mousedown's propagation path is captured at dispatch,
       BEFORE the rail handler re-renders, so composedPath() still
       names the panel. A detached target is treated as inside —
       only our own re-renders detach nodes mid-event. (Caught live
       on the canopy magic mirror, 7.28.26 — same machinery.) */
    document.addEventListener("mousedown", function (e) {
      if (panel.hidden) return;
      var path = e.composedPath ? e.composedPath() : null;
      if (path && path.indexOf(panel) >= 0) return;
      if (e.target.closest && (e.target.closest(FIELD_SELECTOR) || e.target.closest(".ap-suggest"))) return;
      if (!document.documentElement.contains(e.target)) return;   /* detached = ours */
      close();
    });

    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();

;

(function () {
  "use strict";

  if (window.self !== window.top) return;            /* editor: do nothing */
  if (!/^\/search/.test(location.pathname)) return;  /* search page only */

  var OPEN_IN_NEW_TAB = true;
  var INDEX_URLS = [
    "https://wainblatrobert.github.io/Aroidpedia/search-index.json",
    "https://raw.githubusercontent.com/wainblatrobert/Aroidpedia/main/docs/search-index.json"
  ];

  function log() {
    if (window.console) console.log.apply(console, ["[search-links]"].concat(
      Array.prototype.slice.call(arguments)));
  }

  function norm(s) {
    s = String(s == null ? "" : s);
    try {
      s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    } catch (e) {}
    return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function query() {
    var m = /[?&]q=([^&]*)/.exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }

  /* ---------- source 1: Squarespace's own search API ----------
     Same origin, so no CORS involved. Shape has shifted between
     template versions, hence more than one candidate. */
  function fromSearchApi() {
    var q = encodeURIComponent(query());
    if (!q) return Promise.reject(new Error("no query in URL"));

    var urls = [
      "/api/search/GeneralSearch?q=" + q + "&format=json",
      "/api/search/GeneralSearch?q=" + q,
      "/search?q=" + q + "&format=json"
    ];

    var chain = Promise.reject();
    urls.forEach(function (u) {
      chain = chain.catch(function () {
        return fetch(u, { credentials: "same-origin" })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.json();
          })
          .then(function (j) {
            var items = j.items || j.results ||
              (j.response && (j.response.items || j.response.results)) || [];
            if (!items.length) throw new Error("no items");
            var byId = {}, byTitle = {};
            items.forEach(function (it) {
              var url = it.fullUrl || it.url || it.itemUrl;
              if (!url) return;
              if (it.id) byId[String(it.id)] = url;
              if (it.title) byTitle[norm(it.title)] = url;
            });
            return { byId: byId, byTitle: byTitle, source: "search API" };
          });
      });
    });
    return chain;
  }

  /* ---------- source 2: our own published index ---------- */
  function fromIndex() {
    var chain = Promise.reject();
    INDEX_URLS.forEach(function (u) {
      chain = chain.catch(function () {
        return fetch(u + "?v=" + new Date().toISOString().slice(0, 13))
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.json();
          })
          .then(function (j) {
            if (!j || !j.entries) throw new Error("no entries");
            var byTitle = {};
            j.entries.forEach(function (e) { byTitle[norm(e.t)] = e.u; });
            (j.genera || []).forEach(function (g) { byTitle[norm(g.n)] = g.u; });
            return { byId: {}, byTitle: byTitle, source: "search-index.json" };
          });
      });
    });
    return chain;
  }

  function lookups() {
    return fromSearchApi().catch(function (e) {
      log("search API unavailable (" + e.message + "); falling back to index");
      return fromIndex();
    });
  }

  /* ---------- let the anchor win the click ----------
     Squarespace listens for clicks on the result card and navigates in
     JavaScript. Our overlay sits on top, so the browser's context menu
     is ours - but the click still bubbles into their handler, which
     moves the current tab before target="_blank" gets a chance.

     Capture phase runs from the document DOWN to the target, so this
     fires before any handler bound on the card, whether Squarespace
     bound it to the div or delegated it. stopImmediatePropagation also
     covers the case of several handlers on the same element.

     No preventDefault: the anchor is left to do exactly what an anchor
     does, which is what preserves modifier-click behaviour. */
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("a.ap-result-link");
    if (!a) return;
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }, true);

  /* Keyboard activation reaches the anchor as a click, but Enter on the
     card itself would still hit their handler - the same story. */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var a = e.target && e.target.closest && e.target.closest("a.ap-result-link");
    if (!a) return;
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }, true);

  /* ---------- wiring ---------- */
  function titleOf(item) {
    var h = item.querySelector("h1, h2, h3, h4, .search-result-title");
    var t = (h ? h.textContent : item.textContent) || "";
    return t.split("\n")[0].trim();
  }

  function enhance(item, maps, misses) {
    if (item.getAttribute("data-ap-linked") === "1") return;

    var id = item.getAttribute("itemid");
    var title = titleOf(item);
    var href = (id && maps.byId[String(id)]) || maps.byTitle[norm(title)] || null;

    if (!href) { misses.push(title || id || "(untitled)"); return; }
    item.setAttribute("data-ap-linked", "1");

    if (getComputedStyle(item).position === "static") {
      item.style.position = "relative";
    }

    var link = document.createElement("a");
    link.className = "ap-result-link";
    link.setAttribute("href", href);
    link.setAttribute("aria-label", title || href);
    if (OPEN_IN_NEW_TAB) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
    item.appendChild(link);

    /* The div pretended to be a link. Now that a real one covers it,
       drop the pretence so assistive tech announces the card once. */
    if (item.getAttribute("role") === "link") item.removeAttribute("role");
    if (item.getAttribute("tabindex") === "0") item.removeAttribute("tabindex");
  }

  function start(maps) {
    log("URLs resolved via " + maps.source);

    function run() {
      var items = document.querySelectorAll(".search-result, [class*='search-result']");
      var misses = [];
      Array.prototype.forEach.call(items, function (it) {
        if (it.hasAttribute("itemid") || it.classList.contains("search-result")) {
          enhance(it, maps, misses);
        }
      });
      if (misses.length) log("could not resolve " + misses.length + ":", misses.slice(0, 5));
    }

    run();
    /* Results render late and re-render as you page through. Bounded so
       nothing observes for the life of the page. */
    var mo = new MutationObserver(run);
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 20000);
  }

  function boot() {
    lookups().then(start).catch(function (e) {
      log("no URL source available:", e && e.message);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

;

(function () {
  "use strict";

  var DEBUG = false;

  /* Paste the Squarespace URL of the still to force it as the
     end-state background. Leave "" to auto-detect (native fallback
     <img>, then poster). */
  var STILL_URL = "";

  var REVEAL_CLASS = "ap-video-done";
  var NAV_CLASS    = "ap-nav-in";
  var SWAP_CLASS   = "ap-bg-swapped";
  var SKIP_CLASS   = "ap-intro-skip";
  var NAV_LEAD_S   = 1;      /* nav slides in this many s before the end */
  var STALL_MS     = 3000;   /* video exists but never starts playing */
  var FAILSAFE_MS  = 14000;  /* absolute ceiling - reveal no matter what */

  /* Replay buffer: a visitor who watched the full intro within
     this many minutes gets the settled page instantly on reload
     instead of the video again. */
  var REPLAY_BUFFER_MIN = 5;
  var STORE_KEY = "apHomeIntroPlayedAt";

  function playedRecently() {
    try {
      var ts = parseInt(localStorage.getItem(STORE_KEY), 10);
      return !!ts && (Date.now() - ts) < REPLAY_BUFFER_MIN * 60 * 1000;
    } catch (e) { return false; }   /* private browsing -> play normally */
  }
  function markPlayed() {
    try { localStorage.setItem(STORE_KEY, String(Date.now())); } catch (e) {}
  }

  function log() {
    if (DEBUG && window.console) {
      console.log.apply(console, ["[home-video]"].concat([].slice.call(arguments)));
    }
  }

  function navIn(why) {
    if (!document.body.classList.contains(NAV_CLASS)) {
      document.body.classList.add(NAV_CLASS);
      log("ap-nav-in added (" + why + ")");
    }
  }

  function reveal(why) {
    navIn(why);   /* the nav may lead the reveal, never trail it */
    if (!document.body.classList.contains(REVEAL_CLASS)) {
      document.body.classList.add(REVEAL_CLASS);
      log("ap-video-done added (" + why + ")");
      /* Free the hero's transform for scroll control once the
         entrance transition (1.8s in CSS) has fully played out. */
      setTimeout(function () {
        document.body.classList.add("ap-hero-settled");
        log("ap-hero-settled added");
      }, 2000);
    }
  }

  /* Crossfade the ended video into the fallback still. Returns true
     if a still was found; false means the frozen frame stays. */
  function swapToStill(v) {
    var bg = v.closest ? v.closest(".section-background") : null;
    if (!bg) { log("no .section-background ancestor; keeping frozen frame"); return false; }

    /* 1: forced URL */
    if (STILL_URL) {
      var forced = document.createElement("img");
      forced.className = "ap-bg-still";
      forced.alt = "";
      forced.src = STILL_URL;
      bg.insertBefore(forced, bg.firstChild);   /* under the video */
      bg.classList.add(SWAP_CLASS);
      log("still: STILL_URL");
      return true;
    }

    /* 2: Squarespace's own fallback <img> (hidden on desktop; the
       CSS un-hides it once SWAP_CLASS lands). Lazy-loaded images
       carry the URL in data-src until mobile widths promote it. */
    var img = bg.querySelector("img");
    if (img) {
      if (!img.getAttribute("src") && img.getAttribute("data-src")) {
        img.src = img.getAttribute("data-src");
      }
      bg.classList.add(SWAP_CLASS);
      log("still: native fallback <img>");
      return true;
    }

    /* 3: poster attribute */
    if (v.poster) {
      var still = document.createElement("img");
      still.className = "ap-bg-still";
      still.alt = "";
      still.src = v.poster;
      bg.insertBefore(still, bg.firstChild);
      bg.classList.add(SWAP_CLASS);
      log("still: video poster");
      return true;
    }

    log("no still source found; keeping frozen frame");
    return false;
  }

  /* ---- replay-buffer skip path ----
     The body CLASSES land at PARSE time (this script sits at the
     end of <body>), so the settled page renders before anything
     animated paints its start state. The VIDEO, however, cannot be
     handled at parse: Squarespace's player injects the <video>
     element after this script runs, so a parse-time querySelector
     comes back empty - and an unhandled player loops forever (the
     v6 bug). whenVideo() waits for the element instead. */
  function whenVideo(cb) {
    var done = false;
    function attempt() {
      if (done) return true;
      var v = document.querySelector(
        ".page-section:first-of-type .section-background video"
      ) || document.querySelector(".section-background video");
      if (v) { done = true; cb(v); return true; }
      return false;
    }
    if (attempt()) return;
    document.addEventListener("DOMContentLoaded", attempt);
    window.addEventListener("load", attempt);
    /* Bounded poll for players that inject later than `load`.
       ~10s cap: past that, either there is no video on this page
       or something bigger is wrong. */
    var tries = 0;
    var iv = setInterval(function () {
      if (attempt() || ++tries > 40) { clearInterval(iv); }
    }, 250);
  }

  function skipIntro() {
    document.body.classList.add(SKIP_CLASS);
    reveal("replay buffer (" + REPLAY_BUFFER_MIN + "min)");

    whenVideo(function (v) {
      /* Park it - it may not have started, or may already be
         mid-first-loop by the time the player injects it. */
      v.loop = false;
      v.removeAttribute("loop");
      v.autoplay = false;
      v.removeAttribute("autoplay");
      try { v.pause(); } catch (e) {}
      /* The player will still try to start it - re-pause every
         attempt for as long as the page lives. */
      v.addEventListener("play", function () {
        try { v.pause(); } catch (e) {}
      });

      var swapped = false;
      try { swapped = swapToStill(v); } catch (e) {
        log("skip: swap failed:", e);
      }
      if (!swapped) {
        /* No still source - park the video on its final frame
           instead. duration is NaN until metadata arrives. */
        var toEnd = function () {
          if (v.duration) { v.currentTime = v.duration; }
        };
        if (v.readyState >= 1) { toEnd(); }
        else { v.addEventListener("loadedmetadata", toEnd); }
      }
      log("intro skipped; video parked (played within last " +
          REPLAY_BUFFER_MIN + "min)");
    });
  }

  /* v10 guard: home page only.
     Real-device inspection on iPhone confirmed Squarespace's live mobile
     body does NOT carry the `homepage` class, so the old guard exited this
     entire block and left the intro film paused by the lens. Pathname is
     available and stable on every browser before this footer runs. */
  if (location.pathname !== "/" && location.pathname !== "") return;

  if (window.self === window.top && playedRecently()) {
    skipIntro();
    /* boot() is NOT wired up on the skip path - the watchdog,
       timeupdate and failsafe timers all exist to manage a
       playthrough that isn't happening. */
  } else {

  function boot() {
    /* Editor canvas: reveal and get out of the way. */
    if (window.self !== window.top) { reveal("editor"); return; }

    /* Reduced motion: no waiting through an intro video. The video
       still plays behind them; the content just doesn't wait for it. */
    if (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal("prefers-reduced-motion");
      /* fall through - the loop still needs killing below */
    }

    /* First section's background video. Scoped to :first-of-type so a
       background video added to some OTHER section someday doesn't get
       its loop silently killed by this block. */
    var v = document.querySelector(
      ".page-section:first-of-type .section-background video"
    ) || document.querySelector(".section-background video");

    if (!v) { reveal("no video (mobile fallback image / none set)"); return; }
    log("video found, duration:", v.duration || "(not loaded yet)");

    /* --- play once + freeze (v1 behavior, unchanged) --- */
    var enforce = function () {
      v.loop = false;
      v.removeAttribute("loop");
    };
    enforce();
    var watchdog = setInterval(enforce, 500); // watchdog

    /* Nav entrance, NAV_LEAD_S before the end. timeupdate fires a
       few times a second, so the trigger point lands within ~250ms
       of the mark; duration can be NaN until metadata loads, hence
       the guard. Listener removes itself once it has fired. */
    var onTime = function () {
      if (v.duration && v.duration - v.currentTime <= NAV_LEAD_S) {
        navIn("T-minus " + NAV_LEAD_S + "s");
        v.removeEventListener("timeupdate", onTime);
      }
    };
    v.addEventListener("timeupdate", onTime);

    v.addEventListener("ended", function () {
      v.pause();
      v.currentTime = v.duration;   /* hold the last frame under the fade */
      clearInterval(watchdog);      /* nothing left to guard */
      markPlayed();                 /* start the replay-buffer clock */
      reveal("video ended");        /* FIRST - nothing may block this */
      try {
        swapToStill(v);             /* crossfade into the fallback still */
      } catch (err) {
        log("swap failed, keeping frozen frame:", err);
      }
    });

    /* --- failsafes --- */
    setTimeout(function () {
      /* Present but never actually progressed: autoplay was blocked
         or the file is still buffering on a bad connection. Reveal;
         if playback DOES start later, `ended` fires harmlessly into
         an already-revealed page. */
      if (!v.currentTime || v.currentTime < 0.2) {
        reveal("video stalled at " + STALL_MS + "ms");
      }
    }, STALL_MS);

    setTimeout(function () { reveal("failsafe ceiling"); }, FAILSAFE_MS);
  }

  if (document.readyState === "complete") { boot(); }
  else { window.addEventListener("load", boot); }

  }   /* end of else: normal (non-skip) path */
})();

;

(function () {
  "use strict";

  if (window.self !== window.top) return;          /* editor canvas */

  var CLOSE_MS = 350;   /* grace period before a panel closes */

  function bind() {
    document.querySelectorAll(".header-nav-item--folder").forEach(function (item) {
      if (item.dataset.apKeeper === "1") return;   /* already bound */
      var panel = item.querySelector(".header-nav-folder-content");
      if (!panel) return;
      item.dataset.apKeeper = "1";

      var timer = null;

      function open() {
        clearTimeout(timer);
        item.classList.add("ap-hold");
      }
      function close() {
        clearTimeout(timer);
        timer = setTimeout(function () {
          item.classList.remove("ap-hold");
        }, CLOSE_MS);
      }

      /* Both surfaces keep it alive: the item (link + bridge) and
         the panel itself. Leaving one to enter the other lands
         inside the grace window, so the panel never blinks. */
      [item, panel].forEach(function (el) {
        el.addEventListener("mouseenter", open);
        el.addEventListener("mouseleave", close);
      });

      /* Keyboard: tabbing into the folder holds it open; tabbing
         past its last link releases it. */
      item.addEventListener("focusin", open);
      item.addEventListener("focusout", close);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();

;

(function () {
  "use strict";

  if (window.self !== window.top) return;              /* editor canvas */

  var DEBUG = false;

  var MQ = window.matchMedia("(max-width: 767px)");
  var FALLBACK_POS = "68% 50%";

  /* Self-report, readable from the console at any time. */
  window.__apBgShift = { ran: false };

  function readVar(name, fb) {
    var v = getComputedStyle(document.body).getPropertyValue(name).trim();
    return v || fb;
  }

  function wanted() {
    if (!MQ.matches) return "";
    var path = window.location.pathname.toLowerCase();
    /* Alocasia genus page: its own variable, independent of the
       sitewide fallback below. */
    if (path.indexOf("/alocasia") === 0) {
      return readVar("--ap-media-pos-m-alocasia", "80% 60%");
    }
    /* Amorphophallus genus page: mirrored (rightward) shift. */
    if (path.indexOf("/amorphophallus") === 0) {
      return readVar("--ap-media-pos-m-amorphophallus", "20% 60%");
    }
    /* Every other page: the original sitewide default. */
    return readVar("--ap-media-pos-m", FALLBACK_POS);
  }

  /* Both the <video> and the fallback <img> - whichever the build
     actually paints on phones (this one plays the video). */
  var SEL = ".sqs-video-background-native video," +
            ".sqs-video-background-native__fallback-image," +
            ".section-background video," +
            ".section-background img";

  function apply() {
    var want = wanted();
    var nodes = document.querySelectorAll(SEL);
    var applied = 0;
    window.__apBgShift = {
      ran: true,
      mobile: MQ.matches,
      width: window.innerWidth,
      want: want || "(none - desktop width)",
      found: nodes.length,
      at: new Date().toISOString()
    };
    if (DEBUG && window.console) {
      console.log("[bg-shift]", JSON.stringify(window.__apBgShift));
    }
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      /* Guard: never write a value that's already there. Our own
         writes are observed below, so an unconditional write would
         loop forever. */
      if (el.style.getPropertyValue("object-position") === want) continue;
      if (want) {
        el.style.setProperty("object-position", want, "important");
        el.style.setProperty("object-fit", "cover", "important");
        applied++;
      } else {
        el.style.removeProperty("object-position");
        el.style.removeProperty("object-fit");
      }
    }
    window.__apBgShift.applied = applied;
  }

  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () { scheduled = false; apply(); });
  }

  apply();

  /* Watch the background subtree: Squarespace's content-fill pass
     rewrites style attributes (and can replace nodes) once video
     metadata arrives - re-assert after any of it. */
  if ("MutationObserver" in window) {
    var root = document.querySelector(".section-background") || document.body;
    new MutationObserver(schedule).observe(root, {
      attributes: true,
      attributeFilter: ["style", "class"],
      childList: true,
      subtree: true
    });
  }

  window.addEventListener("load", schedule);
  window.addEventListener("resize", schedule, { passive: true });
  if (MQ.addEventListener) MQ.addEventListener("change", schedule);
  /* Late safety net for players that finish initializing after load */
  setTimeout(schedule, 1500);
  setTimeout(schedule, 4000);
})();

;

(function () {
  "use strict";

  if (window.self !== window.top) return;   /* editor canvas */

  var PAGES = [
    /* genus pages - these two prefixes also cover their
       "-pollination" companions, which is why those are not listed */
    "/alocasia",
    "/amorphophallus",
    "/anthurium",
    "/arisaema",
    "/arum",
    "/monstera",
    "/philodendron",
    "/spathiphyllum",	

    /* pollination hub */
    "/aroid-pollination",

    /* the main menu pages */
    "/aroid-map",          /* also covers /aroid-map-join */
    "/aroid-cultivars",
    "/aroid-links",
    "/mission",
    "/contributors",
    "/contact-us",

    /* pest management: the hub, then the eight individual pests,
       which are top-level slugs rather than children of the hub */
    "/pest-management",
    "/spider-mites",
    "/thrips",
    "/mealybugs",
    "/fungus-gnats",
    "/aphids",
    "/whiteflies",
    "/soft-scales",
    "/armored-scales"
  ];
  var path = window.location.pathname.toLowerCase();

  for (var i = 0; i < PAGES.length; i++) {
    if (path.indexOf(PAGES[i]) === 0) {
      document.body.classList.add("ap-nav-glass-off");
      break;
    }
  }
})();

;

(function () {
  "use strict";

  if (window.self !== window.top) return;   /* editor canvas */
  if (!document.body.classList.contains("ap-nav-glass-off")) return;

  var HYSTERESIS = 24;   /* px of dead zone around the switch point */

  var header = document.querySelector("#header");
  if (!header) return;

  function findHero() {
    /* 1. the section holding the genus counter - the hero by definition */
    var counter = document.querySelector(".ap-genus-counter");
    var sec = counter && counter.closest("section[data-section-id]");
    if (sec) return sec;

    /* 2. first section carrying background media (the video) */
    var bg = document.querySelector("section .section-background");
    sec = bg && bg.closest("section[data-section-id]");
    if (sec) return sec;

    /* 3. first section on the page */
    return document.querySelector("section[data-section-id]");
  }

  var hero = findHero();
  if (!hero) return;

  var on = null;              /* last applied state, so we only touch the
                                 class list when it actually changes */

  function update() {
    var h = header.getBoundingClientRect().height || 0;
    var bottom = hero.getBoundingClientRect().bottom;

    /* Dead zone: past the line by a margin turns glass ON, back above
       it by the same margin turns it OFF, and in between nothing
       changes. */
    var want = on;
    if (bottom <= h - HYSTERESIS) want = true;
    else if (bottom >= h + HYSTERESIS) want = false;
    if (want === null) want = bottom <= h;   /* first run, no dead zone */

    if (want === on) return;
    on = want;
    document.body.classList.toggle("ap-nav-glass-on", on);
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; update(); });
  }

  update();   /* correct immediately - the page may load mid-scroll, or
                 arrive at an anchor from the genus counter's jump links */

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("load", schedule);

  /* The hero's height settles late: the background video swaps in for
     the fallback image, and the home-style scroll effects re-measure.
     A few delayed passes cost nothing and avoid a first-paint mismatch. */
  setTimeout(schedule, 400);
  setTimeout(schedule, 1500);
  setTimeout(schedule, 4000);

  /* Self-report, same convention as the BG MEDIA block, so the decision
     is checkable from the console rather than inferred. */
  window.__apNavGlass = {
    get state() {
      return {
        glassOn: on,
        heroBottom: Math.round(hero.getBoundingClientRect().bottom),
        headerHeight: Math.round(header.getBoundingClientRect().height),
        hero: hero.getAttribute("data-section-id") || "(no id)"
      };
    }
  };
})();

;

(function () {
  "use strict";

  if (window.self !== window.top) return;          /* editor canvas */

  /* ---- WHICH ROWS GET A FLYOUT ------------------------------
     key   = href of an existing row in a folder dropdown
     value = the flyout's rows, in the order they should appear  */
  var SUBNAV = {
    "/aroid-pollination": [
      { label: "Why Some Crosses Fail", href: "/chromosomes-and-crossing" },
      { label: "Alocasia Reproduction", href: "/alocasia-pollination" },
      { label: "Amorphophallus Reproduction", href: "/amorphophallus-pollination" },
      { label: "Anthurium Reproduction", href: "/anthurium-pollination" },
      { label: "Arisaema Reproduction", href: "/arisaema-pollination" },
      { label: "Arum Reproduction", href: "/arum-pollination" },
      { label: "Monstera Reproduction", href: "/monstera-pollination" },
      { label: "Philodendron Reproduction", href: "/philodendron-pollination" },
      { label: "Spathiphyllum Reproduction", href: "/spathiphyllum-pollination" }
    ]
  };

  var CLOSE_MS = 260;   /* grace period before a flyout closes, so a
                           momentary slip off the edge is forgiven */
  var EDGE_PAD = 12;    /* min. breathing room at the viewport edge
                           before the flyout gives up on opening left */

  var built = 0;

  /* ------------------------------------------------------------
     DESKTOP
     ------------------------------------------------------------ */

  function place(item, panel, link, fly) {
    var ir = item.getBoundingClientRect();
    var pr = panel.getBoundingClientRect();
    var rr = link.getBoundingClientRect();

    /* Dropdown not actually open yet - nothing reliable to measure
       against, so decline rather than place the panel at 0,0. */
    if (!rr.height || !pr.width) return false;

    /* Guard on NaN, NOT on falsiness: the gap is legitimately 0 now
       that the panels meet flush, and `|| 8` would silently turn
       that 0 back into an 8px gap. */
    var gapRaw = parseFloat(
      getComputedStyle(fly).getPropertyValue("--ap-subnav-gap")
    );
    var gap = isNaN(gapRaw) ? 0 : gapRaw;

    var fr = fly.getBoundingClientRect();
    var firstLink = fly.querySelector("a");
    if (!firstLink) return false;

    /* VERTICAL: line the flyout's first row up with the row that
       opened it. The flyout's own top inset (padding + border) is
       measured rather than hard-coded, so the knobs can change
       without this quietly drifting out of alignment. */
    var inset = firstLink.getBoundingClientRect().top - fr.top;
    fly.style.top = (rr.top - ir.top - inset) + "px";

    /* HORIZONTAL: anchor to the parent PANEL's left edge. The gap
       is added HERE rather than in the CSS - see the no-arithmetic
       note in the style block above. */
    if (fr.width + gap + EDGE_PAD <= pr.left) {
      fly.style.right = (ir.right - pr.left + gap) + "px";
      fly.style.left  = "auto";
    } else {
      /* Not enough room on the left. Open right instead: a menu
         that opens on the unexpected side is a great deal better
         than one that runs off the edge of the screen. Does not
         arise at any current desktop width - this is insurance
         against a future longer menu or a narrower window. */
      fly.style.left  = (pr.right - ir.left + gap) + "px";
      fly.style.right = "auto";
    }
    return true;
  }

  function wire(item, panel, link, entries) {
    var row = link.closest(".header-nav-folder-item") || link.parentElement;

    /* The cue. Appended INSIDE the row's link so it rides the
       link's existing space-between and lands on the right edge
       without disturbing where the label starts. */
    var cue = document.createElement("span");
    cue.className = "ap-subcue";
    cue.setAttribute("aria-hidden", "true");
    link.appendChild(cue);
    link.setAttribute("aria-haspopup", "true");
    link.setAttribute("aria-expanded", "false");

    var fly = document.createElement("div");
    fly.className = "ap-subnav";
    entries.forEach(function (entry) {
      var a = document.createElement("a");
      a.href = entry.href;
      a.textContent = entry.label;
      fly.appendChild(a);
    });

    /* Sibling of the dropdown panel, child of the folder item.
       See the style block - this placement is what keeps the
       flyout out of the panel's overflow clip AND out of its
       backdrop root, and what keeps the parent dropdown hovered
       while the cursor is on the flyout. */
    item.appendChild(fly);
    built++;

    var timer = null;

    function open() {
      clearTimeout(timer);
      item.classList.add("ap-subhold");
      if (place(item, panel, link, fly)) {
        fly.classList.add("ap-sub-open");
        /* Holds the parent row's highlight for as long as the
           flyout is open - see the .ap-sub-parent note in the
           style block. Without it the row goes dark the moment
           the cursor steps onto the flyout. */
        row.classList.add("ap-sub-parent");
        link.setAttribute("aria-expanded", "true");
      }
    }
    function close() {
      clearTimeout(timer);
      timer = setTimeout(shut, CLOSE_MS);
    }
    function shut() {
      clearTimeout(timer);
      fly.classList.remove("ap-sub-open");
      row.classList.remove("ap-sub-parent");
      item.classList.remove("ap-subhold");
      link.setAttribute("aria-expanded", "false");
    }

    /* Both surfaces keep it alive - the row and the flyout (whose
       hover area includes the transparent bridge spanning the gap
       between them), so crossing from one to the other lands
       inside the grace window and the panel never blinks. */
    [row, fly].forEach(function (el) {
      el.addEventListener("mouseenter", open);
      el.addEventListener("mouseleave", close);
      el.addEventListener("focusin", open);
      el.addEventListener("focusout", close);
    });

    /* Leaving the whole folder closes the flyout with it, rather
       than leaving it hanging over the page. */
    item.addEventListener("mouseleave", close);

    /* Keyboard: hover is not an option, so an arrow key steps into
       the flyout and Escape steps back out. Without this the
       flyout's links are reachable only by tabbing past the rest
       of the dropdown. */
    link.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        var first = fly.querySelector("a");
        if (first) { e.preventDefault(); open(); first.focus(); }
      }
    });
    fly.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); link.focus(); shut(); }
    });
  }

  function bindDesktop() {
    var root = document.querySelector(".header-display-desktop") || document;
    root.querySelectorAll(".header-nav-item--folder").forEach(function (item) {
      var panel = item.querySelector(".header-nav-folder-content");
      if (!panel) return;
      Object.keys(SUBNAV).forEach(function (path) {
        var link = panel.querySelector('a[href="' + path + '"]');
        if (!link) return;
        var row = link.closest(".header-nav-folder-item") || link.parentElement;
        if (row.dataset.apSubnav === "1") return;    /* already built */
        row.dataset.apSubnav = "1";
        wire(item, panel, link, SUBNAV[path]);
      });
    });
  }

  /* ------------------------------------------------------------
     MOBILE - the full-screen overlay, which has no hover
     ------------------------------------------------------------ */

  function bindMobile() {
    var menu = document.querySelector(".header-menu");
    if (!menu) return;

    Object.keys(SUBNAV).forEach(function (path) {
      var link = menu.querySelector('a[href="' + path + '"]');
      if (!link) return;
      var row = link.closest(".header-menu-nav-item");
      if (!row || row.dataset.apSubnav === "1") return;

      var after = row;
      SUBNAV[path].forEach(function (entry) {
        /* CLONE the real row rather than hand-building markup. The
           overlay's styling keys off a stack of Squarespace classes;
           a clone inherits all of them and cannot fall out of step
           if Squarespace changes them. */
        var c = row.cloneNode(true);
        c.classList.add("ap-subnav-mobile");
        c.classList.remove("header-menu-nav-item--active");
        delete c.dataset.apSubnav;

        var a = c.querySelector("a");
        if (!a) return;
        a.setAttribute("href", entry.href);

        /* aria-current is copied from the parent whenever the
           visitor is ON the parent page - left in place the clone
           would claim to be the current page too. */
        a.removeAttribute("aria-current");

        /* Squarespace toggles tabindex on the rows IT knows about,
           flipping them to 0 when the overlay opens. The clone is
           not on that list, so a copied tabindex="-1" would make it
           permanently unfocusable. Removing the attribute restores
           natural focus order; the closed overlay is
           visibility:hidden, so nothing inside it is focusable
           while it is shut. */
        a.removeAttribute("tabindex");

        var holder = a.querySelector(".header-menu-nav-item-content") || a;
        holder.textContent = entry.label;

        after.after(c);
        after = c;
      });

      row.dataset.apSubnav = "1";
    });
  }

  function boot() {
    bindDesktop();
    bindMobile();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  /* The header can render late or re-render. The data-ap-subnav
     guard makes a repeat pass free, so a couple of cheap retries
     beats an observer running for the life of the page. */
  window.addEventListener("load", boot);
  setTimeout(boot, 1200);

  /* Self-report, same convention as the BG MEDIA and NAV GLASS
     blocks - the result is checkable from the console instead of
     inferred from whether the menu looks right. */
  window.__apSubnav = {
    get state() {
      return {
        configured: Object.keys(SUBNAV),
        flyoutsBuilt: built,
        mobileRows: document.querySelectorAll(".ap-subnav-mobile").length
      };
    }
  };
})();

;

(function(){
  "use strict";

  /* ================================================================
     CONFIG
     ================================================================ */
  var CFG = {
    /* The journal collection. Squarespace stamps this on <body> as
       collection-<id> on every page belonging to it. Stable unless the
       collection is deleted and remade — if the card ever stops
       appearing site-wide, check this value first. Set it to "" to fall
       back to "any page with a .blog-item-content", which is looser but
       survives a collection rebuild. */
    JOURNAL_COLLECTION : "5ecf40ddda96fb2d2d4da53e",

    /* Tag a post with this to keep it raw. No code edit needed. */
    SKIP_TAG : "NOCARD",

    /* Below this many recognised labels we assume the page is not a
       species post and do nothing at all. Four is enough to be sure
       and low enough that a sparse stub still gets a card. */
    MIN_SECTIONS       : 4,
    /* One spine label is enough on its own. A third of the cultivar
       posts carry exactly one — "CULTIVAR DESCRIPTION:" followed by
       free prose — and they build a perfectly good card from it. What
       the spine test actually keeps out is a page whose only bold
       colon is a "NOTE:" or a "REFERENCES:", which is not an entry. */
    MIN_SECTIONS_SPINE : 1,

    /* Other code blocks in the body are left visible — they are
       usually injections doing a job, and hiding them silently breaks
       whatever they were for. */
    HIDE_CODE_BLOCKS : false,

    /* Character count above which a prose section gains a collapse
       control. It still renders OPEN — see foldable(). */
    FOLD_AT        : 1400,

    /* A DESCRIPTION or NOTES shorter than this is shown as a row in
       the At a glance rail instead of as a section of its own. Sized
       so roughly three lines of the rail's 14px type fit; above it,
       prose starts needing the full measure. */
    RAIL_INLINE_MAX : 260,

    /* Desktop floor for the section rail. 820, not 600: a phone in
       landscape is 812px wide and has the least vertical room of any
       screen, so at 600 it would be the one device that kept the
       floating chrome. Inherited from the pollination nav. */
    RAIL_MIN_WIDTH : 820,

    SHAPES_URL     : "https://wainblatrobert.github.io/Aroidpedia/shapes.json",
    /* v86: fetched LAZILY, only when a tag resolves to nothing in
       shapes.json but the DISTRIBUTION prose names it - see
       upgradeShapes. Every existing post never requests this. */
    SHAPES_HD_URL  : "https://wainblatrobert.github.io/Aroidpedia/shapes-hd.json",
    /* v93: the published place tree - level, parent, country, region,
       continent for 978 places. The journal map already groups by it;
       the card now takes its WASH from it instead of from tags. */
    GEO_HIER_URL   : "https://wainblatrobert.github.io/Aroidpedia/geo-hierarchy.json",
    /* v33: per-species photo manifests, published by the sync script
       beside the photos themselves */
    MANIFEST_BASE  : "https://wainblatrobert.github.io/Aroidpedia/journal/",

    /* map framing: pad the highlighted bbox by this fraction of its
       larger side, never zoom tighter than this many degrees, and keep
       the frame between these two aspect ratios.

       v91 (8.19.26): MAP_MIN_DEG 26 -> 14. At 26 the floor was doing
       almost all the framing for narrow-range species and spending the
       card on ocean - Alocasia micholitziana's range filled 17% of the
       frame width, Luzon a smudge in the South China Sea. The floor
       exists so the map cannot zoom into a meaningless sliver, but the
       CONTEXT WASH (v66) already guarantees that: the frame includes
       the smallest tagged ancestor, so the island or country is always
       in shot. Measured before changing: dracontioides is unaffected
       (81.35 deg, floor never binds), aberrans tightens 26 -> 23.04 and
       then stops at its natural size, micholitziana 26 -> 14. Not taken
       to 10: that crops the surrounding land and loses the orientation
       the wash was added to provide. */
    MAP_PAD        : 0.42,
    MAP_MIN_DEG    : 10,   /* v93: 14 -> 10, the reader's call after
                              seeing 26/14/10 side by side. */
    MAP_MIN_ASPECT : 0.85,
    MAP_MAX_ASPECT : 1.75
  };

  /* The schema. Order here is the order on the card — it is the order
     the user reads the page in, not the order the blocks happen to sit
     in. `alt` are labels seen in the wild that mean the same section.
     ================================================================ */
  /* TWO PROFILES, ONE SCHEMA
     The species posts and the cultivar/hybrid posts do not use the same
     labels — measured across a 36-post sample, the nine species posts
     carried 9–13 of the species labels each, while the cultivar and
     hybrid posts carried none of them and used PARENTAGE, HYBRIDIZER,
     CULTIVAR DESCRIPTION, VARIEGATION and HYBRID DUPES instead. Both
     vocabularies live in this one table; whichever labels a post
     actually has are the ones that render, and the rest never appear.
     That is why there is no "post type" switch anywhere in this file. */
  var SCHEMA = [
    {key:"original",  label:"Original description", alt:["ORIGINAL DESCRIPTION","PROTOLOGUE","FIRST DESCRIPTION"]},
    {key:"parentage", label:"Parentage",            alt:["PARENTAGE","PARENTS","CROSS"]},
    {key:"hybridizer",label:"Hybridizer",           alt:["HYBRIDIZER","HYBRIDISER","BREEDER","REGISTRANT"]},
    {key:"synonyms",  label:"Synonyms",             alt:["SYNONYMS","SYNONYMY"]},
    {key:"distribution", label:"Distribution",      alt:["DISTRIBUTION","NATIVE DISTRIBUTION","RANGE","NATIVE RANGE"]},
    {key:"climate",   label:"Climate",              alt:["CLIMATE"]},
    {key:"ecology",   label:"Ecology",              alt:["ECOLOGY","HABITAT","ECOLOGY & HABITAT"]},
    /* v29: the MAPS subfolder's section — published detail maps (dots
       on collection localities) that accompany articles. Display and
       images only: it adds NO geography — the card's world map and
       climate read the post's tags and nothing else. In the schema so
       it renders with the geography cluster instead of parking at the
       end of the body. */
    {key:"adddist",   label:"Distribution maps", alt:["DISTRIBUTION MAPS","ADDITIONAL DISTRIBUTION","ADDITIONAL DISTRIBUTION MAPS","ADDITIONAL MAPS","COLLECTION MAPS"]},
    {key:"description",label:"Description",         alt:["SPECIES DESCRIPTION","CULTIVAR DESCRIPTION","DESCRIPTION","PLANT DESCRIPTION","MORPHOLOGY"]},
    {key:"inflorescence",label:"Inflorescence",     alt:["INFLORESCENCE","FLOWER","FLOWERS","INFLORESCENCE & FLOWERS"]},
    {key:"variegated",label:"Variegated forms",     alt:["VARIEGATED FORMS","VARIEGATION","VARIEGATES"]},
    {key:"etymology", label:"Etymology",            alt:["ETYMOLOGY","NAME"]},
    {key:"notes",     label:"Notes",                alt:["NOTES","NOTE","REMARKS","BACKGROUND","HISTORY"]},
    /* v72: THE STORY - a feature narrative, lifted out of the body and
       rendered as its own plate. Parsed like any labelled section so
       the schema stays the single source of truth; the render loop
       skips it and buildStory() places it in the wide tail. */
    {key:"story",     label:"Story",                alt:["STORY"]},
    {key:"dupes",     label:"Look-alikes",          alt:["HYBRID DUPES","DUPES","LOOKALIKES","LOOK-ALIKES","CONFUSED WITH"]},
    {key:"cultivars", label:"Cultivars",            alt:["CULTIVARS","CULTIVAR"]},
    {key:"hybrids",   label:"Hybrids",              alt:["HYBRIDS","HYBRID"]},
    {key:"references",label:"References",           alt:["REFERENCES","REFERENCE","SOURCES","LITERATURE"]}
  ];

  /* Labels whose value is the rest of their own line and nothing more.
     On a hybrid post PARENTAGE and HYBRIDIZER are each one line, and the
     three or four narrative paragraphs that follow are the plant's
     story, not the hybridizer's name — without this they would all be
     swallowed into the HYBRIDIZER field. Prose after a one-liner is
     routed to NOTES instead. */
  var ONELINE = { parentage:1, hybridizer:1 };

  /* At least one of these has to be present for the card to build. They
     are the labels that only ever appear on a real entry, so they are
     what separates "a species post with a thin schema" from "some other
     page that happens to have a bold colon in it". */
  var SPINE = {
    original:1, synonyms:1, distribution:1, description:1,
    inflorescence:1, parentage:1, hybridizer:1
  };

  /* sub-labels inside SYNONYMS. Plain text, indented, not bold — they
     are the one place the page uses a second level. */
  /* v30: OTHER NAMES (vernaculars) is a sub-level here too — user
     ruling 8.10.26: same level as HOMOTYPIC, never its own section.
     Listed before OTHER so intent is obvious; matching is exact
     ("OTHER:" cannot swallow an "OTHER NAMES:" line). */
  var SUBS = ["HOMOTYPIC SYNONYMS","HETEROTYPIC SYNONYMS","ACCEPTED INFRASPECIFICS","OTHER NAMES","OTHER"];

  /* Set once per render. nodesToProse() runs deep inside the section
     loop and expanding abbreviations there beats threading the genus
     through six call sites. */
  var CURRENT_GENUS = "";

  var LABEL_MAP = (function(){
    var m = {};
    SCHEMA.forEach(function(s){ s.alt.forEach(function(a){ m[a] = s.key; }); });
    return m;
  })();

  /* Tag names that are not places, and place names the tags spell
     differently from shapes.json. "Caprivi Strip" is the old name for
     what shapes.json calls "Zambezi Region" — one live post still uses
     it. */
  var CONTINENTS = {"ASIA":1,"AFRICA":1,"OCEANIA":1,"AUSTRALASIA":1,"EUROPE":1,
                    "SOUTH AMERICA":1,"NORTH AMERICA":1,"CENTRAL AMERICA":1,"AMERICAS":1,
                    /* added 8.5.26: shapes.json files every Caribbean shape under
                       continent:"Caribbean", so the tag has to be recognised here or
                       it resolves to nothing. It was missing because this list was
                       written before the New World shapes existed. */
                    "CARIBBEAN":1};
  var ALIAS = {
    "CAPRIVI STRIP":"Zambezi Region",
    "BURMA":"Myanmar",
    "VIET NAM":"Vietnam",
    "CELEBES":"Sulawesi",
    "COTE D'IVOIRE":"Ivory Coast",
    "CÔTE D'IVOIRE":"Ivory Coast",
    "DEMOCRATIC REPUBLIC OF THE CONGO":"DR Congo",
    "ZAIRE":"DR Congo",
    "PENINSULAR MALAYSIA":"Peninsular Malaysia",
    "WEST MALAYSIA":"Peninsular Malaysia",
    "SRI LANKA":"Sri Lanka"
  };


  /* ── REGION TAGS ─────────────────────────────────────────────────
     POWO's range prose is full of GROUPING terms — "Indo-China",
     "S. Trop. America", "W. Malesia" — that name several countries at
     once. 17 of them appear across the 150 genus workbooks, and
     "Indo-China" alone covers 70 species records.

     None of them can be a shape. A region built as the union of its
     members is exactly covered by those members, and since the map
     paints in `order` (largest first) with later paths overpainting
     earlier ones, a highlighted region would be drawn first and then
     hidden completely under its own base-styled children — a map that
     zooms to the right place and highlights nothing. That is why
     Hispaniola was left out of shapes.json v6, and it is why this is a
     lookup table instead: the tag expands to its members, and the
     members light up.

     Every member below was checked against shapes.json — 201
     references, 0 unresolved. A typo here is silent, so re-run that
     check after editing.

     Regions the site already treats as CONTINENTS (Asia, Africa,
     South America…) are deliberately absent; they are handled above
     and get the gold continent chip instead. */
  var REGIONS = {
    "INDO-CHINA":            ["Vietnam","Laos","Cambodia","Thailand","Myanmar"],
    "MALESIA":               ["Indonesia","Malaysia","Philippines","Brunei","New Guinea",
                              "Papua New Guinea","Borneo","Sumatra","Java","Sulawesi",
                              "Maluku","Lesser Sunda Islands","Peninsular Malaysia"],
    "W. MALESIA":            ["Sumatra","Java","Borneo","Peninsular Malaysia","Kalimantan",
                              "Sabah","Sarawak","Brunei"],
    "C. MALESIA":            ["Sulawesi","Lesser Sunda Islands","Philippines","Bali","Lombok"],
    "E. MALESIA":            ["New Guinea","Papua New Guinea","Maluku"],
    "PAPUASIA":              ["New Guinea","Papua New Guinea","Bismarck Archipelago",
                              "Solomon Islands","Maluku"],
    "INDIAN SUBCONTINENT":   ["India","Bangladesh","Nepal","Sri Lanka","Assam",
                              "Lakshadweep","Andaman Islands","Nicobar"],

    "W. TROP. AFRICA":       ["Benin","Burkina Faso","Gambia","Ghana","Guinea","Guinea-Bissau",
                              "Ivory Coast","Liberia","Mali","Niger","Nigeria","Senegal",
                              "Sierra Leone","Togo","Cape Verde"],
    "WC. TROP. AFRICA":      ["Cameroon","Central African Republic","Chad","Congo","DR Congo",
                              "Gabon","Cabinda"],
    "E. TROP. AFRICA":       ["Kenya","Tanzania","Uganda","Ethiopia","Sudan"],
    "S. TROP. AFRICA":       ["Angola","Malawi","Zambia","Zimbabwe","Zambezi Region"],
    "TROP. AFRICA":          ["Benin","Burkina Faso","Gambia","Ghana","Guinea","Guinea-Bissau",
                              "Ivory Coast","Liberia","Mali","Niger","Nigeria","Senegal",
                              "Sierra Leone","Togo","Cameroon","Central African Republic",
                              "Chad","Congo","DR Congo","Gabon","Cabinda","Kenya","Tanzania",
                              "Uganda","Ethiopia","Sudan","Angola","Malawi","Zambia","Zimbabwe"],

    "C. AMERICA":            ["Guatemala","Belize","Honduras","El Salvador","Nicaragua",
                              "Costa Rica","Panama"],
    "S. TROP. AMERICA":      ["Colombia","Venezuela","Guyana","Suriname","French Guiana",
                              "Ecuador","Peru","Bolivia","Brazil"],
    "C. & S. TROP. AMERICA": ["Guatemala","Belize","Honduras","El Salvador","Nicaragua",
                              "Costa Rica","Panama","Colombia","Venezuela","Guyana","Suriname",
                              "French Guiana","Ecuador","Peru","Bolivia","Brazil"],
    "TROP. AMERICA":         ["Mexico","Guatemala","Belize","Honduras","El Salvador","Nicaragua",
                              "Costa Rica","Panama","Cuba","Jamaica","Haiti","Dominican Republic",
                              "Puerto Rico","Trinidad and Tobago","Colombia","Venezuela","Guyana",
                              "Suriname","French Guiana","Ecuador","Peru","Bolivia","Brazil"],
    "GUIANAS":               ["Guyana","Suriname","French Guiana"],
    /* "Caribbean" is deliberately NOT here. shapes.json files it as a
       CONTINENT — every Caribbean shape carries continent:"Caribbean" —
       and the builder's own README says those strings have to match the
       continent tag on a post. So it is handled in CONTINENTS above and
       gets the gold continent chip, exactly like Asia and Africa.
       Listing it in both places would make one word mean two things
       depending on which table was consulted first. The Antilles
       entries below still cover POWO's finer Caribbean groupings. */
    "GREATER ANTILLES":      ["Cuba","Jamaica","Haiti","Dominican Republic","Puerto Rico",
                              "Cayman Islands"],
    "LESSER ANTILLES":       ["Guadeloupe","Martinique","Dominica","Saint Lucia","Barbados",
                              "Grenada","Virgin Islands","British Virgin Islands",
                              "Trinidad and Tobago"],
    /* Cited by POWO, and exactly its two countries — which is precisely
       why it is here rather than in shapes.json. */
    "HISPANIOLA":            ["Haiti","Dominican Republic"]
  };

  /* ================================================================
     SMALL HELPERS
     ================================================================ */
  function txt(el){ return (el.textContent || "").replace(/ /g," ").trim(); }
  function squash(s){ return (s||"").replace(/\s+/g," ").trim(); }
  function isNA(s){
    return /^(n\/?a|none|unknown|not known|not recorded|nil|[-—–])\.?$/i.test(squash(s));
  }
  function el(tag, cls, html){
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function param(name){
    var m = new RegExp("[?&]"+name+"=([^&]*)").exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* Squarespace serves one image at many widths. Ask for the size we
     actually paint instead of the 2500w original. */
  function sized(url, w){
    if (!url) return url;
    if (url.indexOf("images.squarespace-cdn.com") < 0 && url.indexOf("squarespace.com") < 0) return url;
    return url.split("?")[0] + "?format=" + w + "w";
  }
  function imgSrc(img){
    return img.getAttribute("data-image") ||
           img.getAttribute("data-src")   ||
           img.currentSrc || img.src || "";
  }

  /* Remove the first n characters of *text* from a subtree, in place,
     leaving all markup (italics, links) intact. This is what lets
     "DISTRIBUTION: <em>Cambodia</em>…" keep its italics after the
     label is cut off. */
  function stripChars(root, n){
    /* ⚠ The cut length was measured against the SQUASHED text, which is
       trimmed, so it must be applied to trimmed text too. Several posts
       write the label as "<strong> SYNONYMS: </strong>" with a leading
       space inside the tag: cutting 9 characters from the raw stream
       ate " SYNONYMS" and left the colon behind, so the card printed
       ": Alocasia metallica, …" and — worse — a bare ": N/A" no longer
       matched the N/A test, so the section refused to collapse. */
    trimLeading(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var left = n, node;
    while (left > 0 && (node = w.nextNode())){
      var len = node.nodeValue.length;
      if (len <= left){ node.nodeValue = ""; left -= len; }
      else { node.nodeValue = node.nodeValue.slice(left); left = 0; }
    }
    /* the label was usually inside a <strong>. If that strong now holds
       the *value* (the "DISTRIBUTION: Cambodia…" case, where the whole
       line was bold), unwrap it so the value is not shouted. */
    var first = root.firstElementChild;
    while (first && /^(STRONG|B)$/.test(first.tagName)){
      var parent = first.parentNode;
      while (first.firstChild) parent.insertBefore(first.firstChild, first);
      parent.removeChild(first);
      first = root.firstElementChild;
    }
    /* drop leading whitespace left behind */
    var t = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false).nextNode();
    if (t) t.nodeValue = t.nodeValue.replace(/^[\s ]+/,"");
    return root;
  }

  /* ================================================================
     ONE PARAGRAPH CAN HOLD SEVERAL LABELS
     Some posts separate their fields with <br> instead of starting a
     new paragraph:

       <p><strong>CULTIVARS: </strong>N/A<br><br>
          <strong>HYBRIDS: </strong><a…>Alocasia 'Kutawatu'</a> (…)</p>

     Walking html.children saw that as ONE node, so only CULTIVARS was
     recognised and HYBRIDS was swallowed into its body — which is why
     Alocasia indica showed a "Cultivars" section containing a bullet
     reading N/A followed by the raw text "HYBRIDS: …". Splitting on
     <br> first makes each line its own candidate heading; a paragraph
     with no <br> passes through untouched.
     ================================================================ */
  function blockLines(container){
    var out = [];
    [].slice.call(container.children).forEach(function(node){
      if (!node.querySelector || !node.querySelector("br")){ out.push(node); return; }
      var seg = node.cloneNode(false);          /* same tag, no children */
      function pushSeg(){
        if (squash(seg.textContent) || seg.querySelector("img")) out.push(seg);
        seg = node.cloneNode(false);
      }
      [].slice.call(node.childNodes).forEach(function(ch){
        if (ch.nodeType === 1 && ch.tagName === "BR"){ pushSeg(); return; }
        seg.appendChild(ch.cloneNode(true));
      });
      pushSeg();
    });
    return out;
  }

  /* Is this node a heading, and if so which section?
     Two conditions, both required, for the reason in the file header. */
  function headingOf(node){
    if (!node || node.nodeType !== 1) return null;
    var t = squash(txt(node));
    if (!t) return null;
    var m = /^([A-Z][A-Z0-9 \-'’&\/\.]{2,44}?)\s*:/.exec(t);
    if (!m) return null;
    var raw = m[1].replace(/\s+/g," ").trim().toUpperCase();
    var known = LABEL_MAP[raw];
    var bold  = !!node.querySelector("strong, b") ||
                /^(H1|H2|H3|H4)$/.test(node.tagName) ||
                (function(){
                  try { return parseInt(getComputedStyle(node).fontWeight,10) >= 600; }
                  catch(e){ return false; }
                })();
    if (!known && !bold) return null;
    if (!known && !/^[A-Z][A-Z \-&\/]{3,}$/.test(raw)) return null;
    return { key: known || ("x_" + raw.toLowerCase().replace(/[^a-z0-9]+/g,"_")),
             label: known ? null : raw,
             cut: m[0].length,      /* characters to strip, incl. the colon */
             raw: raw };
  }

  function subLabelOf(node){
    var t = squash(txt(node));
    for (var i=0;i<SUBS.length;i++){
      var s = SUBS[i];
      if (t.toUpperCase().indexOf(s + ":") === 0) return { label:s, cut:s.length+1 };
    }
    return null;
  }

  /* ================================================================
     PARSE
     Walk every block in the post body in document order and fold it
     into sections. Images are assigned to whichever section is open
     when they appear — that is how the protologue plates end up under
     ORIGINAL DESCRIPTION and the inflorescence slideshow ends up under
     INFLORESCENCE without anything having to say so.
     ================================================================ */
  function parse(layout, selfBlock){
    var blocks = [].slice.call(layout.querySelectorAll(".sqs-block"));
    var start  = blocks.indexOf(selfBlock);
    var sections = {};       /* key -> {key,label,nodes:[],images:[],videos:[],subs:[]} */
    var order    = [];
    var found    = 0;
    var spine    = 0;
    var cur      = null;
    /* index of the last block that opened a real (non-REFERENCES)
       heading — used by the trailing-media pass below */
    var lastContentBlock = -1;
    var pre      = { nodes:[], images:[], videos:[], embeds:[] };  /* anything before the first heading */
    var hidden   = [];

    function open(h){
      if (!sections[h.key]){
        sections[h.key] = { key:h.key, label:h.label, nodes:[], images:[], videos:[], subs:[], embeds:[] };
        order.push(h.key);
      }
      cur = sections[h.key];
      return cur;
    }

    blocks.forEach(function(b, i){
      if (i <= start) return;                       /* our own block and anything above it */
      if (b.closest("[data-apsc-mount]")) return;   /* never eat our own output */
      /* ============ v79 - A CODE BLOCK CAN BE CONTENT ============
         Every code block used to be skipped, on the sound reasoning that
         they are usually site injections. But four posts in the archive
         type real content into one: the three comparison TABLES on
         Alocasia 'Copper Latte', Alocasia 'Black Knight' and
         Amorphophallus bantae, and the CSS-grid variety key on
         Amorphophallus commutatus. Skipped, they were left in the page
         flow while the card hid everything around them - so they ended
         up stranded BELOW the card, after References, which is what the
         user reported.

         The discriminator is payload, not markup: strip <style>,
         <script> and <link>, and see whether any visible text remains.
         Measured on this page - the post's other code block is a
         style-only injection and yields nothing, so it is still skipped,
         and the site footer's block is not in `layout` at all.
         ⚠ A block containing a <script> is never content. That is the
         one that would hurt: absorbing site machinery into the card. */
      var isCode = /\bsqs-block-code\b/.test(b.className);
      if (isCode){
        if (CFG.HIDE_CODE_BLOCKS) return;          /* legacy switch, unchanged */
        var payload = codePayload(b);
        if (!payload) return;                      /* an injection - leave it alone */
        hidden.push(b);
        (cur || pre).embeds = ((cur || pre).embeds || []).concat([payload]);
        return;
      }

      /* Only the block types this file actually reads get hidden. A
         block type it does not understand — a video, an embed, a form —
         stays visible below the card rather than being silently
         swallowed. Two posts in a 39-post sample carry video blocks, and
         a card that quietly ate them would be worse than a card with a
         video hanging off the bottom. */
      var text    = b.querySelector(".sqs-html-content");
      var isImage = /\bsqs-block-image\b/.test(b.className);
      var isGal   = /\bsqs-block-gallery\b/.test(b.className);
      var isVideo = /\bsqs-block-(video|embed)\b/.test(b.className);
      var isFiller= /\bsqs-block-(spacer|horizontalrule)\b/.test(b.className);
      if (!text && !isImage && !isGal && !isVideo && !isFiller) return;

      hidden.push(b);
      if (isFiller) return;

      /* --- video / embed blocks ---
         Squarespace ships the <iframe> escaped in data-html and its own
         script swaps it in later. We read the same attribute and build
         the embed ourselves, so the video survives its source block
         being hidden. Six posts in the archive carry one; before this
         they were left stranded below the card. */
      if (isVideo){
        var vw = b.querySelector("[data-html]");
        var raw = vw && vw.getAttribute("data-html");
        if (!raw) return;
        var holder = el("div", null, raw);         /* unescapes it */
        var frame = holder.querySelector("iframe, video");
        if (!frame) return;
        var ratio = 56.25;
        var pb = b.querySelector(".embed-block-wrapper");
        var pbv = pb && /padding-bottom:\s*([\d.]+)%/.exec(pb.getAttribute("style") || "");
        if (pbv) ratio = parseFloat(pbv[1]);
        else if (frame.getAttribute("width") && frame.getAttribute("height")){
          ratio = (+frame.getAttribute("height") / +frame.getAttribute("width")) * 100;
        }
        (cur ? cur.videos : pre.videos).push({
          at: i,
          html: frame.outerHTML,
          /* Identity is taken here, off the parsed DOM. Reading it back
             out of the html string instead compares an escaped
             attribute (&amp;) against an unescaped one (&) and never
             matches — which rendered every video twice, once in its
             section and once in the leftovers. */
          src: frame.getAttribute("src") || frame.outerHTML.slice(0, 80),
          ratio: Math.max(20, Math.min(260, ratio)),
          title: frame.getAttribute("title") || ""
        });
        return;
      }

      /* --- text blocks --- */
      var html = text;
      if (html){
        blockLines(html).forEach(function(node, li){
          /* v28 (card v25): line-scale position. A wholesale-imported
             post is ONE text block, so block-index granularity cannot
             separate a photo BETWEEN two sections from a photo AFTER
             the last one. Fractional — strictly between block indices —
             so every existing post (images as their own blocks, with
             integer at) behaves identically. */
          var at = i + (li + 1) / 1000;
          var h = headingOf(node);
          if (h){
            found++;
            if (SPINE[h.key]) spine++;
            /* REFERENCES is always last and is not "content" — a photo
               grid sitting above it is still the post's grid. Anything
               else resets the marker. See the trailing-media pass. */
            if (h.key !== "references") lastContentBlock = at;
            var sec = open(h);
            /* a heading line can carry its own value: "ECOLOGY: N/A" */
            var rest = stripChars(node.cloneNode(true), h.cut);
            if (squash(txt(rest))) sec.nodes.push(rest);
            /* a one-liner closes immediately; whatever follows is prose
               about the plant, not more of this field */
            if (ONELINE[h.key]) cur = open({key:"notes", label:null});
            return;
          }
          /* ---- content ABOVE the first label ----
             On every hybrid and hybrid-cultivar post this is an <h4>
             carrying the taxon formula — "Alocasia alba x Alocasia
             'Sintang'" — which the site's own footer injection
             italicises. It is the line that identifies the plant, the
             exact counterpart of the species pages' authority line,
             and v2 threw it away: `cur` is null before the first
             heading, so it fell straight through this guard. */
          /* v28 (card v25): INLINE IMAGES — lift <img> out of the line
             before the prose test. They join the open section's images
             (or the pre-heading pool) with the same record shape the
             image and gallery blocks produce, so the strips, the More
             photos grid and the lightbox need no changes. TITLE attr =
             caption (plain text, by contract with the import
             generator); alt stays accessibility text only — on the
             imported posts it repeats the species name and must not
             become a hover caption. width/height attrs = lightbox dims
             when the generator supplies them. */
          var lineNode = node.cloneNode(true);
          [].slice.call(lineNode.querySelectorAll("img")).forEach(function(im){
            var src = imgSrc(im);
            if (src){
              var capTxt = squash(im.getAttribute("title") || "");
              var iw = im.getAttribute("width"), ih = im.getAttribute("height");
              (cur ? cur.images : pre.images).push({
                src: src,
                alt: im.getAttribute("alt") || "",
                cap: capTxt,
                capHtml: capTxt ? esc(capTxt) : "",
                dim: (iw && ih) ? (iw + "x" + ih) : "",
                at: at,
                inline: true
              });
            }
            if (im.parentNode) im.parentNode.removeChild(im);
          });
          if (!cur){
            if (squash(txt(lineNode))) pre.nodes.push(lineNode);
            return;
          }
          if (cur.key === "synonyms"){
            var s = subLabelOf(lineNode);
            if (s){
              cur.subs.push({ label:s.label, node:stripChars(lineNode, s.cut) });
              return;
            }
          }
          if (squash(txt(lineNode))) cur.nodes.push(lineNode);
        });
        return;
      }

      /* --- image blocks --- */
      if (isImage){
        var im = b.querySelector("img");
        if (!im) return;
        /* The caption is kept as HTML, not as text. "Photo by Alan
           Galloway" is usually a LINK to the photographer, and running
           it through textContent quietly dropped every one of those
           credits' hyperlinks. capHtml is what gets rendered; cap is
           only for emptiness tests. */
        var figcap = b.querySelector("figcaption");
        var capHtml = figcap ? figcap.innerHTML : "";
        if (!squash(figcap ? figcap.textContent : "")){
          var btn = b.querySelector("[data-description]");
          if (btn){
            /* Squarespace escapes the caption markup into this
               attribute; assigning it to innerHTML unescapes it. */
            var d = el("div", null, btn.getAttribute("data-description") || "");
            capHtml = d.innerHTML;
          }
        }
        var capProbe = el("div", null, capHtml);
        var rec = {
          src : imgSrc(im),
          alt : im.getAttribute("alt") || "",
          cap : squash(txt(capProbe)),
          capHtml : capHtml,
          /* Squarespace declares the real pixel size here. The lightbox
             uses it to size its stage to the WIDEST image in the set
             before anything has loaded, so the arrows do not jump
             inward and outward as you page through. */
          dim : im.getAttribute("data-image-dimensions") || ""
        };
        rec.at = i;
        (cur ? cur.images : pre.images).push(rec);
        return;
      }

      /* --- galleries --- */
      if (isGal){
        var seen = {};
        [].slice.call(b.querySelectorAll("img")).forEach(function(g){
          var src = imgSrc(g);
          if (!src || seen[src.split("?")[0]]) return;
          seen[src.split("?")[0]] = 1;
          (cur ? cur.images : pre.images).push({
            src: src,
            alt: g.getAttribute("alt") || "",
            cap: squash(g.getAttribute("data-description") || ""),
            capHtml: g.getAttribute("data-description") || "",
            dim: g.getAttribute("data-image-dimensions") || "",
            gallery: true,
            at: i
          });
        });
        return;
      }
    });

    /* ---- TRAILING MEDIA ----
       A gallery that sits after the LAST content heading is the post's
       own photo grid, not part of whatever section happened to be open
       when it appeared. Without this, Alocasia macrorrhizos 'Lutea' —
       whose last label is SYNONYMS, followed by six plant photos —
       rendered "SYNONYMS 6" with the whole grid filed under a
       one-line synonym. The images were never synonyms; they were just
       last. */
    var trailing = { images:[], videos:[] };
    if (lastContentBlock >= 0){
      order.forEach(function(k){
        var sec = sections[k];
        ["images","videos"].forEach(function(kind){
          var keep = [];
          (sec[kind] || []).forEach(function(m){
            if (typeof m.at === "number" && m.at > lastContentBlock) trailing[kind].push(m);
            else keep.push(m);
          });
          sec[kind] = keep;
        });
      });
    }

    return { sections:sections, order:order, found:found, spine:spine,
             pre:pre, trailing:trailing, hidden:hidden };
  }

  /* ================================================================
     PAGE FACTS — title, genus, tags
     ================================================================ */
  function pageFacts(){
    var h1 = document.querySelector(".blog-item-title h1, .entry-title, h1.entry-title, h1");
    var title = squash(h1 ? h1.textContent : document.title.split("—")[0]);

    var tags = [].slice.call(document.querySelectorAll(
      'a[href*="/journal/tag/"], .blog-meta-item--tags a, .tags a'
    )).map(function(a){ return squash(a.textContent); }).filter(Boolean);

    /* de-dupe, keep order */
    var seen = {}, out = [];
    tags.forEach(function(t){ var k=t.toUpperCase(); if(!seen[k]){seen[k]=1;out.push(t);} });

    var cats = [].slice.call(document.querySelectorAll(
      'a[href*="/journal/category/"], .blog-meta-item--categories a'
    )).map(function(a){ return squash(a.textContent); });

    var genus = title.split(/\s+/)[0] || "";
    var og = document.querySelector('meta[property="og:image"]');

    return {
      title: title,
      genus: genus.charAt(0) + genus.slice(1).toLowerCase(),
      genusRaw: genus,
      tags: out,
      cats: cats,
      og: og ? og.getAttribute("content") : ""
    };
  }

  /* ================================================================
     MAP
     ================================================================ */
  var shapesPromise = null;
  function shapes(){
    /* An escape hatch: set window.APSC_SHAPES to a shapes.json object
       before this block runs and it is used as-is, no network call.
       The offline mockup uses it; on the live site nothing does. */
    if (window.APSC_SHAPES) return Promise.resolve(window.APSC_SHAPES);
    if (!shapesPromise){
      shapesPromise = fetch(CFG.SHAPES_URL, {mode:"cors"})
        .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
        .catch(function(){ return null; });   /* map is optional, never fatal */
    }
    return shapesPromise;
  }

  /* v86: THE HD UPGRADE — closing the shapes.json gap. The card's map
     feed is shapes.json (the journal set, 712 places); the HD-only
     places (Neotropical departments, the Brazil/Mexico states, Türkiye,
     Florida, …) already have climate rows and SUBPARENT rows, but a tag
     naming one resolved to a dashed --off chip here: undrawn AND outside
     the climate envelope. The fix is LAZY: if some tag is neither a
     shape nor a dot AND the DISTRIBUTION prose names it (the resolver's
     own realness test — section names never pass it), shapes-hd.json is
     fetched once and the card resolves against the merged set. Journal
     geometry wins where both files carry a place, so every existing post
     renders pixel-identically; HD fills the gaps; `order` comes from HD
     (a superset, largest-first paint preserved); the wide frame widens
     to viewBoxAll because shapes.json's viewBox stops at lon −31.8 and
     would clip an American range. Optional and never fatal, exactly like
     the map itself. */
  var geoHierPromise = null;
  function geoHier(){
    if (!geoHierPromise){
      geoHierPromise = fetch(CFG.GEO_HIER_URL, {mode:"cors"})
        .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
        .catch(function(){ return null; });   /* optional, like the map */
    }
    return geoHierPromise;
  }
  var shapesHdPromise = null;
  function shapesHd(){
    if (!shapesHdPromise){
      shapesHdPromise = fetch(CFG.SHAPES_HD_URL, {mode:"cors"})
        .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
        .catch(function(){ return null; });
    }
    return shapesHdPromise;
  }
  function upgradeShapes(data, facts, parsed){
    if (!data || !facts || !facts.tags || !facts.tags.length){
      return Promise.resolve(data);
    }
    /* v95: THE UPGRADE IS NO LONGER CONDITIONAL. It used to fire only when
       a tag needed a shape shapes.json lacks, which meant most cards drew
       the journal feed's geometry - and that is COARSE: 60 points for the
       whole Philippine archipelago against 233 in HD, 27 for Thailand
       against 134. Fine for a fixed thumbnail, visibly cut-paper now that
       the map zooms to 40x and frames as tight as 10 degrees.
       Cost: ~498 kb gzipped, against the 406 kb of climate.json this page
       already fetches unconditionally, and cached across every species
       page after the first. */
    var known = data.shapes || {}, dots = data.dots || {};
    return shapesHd().then(function(hd){
      if (!hd || !hd.shapes) return data;
      var frame = (data.viewBoxAll || hd.viewBoxAll || data.viewBox).slice();
      /* v89: `parent` MUST ride the merge. This object is built from an
         explicit key list, so any field not named here is silently lost -
         and the merged path is the ONLY one that carries the WGSRPD
         splits, so dropping it disabled the backdrop rule in exactly the
         case it exists for. Journal data has no parent table of its own;
         HD is the source. */
      var m = { shapes: {}, dots: {}, area: {}, continent: {},
                parent: hd.parent || {},
                order: (hd.order || []).slice(),
                viewBox: frame, viewBoxAll: frame.slice() };
      /* v95: HD GEOMETRY WINS. The old order let the journal feed overwrite
         HD wherever both carried a place, so HD only ever filled gaps and
         the Philippines stayed at 60 points even on a card that had the HD
         feed in hand. Safe to flip: HD is a strict superset - 994 places
         against 710, with ZERO in shapes.json that HD lacks - so nothing
         is dropped by preferring it. The journal pass stays first so a
         future journal-only place would still survive. */
      Object.keys(known).forEach(function(k){ m.shapes[k] = known[k]; });
      Object.keys(hd.shapes).forEach(function(k){ m.shapes[k] = hd.shapes[k]; });
      var hdd = hd.dots || {};
      Object.keys(hdd).forEach(function(k){ m.dots[k] = hdd[k]; });
      Object.keys(dots).forEach(function(k){ m.dots[k] = dots[k]; });
      var ha = hd.area || {}, ja = data.area || {};
      Object.keys(ha).forEach(function(k){ m.area[k] = ha[k]; });
      Object.keys(ja).forEach(function(k){ m.area[k] = ja[k]; });
      var hc = hd.continent || {}, jc = data.continent || {};
      Object.keys(hc).forEach(function(k){ m.continent[k] = hc[k]; });
      Object.keys(jc).forEach(function(k){ m.continent[k] = jc[k]; });
      return m;
    });
  }

  /* v33: the per-species photo manifest. Slug "amorphophallus-decus-
     silvae" -> journal/amorphophallus/decus-silvae/manifest.json (the
     genus is the first token; the rest is the epithet). Optional like
     the map — any failure renders the post with whatever the body
     carries. */
  function photoManifest(){
    var m = /\/([a-z0-9]+)-([a-z0-9-]+)\/?$/.exec(location.pathname);
    if (!m) return Promise.resolve(null);
    var base = CFG.MANIFEST_BASE + m[1] + "/" + m[2] + "/";
    return fetch(base + "manifest.json", {mode:"cors"})
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(j){ if (j) j.__base = base; return j; })
      .catch(function(){ return null; });
  }

  /* v33: synthesize image records from the manifest into the parsed
     post — the same record shape the body's inline images produced, so
     strips, galleries, the archive grid, captions and the lightbox all
     run unchanged. Only when the body carries NO inline images: a body
     that still has them is from the img-emitting generator and remains
     the single source until it is re-imported. */
  /* v34: ALT TEXT. The post h1 is ALL-CAPS by site convention; alt
     reads better in sentence case, so an all-caps title is folded to
     "Genus species". A mixed-case title (nothing on the site today)
     is trusted as-is. */
  function speciesCase(title){
    var t = squash(title || "");
    return (t && t === t.toUpperCase())
      ? t.charAt(0) + t.slice(1).toLowerCase()
      : t;
  }

  /* v34: any record that reaches render with an empty alt gets one.
     PIPELINE records (inline: lifted body imgs whose title attr is a
     descriptive caption by generator contract) take the caption first;
     CLASSIC image/gallery block records take the species name only —
     their figcaption is usually a photographer credit ("Photo by …"),
     which is not a description of the photo. One pass here means every
     render path (hero, strips, plates, archive grid, lightbox)
     inherits a non-empty alt without touching the parser or the
     renderers. Alt stays accessibility-only: nothing reads it back as
     a caption. */
  function fillAlt(parsed, title){
    var species = speciesCase(title);
    function fill(list){
      (list || []).forEach(function(im){
        if (!im.alt) im.alt = (im.inline && im.cap) ? im.cap : species;
      });
    }
    fill(parsed.pre.images); fill(parsed.trailing.images);
    Object.keys(parsed.sections).forEach(function(k){ fill(parsed.sections[k].images); });
  }

  function mergeManifest(parsed, man, title){
    if (!man || !man.roles) return;
    var hasBodyImgs = false;
    function scan(list){ (list || []).forEach(function(i){ if (i.inline) hasBodyImgs = true; }); }
    scan(parsed.pre.images); scan(parsed.trailing.images);
    Object.keys(parsed.sections).forEach(function(k){ scan(parsed.sections[k].images); });
    if (hasBodyImgs) return;

    /* v34: manifest images get role-aware alt — the caption verbatim
       when the manifest carries one (`c`, same source as the visible
       caption), else "<Genus species> — <role term>". Role terms are
       natural language, per the user's own example ("… —
       inflorescence" for a REPRODUCTIVE photo); hero and other carry
       the bare species name — no single term covers them. */
    var species = speciesCase(title);
    var ALT_ROLE = { protologue: "protologue plate",
                     vegetative: "vegetative morphology",
                     "veg-gallery": "vegetative morphology",
                     reproductive: "inflorescence",
                     "rep-gallery": "inflorescence",
                     maps: "distribution map",
                     comparison: "comparison plate",
                     story: "expedition plate" };
    function mk(entry, at, trailing, role){
      var cap = entry.c || "";
      var term = ALT_ROLE[role];
      return { src: man.__base + entry.f,
               alt: cap || (term ? species + " — " + term : species),
               cap: cap,
               capHtml: cap ? esc(cap) : "", dim: "", at: at,
               inline: true, trailingInline: !!trailing };
    }
    var R = man.roles;
    function into(key, list, atBase, role){
      var s = parsed.sections[key];
      (list || []).forEach(function(e, i){
        (s ? s.images : parsed.pre.images).push(mk(e, atBase + i / 100, false, role));
      });
    }
    (R.hero || []).slice(0, 1).forEach(function(e){
      parsed.pre.images.unshift(mk(e, 0.5, false, "hero"));
    });
    into("original",      R.protologue,     1, "protologue");
    if (parsed.sections.description)   into("description",   R["veg-gallery"], 2, "veg-gallery");
    if (parsed.sections.inflorescence) into("inflorescence", R["rep-gallery"], 3, "rep-gallery");
    if (parsed.sections.adddist)       into("adddist",       R.maps,           4, "maps");
    /* v36: the in-situ video - a native player in the Description
       section, below the veg gallery (afterStrip). Falls back to the
       trailing pool (the wide Video section) when the post has no
       Description. */
    (R.video || []).forEach(function(e, i){
      var vrec = { html: '<video controls preload="metadata" playsinline src="' +
                         man.__base + e.f + '"></video>',
                   src: man.__base + e.f, ratio: 56.25,
                   title: e.c || "", at: 5 + i / 100, afterStrip: true };
      var vs = parsed.sections.description;
      (vs ? vs.videos : parsed.trailing.videos).push(vrec);
    });
    /* v47: COMPARISON PLATES - "comparison N" files from OTHER, filed
       by the sync under their own role. They ride the NOTES section
       (fallback Description) and render as full-width figures after
       the prose, not strip tiles; absent both sections they join the
       archive pool so they are never lost. Not in R.other, so the
       More photos grid cannot repeat them. */
    (function(){
      var list = (R.comparisons || []).map(function(e, i){
        return mk(e, 6 + i / 100, false, "comparison");
      });
      if (!list.length) return;
      var target = parsed.sections.notes || parsed.sections.description;
      if (target) target.cmps = (target.cmps || []).concat(list);
      else list.forEach(function(r){ r.trailingInline = true; parsed.trailing.images.push(r); });
    })();
    /* v72: STORY PLATES. Their own pool on the parsed object - they are
       NOT archive photos: they belong to the feature plate and must not
       join More photos, exactly as the comparison plates do not. */
    parsed.storyPlates = (R.story || []).map(function(e, i){
      return mk(e, 7 + i / 100, false, "story");
    });
    var n = 0;
    ["vegetative", "reproductive", "other", "maps", "protologue"].forEach(function(role){
      (R[role] || []).forEach(function(e){
        parsed.trailing.images.push(mk(e, 100000 + (n++), true, role));
      });
    });
  }

  function bboxOfPath(d){
    /* the shapes are absolute M/L polygons in [lon, -lat] degrees, so
       every number pair in the string is a point. No curves to worry
       about. */
    var nums = d.match(/-?\d+(?:\.\d+)?/g);
    if (!nums) return null;
    var x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
    for (var i=0;i+1<nums.length;i+=2){
      var x=+nums[i], y=+nums[i+1];
      if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y;
    }
    return [x0,y0,x1,y1];
  }

  function resolveRegions(tags, distText, data){
    var known = data ? data.shapes : {};
    var dots  = (data && data.dots) || {};
    var hits = [], continents = [], unmapped = [];
    var seen = {};
    /* DOUBTFUL RANGE v1: "Angola?" / "Angola ?" / "Borneo (?)" mark a
       place POWO records with a question mark. Resolve the base place,
       remember the doubt (and the raw tag, for the chip's href). */
    var doubtful = {}, doubtfulTag = {};

    function tryName(name){
      var raw0 = squash(name);
      var isDoubt = /\s*\(?\?\)?$/.test(raw0) && /\?/.test(raw0);
      var k = isDoubt ? squash(raw0.replace(/\s*\(?\?\)?$/, "")) : raw0;
      if (!k) return;
      var up = k.toUpperCase();
      if (seen[up]) return;
      if (CONTINENTS[up]){ seen[up]=1; continents.push(k); return; }

      /* A REGION tag stands for several countries. Expand it and light
         them all, rather than looking for a shape that cannot exist —
         see the REGIONS comment above for why it cannot.
         Marked seen BEFORE recursing so a member that happens to share
         a name with a region can never loop. */
      var members = REGIONS[up.replace(/\s+/g, " ")];
      if (members){
        seen[up] = 1;
        members.forEach(tryName);
        return;
      }

      var canon = ALIAS[up] || k;
      /* v60: the lookup FOLDS DIACRITICS as well as case. Vietnamese
         names are the reason - a shape keyed "Quảng Ngãi" must answer
         to a post tagged "Quang Ngai", and vice versa; the same fold
         quietly helps Panamá, São Tomé and Côte d'Ivoire. ⚠ Đ/đ are
         NOT decomposed by NFD (they are their own letters, U+0110 /
         U+0111), so they are mapped explicitly. */
      var fold = function(x){
        return String(x || "")
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/\u0110/g, "D").replace(/\u0111/g, "d")
          .toUpperCase();
      };
      var want = fold(canon);
      var match = null;
      for (var s in known){ if (fold(s) === want){ match = s; break; } }
      if (!match) for (var dn in dots){ if (fold(dn) === want){ match = dn; break; } }
      /* v61: still nothing? Try again with a trailing ADMINISTRATIVE
         NOUN removed from the TAG. Posts write "Kayah State" and
         "Kanchanaburi Province" where the shape is keyed "Kayah" and
         "Kanchanaburi". ⚠ ONE-WAY on purpose — the tag may lose the
         noun, never the shape key: PNG has provinces whose bare names
         are "Western", "Central" and "Gulf", and letting a key shed
         its qualifier would let a post tagged "Central" (meaning
         central anything) light a PNG province. Exact matches are
         tried first, so real keys like "Vientiane Prefecture" and
         "Somali Region" are unaffected. */
      if (!match){
        var bare = want.replace(
          /\s*(STATE|REGION|PROVINCE|DIVISION|DISTRICT|PREFECTURE|TERRITORY|GOVERNORATE|DEPARTMENT|COUNTY)$/, "");
        if (bare && bare !== want){
          for (var s2 in known){ if (fold(s2) === bare){ match = s2; break; } }
          if (!match) for (var dn2 in dots){ if (fold(dn2) === bare){ match = dn2; break; } }
        }
      }
      seen[up] = 1;
      if (match){
        hits.push(match);
        if (isDoubt){ doubtful[match] = 1; doubtfulTag[match] = raw0; }
        return;
      }

      /* An unrecognised tag only counts as a place if the post's own
         DISTRIBUTION line mentions it.

         This matters because the tag list is not a list of places. It
         also carries the genus, and on the Alocasia posts a set of
         section names — SCABRIUSCULA, PRINCEPS, MACRORRHIZOS,
         LONGILOBA — which would otherwise appear in the rail looking
         exactly like countries. Testing against the distribution
         sentence is what separates "a place shapes.json cannot draw
         yet" from "not a place at all", and it uses the page's own
         words rather than a guess. When the New World shapes land,
         anything genuinely missing still shows — dashed. */
      if (distText && (" " + distText.toUpperCase() + " ").indexOf(up) >= 0){
        unmapped.push(k);
        if (isDoubt){ doubtful[k] = 1; doubtfulTag[k] = raw0; }
      }
    }

    tags.forEach(tryName);

    /* If the tags gave us nothing geographic, fall back to reading the
       DISTRIBUTION prose against the shape names. Slower and dumber,
       but it rescues posts that were never tagged. */
    if (!hits.length && distText){
      var up = " " + distText.toUpperCase() + " ";
      for (var s2 in known){
        if (up.indexOf(" " + s2.toUpperCase()) >= 0) { if(!seen[s2.toUpperCase()]){ seen[s2.toUpperCase()]=1; hits.push(s2); } }
      }
    }
    /* ---- v52: TRUE-COVERAGE SUPPRESSION (user ruling 8.16.26) ----
       The historical posts tag every level they know — "Indonesia,
       Borneo, Sarawak, Sabah, Kalimantan" — because the old system had
       no hierarchy. Now that subunits are drawable, a lit PARENT hides
       its own children: all of Borneo lights and the Sarawak shape is
       invisible inside it. So when a post names a subunit, its level-3
       parent is DROPPED from the map (and from the chips, where it is
       equally misleading). The parent's own tag page is still one hop
       away via the subunit chips, and continents are untouched — they
       are a different axis, not a parent in this sense. */
    var SUBPARENT = {};
    [["Borneo", ["Sarawak","Sabah","Kalimantan","Brunei"]],
     ["Philippines", ["Luzon","Mindanao","Leyte","Samar","Biliran","Panay",
                      ]],
     ["Lesser Sunda Islands", ["Bali","Lombok"]],
     ["China South-Central", ["Yunnan"]],
     /* v70 (user ruling 8.16.26: "mainland WGSRPD units plus Hainan,
        exclude Taiwan and Tibet"). Posts tag "China" by hand — POWO
        never returns it, it returns the WGSRPD level-3 units — and
        with no link between them a post tagged China AND Yunnan lit
        the WHOLE COUNTRY with Yunnan invisible inside it (measured
        live on acuminata, odora and albus). China is coarser than
        level 3, so this belongs in the CARD only: build-genus-geo's
        SUBUNITS maps finer-THAN-L3 children to their L3 parent and
        the genus map never sees a "China" tag at all.
        ⚠ TAIWAN is not in this list and could not be: WGSRPD puts it
        in Eastern Asia, outside the China region entirely. TIBET is a
        China unit but excluded by the same ruling, so a post tagged
        China + Tibet keeps lighting both.
        Yunnan is reached transitively via China South-Central. */
     ["China", ["China South-Central","China Southeast","China North-Central",
                "Manchuria","Inner Mongolia","Qinghai","Xinjiang","Hainan"]],
     ["New Guinea", ["Papua New Guinea"]],
     /* India's level-4 states, 8.16.26 — ⚠ the parent is NOT always
        India: the NE states belong to Assam, Sikkim + Arunachal to
        East Himalaya, and Himachal/Uttarakhand/J&K/Ladakh to West
        Himalaya. Same table as build-genus-geo's SUBUNITS. */
     ["Assam", ["Meghalaya","Manipur","Mizoram","Nagaland","Tripura"]],
     ["East Himalaya", ["Sikkim","Arunachal Pradesh"]],
     ["West Himalaya", ["Himachal Pradesh","Uttarakhand",
                        "Jammu and Kashmir","Ladakh"]],
     ["India", ["Andhra Pradesh","Bihar","Chandigarh","Chhattisgarh","Delhi",
                "Goa","Gujarat","Haryana","Jharkhand","Karnataka","Kerala",
                "Madhya Pradesh","Maharashtra","Odisha","Puducherry","Punjab",
                "Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh",
                "West Bengal","Dadra and Nagar Haveli and Daman and Diu"]],
     /* COUNTRY LEVEL. Not WGSRPD, but it is what the old posts
        tagged: "Indonesia, Borneo, Sarawak, Sabah, Kalimantan" names
        three tiers at once. Lighting a whole country is the same
        overstatement one level up, so countries suppress too. Borneo
        is deliberately NOT a child of either country — the island
        spans Indonesia, Malaysia and Brunei. */
     ["Indonesia", ["Kalimantan","Java","Sumatra","Sulawesi","Maluku",
                    "Lesser Sunda Islands","Bali","Lombok"]],
     ["Malaysia", ["Sarawak","Sabah","Peninsular Malaysia","Malaya"]],
     /* Thailand is ONE level-3 unit, so all 77 provinces parent
        straight to it — a Kanchanaburi tag drops Thailand. Same
        table as build-genus-geo 1.7.0. Four per line, never
        machine-wrapped ("Chiang Mai" splits). */
     /* NEOTROPICS TIER 2, 8.16.26 - Peru, Venezuela, Bolivia
        (418/331/164 species). Five keys qualified to match the tier-1
        convention: two more Amazonas, plus Bolívar, Sucre and La Paz.
        With these, a BARE "Amazonas", "Bolívar", "Sucre" or "La Paz"
        tag resolves to nothing at all - each names 2-3 countries. */
     ["Bolivia", [
       "Beni","Chuquisaca","Cochabamba",
       "La Paz (Bolivia)","Oruro","Pando",
       "Potosí","Santa Cruz","Tarija"
     ]],
     ["Peru", [
       "Amazonas (Peru)","Apurímac","Arequipa",
       "Ayacucho","Cajamarca","Callao",
       "Cusco","Huancavelica","Huánuco",
       "Ica","Junín","La Libertad",
       "Lambayeque","Lima","Lima Province",
       "Loreto","Madre de Dios","Moquegua",
       "Pasco","Piura","Puno",
       "San Martín","Tacna","Tumbes",
       "Ucayali","Áncash"
     ]],
     ["Venezuela", [
       "Amazonas (Venezuela)","Anzoátegui","Apure",
       "Aragua","Barinas","Bolívar (Venezuela)",
       "Carabobo","Cojedes","Delta Amacuro",
       "Dependencias Federales","Distrito Capital","Falcón",
       "Guárico","Lara","Miranda",
       "Monagas","Mérida","Nueva Esparta",
       "Portuguesa","Sucre (Venezuela)","Trujillo",
       "Táchira","Vargas","Yaracuy",
       "Zulia"
     ]],
     /* NEOTROPICS TIER 1, 8.16.26 - Colombia, Ecuador, Panama and
        Costa Rica: the family's four richest level-3 units with no
        level-4 detail (939/733/552/308 species). Six keys carry a
        qualifier against collisions that already exist or are coming
        with tiers 2-3: two Bolívars, three Amazonas, two Sucres, two
        Colóns, and "Panamá Province" against the COUNTRY Panama. A
        bare "Amazonas" or "Bolívar" tag matches nothing on purpose. */
     ["Colombia", [
       "Amazonas (Colombia)","Antioquia","Arauca",
       "Atlántico","Bogotá","Bolívar (Colombia)",
       "Boyacá","Caldas","Caquetá",
       "Casanare","Cauca","Cesar",
       "Chocó","Cundinamarca","Córdoba",
       "Guainía","Guaviare","Huila",
       "La Guajira","Magdalena","Meta",
       "Nariño","Norte de Santander","Putumayo",
       "Quindío","Risaralda","Santander",
       "Sucre (Colombia)","Tolima","Valle del Cauca",
       "Vaupés","Vichada"
     ]],
     ["Costa Rica", [
       "Alajuela","Cartago","Guanacaste",
       "Heredia","Limón","Puntarenas",
       "San José"
     ]],
     ["Ecuador", [
       "Azuay","Bolívar (Ecuador)","Carchi",
       "Cañar","Chimborazo","Cotopaxi",
       "El Oro","Esmeraldas","Guayas",
       "Imbabura","Loja","Los Ríos",
       "Manabí","Morona-Santiago","Napo",
       "Orellana","Pastaza","Pichincha",
       "Santa Elena","Santo Domingo de los Tsáchilas","Sucumbíos",
       "Tungurahua","Zamora-Chinchipe"
     ]],
     ["Panama", [
       "Bocas del Toro","Chiriquí","Coclé",
       "Colón (Panama)","Darién","Emberá",
       "Herrera","Kuna Yala","Los Santos",
       "Ngöbe Buglé","Panamá Province","Veraguas"
     ]],
     /* NIGERIA + BENIN, 8.16.26. Each is a single level-3 unit.
        ⚠ THREE KEYS ARE QUALIFIED because shape keys share one
        namespace: "Plateau" is a Nigerian state AND a Benin
        department, and "Niger" is also a country. A bare "Plateau"
        tag matches nothing on purpose - it is truly ambiguous. */
     ["Benin", [
       "Alibori","Atacora","Atlantique",
       "Borgou","Collines","Couffo",
       "Donga","Littoral","Mono",
       "Ouémé","Plateau Department","Zou"
     ]],
     ["Nigeria", [
       "Abia","Adamawa","Akwa Ibom",
       "Anambra","Bauchi","Bayelsa",
       "Benue","Borno","Cross River",
       "Delta","Ebonyi","Edo",
       "Ekiti","Enugu","Federal Capital Territory",
       "Gombe","Imo","Jigawa",
       "Kaduna","Kano","Katsina",
       "Kebbi","Kogi","Kwara",
       "Lagos","Nasarawa","Niger State",
       "Ogun","Ondo","Osun",
       "Oyo","Plateau State","Rivers",
       "Sokoto","Taraba","Yobe",
       "Zamfara"
     ]],
     /* AUSTRALIA, 8.16.26. ⚠ NOT a level-4 case — Australia's STATES
        ARE the WGSRPD level-3 units, so POWO names them directly and no
        subunit refinement exists or is needed. They are listed here only
        so the true-coverage rule applies: a post tagging "Australia" AND
        "Queensland" should show Queensland, not the whole continent. */
     ["Australia", [
       "Western Australia","Northern Territory","Queensland",
       "New South Wales","Victoria","South Australia","Tasmania"
     ]],
     /* MYANMAR STATES + PNG PROVINCES, 8.16.26. Myanmar is flat.
        PNG is THREE TIERS: province -> Papua New Guinea -> New
        Guinea, both of which the transitive walk suppresses. */
     ["Myanmar", [
       "Ayeyarwady","Bago","Chin",
       "Kachin","Kayah","Kayin",
       "Magway","Mandalay","Mon",
       "Rakhine","Sagaing","Shan",
       "Tanintharyi","Yangon"
     ]],
     ["Papua New Guinea", [
       "Bougainville","Central Province","Chimbu",
       "East New Britain","East Sepik","Eastern Highlands",
       "Enga","Gulf Province","Madang",
       "Manus","Milne Bay","Morobe",
       "National Capital District","New Ireland","Oro",
       "Sandaun","Southern Highlands","West New Britain",
       "Western Highlands","Western Province"
     ]],
     /* VIETNAMESE PROVINCES, 8.16.26. Vietnam is a single level-3
        unit, so all sixty parent straight to it. Keys carry the
        Vietnamese diacritics; card v60 folds accents when matching,
        so "Quang Ngai" and "Quảng Ngãi" both resolve. */
     ["Vietnam", [
       "An Giang","Bà Rịa - Vũng Tàu","Bình Dương",
       "Bình Phước","Bình Thuận","Bình Định",
       "Bạc Liêu","Bắc Giang","Bắc Ninh",
       "Bến Tre","Cao Bằng","Cà Mau",
       "Cần Thơ","Gia Lai","Hà Giang",
       "Hà Nam","Hà Nội","Hà Tĩnh",
       "Hòa Bình","Hải Dương","Hải Phòng",
       "Hậu Giang","Hồ Chí Minh","Khánh Hòa",
       "Kiên Giang","Kon Tum","Lai Châu",
       "Long An","Lào Cai","Lâm Đồng",
       "Lạng Sơn","Nam Định","Nghệ An",
       "Ninh Bình","Ninh Thuận","Phú Thọ",
       "Phú Yên","Quảng Bình","Quảng Nam",
       "Quảng Ngãi","Quảng Ninh","Quảng Trị",
       "Sóc Trăng","Sơn La","Thanh Hóa",
       "Thái Bình","Thái Nguyên","Thừa Thiên - Huế",
       "Tiền Giang","Trà Vinh","Tuyên Quang",
       "Tây Ninh","Vĩnh Long","Vĩnh Phúc",
       "Yên Bái","Điện Biên","Đà Nẵng",
       "Đắk Lắk","Đắk Nông","Đồng Tháp"
     ]],
     /* LAO PROVINCES, 8.16.26. Laos is a single level-3 unit, so
        all seventeen parent straight to it. English tags; the feeds
        alias them to NE ("Khammouane" -> "Khammouan"). The two
        Vientianes are separate: a bare "Vientiane" is the PROVINCE. */
     ["Quezon", ["Alabat"]],
     ["Laos", [
       "Attapeu","Bokeo","Bolikhamsai",
       "Champasak","Houaphanh","Khammouane",
       "Luang Namtha","Luang Prabang","Oudomxay",
       "Phongsaly","Sainyabuli","Salavan",
       "Savannakhet","Sekong","Vientiane",
       "Vientiane Prefecture","Xiangkhouang"
     ]],
     /* ETHIOPIAN REGIONS, 8.16.26 - the first AFRICAN level-4 set.
        Ethiopia is a single level-3 unit, so all eleven parent
        straight to it. Tags are what a post would write; the shape
        feeds alias them to Natural Earth ("Oromia" -> "Oromiya"). */
     ["Ethiopia", [
       "Addis Ababa","Afar","Amhara",
       "Benishangul-Gumuz","Dire Dawa","Gambela",
       "Harari","Oromia","Somali Region",
       "Southern Nations","Tigray"
     ]],
     /* MALAYSIAN STATES + PHILIPPINE PROVINCES, 8.16.26. The PH
        parent is the finest ISLAND the site draws, not the
        administrative region: Palawan files under a Luzon-area
        region but is its own island, so it parents to Philippines.
        Labuan parents to Sabah (WGSRPD folds it into BOR-SB). */
     ["Leyte", [
       "Southern Leyte"
     ]],
     ["Luzon", [
       "Abra","Albay","Apayao",
       "Aurora","Bataan","Batangas",
       "Benguet","Bulacan","Cagayan",
       "Camarines Norte","Camarines Sur","Cavite",
       "Ifugao","Ilocos Norte","Ilocos Sur",
       "Isabela","Kalinga","La Union",
       "Laguna","Mandaluyong City","Mountain Province",
       "Nueva Ecija","Nueva Vizcaya","Pampanga",
       "Pangasinan","Quezon","Quirino",
       "Rizal","Sorsogon","Tarlac",
       "Zambales"
     ]],
     ["Mindanao", [
       "Surigao del Norte",
       "Agusan del Norte","Agusan del Sur","Bukidnon",
       "Compostela Valley","Cotabato","Davao Oriental",
       "Davao del Norte","Davao del Sur","Lanao del Norte",
       "Lanao del Sur","Maguindanao","Misamis Occidental",
       "Misamis Oriental","Sarangani","South Cotabato",
       "Sultan Kudarat","Surigao del Sur","Zamboanga Sibugay",
       "Zamboanga del Norte","Zamboanga del Sur"
     ]],
     ["Panay", [
       "Aklan","Antique","Capiz",
       "Iloilo"
     ]],
     ["Peninsular Malaysia", [
       "Johor","Kedah","Kelantan",
       "Kuala Lumpur","Malacca","Negeri Sembilan",
       "Pahang","Penang","Perak",
       "Perlis","Putrajaya","Selangor",
       "Terengganu"
     ]],
     ["Philippines", [
       "Basilan","Batanes","Bohol",
       "Camiguin","Catanduanes","Cebu",
       "Guimaras","Marinduque","Masbate",
       "Mindoro Occidental","Mindoro Oriental","Negros Occidental",
       "Negros Oriental","Palawan","Romblon",
       "Siquijor","Sulu","Tawi-Tawi"
     ]],
     ["Sabah", [
       "Labuan"
     ]],
     ["Samar", [
       "Eastern Samar","Northern Samar"
     ]],
     /* INDONESIAN PROVINCES, 8.16.26. Grouped by their real
        level-3 parent, not by country: the Kalimantan provinces
        hang off Kalimantan (itself a child of Borneo AND
        Indonesia), so "Central Kalimantan" suppresses Kalimantan,
        Borneo and Indonesia through the transitive walk. Keys are
        the ENGLISH names the posts tag with. */
     ["Java", [
       "Banten","Central Java","East Java",
       "Jakarta","West Java","Yogyakarta"
     ]],
     ["Kalimantan", [
       "Central Kalimantan","East Kalimantan","South Kalimantan",
       "West Kalimantan"
     ]],
     ["Lesser Sunda Islands", [
       "East Nusa Tenggara","West Nusa Tenggara"
     ]],
     ["Maluku", [
       "North Maluku"
     ]],
     ["New Guinea", [
       "Papua","West Papua"
     ]],
     ["Sulawesi", [
       "Central Sulawesi","Gorontalo","North Sulawesi",
       "South Sulawesi","Southeast Sulawesi","West Sulawesi"
     ]],
     ["Sumatra", [
       "Aceh","Bangka-Belitung","Bengkulu",
       "Jambi","Lampung","North Sumatra",
       "Riau","Riau Islands","South Sumatra",
       "West Sumatra"
     ]],
     ["Thailand", [
       "Amnat Charoen","Ang Thong","Bangkok Metropolis","Bueng Kan",
       "Buri Ram","Chachoengsao","Chai Nat","Chaiyaphum",
       "Chanthaburi","Chiang Mai","Chiang Rai","Chon Buri",
       "Chumphon","Kalasin","Kamphaeng Phet","Kanchanaburi",
       "Khon Kaen","Krabi","Lampang","Lamphun",
       "Loei","Lop Buri","Mae Hong Son","Maha Sarakham",
       "Mukdahan","Nakhon Nayok","Nakhon Pathom","Nakhon Phanom",
       "Nakhon Ratchasima","Nakhon Sawan","Nakhon Si Thammarat","Nan",
       "Narathiwat","Nong Bua Lam Phu","Nong Khai","Nonthaburi",
       "Pathum Thani","Pattani","Phangnga","Phatthalung",
       "Phayao","Phetchabun","Phetchaburi","Phichit",
       "Phitsanulok","Phra Nakhon Si Ayutthaya","Phrae","Phuket",
       "Prachin Buri","Prachuap Khiri Khan","Ranong","Ratchaburi",
       "Rayong","Roi Et","Sa Kaeo","Sakon Nakhon",
       "Samut Prakan","Samut Sakhon","Samut Songkhram","Saraburi",
       "Satun","Si Sa Ket","Sing Buri","Songkhla",
       "Sukhothai","Suphan Buri","Surat Thani","Surin",
       "Tak","Trang","Trat","Ubon Ratchathani",
       "Udon Thani","Uthai Thani","Uttaradit","Yala",
       "Yasothon"
     ]],
     /* v85 (8.18.26): THE BRAZIL/MEXICO STATES — 59 level-4 units,
        generated from brazil-mexico-l4-table.json (one owner; the
        memberships are hd-batch-spec's own AUTHORED unions). Four
        tags carry qualifiers against fold-collisions and must stay
        exactly as written: Amazonas (Brazil), Distrito Federal
        (Brazil), Mexico City (the NE vintage's Distrito Federal),
        and México State (bare México folds equal to the country
        shape Mexico). Shapes, climate and geo-hierarchy for all 59
        shipped 8.18.26 (S3); these rows are what lets a state tag
        suppress its parent unit and lets ADDITIONAL DISTRIBUTION
        promote these names. */
     ["Brazil North", [
       "Acre","Amapá","Amazonas (Brazil)","Pará",
       "Rondônia","Roraima","Tocantins"
     ]],
     ["Brazil Northeast", [
       "Alagoas","Bahia","Ceará","Maranhão",
       "Paraíba","Pernambuco","Piauí","Rio Grande do Norte",
       "Sergipe"
     ]],
     ["Brazil Southeast", [
       "Espírito Santo","Minas Gerais","Rio de Janeiro","São Paulo"
     ]],
     ["Brazil South", [
       "Paraná","Rio Grande do Sul","Santa Catarina"
     ]],
     ["Brazil West-Central", [
       "Distrito Federal (Brazil)","Goiás","Mato Grosso","Mato Grosso do Sul"
     ]],
     ["Mexico Northwest", [
       "Baja California","Baja California Sur","Sinaloa","Sonora"
     ]],
     ["Mexico Northeast", [
       "Aguascalientes","Chihuahua","Coahuila","Durango",
       "Nuevo León","San Luis Potosí","Tamaulipas","Zacatecas"
     ]],
     ["Mexico Central", [
       "Mexico City","Guanajuato","Hidalgo","México State",
       "Morelos","Puebla","Querétaro","Tlaxcala"
     ]],
     ["Mexico Gulf", [
       "Veracruz","Tabasco"
     ]],
     ["Mexico Southwest", [
       "Colima","Guerrero","Jalisco","Michoacán",
       "Nayarit","Oaxaca"
     ]],
     ["Mexico Southeast", [
       "Campeche","Chiapas","Quintana Roo","Yucatán"
     ]]
    ].forEach(function(pair){
      pair[1].forEach(function(child){
        (SUBPARENT[child] = SUBPARENT[child] || []).push(pair[0]);
      });
    });
    /* TRANSITIVE: Bali suppresses Lesser Sunda Islands, which in turn
       suppresses Indonesia. Walk every ancestor, guarded against a
       cycle by the seen-set. */
    var suppress = {};
    hits.concat(unmapped).forEach(function(n){
      var stack = (SUBPARENT[n] || []).slice(), guard = 0;
      while (stack.length && guard++ < 50){
        var up = stack.pop();
        if (suppress[up]) continue;
        suppress[up] = 1;
        (SUBPARENT[up] || []).forEach(function(x){ stack.push(x); });
      }
    });
    /* v66: a suppressed parent is no longer THROWN AWAY, it is demoted
       to CONTEXT. User 8.16.26: "I don't think everyone instinctively
       knows Kanchanaburi is Thailand." The parent still never paints
       over its subunit and still never feeds the climate envelope, but
       it keeps its pill and takes a faint wash on the map. Only places
       the post ITSELF tagged can appear here - nothing is invented. */
    var parents = [];
    if (Object.keys(suppress).length){
      hits.concat(unmapped).forEach(function(n){
        if (suppress[n] && parents.indexOf(n) < 0) parents.push(n);
      });
      hits = hits.filter(function(n){ return !suppress[n]; });
      unmapped = unmapped.filter(function(n){ return !suppress[n]; });
      Object.keys(suppress).forEach(function(p){
        delete doubtful[p]; delete doubtfulTag[p];
      });
    }
    /* Which parents take the wash: the FEWEST tagged ancestors that
       cover every lit place - most-covering first, smallest area as the
       tie-break. Never every ancestor: two translucent fills over the
       same ground stack into a third tone.
       ⚠ "the smallest ancestor of each lit place" was the first rule and
       it was WRONG, which only showed up against a live post. A. sarawakensis
       (Sarawak, Sabah, Kalimantan) washed Borneo AND Malaysia, because
       the feed's areas make Malaysia (27) smaller than Borneo (58) - so
       it washed the Malay peninsula, 1,600 km from any record, as
       "context". Coverage-first fixes it: Borneo covers all three lit
       places, so Borneo alone. Kalimantan on its own still resolves to
       Borneo over Indonesia (58 < 140), the example the user asked for. */
    var areas = (data && data.area) || {};
    var ancOf = {};
    hits.forEach(function(h){
      var list = [], stack = (SUBPARENT[h] || []).slice(), guard = 0, seen = {};
      while (stack.length && guard++ < 50){
        var up = stack.pop();
        if (seen[up]) continue;
        seen[up] = 1;
        if (parents.indexOf(up) >= 0 && known[up] && list.indexOf(up) < 0) list.push(up);
        (SUBPARENT[up] || []).forEach(function(x){ stack.push(x); });
      }
      ancOf[h] = list;
    });
    /* v67: broadest container first, so the row reads outside-in -
       "Indonesia · Sumatra · West Sumatra". The country is the pill the
       user asked to lead with; area order gets it there without the
       card having to know what a country is. */
    parents.sort(function(a, b){ return (areas[b] || 0) - (areas[a] || 0); });
    /* v69: A COUNTRY IS THE LAST CHOICE FOR THE WASH (user 8.16.26,
       on A. chaii: "the lowest geo unit light up strongest (Sarawak),
       then Borneo being the next unit light up more, ignoring Malaysia
       and Indonesia as countries and just showing them as pills").
       Sarawak sits in BOTH Borneo and Malaysia, and area alone picked
       Malaysia (27 < 58) - which washed the Malay peninsula 1,600 km
       away instead of the island the plant is actually on. The island
       is the better answer every time: it is what the reader needs to
       place the record, while the country is already spelled out in
       the pill. Countries still win when nothing else contains the
       record (A. gigas: Sumatra's only container IS Indonesia, and
       without that wash the card is back to naming a place with no
       context - the complaint that started all of this).
       The list is every SUBPARENT parent that places.json calls a
       country; the other 22 parents are islands, provinces and WGSRPD
       regions. */
    var COUNTRY_PARENT = {};
    ["Australia","Benin","Bolivia","China","Colombia","Costa Rica","Ecuador",
     "Ethiopia","India","Indonesia","Laos","Malaysia","Myanmar","Nigeria",
     "Panama","Papua New Guinea","Peru","Philippines","Thailand",
     "Venezuela","Vietnam"].forEach(function(c){ COUNTRY_PARENT[c] = 1; });

    var wash = [], need = hits.filter(function(h){ return ancOf[h].length; });
    while (need.length){
      var counts = {};
      need.forEach(function(h){
        ancOf[h].forEach(function(a){ counts[a] = (counts[a] || 0) + 1; });
      });
      var best = null;
      Object.keys(counts).forEach(function(a){
        if (best === null){ best = a; return; }
        var ca = COUNTRY_PARENT[a] ? 1 : 0, cb = COUNTRY_PARENT[best] ? 1 : 0;
        if (ca !== cb){ if (ca < cb) best = a; return; }   /* island beats country */
        if (counts[a] !== counts[best]){ if (counts[a] > counts[best]) best = a; return; }
        if ((areas[a] || 0) < (areas[best] || 0)) best = a;
      });
      if (best === null) break;
      wash.push(best);
      need = need.filter(function(h){ return ancOf[h].indexOf(best) < 0; });
    }
    /* v88: SUBPARENT rides out with the rest. buildMap is a SIBLING of
       this function, not nested in it, so it cannot reach the table
       directly - it needs to know which shapes are subunits so it can
       leave the irrelevant ones undrawn. */
    /* ── v93: THE WASH COMES FROM THE PUBLISHED PLACE TREE ──────────
       Everything above computes the wash from TAGS: only a tagged
       ancestor could be washed, then an area sort and a hand-kept
       21-name COUNTRY_PARENT list pushed countries down the list.
       That produced an asymmetry on Alocasia puber - Peninsular
       Malaysia is tagged so it washed, Sumatra is NOT tagged so the
       wash climbed to the whole of Indonesia and shaded Borneo,
       Sulawesi and Papua as 'context' for a Sumatran record.

       geo-hierarchy.json already publishes the real tree, and the
       journal map already groups by it: South Sumatra -> Sumatra,
       Perak -> Peninsular Malaysia, Benguet -> Luzon -> Philippines.
       Walking it needs no area heuristic and no country list - the
       case that killed the old rule (A. sarawakensis washing Malaysia
       because the feed made it 'smaller' than Borneo) cannot arise,
       since Sarawak, Sabah and Kalimantan all parent to Borneo.

       A country still wins when nothing else contains the record
       (A. gigas: Sumatra is level 3 with no parent, so it falls back
       to its country) - the v69 behaviour, kept.

       ⚠ THE WASH NO LONGER IMPLIES A PILL. It is context only, so an
       untagged container can shade without the card claiming a record
       the post never made. Pills stay tag-driven - see below. */
    var HIER = (data && data.hier && data.hier.places) || {};
    if (Object.keys(HIER).length){
      var isLit = {};
      hits.forEach(function(h){ isLit[h] = 1; });
      /* v94: A DOUBTFUL RECORD EARNS NO WASH EITHER (reader ruling
         8.19.26). v93 stopped a doubtful subunit OPENING its container;
         this stops it SHADING one. 'South Sumatra ?' should leave
         Sumatra unlit entirely - a hatched province is the whole claim,
         and washing the island around it reads as confidence the record
         does not have.
         ⚠ Fallback: if EVERY record is doubtful the wash would be empty
         and a hatched shape would float with no context at all, which
         is the complaint that created the wash. In that one case the
         doubtful records are allowed to supply it. */
      var wash2 = {};
      var firm = hits.filter(function(h){ return !doubtful[h]; });
      var washFrom = firm.length ? firm : hits;
      washFrom.forEach(function(h){
        var cur = h, seen = {}, guard = 0, found = null;
        while (guard++ < 20){
          var rec = HIER[cur]; if (!rec) break;
          var up = rec.parent;
          if (!up || seen[up]) break;
          seen[up] = 1;
          if (known[up] && !isLit[up]){ found = up; break; }
          cur = up;
        }
        if (!found){
          var c = (HIER[h] || {}).country;
          if (c && known[c] && !isLit[c]) found = c;
        }
        if (found) wash2[found] = 1;
      });
      wash = Object.keys(wash2);
    }
    /* ── v93: THE COUNTRY PILL, WHEN NO TAG SUPPLIES ONE ────────────
       Reader ruling 8.19.26: pills stay tag-driven EXCEPT that the
       country must always be present - tag only West Java and the row
       should still say Indonesia. Derived from the tree's `country`,
       never invented, and only added when no tag already supplies it. */
    var autoCountries = [];
    if (Object.keys(HIER).length){
      var already = {};
      hits.concat(unmapped, parents, continents).forEach(function(t){ already[t] = 1; });
      hits.forEach(function(h){
        var c = (HIER[h] || {}).country;
        if (c && !already[c] && autoCountries.indexOf(c) < 0) autoCountries.push(c);
      });
    }
    return { hits:hits, continents:continents, unmapped:unmapped,
             doubtful:doubtful, doubtfulTag:doubtfulTag,
             parents:parents, wash:wash, subparent:SUBPARENT,
             autoCountries:autoCountries };
  }

  var apscHatchSeq = 0;
  function buildMap(data, hits, doubtful, wash, subparent){
    if (!data || !hits.length) return null;
    doubtful = doubtful || {};
    subparent = subparent || {};
    /* read off the feed, deliberately NOT a card-side table: the
       subunit table is already duplicated builder- and card-side and
       that has cost a silent empty-geography render before. */
    var PARENT = (data && data.parent) || {};
    /* v66: the context wash - the tagged parent of a lit subunit, drawn
       faintly so the subunit reads as part of somewhere. Class is
       apsc-ctx and NOT apsc-on--context on purpose: the hover test is
       /\bapsc-on\b/, and "-" is a non-word character, so an
       apsc-on--context path would have claimed "recorded here". */
    var ctxSet = {};
    (wash || []).forEach(function(n){ if (!doubtful[n]) ctxSet[n] = 1; });

    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    var full = data.viewBox.slice();
    var onSet = {}; hits.forEach(function(h){ onSet[h]=1; });

    /* DOUBTFUL RANGE v1: one hatch pattern per map instance (a cloned
       or second map must not collide on the id). Inline style fill on
       the path is what applies it - a class alone loses to the
       .apsc-on fill in the stylesheet. */
    var hatchId = "apscHatch" + (++apscHatchSeq);
    var defs = document.createElementNS(NS, "defs");
    var pat = document.createElementNS(NS, "pattern");
    pat.setAttribute("id", hatchId);
    pat.setAttribute("patternUnits", "userSpaceOnUse");
    pat.setAttribute("width", "2.4");
    pat.setAttribute("height", "2.4");
    pat.setAttribute("patternTransform", "rotate(45)");
    var pr = document.createElementNS(NS, "rect");
    pr.setAttribute("width", "2.4"); pr.setAttribute("height", "2.4");
    pr.setAttribute("fill", "rgba(175,192,144,.30)");
    var pl = document.createElementNS(NS, "line");
    pl.setAttribute("x1", "0"); pl.setAttribute("y1", "0");
    pl.setAttribute("x2", "0"); pl.setAttribute("y2", "2.4");
    pl.setAttribute("stroke", "#afc090");
    pl.setAttribute("stroke-width", "1.1");
    pl.setAttribute("stroke-opacity", ".85");
    /* v50: a dark companion stripe so the hatch also reads when the
       doubtful shape sits INSIDE a lit parent (Kalimantan? within lit
       Borneo — sage-on-sage was invisible). On dark ocean this line
       disappears, so the standalone doubtful look is unchanged. */
    var pd = document.createElementNS(NS, "line");
    pd.setAttribute("x1", "1.55"); pd.setAttribute("y1", "0");
    pd.setAttribute("x2", "1.55"); pd.setAttribute("y2", "2.4");
    pd.setAttribute("stroke", "#0b120d");
    pd.setAttribute("stroke-width", ".8");
    pd.setAttribute("stroke-opacity", ".8");
    pat.appendChild(pr); pat.appendChild(pl); pat.appendChild(pd);
    defs.appendChild(pat);
    svg.appendChild(defs);

    /* v92: WHICH CONTAINERS ARE OPEN.

       v90 opened a container when it was LIT OR WASHED. The wash is the
       smallest TAGGED ancestor, so that only worked when the container
       happened to be a tag on the post. Alocasia puber showed the hole:
       Peninsular Malaysia and Java are tagged, so their states came
       back, but SUMATRA IS NOT TAGGED - South Sumatra's smallest tagged
       ancestor is Indonesia - so Sumatra drew while its own provinces
       stayed hidden, and one lit province sat on a blank island beside
       two fully drawn ones.

       A container is open if it is the DIRECT PARENT OF A LIT SUBUNIT,
       whether or not anyone tagged it. The wash is still folded in, so
       an island keeps drawing inside a washed country.

       Deliberately ONE level, not a walk to the root: Indonesia is
       washed here, and opening every descendant of a wash would bring
       back Sulawesi's and Borneo's provinces too - the clutter this
       whole sequence removed. */
    var OPEN = {};
    Object.keys(ctxSet).forEach(function(c){ OPEN[c] = 1; });
    hits.forEach(function(h){
      /* v93: A DOUBTFUL RECORD DOES NOT OPEN ITS CONTAINER (reader
         ruling 8.19.26). 'South Sumatra ?' should not break Sumatra
         into its provinces - the hatching already says the record is
         uncertain, and subdividing the island around it would give a
         doubtful occurrence the same structural weight as a firm one.
         The container is still WASHED, so the reader still sees which
         island is meant; it simply is not opened up. */
      if (doubtful[h]) return;
      (subparent[h] || []).forEach(function(par){ OPEN[par] = 1; });
    });

    /* draw order matters: a contained region (Sarawak inside Borneo)
       has to come after its container or it is painted over. */
    var order = data.order && data.order.length ? data.order : Object.keys(data.shapes);
    order.forEach(function(name){
      var d = data.shapes[name];
      if (!d) return;
      /* v88: an unlit SUBUNIT is not drawn at all. .apsc-base carries a
         stroke, so painting all 710 shapes outlined every province of
         every level-4 country on every map - a Kaduna species arrived
         with Thailand, India and the Philippines fully subdivided for
         no reason. Countries are unaffected; a lit subunit and the
         context wash both still draw. Guarded with a default {} so an
         older caller that omits the argument keeps the old behaviour
         rather than throwing. */
      /* v90: SIBLINGS OF A LIT SUBUNIT STILL DRAW. Hiding every unlit
         subunit threw away the internal structure of the one place the
         reader is looking at: Alocasia micholitziana lit Benguet,
         Laguna, Rizal and Ifugao inside a washed Luzon, and the rest of
         Luzon vanished, so the lit provinces floated on a blank island.
         A subunit whose PARENT is lit or washed is kept and drawn as
         ordinary base ground; a subunit whose parent is neither is still
         dropped. Because the wash is the SMALLEST tagged ancestor, this
         stays local - Luzon's provinces come back, Mindanao's do not. */
      if (subparent[name] && !onSet[name] && !ctxSet[name]){
        /* the test is on the PARENT being open, not on this shape */
        var ps = subparent[name], open = false;
        for (var pi = 0; pi < ps.length; pi++){
          if (OPEN[ps[pi]]){ open = true; break; }
        }
        if (!open) return;
      }
      /* v89: THE BACKDROP LAYER. Same idea one level up. WGSRPD has no
         level-3 unit for the USA, Canada or Russia - their level-3 units
         ARE the subdivisions - so an unrelated species drew 52 unlit US
         state outlines and no country at all, while Brazil, Mexico,
         China, Australia and Argentina drew regional pieces over a
         whole-country shape that was already there. shapes-hd 8.19.26
         publishes `parent` (piece -> country); the country draws as
         ordinary ground and an UNLIT piece does not draw at all. A lit
         piece and the context wash are untouched, so Texas still lights
         when a species is tagged to it. */
      if (PARENT[name] && !onSet[name] && !ctxSet[name]) return;
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      p.setAttribute("class", onSet[name]
        ? (doubtful[name] ? "apsc-on apsc-on--doubtful" : "apsc-on")
        : (ctxSet[name] ? "apsc-ctx" : "apsc-base"));
      if (onSet[name] && doubtful[name]) p.style.fill = "url(#" + hatchId + ")";
      var ttl = document.createElementNS(NS, "title");
      ttl.textContent = name;
      p.appendChild(ttl);
      svg.appendChild(p);
    });
    /* point localities (Himalaya today) that have no polygon */
    hits.forEach(function(name){
      var dot = data.dots && data.dots[name];
      if (!dot) return;
      var c = document.createElementNS(NS,"circle");
      c.setAttribute("cx", dot[0]); c.setAttribute("cy", -dot[1]); c.setAttribute("r", 1.4);
      c.setAttribute("class", doubtful[name] ? "apsc-dot apsc-dot--doubtful" : "apsc-dot");
      svg.appendChild(c);
    });

    /* frame on the highlighted regions - AND on the context wash, which
       is the whole point of it: framing Kanchanaburi alone would show a
       lit province against nothing, and the reader still would not know
       it is Thailand. Because the wash is the SMALLEST tagged ancestor,
       this widens to the island or the country, never to a continent. */
    var bb = null;
    hits.concat(Object.keys(ctxSet)).forEach(function(name){
      var d = data.shapes[name]; if (!d) return;
      var b = bboxOfPath(d); if (!b) return;
      bb = bb ? [Math.min(bb[0],b[0]),Math.min(bb[1],b[1]),Math.max(bb[2],b[2]),Math.max(bb[3],b[3])] : b;
    });
    var zoom = full;
    if (bb){
      /* Frame on the highlighted regions, padded for context. The
         proportions follow the range rather than a fixed landscape box:
         a Philodendron running Costa Rica → Peru is far taller than it
         is wide, and forcing that into a 1.55 letterbox spends half the
         frame on empty Pacific. Clamped at both ends so the rail never
         gets a sliver or a tower. */
      var w = bb[2]-bb[0], h = bb[3]-bb[1];
      var pad = Math.max(w,h) * CFG.MAP_PAD;
      w += pad*2; h += pad*2;

      var aspect = Math.min(Math.max(w/h, CFG.MAP_MIN_ASPECT), CFG.MAP_MAX_ASPECT);
      if (w/h < aspect) w = h * aspect; else h = w / aspect;

      if (w < CFG.MAP_MIN_DEG){ h *= CFG.MAP_MIN_DEG / w; w = CFG.MAP_MIN_DEG; }

      var cx = (bb[0]+bb[2])/2, cy = (bb[1]+bb[3])/2;
      zoom = [cx - w/2, cy - h/2, w, h];
    }
    svg.setAttribute("viewBox", zoom.join(" "));
    svg.setAttribute("preserveAspectRatio","xMidYMid meet");
    svg.setAttribute("role","img");
    svg.setAttribute("aria-label","Distribution: " + hits.join(", "));

    var wrap = el("div","apsc-map");
    wrap.appendChild(svg);

    /* name-on-hover, for every shape on the map and not just the lit
       ones — see the note in the CSS */
    var readout = el("div","apsc-map__hover");
    readout.setAttribute("aria-hidden","true");
    wrap.appendChild(readout);
    function nameAt(t){
      var p = t && t.closest ? t.closest("path") : null;
      if (!p) return null;
      var ttl = p.querySelector("title");
      return ttl ? ttl.textContent : null;
    }
    function show(name, lit, doubt){
      if (!name){ readout.removeAttribute("data-on"); readout.innerHTML = ""; return; }
      readout.innerHTML = esc(name) +
        (lit ? (doubt ? "<em>reported &mdash; doubtful</em>" : "<em>recorded here</em>") : "");
      readout.setAttribute("data-on","1");
    }
    svg.addEventListener("mouseover", function(e){
      var p = e.target.closest ? e.target.closest("path") : null;
      var cls = p ? (p.getAttribute("class") || "") : "";
      show(nameAt(e.target), /\bapsc-on\b/.test(cls), /apsc-on--doubtful/.test(cls));
    });
    svg.addEventListener("mouseleave", function(){ show(null); });
    /* touch: a tap names the region instead of doing nothing */
    svg.addEventListener("click", function(e){
      var p = e.target.closest ? e.target.closest("path") : null;
      var cls = p ? (p.getAttribute("class") || "") : "";
      show(nameAt(e.target), /\bapsc-on\b/.test(cls), /apsc-on--doubtful/.test(cls));
    });

    var worldBtn = null;
    if (bb){
      /* v88: CUR is the live viewBox. World/Close-in still jumps between
         the framed range and the whole world - that snapshot is the
         point of the pill and the user asked for it to stay - while
         + / - step around the CENTRE of whatever is on screen. */
      var CUR = zoom.slice();
      var MINW = Math.min(zoom[2], full[2]) / 40;   /* stop at ~40x in */
      function setVB(){ svg.setAttribute("viewBox", CUR.join(" ")); syncBtns(); }
      /* v93: zoom about an arbitrary point, so the wheel keeps whatever is
         under the cursor under the cursor. The buttons pass the centre and
         so behave exactly as before. */
      function zoomAt(px, py, f){
        var w = CUR[2] / f, h = CUR[3] / f;
        if (w > full[2]){ var k = full[2] / w; w *= k; h *= k; }
        if (w < MINW){ var k2 = MINW / w; w *= k2; h *= k2; }
        var fx = CUR[2] ? (px - CUR[0]) / CUR[2] : 0.5;
        var fy = CUR[3] ? (py - CUR[1]) / CUR[3] : 0.5;
        CUR = [px - w * fx, py - h * fy, w, h];
        setVB();
      }
      function zoomBy(f){ zoomAt(CUR[0] + CUR[2] / 2, CUR[1] + CUR[3] / 2, f); }
      function userPoint(cx, cy){
        var m = svg.getScreenCTM && svg.getScreenCTM();
        if (!m) return null;
        try {
          var pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy;
          var u = pt.matrixTransform(m.inverse());
          return { x: u.x, y: u.y };
        } catch (e){ return null; }
      }
      /* WHEEL ZOOMS ON THE CURSOR (reader request 8.19.26).
         ⚠ This preventDefaults, so the wheel no longer scrolls the article
         while the pointer is over the map - the trade the request makes.
         The genus map gates the same handler on ctrlKey, which is the
         one-line change if it proves annoying on a long page. Touch is
         untouched: pinch-zoom and page scroll on a phone still work. */
      svg.addEventListener("wheel", function(ev){
        ev.preventDefault();
        var dy = ev.deltaY * (ev.deltaMode === 1 ? 16 : 1);
        var pt = userPoint(ev.clientX, ev.clientY);
        if (pt) zoomAt(pt.x, pt.y, Math.exp(-dy * 0.0016));
      }, { passive: false });
      /* DRAG TO PAN. ⚠ pointer capture is taken on the FIRST REAL MOVE and
         never on pointerdown: a captured pointer retargets the derived
         click to the svg, which would break the per-shape hover readout.
         Mouse only - a touch drag must keep scrolling the page. */
      var pan = null;
      svg.addEventListener("pointerdown", function(ev){
        if (ev.button !== 0 || ev.pointerType !== "mouse") return;
        pan = { x: ev.clientX, y: ev.clientY, vx: CUR[0], vy: CUR[1],
                a: (svg.getScreenCTM() || { a: 1 }).a, captured: false };
        svg.classList.add("apsc-map--panning");
      });
      svg.addEventListener("pointermove", function(ev){
        if (!pan) return;
        if (!pan.captured &&
            Math.abs(ev.clientX - pan.x) + Math.abs(ev.clientY - pan.y) > 4 &&
            svg.setPointerCapture){
          try { svg.setPointerCapture(ev.pointerId); pan.captured = true; } catch (e) {}
        }
        if (!pan.a) return;
        CUR[0] = pan.vx - (ev.clientX - pan.x) / pan.a;
        CUR[1] = pan.vy - (ev.clientY - pan.y) / pan.a;
        setVB();
      });
      function endPan(ev){
        if (!pan) return;
        if (pan.captured && svg.releasePointerCapture && ev && ev.pointerId != null){
          try { svg.releasePointerCapture(ev.pointerId); } catch (e) {}
        }
        pan = null;
        svg.classList.remove("apsc-map--panning");
      }
      svg.addEventListener("pointerup", endPan);
      svg.addEventListener("pointercancel", endPan);
      svg.addEventListener("pointerleave", endPan);
      var zoomUI = el("div", "apsc-map__zoomui");
      var outBtn = el("button", "apsc-map__step", "\u2212");
      var inBtn  = el("button", "apsc-map__step", "+");
      outBtn.type = inBtn.type = "button";
      outBtn.setAttribute("aria-label", "Zoom out");
      inBtn.setAttribute("aria-label", "Zoom in");
      outBtn.addEventListener("click", function(){ zoomBy(1 / 1.4); });
      inBtn.addEventListener("click", function(){ zoomBy(1.4); });
      worldBtn = el("button","apsc-map__zoom","World");
      worldBtn.type = "button";
      var wide = false;
      worldBtn.addEventListener("click", function(){
        wide = !wide;
        CUR = (wide ? full : zoom).slice();
        worldBtn.textContent = wide ? "Close in" : "World";
        setVB();
      });
      function syncBtns(){
        outBtn.disabled = CUR[2] >= full[2] - 1e-6;
        inBtn.disabled  = CUR[2] <= MINW + 1e-6;
      }
      zoomUI.appendChild(outBtn);
      zoomUI.appendChild(inBtn);
      zoomUI.appendChild(worldBtn);
      wrap.appendChild(zoomUI);
      syncBtns();
    }

    /* NO "PUBLISHED MAP" TOGGLE (removed v6).
       Earlier versions kept a hand-drawn range image from the
       DISTRIBUTION section as a second view behind a button. That
       image is being retired now the map is drawn from the tags, and a
       toggle offering a view that will not exist on new entries is
       worse than no toggle. Posts that still carry one lose nothing:
       the image is no longer special-cased, so it falls through to
       MORE PHOTOS with every other picture on the page. */
    return wrap;
  }

  /* ================================================================
     RENDER
     ================================================================ */
  function nodesToProse(nodes){
    var box = el("div","apsc-prose");
    nodes.forEach(function(n){
      /* Squarespace's inline styles (margin-left indents, white-space)
         belong to the page layout, not to the card's. */
      n.removeAttribute && n.removeAttribute("style");
      [].slice.call(n.querySelectorAll ? n.querySelectorAll("[style]") : []).forEach(function(c){
        c.removeAttribute("style");
      });
      [].slice.call(n.querySelectorAll ? n.querySelectorAll(".preFade") : []).forEach(function(c){
        c.classList.remove("preFade");
      });
      if (n.classList) n.classList.remove("preFade");
      markSubhead(n);
      box.appendChild(n);
    });
    expandGenus(box, CURRENT_GENUS);
    finishBinomials(box);
    return box;
  }

  /* v31 (card): scrub a node cloned straight out of a Squarespace
     block before appending it to the card. Squarespace's animation
     system leaves `preFade` (opacity 0) and inline transition styles
     on block content; its fade-in never reaches a clone, so an
     unscrubbed clone renders INVISIBLE while still contributing
     innerText — the dunnii synonyms bug. nodesToProse has always done
     this for prose; every direct-append path must use this. */
  function scrub(node){
    if (node.removeAttribute) node.removeAttribute("style");
    if (node.classList) node.classList.remove("preFade");
    [].slice.call(node.querySelectorAll ? node.querySelectorAll("[style], .preFade") : []).forEach(function(c){
      c.removeAttribute("style");
      c.classList.remove("preFade");
    });
    return node;
  }

  /* v79: is this code block CONTENT or an injection? Returns a scrubbed
     clone of its contents when something visible survives the removal of
     <style>/<script>/<link>, else null.
     ⚠ The <style> ELEMENT is kept in the returned clone - the commutatus
     key is a CSS grid and loses its whole layout without it. scrub()
     only strips style ATTRIBUTES, which is the right half to lose: the
     pasted tables carry `style="font-size:14px"` and friends, and the
     card sets its own type. */
  function codePayload(b){
    var host = b.querySelector(".sqs-code-container") ||
               b.querySelector(".sqs-block-content");
    if (!host || host.querySelector("script")) return null;
    var probe = host.cloneNode(true);
    [].slice.call(probe.querySelectorAll("style, script, link")).forEach(function(n){
      if (n.parentNode) n.parentNode.removeChild(n);
    });
    if (!squash(probe.textContent)) return null;
    var out = scrub(host.cloneNode(true));
    /* ⚠ scrub() takes the style ATTRIBUTES; these tables also carry the
       1990s presentational ones - border="1" cellpadding="6" width="100%"
       - which survive a style scrub and draw a full cell grid over a card
       that rules its own tables with a single hairline. Same bargain as
       the inline styles: the card shows the words, not the container they
       were typed into. */
    [].slice.call(out.querySelectorAll("table, th, td, tr, thead, tbody")).forEach(function(n){
      ["border","cellpadding","cellspacing","width","height","align","valign",
       "bgcolor","frame","rules"].forEach(function(a){ n.removeAttribute(a); });
    });
    return out;
  }

  /* v31: NOTES as a numbered list. Takes the section's nodes, runs them
     through nodesToProse (genus expansion, binomial italics, style
     stripping), then — only when the first line starts "1." — rebuilds
     the paragraph run as an <ol> inside the same .apsc-prose box:
     "N." opens item N (the typed number is kept via the value
     attribute), an unnumbered paragraph continues the item above it.
     Returns null when the section does not open with "1.", and the
     caller falls through to the ordinary prose path. */
  /* v79: AND A LETTERED ONE. Amorphophallus commutatus' NOTES are the
     three accepted varieties, typed "A." "B." "C.", each followed by six
     or seven continuation paragraphs (Type:, Tubers, Spathe, Phenology,
     Specimens examined:, Distribution:). Numbers were the only opening
     recognised, so all 23 paragraphs fell through to the ordinary prose
     path and rendered as one undifferentiated column — the user's "huge
     wall of text". The grouping machinery was already right; only the
     regex was numeric.

     ⚠⚠ A LETTER IS NOT AS SAFE A SIGNAL AS A DIGIT. "A. Galloway" is an
     INITIAL, and Alan Galloway is cited across this archive — a bare
     /^[A-Z][.)]/ would turn his name into list item 1 and swallow every
     paragraph after it as a continuation. So a lettered list must also
     show a later paragraph opening "B." before the run is rebuilt.
     Checked against all 440 posts: exactly one NOTES opens with a
     letter, and it is this one. */
  function notesList(nodes){
    var box = nodesToProse(nodes.map(function(n){ return n.cloneNode(true); }));
    var kids = [].slice.call(box.children);
    if (!kids.length) return null;
    var head = squash(txt(kids[0]));
    var alpha = /^A[.)]\s/.test(head) && kids.some(function(k){
      return /^B[.)]\s/.test(squash(txt(k)));
    });
    if (!alpha && !/^1[.)]\s/.test(head)) return null;
    var ITEM = alpha ? /^([A-Z])[.)]\s+/ : /^(\d+)[.)]\s+/;
    var ol = el("ol","apsc-notes");
    /* type="A" so the marker is the letter the author typed; `value` is
       still a NUMBER, because that is what an <ol> counts in — A is 1.
       Deriving it from the letter rather than counting items keeps the
       v31 promise that a skipped label survives. */
    if (alpha) ol.setAttribute("type","A");
    var li = null;
    kids.forEach(function(k){
      var m = ITEM.exec(squash(txt(k)));
      if (m){
        li = el("li");
        li.setAttribute("value", alpha ? String(m[1].charCodeAt(0) - 64) : m[1]);
        stripChars(k, m[0].length);
        li.appendChild(k);
        ol.appendChild(li);
      } else if (li){
        li.appendChild(k);
      }
    });
    if (!ol.children.length) return null;
    box.appendChild(ol);        /* kids were moved out; box is the shell */
    return box;
  }

  /* Long prose gets a collapse control and starts OPEN. Collapsing by
     default would hide the thing the reader came for behind a click;
     the control is for putting a long Notes block away once you have
     read it, which is a different job. */
  /* A paragraph whose WHOLE content is bold, and short, and does not
     end like a sentence, is a heading someone typed as bold text. The
     three conditions together matter: "N/A" is short and bold but gets
     collapsed long before this; a bold lead-in clause ends in a full
     stop and stays prose. The <strong> is unwrapped so it does not
     fight the weight the sub-head style already sets. */
  function markSubhead(node){
    if (!node || node.tagName !== "P") return node;
    var t = squash(node.textContent);
    if (!t || t.length > 70 || /[.!?;:]$/.test(t)) return node;
    var kids = [].slice.call(node.childNodes).filter(function(n){
      return n.nodeType !== 3 || squash(n.nodeValue);
    });
    if (kids.length !== 1) return node;
    var only = kids[0];
    if (only.nodeType !== 1 || !/^(STRONG|B)$/.test(only.tagName)) return node;
    if (squash(only.textContent) !== t) return node;
    node.classList.add("apsc-subhead");
    while (only.firstChild) node.insertBefore(only.firstChild, only);
    node.removeChild(only);
    return node;
  }

  function foldable(prose){
    var chars = squash(prose.textContent).length;
    if (chars <= CFG.FOLD_AT) return prose;
    var wrap = el("div","apsc-fold");
    wrap.setAttribute("data-folded","0");
    wrap.appendChild(prose);
    /* Plain labels. "Read all 1,903 characters" was a machine talking
       about its own measurement, not a person offering to show you the
       rest of a paragraph. */
    var open = "Collapse";
    var shut = "Expand";
    var b = el("button","apsc-more", open);
    b.type = "button";
    b.addEventListener("click", function(){
      var folded = wrap.getAttribute("data-folded") === "1";
      wrap.setAttribute("data-folded", folded ? "0" : "1");
      b.textContent = folded ? open : shut;
      if (!folded) wrap.scrollIntoView({ block:"nearest" });
    });
    wrap.appendChild(b);
    return wrap;
  }

  /* ================================================================
     CULTIVARS AND HYBRIDS AS A SORTED LIST
     Two or more names is a list and gets rendered as one, alphabetical,
     however the post happened to write it — some say
     "CULTIVARS: Alocasia princeps 'Candy Sticks', Alocasia princeps
     'Purple Cloak'" on the heading line, others already use <li>s.

     Splitting is done over CHILD NODES, not over a string, because the
     names carry links and italics that a text split would flatten. And
     it only splits on commas at PAREN DEPTH ZERO: "Alocasia 'Sumo'
     (Alocasia 'Portora' x Alocasia princeps)" is one name, and a
     comma inside those brackets is not a separator.
     ================================================================ */
  /* A NAME, NOT A SENTENCE.
     The first version tested only for length and a missing full stop,
     and Alocasia longiloba broke it: its CULTIVARS paragraph is prose
     — "As detailed in the Notes section above, the Longiloba group is
     most varied, and only a few named cultivars are recognized: …" —
     which splits on its commas into fragments that are all short and
     all lack a full stop, so every one of them passed and the prose
     was rendered as a bullet list.

     Two conditions fixed it, and both are load-bearing: an item must
     START with a capital, and it must NAME THE GENUS. Prose fragments
     begin "the …" and "and only …" and mention no genus; a real entry
     is always "Alocasia something". */
  function looksLikeName(s, genus){
    s = squash(s);
    if (!s || s.length > 140) return false;
    if (/\.\s/.test(s) || /[.;:]$/.test(s)) return false;
    if (!/^[A-ZÀ-Þ‘'"]/.test(s)) return false;
    if (genus && s.toLowerCase().indexOf(genus.toLowerCase()) < 0) return false;
    return true;
  }

  /* Split a value into items on its separating commas.
     Works over nodes rather than a string so the links and italics on
     each name survive — and it has to look INSIDE inline wrappers,
     because the markup here is
        <a><em>Name one</em></a><em>, </em><a><em>Name two</em></a>
     and the separating comma is a child of that middle <em>, not a
     top-level text node. An element whose whole content is punctuation
     is treated as a separator; anything else is part of the name.

     Commas inside brackets are not separators: "Alocasia 'Sumo'
     (Alocasia 'Portora' x Alocasia princeps)" is one item. */
  function splitOnCommas(node){
    var out = [], cur = document.createDocumentFragment(), depth = 0;
    function flush(){ out.push(cur); cur = document.createDocumentFragment(); }

    [].slice.call(node.childNodes).forEach(function(child){
      if (child.nodeType === 3){
        var text = child.nodeValue, buf = "";
        for (var i = 0; i < text.length; i++){
          var ch = text.charAt(i);
          if (ch === "(" || ch === "[") depth++;
          else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
          if (ch === "," && depth === 0){
            if (buf) cur.appendChild(document.createTextNode(buf));
            buf = ""; flush();
          } else buf += ch;
        }
        if (buf) cur.appendChild(document.createTextNode(buf));
        return;
      }
      var t = child.textContent || "";
      if (depth === 0 && /,/.test(t) && /^[\s,;·•]+$/.test(t)){ flush(); return; }
      /* keep bracket depth honest across element boundaries */
      for (var j = 0; j < t.length; j++){
        var c2 = t.charAt(j);
        if (c2 === "(" || c2 === "[") depth++;
        else if (c2 === ")" || c2 === "]") depth = Math.max(0, depth - 1);
      }
      cur.appendChild(child.cloneNode(true));
    });
    flush();
    return out.filter(function(f){ return squash(f.textContent); });
  }

  /* Returns a sorted <ul>, or null if this is prose rather than a list. */
  function nameList(nodes, genus){
    var items = [], prose = [];
    nodes.forEach(function(n){
      if (/^(OL|UL)$/.test(n.tagName)){
        [].slice.call(n.querySelectorAll(":scope > li")).forEach(function(li){ items.push(li); });
        return;
      }
      var parts = splitOnCommas(n);
      /* ONE NAME IS STILL A LIST (v6). A lone cultivar used to render
         as a bare line of prose while two rendered as bullets, so the
         same kind of fact looked like two different kinds of content
         depending on how many there happened to be. */
      if (parts.every(function(p){ return looksLikeName(p.textContent, genus); })){
        parts.forEach(function(p){ var li = el("li"); li.appendChild(p); items.push(li); });
      } else prose.push(n);
    });
    if (!items.length) return null;
    if (!items.every(function(li){ return looksLikeName(li.textContent, genus); })) return null;

    items.forEach(function(li){ expandGenus(li, genus); finishBinomials(li); });
    items.sort(function(a, b){
      return squash(a.textContent).localeCompare(squash(b.textContent), undefined,
                                                 { sensitivity:"base", numeric:true });
    });
    var ul = el("ul","apsc-names");
    items.forEach(function(li){ ul.appendChild(li); });
    return { list: ul, prose: prose };
  }

  function videoFig(v){
    var fig = el("figure","apsc-video");
    /* the aspect drives both the frame's height and the width cap —
       see --apsc-vid-cap in the CSS */
    fig.style.setProperty("--apsc-vr", v.ratio);
    var frame = el("div","apsc-video__frame");
    frame.innerHTML = v.html;
    var f = frame.querySelector("iframe");
    if (f){ f.setAttribute("loading","lazy"); f.removeAttribute("width"); f.removeAttribute("height"); }
    fig.appendChild(frame);
    if (v.title) fig.appendChild(el("figcaption", null, esc(v.title)));
    return fig;
  }

  /* Sections carry an id so the rail can scroll to them, and so a link
     to a specific section of an entry is possible at all. */
  /* `count` is passed by MORE PHOTOS only. A number beside DESCRIPTION
     or INFLORESCENCE was counting the photographs that happened to sit
     inside that section, which reads as a count of the section itself —
     "Inflorescence 3" looks like three inflorescences. */
  function section(label, contentNode, count){
    var s = el("section","apsc-sec");
    s.id = "apsc-" + String(label).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    var h = el("h2","apsc-sec__h");
    h.appendChild(document.createTextNode(label));
    if (count) h.appendChild(el("span","apsc-n", String(count)));
    s.appendChild(h);
    s.appendChild(contentNode);
    return s;
  }

  function photoStrip(images, lb){
    var g = el("div","apsc-strip");
    images.forEach(function(im, i){
      var b = el("button"); b.type = "button";
      b.setAttribute("aria-label","Open photo " + (i+1) + " of " + images.length);
      var img = el("img");
      img.src = sized(im.src, 400);
      img.alt = im.alt || "";
      img.loading = "lazy";
      img.decoding = "async";
      b.appendChild(img);
      /* v17: the caption was lightbox-only; its first line surfaces
         on hover/focus so the grid reads as documented specimens.
         Touch users still get the full caption in the lightbox. */
      if (im.cap){
        var cap = el("span","apsc-strip__cap", im.cap);
        cap.title = im.cap;
        b.appendChild(cap);
      }
      b.addEventListener("click", function(){ lb.open(images, i); });
      g.appendChild(b);
    });
    return g;
  }

  /* v47: a comparison plate - full reading width (the papers' ID
     tables are unreadable as strip tiles), clickable into the
     lightbox on the comparison set. */
  function cmpFig(im, list, lb){
    var f = el("figure","apsc-cmp");
    var b = el("button"); b.type = "button";
    b.setAttribute("aria-label", "Open comparison plate");
    var img = el("img");
    img.src = sized(im.src, 1100);
    img.alt = im.alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    b.appendChild(img);
    b.addEventListener("click", function(){ lb.open(list, list.indexOf(im)); });
    f.appendChild(b);
    if (im.cap) f.appendChild(el("figcaption","apsc-cmp__cap", im.cap));
    return f;
  }

  /* Widest the set will actually be drawn, so the stage can be sized
     once and the arrows stop shuffling in and out between photos.
     Worked out from Squarespace's declared pixel dimensions, scaled
     down by whatever the height cap imposes — a 288x640 portrait clip
     is height-limited long before it is width-limited, and sizing the
     stage to its 288px would leave a landscape shot in the same set
     nowhere to go. Falls back to the viewport when nothing declares a
     size. */
  function maxStageWidth(list){
    var capH = Math.min(window.innerHeight * 0.80, 900);
    var capW = Math.min(window.innerWidth * 0.92, 1100);
    var best = 0, known = 0;
    list.forEach(function(im){
      var m = /^(\d+)x(\d+)$/.exec(im.dim || "");
      if (!m) return;
      known++;
      var w = +m[1], h = +m[2];
      var scale = Math.min(1, capH / h, capW / w);
      best = Math.max(best, w * scale);
    });
    return known ? Math.round(best) : Math.round(capW);
  }

  function makeLightbox(){
    var root  = el("div","apsc-lb");
    var stage = el("div","apsc-lb__stage");
    var fig   = el("figure","apsc-lb__fig");
    var img   = el("img");
    var cap   = el("div","apsc-lb__cap");
    var hint  = el("div","apsc-lb__hint","Esc or click outside to close");

    var x = el("button","apsc-lb__x");
    x.type = "button";
    x.setAttribute("aria-label","Close");
    x.appendChild(el("b", null, "×"));
    x.appendChild(el("span", null, "Close"));

    function chevron(d){
      return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
    }
    var prev = el("button","apsc-lb__nav apsc-lb__nav--prev", chevron("M15 4 L7 12 L15 20"));
    prev.type = "button"; prev.setAttribute("aria-label","Previous photo");
    var next = el("button","apsc-lb__nav apsc-lb__nav--next", chevron("M9 4 L17 12 L9 20"));
    next.type = "button"; next.setAttribute("aria-label","Next photo");

    fig.appendChild(img);
    stage.appendChild(prev); stage.appendChild(fig); stage.appendChild(next);
    root.appendChild(x);
    root.appendChild(stage);
    root.appendChild(cap);
    root.appendChild(hint);

    var list = [], idx = 0, lastFocus = null;
    function show(i){
      idx = (i + list.length) % list.length;
      img.src = sized(list[idx].src, 1500);
      img.alt = list[idx].alt || "";
      cap.innerHTML = list[idx].capHtml || esc(list[idx].cap || "");
      var many = list.length > 1;
      prev.style.display = next.style.display = many ? "" : "none";
      hint.textContent = many
        ? (idx + 1) + " of " + list.length + " · arrow keys, Esc to close"
        : "Esc or click outside to close";
    }
    function close(){
      root.classList.remove("is-open");
      document.documentElement.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
    x.addEventListener("click", close);
    prev.addEventListener("click", function(){ show(idx-1); });
    next.addEventListener("click", function(){ show(idx+1); });
    /* the stage and the figure are click-through-to-close too, so the
       dark area beside a narrow photo behaves the way it looks */
    root.addEventListener("click", function(e){
      if (e.target === root || e.target === stage || e.target === fig) close();
    });
    /* The overlay must be exactly the visible area. Neither `inset:0`
       nor `100vw` gives that on a page whose layout viewport is wider
       than the screen, and this site's is: the eyebrow pill measures
       384px on a 375px phone, so the document scrolls to ~406 and the
       close button ended up off the right edge. clientWidth is the one
       number that means "what the reader can see". */
    function fit(){
      var w = document.documentElement.clientWidth;
      var h = window.innerHeight;
      root.style.width  = w + "px";
      root.style.height = h + "px";
      if (list.length) root.style.setProperty("--apsc-lb-stage", maxStageWidth(list) + "px");
    }
    window.addEventListener("resize", function(){
      if (root.classList.contains("is-open")) fit();
    }, { passive:true });
    window.addEventListener("orientationchange", function(){
      if (root.classList.contains("is-open")) setTimeout(fit, 120);
    }, { passive:true });
    document.addEventListener("keydown", function(e){
      if (!root.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft")  show(idx-1);
      if (e.key === "ArrowRight") show(idx+1);
    });

    return {
      node: root,
      open: function(images, i){
        /* ⚠ PORTAL TO <body>, EVERY TIME.
           This is the same law the section rail already follows, and
           the lightbox was the one place it was not applied. The
           overlay is z-index 99999, but z-index only ranks siblings
           WITHIN a stacking context — and this one was built inside
           .apsc, which carries `isolation:isolate` (set deliberately,
           in the first version, to stop the site punching through the
           card: exactly backwards for a full-screen overlay), nested
           inside main.container at z-index 9. The site header is
           z-index 10, so the header painted over the top 55px of the
           overlay — precisely where the close button sits. The X was
           rendering correctly the whole time, at opacity 1, behind the
           header band. Reported as "no X button appeared", on both
           desktop and mobile, and that is why.
           Moved on open rather than at build so it survives a re-render. */
        /* ALWAYS re-append, not just when the parent is wrong. The
           overlay ties with the site header on z-index (both at the
           32-bit maximum), so the tie-break is DOM order — and
           appendChild moves an existing node to the end, which is
           exactly the guarantee needed. */
        document.body.appendChild(root);
        lastFocus = document.activeElement;
        list = images;
        /* ⚠ ORDER. Hiding the page's scrollbar WIDENS clientWidth by
           its thickness, so measuring first left the overlay ~15px
           short and a strip of the page showing down the right edge.
           Lock the scroll, then measure. */
        document.documentElement.style.overflow = "hidden";
        fit();
        show(i);
        root.classList.add("is-open");
        x.focus();
      }
    };
  }

  /* ---------------------------------------------------------------- */
  function render(mount, parsed, facts, data){
    var S = parsed.sections;
    var storyPlates = parsed.storyPlates || [];   /* v72 */
    CURRENT_GENUS = facts.genus || "";
    var card = el("div","apsc");
    var lb   = makeLightbox();
    card.appendChild(lb.node);

    /* ---- header ----
       The blog theme prints the post title and its categories ABOVE the
       content area, in the same Cormorant it would use here — so on a
       real post the card must not print them a second time. It cannot
       hide the theme's copies (they sit outside .blog-item-content), so
       it stands down instead: whatever the page is already showing, the
       card leaves out. On a page with no theme title — pasted onto a
       static page, say — both come back automatically. */
    var head = el("header","apsc-head");

    var dupTitle = [].slice.call(document.querySelectorAll("h1")).some(function(h){
      return !mount.contains(h) &&
             squash(h.textContent).toUpperCase() === facts.title.toUpperCase() &&
             h.offsetParent !== null;
    });
    var dupCats = !!document.querySelector(
      '.blog-meta-item--categories a, .blog-item-category a'
    ) && facts.cats.length > 0;

    if (!dupCats){
      /* the site's own pill, rebuilt: category half, gold rhombus,
         genus half. Same shape and colours as the theme's copy, one
         notch smaller — see --apsc-eyebrow-scale in the CSS. */
      var eyebrow = el("div","apsc-eyebrow");
      var pill = el("div","apsc-eyebrow__pill");
      var catName = facts.cats[0] || "Species";
      var catLink = el("a","apsc-eyebrow__cat", esc(catName));
      catLink.href = "/journal/category/" + encodeURIComponent(catName);
      pill.appendChild(catLink);
      pill.appendChild((function(){ var g = el("i","apsc-eyebrow__gem"); g.setAttribute("aria-hidden","true"); return g; })());
      var genusLink = el("a","apsc-eyebrow__genus", esc(facts.genus || facts.genusRaw));
      genusLink.href = "/" + (facts.genusRaw || "").toLowerCase();
      pill.appendChild(genusLink);
      eyebrow.appendChild(pill);
      head.appendChild(eyebrow);
    }
    if (!dupTitle){
      var title = el("h1","apsc-title");
      title.appendChild(el("span","apsc-up", facts.title));
      head.appendChild(title);
    }

    /* ---- the line under the title ----
       Two kinds of post, one slot. A species page puts its authority
       here — "First described by Bogner … in Adansonia" — taken from
       ORIGINAL DESCRIPTION's first paragraph. A hybrid or hybrid
       cultivar puts its taxon formula here, the <h4> that sits above
       the first label. Both answer the same question: what is this
       plant. innerHTML rather than the node, because the species
       citation carries links and the formula carries the italics the
       site's own injection applied. */
    var formulaNode = parsed.pre.nodes.filter(function(n){ return squash(n.textContent); })[0] || null;
    var authorityNode = (S.original && S.original.nodes.length) ? S.original.nodes[0] : null;
    var lead = authorityNode || formulaNode;
    var formulaText = formulaNode ? squash(formulaNode.textContent) : "";

    if (lead && squash(lead.textContent)){
      var au = el("p","apsc-authority", lead.innerHTML || esc(squash(lead.textContent)));
      /* Alocasia lancifolia's ORIGINAL DESCRIPTION is the full Latin
         protologue — ~1,200 characters. At the 62ch centred measure
         that is a tall narrow column of italic before the reader
         reaches anything else. Past this length it gets the full
         measure and ranges left, which is how a paragraph should be
         set; a one-line citation keeps the centred treatment. */
      if (squash(lead.textContent).length > 320) au.className = "apsc-authority apsc-authority--long";
      expandGenus(au, facts.genus);
      finishBinomials(au);
      head.appendChild(au);
    }

    /* THE TWO PARENTAGE LINES, AND WHERE EACH GOES.
       The <h4> formula stays in the masthead under the title — it is
       the display statement of what this plant is, set large.
       The PARENTAGE: line says the same thing but with each parent
       linked to its own entry, so it goes down into At a glance under
       its own label, where a row of facts is what the reader expects
       to be able to click. Same statement, two jobs, two places. */
    if (head.firstChild) card.appendChild(head);
    /* nothing of our own above the head means the theme's title is
       immediately above it — close the gap */
    if (dupTitle && dupCats) card.classList.add("apsc--tight");

    /* ---- top slab ---- */
    var top = el("div","apsc-top");

    /* hero: prefer the og:image (that is what the site itself calls the
       lead photo), else the last image filed under ORIGINAL DESCRIPTION,
       else the first image anywhere. */
    var origImgs = (S.original && S.original.images) || [];
    var allImgs  = [];
    parsed.order.forEach(function(k){ allImgs = allImgs.concat(S[k].images); });
    /* v31: trailing INLINE images are the import pipeline's declared
       More-photos grid — mark them so the grid filter below can admit
       them even when the same photo already showed in a section. */
    parsed.trailing.images.forEach(function(i){ if (i.inline) i.trailingInline = true; });
    allImgs = parsed.pre.images.concat(allImgs).concat(parsed.trailing.images);

    var ogBase = (facts.og || "").split("?")[0].split("/").pop();
    var hero = null;
    if (ogBase) hero = allImgs.filter(function(i){ return i.src.split("?")[0].split("/").pop() === ogBase; })[0];
    /* v29: an image ABOVE the first label is the post's declared lead —
       the import pipeline puts the HERO-subfolder photo there. Checked
       before the Original-description fallback so a protologue plate
       cannot outrank it on a post whose thumbnail is not set yet. */
    if (!hero) hero = parsed.pre.images.filter(function(i){ return !i.gallery; })[0];
    if (!hero) hero = origImgs.filter(function(i){ return !i.gallery; }).slice(-1)[0];
    if (!hero) hero = allImgs[0];

    var fig = el("figure","apsc-hero");
    if (hero){
      var hi = el("img");
      hi.src = sized(hero.src, 1000);
      hi.alt = hero.alt || facts.title;
      hi.loading = "eager";
      hi.style.cursor = "zoom-in";
      hi.addEventListener("click", function(){ lb.open([hero], 0); });
      fig.appendChild(hi);
      if (hero.cap){
        var hcap = el("figcaption", null, hero.capHtml || esc(hero.cap));
        /* the caption arrives wrapped in its own <p> */
        var only = hcap.children.length === 1 && hcap.firstElementChild.tagName === "P";
        if (only){ var p0 = hcap.firstElementChild; while (p0.firstChild) hcap.insertBefore(p0.firstChild, p0); hcap.removeChild(p0); }
        fig.appendChild(hcap);
      }
    }

    /* protologue plates: the ORIGINAL DESCRIPTION images that are not
       the hero */
    var plates = origImgs.filter(function(i){ return i !== hero; });
    if (plates.length){
      /* v17: the stamp-sized thumbnails read as an orphan without a
         name; same 8px mono caps as every other micro-label */
      fig.appendChild(el("div","apsc-plates__label","Protologue"));
      var pw = el("div","apsc-plates");
      plates.forEach(function(p, i){
        var b = el("button"); b.type="button";
        b.setAttribute("aria-label","Protologue plate " + (i+1));
        var im = el("img"); im.src = sized(p.src, 300); im.alt = p.alt || "Protologue plate"; im.loading="lazy";
        b.appendChild(im);
        b.addEventListener("click", function(){ lb.open(plates, i); });
        pw.appendChild(b);
      });
      fig.appendChild(pw);
    }
    /* A post with no usable photograph would otherwise leave the wide
       column empty and the rail stranded at 35% width. Drop to one
       column instead. */
    /* v19: the left cell is a COLUMN — hero now, the whole body later
       (appended once it is built). Not appended to the grid yet: the
       order of the two cells depends on whether the rail survives,
       decided below. */
    var colMain = el("div","apsc-colmain");
    if (fig.firstChild) colMain.appendChild(fig);
    else top.style.gridTemplateColumns = "minmax(0,1fr)";

    /* ---- facts rail ----
       v35: TWO PANELS in one full-height cell. The FOLLOW panel
       (heading, map, Distribution, plus the climate block's compact
       yearly line) is the traveling group — the sticky element that
       pins below the header and rides the whole body column (user
       request 8.12.26: the map used to stop at the rail's end). The
       REST panel keeps every other fact and scrolls away beneath it.
       The cell stretches to the grid row, which is what extends the
       sticky travel to the body's full height, while each panel
       keeps its own content-sized box. */
    var followBox = el("aside","apsc-facts apsc-facts--follow");
    var restBox   = el("aside","apsc-facts apsc-facts--rest");
    var railCell  = el("div","apsc-railcell");
    railCell.appendChild(followBox);
    railCell.appendChild(restBox);
    followBox.appendChild(el("h2",null,"At a glance"));
    /* anything the rail shows is not repeated as a body section */
    var usedInRail = {};

    var distText = S.distribution ? squash(S.distribution.nodes.map(function(n){return n.textContent;}).join(" ")) : "";
    var geo = resolveRegions(facts.tags, distText, data);
    /* v68: category decides whether a range may be drawn. "Cultivar" and
       "Hybrid cultivar" are clones; only a species (or a wild hybrid,
       which carries no geography anyway) has a range to draw. */
    var isCultivarPost = /cultivar/i.test(facts.cats.join(" "));

    /* v68: NO MAP ON A CULTIVAR (user ruling 8.16.26: "let's remove maps
       entirely from cultivars ... I thought it would be interesting to
       show mother species geo but it's not relevant"). A cultivar is a
       clone, not a wild population - a lit map on 'Black Velvet' asserts
       an occurrence that does not exist. The 150 hybrid and 9
       hybrid-cultivar posts already carry no geography at all, so this
       makes cultivars consistent with them rather than adding a rule.
       The TAGS stay (they still place the plant for /journal browsing)
       and the CLIMATE chart stays, relabelled as the parent species' -
       the wild parent's climate is the one thing here a grower can
       actually act on. Only the map and the place pills go. */
    var mapNode = isCultivarPost ? null
                : buildMap(data, geo.hits, geo.doubtful, geo.wash, geo.subparent);
    if (mapNode) followBox.appendChild(mapNode);

    function fact(label, node, where){
      if (!node) return null;
      var f = el("div","apsc-fact");
      f.appendChild(el("div","apsc-fact__label", label));
      var v = el("div","apsc-fact__value");
      v.appendChild(node);
      f.appendChild(v);
      (where || restBox).appendChild(f);
      return f;                       /* v68: callers may need the row */
    }

    /* One row of chips and nothing else. Each chip links to its own
       journal tag page, so the pills ARE the navigation — which is why
       the plain-text repeat of the same place names that used to sit
       under them is gone. A place the map cannot draw is still shown,
       dashed, rather than dropped: it is a real part of the range and
       hiding it would misrepresent the species. */
    function chip(text, cls, tag, title){
      var a = el("a", "apsc-chip" + (cls ? " " + cls : ""), esc(text));
      a.href = "/journal/tag/" + encodeURIComponent(tag || text);
      if (title) a.title = title;
      return a;
    }
    var distBox = null;
    if (geo.hits.length || geo.continents.length || geo.unmapped.length ||
        (geo.parents && geo.parents.length)){
      distBox = el("div","apsc-chips");
      /* v66: the containing place leads the row, so "Thailand ·
         Kanchanaburi" reads as one statement. It is a real tag with a
         real tag page; it is only excluded from the climate envelope
         (see the CLIMATE RANGE selector) so the envelope stays keyed to
         the subunit the post actually documents. */
      /* v93: the country first when no tag supplied it, so the row still
         reads outside-in. Same quiet --parent look; the title says what
         it is, because this post does NOT carry the tag. */
      (geo.autoCountries || []).forEach(function(c){
        distBox.appendChild(chip(c, "apsc-chip--parent", c,
          c + " — the country containing the recorded range (not tagged on this post)"));
      });
      (geo.parents || []).forEach(function(p){
        distBox.appendChild(chip(p, "apsc-chip--parent", p,
          p + " — contains the recorded range below"));
      });
      geo.hits.forEach(function(h){
        if (geo.doubtful[h]){
          distBox.appendChild(chip(h, "apsc-chip--doubtful", geo.doubtfulTag[h] || h,
            h + " — reported for this species; presence doubtful"));
        } else {
          distBox.appendChild(chip(h));
        }
      });
      geo.unmapped.forEach(function(u){
        var ucls = "apsc-chip--off" + (geo.doubtful[u] ? " apsc-chip--doubtful" : "");
        var uttl = geo.doubtful[u]
          ? u + " — reported, presence doubtful; no shape on the map yet"
          : u + " — no shape on the map yet";
        distBox.appendChild(chip(u, ucls, geo.doubtful[u] ? (geo.doubtfulTag[u] || u) : u, uttl));
      });
      /* last, so it lands on its own full-width row under the places */
      geo.continents.forEach(function(c){
        distBox.appendChild(chip(c, "apsc-chip--continent"));
      });
    }
    /* v30: the DISTRIBUTION NOTE — an explicitly marked line from the
       import pipeline (sheet column ADDITIONAL DISTRIBUTION) shown as
       a quiet sub-line under the chips. Only the marker is honoured;
       ordinary distribution prose stays hidden as before. */
    var distNote = null;
    if (S.distribution){
      S.distribution.nodes.forEach(function(n){
        if (distNote) return;
        var m = /^DISTRIBUTION NOTE:\s*/i.exec(squash(txt(n)));
        if (m){
          var dnode = n.cloneNode(true);
          stripChars(dnode, m[0].length);
          distNote = dnode;
        }
      });
    }
    /* v49: LEGACY DISTRIBUTION PROSE (user report 8.15.26,
       /journal/amorphophallus-adamsensis). Pre-pipeline posts carry
       locality detail in the DISTRIBUTION prose ("Philippines |
       Widely distributed all over Adams, Bangui, …") that the chips
       cannot represent, and the v30 rule ("ordinary distribution
       prose stays hidden") was silently losing it. With no explicit
       marker, measure the prose against the resolved places: blank
       every chip name (hits, unmapped, continents), then separators
       and boilerplate joiners — at least 24 letters of residue means
       the prose says more than the chips do, and it renders as the
       same quiet sub-line, markup kept. New-pipeline posts, whose
       prose IS the place list, strip to nothing and stay hidden
       exactly as before. The explicit marker still wins above. */
    if (!distNote && S.distribution && distText && !isNA(distText)){
      var resid = " " + distText + " ";
      var blankPlace = function(name){
        if (!name) return;
        var N = String(name).toUpperCase(), out = "", at = 0, hit;
        while ((hit = resid.toUpperCase().indexOf(N, at)) >= 0){
          out += resid.slice(at, hit) + " ";
          at = hit + N.length;
        }
        resid = out + resid.slice(at);
      };
      geo.hits.forEach(blankPlace);
      geo.unmapped.forEach(blankPlace);
      geo.continents.forEach(blankPlace);
      resid = resid
        .replace(/\bN\/?A\b/gi, " ")
        .replace(/[|,;:.()&\/·–—-]+/g, " ")
        .replace(/\b(and|the|of|in|to|from|on|native|widely|widespread|distributed|distribution|found|throughout|across)\b/gi, " ");
      /* v55: the floor was 24 letters, tuned on adamsensis' long
         locality sentence — and it silently swallowed the SHORT
         case the user reported: Amorphophallus curvistylis reads
         "Thailand | Kanchanaburi Province", whose residue after
         blanking "Thailand" is 20 letters. One province name is
         the smallest real addition there is, so the floor is 6 —
         still zero for new-pipeline posts, whose prose IS the
         place list and strips to nothing. */
      if (resid.replace(/[^A-Za-z]/g, "").length >= 6){
        var lgc = el("div");
        S.distribution.nodes.forEach(function(n, i){
          var c = scrub(n.cloneNode(true));
          if (i) lgc.appendChild(document.createTextNode(" "));
          while (c.firstChild) lgc.appendChild(c.firstChild);
        });
        trimLeading(lgc);
        distNote = lgc;
      }
    }
    if (distBox){
      var distVal = distBox;
      if (distNote){
        distVal = el("div");
        distVal.appendChild(distBox);
        var dn = el("div","apsc-dist-note");
        dn.appendChild(scrub(distNote));
        distVal.appendChild(dn);
      }
      /* v35: Distribution rides in the follow panel with the map */
      var distFact = fact("Distribution", distVal, followBox);
      /* v68: on a cultivar the row is BUILT but not shown. It has to
         exist in the DOM because the CLIMATE RANGE block reads its
         chips to work out which places to average - hiding it here
         keeps the mother species' climate while removing the range
         claim. (display:none still answers querySelectorAll.) */
      if (isCultivarPost && distFact) distFact.classList.add("apsc-fact--muted");
    }
    else if (distText && !isNA(distText)) fact("Distribution", document.createTextNode(distText), followBox);

    /* Parentage and hybridizer are one-line facts about the plant, so
       they belong in the rail with the range, not as prose sections
       further down. On a hybrid post they are the whole masthead. */
    /* Same string, stripped to letters and digits — so "PARENTAGE:
       Alocasia alba x Alocasia 'Sintang'" and the h4 formula above it
       compare equal despite the curly quote and the label. */
    function bones(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, ""); }

    /* v16: CLIMATE PROSE IS RETIRED SITE-WIDE (user ruling 8.9.26).
       A sweep of ALL 179 species posts found the CLIMATE label is
       never a description of the species: one template text sits on
       86 posts verbatim-but-for-its-first-line (48-88°F / rainy
       Oct-May, pasted across Australia, Borneo, the Philippines,
       Hainan and New Guinea alike), 39 posts say "N/A", 33 say
       "Unknown", and the rest are five regional templates filled in
       with different numbers - even A. acuminata's, the best of them,
       is the same skeleton. The measured CLIMATE RANGE row (its own
       block, from climate.json) is the card's climate statement now.
       The label is still parsed and marked used-in-rail so the prose
       can never resurface as a body section, and its source block
       stays hidden with the rest. */
    usedInRail.climate = 1;
    ["parentage","hybridizer","ecology"].forEach(function(k){
      if (!S[k]) return;
      var t = squash(S[k].nodes.map(function(n){return n.textContent;}).join(" "));
      if (!t || isNA(t)) return;
      var def = SCHEMA.filter(function(d){ return d.key === k; })[0];
      /* Rebuilt from the nodes rather than from the flattened text, so
         the parent links survive — that is the whole reason this row
         exists rather than just repeating the formula above. */
      var v = el("div");
      S[k].nodes.forEach(function(n, i){
        /* v31: scrub, not just the style strip — moved children can
           carry Squarespace's preFade class and render invisible (the
           dunnii synonyms bug, same class of clone). */
        var c = scrub(n.cloneNode(true));
        if (i) v.appendChild(document.createTextNode(" "));
        while (c.firstChild) v.appendChild(c.firstChild);
      });
      expandGenus(v, facts.genus);
      finishBinomials(v);
      trimLeading(v);
      fact(def.label, v);
      usedInRail[k] = 1;
    });

    /* ---- SHORT PROSE COMES UP INTO THE RAIL ----
       A hybrid's whole DESCRIPTION is often one sentence — "Short,
       compact growing; ovate leaves with pronounced silver venation".
       Given a section heading and the full measure of the card, one
       sentence looks like a mistake. Under the threshold it becomes a
       fact row instead, which is the right size for it; over the
       threshold nothing changes and it stays a section.

       Only prose with no photographs and no video is eligible — those
       need the width, and moving them would break the section they
       belong to. */
    /* HYBRIDS AND CULTIVARS ONLY. On a species post the SPECIES
       DESCRIPTION is the point of the page even when it runs short —
       Amorphophallus coudercii's is 202 characters and belongs in the
       body — whereas a hybrid's whole description really is a single
       line about leaf shape. Keyed off the post's own category rather
       than off length alone. */
    var isSpeciesPost = /species/i.test(facts.cats.join(" "));

    (isSpeciesPost ? [] : ["description","notes"]).forEach(function(k){
      var sec = S[k];
      if (!sec || usedInRail[k]) return;
      if ((sec.images && sec.images.length) || (sec.videos && sec.videos.length)) return;
      var t = squash(sec.nodes.map(function(n){ return n.textContent; }).join(" "));
      if (!t || isNA(t) || t.length > CFG.RAIL_INLINE_MAX) return;

      var def = SCHEMA.filter(function(d){ return d.key === k; })[0];
      var v = el("div");
      sec.nodes.forEach(function(n){
        var c = n.cloneNode(true);
        c.removeAttribute && c.removeAttribute("style");
        v.appendChild(c);
      });
      expandGenus(v, facts.genus);
      [].slice.call(v.querySelectorAll("p")).forEach(function(p, i){
        p.style.margin = i ? "6px 0 0" : "0";
      });
      fact(def.label, v);
      usedInRail[k] = 1;
    });

    /* NO GENUS ROW. The eyebrow above the title already names the
       genus and already links to it — a second copy in the rail was
       the same fact twice, three inches apart.

       Which means the rail can now come out EMPTY: a cultivar with no
       range, no climate and no parentage has nothing to put in it, and
       an "AT A GLANCE" heading over an empty box is worse than no box.
       In that case the hero takes the full width instead. */
    /* v35: a follow panel with no map and no Distribution has nothing
       to travel — its heading moves to the rest panel and it goes.
       (Cultivars with only parentage/notes are exactly this case.) */
    if (!followBox.querySelector(".apsc-map") && !followBox.querySelector(".apsc-fact")){
      restBox.insertBefore(followBox.querySelector("h2"), restBox.firstChild);
      railCell.removeChild(followBox);
      followBox = null;
    }
    var railLive = !!(railCell.querySelector(".apsc-fact") || railCell.querySelector(".apsc-map"));
    if (railLive && fig.firstChild){
      top.appendChild(colMain);
      top.appendChild(railCell);
    } else if (railLive){
      /* no photo: single column, the glance box first, then the body */
      top.appendChild(railCell);
      top.appendChild(colMain);
    } else {
      /* no rail: single column; a hero, if any, stays book-plate sized */
      top.style.gridTemplateColumns = "minmax(0,1fr)";
      if (fig.firstChild) fig.style.maxWidth = "620px";
      top.appendChild(colMain);
    }
    card.appendChild(top);

    /* ---- body ---- */
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
    var na = [];        /* sections whose whole content is N/A */

    /* REFERENCES is rendered last of the labelled sections, after the
       unlabelled ones — see the note where it is emitted. Alocasia
       zebrina 'Reticulata' carries an unlabelled "A SHORT TIMELINE"
       that used to land AFTER References because unknown headings were
       appended at the end of the loop. Order is always: body, then
       References, then More photos. */
    var referencesDef = null;

    /* v72: THE STORY PLATE. A feature narrative gets the full card
       width and its own frame - the incurvatus type-locality
       reconstruction runs five paragraphs and carries two expedition
       maps, which no body section could hold. Built before the schema
       loop so it leads the wide tail, ahead of References.
       Plates come from the manifest's `story` role: the FIRST is shown
       and the rest become selector buttons labelled from their
       filenames, the same "pick one of a set" move the galleries make.
       Everything is optional - prose with no plate, or a plate with no
       prose, both render. */
    (function(){
      var sec = S.story;
      var plates = (storyPlates && storyPlates.length) ? storyPlates : [];
      if (!sec && !plates.length) return;
      usedInRail.story = 1;

      var title = "", bodyNodes = [];
      if (sec){
        sec.nodes.forEach(function(n){
          var m = /^STORY TITLE:\s*/i.exec(squash(txt(n)));
          if (m && !title){
            var tnode = n.cloneNode(true);
            stripChars(tnode, m[0].length);
            title = squash(txt(tnode));
            return;
          }
          bodyNodes.push(n);
        });
      }

      var box = el("section","apsc-story");
      /* v73: eyebrow + title ride the SAME centred column as the prose,
         so the whole text block reads as one page rather than a
         full-width header over a narrow column. */
      var head = el("div","apsc-story__head");
      head.appendChild(el("div","apsc-story__eyebrow","Field note"));
      if (title) head.appendChild(el("h2","apsc-story__title", title));
      box.appendChild(head);
      if (bodyNodes.length){
        var prose = el("div","apsc-story__prose");
        prose.appendChild(nodesToProse(bodyNodes));
        expandGenus(prose, facts.genus);
        box.appendChild(prose);
      }

      if (plates.length){
        var fig = el("figure","apsc-story__plate");
        var img = el("img");
        var cap = el("figcaption","apsc-story__cap");
        var shown = -1;
        function show(i){
          if (i === shown) return;
          shown = i;
          var pl = plates[i];
          img.src = sized(pl.src, 1600);
          img.alt = pl.alt || (speciesCase(facts.title) + " — " + (pl.cap || "plate"));
          cap.textContent = pl.cap || "";
          cap.style.display = pl.cap ? "" : "none";
          [].slice.call(box.querySelectorAll(".apsc-story__pick")).forEach(function(b, j){
            b.setAttribute("aria-pressed", j === i ? "true" : "false");
          });
        }
        img.loading = "lazy";
        img.decoding = "async";
        img.style.cursor = "zoom-in";
        img.addEventListener("click", function(){ lb.open(plates, shown); });
        fig.appendChild(img);
        fig.appendChild(cap);
        box.appendChild(fig);
        if (plates.length > 1){
          var picks = el("div","apsc-story__picks");
          plates.forEach(function(pl, i){
            var b = el("button","apsc-story__pick", pl.cap || ("Plate " + (i + 1)));
            b.type = "button";
            b.addEventListener("click", function(){ show(i); });
            picks.appendChild(b);
          });
          box.appendChild(picks);
        }
        show(0);
      }
      wide().appendChild(box);
    })();

    SCHEMA.forEach(function(def){
      var sec = S[def.key];
      if (!sec) return;
      if (def.key === "story") return;      /* v72: rendered as the plate */
      if (def.key === "references"){ referencesDef = def; return; }
      /* ORIGINAL DESCRIPTION's first paragraph is the authority line in
         the header. Anything after it is real content and still gets a
         section — a couple of posts run to three or four paragraphs
         here and losing them silently would be the worst kind of bug. */
      if (def.key === "original"){
        var extra = sec.nodes.slice(1).filter(function(n){ return squash(n.textContent); });
        if (extra.length) body.appendChild(section(def.label, foldable(nodesToProse(extra))));
        return;
      }
      if (def.key === "distribution") return;  /* already in the rail */

      var text = squash(sec.nodes.map(function(n){ return n.textContent; }).join(" "));
      var hasSubs = !!(sec.subs && sec.subs.length);
      var hasImgs = !!(sec.images && sec.images.length);
      var hasVids = !!(sec.videos && sec.videos.length);
      var hasEmbeds = !!(sec.embeds && sec.embeds.length);
      var hasText = !!(text && !isNA(text));

      /* A section whose prose says N/A does not get to keep its photos.
         This is what stops the 27-image grid at the foot of the post
         from being filed under "HYBRIDS: N/A" — the gallery simply sits
         after the last heading, and the last heading is not what it is
         about. Orphaned images fall through to MORE PHOTOS below. */
      if (!hasText && !hasSubs && !hasEmbeds){ na.push(def.label); return; }
      /* the synonyms block where every sub-row says N/A */
      if (hasSubs){
        var live = sec.subs.filter(function(s){ return !isNA(txt(s.node)); });
        if (!live.length && !hasText){ na.push(def.label); return; }
      }
      if (usedInRail[def.key]) return;

      /* --- synonyms get their own two-column table --- */
      if (def.key === "synonyms" && hasSubs){
        var tbl = el("div","apsc-syn");
        sec.subs.forEach(function(s){
          if (isNA(txt(s.node))) return;
          var row = el("div","apsc-syn__row");
          row.appendChild(el("div","apsc-syn__k", esc(s.label.replace(/ SYNONYMS$/,""))));
          var v = el("div","apsc-syn__v");
          v.appendChild(scrub(s.node));
          row.appendChild(v);
          tbl.appendChild(row);
        });
        if (tbl.children.length) body.appendChild(section(def.label, tbl));
        else na.push(def.label);
        return;
      }

      var content = el("div");

      /* CULTIVARS and HYBRIDS: two or more names is a list, always. */
      if ((def.key === "cultivars" || def.key === "hybrids") && hasText){
        var nl = nameList(sec.nodes.map(function(n){ return n.cloneNode(true); }), facts.genus);
        if (nl){
          if (nl.prose.length) content.appendChild(foldable(nodesToProse(nl.prose)));
          content.appendChild(nl.list);
          if (hasVids) sec.videos.forEach(function(v){ content.appendChild(videoFig(v)); });
          if (hasImgs){
            var st2 = photoStrip(sec.images, lb);
            st2.style.marginTop = "16px";
            content.appendChild(st2);
          }
          body.appendChild(section(def.label, content));
          return;
        }
      }

      if (hasText){
        /* v31: a NOTES section opening with "1." becomes a real ordered
           list; anything else takes the ordinary prose path. */
        var prose = (def.key === "notes" && notesList(sec.nodes)) || nodesToProse(sec.nodes);
        content.appendChild(foldable(prose));
      }
      /* v79: the absorbed table/key closes the prose. OUTSIDE the fold,
         and outside notesList's reach - handed to the list builder it
         would be treated as a continuation paragraph and end up nested
         inside the last lettered item. */
      if (hasEmbeds) sec.embeds.forEach(function(node){
        var w = el("div","apsc-embed");
        w.appendChild(node);
        content.appendChild(w);
      });
      if (hasVids) sec.videos.forEach(function(v){ if (!v.afterStrip) content.appendChild(videoFig(v)); });
      if (hasImgs){
        var strip = photoStrip(sec.images, lb);
        if (hasText || hasVids) strip.style.marginTop = "16px";
        content.appendChild(strip);
      }
      /* v36: manifest videos sit BELOW the gallery (user ruling) */
      if (hasVids) sec.videos.forEach(function(v){
        if (v.afterStrip){ var vf = videoFig(v); vf.style.marginTop = "16px"; content.appendChild(vf); }
      });
      /* v47: comparison plates close the section, below everything */
      if (sec.cmps && sec.cmps.length){
        sec.cmps.forEach(function(im){ content.appendChild(cmpFig(im, sec.cmps, lb)); });
      }
      body.appendChild(section(def.label, content));
    });

    /* unknown headings — never dropped, just parked at the end so a new
       label on a future post shows up instead of vanishing */
    parsed.order.forEach(function(k){
      if (k.indexOf("x_") !== 0) return;
      var sec = S[k];
      var t = squash(sec.nodes.map(function(n){return n.textContent;}).join(" "));
      if (!t || isNA(t)){ na.push(titleCase(sec.label)); return; }
      var c = el("div");
      c.appendChild(foldable(nodesToProse(sec.nodes)));
      if (sec.images.length){
        var st = photoStrip(sec.images, lb);
        st.style.marginTop = "16px";
        c.appendChild(st);
      }
      body.appendChild(section(titleCase(sec.label), c));
    });

    /* REFERENCES, now that every body section is placed. */
    if (referencesDef){
      var rsec = S.references;
      var rtext = squash(rsec.nodes.map(function(n){ return n.textContent; }).join(" "));
      if (rtext && !isNA(rtext)){
        var rbox = el("div","apsc-refs");
        rbox.appendChild(nodesToProse(rsec.nodes));
        wide().appendChild(section(referencesDef.label, rbox));
      } else na.push(referencesDef.label);
    }

    /* MORE PHOTOS: anything that landed before the first heading plus
       every gallery image not already shown in its own section. On the
       real posts this is the big grid at the bottom of the page. */
    var shown = {};
    [].slice.call(body.querySelectorAll(".apsc-strip img")).forEach(function(i){ shown[i.src.split("?")[0]] = 1; });
    if (hero)  shown[hero.src.split("?")[0]] = 1;
    plates.forEach(function(p){ shown[p.src.split("?")[0]] = 1; });

    /* v15: THE GENERIC RANGE MAPS ARE GONE. The hand-drawn geo map
       the tag-drawn map replaced used to fall through to this strip
       (the map section's NO-TOGGLE note) and, sitting mid-page, it
       opened the strip on nearly every species post. User ruling
       8.9.26: drop it — BUT some posts carry ADDITIONAL maps under
       DISTRIBUTION that are essential (occurrence-data maps, second
       detail maps), so the filter takes only images that are BOTH
       filed under DISTRIBUTION AND named by the generic convention:
       a filename ending in "geo" before the extension (acuminata+geo
       .png, geo.png, scalprum+geo.jpg) OR the bare species epithet
       (atropurpurea.png, cuprea.png, decipiens.png — the same generic
       map under its other naming habit; cuprea proves it, carrying
       BOTH cuprea.png and the essential updated+distribution+cuprea
       .PNG). alba+java+geo+data.PNG, aequiloba+distribution+2.PNG and
       every "+distribution" detail map survive on purpose. Widen or
       narrow by editing RETIRED_NAME / the epithet test below. A copy
       the author also placed in the gallery has its own URL and
       stays. */
    var RETIRED_NAME = /(^|[+\-_. ])geo\.(png|jpe?g)$/i;
    var epithet = (facts.title.split(/\s+/)[1] || "").toLowerCase();
    var retired = {};
    ((S.distribution && S.distribution.images) || []).forEach(function(i){
      var base = i.src.split("?")[0].split("/").pop();
      var stem = base.replace(/\.[a-z]+$/i, "").toLowerCase();
      if (RETIRED_NAME.test(base) || (epithet && stem === epithet)){
        retired[i.src.split("?")[0]] = 1;
      }
    });
    /* v31: THE FULL ARCHIVE. A trailing inline image (the pipeline's
       declared grid) is admitted even if the same photo already showed
       in a gallery, the maps section or under the protologue — once per
       grid, and never the hero. Legacy posts have no inline images, so
       for them this filter is exactly what it always was. */
    var heroKey = hero ? hero.src.split("?")[0] : "";
    var inGrid = {};
    /* v32: the hero belongs in the archive too (user ruling) — its own
       pre-heading inline record is admitted when the post carries a
       trailing archive, and its at≈1.001 sorts it first in the grid. */
    var hasArchive = allImgs.some(function(i){ return i.trailingInline; });
    var rest = allImgs.filter(function(i){
      var k = i.src.split("?")[0];
      if (retired[k]) return false;
      if (inGrid[k]) return false;
      if (i.trailingInline || (hasArchive && i.inline && k === heroKey)){
        inGrid[k] = 1;
        return true;
      }
      if (shown[k]) return false;
      shown[k] = 1;
      inGrid[k] = 1;
      return true;
    });
    /* v14: THE STRIP FOLLOWS THE PAGE. allImgs is assembled in SCHEMA
       order — the order the card tells the story in, which is not the
       order the author laid the photos out in. On A. alba that pushed
       three DISTRIBUTION images and an inline figure into the middle
       of a 35-image gallery arranged by hand; on nearly every species
       post it led the strip with the retired hand-drawn range map
       instead of the gallery's opening photo. Every image carries the
       index of the source block it was read from ("at"), so sorting
       on it restores the full entry's own top-to-bottom order; the
       tiebreak on collection index keeps one gallery's photos in
       their set order and makes the sort stable everywhere. */
    rest = rest.map(function(r, i){ return { r: r, i: i }; })
      .sort(function(a, b){ return (a.r.at || 0) - (b.r.at || 0) || a.i - b.i; })
      .map(function(x){ return x.r; });
    if (rest.length) wide().appendChild(section("More photos", photoStrip(rest, lb), rest.length));

    /* Videos filed under a section that turned out to be empty — the
       "CULTIVAR DESCRIPTION: … / video / REFERENCES:" shape, where the
       clip sits after a heading that says nothing. They would have been
       dropped with their section, so they get their own row instead. */
    var shownVids = {};
    [].slice.call(body.querySelectorAll(".apsc-video iframe, .apsc-video video")).forEach(function(f){
      shownVids[f.getAttribute("src") || ""] = 1;
    });
    var allVids = parsed.pre.videos.slice();
    parsed.order.forEach(function(k){ allVids = allVids.concat(S[k].videos || []); });
    allVids = allVids.concat(parsed.trailing.videos);
    var restVids = allVids.filter(function(v){
      if (shownVids[v.src]) return false;
      shownVids[v.src] = 1;
      return true;
    });
    if (restVids.length){
      var vbox = el("div");
      restVids.forEach(function(v, i){
        var f = videoFig(v);
        if (i) f.style.marginTop = "16px";
        vbox.appendChild(f);
      });
      wide().appendChild(section(restVids.length > 1 ? "Video" : "Video", vbox));
    }

    /* v19: the body lives in the left column, at the hero's measure */
    colMain.appendChild(body);

    /* ---- v21→v35: THE TRAVELING RANGE ----
       v21 pinned the map alone; v35 pins the whole FOLLOW PANEL (map
       + Distribution + the climate block's yearly line) below the
       site header, and the rail cell's align-self:stretch extends the
       travel to the body's full height instead of stopping at the
       At-a-glance content's end (user request 8.12.26). The rest
       panel slides beneath it through the panel's glass ground.
       Sticky WITHIN .apsc-railcell, so the group rides out naturally
       at the row's end. Single-column widths clear it. */
    (function(){
      if (!railLive || !followBox) return;
      function headerH(){
        var hd = document.querySelector("#header");
        if (!hd) return 0;
        var cs = getComputedStyle(hd);
        if (cs.position !== "fixed" && cs.position !== "sticky") return 0;
        return hd.getBoundingClientRect().height || 0;
      }
      function apply(){
        var rest = followBox.nextElementSibling;
        if (!(rest && rest.classList && rest.classList.contains("apsc-facts--rest"))) rest = null;
        if (window.innerWidth <= 820){
          followBox.style.position = "";
          followBox.style.top = "";
          followBox.style.zIndex = "";
          if (rest){ rest.style.position = ""; rest.style.top = ""; }
          return;
        }
        followBox.style.position = "sticky";
        /* v43(card): THE STACK - the panel pins at base, ALWAYS. The
           v42 yield slid it under the nav bar on short screens (user:
           "i would rather not do that"). The rest panel stacks
           directly beneath when the screen is tall enough (no gap -
           the large-screen complaint), else parks bottom-anchored so
           it holds fully visible once reached; too short for even
           that and it stays in normal flow. */
        var base = headerH() + 12;
        followBox.style.top = Math.round(base) + "px";
        followBox.style.zIndex = "3";
        if (rest){
          var rh = rest.getBoundingClientRect().height;
          var fh = followBox.getBoundingClientRect().height;
          var under = base + fh + 12;
          var anchored = window.innerHeight - rh - 6;
          if (rh > 0 && anchored >= under){
            rest.style.position = "sticky";
            rest.style.top = Math.round(under) + "px";
          } else if (rh > 0 && anchored >= base + 60){
            rest.style.position = "sticky";
            rest.style.top = Math.round(anchored) + "px";
          } else {
            rest.style.position = "";
            rest.style.top = "";
          }
        }
      }
      apply();
      window.addEventListener("resize", apply);
      /* the yearly climate line lands async and grows the panel; the
         same settle moments are when the pin judgement can go stale,
         so both re-run together (apply first - judge reads its top) */
      if (window.ResizeObserver) new ResizeObserver(function(){ apply(); judge(); }).observe(followBox);

      /* v38: compact travel — pinned => condensed. Pinned is judged
         against the box's OWN applied sticky top: while held, its
         rect.top equals the inline top (a sentinel would join the
         rail's flex column and inherit its gap — learned in harness).
         Shrinking the pinned box moves only its bottom, and the
         ResizeObserver's re-apply happens before the next judge, so
         the state cannot oscillate. */
      var compact = false, tick2 = false;
      function judge(){
        tick2 = false;
        var applied = parseFloat(followBox.style.top);
        var want = window.innerWidth > 820 && isFinite(applied) &&
                   followBox.getBoundingClientRect().top <= applied + 1;
        if (want !== compact){
          compact = want;
          followBox.classList.toggle("apsc--compact", compact);
          collapseChips();
        }
      }
      window.addEventListener("scroll", function(){
        if (!tick2){ tick2 = true; requestAnimationFrame(judge); }
      }, { passive: true });
      /* v41: one-row pills while pinned. Hide place chips from the
         end until the "+N" counter fits on the first row; the
         continent pill keeps its own row. Restore everything on exit. */
      var moreChip = null, pop = null, popTimer = null;
      function hidePop(){ if (pop) pop.style.display = "none"; }
      function showPop(){
        if (!pop || !moreChip) return;
        var box = followBox.querySelector(".apsc-chips");
        pop.innerHTML = "";
        [].slice.call(box.querySelectorAll(".apsc-chip")).forEach(function(c){
          if (c !== moreChip && c.style.display === "none"){
            var k = c.cloneNode(true);
            k.style.display = "";
            pop.appendChild(k);
          }
        });
        if (!pop.childNodes.length) return;
        var fb = followBox.getBoundingClientRect();
        var mb = moreChip.getBoundingClientRect();
        pop.style.top = Math.round(mb.bottom - fb.top + 6) + "px";
        pop.style.left = "18px";
        pop.style.right = "18px";
        pop.style.display = "flex";
      }
      function collapseChips(){
        hidePop();
        var box = followBox.querySelector(".apsc-chips");
        if (!box) return;
        var chips = [].slice.call(box.querySelectorAll(".apsc-chip")).filter(function(c){
          return c !== moreChip;
        });
        chips.forEach(function(c){ c.style.display = ""; });
        if (moreChip) moreChip.style.display = "none";
        if (!compact || chips.length < 2) return;
        var rowTop = chips[0].offsetTop;
        var wraps = chips.some(function(c){ return c.offsetTop > rowTop; });
        if (!wraps) return;
        if (!moreChip){
          moreChip = el("span", "apsc-chip apsc-chip--more");
          box.appendChild(moreChip);
          pop = el("div", "apsc-chip-pop");
          followBox.appendChild(pop);
          moreChip.addEventListener("mouseenter", function(){ clearTimeout(popTimer); showPop(); });
          moreChip.addEventListener("mouseleave", function(){ popTimer = setTimeout(hidePop, 140); });
          pop.addEventListener("mouseenter", function(){ clearTimeout(popTimer); });
          pop.addEventListener("mouseleave", function(){ popTimer = setTimeout(hidePop, 140); });
        }
        moreChip.style.display = "";
        var hidden = 0;
        for (var i = chips.length - 1; i >= 0; i--){
          if (moreChip.offsetTop <= rowTop) break;
          chips[i].style.display = "none";
          hidden++;
          moreChip.textContent = "+ " + hidden + " more";
        }
      }
      window.addEventListener("resize", judge);
      window.addEventListener("resize", function(){ if (compact) collapseChips(); });
      requestAnimationFrame(function(){ requestAnimationFrame(judge); });
    })();

    /* ---- v21: THE NAV RUNNING HEAD ----
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
    })();

    if (na.length){
      var naRow = el("div","apsc-na");
      naRow.appendChild(el("strong",null,"Not recorded"));
      na.forEach(function(l){ naRow.appendChild(el("span",null,esc(l))); });
      card.appendChild(naRow);
    }

    /* ---- footer control ---- */
    var foot = el("div","apsc-foot");
    foot.appendChild(el("span",null,"Aroidpedia species card"));
    var toggle = el("button",null,"Show the full entry");
    toggle.type = "button";
    var open = false;
    toggle.addEventListener("click", function(){
      open = !open;
      if (parsed.setHidden) parsed.setHidden(!open);
      else parsed.hidden.forEach(function(b){ b.classList.toggle("apsc-hidden", !open); });
      toggle.textContent = open ? "Hide the full entry" : "Show the full entry";
    });
    foot.appendChild(toggle);
    card.appendChild(foot);

    mount.innerHTML = "";
    mount.appendChild(card);

    /* both only after the card is in the DOM and measurable */
    removeLegacyNav();
    var rail = buildRail(card);

    /* A console handle, in the shape of apPollinationNav's. An empty
       rail or a card that did not build should never be a mystery. */
    window.apSpeciesCard = {
      card:     card,
      rail:     rail,
      refresh:  function(){ if (rail && rail.refresh) rail.refresh(); },
      sections: function(){
        return [].slice.call(card.querySelectorAll(".apsc-sec")).map(function(s){ return s.id; });
      },
      why: function(){
        if (!rail) {
          return window.innerWidth < CFG.RAIL_MIN_WIDTH
            ? "no rail: viewport is " + window.innerWidth + "px, under the " +
              CFG.RAIL_MIN_WIDTH + "px desktop floor — hidden by design"
            : "no rail: fewer than 2 sections; one tick is decoration, not navigation";
        }
        return "ok — " + card.querySelectorAll(".apsc-sec").length + " sections";
      }
    };
  }

  /* ================================================================
     THE SECTION RAIL
     Built from the card's own sections, which is the whole reason it
     needs no label table: the card named them a moment ago. Ported
     from AROID POLLINATION — SECTION NAV v9; see the CSS for which of
     that file's behaviours are carried over and why.
     ================================================================ */
  function buildRail(card){
    var old = document.querySelector(".apsc-rail");
    if (old) old.remove();

    var secs = [].slice.call(card.querySelectorAll(".apsc-sec"));
    /* One tick is decoration, not navigation. */
    if (secs.length < 2 || window.innerWidth < CFG.RAIL_MIN_WIDTH) return null;

    var rail = el("nav","apsc-rail");
    rail.setAttribute("aria-label","Card sections");
    rail.appendChild((function(){ var i = el("i","apsc-rail__line"); i.setAttribute("aria-hidden","true"); return i; })());
    var fill = el("i","apsc-rail__fill");
    fill.setAttribute("aria-hidden","true");
    rail.appendChild(fill);

    var RM = window.matchMedia &&
             window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function docTop(node){ var t = 0; while (node) { t += node.offsetTop; node = node.offsetParent; } return t; }

    var chapters = secs.map(function(sec, i){
      var label = squash((sec.querySelector(".apsc-sec__h") || {}).firstChild &&
                         sec.querySelector(".apsc-sec__h").firstChild.textContent || "Section");
      var b = el("button","apsc-rail__tick");
      b.type = "button";
      b.style.top = (i / (secs.length - 1) * 100).toFixed(2) + "%";
      b.setAttribute("aria-label", "Go to " + label);
      b.appendChild(el("span", null, esc(label)));
      b.addEventListener("click", function(){
        window.scrollTo({ top: docTop(sec) - 90, behavior: RM ? "auto" : "smooth" });
      });
      rail.appendChild(b);
      return { el: sec, btn: b };
    });

    /* PORTAL TO <body>: a fixed element's z-index resolves inside its
       nearest ancestor stacking context, and this one is built deep
       inside the post body under several positioned wrappers. */
    document.body.appendChild(rail);
    rail.classList.add("is-ready");

    /* The rail appears once the card's own top slab has cleared, offset
       by a FRACTION of the viewport — not pixels, or it lands at a
       different point in the composition on every screen. */
    var head = card.querySelector(".apsc-top") || card;

    function update(){
      var y = window.scrollY || window.pageYOffset || 0;
      var vh = window.innerHeight;
      var last = chapters.length - 1;
      var maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);

      var arrive = chapters.map(function(c, i){
        return i === 0 ? 0 : Math.min(maxScroll, Math.max(0, docTop(c.el) - vh * 0.5));
      });
      for (var m = 1; m < arrive.length; m++){
        if (arrive[m] <= arrive[m - 1]) arrive[m] = arrive[m - 1] + 1;
      }
      var idx = 0;
      for (var i = 0; i < arrive.length; i++){ if (y >= arrive[i]) idx = i; else break; }

      var start = arrive[idx];
      var end = (idx + 1 < arrive.length) ? arrive[idx + 1] : maxScroll;
      var within = Math.min(1, Math.max(0, (y - start) / Math.max(1, end - start)));
      var f = last > 0 ? (idx + within) / last : 1;
      fill.style.height = (Math.min(1, Math.max(0, f)) * 100).toFixed(2) + "%";

      chapters.forEach(function(c, i){
        c.btn.classList.toggle("is-passed", i <= idx);
        c.btn.classList.toggle("is-current", i === idx);
      });

      var revealAt = Math.max(0, docTop(head) + head.offsetHeight - vh * 0.55);
      rail.classList.toggle("is-visible", y >= revealAt);
    }

    var ticking = false;
    function onScroll(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function(){ ticking = false; update(); });
    }
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("resize", onScroll, { passive:true });
    update();
    /* images and the fluid-engine flattening land after first paint,
       and every tick position derives from those heights */
    setTimeout(update, 1200);
    setTimeout(update, 4000);

    /* `refresh` recomputes without a scroll event. The scroll path is
       rAF-gated and a hidden or non-compositing tab never runs rAF —
       the same trap noted in the pollination nav — so without this
       there is no way to test the rail except by eye. */
    rail.refresh = update;
    return rail;
  }

  /* The four fixed links this card replaces.
     They are loose <div>s appended straight to <body> with ids
     originaldesc / distrib / spec / inflo, position:fixed at left:0
     and z-index 99999 — which is on top of, and in the same place as,
     the new rail. Removed rather than hidden so they cannot take
     clicks, and only once the card has actually built: on a page the
     card leaves alone, the old nav is still the only navigation there
     is and must survive.

     ⚠ THIS ONLY HIDES THE SYMPTOM. Something on the site still injects
     them on every entry. Search your injections for "originaldesc" and
     delete it at source when you get the chance. */
  function removeLegacyNav(){
    ["originaldesc", "distrib", "spec", "inflo"].forEach(function(id){
      var n = document.getElementById(id);
      if (n && n.parentElement === document.body && n.querySelector('a[href^="#"]')) n.remove();
    });
  }

  /* ================================================================
     NEVER CONTRACT A GENUS
     The posts abbreviate in places — "A. 'Bisma' x A. reginula 'Black
     Velvet'" — and the card spells it out. Done on TEXT NODES so the
     links and italics around them survive.

     The guard matters more than the replacement. A bare "P." also
     appears in citations as a page number ("Adansonia 20 V3 (1980)
     P.305"), and on a Philodendron post that initial would match. So
     the abbreviation only expands when what follows looks like an
     epithet or a cultivar name — a lowercase letter or an opening
     quote — never when it is a digit.
     ================================================================ */
  /* Strip leading whitespace from a subtree.
     Not just the first text node: the markup usually opens with a
     formatting-whitespace node, so trimming only that one leaves the
     real leading space on the node after it — which is how
     "PARENTAGE: Likely a mutation of…" kept rendering with a gap in
     front of it. Keep going until a node with actual content is hit. */
  function trimLeading(root){
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false), n;
    while ((n = w.nextNode())){
      var v = n.nodeValue.replace(/^\s+/, "");
      n.nodeValue = v;
      if (v) break;
    }
    return root;
  }

  /* The site's auto-italicizer wraps the GENUS WORD only, in
     <span class="ap-genus-italic">. On a link like
        <a href="/journal/alocasia-macrorrhizos">Alocasia macrorrhizos</a>
     that leaves the epithet upright, which is what "the italics rule
     missed macrorrhizos" actually is — the card reproduces the source
     faithfully (4 spans in, 4 spans out); the source itself only ever
     had the genus italicised.

     Finished here, but ONLY inside an anchor pointing at another
     journal entry. The whole text of such a link is a taxon name, so
     italicising all of it is safe. Doing it in open prose would
     italicise "Alocasia is a genus of…" from the second word on.

     ⚠ The real fix belongs in the auto-italicize block, which would
     also fix the raw page. This only covers what the card renders. */
  function finishBinomials(root){
    if (!root || !root.querySelectorAll) return root;
    [].slice.call(root.querySelectorAll('a[href*="/journal/"]')).forEach(function(a){
      if (!a.querySelector(".ap-genus-italic")) return;
      if (a.getAttribute("data-apsc-italic")) return;
      a.setAttribute("data-apsc-italic", "1");
      a.style.fontStyle = "italic";
    });
    return root;
  }

  function expandGenus(root, genus){
    if (!root) return root;

    /* WHICH NAMES COUNT AS GENERA.
       The post's own genus, plus the first word of every italicised
       run in this block. The site italicises binomials, so an <em>
       opening with a capitalised word is a genus and almost nothing
       else is — which is what keeps "Bogner" and "Adansonia" out of
       the table while letting "Plesmonium" in. That matters on
       Amorphophallus coudercii, whose NOTES discuss Plesmonium and
       then write "P. margaritiferum": the post's own genus is
       Amorphophallus, so a single-genus rule leaves that contracted. */
    var byInitial = {};
    if (genus && genus.length > 2) byInitial[genus.charAt(0).toUpperCase()] = genus;
    [].slice.call(root.querySelectorAll("em, i")).forEach(function(em){
      var first = squash(em.textContent).split(/[\s,;()]/)[0] || "";
      if (first.length < 4 || !/^[A-Z][a-z]+$/.test(first)) return;
      var k = first.charAt(0).toUpperCase();
      if (!byInitial[k]) byInitial[k] = first;
    });
    var initials = Object.keys(byInitial);
    if (!initials.length) return root;

    /* Only in front of an epithet or a cultivar name. A bare "P." is
       also a page number — "Adansonia 20 V3 (1980) P.305" — and on a
       Philodendron post that initial would otherwise match. A digit
       after the stop is never a species. */
    var re = new RegExp("(^|[\\s(\\[/×x])(" + initials.join("|") + ")\\.\\s*(?=['‘’\"“]|[a-z])", "g");
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false), n;
    while ((n = w.nextNode())){
      if (n.nodeValue.indexOf(".") < 0) continue;
      n.nodeValue = n.nodeValue.replace(re, function(m, pre, init){
        return pre + byInitial[init] + " ";
      });
    }
    return root;
  }

  function esc(s){
    return String(s).replace(/[&<>"]/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];
    });
  }
  function titleCase(s){
    return String(s||"").toLowerCase().replace(/(^|\s)\S/g, function(c){ return c.toUpperCase(); });
  }

  /* ================================================================
     BOOT
     ================================================================ */
  /* Build the mount this file needs, on the pages that should have one.
     This is the whole difference between v1 and v2: nothing has to be
     pasted into a post for the card to appear on it. */
  function autoMount(){
    var b = document.body;
    if (!b || !b.classList.contains("view-item")) return null;
    if (CFG.JOURNAL_COLLECTION &&
        !b.classList.contains("collection-" + CFG.JOURNAL_COLLECTION)) return null;

    var layout = document.querySelector(".blog-item-content .sqs-layout");
    if (!layout) return null;

    if (CFG.SKIP_TAG){
      var tagged = [].slice.call(document.querySelectorAll('a[href*="/journal/tag/"]'))
        .some(function(a){ return squash(a.textContent).toUpperCase() === CFG.SKIP_TAG; });
      if (tagged) return null;
    }

    /* Wrapped in Squarespace's own row/column markup so it inherits the
       layout's gutters instead of sitting flush against them. */
    var row = el("div","row sqs-row");
    var col = el("div","col sqs-col-12 span-12");
    var host = el("div","apsc-mount");
    host.setAttribute("data-apsc-mount","");
    col.appendChild(host);
    row.appendChild(col);
    layout.insertBefore(row, layout.firstChild);
    return host;
  }

  function boot(){
    if (param("card") === "off") return;

    var mounts = [].slice.call(document.querySelectorAll("[data-apsc-mount]"));
    if (!mounts.length){
      var made = autoMount();
      if (!made) return;
      mounts = [made];
    }

    mounts.forEach(function(mount){
      if (mount.getAttribute("data-apsc-done")) return;

      /* When the mount was pasted into a post as a code block, only the
         blocks BELOW it are the entry. When this file installed the
         mount itself, it sits above every block, closest() finds no
         .sqs-block, and indexOf(null) is -1 — which reads the whole
         layout. Same code path, both cases. */
      var selfBlock = mount.closest(".sqs-block");
      var layout    = mount.closest(".sqs-layout") ||
                      mount.closest(".blog-item-content") ||
                      document.querySelector(".blog-item-content .sqs-layout");
      if (!layout) return;

      var parsed = parse(layout, selfBlock);
      /* v79: THE BOTTOM OF NOTES, BEFORE REFERENCES (user ruling). A
         hand-built table is reference apparatus - it reads after the
         prose, not before it, and never after the citations. Three of
         the four sit inside NOTES in the source anyway; moving them all
         there makes the placement a rule rather than an accident of
         where the block was dropped. A post with no NOTES section keeps
         its table in whichever section it was typed into. */
      (function(){
        var S = parsed.sections, notes = S && S.notes;
        if (!notes) return;
        Object.keys(S).forEach(function(k){
          var sec = S[k];
          if (k === "notes" || !sec.embeds || !sec.embeds.length) return;
          notes.embeds = (notes.embeds || []).concat(sec.embeds);
          sec.embeds = [];
        });
        if (parsed.pre && parsed.pre.embeds && parsed.pre.embeds.length){
          notes.embeds = (notes.embeds || []).concat(parsed.pre.embeds);
          parsed.pre.embeds = [];
        }
      })();

      /* THE SAFETY VALVE
         Four labels is a species post. Two is enough only if one of
         them is a spine label — that is what lets a two-line hybrid
         post ("PARENTAGE: … / HYBRIDIZER: …") build a card while a
         random page with a bold "NOTE:" in it does not. */
      var enough = parsed.found >= CFG.MIN_SECTIONS ||
                   (parsed.found >= CFG.MIN_SECTIONS_SPINE && parsed.spine >= 1);
      if (!enough){
        if (window.console && console.info){
          console.info("[species card] " + parsed.found + " labelled sections (" +
                       parsed.spine + " spine); leaving the page as it is.");
        }
        /* take the empty row back out again so the post is byte-for-byte
           the page it would have been */
        var own = mount.closest(".row");
        if (own && own.parentNode && !own.querySelector(".sqs-block")) own.parentNode.removeChild(own);
        return;
      }

      /* v28: stamp the running version where a live check can read it —
         the deployed injection has no filename to carry it. */
      mount.setAttribute("data-apsc-version", "card-v95-file-v113");
      if (window.console && console.info){
        console.info("[species card] card v40 (seam standoff)" + parsed.found +
                     " labelled sections · building.");
      }

      mount.setAttribute("data-apsc-done","1");
      var facts = pageFacts();

      /* Hide first so the page does not flash the raw entry, then
         paint. Hiding the BLOCKS is not enough: Squarespace's grid
         gives every .row its own height, so a row holding nothing but
         hidden blocks still occupied 47px — and on Alocasia indica the
         eight leftover rows added 226px of black between the card and
         the tags. The rows go too, and come back with the toggle. */
      function setHidden(on){
        parsed.hidden.forEach(function(b){ b.classList.toggle("apsc-hidden", on); });
        if (!on){
          [].slice.call(layout.querySelectorAll(".row.apsc-hidden"))
            .forEach(function(r){ r.classList.remove("apsc-hidden"); });
        } else {
          /* Measured, not inferred. The first attempt called a row
             "live" if it held any unhidden block — but the code blocks
             are deliberately left unhidden (they are injections doing a
             job) and most of them render nothing, so every row holding
             one stayed and kept its 47px. Asking the browser what
             actually has height is the only reliable test, and it also
             means a code block that DOES render something keeps its
             row. Deferred, because nothing has been laid out yet. */
          setTimeout(function(){
            [].slice.call(layout.querySelectorAll(".row")).forEach(function(row){
              if (row.querySelector("[data-apsc-mount]")) return;    /* never our own */
              var live = [].slice.call(row.querySelectorAll(".sqs-block"))
                .some(function(b){
                  return !b.classList.contains("apsc-hidden") && b.offsetHeight > 4;
                });
              if (!live) row.classList.add("apsc-hidden");
            });
          }, 0);
        }
      }
      parsed.setHidden = setHidden;
      setHidden(true);

      Promise.all([shapes(), photoManifest(), geoHier()]).then(function(res){
        /* v86: lazy HD merge — resolves to res[0] untouched unless a tag
           actually needs a shape only shapes-hd carries */
        return upgradeShapes(res[0], facts, parsed).then(function(shapeData){
        /* v93: attached AFTER the merge on purpose - upgradeShapes builds
           its result from an explicit key list, so anything set before it
           is dropped on the HD path. That is exactly how `parent` went
           missing in v89. */
        if (shapeData && res[2]) shapeData.hier = res[2];
        try {
          mergeManifest(parsed, res[1], facts.title);
          fillAlt(parsed, facts.title);
          render(mount, parsed, facts, shapeData);
        }
        catch (err){
          /* a render failure must not leave a blank page */
          if (parsed.setHidden) parsed.setHidden(false);
          else parsed.hidden.forEach(function(b){ b.classList.remove("apsc-hidden"); });
          mount.removeAttribute("data-apsc-done");
          if (window.console) console.error("[species card]", err);
        }
        });
      });
    });
  }

  /* Squarespace paints blocks asynchronously; galleries in particular
     land after DOMContentLoaded. Try once early for speed, then again
     on load, then give up. */
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", boot);
  document.addEventListener("mercury:load", boot);   /* Squarespace ajax nav */
})();

;

(function () {
  "use strict";

  /* EDITOR GUARD — the file's standing rule. */
  if (window.self !== window.top) return;

  /* The field's invitation. Squarespace ships a data-defaulttext
     attribute on this textarea but its own comments bundle never reads
     it (checked against the live bundle), so the field renders with no
     prompt at all. One line, and it is the only string here. */
  var PROMPT = 'Add a note to the record…';

  /* The field grows with what is typed instead of carrying a resize
     grip. Cap matches max-height in the CSS — keep the two together. */
  var MAXH = 420;

  function grow(t) {
    t.style.height = 'auto';
    t.style.height = Math.min(t.scrollHeight, MAXH) + 'px';
  }

  function dress(t) {
    if (!t || t.getAttribute('data-apcm')) return;
    t.setAttribute('data-apcm', '1');
    if (!t.getAttribute('placeholder')) t.setAttribute('placeholder', PROMPT);
    grow(t);
  }

  function scan() {
    var list = document.querySelectorAll('.blog-item-comments .comment-input');
    for (var i = 0; i < list.length; i++) dress(list[i]);
  }

  /* Capture phase, delegated: reply boxes are built by Squarespace long
     after this runs, and each one is a .comment-input too. */
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t && t.classList && t.classList.contains('comment-input') &&
        t.closest && t.closest('.blog-item-comments')) grow(t);
  }, true);

  function start() {
    var root = document.querySelector('.blog-item-comments');
    if (!root) return;                 /* not a journal entry */
    scan();
    /* childList only — dress() writes an attribute, and observing
       attributes here would re-enter on every pass. */
    new MutationObserver(scan).observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  /* ---- THE ANCHOR-AD NUDGE  (v7, 8.10.26) ------------------------
     Google's anchor ad bars the bottom of a phone viewport, and the
     Post Comment button enters the viewport inside that band
     (measured live: anchor 375×84 at 728–812; the button stays
     covered until the page scrolls another ~100px). A reader who
     finishes typing taps the ad instead of the button. When the
     keyboard closes (focusout from the comment field), if the button
     sits inside the band, the page scrolls the difference — once,
     smoothly, and never on a scroll event, so a reader's own drags
     are never fought (the v51 law). The 380ms wait outlasts the
     keyboard's own viewport restore AND any in-flight tap on the
     button itself (a tap's click lands well inside 380ms, before
     this moves anything). The ad is found by shape — a fixed-position
     ins.adsbygoogle with real height — never by id or class suffix,
     which are Google's to rename. Coarse-pointer screens only. */
  document.addEventListener('focusout', function (e) {
    var t = e.target;
    if (!t || !t.classList || !t.classList.contains('comment-input')) return;
    if (!t.closest || !t.closest('.blog-item-comments')) return;
    if (!window.matchMedia || !matchMedia('(pointer:coarse)').matches) return;
    setTimeout(function () {
      var area = t.closest('.new-comment-area') || t.closest('.blog-item-comments');
      var btn = area && area.querySelector('.comment-btn');
      if (!btn) return;
      var ad = null;
      var list = document.querySelectorAll('ins.adsbygoogle');
      for (var i = 0; i < list.length; i++) {
        if (getComputedStyle(list[i]).position === 'fixed' &&
            list[i].getBoundingClientRect().height > 0) { ad = list[i]; break; }
      }
      if (!ad) return;
      var b = btn.getBoundingClientRect();
      var a = ad.getBoundingClientRect();
      if (a.top <= 0) return;                /* top-anchored: no band below */
      if (b.top < window.innerHeight && b.bottom > a.top) {
        window.scrollBy({
          top: (b.bottom - a.top) + 14,
          behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth'
        });
      }
    }, 380);
  }, true);
})();

;

(function(){
  "use strict";
  /* EDITOR GUARD — same reason as every other observing block */
  if (window.self !== window.top) return;

  var DATA_URLS = [
    "https://wainblatrobert.github.io/Aroidpedia/climate.json",
    "https://raw.githubusercontent.com/wainblatrobert/Aroidpedia/main/docs/climate.json"
  ];
  var UNIT_KEY = "apclim-unit";
  var MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  /* ---- data, fetched once per page ---- */
  var dataPromise = null;
  function climData(){
    if (window.APCLIM_DATA) return Promise.resolve(window.APCLIM_DATA);
    if (!dataPromise){
      dataPromise = DATA_URLS.reduce(function(p, url){
        return p.then(function(d){
          if (d) return d;
          return fetch(url, {mode:"cors"})
            .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
            .catch(function(){ return null; });   /* optional, never fatal */
        });
      }, Promise.resolve(null));
    }
    return dataPromise;
  }

  /* v87: the per-species Köppen/elevation feed. Fetched once per page,
     optional, never fatal — same contract as climate.json above. */
  var SC_URLS = [
    "https://wainblatrobert.github.io/Aroidpedia/species-climate.json",
    "https://raw.githubusercontent.com/wainblatrobert/Aroidpedia/main/docs/species-climate.json"
  ];
  var scPromise = null;
  function speciesClim(){
    if (!scPromise){
      scPromise = SC_URLS.reduce(function(p, url){
        return p.then(function(d){
          if (d) return d;
          return fetch(url, {mode:"cors"})
            .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
            .catch(function(){ return null; });
        });
      }, Promise.resolve(null));
    }
    return scPromise;
  }

  /* ---- the two display rules (see the block header) ---- */
  function aggregate(entries){
    var strongholds = entries.filter(function(e){ return e.p.warmShare >= 0.5; });
    var mode;
    if (strongholds.length){
      var moist = strongholds.filter(function(e){
        var z = (e.p.warm && e.p.warm.zones) || [];
        return z.length && / Moist$/.test(z[0][0]);
      });
      mode = (moist.length * 2 >= strongholds.length) ? "warmMoist" : "warm";
    } else {
      mode = "ff";
    }
    /* returns the variant AND its own pixel weight — the zones must be
       pooled by the pixels actually being read, not the whole unit's:
       China is 14k pixels but its warmMoist slice is 1% of them, and
       weighting by the unit would let that 1% speak with 14k voices */
    function pick(p){
      var v, share;
      if (mode === "warmMoist" && p.warmMoist){ v = p.warmMoist; share = p.wmShare; }
      else if (mode !== "ff" && p.warm){ v = p.warm; share = p.warmShare; }
      else if (p.ff && p.ffShare >= 0.10){ v = p.ff; share = p.ffShare; }
      else { v = p.all; share = 1; }
      return { v: v, w: Math.max(1, (p.n || 1) * (share || 0)) };
    }
    var chosen = entries.map(function(e){ return pick(e.p).v; });
    /* corroborated extremes: with >= 3 places, the 2nd-most-extreme */
    var k = entries.length >= 3 ? 1 : 0;
    function nth(vals, hi){
      var a = vals.slice().sort(function(x, y){ return x - y; });
      return hi ? a[Math.max(0, a.length - 1 - k)] : a[Math.min(k, a.length - 1)];
    }
    function med(vals){
      var a = vals.slice().sort(function(x, y){ return x - y; });
      var h = a.length >> 1;
      return a.length % 2 ? a[h] : (a[h - 1] + a[h]) / 2;
    }
    var agg = { tnLo:[], txHi:[], tnMed:[], txMed:[], rhLo:[], rhHi:[] };
    for (var m = 0; m < 12; m++){
      agg.tnLo.push(nth(chosen.map(function(v){ return v.tnLo[m]; }), false));
      agg.txHi.push(nth(chosen.map(function(v){ return v.txHi[m]; }), true));
      /* v3: the typical-day band — the MEDIAN across places of each
         place's median-pixel day. Extremes corroborate; typicals
         average out. Works on every climate.json since 1.0.0. */
      agg.tnMed.push(med(chosen.map(function(v){ return v.tnMed[m]; })));
      agg.txMed.push(med(chosen.map(function(v){ return v.txMed[m]; })));
      /* v2: humidity is the TYPICAL daily swing — the median cell's
         afternoon low and dawn high (rhLo50/rhHi50, climate.json
         ≥ 1.3.0). Falls back to the p05/p95 envelope on older data. */
      agg.rhLo.push(nth(chosen.map(function(v){ return (v.rhLo50 || v.rhLo)[m]; }), false));
      agg.rhHi.push(nth(chosen.map(function(v){ return (v.rhHi50 || v.rhHi)[m]; }), true));
    }
    /* pooled zone chips, weighted by each chosen variant's own pixels */
    var zw = {}, tot = 0;
    entries.forEach(function(e){
      var pk = pick(e.p);
      (pk.v.zones || []).forEach(function(z){ zw[z[0]] = (zw[z[0]] || 0) + z[1] * pk.w; tot += z[1] * pk.w; });
    });
    var zones = Object.keys(zw).map(function(nm){ return [nm, zw[nm] / tot]; })
      .sort(function(a, b){ return b[1] - a[1]; }).slice(0, 3)
      .filter(function(z){ return z[1] >= 0.10; });
    /* v80: the per-place variant, so the rest-season calendar reads
       THE SAME GROUND the charts do. Without this it would apply its
       own ladder and a card could show a warmMoist chart beside an
       all-derived season. */
    var parts = entries.map(function(e){
      /* v84: lat rides along so the calendar can tell which hemisphere
         the species is native to (needs climate.json >= 1.8.0) */
      return { tag: e.tag, n: e.p.n, v: pick(e.p).v, lat: e.p.lat };
    });
    return { mode: mode, agg: agg, zones: zones, trimmed: k > 0, parts: parts };
  }

  /* ---- rendering ---- */
  function cToF(c){ return c * 9 / 5 + 32; }
  function fmtT(c, unit){ return Math.round(unit === "F" ? cToF(c) : c); }

  function el(tag, cls, text){
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* one band chart: 12 columns, lo/hi series, gridlines at domain
     min / mid / max, month initials, invisible hover columns. Returns
     the <svg> plus the hover rects so the caller can wire readouts. */
  function bandChart(lo, hi, domainMin, domainMax, fmt, css, label, opts){
    opts = opts || {};
    var W = 300, H = 84, padL = 26, padR = 4, top = 6, bot = 70;
    var x = function(m){ return +(padL + m * (W - padL - padR) / 11).toFixed(1); };
    var y = function(v){
      return +(top + (domainMax - v) / (domainMax - domainMin) * (bot - top)).toFixed(1);
    };
    var i, up = [], down = [];
    for (i = 0; i < 12; i++) up.push(x(i) + "," + y(hi[i]));
    for (i = 11; i >= 0; i--) down.push(x(i) + "," + y(lo[i]));
    var mid = Math.round((domainMin + domainMax) / 2);
    var g = "";
    [domainMax, mid, domainMin].forEach(function(v){
      g += '<line class="apclim-grid" x1="' + padL + '" y1="' + y(v) + '" x2="' + (W - padR) + '" y2="' + y(v) + '"/>' +
           '<text class="apclim-ylab" x="' + (padL - 4) + '" y="' + (y(v) + 2.4) + '" text-anchor="end">' + fmt(v) + "</text>";
    });
    /* v3: typical-day band inside the envelope */
    var inner = "";
    if (opts.inLo && opts.inHi){
      var iu = [], idn = [];
      for (i = 0; i < 12; i++) iu.push(x(i) + "," + y(opts.inHi[i]));
      for (i = 11; i >= 0; i--) idn.push(x(i) + "," + y(opts.inLo[i]));
      inner = '<polygon class="apclim-band--' + css + '-in" points="' + iu.join(" ") + " " + idn.join(" ") + '"/>';
    }
    /* v3: hairline at the current month, so "now" is findable */
    var nowLine = "";
    if (typeof opts.now === "number"){
      var nx = x(opts.now);
      nowLine = '<line class="apclim-now" x1="' + nx + '" y1="' + top + '" x2="' + nx + '" y2="' + bot + '"/>';
    }
    var months = "";
    for (i = 0; i < 12; i++){
      months += '<text class="apclim-mlab' + (i === opts.now ? " apclim-mlab--now" : "") + '" x="' + x(i) + '" y="' + (H - 3) + '" text-anchor="middle">' + MONTHS[i].charAt(0) + "</text>";
    }
    var colW = +((W - padL - padR) / 11).toFixed(1);
    var cols = "";
    for (i = 0; i < 12; i++){
      var cx = Math.max(padL, Math.min(W - padR - colW, x(i) - colW / 2));
      cols += '<rect class="apclim-col" data-m="' + i + '" x="' + cx + '" y="0" width="' + colW + '" height="' + H + '"/>';
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", label);
    svg.innerHTML =
      g +
      '<polygon class="apclim-band--' + css + '" points="' + up.join(" ") + " " + down.join(" ") + '"/>' +
      inner + nowLine +
      '<polyline class="apclim-edge--' + css + '" points="' + up.join(" ") + '"/>' +
      '<polyline class="apclim-edge--' + css + '" points="' + down.slice().reverse().join(" ") + '"/>' +
      months + cols;
    return svg;
  }

  function niceDomain(min, max, step){
    return [Math.floor(min / step) * step, Math.ceil(max / step) * step];
  }

  function basisText(mode){
    if (mode === "warmMoist") return "clipped to warm moist zones (≥50 °F)";
    if (mode === "warm")      return "clipped to warm zones (≥50 °F)";
    return "frost-free areas of the tagged range";
  }

  /* ================================================================
     THE REST-SEASON CALENDAR  (card v80, 8.17.26)

     Answers "when does this rest, and when is it growing" from
     climate.json 1.7.0's prMed (median monthly rainfall, mm).

     ⚠ WHY RAINFALL AND NOT THE HUMIDITY ALREADY ON THIS CARD: dew
     point derived from vapour pressure tracks the daily MINIMUM
     temperature almost exactly — overnight cooling drives air to
     near saturation — so a dry season inferred from it is a
     temperature season wearing another name. Ogun, Nigeria showed
     2.7 C of dew amplitude against 2.1 C of tmin: no signal. Its
     rainfall runs 13 mm in January against 233 mm in June. 55% of
     the 712 places had dawn RH pinned at 100% for 9+ months.

     ⚠ AMORPHOPHALLUS ONLY, and it is NOT a dormancy prediction. The
     grower's ruling, 8.17.26: everwet Sumatran and Bornean species
     (gigas, beccarii, asper, hottae…) go dormant ANYWAY. So this
     reports whether the ENVIRONMENT supplies a cue, never whether
     the plant rests — which is why the no-season branch says the
     plant keeps its own schedule instead of inventing a window.
     ================================================================ */
  var REST_TUNING = { DRY_MM: 85, COLD_HI: 18, COLD_LO: 8, CUT: 0.35, STRONG: 0.62,
                      MIN_WIN: 2 };
  /* MIN_WIN: a one-month "season" is noise, not phenology. Four species
     produced them at this dry line (Alocasia alba, and three DR Congo
     Amorphophallus whose driest month is 55 mm); they read better as
     no season at all than as a one-month dormancy claim. */
  /* ⚠ IN bandChart's 300-UNIT SPACE, NOT 560. The values the grower
     tuned were set in a 560-unit viewBox; each is scaled by 300/560 =
     0.5357 so what renders on screen is IDENTICAL and the two charts
     share one coordinate system. 6.5 -> 3.48 still draws 3.49 px in a
     301 px panel. Do not round these back to neat numbers. */
  var REST_LOOK = { hatchSize: 3.48, hatchDensity: 1.1, hatchAngle: -45,
                    hatchAlpha: 0.65, bandTint: 0.11, curveWidth: 1.74, height: 60 };
  var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  /* ── DOCUMENTED FLOWERING ─────────────────────────────────────────
     Surveyed from the Amorphophallus post bodies (they are the only
     place this exists — no feed carries it) and then read one by one.
     The miner alone was wrong in BOTH directions: it flagged four of
     the best sources because the sentence also mentions fruiting, and
     it passed "flowering Oct., Bosser 18117 (P, inflor.)" as clean
     when that is a herbarium sheet. Rejected outright: single dated
     events, glasshouse flowerings (cirrifer flowered in APRIL in
     EUROPE), and one explicitly speculative "presumably flowering".

     [firstMonth, lastMonth, the sentence it rests on] — 0 = January.
     ⚠ 12 of 110 posts. The import is at a-i, so this grows on its own;
     absence is normal and must never read as an error. */
  var FLOWERING = {
    "AMORPHOPHALLUS BOGNERIANUS": [4, 5, "Flowering: May-June."],
    "AMORPHOPHALLUS BULBIFER": [3, 5, "Inflorescences typically appears in April-June."],
    "AMORPHOPHALLUS CALCICOLUS": [5, 6, "Flowering from June to July."],
    "AMORPHOPHALLUS CARNOSUS": [4, 5, "Phenology: Flowering: May-June."],
    "AMORPHOPHALLUS CAUDATUS": [2, 3, "Observed flowering in March–April, and fruiting in late April–May."],
    "AMORPHOPHALLUS COMMUTATUS": [4, 5, "Phenology: Flowering: May-June."],
    "AMORPHOPHALLUS DRACONTIOIDES": [11, 1, "Flowers from December through the end of February."],
    "AMORPHOPHALLUS DUMBOI": [7, 3, "Observed in flower from August to April."],
    "AMORPHOPHALLUS FALLAX": [4, 5, "Flowers from May to June and fruits in June and July."],
    "AMORPHOPHALLUS FLAMMEUS": [2, 3, "Observed flowering in March–April, and fruiting in late April–May."],
    "AMORPHOPHALLUS FLOTOI": [3, 7, "Flowers from April to August and fruits from (May–)October to December."],
    "AMORPHOPHALLUS FONTARUMII": [4, 5, "Flowering from May to June."]
  };
  var HEMI_KEY = "ap-clim-hemi";

  function clamp01(x){ return x < 0 ? 0 : x > 1 ? 1 : x; }

  /* deepest circular run at or above a cut — NOT the longest. West
     Africa's real lean season is the Harmattan; a longer, shallower
     shoulder also clears the cut, and a longest-run rule reported
     Amorphophallus gracilior SIX MONTHS OUT. Depth is the signal. */
  function restRun(series, cut){
    var on = series.map(function(r){ return r >= cut; });
    var all = true, any = false, i;
    for (i = 0; i < 12; i++){ if (on[i]) any = true; else all = false; }
    if (all || !any) return null;
    var best = null;
    for (var s2 = 0; s2 < 12; s2++){
      if (!on[s2] || on[(s2 + 11) % 12]) continue;
      var len = 0, sum = 0;
      while (on[(s2 + len) % 12] && len < 12){ sum += series[(s2 + len) % 12]; len++; }
      var depth = sum / len;
      if (!best || depth > best.depth) best = { start: s2, len: len, depth: depth };
    }
    return best;
  }

  /* parts = [{tag, n, v}] — the SAME variant aggregate() picked for
     the charts, so the season and the curves describe one ground. */
  function restSeason(parts){
    var usable = parts.filter(function(p){ return p.v && p.v.prMed && p.v.prMed.length === 12; });
    if (!usable.length) return null;                     /* pre-1.7.0 data */
    var per = usable.map(function(p){
      var dry = p.v.prMed.map(function(mm){
        return clamp01((REST_TUNING.DRY_MM - mm) / REST_TUNING.DRY_MM); });
      var cold = p.v.tnMed.map(function(t){
        return clamp01((REST_TUNING.COLD_HI - t) /
               Math.max(1, REST_TUNING.COLD_HI - REST_TUNING.COLD_LO)); });
      /* ⚠ SEASONAL EXCESS, not absolute level. A rest season is a
         CONTRAST: Amhara's nights sit at 12-16 C every month, so an
         absolute cold stress never fell below 0.22 there and dragged
         Aug-Oct into a season that is really Nov-Mar. The floor is
         SUBTRACTED and the range is NOT rescaled, so magnitude
         survives and an everwet place still scores zero. */
      function floor(a){
        var lo = Math.min.apply(null, a);
        return a.map(function(x){ return x - lo; });
      }
      var dryEx = floor(dry), coldEx = floor(cold);
      return { tag: p.tag, pr: p.v.prMed, tn: p.v.tnMed, dry: dryEx, cold: coldEx,
               rest: dryEx.map(function(d, m){ return Math.max(d, coldEx[m]); }) };
    });
    function avg(key){
      var out = [];
      for (var m = 0; m < 12; m++){
        var t = 0;
        for (var i = 0; i < per.length; i++) t += per[i][key][m];
        out.push(t / per.length);
      }
      return out;
    }
    var rest = avg("rest"), dry = avg("dry"), cold = avg("cold"), tn = avg("tn");
    var peak = Math.max.apply(null, rest);
    /* ⚠ ONE number gates both the classification and the window. They
       were 0.30 and 0.35 and six species fell in the gap: called
       seasonal, then no month cleared the cut, and the callout
       dereferenced a null window. */
    var CUT = REST_TUNING.CUT;
    var cls = peak >= Math.max(CUT, REST_TUNING.STRONG) ? "STRONG"
            : peak >= CUT ? "WEAK" : "ASEASONAL";
    var cued = cls !== "ASEASONAL";
    var win = cued ? restRun(rest, CUT) : null;
    if (win && win.len < REST_TUNING.MIN_WIN) win = null;
    if (!win) { cued = false; cls = "ASEASONAL"; }
    var dSum = 0, cSum = 0;
    if (win) for (var k2 = 0; k2 < win.len; k2++){
      var mm2 = (win.start + k2) % 12; dSum += dry[mm2]; cSum += cold[mm2];
    }
    var driver = !win ? null : dSum > cSum * 1.4 ? "dry" : cSum > dSum * 1.4 ? "cold" : "both";
    /* mean of the PER-PLACE minima, matching how the stress is built —
       min-of-the-mean-series contradicted its own chart on species
       spanning one wet place and one dry one. */
    function meanOf(fn){
      var t = 0;
      for (var i = 0; i < per.length; i++) t += fn(per[i]);
      return Math.round(t / per.length);
    }
    /* NATIVE HEMISPHERE — mean latitude of the tagged places.
       ⚠ LATITUDE, not the warmest month: derived from temperature the
       sign is wrong for 15 of the 110 species, because within a few
       degrees of the equator the annual temperature peak is noise.
       Pre-1.8.0 data carries no lat, and then nothing votes and the
       card behaves exactly as it did before. */
    var lats = usable.map(function(p){ return p.lat; })
                     .filter(function(v){ return typeof v === "number"; });
    var meanLat = lats.length
      ? lats.reduce(function(a, b){ return a + b; }, 0) / lats.length : null;
    return {
      meanLat: meanLat, nativeSouth: meanLat != null && meanLat < 0,
      hasLat: lats.length > 0,
      rest: rest, cls: cls, cued: cued, win: win, driver: driver, peak: peak,
      grow: cued ? restRun(rest.map(function(r){ return 1 - r; }), 1 - CUT) : null,
      driestMm: meanOf(function(p){ return Math.min.apply(null, p.pr); }),
      wettestMm: meanOf(function(p){ return Math.max.apply(null, p.pr); }),
      coldestC: Math.round(Math.min.apply(null, tn)),
      places: per.length
    };
  }

  function shiftM(i, by){ return (i + by + 12) % 12; }
  /* ⚠ THE ZERO POINT IS THE NATIVE CALENDAR, NOT THE NORTHERN ONE.
     The months computed from climate.json are the real months at the
     native locality. A reader in the SAME hemisphere reads them as-is;
     one in the opposite hemisphere is six months out. The old code
     took a bare "south" boolean and always treated N as the zero,
     which shifted every southern-native species backwards for exactly
     the readers it suits. */
  function restShift(cal, south){
    return (south === !!cal.nativeSouth) ? 0 : 6;
  }
  function restRange(w, off){
    var st = shiftM(w.start, off);
    return MON[st] + "–" + MON[shiftM(st, w.len - 1)];
  }
  function restPhrase(cal, south){
    if (!cal.cued){
      return { lean: "No lean season", grow: "Growing weather all year",
        body: "Its wild range never dries out — the driest month still averages " +
              cal.driestMm + " mm of rain — so the weather never signals a rest. " +
              "Plants still go down, on their own schedule." };
    }
    var what = cal.driver === "cold" ? "coolest"
             : cal.driver === "dry" ? "driest" : "coolest and driest";
    var detail = cal.driver === "cold"
      ? "nights fall to about " + cal.coldestC + " °C"
      : "rain drops to about " + cal.driestMm + " mm a month, from " + cal.wettestMm +
        " mm at the peak" + (cal.driver === "both"
          ? ", and nights to about " + cal.coldestC + " °C" : "");
    return {
      lean: "Lean season " + restRange(cal.win, restShift(cal, south)),
      grow: cal.grow ? "Most likely to be actively growing " + restRange(cal.grow, restShift(cal, south))
                     : "Growing the rest of the year",
      body: "Where it grows wild this is the " + what + " stretch of the year — " + detail + "."
    };
  }

  /* ── the curve ──────────────────────────────────────────────────
     THE YEAR IS A CIRCLE. Each month owns a slot of width W/12 and is
     drawn at its slot CENTRE, and the path runs through months -2..13
     (the same values, wrapped) clipped to the frame. x=0 and x=W then
     interpolate the SAME Dec-Jan pair, so the two edge heights are
     equal BY CONSTRUCTION — a Nov-Mar season reads as one winter
     instead of two humps. */
  /* Geometry is bandChart's, exactly: same viewBox, same padding, same
     x() — so a month sits at the same screen column in both charts and
     the eye can run straight down. */
  function restChart(cal, south){
    var W2 = 300, PADL = 26, PADR = 4, TOP = 5, BOT = 49, H2 = REST_LOOK.height;
    var uid = "r" + (restChart.n = (restChart.n || 0) + 1);
    var STEP = (W2 - PADL - PADR) / 11;
    function xm(m){ return +(PADL + m * STEP).toFixed(2); }
    /* rest[] is an ABSOLUTE stress, so no amplitude rescaling: a flat
       species draws flat because its numbers are flat. */
    function yOf(v){ return +(BOT - (BOT - TOP) * v).toFixed(2); }
    var y = cal.rest.map(function(r){ return 0.06 + 0.88 * Math.min(1, r); });
    function at(i){ return [xm(i), yOf(y[((i % 12) + 12) % 12])]; }
    /* the curve is still drawn through wrapped neighbours (-2..13) so
       the Dec->Jan slope is continuous; it is clipped to the plot, and
       the two visible ends are genuinely January and December, exactly
       as the temperature chart's are. */
    var d = "M" + at(-2)[0] + " " + at(-2)[1];
    for (var i = -2; i < 13; i++){
      var p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      d += "C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(2) + " " +
                 (p1[1] + (p2[1] - p0[1]) / 6).toFixed(2) + "," +
                 (p2[0] - (p3[0] - p1[0]) / 6).toFixed(2) + " " +
                 (p2[1] - (p3[1] - p1[1]) / 6).toFixed(2) + "," +
                 p2[0] + " " + p2[1];
    }
    var words = !cal.cued ? ["", ""]
              : cal.driver === "cold" ? ["cool", "cool"]
              : cal.driver === "dry" ? ["dry", "dry"] : ["dry", "cool"];
    /* the tile follows WORD LENGTH — a flat multiplier was calibrated
       for a three-letter word and made "cool" overlap. */
    var chars = Math.max(words[0].length, words[1].length) || 3;
    var tw = (1.1667 * chars * REST_LOOK.hatchSize) / REST_LOOK.hatchDensity;
    var th = (1.25 * REST_LOOK.hatchSize) / REST_LOOK.hatchDensity;
    function hatchText(x, yy, w){
      return '<text x="' + x.toFixed(2) + '" y="' + yy.toFixed(2) + '" font-size="' +
        REST_LOOK.hatchSize + '" font-family="Helvetica Neue, Helvetica, Arial" ' +
        'fill="rgba(175,192,144,' + REST_LOOK.hatchAlpha + ')">' + w + '</text>';
    }
    /* ⚠ NOTHING is drawn when there is no lean season: a full-width
       fill is the SAME MARK as the lean band and would read as "the
       whole year is lean" — the opposite of the finding. */
    var band = "";
    function monthsInWin(w){
      var out = [], st = shiftM(w.start, restShift(cal, south));
      for (var q = 0; q < w.len; q++) out.push((st + q) % 12);
      return out;
    }
    if (cal.win){
      monthsInWin(cal.win).forEach(function(m){
        var x0 = Math.max(PADL, xm(m) - STEP / 2);
        var x1 = Math.min(W2 - PADR, xm(m) + STEP / 2);
        var w = (x1 - x0).toFixed(2);
        band += '<rect x="' + x0.toFixed(2) + '" y="' + TOP + '" width="' + w +
          '" height="' + (BOT - TOP) + '" fill="rgba(175,192,144,' + REST_LOOK.bandTint + ')"/>' +
          '<rect x="' + x0.toFixed(2) + '" y="' + TOP + '" width="' + w +
          '" height="' + (BOT - TOP) + '" fill="url(#p' + uid + ')"/>';
      });
    }
    /* ── v83: DOCUMENTED FLOWERING ──────────────────────────────────
       Two rules with a fill between, and a ribbon along the top so the
       span reads at a glance. Deliberately UNHATCHED: the hatch means
       "lean", and reusing it here would say the two spans are the same
       kind of claim. One is measured climate, the other is a sentence
       somebody published.
       ⚠ NOT hemisphere-shifted — see the file header. */
    var flowMarks = "";
    if (cal.flow){
      /* v84: shifted by the SAME offset as the lean season — the
         grower's ruling. The record's value is its RELATIONSHIP to the
         cycle ("flowers as the dry season ends"), so it has to travel
         with that season rather than stay pinned or move blindly. The
         habitat months stay visible in the line below the chart. */
      var fo = restShift(cal, south);
      var fa = shiftM(cal.flow[0], fo), fb = shiftM(cal.flow[1], fo);
      var fx0 = Math.max(PADL, xm(fa) - STEP / 2);
      var fx1 = Math.min(W2 - PADR, xm(fb) + STEP / 2);
      /* a span that wraps the year end draws as two pieces, exactly as
         the lean band does */
      var pieces = (fb >= fa) ? [[fx0, fx1]]
        : [[fx0, W2 - PADR], [PADL, Math.min(W2 - PADR, xm(fb) + STEP / 2)]];
      pieces.forEach(function(p){
        flowMarks += '<rect x="' + p[0].toFixed(2) + '" y="' + TOP + '" width="' +
          (p[1] - p[0]).toFixed(2) + '" height="' + (BOT - TOP) +
          '" fill="rgba(243,241,234,.05)"/>' +
          '<rect x="' + p[0].toFixed(2) + '" y="' + TOP + '" width="' +
          (p[1] - p[0]).toFixed(2) + '" height="2.2" fill="rgba(243,241,234,.42)"/>' +
          '<line x1="' + p[0].toFixed(2) + '" y1="' + TOP + '" x2="' + p[0].toFixed(2) +
          '" y2="' + BOT + '" stroke="rgba(243,241,234,.42)" stroke-width="0.7"/>' +
          '<line x1="' + p[1].toFixed(2) + '" y1="' + TOP + '" x2="' + p[1].toFixed(2) +
          '" y2="' + BOT + '" stroke="rgba(243,241,234,.42)" stroke-width="0.7"/>';
      });
    }

    /* v82: the current-month hairline, the same one bandChart draws */
    var now = new Date().getMonth();
    var nowLine = '<line class="apclim-now" x1="' + xm(now) + '" y1="' + TOP +
                  '" x2="' + xm(now) + '" y2="' + BOT + '"/>';
    /* month labels use the temp chart's own class, so size and colour
       match instead of approximating */
    var months = "";
    for (var mm = 0; mm < 12; mm++){
      months += '<text class="apclim-mlab' + (mm === now ? " apclim-mlab--now" : "") +
        '" x="' + xm(mm) + '" y="' + (H2 - 3) + '" text-anchor="middle">' +
        MON[mm].charAt(0) + '</text>';
    }
    /* ── HOVER ────────────────────────────────────────────────────────
       .apclim-col is the temperature chart's own hover column, reused
       so behaviour is identical. <title> stays for assistive tech, but
       the readout below the chart is what a reader actually sees —
       a native tooltip waits about a second and is easy to miss. */
    var MONTH_FULL = ["January","February","March","April","May","June","July",
                      "August","September","October","November","December"];
    var leanSet = cal.win ? monthsInWin(cal.win) : [];
    var growSet = cal.grow ? monthsInWin(cal.grow) : [];
    function stateOf(m){
      if (leanSet.indexOf(m) >= 0) return "lean";
      if (growSet.indexOf(m) >= 0) return "grow";
      return cal.cued ? "between" : "even";
    }
    var hits = "";
    for (var hm = 0; hm < 12; hm++){
      var cx0 = Math.max(PADL, Math.min(W2 - PADR - STEP, xm(hm) - STEP / 2));
      hits += '<rect class="apclim-col" data-m="' + hm + '" x="' + cx0.toFixed(2) +
        '" y="0" width="' + STEP.toFixed(2) + '" height="' + H2 + '">' +
        '<title>' + MONTH_FULL[hm] + " \u00b7 " + restSays(stateOf(hm)) +
        (restInFlower(cal, hm, south) ? " \u00b7 " + restFlowerSays(cal, south) : "") +
        '</title></rect>';
    }
    /* ⚠ NO role="img" HERE. It marks the graphic as one atomic image and
       is why the first attempt's child tooltips never fired. */
    return '<svg viewBox="0 0 ' + W2 + ' ' + H2 + '" aria-label="' +
      (cal.win ? "Rest season through the year" : "No lean season") + '">' +
      '<defs><clipPath id="c' + uid + '"><rect x="' + PADL + '" y="0" width="' +
      (W2 - PADL - PADR) + '" height="' + H2 + '"/></clipPath>' +
      '<pattern id="p' + uid + '" width="' + tw.toFixed(2) + '" height="' + th.toFixed(2) +
      '" patternUnits="userSpaceOnUse" patternTransform="rotate(' + REST_LOOK.hatchAngle + ')">' +
      hatchText(0, th * 0.46, words[0]) + hatchText(tw / 2, th * 0.96, words[1]) +
      '</pattern></defs>' + band + flowMarks + nowLine +
      '<path d="' + d + '" fill="none" stroke="rgba(175,192,144,.85)" stroke-width="' +
      REST_LOOK.curveWidth + '" stroke-linecap="round" clip-path="url(#c' + uid + ')"/>' +
      months + hits + '</svg>';   /* hits LAST so they take the hover */
  }

  function restInFlower(cal, m, south){
    if (!cal.flow) return false;
    var o = restShift(cal, south);
    var a = shiftM(cal.flow[0], o), b = shiftM(cal.flow[1], o);
    return (b >= a) ? (m >= a && m <= b) : (m >= a || m <= b);
  }
  function restFlowerSays(cal, south){
    var o = restShift(cal, south);
    var here = MON[shiftM(cal.flow[0], o)] + "\u2013" + MON[shiftM(cal.flow[1], o)];
    var wild = MON[cal.flow[0]] + "\u2013" + MON[cal.flow[1]];
    /* when the reader's calendar differs from the habitat's, BOTH are
       named: the shifted months are what they should watch for, the
       habitat months are what was actually documented, and collapsing
       the two would assert a record nobody published. */
    return o ? "flowers " + here + " here \u00b7 documented " + wild + " in habitat"
             : "documented to flower " + wild + " in habitat";
  }

  /* what a month means, in words — shared by the tooltip and the readout */
  /* SHORT ENOUGH FOR THE 301px PANEL. The long form truncated to an
     ellipsis on desktop — the same narrow case that caught the callout,
     and for the same reason: the card is two-column at 1280 while a
     phone gets more room. Measured, not guessed. */
  function restSays(st){
    if (st === "lean") return "lean season \u2014 likely dormant outdoors";
    if (st === "grow") return "growing season \u2014 likely in leaf";
    if (st === "between") return "between seasons";
    return "no seasonal cue \u2014 wet all year";
  }
  function restStateOf(cal, m, south){
    function inWin(w){
      if (!w) return false;
      var st = shiftM(w.start, restShift(cal, south));
      for (var q = 0; q < w.len; q++) if ((st + q) % 12 === m) return true;
      return false;
    }
    if (inWin(cal.win)) return "lean";
    if (inWin(cal.grow)) return "grow";
    return cal.cued ? "between" : "even";
  }

  /* the whole block, hemisphere toggle included */
  function buildRest(cal){
    var wrap = el("div", "apclim-rest");
    /* v84: DEFAULT TO THE SPECIES' OWN HEMISPHERE, so the page opens
       on the true documented months rather than on a six-month shift.
       A stored choice still wins — the toggle is about where the READER
       grows, and that does not change from species to species. */
    var south = !!cal.nativeSouth;
    try {
      var pref = localStorage.getItem(HEMI_KEY);
      if (pref === "S") south = true; else if (pref === "N") south = false;
    } catch (e) {}
    var chart = el("div", "apclim-rest__chart");
    var hint = el("div", "apclim-rest__hint");
    var head = el("div", "apclim-rest__head");
    var body = el("div", "apclim-rest__body");
    var note = el("div", "apclim-rest__note",
      "Outdoor growing. This is the lean season where the species grows wild — " +
      "the months when rainfall there is lowest, or nights coldest. Indoors, " +
      "watering and warmth decide when a plant rests, not this calendar.");
    var hemi = el("div", "apclim-rest__hemi");
    var bN = el("button", "apsc-clim__unit", "N");
    var bS = el("button", "apsc-clim__unit", "S");
    bN.type = bS.type = "button";
    /* v81: title alone was not enough — a native tooltip waits about a
       second and is easy to miss. aria-label carries it to assistive
       tech, and the wrapper is labelled so the pair reads as a choice
       rather than two loose letters. */
    bN.title = "Northern hemisphere"; bS.title = "Southern hemisphere";
    bN.setAttribute("aria-label", "Northern hemisphere");
    bS.setAttribute("aria-label", "Southern hemisphere");
    hemi.setAttribute("role", "group");
    hemi.setAttribute("aria-label", "Hemisphere");
    hemi.appendChild(bN); hemi.appendChild(bS);
    var MONTH_FULL2 = ["January","February","March","April","May","June","July",
                       "August","September","October","November","December"];
    function setHint(m){
      /* the flowering fact REPLACES the season line for those months
         rather than being appended: at the 301px desktop panel there is
         room for one clause, and "documented to flower" is the rarer
         and more specific thing to say. */
      hint.textContent = restInFlower(cal, m, south)
        ? MONTH_FULL2[m] + " \u00b7 " + restFlowerSays(cal, south)
        : MONTH_FULL2[m] + " \u00b7 " + restSays(restStateOf(cal, m, south));
    }
    function draw(){
      var p = restPhrase(cal, south);
      chart.innerHTML = restChart(cal, south);
      /* the readout defaults to THIS month rather than sitting empty —
         a reader who never hovers still learns where the plant is now,
         and the row cannot jump height when a hover starts. */
      var nowM = new Date().getMonth();
      setHint(nowM);
      var cols = chart.querySelectorAll(".apclim-col");
      [].forEach.call(cols, function(c){
        var m = +c.getAttribute("data-m");
        c.addEventListener("mouseenter", function(){ setHint(m); });
        c.addEventListener("focus", function(){ setHint(m); });
      });
      chart.addEventListener("mouseleave", function(){ setHint(nowM); });
      head.innerHTML = "";
      var b = el("b", "", p.lean);
      head.appendChild(b);
      head.appendChild(el("span", "apclim-rest__bar", "|"));
      head.appendChild(el("span", "apclim-rest__grow", p.grow));
      body.textContent = p.body;
      bN.setAttribute("aria-pressed", south ? "false" : "true");
      bS.setAttribute("aria-pressed", south ? "true" : "false");
      if (cal.hasLat){
        var nat = cal.nativeSouth ? "southern" : "northern";
        nativeLine.textContent = restShift(cal, south)
          ? "Native to the " + nat + " hemisphere \u00b7 months shifted to yours"
          : "Native to the " + nat + " hemisphere";
      } else nativeLine.textContent = "";
      if (flowLine){
        var fs2 = restFlowerSays(cal, south);
        flowLine.textContent = fs2.charAt(0).toUpperCase() + fs2.slice(1) + ".";
      }
    }
    function setHemi(v){
      south = v;
      try { localStorage.setItem(HEMI_KEY, v ? "S" : "N"); } catch (e) {}
      draw();
    }
    bN.addEventListener("click", function(){ setHemi(false); });
    bS.addEventListener("click", function(){ setHemi(true); });
    var top = el("div", "apclim-rest__top");
    top.appendChild(el("span", "apsc-clim__sub", "rest season"));
    top.appendChild(hemi);
    /* a chart that re-phases itself per species must say so */
    var nativeLine = el("div", "apclim-rest__native");
    /* built here, TEXT SET IN draw() — anything that must follow the
       hemisphere toggle has to be written inside the redraw, not once
       at construction. */
    var flowLine = cal.flow ? el("div", "apclim-rest__flower") : null;
    if (flowLine) flowLine.title = cal.flow[2];   /* the source sentence */
    wrap.appendChild(top);
    wrap.appendChild(nativeLine);
    wrap.appendChild(chart);
    wrap.appendChild(hint);
    wrap.appendChild(head);
    wrap.appendChild(body);
    if (flowLine) wrap.appendChild(flowLine);
    wrap.appendChild(note);
    draw();
    return wrap;
  }

  function buildRow(res, version, placeCount, forCultivar, fellBackTo, restCal){
    var row = el("div", "apsc-fact apsc-fact--clim");
    /* v68: on a cultivar the map is gone but this chart stays, because
       the wild parent's climate is the one thing on the page a grower
       can act on. It is relabelled so it can never read as the clone's
       own range - it is where the mother species grows.
       v71: same honesty for the containing-place fallback - the label
       names the place actually measured, so a country-scale envelope
       can never be read as the province's own. */
    var climLabel = el("div", "apsc-fact__label",
      forCultivar ? "Climate range · parent species"
                  : (fellBackTo ? "Climate range · " + fellBackTo
                                : "Climate range"));
    row.appendChild(climLabel);
    var val = el("div", "apsc-fact__value");
    row.appendChild(val);

    var box = el("div", "apsc-clim");
    box.setAttribute("data-apclim-data", version || "?");
    box.setAttribute("data-apclim-basis", res.mode);
    val.appendChild(box);

    var unit = "F";
    try { unit = localStorage.getItem(UNIT_KEY) === "C" ? "C" : "F"; } catch (e) {}
    var NOW = new Date().getMonth();

    /* v6: THE SMALL-SCREEN SINGLE-CHART SWITCH (user request
       8.15.26). Every element of the block is tagged __t or __h; in
       the condensed media (and ONLY there — the switch is
       display:none outside it) [data-apclim-view] shows one side at
       a time. The °F/°C pills ride the temperature header, so the
       humidity view hides them with it. */
    var sw = el("div", "apsc-clim__switch");
    var swT = el("button", "apsc-clim__swbtn", "Temp");
    var swH = el("button", "apsc-clim__swbtn", "Humidity");
    swT.type = swH.type = "button";
    function setView(v){
      box.setAttribute("data-apclim-view", v);
      swT.setAttribute("aria-pressed", v === "t" ? "true" : "false");
      swH.setAttribute("aria-pressed", v === "h" ? "true" : "false");
    }
    swT.addEventListener("click", function(){ setView("t"); });
    swH.addEventListener("click", function(){ setView("h"); });
    sw.appendChild(swT); sw.appendChild(swH);
    box.appendChild(sw);
    setView("t");

    /* temperature header: sub-label + toggle, then the readout */
    var rowT = el("div", "apsc-clim__row apsc-clim__t");
    rowT.appendChild(el("span", "apsc-clim__sub", "temperature"));
    var units = el("span", "apsc-clim__units");
    var btnF = el("button", "apsc-clim__unit", "°F");
    var btnC = el("button", "apsc-clim__unit", "°C");
    btnF.type = btnC.type = "button";
    units.appendChild(btnF); units.appendChild(btnC);
    rowT.appendChild(units);
    box.appendChild(rowT);
    var readT = el("div", "apsc-clim__read apsc-clim__t");
    box.appendChild(readT);
    var chartT = el("div", "apsc-clim__t");
    box.appendChild(chartT);
    /* v4: the inner band needs naming — a two-swatch key, always
       visible, so "typical day" is a legend entry, not a secret */
    var legend = el("div", "apsc-clim__legend apsc-clim__t");
    legend.appendChild(el("span", "apsc-clim__key apsc-clim__key--env"));
    legend.appendChild(el("span", null, "range"));
    legend.appendChild(el("span", "apsc-clim__key apsc-clim__key--typ"));
    legend.appendChild(el("span", null, "typical day"));
    box.appendChild(legend);

    /* humidity header + readout. "daily swing" is load-bearing: the
       dry-season afternoon dip is real (the air's moisture holds, the
       temperature soars) and without the label a 40% low reads as
       "the humidity is 40%" */
    var rowH = el("div", "apsc-clim__row apsc-clim__h");
    rowH.appendChild(el("span", "apsc-clim__sub", "humidity · daily swing"));
    box.appendChild(rowH);
    var readH = el("div", "apsc-clim__read apsc-clim__h");
    box.appendChild(readH);
    var chartH = el("div", "apsc-clim__h");
    box.appendChild(chartH);

    /* zone chips */
    if (res.zones.length){
      var zwrap = el("div", "apsc-clim__zones");
      res.zones.forEach(function(z){
        var c = el("span", "apsc-clim__zone", z[0]);
        var pct = el("b", null, Math.round(z[1] * 100) + "%");
        c.appendChild(pct);
        c.title = Math.round(z[1] * 100) + "% of the species' climate-clipped range is " + z[0];
        zwrap.appendChild(c);
      });
      box.appendChild(zwrap);
    }

    /* provenance note — visible basis, full story in the tooltip */
    var note = el("div", "apsc-clim__note",
      "WorldClim 1970–2000 · " + basisText(res.mode) +
      (res.trimmed ? " · extremes corroborated by ≥2 places" : ""));
    note.title =
      "30-year monthly means of daily extremes (WorldClim 2.1, 1970–2000), " +
      "percentile-trimmed across each tagged place's 10-arc-minute grid cells, " +
      "aggregated across " + placeCount + " tagged place(s). Basis: " + basisText(res.mode) +
      (res.trimmed ? "; every shown extreme is corroborated by at least two places." : ".") +
      " Humidity is the typical daily swing — the median cell's brief afternoon " +
      "low to its dawn high, derived from vapour pressure (FAO-56). The air's " +
      "moisture content holds through the dry season; the afternoon dip is the " +
      "temperature peaking, not the air drying out. " +
      "An envelope for the species' range — not a weather report for one site.";
    box.appendChild(note);

    /* v43: SMALL-SCREEN CONDENSE - below 900px of viewport height the
       zone chips and the provenance note hide (CSS) and this (i) dot
       beside the heading carries both on hover; the height they free
       is what lets the ECOLOGY row reach the viewport. Static clones;
       the originals return whenever the viewport is tall. */
    var info = el("span", "apsc-clim__info", "i");
    var infoPop = el("div", "apsc-clim__infopop");
    if (res.zones.length && zwrap){
      var zc = zwrap.cloneNode(true);
      zc.style.margin = "0 0 8px";
      infoPop.appendChild(zc);
    }
    infoPop.appendChild(note.cloneNode(true));
    info.appendChild(infoPop);
    climLabel.appendChild(info);
    /* v7: the dot is the note's only home now, so it must open on
       tap too — hover has no reliable touch analogue. Any outside
       click closes it. */
    info.setAttribute("tabindex", "0");
    info.setAttribute("role", "button");
    info.setAttribute("aria-label", "Data provenance");
    info.addEventListener("click", function(ev){
      ev.stopPropagation();
      info.classList.toggle("is-open");
    });
    document.addEventListener("click", function(){
      if (info.isConnected) info.classList.remove("is-open");
    });

    /* v5: the compact yearly line for the traveling panel — the same
       aggregate, no charts. Its °F/°C pills call the same setUnit as
       the chart row's, so the two toggles can never disagree. */
    var mini = el("div", "apsc-fact apsc-fact--climmini");
    mini.appendChild(el("div", "apsc-fact__label", "Climate"));
    var mval = el("div", "apsc-fact__value");
    mini.appendChild(mval);
    var mbox = el("div", "apsc-clim apsc-clim--mini");
    mval.appendChild(mbox);
    var mrow = el("div", "apsc-clim__row");
    mrow.appendChild(el("span", "apsc-clim__sub", "yearly range"));
    var munits = el("span", "apsc-clim__units");
    var mF = el("button", "apsc-clim__unit", "°F");
    var mC = el("button", "apsc-clim__unit", "°C");
    mF.type = mC.type = "button";
    munits.appendChild(mF); munits.appendChild(mC);
    mrow.appendChild(munits);
    mbox.appendChild(mrow);
    var mread = el("div", "apsc-clim__read");
    mbox.appendChild(mread);

    var a = res.agg;
    var yTn = Math.min.apply(null, a.tnLo), yTx = Math.max.apply(null, a.txHi);
    var yRl = Math.min.apply(null, a.rhLo), yRh = Math.max.apply(null, a.rhHi);

    function tempStr(loC, hiC, u){
      return fmtT(loC, u) + "–" + fmtT(hiC, u) + " °" + u;
    }
    function setMonth(m){
      if (m == null){
        readT.textContent = tempStr(yTn, yTx, unit);
        readH.textContent = yRl + "–" + yRh + "% RH";
      } else {
        readT.textContent = MONTHS[m] + " · " + tempStr(a.tnLo[m], a.txHi[m], unit) +
          (a.tnMed ? " · typ " + fmtT(a.tnMed[m], unit) + "–" + fmtT(a.txMed[m], unit) + "°" : "");
        readH.textContent = MONTHS[m] + " · " + a.rhLo[m] + "–" + a.rhHi[m] + "% RH";
      }
    }
    function wireHover(svg){
      svg.addEventListener("mouseover", function(ev){
        var t = ev.target;
        if (t && t.getAttribute && t.hasAttribute("data-m")) setMonth(+t.getAttribute("data-m"));
      });
      svg.addEventListener("mouseleave", function(){ setMonth(null); });
    }

    function render(){
      btnF.setAttribute("aria-pressed", unit === "F" ? "true" : "false");
      btnC.setAttribute("aria-pressed", unit === "C" ? "true" : "false");
      mF.setAttribute("aria-pressed", unit === "F" ? "true" : "false");
      mC.setAttribute("aria-pressed", unit === "C" ? "true" : "false");
      mread.textContent = tempStr(yTn, yTx, unit) + " · " + yRl + "–" + yRh + "% RH";
      var conv = unit === "F" ? cToF : function(c){ return c; };
      var step = unit === "F" ? 10 : 5;
      var d = niceDomain(conv(yTn), conv(yTx), step);
      var svgT = bandChart(
        a.tnLo.map(conv), a.txHi.map(conv), d[0], d[1],
        function(v){ return Math.round(v) + "°"; },
        "t", "Monthly temperature range, " + tempStr(yTn, yTx, unit),
        { inLo: a.tnMed.map(conv), inHi: a.txMed.map(conv), now: NOW });
      chartT.innerHTML = ""; chartT.appendChild(svgT); wireHover(svgT);
      var svgH = bandChart(
        a.rhLo, a.rhHi, 0, 100,
        function(v){ return v + "%"; },
        "h", "Monthly humidity range, " + yRl + " to " + yRh + " percent",
        { now: NOW });
      chartH.innerHTML = ""; chartH.appendChild(svgH); wireHover(svgH);
      setMonth(null);
    }
    function setUnit(u){
      unit = u;
      try { localStorage.setItem(UNIT_KEY, u); } catch (e) {}
      render();
    }
    btnF.addEventListener("click", function(){ setUnit("F"); });
    btnC.addEventListener("click", function(){ setUnit("C"); });
    mF.addEventListener("click", function(){ setUnit("F"); });
    mC.addEventListener("click", function(){ setUnit("C"); });
    render();
    /* v80: AMORPHOPHALLUS ONLY — the genus is tuberous and seasonal,
       and the grower asked for the two monthly charts to collapse to
       the existing Temp/Humidity switch here so the calendar has the
       room. data-apclim-collapse un-gates that switch from its
       short-viewport media query; everything else is untouched. */
    if (restCal){
      box.setAttribute("data-apclim-collapse", "1");
      box.appendChild(buildRest(restCal));
    }
    return { row: row, mini: mini };
  }

  /* ---- find the card, read its chips, insert the rows ----
     v5: keyed per CARD MOUNT, not per .apsc-facts — the v35 card
     renders TWO facts panels (follow + rest) and the old per-rail
     loop would have processed each independently. */
  function augment(){
    var mounts = document.querySelectorAll("[data-apsc-mount]");
    [].forEach.call(mounts, function(mount){
      if (mount.getAttribute("data-apclim-done")) return;
      if (!mount.querySelector(".apsc-facts")) return;   /* card not built yet */

      var distRow = null;
      [].forEach.call(mount.querySelectorAll(".apsc-facts .apsc-fact"), function(r){
        var l = r.querySelector(".apsc-fact__label");
        if (!distRow && l && /^distribution$/i.test(l.textContent.replace(/\s+/g, " ").trim())) distRow = r;
      });
      if (!distRow){ mount.setAttribute("data-apclim-done", "1"); return; }

      /* solid chips only: --off has no shape (and so no climate entry),
         --continent is not a place, --doubtful is a doubtful-presence
         record and must not shape the climate envelope (v50), and
         --parent is only there for orientation (v66) - averaging the
         whole of Thailand back in would undo exactly the precision the
         Kanchanaburi tag just bought. */
      var chips = distRow.querySelectorAll("a.apsc-chip:not(.apsc-chip--off):not(.apsc-chip--continent):not(.apsc-chip--doubtful):not(.apsc-chip--parent)");
      var places = [].map.call(chips, function(c){
        return c.textContent.replace(/\s+/g, " ").trim();
      }).filter(Boolean);
      if (!places.length){ mount.setAttribute("data-apclim-done", "1"); return; }

      /* marked done BEFORE the fetch resolves, so a second augment()
         pass during the network wait cannot insert a twin row */
      mount.setAttribute("data-apclim-done", "1");

      climData().then(function(cd){
        if (!cd || !cd.places) return;
        if (!distRow.isConnected) return;       /* card was rebuilt/navigated away */
        var entries = places.map(function(t){ return { tag: t, p: cd.places[t] }; })
          .filter(function(x){ return x.p; });
        /* v71: FALL BACK TO THE CONTAINING PLACE when the finer tags have
           no climate row yet. climate.json is 1.4.0/146 places, built
           before the level-4 expansion took shapes.json past 700, so a
           province usually has no data - and once a subunit tag replaced
           the country as the lit place, EIGHT live posts silently lost
           their chart entirely (measured: gallowayi, glaucophyllus,
           gliruroides, glossophyllus, gomboczianus, gracilior, gracilis,
           hohenackeri). A country-scale envelope is a real answer for a
           grower; no chart is not. The parent pills are already in the
           DOM, so no new plumbing - and the label says which place was
           measured, so this can never masquerade as the subunit's own.
           Self-healing: the day climate.json gains the province, the
           precise row wins and the fallback stops firing. */
        var fellBackTo = null;
        if (!entries.length){
          var pchips = distRow.querySelectorAll("a.apsc-chip--parent");
          var pnames = [].map.call(pchips, function(c){
            return c.textContent.replace(/\s+/g, " ").trim();
          }).filter(Boolean);
          entries = pnames.map(function(t){ return { tag: t, p: cd.places[t] }; })
            .filter(function(x){ return x.p; });
          if (entries.length){
            fellBackTo = entries.map(function(x){ return x.tag; }).join(" · ");
          }
        }
        if (!entries.length) return;
        var res = aggregate(entries);
        /* v68: the card hides the Distribution row on a cultivar
           (.apsc-fact--muted) - that same flag tells us to relabel */
        var forCultivar = !!(distRow.classList &&
                             distRow.classList.contains("apsc-fact--muted"));
        /* v80: the rest-season calendar, Amorphophallus only. The
           genus comes off the post title — the card mount carries no
           genus of its own, and the h1 is what the runhead reads too.
           A cultivar gets it as well: its parent species is the thing
           the chart already describes. */
        var ttl = document.querySelector("h1, .apsc-runhead");
        var isAmorph = /^\s*amorphophallus\b/i.test(
          (ttl && ttl.textContent ? ttl.textContent : "").replace(/\s+/g, " "));
        var restCal = null;
        if (isAmorph && res.parts && res.parts.length){
          try { restCal = restSeason(res.parts); } catch (e) { restCal = null; }
        }
        /* v83: the documented flowering span, keyed on the post title.
           A cultivar title ("... 'Something'") simply will not match,
           which is correct — the record is about the wild species. */
        if (restCal){
          var key = ((ttl && ttl.textContent) || "").replace(/\s+/g, " ").trim().toUpperCase();
          restCal.flow = FLOWERING[key] || null;
        }
        var built = buildRow(res, cd.version, entries.length,
                             forCultivar, fellBackTo, restCal);
        /* v5 placement: the yearly line travels with Distribution in
           the follow panel; the charts row heads the rest panel. On
           pre-v35 markup (one panel, no --follow) the charts row
           falls back to the old spot under Distribution and no
           yearly line is added — there is nothing traveling to
           summarize for. */
        var follow = distRow.closest(".apsc-facts--follow");
        var rest = follow && follow.parentNode ? follow.parentNode.querySelector(".apsc-facts--rest") : null;
        if (follow && rest){
          follow.appendChild(built.mini);
          rest.insertBefore(built.row, rest.firstChild);
        } else {
          distRow.parentNode.insertBefore(built.row, distRow.nextSibling);
        }
        if (window.console && console.info){
          console.info("[climate range] climate.json v" + (cd.version || "?") + " · " +
            entries.length + " place(s) · basis " + res.mode + " · v5 " +
            (follow && rest ? "split panels" : "single panel"));
        }

        /* v87: KÖPPEN ZONES + AT ITS ELEVATION, from species-climate.json.
           The key is the binomial off the post title, exactly as the feed
           builds it; a cultivar title ("… 'Aurora'") never matches, which
           is correct — and show:false (the feed's own honesty floor) means
           no zones line rather than a thin guess. Both lines land inside
           the chart box THIS pass just appended, so there is no orphan
           slot for a later fetch to miss (the v35/v36 rule). */
        (function(){
          if (forCultivar) return;
          var raw = ((ttl && ttl.textContent) || "").replace(/\s+/g, " ").trim();
          if (!raw || raw.indexOf("'") >= 0 || raw.indexOf("\u2018") >= 0 ||
              raw.indexOf("\u2019") >= 0 || raw.indexOf("*") >= 0) return;
          var w = raw.split(" ");
          if (w.length < 2) return;
          var key = w[0].charAt(0).toUpperCase() + w[0].slice(1).toLowerCase() +
                    " " + w.slice(1).join(" ").toLowerCase();
          var box = built.row.querySelector(".apsc-clim") || built.row;
          speciesClim().then(function(sc){
            var e = sc && sc.species && sc.species[key];
            if (!e || !box.isConnected) return;
            function line(label, text){
              var d = document.createElement("div");
              d.className = "apclim-kz";
              var l = document.createElement("span");
              l.className = "apclim-kz__label";
              l.textContent = label;
              var t = document.createElement("span");
              t.className = "apclim-kz__val";
              t.textContent = text;
              d.appendChild(l); d.appendChild(t);
              box.appendChild(d);
            }
            var drew = false;
            if (e.show !== false && e.koppen && e.koppen.length){
              var mix = e.koppen.filter(function(k){ return k[1] >= 0.05; })
                .slice(0, 3).map(function(k){
                  return k[2] + " " + Math.round(k[1] * 100) + "%";
                }).join(" \u00b7 ");
              if (mix){ line("CLIMATE ZONES", mix); drew = true; }
            }
            if (e.elev && e.koppenElev && e.koppenElev.length &&
                e.tnElev != null && e.txElev != null){
              var band = e.elev[0] === e.elev[1]
                ? "AT " + e.elev[0] + " M"
                : "AT " + e.elev[0] + "\u2013" + e.elev[1] + " M";
              var top = e.koppenElev[0];
              line(band, "nights to " + e.tnElev + " \u00b0C \u00b7 days to " +
                   e.txElev + " \u00b0C \u00b7 " + top[2] + " " +
                   Math.round(top[1] * 100) + "%");
              drew = true;
            }
            if (drew){
              var fine = document.createElement("div");
              fine.className = "apclim-kz__fine";
              fine.textContent = "K\u00f6ppen mix of the tagged range\u2019s own pixels" +
                (e.elev ? "; the altitude line reads only the range\u2019s " +
                          "pixels inside the stated band" : "") +
                " \u2014 species-climate v" + (sc.version || "?");
              box.appendChild(fine);
              if (window.console && console.info){
                console.info("[species climate] v" + (sc.version || "?") +
                             " \u00b7 " + key + (e.elev ? " \u00b7 elev " +
                             e.elev.join("\u2013") + " m" : ""));
              }
            }
          });
        })();
      });
    });
  }

  /* The card builds asynchronously (it waits on its own fetches), so
     augment on the ready events AND watch for the rail to appear.
     The observer stays attached: Squarespace ajax nav (mercury:load)
     replaces the article, and the new card must get its row too. The
     per-rail data-apclim-done attribute keeps every pass idempotent. */
  var scheduled = false;
  function schedule(){
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function(){ scheduled = false; augment(); });
  }
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", schedule);
  } else {
    schedule();
  }
  window.addEventListener("load", schedule);
  document.addEventListener("mercury:load", schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();

;

(function(){
  "use strict";

  var RM = window.matchMedia &&
           window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var RAIL_MIN_WIDTH = 820;
  /* When the rail appears, measured from the first section's bottom edge
     and expressed as a FRACTION OF THE VIEWPORT — not pixels. A banner
     hero is a percentage of the screen, so a fixed pixel offset lands at
     a different point in the composition on every monitor.
        0     the moment the hero has fully cleared
     -0.25    a quarter-screen early  <- current
     +0.1     a beat after it clears                                   */
  var REVEAL_OFFSET_VH = -0.25;
  /* Labels longer than this wrap in the gutter. Trimmed on a word
     boundary rather than mid-word. */
  var MAX_LABEL = 22;

  /* PRIMARY LABEL SOURCE — keyed by the section h2's id.
     ADD A SECTION -> ADD A LINE. See the header for the fallbacks. */
  var HUB_URL = "https://www.aroidpedia.com/aroid-pollination";

  var LABELS = {
    /* ---- the Alocasia pollination page ---- */
    "apol-p1":     "Anatomy",
    "apol-p2":     "The zones",
    "apol-p3":     "The clock",
    "apol-p4":     "Fly, heat, scent",
    "apol-p5":     "Reading yours",
    "apol-p6":     "Pollen",
    "apol-p7":     "The cross",
    "apol-p8":     "Berries",
    "apol-p9":     "Inside the fruit",
    "apol-p10":    "Seed",
    "apol-p11":    "When it fails",
    "apol-p12":    "What crosses",
    "apol-refs":   "Sources",
    /* ---- the /aroid-pollination hub ---- */
    "apoh-primer": "The inflorescence",
    "apoh-heat":   "Heat & scent",
    "apoh-types":  "Seven questions",
    "apoh-index":  "Genus index",
    "apoh-words":  "The words",
    /* ---- the Amorphophallus pollination page (new in v4) ---- */
    "apam-p1":     "Anatomy",
    "apam-p2":     "The genus",
    "apam-p3":     "The clock",
    "apam-p4":     "The furnace",
    "apam-p5":     "The smell",
    "apam-p6":     "Who comes",
    "apam-p7":     "Reading yours",
    "apam-p8":     "Pollen",
    "apam-p9":     "The cross",
    "apam-p10":    "Fruit & seed",
    "apam-p11":    "The corm",
    "apam-p12":    "When it fails",
    "apam-refs":   "Sources",
    /* ---- the Philodendron pollination page (new in v7) ----
       Blocks 02-09 exist as of 2026-08-02; p9 onward are listed
       ahead of time so that shipping a later part needs no nav
       re-paste. An id with no matching section on the page simply
       draws no tick, which is how apam-* was staged too. */
    "aphi-p1":     "Anatomy",
    "aphi-p2":     "The genus",
    "aphi-p3":     "The clock",
    "aphi-p4":     "The furnace",
    "aphi-p5":     "The chamber",
    "aphi-p6":     "The reward",
    "aphi-p7":     "Who comes",
    "aphi-p8":     "Reading yours",
    "aphi-p9":     "Pollen",
    "aphi-p10":    "The cross",
    "aphi-p11":    "Fruit & seed",
    "aphi-p12":    "When it fails",
    "aphi-refs":   "Sources",

    /* ---- the Anthurium reproduction page (new in v10) ----
       Fourteen ticks. All fourteen blocks exist as of 2026-08-05,
       so unlike the apam-* and aphi-* stagings above nothing here
       is listed ahead of time. */
    "apan-open":   "What is here",
    "apan-p1":     "The flower",
    "apan-p2":     "The genus",
    "apan-p3":     "The clock",
    "apan-p4":     "What it offers",
    "apan-p5":     "The smell",
    "apan-p6":     "Who comes",
    "apan-p7":     "Reading yours",
    "apan-p8":     "Pollen",
    "apan-p9":     "The cross",
    "apan-p10":    "Fruit and seed",
    "apan-p11":    "What crosses",
    "apan-p12":    "When it fails",
    "apan-refs":   "Sources",

    /* ---- the Arum reproduction page (new in v11) ----
       Fourteen ticks. All fourteen blocks exist as of 2026-08-06.
       NOTE the numbering runs p1..p12 then src, NOT refs - the Arum
       sources block uses id apar-src to match its own file. Do not
       "correct" it to apar-refs; the id in the block is what the
       rail matches on. */
    "apar-open":   "What is here",
    "apar-p1":     "The inflorescence",
    "apar-p2":     "The genus",
    "apar-p3":     "The clock",
    "apar-p4":     "The trap",
    "apar-p5":     "The smell",
    "apar-p6":     "The heat",
    "apar-p7":     "Who comes",
    "apar-p8":     "What they get",
    "apar-p9":     "Reading yours",
    "apar-p10":    "Pollen & the cross",
    "apar-p11":    "Fruit and seed",
    "apar-p12":    "When it fails",
    "apar-src":    "Sources",

    /* ---- the Monstera reproduction page (new in v12) ----
       Thirteen ticks. All thirteen blocks exist as of 2026-08-07,
       so nothing is staged. NOTE the sources id is apmo-src, the
       Arum convention, NOT -refs. */
    "apmo-open":   "One flower",
    "apmo-p1":     "The flower",
    "apmo-p2":     "The genus",
    "apmo-p3":     "The chamber",
    "apmo-p4":     "The clock",
    "apmo-p5":     "The heat",
    "apmo-p6":     "The smell",
    "apmo-p7":     "Who comes",
    "apmo-p8":     "The other bisexuals",
    "apmo-p9":     "Self and cross",
    "apmo-p10":    "The fruit",
    "apmo-p11":    "What nobody knows",
    "apmo-src":    "Sources",

    /* ---- the Spathiphyllum reproduction page (new in v13) ----
       Eleven ticks. All twelve blocks exist as of 2026-08-13, so
       nothing is staged. Sources id is apsp-src. */
    "apsp-open":   "What is here",
    "apsp-p1":     "The flower",
    "apsp-p2":     "The genus",
    "apsp-p3":     "The perfume bees",
    "apsp-p4":     "The correction",
    "apsp-p5":     "Two systems",
    "apsp-p6":     "The smell",
    "apsp-p7":     "The clock",
    "apsp-p8":     "Self and cross",
    "apsp-p9":     "What nobody knows",
    "apsp-src":    "Sources",

    /* ---- the Arisaema reproduction page (new in v62) ----
       Eleven ticks. All twelve blocks exist as of 2026-08-13, so
       nothing is staged. Sources id is apai-src.
       ⚠ The prefix is apai-, NOT apar- — apar- is Arum. */
    "apai-open":   "What is here",
    "apai-p1":     "The trap",
    "apai-p2":     "The wax",
    "apai-p3":     "The door",
    "apai-p4":     "No heat",
    "apai-p5":     "Sex by size",
    "apai-p6":     "What lures them",
    "apai-p7":     "The nursery",
    "apai-p8":     "How rare a visit",
    "apai-p9":     "What nobody knows",
    "apai-src":    "Sources",
    /* ---- the chromosomes-and-crossing page ---- */
    "apcx-open":   "What is here",
    "apcx-p1":     "The number",
    "apcx-p2":     "The family",
    "apcx-p3":     "The walls",
    "apcx-p4":     "The offspring",
    "apcx-refs":   "Sources"
  };

  /* FOOTER BUILD (nav v14): the rail element is created here, not
     shipped as HTML - this injection renders on EVERY page and only
     guide pages should grow a rail. Deliberately NO id="pnRail": a
     stale per-page copy's getElementById must never grab this one.
     data-apnav marks it as the sitewide copy for the sweep below. */
  console.info("[apnav] section nav v14 (sitewide, footer FILE v41)");
  var rail = document.createElement("nav");
  rail.className = "pn-rail";
  rail.setAttribute("aria-label", "Page sections");
  rail.setAttribute("data-apnav", "footer");
  rail.setAttribute("data-apnav-version", "v14");
  rail.innerHTML = '<i class="pn-rail__line" aria-hidden="true"></i>' +
                   '<i class="pn-rail__fill" aria-hidden="true"></i>';
  var chapters = [];
  var heroBottom = 0;
  var revealAt = 0;
  var portalled = false;
  /* Why the rail is not showing, in words. Read it in the console with
     `apPollinationNav.why()` — an empty rail should never be a mystery. */
  var reason = "not built yet";

  function portal(){
    if (portalled || !document.body) return;
    document.body.appendChild(rail);
    portalled = true;
  }

  function docTop(el){
    var t = 0;
    while (el) { t += el.offsetTop; el = el.offsetParent; }
    return t;
  }

  function trim(s){
    s = String(s || "").replace(/\s+/g, " ").trim();
    if (s.length <= MAX_LABEL) return s;
    var cut = s.slice(0, MAX_LABEL);
    var sp = cut.lastIndexOf(" ");
    return (sp > 8 ? cut.slice(0, sp) : cut).replace(/[\s,.;:—-]+$/, "");
  }

  function labelFor(node){
    /* an explicit data-apol-nav="..." always wins — it is the only
       source for a section that has no heading to read */
    var explicit = node.getAttribute && node.getAttribute("data-apol-nav");
    if (explicit) return trim(explicit);

    var id = node.id;
    if (id && LABELS[id]) return LABELS[id];
    /* the reading path already names this section */
    if (id) {
      var row = document.querySelector('.apol-path__link[href="#' + id + '"] .apol-path__name');
      if (row) return trim(row.textContent);
    }
    /* last resort — and only from a HEADING. Falling back to
       textContent on a whole `.apol` wrapper would put the entire block
       in the gutter. */
    if (/^H[1-6]$/.test(node.tagName)) return trim(node.textContent);
    return "Section";
  }

  /* Sections are found from the page itself, not from a detector list —
     two markers, matched in ONE querySelectorAll so the result is in
     document order:

       `.apol-h2[id]`      every numbered part block carries one
       `[data-apol-nav]`   an explicit opt-in for a section with no
                           heading of its own

     v2 ADDED THE SECOND ONE. The reading-path block (01 OPENING v3)
     has no heading at all — its title moved to the banner hero — so
     under v1 it was invisible to the rail. On a page carrying only the
     hero and the intro that meant ZERO chapters and a permanently
     empty rail, which is exactly what it looked like: nothing.

     Deduped by SECTION, so a block with both markers counts once. */
  function detect(){
    var out = [];
    var seen = [];
    [].forEach.call(document.querySelectorAll(".apol-h2[id], [data-apol-nav]"), function(node){
      var sec = node.closest("section.page-section") || node.closest("section") || node;
      if (seen.indexOf(sec) !== -1) return;
      seen.push(sec);
      out.push({ id: node.id || "", el: sec, node: node, label: labelFor(node) });
    });
    return out;
  }

  function build(){
    portal();
    /* MIGRATION SWEEP: while any page still carries the old per-page
       nav code block, its <nav id="pnRail"> would draw a second rail.
       Remove every rail that is not this footer copy - re-run on every
       build (DOMContentLoaded, load, resize, the 2.5s/6s re-measures),
       so a late-injected page copy is swept too. Harmless once the old
       blocks are deleted: the selector then matches nothing. */
    [].forEach.call(document.querySelectorAll(".pn-rail:not([data-apnav])"),
                    function(n){ if (n !== rail) n.remove(); });
    rail.classList.remove("is-ready");
    [].forEach.call(rail.querySelectorAll(".pn-rail__tick"), function(t){ t.remove(); });
    var oldHub = rail.querySelector(".pn-rail__hub");
    if (oldHub) oldHub.remove();
    chapters = [];

    if (window.innerWidth < RAIL_MIN_WIDTH) {
      reason = "viewport is " + window.innerWidth + "px, under the " +
               RAIL_MIN_WIDTH + "px desktop floor — hidden by design";
      return;
    }

    chapters = detect();
    if (chapters.length < 2) {
      /* ONE tick is not a navigation aid, it is decoration. This is the
         expected state on a part-built page: paste more section blocks
         and the rail appears on its own. */
      reason = "found " + chapters.length + " navigable section(s); needs 2. " +
               "Each numbered part block supplies one via its <h2 id>, and the " +
               "intro supplies one via data-apol-nav. Paste more parts.";
      /* LOAD-BEARING — DO NOT DROP THIS LINE.
         `chapters` was just assigned a real, NON-EMPTY array by detect(),
         and we are bailing out BEFORE the loop below that gives each entry
         its `.btn`. update() guards only on `chapters.length`, so with
         exactly ONE detected section it would sail past that guard and
         throw `Cannot read properties of undefined (reading 'classList')`
         on `c.btn` — every scroll frame. Measured on a page carrying just
         the hero and the intro.
         Clearing it restores the invariant update() actually relies on:
         a non-empty `chapters` means every entry is fully built.

         LAW: an early return must not leave half-initialised state where
         another function can see it. Either finish initialising or clear.

         NOTE: `GENUS SECTION NAV 7.29.26 v5.txt` has this same latent
         bug — it only escapes because a genus page always has >= 2
         chapters. Worth fixing there before one ever has exactly one. */
      chapters = [];
      return;
    }
    reason = "ok — " + chapters.length + " sections";
    window.apPollinationNav = API;

    /* The hero is whatever section precedes the first titled section —
       so the rail waits for the banner to clear even though the banner
       carries no .apol-h2 of its own. Falls back to the first titled
       section's own top when there is no hero. */
    var first = chapters[0].el;
    var prev = first.previousElementSibling;
    var heroEl = (prev && prev.matches && prev.matches("section.page-section")) ? prev : null;
    heroBottom = heroEl ? docTop(heroEl) + heroEl.offsetHeight : docTop(first);

    var last = chapters.length - 1;
    chapters.forEach(function(c, i){
      c.top = docTop(c.el);
      c.frac = i / last;                 /* EVEN spacing, like the genus rail */

      var b = document.createElement("button");
      b.type = "button";
      b.className = "pn-rail__tick";
      b.style.top = (c.frac * 100).toFixed(2) + "%";
      b.setAttribute("aria-label", "Go to " + c.label);
      var s = document.createElement("span");
      s.textContent = c.label;
      b.appendChild(s);
      b.addEventListener("click", function(){
        /* NOTE: this site sets scroll-behavior:smooth on the root element, so a
           scripted scrollTo does nothing at all while the tab is not
           compositing. Only matters when debugging in a hidden tab. */
        window.scrollTo({ top: c.top, behavior: RM ? "auto" : "smooth" });
      });
      rail.appendChild(b);
      c.btn = b;
    });

    /* ---- THE HUB MARK ----
       Added last so it sits above every tick in the DOM order too.
       ⚠ Suppressed on the hub itself: that page carries the apoh-* section
       ids, and a rail item linking a page to itself is noise. Genus pages
       use apol-* / apam-* / aphi-*, so the test is simply whether any apoh-
       id is present. This is why the Philodendron page needed no change
       here in v7 — it uses aphi-*, so it gets the rhombus automatically. */
    if (!document.querySelector('[id^="apoh-"]')) {
      var hub = document.createElement("a");
      hub.className = "pn-rail__hub";
      hub.href = HUB_URL;
      hub.setAttribute("aria-label", "Go to the Aroid Reproduction hub");
      var hi = document.createElement("i");
      hi.setAttribute("aria-hidden", "true");
      var hs = document.createElement("span");
      hs.textContent = "Aroid Reproduction Hub";  /* CSS upper-cases it */
      hub.appendChild(hi);
      hub.appendChild(hs);
      rail.appendChild(hub);
    }

    rail.classList.add("is-ready");
    update();
  }

  function update(){
    if (!chapters.length) return;
    var y  = window.scrollY || window.pageYOffset || 0;
    var vh = window.innerHeight;
    var last = chapters.length - 1;
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);

    /* A section is "arrived at" when its top reaches the viewport's
       MIDDLE. idx and progress are measured from the same reference, so
       the fill starts at a true 0 and lands exactly on tick i as
       section i arrives. */
    var arrive = chapters.map(function(c, i){
      return i === 0 ? 0 : Math.min(maxScroll, Math.max(0, c.top - vh * 0.5));
    });
    for (var m = 1; m < arrive.length; m++) {
      if (arrive[m] <= arrive[m - 1]) arrive[m] = arrive[m - 1] + 1;
    }

    var idx = 0;
    for (var i = 0; i < arrive.length; i++) {
      if (y >= arrive[i]) idx = i; else break;
    }

    var start  = arrive[idx];
    var end    = (idx + 1 < arrive.length) ? arrive[idx + 1] : maxScroll;
    var within = Math.min(1, Math.max(0, (y - start) / Math.max(1, end - start)));
    var f = last > 0 ? (idx + within) / last : 1;

    rail.querySelector(".pn-rail__fill").style.height =
      (Math.min(1, Math.max(0, f)) * 100).toFixed(2) + "%";

    chapters.forEach(function(c, i){
      c.btn.classList.toggle("is-passed", i <= idx);
      c.btn.classList.toggle("is-current", i === idx);
    });

    /* Derived here, not at build time, so the offset stays a true
       fraction of the CURRENT viewport through a resize or rotation. */
    revealAt = Math.max(0, heroBottom + REVEAL_OFFSET_VH * vh);
    rail.classList.toggle("is-visible", y >= revealAt);
  }

  var ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){ ticking = false; update(); });
  }

  window.addEventListener("scroll", onScroll, { passive:true });
  window.addEventListener("resize", function(){ build(); }, { passive:true });
  window.addEventListener("load", function(){ build(); });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }

  /* Accordion panels open, images load and the fluid-engine flattening
     lands after first paint, and every tick position derives from those
     heights. Re-measure rather than trusting first paint. */
  setTimeout(build, 2500);
  setTimeout(build, 6000);

  /* `refresh` recomputes without a scroll event — the scroll path is
     rAF-gated and a hidden tab never runs rAF. */
  var API = {
    rebuild:  build,
    refresh:  update,
    chapters: function(){ return chapters.map(function(c){ return c.label; }); },
    revealAt: function(){ return revealAt; },
    why:      function(){ return reason; }
  };
  window.apPollinationNav = API;
})();
