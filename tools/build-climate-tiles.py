#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""CLIMATE TILE PYRAMID  v1  (9.4.26)

   WHY. One world raster cannot serve every zoom. What a view needs is
   DISPLAY PIXELS PER DEGREE, and that rises as the viewBox narrows:
   Monstera's default fit needs ~20 px/deg, six zoom steps in needs 107.
   Shipping the whole planet at the zoomed-in density means decoding
   336 MB to draw a tenth of it (grower: "from a bird's eye view the
   load of pixels could be 4320 and when zooming in we want 12960, a
   dynamic detail load").

   Tiles make the cost follow the WINDOW instead of the zoom: the map
   composites only the tiles its viewBox touches, so memory is roughly
   constant at any zoom and the ceiling moves from "what we are willing
   to ship whole" to "what the source holds".

   ⚠ NO REPROJECTION. The genus map's user space IS [lon, -lat], so a
   tile is simply a lon/lat box - no Mercator, no tile-scheme maths.
   That is the whole reason this is cheap.

   ⚠ PURE CROPS, NEVER A RESAMPLE. Every tile is a nearest-neighbour cut
   of the same source, so the palette carries over byte for byte. The
   zone lookup is by EXACT HEX (climByHex), and re-running the raster
   builder produces a DIFFERENT palette - that trap cost a day already.
   The gate below refuses to write if any tile introduces a colour the
   source does not have.

   LEVELS. Level L is 2^L tiles wide by 2^(L-1) tall, 512 px each, so
   the world is 512 * 2^L px and the resolution is 512 * 2^L / 360
   px/deg. Levels are read from the MANIFEST at runtime, so adding a
   deeper one later is a rebuild plus a redeploy - no code change:

     L=3    4096 px    11.4 px/deg     45.00 deg/tile
     L=4    8192 px    22.8 px/deg     22.50 deg/tile
     L=5   16384 px    45.5 px/deg     11.25 deg/tile
     L=6   32768 px    91.1 px/deg      5.62 deg/tile   needs SC>=16

   The shipped source is SC=12 (25920 px, 72 px/deg), so L=6 is beyond
   it TODAY - upsampling would only invent detail. To go deeper, re-run
   build-wte-raster.mjs with SC=16 (34560 px, 96 px/deg) or SC=24
   (51840, 144) from the WTE shapefiles, drop it in as the source and
   raise TOP. ⚠ Use WTE_BASE=wte_004, not the generalised wte_012 the
   script defaults to, and check the palette against the existing one
   before shipping - the palette module has moved since SC=12 was cut.

   EMPTY TILES ARE NOT WRITTEN. Most of the globe is ocean, which is
   index 0 here; a tile that is entirely index 0 carries no information
   and its absence is recorded by simply not being in the manifest.

   IN : source-rasters/wte-tuned-x12.png   (or SRC=)
   OUT: <site>/public/data/climate-tiles-v1/z<L>/<col>_<row>.png
        <site>/public/data/climate-tiles-v1/manifest.json
        <site>/public/data/climate-zones-readout.png   (2160x1080)
"""
import io, json, os, sys, pathlib, hashlib

sys.stdout.reconfigure(encoding="utf-8")
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

HERE = pathlib.Path(__file__).resolve().parent.parent
SRC = pathlib.Path(os.environ.get("SRC", HERE / "source-rasters" / "wte-tuned-x12.png"))
SITE = pathlib.Path(os.environ.get("SITE", r"C:\Users\nli0490\Claude\aroidpedia-site"))
OUT = SITE / "public" / "data" / "climate-tiles-v1"
TILE = 512
LEVELS = [int(x) for x in os.environ.get("LEVELS", "3,4,5").split(",")]
READOUT = (2160, 1080)

src = Image.open(SRC)
if src.mode != "P":
    sys.exit("ABORT: source is %s, not a palette image - the palette is the contract" % src.mode)
SW, SH = src.size
if SW != SH * 2:
    sys.exit("ABORT: source is %dx%d; the world is 2:1 in plain lon/lat" % (SW, SH))
PAL = src.getpalette()
SRC_IDX = set(src.tobytes())
print("source %dx%d  %.1f px/deg  %d palette indices" % (SW, SH, SW / 360.0, len(SRC_IDX)))

TOP = SW / 360.0
for L in LEVELS:
    ppd = TILE * (2 ** L) / 360.0
    if ppd > TOP + 1e-6:
        sys.exit("ABORT: level %d wants %.1f px/deg and the source holds %.1f. "
                 "Re-cut the source at a higher SC before adding this level." % (L, ppd, TOP))

# the ocean/no-data index: whatever the source's corner holds (0,0 is polar ocean)
EMPTY = src.getpixel((0, 0))
print("empty index = %d (from the source's own corner)" % EMPTY)

OUT.mkdir(parents=True, exist_ok=True)
manifest = {
    "v": 1,
    "generated": os.environ.get("GEN_DATE", "2026-09-04"),
    "note": ("plain lon/lat tile pyramid over the WTE climate raster - no reprojection, "
             "the genus map's user space is already [lon, -lat]. Every tile is a "
             "nearest-neighbour crop of one source, so the palette is identical "
             "everywhere and climByHex still matches on exact hex."),
    "source": "%s (%dx%d, %.1f px/deg)" % (SRC.name, SW, SH, TOP),
    "tile": TILE,
    "empty": EMPTY,
    "levels": [],
}
total_files = total_bytes = 0
for L in LEVELS:
    cols, rows = 2 ** L, 2 ** (L - 1)
    ppd = TILE * cols / 360.0
    span = 360.0 / cols
    # how many source pixels one tile spans
    sx = SW / cols
    if abs(sx - round(sx)) > 1e-9:
        sys.exit("ABORT: level %d does not divide the source evenly (%.4f px)" % (L, sx))
    sx = int(round(sx))
    zdir = OUT / ("z%d" % L)
    zdir.mkdir(exist_ok=True)
    kept, skipped = [], 0
    for r in range(rows):
        for c in range(cols):
            box = (c * sx, r * sx, (c + 1) * sx, (r + 1) * sx)
            crop = src.crop(box)
            idx = set(crop.tobytes())
            if idx == {EMPTY}:
                skipped += 1
                continue
            if not idx <= SRC_IDX:
                sys.exit("ABORT: tile z%d/%d_%d invented an index - crop is not pure" % (L, c, r))
            t = crop.resize((TILE, TILE), Image.NEAREST) if sx != TILE else crop
            t.putpalette(PAL)
            if not set(t.tobytes()) <= SRC_IDX:
                sys.exit("ABORT: tile z%d/%d_%d gained a colour on resize" % (L, c, r))
            p = zdir / ("%d_%d.png" % (c, r))
            t.save(p, optimize=True)
            kept.append("%d_%d" % (c, r))
            total_bytes += p.stat().st_size
    total_files += len(kept)
    manifest["levels"].append({"z": L, "cols": cols, "rows": rows,
                               "span": round(span, 6), "ppd": round(ppd, 4),
                               "tiles": kept})
    print("  z%-2d %4d tiles kept, %4d empty skipped   %6.1f px/deg  %.2f deg/tile"
          % (L, len(kept), skipped, ppd, span))

(OUT / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")

# the READOUT raster: the hover reading and the legend need a stable
# whole-world sample that does NOT change with zoom. Kept separate from
# the display tiles on purpose - coupling them would make the reading
# depend on where the reader had panned.
ro = src.resize(READOUT, Image.NEAREST)
ro.putpalette(PAL)
if not set(ro.tobytes()) <= SRC_IDX:
    sys.exit("ABORT: the readout raster gained a colour")
rp = SITE / "public" / "data" / "climate-zones-readout.png"
ro.save(rp, optimize=True)
print("readout %dx%d -> %d KB (%d indices)"
      % (READOUT[0], READOUT[1], rp.stat().st_size / 1024, len(set(ro.tobytes()))))
print("tiles: %d files, %.1f MB total" % (total_files, total_bytes / 1e6))
