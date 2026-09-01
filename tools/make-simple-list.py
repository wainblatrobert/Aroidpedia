# -*- coding: utf-8 -*-
"""A plain by-genus paste list: the 15 outstanding blocks plus the 6 new plates.

⚠ The 6 plate blocks have to be added by hand. make-outstanding-list.py
compares SENTENCES, and a JS-injected figure changes no prose - so a block
that gained only a plate reads as current.
"""
import io, os

OUT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/PASTE LIST BY GENUS 8.28.26.md"

ITEMS = [
 ("Alocasia", [("02  Part I — Anatomy", "new plate"),
               ("14  Sources", "never pasted — 50 refs missing from the page")]),
 ("Amorphophallus", [("11  Part X — Fruit and Seed", "permission line"),
                     ("14  Sources", "spelling")]),
 ("Dieffenbachia", [("02  Part I — The Plant and the Clock", "new plate")]),
 ("Dracunculus", [("02  Part I — The Plant", "new plate"),
                  ("04  Part III — Who Comes", "spelling"),
                  ("08  Sources", "spelling")]),
 ("Helicodiceros", [("02  Part I — The Plant", "new plate")]),
 ("Homalomena", [("02  Part I — The Chamber and the Clock", "new plate")]),
 ("Monstera", [("13  Sources", "permission line")]),
 ("Philodendron", [("02  Part I — Anatomy", "permission line"),
                   ("04  Part III — The Clock", "permission line"),
                   ("05  Part IV — The Furnace", "permission line"),
                   ("07  Part VI — What the Beetle Gets", "permission line"),
                   ("08  Part VII — Who Comes", "permission line"),
                   ("09  Part VIII — Reading It", "permission line"),
                   ("10  Part IX — Pollen", "permission line"),
                   ("14  Sources", "permission line + spelling")]),
 ("Schismatoglottis", [("02  Part I — The Room and the Clock", "new plate")]),
 ("Spathiphyllum", [("09  Part VIII — Self and Cross", "spelling")]),
]

L = ["# PASTE LIST BY GENUS — 8.28.26", "",
     "All reproduction. Morphology is fully current.", ""]
tot = 0
for genus, blocks in ITEMS:
    L.append("## %s  (%d)" % (genus, len(blocks)))
    for name, why in blocks:
        L.append("- [ ] %-38s *%s*" % (name, why))
        tot += 1
    L.append("")
L += ["---", "", "**%d blocks across %d genera.**" % (tot, len(ITEMS)), "",
      "The six *new plate* blocks are the unisexual inflorescence figure —",
      "they replace that guide's existing Part I block.", "",
      "Files are in `G:\\My Drive\\PlantsV2\\Aroidpedia\\WEBSITE\\AROID REPRODUCTION\\<GENUS> REPRODUCTION\\`,",
      "newest version of each."]

open(OUT, "w", encoding="utf-8", newline="\r\n").write("\n".join(L))
print("wrote %s" % os.path.basename(OUT))
print("%d blocks / %d genera" % (tot, len(ITEMS)))
