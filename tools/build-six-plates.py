# -*- coding: utf-8 -*-
"""Build the unisexual plate component for the six guides that lack one.

All six are unisexual-flowered, so all six take plate-unisexual-dark.jpg.
The image is already live under docs/diagrams/ - nothing to upload.

ANCHORS ARE NOT INVENTED. The overlay is one shared painting, so every
label reuses the exact ax/ay/y already used by Amorphophallus, Arisaema,
Arum and Philodendron. Only the words change.

    APPENDIX        r  y150  ax387 ay164
    MALE FLOWERS    r  y250  ax386 ay253
    STERILE ZONE    r  y325  ax387 ay327
    FEMALE FLOWERS  r  y410  ax387 ay412   (412/414 both in use)
    SPATHE          l  y175  ax311 ay175
    CONSTRICTION    l  y330  ax352 ay347   (Amorphophallus only, so far)
    THE CHAMBER     l  y420  ax337 ay424   (y432/ay430 when a constriction
                                            label sits above it)
    PEDUNCLE        l  y533  ax378 ay535

⚠ TWO GENERA HAVE NO APPENDIX and the painting draws one. Dieffenbachia
runs female -> staminodes -> ~440 male units with the male zone at the top;
Homalomena is an inflated chamber, a narrowing, then "a long chalk-white
staminate zone" to the tip. Both say so in the label, the way Philodendron
already does. Without that the drawing asserts a structure the genus lacks.

⚠ WHERE A GUIDE IS SILENT, THE LABEL IS SILENT. Dracunculus and
Helicodiceros barely mention their sterile zone, so it is named without a
claim rather than given a subline invented from general knowledge.
"""
import os, re, glob, sys, io, json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
APPLY = "--apply" in sys.argv
ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID REPRODUCTION"
SCRATCH = ("C:/Users/nli0490/AppData/Local/Temp/claude/"
           "C--Users-nli0490-Claude/f35a1d61-1b66-4fc0-be7b-d93b45b553e9/scratchpad")
RQ = "\u2019"          # curly apostrophe, as the existing plates use
MID = " \u00b7 "

A = dict(APPENDIX=("r", 150, 387, 164), MALE=("r", 250, 386, 253),
         STERILE=("r", 325, 387, 327), FEMALE=("r", 410, 387, 412),
         SPATHE=("l", 175, 311, 175), CONSTRICTION=("l", 330, 352, 347),
         CHAMBER=("l", 420, 337, 424), CHAMBER_LOW=("l", 432, 337, 430),
         PEDUNCLE=("l", 533, 378, 535))


def lab(key, t, subs):
    side, y, ax, ay = A[key]
    return {"side": side, "y": y, "ax": ax, "ay": ay, "t": t, "s": subs}


ALT = ("Cutaway painting of an aroid inflorescence: the spathe opened to show, "
       "top to bottom, the smooth appendix, golden male flowers, a bristled "
       "sterile zone at the chamber neck, and green female flowers with white "
       "stigmas inside the chamber formed by the spathe tube.")

