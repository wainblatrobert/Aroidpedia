# -*- coding: utf-8 -*-
"""AROIDEANA CITABILITY PASS -- on-tree records in `Croat - Aroideana` and
`Gibernau-Aroideana` that carry no author (and sometimes no year).

DRY BY DEFAULT.  Emits one proposal per record together with THE VERBATIM LINE
IT WAS READ FROM, so accepting a proposal is reading a page, not trusting a
heuristic.  Nothing is derived: no PDF properties, no "Received" dates, no
most-cited-year.  Every year comes from a RUNNING HEAD or from the vision-read
volume table; every author comes from the printed BYLINE.
"""
import os, re, io, sys, json, collections
sys.stdout.reconfigure(encoding="utf-8")

LIT = r"G:\My Drive\PlantsV2\Aroidpedia\LITERATURE"
IDX = os.path.join(LIT, "_INDEX")
TXT = os.path.join(IDX, "TEXT")
sys.path.insert(0, os.path.join(IDX, "tools"))
from aroidlit import AROIDEANA_VOL_YEAR   # vision-read table, do not re-derive

FOLDERS = ("Croat - Aroideana", "Gibernau-Aroideana")

# ---- running-head shapes -------------------------------------------------
# recto, modern:  `M. GIBERNAU, M. CHOUTEAU, K. LAVALLEE, D. BARABE, 2010`
HEAD_MODERN = re.compile(r"^\s*([A-Z][A-Z\u00c0-\u00dc\.\s,&'\-]{3,120}?),\s*((?:19|20)\d{2})\s*$")
# verso, early:   `1983]`   (sometimes OCR'd `19831`)
HEAD_BRACKET = re.compile(r"^\s*((?:19|20)\d{2})\s*[\]\)\|1]\s*$")
# verso, vol 4:   `32 AROIDEANA [Vol. 4 ... 1981]`
HEAD_VOLYEAR = re.compile(r"AROIDEANA.*?Vol\.?\s*(\d{1,2}).*?((?:19|20)\d{2})", re.I)
# verso:          `AROIDEANA, Vol. 22`   -- carries no year, only a volume
HEAD_VOL = re.compile(r"^\s*(?:\d{1,4}\s+)?AROIDEANA[,\s]*(?:\[?\s*)?Vol\.?\s*(\d{1,2})\b", re.I)

AFFIL = re.compile(
    r"universit|universid|universida|institut|instituto|istituto|"
    r"department|departamento|departement|dipartiment|"
    r"herbari|botanic|botanique|botanisch|museum|museo|garden|jard[ií]n|jardin|"
    r"giardino|orto |academ|accadem|laborat|ecolog|botany|"
    r"curator|professor|emeritus|honorary|"
    r"college|school of|faculty|facultad|escuela|research|"
    r"centre|center|centro|\bcnrs\b|\bmbg\b|\bnybg\b|\bcsic\b|\birbv\b|"
    r"p\.?\s?o\.?\s?box|\bbp\s?\d|\bunit\b|foundation|fundac|society|division|"
    r"\bst\.?\s+louis\b|missouri|\bcasilla\b|\bapartado\b|"
    r"smithsonian|\bkew\b|harvard|field museum|national|nacional|"
    r"agricultur|forestry|horticultur|biolog|scienc|\bcnpq\b|@", re.I)

# a byline line can carry two authors:  `T. B. Croat & B. Cosgriff  <affil>`
CONJ = re.compile(r"\s+(?:and|&|y|et)\s+", re.I)

STOP = re.compile(r"^(abstract|resumen|resumo|r[eé]sum[eé]|keywords?|key words?|"
                  r"introduction|acknowledg|literature cited|references|"
                  r"in order to|this paper|the |a |an |during |over |thirty|"
                  r"fig\.|figure|table|plate)\b", re.I)

# a personal-name run:  `Thomas B. Croat`, `Dr. Cristiana Giordano`, `Marc Gibernau`
NAME = re.compile(
    r"^(?:Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?)?\s*"
    r"((?:[A-Z][A-Za-z\u00c0-\u00ff\u2019'\-]+|[A-Z]\.){1,4}"
    r"(?:\s+(?:[A-Z][A-Za-z\u00c0-\u00ff\u2019'\-]+|[A-Z]\.|van|von|de|del|da|dos|der|ex))*)"
)
PARTICLE = set(["van", "von", "de", "del", "da", "dos", "der", "du", "la", "le"])


