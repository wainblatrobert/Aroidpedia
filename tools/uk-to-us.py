# -*- coding: utf-8 -*-
"""Convert British spellings to US across the published guide blocks.

USER RULING 8.27.26: the site was ALWAYS US English. The British forms are
drift, not convention - so the audit that found "Reproduction is 345 UK / 49
US" was measuring the damage, not the house style.

SAFETY, in order of importance:

1. TEXT NODES ONLY. Replacements never run inside "<...>", so class names,
   ids, hrefs, src paths and inline styles cannot be touched. This is what
   stops `grey` in a style attribute or a class like `apol-colour` from
   being rewritten.

2. REFERENCE LISTS ARE FLAGGED, NEVER AUTO-CHANGED. A paper's title is
   verbatim - "The genus Alocasia ... colour forms" must keep its spelling
   even on a US site. Hits inside <ol class="apol-refs"> are reported for
   a human decision instead of being rewritten.

3. QUOTED RUNS ARE FLAGGED TOO. Anything between curly quotes may be a
   verbatim quotation from a British source.

4. CASE IS PRESERVED, and word boundaries are required, so "Grey" the
   surname is reported rather than silently lowercased into "gray".

Run with --apply to write. Default is a dry run.
"""
import os, re, glob, sys, io, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
APPLY = "--apply" in sys.argv
ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE"