GUIDES = {
 "ALOCASIA REPRODUCTION": dict(
   cap="THE UNISEXUAL BUILD, ANNOTATED FOR ALOCASIA \u2014 FOUR ZONES AND ONE DOOR",
   labels=[
     lab("APPENDIX", "APPENDIX", ["STERILE \u2014 AND THE ORGAN", "THAT CARRIES THE HEAT"]),
     lab("MALE", "MALE FLOWERS", ["FUSED SYNANDRIA \u00b7 POLLEN SHEDS", "AFTER THE DOOR HAS SHUT"]),
     lab("STERILE", "STERILE ZONE", ["THE INTERSTICE \u2014 WHERE", "THE SPATHE PINCHES IN"]),
     lab("FEMALE", "FEMALE FLOWERS", ["RECEPTIVE FIRST, HIDDEN", "IN THE CLOSED BASE"]),
     lab("SPATHE", "SPATHE", ["ONE MODIFIED LEAF"]),
     lab("CONSTRICTION", "THE DOOR", ["GAPES ABOUT A DAY, THEN SHUTS", "\u2014 BEFORE THE POLLEN SHEDS"]),
     lab("CHAMBER_LOW", "THE CHAMBER", ["THE LOWER SPATHE \u00b7", "WHERE THE FLIES ARE HELD"]),
     lab("PEDUNCLE", "PEDUNCLE", []),
   ]),

 "DIEFFENBACHIA REPRODUCTION": dict(
   cap="THE UNISEXUAL BUILD \u2014 DIEFFENBACHIA HAS NO APPENDIX",
   labels=[
     lab("APPENDIX", "APPENDIX", ["NOT IN DIEFFENBACHIA \u2014", "THE MALE ZONE RUNS TO THE TIP"]),
     lab("MALE", "MALE FLOWERS", ["ABOUT 440 MALE UNITS \u00b7", "POLLEN ON DAY 3"]),
     lab("STERILE", "STERILE ZONE", ["THE STAMINODES \u2014 THE BEETLES" + RQ,
                                     "FOOD, AND WHY THEY STAY"]),
     lab("FEMALE", "FEMALE FLOWERS", ["ABOUT 77 \u00b7 RECEPTIVE", "FROM THE SECOND EVENING"]),
     lab("SPATHE", "SPATHE", ["CLOSES OVER THE FRUIT", "AND STAYS SHUT FOR MONTHS"]),
     lab("CHAMBER", "THE CHAMBER", ["WHERE THE BEETLES GO", "ON THE SECOND EVENING"]),
     lab("PEDUNCLE", "PEDUNCLE", []),
   ]),

 "DRACUNCULUS REPRODUCTION": dict(
   cap="THE UNISEXUAL BUILD, ANNOTATED FOR DRACUNCULUS",
   labels=[
     lab("APPENDIX", "APPENDIX", ["LONGER THAN THE SPATHE", "THAT HOLDS IT"]),
     lab("MALE", "MALE FLOWERS", ["POLLEN \u00b7 SHED SECOND"]),
     lab("STERILE", "STERILE ZONE", []),
     lab("FEMALE", "FEMALE FLOWERS", ["RECEPTIVE FIRST"]),
     lab("SPATHE", "SPATHE", ["DEEP LIVER-MAROON,", "STRONGLY RIBBED INSIDE"]),
     lab("CHAMBER", "THE CHAMBER", ["THE SPATHE TUBE \u00b7", "WHERE THE FLIES ARE HELD"]),
     lab("PEDUNCLE", "PEDUNCLE", []),
   ]),

 "HELICODICEROS REPRODUCTION": dict(
   cap="THE UNISEXUAL BUILD, ANNOTATED FOR HELICODICEROS",
   labels=[
     lab("APPENDIX", "APPENDIX", ["BRISTLED, LAID ALONG THE LIMB \u2014", "THE HEAT AIMS FLIES AT IT"]),
     lab("MALE", "MALE FLOWERS", ["POLLEN \u00b7 SHED ON DAY 2"]),
     lab("STERILE", "STERILE ZONE", []),
     lab("FEMALE", "FEMALE FLOWERS", ["RECEPTIVE ON DAY 1 \u2014", "THE ONLY MORNING THAT COUNTS"]),
     lab("SPATHE", "SPATHE", ["HELD ALMOST HORIZONTAL,", "FLESH-PINK AND WRINKLED"]),
     lab("CHAMBER", "THE CHAMBER", ["WHERE THE FLIES ARE HELD", "THROUGH THE FIRST DAY"]),
     lab("PEDUNCLE", "PEDUNCLE", []),
   ]),

 "HOMALOMENA REPRODUCTION": dict(
   cap="THE UNISEXUAL BUILD \u2014 HOMALOMENA HAS NO APPENDIX",
   labels=[
     lab("APPENDIX", "APPENDIX", ["NOT IN HOMALOMENA \u2014 THE STAMINATE", "ZONE RUNS TO THE TIP"]),
     lab("MALE", "MALE FLOWERS", ["CHALK-WHITE \u00b7 AMBER RESIN", "IN THE GROOVES"]),
     lab("STERILE", "STERILE ZONE", ["A BAND OF STAMINODES \u2014", "THE BEETLES" + RQ + " FOOD"]),
     lab("FEMALE", "FEMALE FLOWERS", ["PACKED INTO THE", "INFLATED CHAMBER"]),
     lab("SPATHE", "SPATHE", ["A HOOD ABOVE,", "A ROOM BELOW"]),
     lab("CONSTRICTION", "THE WAIST", ["IT DIVIDES THE ROOM", "FROM THE HOOD"]),
     lab("CHAMBER_LOW", "THE CHAMBER", ["A ROOM WITH A DOORWAY"]),
     lab("PEDUNCLE", "PEDUNCLE", []),
   ]),

 "SCHISMATOGLOTTIS REPRODUCTION": dict(
   cap="THE UNISEXUAL BUILD, ANNOTATED FOR SCHISMATOGLOTTIS",
   labels=[
     lab("APPENDIX", "APPENDIX", ["IN MOST SPECIES \u2014 AND MADE", "ENTIRELY OF STERILE FLOWERS"]),
     lab("MALE", "MALE FLOWERS", ["POLLEN NOT RELEASED UNTIL", "THE SECOND MORNING"]),
     lab("STERILE", "STERILE ZONE", ["A BAND ABOVE", "THE FEMALE FLOWERS"]),
     lab("FEMALE", "FEMALE FLOWERS", ["PARTLY FUSED TO THE SPATHE WALL", "\u2014 FRUITS ON ONE SIDE ONLY"]),
     lab("SPATHE", "SPATHE", ["THE LIMB IS SHED WHILE FLOWERING", "\u2014 IT DOES NOT REOPEN"]),
     lab("CONSTRICTION", "THE WAIST", []),
     lab("CHAMBER_LOW", "THE CHAMBER", ["ROLLED TIGHT, AND STAYS ON", "THE PLANT INTO FRUITING"]),
     lab("PEDUNCLE", "PEDUNCLE", []),
   ]),
}

