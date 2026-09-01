# -*- coding: utf-8 -*-
"""Tag the 26 papers read on 8.27.26.

⚠ [S], NOT [P]. The tool defines [P] as "parsed in full — findings written
to _INDEX\\DIGESTS\\". No digest was written; the findings went into
`LITERATURE\\INBOX READ 8.27.26 - WHAT THE 26 PAPERS CHANGE.md` instead.
Marking them [P] would tell the next reader a digest exists. [S] — "skimmed,
partially mined, come back to it" — is what actually happened.

The one exception is already done by hand: MISCELLANEOUS_BOTANICAL_NOTES_V
is [X], a genuine negative result (no Araceae content at all), so nobody
re-reads it looking for aroids.
"""
import os, re, sys, io, subprocess

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
APPLY = "--apply" in sys.argv
LIT = "G:/My Drive/PlantsV2/Aroidpedia/LITERATURE"
TOOL = LIT + "/_INDEX/tools/mark_parsed.py"

JOBS = [
 ("Araceae.pdf", "Goncalves collenchyma - all 6 Philodendron-guide claims verified; 3 patterns not 2"),
 ("extracellular calcium oxalate", "Barabe 2004 - extracellular oxalate; the hub's new Part III section"),
 ("Amorphophallus-Scent-PSB", "Claudel & Lev-Yadun odour polymorphism review - intraspecific > interspecific"),
 ("Titanarum2021", "Cladosporium layer in the titan arum spathe chamber; n=1 cultivated"),
 ("AmbrosinaArisarum-Barabetal2004", "Ambrosina/Arisarum floral morphology; atypical bisexual-looking organs"),
 ("Poisson-Developmentalmorphologyflower", "Dracontium flower development; tetralocular gynoecia at random"),
 ("c9f9af62-7a0d-42ec-962a", "Nicolson 1977 - the typification behind Amorphophallus paeoniifolius"),
 ("Evolution and Phylogeny or Araceae", "Grayum 1990 - pre-molecular phylogeny; its inferred primitive states"),
 ("Flora of Thailand Volume 11 Part 2", "regional treatment, 221 pp; catalogue date corrected to 2012"),
 ("4a604b54-9020-4d40", "Arcangeli 1879 on Amorphophallus titanum - among the earliest accounts"),
 ("suwidjianus", "Ipor 2010 - two new Amorphophallus; read visually, image-only"),
 ("Sivadasan1983", "threatened Indian Araceae; read visually, image-only"),
 ("Amorphophallusjulaihii", "Ipor 2004 - A. julaihii; Bornean census; read visually, image-only"),
 ("269-Other-6893", "Zuluaga 2019 Monsteroideae supplement - clade tree with node numbers"),
 ("269-Other-6894", "Zuluaga supplement - perianth / seed-endosperm mapping"),
 ("269-Other-6895", "Zuluaga supplement - locule and seed number mapping"),
 ("269-Other-6896", "Zuluaga supplement - seed morphometrics PCA; Monstera isolated on PC2"),
 ("269-Other-6897", "Zuluaga supplement - chronogram with areas A-H"),
 ("269-Other-6898", "Zuluaga supplement cover + Fig S1; Table S6 numbering follows Fig S1"),
 ("AMORPHOPHALLUS_DIVERSITY", "Ipor - Bornean/Malaysian Amorphophallus survey"),
 ("AmorphophallusshyamsalilianumJ", "protologue, India"),
 ("Amorphophallusraveniiprotologue", "Nguyen 2018 - A. ravenii from Laos"),
 ("Folia Malaysiana Vol. 8", "Ipor 2007 - A. ranchanensis, Sarawak"),
 ("TheAroidsoftheSarawakLimestone", "Boyce & Wong 2009 - West Sarawak limestone aroids"),
 ("Reportontheextendeddistribution", "Swamy 2022 - A. mysorensis into Odisha"),
]

ok = fail = 0
for frag, note in JOBS:
    cmd = [sys.executable, TOOL, frag, "--status", "S",
           "--by", "inbox read 8.27.26", "--note", note]
    if not APPLY:
        print("  would tag [S]  %s" % frag[:52]); ok += 1; continue
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", cwd=LIT)
    out = (r.stdout or "") + (r.stderr or "")
    if "tag=S" in out:
        print("  [S]  %-46s" % frag[:46]); ok += 1
    else:
        print("  !!   %-46s %s" % (frag[:46], out.strip().splitlines()[-1][:60] if out.strip() else "no output"))
        fail += 1

print("\n%d tagged, %d problem(s)   [%s]"
      % (ok, fail, "APPLIED" if APPLY else "DRY RUN"))