# British -> US. Longest first so "millimetre" beats "metre".
MAP = {
    "colour": "color", "colours": "colors", "coloured": "colored",
    "colouring": "coloring", "colourless": "colorless", "colouration": "coloration",
    "behaviour": "behavior", "behaviours": "behaviors", "behavioural": "behavioral",
    "odour": "odor", "odours": "odors", "odourless": "odorless",
    "vapour": "vapor", "vapours": "vapors",
    "favour": "favor", "favours": "favors", "favoured": "favored",
    "favouring": "favoring", "favourable": "favorable", "favourably": "favorably",
    "favourite": "favorite", "harbour": "harbor", "harbours": "harbors",
    "neighbour": "neighbor", "neighbours": "neighbors",
    "neighbouring": "neighboring", "neighbourhood": "neighborhood",
    "honour": "honor", "rigour": "rigor", "vigour": "vigor",
    "centre": "center", "centres": "centers", "centred": "centered",
    "centring": "centering",
    "metre": "meter", "metres": "meters",
    "millimetre": "millimeter", "millimetres": "millimeters",
    "centimetre": "centimeter", "centimetres": "centimeters",
    "kilometre": "kilometer", "kilometres": "kilometers",
    "micrometre": "micrometer", "micrometres": "micrometers",
    "fibre": "fiber", "fibres": "fibers", "litre": "liter", "litres": "liters",
    "labelled": "labeled", "labelling": "labeling",
    "modelling": "modeling", "modelled": "modeled",
    "travelling": "traveling", "travelled": "traveled",
    "cancelled": "canceled", "signalled": "signaled", "fuelled": "fueled",
    "organise": "organize", "organised": "organized", "organising": "organizing",
    "organisation": "organization", "organisations": "organizations",
    "recognise": "recognize", "recognised": "recognized", "recognising": "recognizing",
    "characterise": "characterize", "characterised": "characterized",
    "characterising": "characterizing",
    "specialise": "specialize", "specialised": "specialized", "specialising": "specializing",
    "emphasise": "emphasize", "emphasised": "emphasized", "emphasising": "emphasizing",
    "minimise": "minimize", "minimised": "minimized", "minimising": "minimizing",
    "maximise": "maximize", "maximised": "maximized", "maximising": "maximizing",
    "optimise": "optimize", "optimised": "optimized", "optimising": "optimizing",
    "summarise": "summarize", "summarised": "summarized", "summarising": "summarizing",
    "generalise": "generalize", "generalised": "generalized", "generalising": "generalizing",
    "realise": "realize", "realised": "realized", "realising": "realizing",
    "utilise": "utilize", "utilised": "utilized", "utilising": "utilizing",
    "sterilise": "sterilize", "sterilised": "sterilized",
    "fertilise": "fertilize", "fertilised": "fertilized", "fertilising": "fertilizing",
    "stabilise": "stabilize", "stabilised": "stabilized",
    "standardise": "standardize", "standardised": "standardized",
    "categorise": "categorize", "categorised": "categorized",
    "hypothesise": "hypothesize", "hypothesised": "hypothesized",
    "synthesise": "synthesize", "synthesised": "synthesized",
    "analyse": "analyze", "analysed": "analyzed", "analysing": "analyzing",
    "catalyse": "catalyze", "catalysed": "catalyzed",
    "paralyse": "paralyze", "paralysed": "paralyzed",
    "grey": "gray", "greys": "grays", "greyish": "grayish",
    "defence": "defense", "defences": "defenses", "offence": "offense",
    "licence": "license", "practise": "practice", "practised": "practiced",
    "catalogue": "catalog", "catalogues": "catalogs",
    "programme": "program", "programmes": "programs",
    "sceptic": "skeptic", "sceptical": "skeptical", "scepticism": "skepticism",
    "mould": "mold", "moulds": "molds", "moulding": "molding",
    "smoulder": "smolder", "smouldering": "smoldering",
    "storey": "story", "storeys": "stories",
    "towards": "toward", "amongst": "among", "whilst": "while", "amidst": "amid",
    "ageing": "aging", "judgement": "judgment",
    "acknowledgement": "acknowledgment", "acknowledgements": "acknowledgments",
    "draught": "draft", "plough": "plow",
    "sulphur": "sulfur", "sulphide": "sulfide", "sulphides": "sulfides",
    "sulphur-": "sulfur-", "sulphurous": "sulfurous",
    "haemolymph": "hemolymph", "haemoglobin": "hemoglobin",
    "oesophagus": "esophagus", "foetal": "fetal",
    "aluminium": "aluminum", "manoeuvre": "maneuver",
    "enquiry": "inquiry", "speciality": "specialty", "specialities": "specialties",

    # --- SECOND PASS 8.27.26 -------------------------------------------
    # "division of labour" survived the first sweep because `labour` was
    # never in this map. A hand-written pair list is quietly incomplete by
    # nature, so these came from `find-missed-uk.py`, which scans the corpus
    # for the PATTERNS British spellings take and reports what is actually
    # present. Everything below was seen in real prose, not guessed.
    # ⚠ NOT added, though the scan surfaced them: "seymour" (a surname),
    # "rupestre" and "haematospadix" (Latin epithets), "protologue" and
    # "prologue" (standard US), and "analyses" (the noun plural, correct in
    # US - all six occurrences sit inside a cite title anyway).
    "labour": "labor", "labours": "labors", "laboured": "labored",
    "labouring": "laboring", "armour": "armor", "armoured": "armored",
    "flavour": "flavor", "flavours": "flavors", "flavoured": "flavored",
    "honours": "honors", "honoured": "honored", "candour": "candor",
    "endeavour": "endeavor", "savour": "savor", "valour": "valor",
    "humour": "humor", "rumour": "rumor", "tumour": "tumor",
    "splendour": "splendor", "clamour": "clamor", "demeanour": "demeanor",
    "discolour": "discolor", "discoloured": "discolored",
    "discolouration": "discoloration",
    "volatilise": "volatilize", "volatilises": "volatilizes",
    "volatilised": "volatilized", "volatilising": "volatilizing",
    "volatilisation": "volatilization",
    "italicise": "italicize", "italicises": "italicizes",
    "italicised": "italicized",
    "hybridise": "hybridize", "hybridises": "hybridizes",
    "hybridised": "hybridized", "hybridising": "hybridizing",
    "hybridisation": "hybridization", "hybridisations": "hybridizations",
    "unspecialised": "unspecialized", "specialisation": "specialization",
    "specialisations": "specializations",
    "normalise": "normalize", "normalised": "normalized",
    "generalisation": "generalization", "generalisations": "generalizations",
    "generalises": "generalizes",
    "fertilisation": "fertilization", "fertilises": "fertilizes",
    "unfertilised": "unfertilized",
    "recognises": "recognizes", "summarises": "summarizes",
    "monopolise": "monopolize", "monopolises": "monopolizes",
    "monopolised": "monopolized",
    "localise": "localize", "localised": "localized",
    "synchronise": "synchronize", "synchronised": "synchronized",
    "synonymise": "synonymize", "synonymised": "synonymized",
    "synonymisation": "synonymization", "synonymisations": "synonymizations",
    "polyploidisation": "polyploidization",
    "polyploidisations": "polyploidizations",
    "idealise": "idealize", "idealised": "idealized",
    "unanalysed": "unanalyzed",
    "decimetre": "decimeter", "decimetres": "decimeters",
    "millilitre": "milliliter", "millilitres": "milliliters",
    "theatre": "theater",
    "shrivelled": "shriveled", "shrivelling": "shriveling",
    "totalling": "totaling", "cancelling": "canceling",
    "unlabelled": "unlabeled", "remodelled": "remodeled",
    "pencilled": "penciled", "channelling": "channeling",
    "dishevelled": "disheveled",

    # --- THIRD PASS: the -ise stragglers the pattern scan turned up -----
    # Every one of these was SEEN, not guessed. The -ise family is regular
    # enough that a pattern rule is tempting, but it would wreck "precise",
    # "surprise", "advertise", "treatise" and "paradise", so the explicit
    # list stays and the scanner is what keeps it honest.
    "digitisation": "digitization", "agonise": "agonize",
    "agonised": "agonized", "agonising": "agonizing",
    "vascularise": "vascularize", "vascularised": "vascularized",
    "normalisation": "normalization",
    "harmonise": "harmonize", "harmonises": "harmonizes",
    "harmonised": "harmonized", "harmonising": "harmonizing",
    "sensationalise": "sensationalize", "sensationalised": "sensationalized",
    "oxidise": "oxidize", "oxidises": "oxidizes", "oxidised": "oxidized",
    "oxidising": "oxidizing", "oxidisation": "oxidization",
    "colonise": "colonize", "colonises": "colonizes",
    "colonised": "colonized", "colonising": "colonizing",
    "colonisation": "colonization",
    "penalise": "penalize", "penalises": "penalizes", "penalised": "penalized",
    "signalling": "signaling",
}
WORDS = sorted(MAP, key=len, reverse=True)
RX = re.compile(r"\b(" + "|".join(WORDS) + r")\b", re.IGNORECASE)


