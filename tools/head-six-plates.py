# -*- coding: utf-8 -*-
"""Give the six new plate blocks an authoring header that says what changed."""
import os, re, glob, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID REPRODUCTION"

NOTE = {
 "ALOCASIA": ("Carries THE DOOR (the constriction) as its own label - this guide\n"
              "     names the constriction 24 times and it is the whole mechanism.\n"
              "     Anchored at Amorphophallus's constriction coordinates."),
 "DIEFFENBACHIA": ("/!\\ NO APPENDIX. Female -> staminodes -> ~440 male units, with\n"
                   "     the male zone at the top. The painting DRAWS an appendix, so the\n"
                   "     label says it is absent - the same fix Philodendron already uses.\n"
                   "     Without it the figure asserts a structure the genus lacks."),
 "DRACUNCULUS": ("The sterile zone is labelled with NO subline: this guide barely\n"
                 "     mentions it, and inventing a description from general knowledge\n"
                 "     is not the same as reporting one."),
 "HELICODICEROS": ("Ties the appendix label to Part V's result - the heat does not\n"
                   "     bring more flies, it aims the ones that come at the appendix.\n"
                   "     Sterile zone left without a subline; the guide barely mentions it."),
 "HOMALOMENA": ("/!\\ NO APPENDIX. An inflated chamber, a narrowing, then a long\n"
                "     chalk-white staminate zone to the tip. Label says so, as\n"
                "     Philodendron's does. THE WAIST is labelled separately because\n"
                "     this guide's whole framing is a room with a doorway."),
 "SCHISMATOGLOTTIS": ("The appendix here is made ENTIRELY of sterile flowers, and only\n"
                      "     in most species - both stated in the label. The female-flower\n"
                      "     label carries the fusion to the spathe wall, which is why the\n"
                      "     fruits present on one side."),
}

HEAD = """<!-- ============================================================
     v%s (2026-08-28) - THE UNISEXUAL PLATE FIGURE
     ============================================================
     Adds the shared plate (diagrams/plate-unisexual-dark.jpg) with a
     label set written for this genus. The image is ALREADY LIVE under
     docs/diagrams/ - nothing to upload.

     ANCHORS ARE NOT NEW. One painting is shared across every guide, so
     every ax/ay/y here is reused verbatim from the plates already on
     Amorphophallus, Arisaema, Arum and Philodendron. Only the words
     differ. If a label ever needs moving, move it in ALL of them.

     %s

     Rendered and checked before delivery: image paints, no label
     overflows the 780x600 overlay, no two labels collide.
     ============================================================
     Previous header follows unchanged:
"""

n = 0
for f in sorted(glob.glob(ROOT + "/*/*02 PART I*8.28.26*.txt")):
    s = open(f, encoding="utf-8", newline="").read()
    if "THE UNISEXUAL PLATE FIGURE" in s:
        print("  already headed: %s" % os.path.basename(f)); continue
    genus = os.path.basename(os.path.dirname(f)).split(" ")[0]
    ver = re.search(r"v(\d+)\.txt$", os.path.basename(f))
    head = HEAD % (ver.group(1) if ver else "?", NOTE.get(genus, ""))
    if not s.startswith("<!--"):
        print("  !! %s does not open with a comment" % os.path.basename(f)); continue
    out = head + "     " + s[len("<!--"):].lstrip("\n")
    open(f, "w", encoding="utf-8", newline="").write(out)
    print("  headed %-32s (+%d bytes)" % (os.path.basename(f)[:32], len(out) - len(s)))
    n += 1

print("\n%d headed" % n)
# verify comments still balance and nothing leaked into the body
for f in sorted(glob.glob(ROOT + "/*/*02 PART I*8.28.26*.txt")):
    s = open(f, encoding="utf-8").read()
    body = re.sub(r"(?s)<!--.*?-->", "", s)
    leak = "THE UNISEXUAL PLATE FIGURE" in body
    print("  %-46s <!-- %d  --> %d  leak:%s"
          % (os.path.basename(f)[:46], s.count("<!--"), s.count("-->"), leak))