def norm(s):
    return re.sub(r"\s+", " ", s or "").strip()


def decaps(n):
    """`R. J. HENNY` -> `R. J. Henny`.  Some bylines are set in full caps; the
    catalogue stores names in ordinary case."""
    if n != n.upper():
        return n
    out = []
    for t in n.split():
        out.append(t if re.fullmatch(r"[A-Z]\.?", t) else t.capitalize())
    return " ".join(out)


def house(names):
    """Personal names -> house style: `Croat T.B.` / `A & B` / `A et al.`"""
    out = []
    for n in names:
        parts = [p for p in decaps(n).split() if p]
        if len(parts) == 1:
            out.append(parts[0])
            continue
        i = len(parts) - 1
        while i > 0 and INITIAL_RX.fullmatch(parts[i]):
            i -= 1
        while i > 0 and parts[i-1].lower() in PARTICLE:
            i -= 1
        sur = " ".join(parts[i:])
        ini = "".join(p[0] + "." for p in parts[:i] if p and p[0].isupper())
        out.append((sur + " " + ini).strip())
    if not out:
        return None
    if len(out) == 1:
        return out[0]
    if len(out) == 2:
        return out[0] + " & " + out[1]
    return out[0] + " et al."


TITLE_RX = re.compile(r"^(?:Dr|Prof|Mr|Mrs|Ms|Miss|Sr|Sra)\.?$", re.I)
INITIAL_RX = re.compile(r"^[A-Z]\.?$")
WORD_RX = re.compile(r"^[A-Z][A-Za-zÀ-ÿ’'\-]{1,}$")


def _name_tokens_ok(toks):
    """A personal name: >=2 tokens, ends in a real surname (not an initial),
    every token an initial, a particle, or a capitalised word."""
    if not (2 <= len(toks) <= 5):
        return False
    if INITIAL_RX.match(toks[-1]) and len(toks[-1]) <= 2:
        return False
    if not WORD_RX.match(toks[-1]):
        return False
    for t in toks:
        if INITIAL_RX.match(t) or t.lower() in PARTICLE or WORD_RX.match(t):
            continue
        return False
    # /!\ A NAME MAY NOT BE MADE OF AFFILIATION WORDS.  Splitting
    # `Laboratoire d'Evolution & Diversite Biologique` on the `&` otherwise
    # yields a co-author called `Biologique D.`
    if AFFIL.search(" ".join(toks)):
        return False
    return True


def _affil_starts_within(rest_toks, n=6):
    """Does an affiliation begin in the first n tokens of the remainder?"""
    if not rest_toks:
        return None            # nothing left: caller decides
    head = " ".join(rest_toks[:n])
    return bool(AFFIL.search(head))


def split_byline(line):
    """A byline line is `Name Affiliation...` glued together by the text cache.
    Find where the AFFILIATION starts and return the personal name before it.

    /!\\ The naive `NAME.match()` swallowed the affiliation's first word --
    `Dr. Cristiana Giordano Dipartimento di Biologia` gave surname
    `Dipartimento`.  Split by trying each cut point instead, and require the
    name to END IN A SURNAME and the remainder to BEGIN AN AFFILIATION."""
    line = norm(line)
    if not line or STOP.match(line):
        return None
    toks = line.split()
    if toks and TITLE_RX.match(toks[0]):
        toks = toks[1:]
    if len(toks) < 2:
        return None
    best = None
    for k in range(2, min(len(toks), 5) + 1):
        cand, rest = toks[:k], toks[k:]
        if not _name_tokens_ok(cand):
            continue
        started = _affil_starts_within(rest)
        if started is None:                  # bare name, nothing after it
            if k == len(toks):
                best = cand
                break
            continue
        if started:
            best = cand
            break
    if not best:
        return None
    return " ".join(best).strip(" ,;.")


def read_lines(txtname):
    p = os.path.join(TXT, txtname)
    if not os.path.exists(p):
        return None
    raw = io.open(p, encoding="utf-8", errors="replace").read()
    return [norm(l) for l in raw.splitlines()]