def keep_case(src, repl):
    if src.isupper():
        return repl.upper()
    if src[0].isupper():
        return repl[0].upper() + repl[1:]
    return repl


SKIP_DIR = ("backup", "literature", "_index", "digests", "stopgap",
            "_spelling backup 8.27.26")


def eligible(f):
    low = f.lower()
    if any(os.sep + d + os.sep in low for d in SKIP_DIR):
        return False
    if any(k in low for k in ("session handoff", "next session", "custom css",
                              "source text", "paste sheet", "readme", "manifest")):
        return False
    return True


def protected_spans(s):
    """Regions a replacement must not touch: reference lists and quoted runs."""
    spans = []
    for m in re.finditer(r'(?is)<cite.*?</cite>', s):
        spans.append((m.start(), m.end(), "cite-title"))
    # a reference <li> opens with the citation itself; the title runs to the
    # first sentence end after the (year). Everything after that is OUR
    # annotation and should convert.
    for m in re.finditer(r'(?is)<li>(.{0,400}?\(\d{4}[a-z]?\)\..{0,300}?[.?!])\s', s):
        spans.append((m.start(1), m.end(1), "ref-title"))
    for m in re.finditer(r"(?s)&ldquo;.*?&rdquo;", s):
        spans.append((m.start(), m.end(), "quote"))
    for m in re.finditer(r"(?s)\u201c.*?\u201d", s):
        spans.append((m.start(), m.end(), "quote"))
    return spans


def in_span(i, spans):
    for a, b, kind in spans:
        if a <= i < b:
            return kind
    return None


def tag_spans(s):
    return [(m.start(), m.end()) for m in re.finditer(r"(?s)<[^>]*>", s)]


changed = collections.OrderedDict()
flagged = []
total = 0

files = [f for f in glob.glob(ROOT + "/**/*.txt", recursive=True) if eligible(f)]
for f in files:
    s = open(f, encoding="utf-8", errors="replace").read()
    if 'class="apol' not in s and 'class="apoh' not in s:
        continue
    s_orig = s
    prot = protected_spans(s)
    tags = tag_spans(s)

    def in_tag(i):
        for a, b in tags:
            if a <= i < b:
                return True
        return False

    out, last, n = [], 0, 0
    for m in RX.finditer(s):
        if in_tag(m.start()):
            continue
        kind = in_span(m.start(), prot)
        word = m.group(0)
        if kind:
            flagged.append((os.path.relpath(f, ROOT), kind, word,
                            re.sub(r"\s+", " ", s[max(0, m.start() - 55):m.end() + 45])))
            continue
        if word.lower() == "grey" and word[0].isupper():
            flagged.append((os.path.relpath(f, ROOT), "Proper-noun?", word,
                            re.sub(r"\s+", " ", s[max(0, m.start() - 55):m.end() + 45])))
            continue
        out.append(s[last:m.start()])
        out.append(keep_case(word, MAP[word.lower()]))
        last = m.end()
        n += 1
    if n:
        out.append(s[last:])
        new = "".join(out)
        changed[os.path.relpath(f, ROOT)] = n
        total += n
        if APPLY:
            rel = os.path.relpath(f, ROOT)
            bk = os.path.join(ROOT, "_SPELLING BACKUP 8.27.26", rel)
            os.makedirs(os.path.dirname(bk), exist_ok=True)
            if not os.path.exists(bk):
                open(bk, "w", encoding="utf-8", newline="").write(s_orig)
            open(f, "w", encoding="utf-8", newline="").write(new)

print("=== FILES WITH BRITISH SPELLINGS IN PROSE ===")
for p, n in sorted(changed.items(), key=lambda kv: -kv[1]):
    print("  %4d  %s" % (n, p))
print("\n%d replacement(s) across %d file(s)   [%s]"
      % (total, len(changed), "APPLIED" if APPLY else "DRY RUN"))

print("\n=== FLAGGED, NOT CHANGED (need a human) ===")
if not flagged:
    print("  none")
for p, kind, w, ctx in flagged[:40]:
    print("  [%-12s] %-14s %s" % (kind, w, ctx[:96]))
if len(flagged) > 40:
    print("  ... and %d more" % (len(flagged) - 40))
