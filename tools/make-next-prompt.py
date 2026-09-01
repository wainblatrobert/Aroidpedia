# -*- coding: utf-8 -*-
"""Write NEXT SESSION PROMPT 8.28.26.txt.

House rule: the prompt is a POINTER, not a summary. It names absolute paths
and lets the next agent read the handoff rather than re-stating it here.
"""
import io

OUT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/NEXT SESSION PROMPT 8.28.26.txt"

P = r"""Read this first, in full:
G:\My Drive\PlantsV2\Aroidpedia\LITERATURE\LITERATURE HANDOFF 8.28.26.md

START HERE - the identification section.

The reproduction section is finished and fully live. So is morphology (hub +
Alocasia, Anthurium, Monstera, Philodendron). Nothing is outstanding on either:
0 blocks differ from the site, all 165 hosted assets are live, and the whole
corpus is US-spelled. Do not go looking for paste work there - verify with
G:\My Drive\PlantsV2\Aroidpedia\WEBSITE\..\aroidpedia-climate\make-outstanding-list.py
if you doubt it, and believe the direct page check over any tool that
disagrees.

The literature shelf now holds 2,247 papers and CORE is closed - 4 unopened
of 397. The handoff argues that IDENTIFICATION is the next section to write:
523 first-rank papers, 337 of them citable, which is more than reproduction
ever had. The morphology guides are the format to copy.

Three things about that job, all covered in the handoff:

1. Rank by LENS, not by tier. `tier` in CATALOG.json is a REPRODUCTION score -
   only 7 of 25 subjects can earn CORE - so an identification paper can be
   first-rank and still read as SUPPORTING. Use
   _INDEX\LENS-READINESS.md and re-run tools\lens_readiness.py after any
   reclassify.

2. "Citable" is the real gate, not "read". 418 of 1,128 records lack an author
   or a year and cannot go in a reference list without opening the PDF.
   Fixing that is the cheapest lever on writing throughput - but do NOT invent
   metadata: PDF properties and "Received" dates were measured 39% wrong.

3. NEVER run refresh_catalog.py --reclassify without re-applying the
   curations afterwards. It destroyed all 26 hand-written titles, authors and
   years between 8.27 and 8.28. A plain refresh preserves them (verified).
   Re-apply from
   C:\Users\nli0490\Claude\aroidpedia-climate\curate-inbox-26.py

Also open, and smaller: 24 papers from the 8.27 inbox pass are tagged [S]
because their findings went into a report rather than _INDEX\DIGESTS\. Writing
those digests would promote them to [P] and is a bounded job.

Two findings from that pass are read but still unused on the site, both named
in the handoff: Claudel & Lev-Yadun's argument that intraspecific scent
variation may exceed interspecific - which constrains every species-level
scent claim we make - and Grayum 1990's list of states inferred primitive for
the family, which must be attributed as HIS 1990 INFERENCE and not as modern
consensus.

Ask before starting anything large. Do not produce a handoff or a next-session
prompt unless asked for one.
"""

open(OUT, "w", encoding="utf-8", newline="\r\n").write(P)
print("wrote %s" % OUT.rsplit("/", 1)[-1])
print("%d chars" % len(P))