# `Croat, 2015`, `Croat and Ferry, 2015` -- the modern head is not always caps
HEAD_MIXED = re.compile(
    r"^\s*((?:[A-Z][A-Za-zÀ-ÿ\.\-']+|[A-Z]\.)"
    r"(?:(?:[,&\s]+|\s+and\s+)(?:[A-Z][A-Za-zÀ-ÿ\.\-']+|[A-Z]\.))*)"
    r",\s*((?:19|20)\d{2})\s*$")


def head_authors(lines):
    """The RUNNING HEAD's own author list -- `T. B. CROAT, J. P. VANNINI, 2010`.
    A head is printed on every page and is often completer than the byline
    block, which the text cache can interleave with addresses and abstracts.
    Returns (house string, evidence line)."""
    for l in [x for x in lines[:6] if x] + [x for x in lines if len(x) <= 70]:
        m = HEAD_MODERN.match(l) or HEAD_MIXED.match(l)
        if not m:
            continue
        blob = m.group(1)
        parts = [p.strip() for p in re.split(r",|\s+and\s+|&", blob) if p.strip()]
        names = []
        for p in parts:
            toks = p.split()
            if not toks:
                continue
            if not WORD_RX.match(decaps(toks[-1])):
                return None, l
            names.append(" ".join(toks))
        if names:
            return house(names), l
    return None, ""


def repeated_head_year(lines):
    """A RUNNING HEAD RECURS.  An `AUTHORS, YEAR` line appearing twice or more
    anywhere in the file is page furniture, not a citation -- the test the
    volume-year table itself was built on.  Returns (year, count, evidence)."""
    hits = collections.Counter()
    ev = {}
    for l in lines:
        if len(l) > 70:
            continue
        m = HEAD_MODERN.match(l) or HEAD_MIXED.match(l)
        if m:
            y = int(m.group(2))
            hits[y] += 1
            ev.setdefault(y, l)
    if not hits:
        return None, 0, ""
    y, n = hits.most_common(1)[0]
    return (y, n, ev[y]) if n >= 2 else (None, n, ev[y])


def find_year(lines, fname):
    """Return (year, route, evidence). Never derived, never guessed."""
    head = [l for l in lines[:6] if l]
    for l in head:
        m = HEAD_MODERN.match(l) or HEAD_MIXED.match(l)
        if m:
            return int(m.group(2)), "recto head (authors, year)", l
    for l in head:
        m = HEAD_BRACKET.match(l)
        if m:
            return int(m.group(1)), "verso head YYYY]", l
    for l in lines[:12]:
        m = HEAD_VOLYEAR.search(l)
        if m:
            return int(m.group(2)), "verso head AROIDEANA [Vol. N ... YYYY]", l
    for l in lines[:12]:
        m = HEAD_VOL.search(l)
        if m:
            vol = int(m.group(1))
            y = AROIDEANA_VOL_YEAR.get(vol)
            if y:
                return y, "vol %d -> volume table" % vol, l
            ry, n, rev = repeated_head_year(lines)
            if ry:
                return ry, "vol %d not in table; recurring head x%d" % (vol, n), rev
            return None, "vol %d NOT in the volume table" % vol, l
    b = os.path.basename(fname)
    m = re.match(r"^(?:\[[PSDX]\]\s*)?(\d{3})\d{4}\.pdf$", b)
    if m:
        vol = int(m.group(1))
        y = AROIDEANA_VOL_YEAR.get(vol)
        if y:
            return y, "filename vol %d -> volume table" % vol, b
        ry, n, rev = repeated_head_year(lines)
        if ry:
            return ry, "vol %d not in table; recurring head x%d" % (vol, n), rev
        return None, "filename vol %d NOT in the volume table" % vol, b
    # last resort, still page furniture and not a citation: a head that RECURS
    ry, n, rev = repeated_head_year(lines)
    if ry:
        return ry, "recurring recto head x%d" % n, rev
    return None, "no running head found", ""


FURNITURE = re.compile(r"^(?:\d{1,4}|ARO[IJL1]DEANA.*|VOLUME.*|\(?continued\)?)$", re.I)


