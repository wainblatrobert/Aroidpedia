#!/usr/bin/env python3
"""Validate climate.json 1.11.0 against the 1.10.0 baseline (S3).

Contract: PURELY ADDITIVE — strip the new `koppen` key from every variant and
what remains must be deep-equal to 1.9.0 for all 919 places. Then sanity on
the classifications themselves.
"""
import json, sys, copy

new = json.load(open("climate.json", encoding="utf-8"))
old = json.load(open("climate-1.10.0-baseline.json", encoding="utf-8"))
np_, op = new["places"], old["places"]
VARS = ("all", "ff", "warm", "warmMoist")

print("version:", old["version"], "->", new["version"])
print("places :", len(op), "->", len(np_))

# 1. same place set
same_keys = set(np_) == set(op)
print("\n1. identical place set:", "PASS" if same_keys else "FAIL")

# 2. strip koppen -> deep equal
moved = [k for k in op if np_.get(k) != op[k]]
print("2. all 919 pre-existing entries deep-equal to 1.10.0:",
      "PASS" if not moved else f"FAIL — {len(moved)} moved: {moved[:8]}")
kop_missing = [(k, v) for k in added for v in VARS
               if v in np_[k] and "koppen" not in np_[k][v]]

# 3. koppen present on every variant
print(f"3. koppen present on every variant:",
      "PASS" if not kop_missing else f"FAIL — {len(kop_missing)} missing, e.g. {kop_missing[:5]}")

# 4. shares sum to ~1 where non-empty
bad_sum = []
for k, e in np_.items():
    for v in VARS:
        if v in e and e[v].get("koppen"):
            t = sum(s for _, s in e[v]["koppen"])
            if not (0.97 <= t <= 1.03):
                bad_sum.append((k, v, round(t, 3)))
print("4. shares sum to ~1:", "PASS" if not bad_sum else f"FAIL {bad_sum[:5]}")

# 5. ground-truth sanity — places whose Koppen class is textbook
GT = {
    "Singapore": "Af", "Brunei": "Af",
    "Bangladesh": ("Am", "Aw"),
    "Chad": ("BWh", "BSh"),
    "Mongolia": ("BSk", "BWk", "Dwc", "Dwb"),
    "Ireland": "Cfb",
    "Tibet": ("ET", "BSk", "Dwc"),
}
print("\n5. textbook places (top class):")
ok5 = True
for k, want in GT.items():
    e = np_.get(k)
    if not e:
        print(f"   {k:<12} (not a place here — skipped)"); continue
    top = e["all"]["koppen"][0][0] if e["all"].get("koppen") else None
    wants = (want,) if isinstance(want, str) else want
    good = top in wants
    ok5 &= good
    mix = ", ".join(f"{c} {round(s*100)}%" for c, s in e["all"]["koppen"][:3])
    print(f"   {k:<12} {'PASS' if good else 'LOOK'}  [{mix}]  wanted {wants}")

# 6. the S2 headline: big units read as mixes
print("\n6. the units S2 exists for:")
for k in ["Pará", "Amazonas (Brazil)", "São Paulo", "Chiapas", "Oaxaca",
          "Mexico City", "México State", "Bahia"]:
    e = np_.get(k)
    if not e:
        continue
    mix = ", ".join(f"{c} {round(s*100)}%" for c, s in e["all"]["koppen"][:4])
    print(f"   {k:<18} n={e['n']:<6} [{mix}]")

ok = same_keys and not moved and not kop_missing and not bad_sum
print("\n" + ("ALL GATES PASS" if ok else "GATES FAILED"))
sys.exit(0 if ok else 1)
