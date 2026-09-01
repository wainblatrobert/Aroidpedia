# -*- coding: utf-8 -*-
"""sulph -> sulf, as a SUBSTRING rule.

The word-pair map could not catch these: `\\bsulphide\\b` does not match
inside `oligosulphide`, `trisulphide`, `disulphide`, `monosulphide`,
`tetrasulphide`. Those are the exact words the aroid scent literature uses
most, so 31 occurrences across 8 files sailed through the sweep.

There is no English word in which "sulph" is correct US spelling, so this
is a safe substring rule - unlike the -our / -ise families, where a
substring rule would wreck "four", "hour", "precise" and "surprise".

Same protections as the main sweep: text nodes only, and <cite> titles and
quoted runs are left alone.
"""
import os, re, glob, sys, io, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
APPLY = "--apply" in sys.argv
ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"
SKIP = ("backup", "_spelling backup 8.27.26", "literature", "_index",
        "digests", "stopgap")


def case_fix(m):
    s = m.group(0)
    if s.isupper():
        return "SULF"
    if s[0].isupper():
        return "Sulf"
    return "sulf"


RX = re.compile(r"sulph", re.IGNORECASE)
total, touched = 0, collections.OrderedDict()

for f in glob.glob(ROOT + "/**/*.txt", recursive=True):
    low = f.lower()
    if any(os.sep + d + os.sep in low for d in SKIP):
        continue
    if any(k in low for k in ("session handoff", "next session", "custom css",
                              "source text", "paste sheet", "readme", "manifest")):
        continue
    s = open(f, encoding="utf-8", errors="replace").read()
    if 'class="apol' not in s and 'class="apoh' not in s:
        continue

    prot = []
    for rx in (r'(?is)<cite\b.*?</cite>', r"(?s)&ldquo;.*?&rdquo;", r"(?s)\u201c.*?\u201d"):
        prot += [(m.start(), m.end()) for m in re.finditer(rx, s)]
    tags = [(m.start(), m.end()) for m in re.finditer(r"(?s)<[^>]*>", s)]

    def blocked(i):
        return any(a <= i < b for a, b in prot) or any(a <= i < b for a, b in tags)

    out, last, n = [], 0, 0
    for m in RX.finditer(s):
        if blocked(m.start()):
            continue
        out.append(s[last:m.start()])
        out.append(case_fix(m))
        last = m.end()
        n += 1
    if n:
        out.append(s[last:])
        total += n
        touched[os.path.relpath(f, ROOT)] = n
        if APPLY:
            open(f, "w", encoding="utf-8", newline="").write("".join(out))

for p, n in touched.items():
    print("  %3d  %s" % (n, p))
print("\n%d replacement(s) across %d file(s)   [%s]"
      % (total, len(touched), "APPLIED" if APPLY else "DRY RUN"))