def byline_block(lines):
    """The 1-6 non-empty lines that follow the title, up to ABSTRACT/body.
    Returned VERBATIM so the caller can read them rather than trust a parse."""
    ne = [l for l in lines[:60] if l]
    start = 0
    for i, l in enumerate(ne[:5]):
        if (HEAD_MODERN.match(l) or HEAD_BRACKET.match(l) or HEAD_VOL.search(l)
                or FURNITURE.match(l) or HEAD_VOLYEAR.search(l)):
            start = i + 1
    if start >= len(ne):
        return "", []
    title = ne[start]
    # some splits repeat the title line; the byline is after the LAST copy
    while start + 1 < len(ne) and ne[start+1].lower() == title.lower():
        start += 1
    block = []
    for l in ne[start+1: start+8]:
        if STOP.match(l) or FURNITURE.match(l):
            break
        block.append(l)
        if len(block) >= 6:
            break
    return title, block


def parse_byline(block):
    """Best-effort author parse of the byline block. Returns (names, note)."""
    names, note = [], ""
    for l in block:
        got = []
        whole = split_byline(l)
        parts = CONJ.split(l)
        if len(parts) > 1:
            sub = [split_byline(p) for p in parts]
            # accept the split only if EVERY part parsed as a person; a lone
            # failure means the `&` belonged to an institution name.
            if all(sub):
                got = [s for s in sub]
                note = "split on and/&"
        if not got and whole:
            got = [whole]
        if not got:
            if names:
                break
            continue
        names.extend(got)
        if len(names) >= 8:
            break
    return names, note


def find_authors(lines):
    """Return (house_string, [raw names], byline block, note)."""
    title, block = byline_block(lines)
    if not block:
        return None, [], [], ""
    names, note = parse_byline(block)
    return house(names), names, block, note


# ---------------------------------------------------------------------------
# RESOLVE.  The running head and the byline are two different witnesses and
# each is better at a different thing:
#
#   * the HEAD gives the author LIST -- it is printed complete on every page,
#     while the byline block is interleaved with addresses and abstracts and
#     the parse stops early;
#   * the BYLINE gives the SPELLING -- the head is set in caps and OCRs badly
#     (`C. C. FINCI-I` for Finch, `E. MELEN DE Z-LOPEZ` for Melendez-Lopez).
#
# So: take the COUNT AND ORDER from the head, and each name's SPELLING from
# the byline where a surname matches. Neither is invented.
# ---------------------------------------------------------------------------
import difflib


def _sur(name):
    parts = [p for p in decaps(name).split() if p]
    if not parts:
        return ""
    i = len(parts) - 1
    while i > 0 and parts[i-1].lower() in PARTICLE:
        i -= 1
    return re.sub(r"[^a-z]", "", " ".join(parts[i:]).lower())


def _same(a, b):
    a, b = _sur(a), _sur(b)
    # /!\ A ONE- OR TWO-LETTER "SURNAME" MATCHES ANYTHING BY SUBSTRING.
    # `L. CABRERA R.` reduced to `r`, which is inside `dieringer`, so the head
    # `G. DIERINGER, L. CABRERA R.` resolved to `Dieringer & Dieringer`.
    if len(a) < 3 or len(b) < 3:
        return a == b
    if not a or not b:
        return False
    if a == b or a in b or b in a:
        return True
    return difflib.SequenceMatcher(None, a, b).ratio() >= 0.72


def head_name_list(lines, prefer=""):
    """The head's author names, in order, as raw strings.

    /!\ A LINE OF THE SHAPE `Name, YEAR` IS NOT NECESSARILY A RUNNING HEAD.
    Scanning the whole file for one picked `Madison, 1981` -- a CITATION in the
    body -- off a Gibernau paper and made Madison its author. A running head
    RECURS; a citation usually does not. So accept, in order:
      1. the exact line `find_year()` already identified as a head,
      2. a match in the first six lines (page furniture sits at the top),
      3. a line that occurs TWICE OR MORE anywhere in the file.
    """
    counts = collections.Counter(l for l in lines if l)
    cands = []
    if prefer:
        cands.append(prefer)
    cands += [x for x in lines[:6] if x]
    cands += [x for x in lines if len(x) <= 70 and counts[x] >= 2]
    seen = set()
    for l in cands:
        if l in seen:
            continue
        seen.add(l)
        m = HEAD_MODERN.match(l) or HEAD_MIXED.match(l)
        if not m:
            continue
        parts = [p.strip() for p in re.split(r",|\s+and\s+|&", m.group(1)) if p.strip()]
        out = []
        for p in parts:
            toks = p.split()
            if not toks or not any(WORD_RX.match(decaps(t)) for t in toks):
                out = []
                break
            out.append(" ".join(toks))
        if out:
            return out, l
    return [], ""


