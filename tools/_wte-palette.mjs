/* Climate-zone palette. MODE=esri  -> the published World Climate
   Regions colours, sampled off the Esri tile service (Sayre et al.
   2020, the same product our zones come from).
   MODE=tuned (default) -> the SAME hue logic (hot red-brown -> yellow
   -> green -> cyan cold) re-rendered inside the site's own lightness
   and chroma band, so it sits with the rest of the map instead of
   out-shining it. Either way the palette is GLOBAL and fixed: a zone
   is the same colour on every genus page. */
const MODE = process.env.PALETTE || 'tuned';
export const TEMP  = ['Tropical','Sub Tropical','Warm Temperate','Cool Temperate','Boreal','Polar'];
export const MOIST = ['Moist','Dry','Desert'];

/* --- sampled from the published layer, 13-14/14 samples agreeing --- */
const ESRI = {
  'Tropical Moist':'#763d2d',       'Tropical Dry':'#cf784f',        'Tropical Desert':'#e39e78',
  'Sub Tropical Moist':'#ffffbd',   'Sub Tropical Dry':'#fffb74',    'Sub Tropical Desert':'#ffffc4',
  'Warm Temperate Moist':'#d6d681', 'Warm Temperate Dry':'#72a111',  'Warm Temperate Desert':'#e0f13d',
  'Cool Temperate Moist':'#1c7200', 'Cool Temperate Dry':'#adad00',  'Cool Temperate Desert':'#d3e57e',
  'Boreal Moist':'#bcc9c9',         'Boreal Dry':'#c9e3e3',          'Boreal Desert':'#d8ecec',
  /* the published layer paints POLAR from Boreal's own cyan family and
     gives both Temperate Deserts one colour, so two distinctions our
     data makes would vanish. Polar is rotated to a cool violet-blue and
     Cool Temperate Desert toward its own green - same family, still
     legible as "cold" and "arid". */
  'Polar Moist':'#c3c7dc',          'Polar Dry':'#d4d9f0',           'Polar Desert':'#e6eaff',
};
const hex2rgb = h => [1,3,5].map(i => parseInt(h.substr(i,2),16));


/* ---- MODE=aroid : the shipped scheme -------------------------------
   Sayre's structure kept (moisture = the three rows, temperature = the
   ramp) but the TROPICAL row is green, not brown. Grower: "i'm not a
   fan of borneo being brown. it should be the greenest of our colors."
   So Tropical Moist is the deepest, most saturated green in the whole
   palette and everything else is placed against it:
     MOIST   lush green -> lighter green -> HUE BREAK -> teal -> blue ->
             violet, so cold reads cold (grower's earlier note)
     DRY     the ochre family - terracotta savanna to khaki steppe
     DESERT  pale sand and cream, low chroma, deliberately recessive
   Authored in LCh so lightness and chroma stay controlled per row. */
const AROID = {
  /*                        [ L,  C,  H ] */
  'Tropical Moist':         [52, 42, 145],
  'Sub Tropical Moist':     [61, 34, 135],
  'Warm Temperate Moist':   [70, 26, 125],
  'Cool Temperate Moist':   [60, 26, 170],
  'Boreal Moist':           [66, 20, 205],
  'Polar Moist':            [70, 16, 262],
  'Tropical Dry':           [58, 34,  55],
  'Sub Tropical Dry':       [66, 32,  80],
  'Warm Temperate Dry':     [62, 28,  95],
  'Cool Temperate Dry':     [66, 24, 100],
  'Boreal Dry':             [70, 12, 200],
  'Polar Dry':              [74, 10, 265],
  'Tropical Desert':        [70, 22,  50],
  'Sub Tropical Desert':    [74, 18,  75],
  'Warm Temperate Desert':  [73, 18,  95],
  'Cool Temperate Desert':  [74, 14, 105],
  'Boreal Desert':          [76,  8, 200],
  'Polar Desert':           [78,  7, 265],
};

/* --- LCh -> sRGB --- */
const fi = t => t > 6/29 ? t*t*t : 0.12841855 * (t - 4/29);
function lch2rgb(L, C, Hdeg) {
  const h = Hdeg*Math.PI/180, a = Math.cos(h)*C, b = Math.sin(h)*C;
  const fy = (L+16)/116, fx = fy + a/500, fz = fy - b/200;
  const X = 95.047*fi(fx)/100, Y = fi(fy), Z = 108.883*fi(fz)/100;
  const g = v => { v = v <= 0.0031308 ? 12.92*v : 1.055*Math.pow(Math.max(v,0),1/2.4)-0.055;
                   return Math.max(0, Math.min(255, Math.round(v*255))); };
  return [ g( 3.2406*X -1.5372*Y -0.4986*Z),
           g(-0.9689*X +1.8758*Y +0.0415*Z),
           g( 0.0557*X -0.2040*Y +1.0570*Z) ];
}
/* the published scheme's own hue walk, hot -> cold */
const HUE = [ 40, 102, 118, 135, 190, 212 ];
/* moisture rides lightness inside the site's band (its fills run L47-L65) */
const LC  = [ [64,30], [56,20], [48,11] ];

/* esri-muted: the published hues EXACTLY, mixed toward the map's own
   ground so they sit on a dark page instead of glaring off it. Hue
   relationships (and therefore the reading) are unchanged. */
const GROUND = [19, 26, 21], MIX = 0.14;   /* grower: a little lighter */
export function colourFor(t, m, name) {
  if (MODE === 'aroid') {
    const a = AROID[name];
    if (a) return lch2rgb(a[0], a[1], a[2]);
  }
  if (MODE === 'esri' || MODE === 'esri-muted') {
    const c = hex2rgb(ESRI[name] || ESRI[TEMP[t] + ' Dry'] || '#888888');
    if (MODE === 'esri') return c;
    return c.map((v, i) => Math.round(v * (1 - MIX) + GROUND[i] * MIX));
  }
  const [L, C] = LC[m];
  return lch2rgb(L, C, HUE[t]);
}
if (process.argv[1] && process.argv[1].endsWith('_wte-palette.mjs')) {
  const hex = c => '#' + c.map(v => v.toString(16).padStart(2,'0')).join('');
  console.log('MODE =', MODE);
  MOIST.forEach((m, mi) => console.log(m.padEnd(7) + TEMP.map((t, ti) =>
    (t.split(' ').map(w=>w[0]).join('') + ' ' + hex(colourFor(ti, mi, t + ' ' + m))).padEnd(13)).join('')));
}
