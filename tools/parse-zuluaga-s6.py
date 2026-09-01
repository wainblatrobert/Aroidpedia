# -*- coding: utf-8 -*-
"""Parse Zuluaga et al. 2019 Table S6 — BEAST node ages + 5-95% HPDs.

Two traps this handles explicitly:
  · DECIMAL COMMAS throughout (125,4 and (114,85-134,99)).
  · TWO COLUMN-PAIRS per page — the left (Node, Age, HPD) triple continues
    into the right one, not down the page. In the text layer they simply
    interleave, so a sequential regex recovers both correctly.
find_tables() returns junk on these pages; the text layer is clean.
"""
import fitz, re, json, sys

P = "G:/My Drive/PlantsV2/Aroidpedia/LITERATURE/_INBOX/269-Other-6898-1-10-20190305.pdf"
d = fitz.open(P)

# S6 begins partway down p14; take everything from its caption to the end
txt = ""
for i in range(14, d.page_count):
    txt += d[i].get_text() + "\n"
d.close()
start = txt.find("Table S6")
if start < 0:
    print("FAIL: no Table S6 caption"); sys.exit(1)
body = txt[start:]

NUM = r"\d+(?:,\d+)?"
ROW = re.compile(r"(?<!\d)(\d{1,3})\s+(" + NUM + r")\s+\(\s*(" + NUM + r")\s*[-\u2013]\s*(" + NUM + r")\s*\)")

def f(x): return float(x.replace(",", "."))

rows = {}
dups = []
for m in ROW.finditer(body):
    node = int(m.group(1)); age = f(m.group(2)); lo = f(m.group(3)); hi = f(m.group(4))
    if node in rows and rows[node] != (age, lo, hi):
        dups.append(node)
    rows[node] = (age, lo, hi)

print("rows parsed : %d" % len(rows))
print("node range  : %d - %d" % (min(rows), max(rows)))
missing = [n for n in range(min(rows), max(rows) + 1) if n not in rows]
print("gaps        : %s" % (missing if missing else "none - contiguous"))
print("conflicting : %s" % (dups if dups else "none"))

# sanity: HPD must bracket the age
bad = [(n, v) for n, v in rows.items() if not (v[1] - 0.06 <= v[0] <= v[2] + 0.06)]
print("age outside its own HPD: %s" % (bad[:5] if bad else "none - all %d consistent" % len(rows)))

print("\n--- the four ages this tier was gated on (paper's prose) ---")
GATES = {"Monsteroideae crown": 68.83, "Rhaphidophora clade": 38.4,
         "Heteropsis clade": 38.56, "Spathiphylleae": 27.0}
for label, want in GATES.items():
    hits = sorted(rows.items(), key=lambda kv: abs(kv[1][0] - want))[:2]
    shown = ", ".join("node %d = %.1f (%.2f-%.2f)" % (n, v[0], v[1], v[2]) for n, v in hits)
    print("   %-22s prose %6.2f  ->  %s" % (label, want, shown))

out = "C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/f35a1d61-1b66-4fc0-be7b-d93b45b553e9/scratchpad/zuluaga_S6.json"
json.dump({str(k): {"age": v[0], "hpd": [v[1], v[2]]} for k, v in sorted(rows.items())},
          open(out, "w", encoding="utf-8"), indent=1)
print("\nwrote %s" % out)
