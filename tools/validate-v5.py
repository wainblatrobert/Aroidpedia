#!/usr/bin/env python3
"""Validate climate.json 1.9.0 against the 1.8.0 baseline.

THE CONTRACT: additive only. Every one of the 712 pre-existing places must be
DEEP-EQUAL to its 1.8.0 entry — the HD supplement must not have moved a single
value for a place that already had one. Then sanity on the newcomers.
"""
import json, sys

NEW = "climate.json"                      # v5 writes beside itself
OLD = "climate-1.8.0-baseline.json"

new = json.load(open(NEW, encoding="utf-8"))
old = json.load(open(OLD, encoding="utf-8"))
np, op = new["places"], old["places"]

print("version:", old["version"], "->", new["version"])
print("places :", len(op), "->", len(np), f"(+{len(np)-len(op)})")

# 1. additive
missing = [k for k in op if k not in np]
print("\n1. every 1.8.0 place still present:", "PASS" if not missing else f"FAIL {missing[:8]}")

# 2. deep-equal on the old set
moved = [k for k in op if k in np and np[k] != op[k]]
print("2. all 712 pre-existing entries unchanged:",
      "PASS" if not moved else f"FAIL — {len(moved)} moved: {moved[:10]}")

# 3. the newcomers
added = sorted(k for k in np if k not in op)
print(f"3. new places: {len(added)} (expected 207)",
      "PASS" if len(added) == 207 else "FAIL")

# 4. every newcomer has real pixels and a zones list
thin = [(k, np[k]["n"]) for k in added if np[k]["n"] < 1]
nz = [k for k in added if not (np[k].get("all", {}).get("zones"))]
print("4. all newcomers have pixels:", "PASS" if not thin else f"FAIL {thin[:6]}")
print("   all newcomers have zones :", "PASS" if not nz else f"WARN {nz[:6]}")

# 5. the units the request doc said to eyeball
print("\n5. the units worth eyeballing (percentile-trim check):")
for k in ["West Himalaya", "Brazil North", "Türkiye", "Florida",
          "Mexico Southwest", "Brazil Southeast", "Solomon Is."]:
    e = np.get(k)
    if not e:
        print(f"   {k:<18} MISSING"); continue
    v = e["all"]
    zs = ", ".join(f"{z} {round(s*100)}%" for z, s in v["zones"][:3])
    print(f"   {k:<18} n={e['n']:<6} tnMed {min(v['tnMed']):>6.1f}..{max(v['tnMed']):>5.1f}  "
          f"txMed {min(v['txMed']):>5.1f}..{max(v['txMed']):>5.1f}  "
          f"rain {min(v['prMed'])}..{max(v['prMed'])}mm  [{zs}]")

# 6. West Himalaya must NOT read like Tibet
wh, tb = np.get("West Himalaya"), np.get("Tibet")
if wh and tb:
    whm = sum((a+b)/2 for a, b in zip(wh["all"]["tnMed"], wh["all"]["txMed"]))/12
    tbm = sum((a+b)/2 for a, b in zip(tb["all"]["tnMed"], tb["all"]["txMed"]))/12
    print(f"\n6. West Himalaya mean {whm:.1f}C vs Tibet {tbm:.1f}C:",
          "PASS (clearly warmer)" if whm > tbm + 5 else "LOOK CLOSER")

ok = not missing and not moved and len(added) == 207 and not thin
print("\n" + ("ALL GATES PASS" if ok else "GATES FAILED"))
sys.exit(0 if ok else 1)