STYLE = open(SCRATCH + "/apxf-style.txt", encoding="utf-8", newline="").read()
SCRIPT = open(SCRATCH + "/apxf-script.txt", encoding="utf-8", newline="").read()
if not STYLE.strip() or not SCRIPT.strip():
    print("FAIL: template missing"); sys.exit(1)

MOUNT = '\n  <figure class="apxf" id="apxf-fig"></figure>\n\n'
ok = 0
for folder, spec in GUIDES.items():
    hits = [f for f in glob.glob(ROOT + "/" + folder + "/*.txt")
            if "02 PART I" in f and "Backup" not in f]
    if len(hits) != 1:
        print("  !! %s: %d candidate blocks" % (folder, len(hits))); continue
    src = hits[0]
    s = open(src, encoding="utf-8", newline="").read()
    if "apxf" in s:
        print("  !! %s already has a plate" % folder); continue

    cfg = {"file": "plate-unisexual-dark.jpg", "cap": spec["cap"],
           "alt": ALT, "labels": spec["labels"], "corner": None}
    script = re.sub(r"var CFG = \{.*?\};",
                    "var CFG = " + json.dumps(cfg, ensure_ascii=False) + ";",
                    SCRIPT, count=1, flags=re.S)
    if "var CFG = {\"file\"" not in script:
        print("  !! %s: CFG substitution failed" % folder); continue

    # mount goes after the lede paragraph
    m = re.search(r'(?s)(<p class="apol-lede">.*?</p>\n)', s)
    if not m:
        print("  !! %s: no apol-lede" % folder); continue
    out = s[:m.end()] + MOUNT + s[m.end():]

    # style + script before the final </div>
    i = out.rstrip().rfind("</div>")
    out = out[:i] + STYLE + "\n\n" + script + "\n\n" + out[i:]

    base = os.path.basename(src)
    newname = re.sub(r"(\d+\.\d+\.\d+) v(\d+)\.txt$",
                     lambda mm: "8.28.26 v%d.txt" % (int(mm.group(2)) + 1), base)
    dst = os.path.join(os.path.dirname(src), newname)
    print("  %-30s -> %s  (+%d bytes, %d labels)"
          % (folder[:30], newname[:52], len(out) - len(s), len(spec["labels"])))
    if APPLY:
        open(dst, "w", encoding="utf-8", newline="").write(out)
        bk = os.path.join(os.path.dirname(src), "Backup")
        os.makedirs(bk, exist_ok=True)
        os.replace(src, os.path.join(bk, base))
    ok += 1

print("\n%d built   [%s]" % (ok, "APPLIED" if APPLY else "DRY RUN"))
