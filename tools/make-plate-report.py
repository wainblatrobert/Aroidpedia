# -*- coding: utf-8 -*-
"""Write the inflorescence-plate coverage report."""
import io

OUT = ("G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID REPRODUCTION/"
       "INFLORESCENCE PLATE REVIEW 8.28.26.md")

DOC = """# THE UNISEXUAL / BISEXUAL PLATES — coverage and labels

Two shared paintings, `diagrams/plate-unisexual-dark.jpg` and
`diagrams/plate-bisexual-dark.jpg`. The hub shows both side by side as
Fig. 1 and Fig. 2 with generic labels; each genus guide that uses one gets
its **own label set**, written for that genus.

Everything currently placed **renders correctly** — checked in a browser,
all painted at 1024×1536.

---

## Who has one

| guide | plate | note |
|---|---|---|
| `/aroid-reproduction` | **both** | Fig. 1 + Fig. 2, generic labels |
| Amorphophallus | unisexual | numbered zones 1–4, richest label set |
| Anthurium | bisexual | |
| Arisaema | unisexual | heavily re-labelled — one-way door, the kettle |
| Arum | unisexual | |
| Monstera | bisexual | "nearly closed — it *is* the chamber" |
| Philodendron | unisexual | "omits the appendix" |
| Spathiphyllum | bisexual | "no chamber in this genus" |

## Who has none

Six genus guides, **all of them unisexual-flowered**, so all six take the
**unisexual** plate:

| guide | evidence from its own text |
|---|---|
| **Alocasia** | "the flowers themselves are unisexual and the plant is monoecious"; appendix ×46, constriction ×24, chamber ×39 |
| **Dieffenbachia** | ~77 female flowers, ~440 male units, staminodes between the zones |
| **Dracunculus** | appendix ×14, chamber ×6 |
| **Helicodiceros** | appendix ×43, chamber ×31 |
| **Homalomena** | "the upper three-fifths is staminate and the lower two-fifths pistillate"; staminodes ×22 |
| **Schismatoglottis** | sterile ×19, appendix ×8, chamber ×6 |

`/chromosomes-and-crossing` carries none of this vocabulary — it is a
cross-cutting topic page and **should not** have a plate.

---

## Labels that would need changing

### ⚠ Two genera have no appendix, and the plate draws one

**Dieffenbachia** and **Homalomena** run female → sterile → male with **no
terminal appendix**. Their guides never mention one. The plate shows an
appendix at the top of the spadix, so the label has to say so — exactly the
way Philodendron already does:

> APPENDIX — *NOT IN PHILODENDRON — THE MALE ZONE HEATS INSTEAD*

Without that, the drawing asserts a structure the genus does not have.
Alocasia, Dracunculus, Helicodiceros and Schismatoglottis all have one, so
they keep the label as written.

### Alocasia should carry the constriction

Its guide names the constriction **24 times** — it is central to how that
chamber closes. Amorphophallus already has a `CONSTRICTION` label; Alocasia
is the other genus that needs it.

### Amorphophallus is the odd one out, twice

- It is the **only plate with no caption**. Every other guide has one
  (`"THE UNISEXUAL BUILD, ANNOTATED FOR ARUM"` and so on). Worth adding for
  consistency.
- It is the only one using **numbered zones** (`1 · PISTILLATE ZONE`). That
  reads as deliberate — the zones are the whole subject there — but it is a
  second divergence and worth a decision rather than an accident.

### The rest check out

Spot-checked against what each guide argues, and they agree:

- Arisaema — *"THIS GENUS NEVER HEATS"* ✓ it is not thermogenic
- Arum — *"THE SIEVE — SORTS BY SIZE, NEVER A ONE-WAY VALVE"* ✓ matches
  Knoll's refutation of the fish-trap model
- Philodendron — *"NOT IN PHILODENDRON — THE MALE ZONE HEATS INSTEAD"* ✓
- Monstera — *"IN MONSTERA: NEARLY CLOSED — IT IS THE CHAMBER"* ✓
- Spathiphyllum — *"NO CHAMBER IN THIS GENUS"*, *"EVERY FLOWER WEARS A
  PERIANTH"* ✓ and correctly **not** claimed for Monstera, whose bisexual
  flowers are naked

---

## What building the six would involve

Each is one `.apxf` component: the shared image plus a `CFG` block with a
caption and six-to-eight labels with their anchor coordinates. The image is
already live under `docs/diagrams/`, so **nothing needs uploading** — it is
authoring the label sets and their positions, then one paste per guide.
"""

open(OUT, "w", encoding="utf-8", newline="\r\n").write(DOC)
print("wrote %s" % OUT.rsplit("/", 1)[-1])
print("%d lines" % (DOC.count("\n") + 1))