def resolve(lines, yev=""):
    """Return (authors, source note, unmatched-head-names)."""
    hnames, hev = head_name_list(lines, yev)
    _, bnames, block, _note = find_authors(lines)
    if not hnames:
        return (house(bnames) if bnames else None), ("byline" if bnames else ""), []
    merged, unmatched = [], []
    for h in hnames:
        hit = None
        for b in bnames:
            if _same(h, b):
                hit = b
                break
        if hit:
            merged.append(hit)
        else:
            merged.append(h)
            unmatched.append(h)
    note = "head list x%d, %d spelled from byline" % (len(hnames), len(hnames) - len(unmatched))
    return house(merged), note, unmatched


def collect():
    cat = json.load(io.open(os.path.join(IDX, "CATALOG.json"), encoding="utf-8"))
    recs = cat if isinstance(cat, list) else cat.get("records")
    tgt = [r for r in recs
           if os.path.basename(os.path.dirname(r["file"])) in FOLDERS
           and not (r.get("authors") and r.get("year"))]
    rows = []
    for r in tgt:
        lines = read_lines(r.get("txt") or "")
        if lines is None:
            rows.append(dict(rec=r, year=None, yroute="NO TEXT CACHE", yev="",
                             authors=None, raw=[], block=[], note="",
                             headauth=None, headev="",
                             resolved=None, rnote="", unmatched=[], head=[]))
            continue
        y, yroute, yev = find_year(lines, r["file"])
        a, raw, block, note = find_authors(lines)
        ha, hev = head_authors(lines)
        res, rnote, unmatched = resolve(lines, yev)
        rows.append(dict(rec=r, year=y, yroute=yroute, yev=yev,
                         authors=a, raw=raw, block=block, note=note,
                         headauth=ha, headev=hev,
                         resolved=res, rnote=rnote, unmatched=unmatched,
                         head=[h for h in lines[:10] if h][:8]))
    return rows


def main():
    rows = collect()
    stats = collections.Counter()
    for d in rows:
        stats["year " + ("ok" if d["year"] else "MISSING")] += 1
        stats["author " + ("ok" if d["authors"] else "MISSING")] += 1
    print("targets: %d" % len(rows))
    print("   %s" % dict(stats))
    print()
    print("=" * 108)
    for d in rows:
        r = d["rec"]
        cur_y = r.get("year")
        flag = ""
        if cur_y and d["year"] and int(cur_y) != int(d["year"]):
            flag = "   <<< DISAGREES with catalogue %s" % cur_y
        print("%-5s %s" % (r["id"], os.path.basename(r["file"])[:88]))
        print("      year  : %-6s [%s]%s" % (d["year"] or "--", d["yroute"], flag))
        if d["yev"]:
            print("              from: %s" % d["yev"][:104])
        ha = d.get("headauth")
        mark = ""
        if ha and d["authors"] and ha != d["authors"]:
            mark = "   <<< HEAD SAYS: %s" % ha
        elif ha and not d["authors"]:
            mark = "   <<< HEAD SAYS: %s" % ha
        print("      author: %s%s%s"
              % (d["authors"] or "-- NONE FOUND",
                 ("   (%s)" % d["note"]) if d["note"] else "", mark))
        if d.get("headev") and mark:
            print("        head  | %s" % d["headev"][:104])
        # THE EVIDENCE, ALWAYS -- verify the proposal against these, never the
        # other way round.
        if d["block"]:
            for e in d["block"]:
                print("        byline| %s" % e[:104])
        else:
            for h in d["head"]:
                print("        head  | %s" % h[:104])
        print()


if __name__ == "__main__":
    main()
