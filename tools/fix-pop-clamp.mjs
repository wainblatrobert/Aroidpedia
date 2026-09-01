/* Two fixes to the (i) pops, both found by measuring rather than looking.

   1. THE POP RAN OFF THE SCREEN. The zones dot sits at the END of a
      wrapping chip row, so on a 390px phone its pop spanned 145..425 —
      35px past the edge. The provenance dot never showed this because
      it sits at the START of a label, where left:-12px is safe. No
      static CSS fixes it: left-anchoring overflows right, right-
      anchoring overflows left, and which one bites depends on where
      the row happened to wrap. So the pop is measured on open and
      nudged back inside.

   2. ONE IMPLEMENTATION, NOT TWO. The provenance dot was built inline
      before makeInfoDot existed. Leaving it there means the clamp fixes
      two dots out of three, and the odd one out is the one that has
      shipped longest. It now goes through the same factory.          */
import fs from 'fs';
const P = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.19.26 v27.txt';
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
let s = fs.readFileSync(P, 'utf8');
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error(`ABORT: "${name}" matched ${n}`); process.exit(1); }
  s = s.replace(f, () => r);
  console.log('  ok: ' + name);
}

/* ── the clamp, inside the factory ── */
cut('clamp',
  `    dot.addEventListener("click", function(ev){
      ev.stopPropagation();
      dot.classList.toggle("is-open");
    });
    document.addEventListener("click", function(){
      if (dot.isConnected) dot.classList.remove("is-open");
    });
    return { dot: dot, pop: pop };`,
  `    /* KEEP THE POP ON SCREEN. Measured on open, because where it
       lands depends on where the chip row wrapped — a static left or
       right anchor is right on one screen and off the edge on the
       next. Reset first, or the previous nudge compounds. */
    function clamp(){
      pop.style.left = "";
      pop.style.right = "auto";
      var r = pop.getBoundingClientRect();
      var pad = 8;
      if (r.right > window.innerWidth - pad){
        pop.style.left = (-12 - (r.right - (window.innerWidth - pad))) + "px";
        r = pop.getBoundingClientRect();
      }
      if (r.left < pad) pop.style.left = (parseFloat(pop.style.left || -12) + (pad - r.left)) + "px";
    }
    function open(){ dot.classList.add("is-open"); clamp(); }
    dot.addEventListener("click", function(ev){
      ev.stopPropagation();
      if (dot.classList.contains("is-open")) dot.classList.remove("is-open");
      else open();
    });
    dot.addEventListener("mouseenter", clamp);   /* hover opens it via CSS */
    dot.addEventListener("keydown", function(ev){
      if (ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); open(); }
      if (ev.key === "Escape") dot.classList.remove("is-open");
    });
    document.addEventListener("click", function(){
      if (dot.isConnected) dot.classList.remove("is-open");
    });
    return { dot: dot, pop: pop };`);

/* ── the provenance dot joins the factory ── */
cut('unify',
  `    var info = el("span", "apsc-clim__info", "i");
    var infoPop = el("div", "apsc-clim__infopop");`,
  `    /* v102: through the same factory as the other two, so the
       on-screen clamp and the keyboard handling are not implemented
       twice — and the dot that has shipped longest is not the one
       missing them. */
    var infoDot = makeInfoDot("Data provenance");
    var info = infoDot.dot, infoPop = infoDot.pop;`);

cut('drop-old-wiring',
  `    info.appendChild(infoPop);
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
    });`,
  `    climLabel.appendChild(info);   /* wiring lives in makeInfoDot */`);

fs.writeFileSync(P, s, 'utf8');
console.log('written');
