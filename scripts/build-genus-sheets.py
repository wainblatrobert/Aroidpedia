#!/usr/bin/env python3
"""Build the two per-genus workbooks from the research pack.

    python scripts/build-genus-sheets.py Cyrtosperma            # both workbooks
    python scripts/build-genus-sheets.py Cyrtosperma --geocode  # also refresh the iNat places cache

Inputs (all under the repo):
  research/<genus>/pages/<epithet>.md              page drafts in the card's labelled-section schema
  data/species-base/<Genus>-names.json             the POWO/IPNI pull (scripts/build-species-base.py)
  research/<genus>/data/<genus>-inat-observations.csv   optional, from the iNaturalist pull
  research/<genus>/data/<genus>-gbif-occurrences.csv    optional, from the GBIF pull
  research/<genus>/data/protologue-scans.csv       optional, index of the protologue scans held
  research/<genus>/bibliography.json               optional, source register

Outputs:
  data/species-base/<Genus>-pages.xlsx / .csv      one row per species, one column per page field
                                                   (sheets PAGES and SCHEMA)
  data/species-base/<Genus>-base.xlsx              the Drive base layout used for Syngonium and
                                                   Scindapsus: SPECIES / CULTIVARS / HYBRIDS /
                                                   ROW BACKUPS, same columns, formulas and colours,
                                                   ready to upload as a Google Sheet
  research/<genus>/data/<genus>-inat-places.csv    cache of the reverse-geocoded iNaturalist
                                                   observation places (written by --geocode)

The base workbook is a *blank copy of the base* filled from the drafts: nothing
editorial is added. Column A (the published flag) is left empty, the AP %
formula, the YEAR DESCRIBED formula and the header styling are the base's own.
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import time
import urllib.parse
from collections import Counter, OrderedDict, defaultdict
from pathlib import Path

try:
    import openpyxl
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.utils import get_column_letter
except ImportError:  # pragma: no cover
    sys.exit("pip install openpyxl")

ROOT = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------- page drafts

PAGE_LABELS = [
    "TITLE", "AUTHORITY", "TAGS", "PHOTOS", "PROTOLOGUE", "SYNONYMS",
    "HOMOTYPIC SYNONYMS", "HETEROTYPIC SYNONYMS", "ACCEPTED INFRASPECIFICS",
    "DISTRIBUTION", "DISTRIBUTION NOTE", "SPECIES DESCRIPTION", "INFLORESCENCE",
    "ECOLOGY", "DISTRIBUTION MAPS", "ETYMOLOGY", "NOTES", "REFERENCES",
]
PAGES_COLUMNS = [
    "SPECIES NAME", "TITLE", "AUTHORITY", "TAGS", "PHOTOS", "PROTOLOGUE",
    "HOMOTYPIC SYNONYMS", "HETEROTYPIC SYNONYMS", "ACCEPTED INFRASPECIFICS",
    "DISTRIBUTION", "DISTRIBUTION NOTE", "SPECIES DESCRIPTION", "INFLORESCENCE",
    "ECOLOGY", "DISTRIBUTION MAPS", "ETYMOLOGY", "NOTES", "REFERENCES",
    "FIELDS STILL OPEN", "WORDS",
]
SCHEMA_ROWS = [
    ("Field", "Meaning on the species page (labels as the card schema in docs/footer.js reads them)"),
    ("TITLE", "Post title, species name in capitals"),
    ("AUTHORITY", "Author citation shown under the title"),
    ("TAGS", "Post tags: genus, continent, then place keys from docs/geo-hierarchy.json (validated)"),
    ("PHOTOS", "Build note: which photos and plates to use for the roles; not a page field"),
    ("PROTOLOGUE", "Name, place of publication, type, and the original description quoted or translated"),
    ("HOMOTYPIC SYNONYMS", "Names based on the same type"),
    ("HETEROTYPIC SYNONYMS", "Names based on other types, with citations and types"),
    ("ACCEPTED INFRASPECIFICS", "Accepted subspecies/varieties"),
    ("DISTRIBUTION", "POWO-style native range"),
    ("DISTRIBUTION NOTE", "Detail: localities, provinces, altitude, history of records"),
    ("SPECIES DESCRIPTION", "Vegetative morphology, from the monograph or the protologue"),
    ("INFLORESCENCE", "Inflorescence, flowers, fruit and seed"),
    ("ECOLOGY", "Habitat and altitude"),
    ("DISTRIBUTION MAPS", "Published maps to show (MAPS role)"),
    ("ETYMOLOGY", "Meaning of the epithet"),
    ("NOTES", "Numbered notes with superscript reference numbers"),
    ("REFERENCES", "Numbered list; 1 = POWO, 2 = protologue, 3 = iNaturalist, then the rest"),
    ("FIELDS STILL OPEN", "Fields marked ⚠ in the draft: the sources in hand could not fill them"),
    ("WORDS", "Word count of the draft"),
]
LABEL_RE = re.compile(r"^([A-Z][A-Z /]+?):(?:\s*(.*))?$")


def parse_page(path: Path) -> dict:
    fields: dict = OrderedDict()
    current = None
    for raw in path.read_text(encoding="utf-8").splitlines():
        m = LABEL_RE.match(raw)
        if m and m.group(1) in PAGE_LABELS:
            current = m.group(1)
            fields.setdefault(current, [])
            rest = (m.group(2) or "").strip()
            if rest:
                fields[current].append(rest)
            continue
        if current is not None:
            fields[current].append(raw.rstrip())
    out = {k: "\n".join(v).strip() for k, v in fields.items()}
    out.pop("SYNONYMS", None)
    out["_words"] = len(path.read_text(encoding="utf-8").split())
    out["_file"] = path.name
    return out


def species_from_title(title: str) -> str:
    words = title.strip().split()
    return " ".join([words[0].capitalize()] + [w.lower() for w in words[1:]]) if words else ""


def open_fields(page: dict) -> str:
    skip = {"TITLE", "AUTHORITY", "TAGS", "PHOTOS", "_words", "_file"}
    hit = [k for k, v in page.items() if k not in skip and "⚠" in v]
    return "; ".join(hit) if hit else "none"


# ---------------------------------------------------------------- geography

# TDWG level-3 units (as POWO / the WCVP copy on GBIF name them) -> level-3 code.
# Covers the Asian and Pacific units the house works in; a unit missing here is
# matched by name against the geocoder's WGSRPD title, then by country.
TDWG_NAME2CODE = {
    "New Guinea": "NWG", "Solomon Is.": "SOL", "Bismarck Archipelago": "BIS",
    "Borneo": "BOR", "Java": "JAW", "Sumatra": "SUM", "Sumatera": "SUM",
    "Sulawesi": "SUL", "Maluku": "MLI", "Lesser Sunda Is.": "LSI",
    "Peninsular Malaysia": "MLY", "Malaya": "MLY", "Philippines": "PHI",
    "Thailand": "THA", "Vietnam": "VIE", "Laos": "LAO", "Cambodia": "CBD",
    "Myanmar": "MYA", "India": "IND", "Assam": "ASS", "Bangladesh": "BAN",
    "Nepal": "NEP", "Sri Lanka": "SRL", "Nicobar Is.": "NCB", "Andaman Is.": "AND",
    "East Himalaya": "EHM", "Taiwan": "TAI", "Hainan": "CHH",
    "China South-Central": "CHC", "China Southeast": "CHS", "Japan": "JAP",
    "Nansei-shoto": "NNS", "Ogasawara-shoto": "OGA", "Korea": "KOR",
    "Queensland": "QLD", "New South Wales": "NSW", "Northern Territory": "NTA",
    "Western Australia": "WAU", "Norfolk Is.": "NFK", "Christmas I.": "XMS",
    "Cocos (Keeling) Is.": "CKI", "Caroline Is.": "CRL", "Marianas": "MRN",
    "Marshall Is.": "MRS", "Gilbert Is.": "GIL", "Nauru": "NRU", "Tuvalu": "TUV",
    "Phoenix Is.": "PHX", "Line Is.": "LIN", "Fiji": "FIJ", "Vanuatu": "VAN",
    "Santa Cruz Is.": "SCZ", "New Caledonia": "NWC", "Samoa": "SAM",
    "Tonga": "TON", "Niue": "NUE", "Wallis-Futuna Is.": "WAL", "Tokelau-Manihiki": "TOK",
    "Cook Is.": "COO", "Cook Islands": "COO", "Society Is.": "SCI", "Society Islands": "SCI",
    "Tuamotu": "TUA", "Marquesas": "MRQ", "Tubuai Is.": "TUB", "Pitcairn Is.": "PIT",
    "Hawaii": "HAW", "New Zealand North": "NZN", "New Zealand South": "NZS",
}
# level-3 code -> countries whose records count as "within the recorded native range"
TDWG_CODE2COUNTRIES = {
    "NWG": ["Indonesia", "Papua New Guinea"], "SOL": ["Solomon Islands", "Papua New Guinea"],
    "BIS": ["Papua New Guinea"], "BOR": ["Indonesia", "Malaysia", "Brunei"],
    "JAW": ["Indonesia"], "SUM": ["Indonesia"], "SUL": ["Indonesia"], "MLI": ["Indonesia"],
    "LSI": ["Indonesia", "Timor-Leste"], "MLY": ["Malaysia", "Singapore"],
    "PHI": ["Philippines"], "THA": ["Thailand"], "VIE": ["Vietnam"], "LAO": ["Laos"],
    "CBD": ["Cambodia"], "MYA": ["Myanmar"], "IND": ["India"], "ASS": ["India"],
    "BAN": ["Bangladesh"], "NEP": ["Nepal"], "SRL": ["Sri Lanka"], "NCB": ["India"],
    "AND": ["India"], "EHM": ["Bhutan", "India"], "TAI": ["Taiwan"], "CHH": ["China"],
    "CHC": ["China"], "CHS": ["China"], "JAP": ["Japan"], "NNS": ["Japan"], "OGA": ["Japan"],
    "KOR": ["South Korea", "North Korea"], "QLD": ["Australia"], "NSW": ["Australia"],
    "NTA": ["Australia"], "WAU": ["Australia"], "NFK": ["Australia"], "XMS": ["Australia"],
    "CKI": ["Australia"], "CRL": ["Micronesia", "Palau"], "MRN": ["Guam", "Northern Mariana Islands"],
    "MRS": ["Marshall Islands"], "GIL": ["Kiribati"], "NRU": ["Nauru"], "TUV": ["Tuvalu"],
    "PHX": ["Kiribati"], "LIN": ["Kiribati"], "FIJ": ["Fiji"], "VAN": ["Vanuatu"],
    "SCZ": ["Solomon Islands"], "NWC": ["New Caledonia"], "SAM": ["Samoa", "American Samoa"],
    "TON": ["Tonga"], "NUE": ["Niue"], "WAL": ["Wallis and Futuna"], "TOK": ["Tokelau", "Cook Islands"],
    "COO": ["Cook Islands"], "SCI": ["French Polynesia"], "TUA": ["French Polynesia"],
    "MRQ": ["French Polynesia"], "TUB": ["French Polynesia"], "PIT": ["Pitcairn"],
    "HAW": ["United States"], "NZN": ["New Zealand"], "NZS": ["New Zealand"],
}
CONTINENT = {}
_ASIA = ["Indonesia", "Malaysia", "Singapore", "Brunei", "Philippines", "Thailand", "Vietnam", "Laos",
         "Cambodia", "Myanmar", "India", "Bangladesh", "Nepal", "Bhutan", "Sri Lanka", "China", "Taiwan",
         "Japan", "South Korea", "North Korea", "Timor-Leste", "Hong Kong", "Macao", "Pakistan", "Iran",
         "Israel", "Turkey", "United Arab Emirates", "Saudi Arabia", "Oman", "Qatar", "Maldives"]
_OCEANIA = ["Papua New Guinea", "Solomon Islands", "Fiji", "Vanuatu", "New Caledonia", "Micronesia",
            "Palau", "Guam", "Northern Mariana Islands", "Marshall Islands", "Kiribati", "Nauru",
            "Tuvalu", "Samoa", "American Samoa", "Tonga", "Niue", "Wallis and Futuna", "Tokelau",
            "Cook Islands", "French Polynesia", "Pitcairn", "Australia", "New Zealand"]
_NAM = ["United States", "Canada", "Mexico", "Guatemala", "Belize", "Honduras", "El Salvador",
        "Nicaragua", "Costa Rica", "Panama", "Cuba", "Jamaica", "Haiti", "Dominican Republic",
        "Puerto Rico", "Bahamas", "Trinidad and Tobago", "Barbados", "Bermuda"]
_SAM = ["Brazil", "Colombia", "Venezuela", "Ecuador", "Peru", "Bolivia", "Paraguay", "Uruguay",
        "Argentina", "Chile", "Guyana", "Suriname", "French Guiana"]
_EUR = ["United Kingdom", "Ireland", "France", "Germany", "Belgium", "Netherlands", "Luxembourg",
        "Switzerland", "Austria", "Italy", "Spain", "Portugal", "Sweden", "Norway", "Denmark",
        "Finland", "Poland", "Czechia", "Czech Republic", "Hungary", "Greece", "Russia", "Ukraine",
        "Romania", "Bulgaria", "Croatia", "Slovenia", "Slovakia", "Estonia", "Latvia", "Lithuania"]
_AFR = ["South Africa", "Kenya", "Tanzania", "Uganda", "Nigeria", "Ghana", "Cameroon", "Gabon",
        "Congo", "DR Congo", "Democratic Republic of the Congo", "Madagascar", "Mauritius", "Réunion",
        "Seychelles", "Ethiopia", "Egypt", "Morocco", "Senegal", "Côte d'Ivoire", "Ivory Coast",
        "Liberia", "Sierra Leone", "Mozambique", "Zambia", "Zimbabwe", "Angola", "Rwanda"]
for _lst, _name in ((_ASIA, "Asia"), (_OCEANIA, "Oceania"), (_NAM, "North America"),
                    (_SAM, "South America"), (_EUR, "Europe"), (_AFR, "Africa")):
    for _c in _lst:
        CONTINENT[_c] = _name

ISO2 = {
    "ID": "Indonesia", "PG": "Papua New Guinea", "SB": "Solomon Islands", "MY": "Malaysia",
    "SG": "Singapore", "PH": "Philippines", "FM": "Micronesia", "PW": "Palau", "FJ": "Fiji",
    "KI": "Kiribati", "MH": "Marshall Islands", "WS": "Samoa", "AS": "American Samoa",
    "PF": "French Polynesia", "VU": "Vanuatu", "CK": "Cook Islands", "BN": "Brunei", "TH": "Thailand",
    "AU": "Australia", "US": "United States", "GU": "Guam", "MP": "Northern Mariana Islands",
    "TL": "Timor-Leste", "NC": "New Caledonia", "TO": "Tonga", "NR": "Nauru", "TV": "Tuvalu",
    "IN": "India", "LK": "Sri Lanka", "CN": "China", "TW": "Taiwan", "JP": "Japan", "VN": "Vietnam",
    "LA": "Laos", "KH": "Cambodia", "MM": "Myanmar", "BD": "Bangladesh", "NP": "Nepal", "BT": "Bhutan",
    "HK": "Hong Kong", "KR": "South Korea", "NZ": "New Zealand", "DE": "Germany", "FR": "France",
    "GB": "United Kingdom", "BE": "Belgium", "NL": "Netherlands", "SE": "Sweden", "CH": "Switzerland",
    "AT": "Austria", "IT": "Italy", "ES": "Spain", "PT": "Portugal", "DK": "Denmark", "NO": "Norway",
    "FI": "Finland", "PL": "Poland", "CZ": "Czechia", "RU": "Russia", "IE": "Ireland",
    "BR": "Brazil", "TT": "Trinidad and Tobago", "MX": "Mexico", "CR": "Costa Rica", "PA": "Panama",
    "CO": "Colombia", "EC": "Ecuador", "PE": "Peru", "VE": "Venezuela", "GT": "Guatemala",
    "HN": "Honduras", "NI": "Nicaragua", "BZ": "Belize", "JM": "Jamaica", "CU": "Cuba",
    "DO": "Dominican Republic", "HT": "Haiti", "PR": "Puerto Rico", "AR": "Argentina", "BO": "Bolivia",
    "PY": "Paraguay", "GY": "Guyana", "SR": "Suriname", "GF": "French Guiana", "CA": "Canada",
    "ZA": "South Africa", "KE": "Kenya", "TZ": "Tanzania", "UG": "Uganda", "NG": "Nigeria", "GH": "Ghana",
    "CM": "Cameroon", "GA": "Gabon", "CG": "Congo", "CD": "DR Congo", "MG": "Madagascar",
    "MU": "Mauritius", "RE": "Réunion", "SC": "Seychelles", "ET": "Ethiopia", "SN": "Senegal",
    "CI": "Côte d'Ivoire", "LR": "Liberia", "SL": "Sierra Leone", "MZ": "Mozambique",
}
GENERIC_SUBUNITS = {"", "new guinea", "borneo", "cultivated", "unknown", "n/a", "none"}

# Province names that mean the same unit in different languages or under older
# administrative divisions, so a subunit list does not repeat itself.
SUBUNIT_ALIASES = {
    "irian jaya barat": "West Papua", "papua barat": "West Papua",
    "west papua province": "West Papua", "irian jaya": "Papua",
    "western new guinea": "Papua", "north solomons": "Bougainville",
    "autonomous region of bougainville": "Bougainville", "northern": "Oro",
    "northern province": "Oro", "west sepik": "Sandaun", "chimbu": "Simbu",
}
# Where a TDWG unit takes in only part of a country, the provinces that belong
# to it. A country absent here contributes all of its provinces.
BISMARCK = {"manus", "new ireland", "east new britain", "west new britain"}
BOUGAINVILLE = {"bougainville"}
UNIT_SUBUNITS = {
    "NWG": {"Papua New Guinea": ("exclude", BISMARCK | BOUGAINVILLE),
            "Indonesia": ("include-if", ("papua", "irian jaya"))},
    "BIS": {"Papua New Guinea": ("include", BISMARCK)},
    "SOL": {"Papua New Guinea": ("include", BOUGAINVILLE)},
}


def subunit_allowed(codes: set, country: str, sub: str) -> bool:
    """True when the subunit sits inside one of the species' native TDWG units."""
    rules = [UNIT_SUBUNITS[c][country] for c in codes
             if c in UNIT_SUBUNITS and country in UNIT_SUBUNITS[c]]
    plain = [c for c in codes if c not in UNIT_SUBUNITS or country not in UNIT_SUBUNITS[c]]
    if plain:                                   # some unit takes the whole country
        return True
    s = sub.lower()
    for kind, values in rules:
        if kind == "exclude" and s not in values:
            return True
        if kind == "include" and s in values:
            return True
        if kind == "include-if" and any(v in s for v in values):
            return True
    return not rules


def native_codes_and_countries(native_units: list) -> tuple:
    codes, countries = set(), set()
    for unit in native_units:
        code = TDWG_NAME2CODE.get(unit)
        if code:
            codes.add(code)
            countries.update(TDWG_CODE2COUNTRIES.get(code, []))
        else:
            countries.add(unit)
    return codes, countries


def native_continents(countries: set) -> set:
    return {CONTINENT[c] for c in countries if c in CONTINENT}


# ---------------------------------------------------------------- iNaturalist places

def geocode(lat: float, lng: float, session, tries: int = 4) -> list:
    url = f"https://api.gbif.org/v1/geocode/reverse?lat={lat}&lng={lng}"
    for i in range(tries):
        try:
            r = session.get(url, timeout=30)
            if r.status_code == 200:
                return r.json()
        except Exception:  # noqa: BLE001 - network hiccups through the proxy
            pass
        time.sleep(1.5 * (i + 1))
    return []


def place_from_guess(guess: str) -> dict:
    """Last-resort parsing of iNaturalist's free-text place_guess."""
    parts = [p.strip() for p in guess.split(",") if p.strip()]
    if not parts:
        return {"country": "", "gadm1": ""}
    last = parts[-1]
    country = ISO2.get(last.upper(), last) if len(last) == 2 else last
    country = {"Indonesien": "Indonesia", "Alemania": "Germany", "Deutschland": "Germany",
               "België": "Belgium", "ประเทศไทย": "Thailand", "Micronesia": "Micronesia"}.get(country, country)
    gadm1 = parts[-2] if len(parts) >= 2 else ""
    return {"country": country, "gadm1": gadm1}


def load_places(cache: Path) -> dict:
    out = {}
    if cache.exists():
        with cache.open(encoding="utf-8") as fh:
            for row in csv.DictReader(fh):
                out[row["observation_id"]] = row
    return out


def refresh_places(obs_rows: list, cache: Path) -> dict:
    import requests  # only needed with --geocode
    places = load_places(cache)
    session = requests.Session()
    session.headers["User-Agent"] = "Aroidpedia build-genus-sheets (github.com/wainblatrobert/aroidpedia)"
    todo = [r for r in obs_rows if r["observation_id"] not in places]
    print(f"geocoding {len(todo)} observations ({len(places)} cached)")
    for i, r in enumerate(todo, 1):
        rec = {"observation_id": r["observation_id"], "latitude": r.get("latitude", ""),
               "longitude": r.get("longitude", ""), "country": "", "iso2": "", "gadm1": "",
               "gadm2": "", "wgsrpd": "", "source": ""}
        lat, lng = r.get("latitude"), r.get("longitude")
        hits = geocode(float(lat), float(lng), session) if lat and lng else []
        if hits:
            for h in hits:
                t = h.get("type")
                if t == "GADM0":
                    rec["country"] = h.get("title", ""); rec["iso2"] = h.get("isoCountryCode2Digit", "")
                elif t == "GADM1":
                    rec["gadm1"] = h.get("title", "")
                elif t == "GADM2":
                    rec["gadm2"] = h.get("title", "")
                elif t == "WGSRPD":
                    rec["wgsrpd"] = h.get("id", "").replace("WGSRPD:", "")
            rec["source"] = "gbif-geocode"
        else:
            g = place_from_guess(r.get("place_guess", ""))
            rec.update(country=g["country"], gadm1=g["gadm1"], source="place_guess")
        places[rec["observation_id"]] = rec
        if i % 25 == 0:
            print(f"  {i}/{len(todo)}")
        time.sleep(0.15)
    with cache.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["observation_id", "latitude", "longitude", "country", "iso2",
                                           "gadm1", "gadm2", "wgsrpd", "source"])
        w.writeheader()
        for k in sorted(places, key=lambda x: int(x) if x.isdigit() else 0):
            w.writerow(places[k])
    return places


def inaturalist_column(obs: list, places: dict, native_units: list) -> str:
    """The base's INATURALIST column: subunit counts split by the recorded native range."""
    if not obs:
        return ""
    codes, countries = native_codes_and_countries(native_units)
    continents = native_continents(countries)
    buckets = {"in": Counter(), "out": Counter(), "far": Counter()}
    for r in obs:
        p = places.get(r["observation_id"]) or {**place_from_guess(r.get("place_guess", "")), "wgsrpd": ""}
        country = p.get("country", "") or "unknown"
        label = f"{p.get('gadm1')}, {country}" if p.get("gadm1") else country
        code3 = (p.get("wgsrpd") or "")[:3]
        if (code3 and code3 in codes) or (not code3 and country in countries):
            buckets["in"][label] += 1
        elif CONTINENT.get(country) in continents or country == "unknown":
            buckets["out"][label] += 1
        else:
            buckets["far"][label] += 1
    parts = []
    if buckets["in"]:
        parts.append("SUBUNITS (within recorded native range):\n" + "\n".join(
            f"{k} ({v})" for k, v in sorted(buckets["in"].items())))
    if buckets["out"]:
        parts.append("NOT IN THE RECORDED NATIVE RANGE (verify before any tag):\n" + "\n".join(
            f"{k} ({v})" for k, v in sorted(buckets["out"].items())))
    if buckets["far"]:
        parts.append("LIKELY INTRODUCED (trans-continental — almost certainly cultivated/naturalized):\n"
                     + "\n".join(f"{k} ({v})" for k, v in sorted(buckets["far"].items())))
    return "\n\n".join(parts)


# ---------------------------------------------------------------- GBIF subunits

def additional_distribution(gbif_rows: list, native_units: list) -> str:
    codes, countries = native_codes_and_countries(native_units)
    per_country: dict = defaultdict(Counter)
    for r in gbif_rows:
        country = ISO2.get((r.get("countryCode") or "").upper(), "")
        sub = (r.get("stateProvince") or "").strip()
        if not country or country not in countries or sub.lower() in GENERIC_SUBUNITS:
            continue
        sub = re.sub(r"\s*\([^)]*\)\s*$", "", sub)           # "Temotu Province (泰莫圖省)"
        sub = re.sub(r"\s+Province$", "", sub).strip()
        sub = SUBUNIT_ALIASES.get(sub.lower(), sub)
        if not subunit_allowed(codes, country, sub):
            continue
        per_country[country][sub] += 1
    lines = []
    for country, subs in sorted(per_country.items(), key=lambda kv: -sum(kv[1].values())):
        seen, ordered = set(), []
        for s in sorted(subs, key=lambda s: (-subs[s], s)):
            if s.lower() not in seen:
                seen.add(s.lower()); ordered.append(s)
        lines.append(f"{country}: {', '.join(ordered)}")
    return "\n".join(lines)


# ---------------------------------------------------------------- helpers

YEAR_RE = re.compile(r"\((1[5-9]\d\d|20\d\d)\)")


def journal_string(protologue: str) -> str:
    """POWO-style citation ending in '(YYYY)' so the base's YEAR formula works."""
    s = (protologue or "").strip()
    m = list(YEAR_RE.finditer(s))
    if m:
        s = s[: m[0].end()]
    s = re.sub(r"\s*\(\d{4}\)\s*(\(\d{4}\))$", r" \1", s).strip()
    return s.rstrip(".").strip()


URL_RE = re.compile(r"https?://\S+")
PAGE_RE = re.compile(r":\s*(\d+)")


def protologue_page_year(citation: str) -> tuple:
    """Page and year out of a POWO-style citation, e.g. 'Blumea 33(2): 455 (1988)'."""
    page = PAGE_RE.search(citation)
    year = YEAR_RE.search(citation)
    if not page:  # 'Bull. Jard. Bot. Buitenzorg ser. III, i. 371 (1920).'
        m = re.search(r"\b(\d{1,4})\s*\(\d{4}\)", citation)
        return (m.group(1) if m else ""), (year.group(1) if year else "")
    return page.group(1), (year.group(1) if year else "")


def protologue_scan(scans: list, citation: str) -> bool:
    """Is the protologue page itself among the scans held?"""
    page, year = protologue_page_year(citation)
    if not page or not year:
        return False
    for s in scans:
        if year in s.get("source", "") and re.match(rf"{page}\b", s.get("printed_page_and_content", "")):
            return True
    return False


ORIGINAL_RE = re.compile(r"^(?:From the protologue|Translated from protologue|Original description)[:.]\s*(.*)$")


def protologue_text(page: dict, has_scan: bool) -> str:
    """The base's PROTOLOGUE TEXT cell: 'image' when a page scan is held, else the
    original description transcribed in the draft (as the Scindapsus sheet does)."""
    if has_scan:
        return "image"
    for para in page.get("PROTOLOGUE", "").split("\n"):
        m = ORIGINAL_RE.match(para.strip())
        if m:
            return m.group(1).strip()
    return ""


def split_url(text: str) -> tuple:
    m = URL_RE.search(text)
    if not m:
        return text.strip().rstrip(" —-"), ""
    return text[: m.start()].strip().rstrip(" —-.").strip(), m.group(0).rstrip(".,)")


def references(page: dict) -> list:
    out = []
    for line in page.get("REFERENCES", "").splitlines():
        m = re.match(r"^\s*(\d+)\.\s*(.*)$", line)
        if m:
            out.append((int(m.group(1)), m.group(2).strip()))
    return out


def protologue_name_and_url(page: dict, bib_url: str, fallback_journal: str) -> str:
    m = re.search(r"published in (.+?) \((\d{4})\)", page.get("PROTOLOGUE", ""))
    name = f"{m.group(1)} ({m.group(2)})" if m else fallback_journal
    name = name.replace(" — protologue", "")
    url = ""
    for n, text in references(page):
        if n == 2:
            _, url = split_url(text)
    url = url or (bib_url if bib_url.startswith("http") else "")
    return f"{name} | {url}" if url else name


def additional_references(page: dict, species: str) -> str:
    lines = []
    refs = references(page)
    for n, text in refs:
        if text.startswith("iNaturalist:"):
            _, url = split_url(text)
            lines.append(f"iNaturalist: {species} | {url}" if url else text)
    for n, text in refs:
        if n <= 2 or text.startswith("iNaturalist:") or text.startswith("GBIF"):
            continue
        body, url = split_url(text)
        body = body.replace(" — protologue", "").replace(" — basionym", "")
        lines.append(f"{body} | {url}" if url else body)
    return "\n".join(lines)


def notes_block(page: dict) -> str:
    items = re.split(r"\n(?=\d+\.\s)", page.get("NOTES", "").strip())
    return "\n\n".join(i.strip() for i in items if i.strip())


def kew_link(powo_url: str) -> str:
    if not powo_url:
        return ""
    base, _, ident = powo_url.rpartition("/")
    return f"{base}/{urllib.parse.quote(ident, safe='')}"


def na(value: str) -> str:
    return "" if value.strip().upper() in ("N/A", "NONE", "-") else value


# ---------------------------------------------------------------- workbooks

HEADER_FILL = PatternFill("solid", fgColor="0B5394")
HEADER_FONT = Font(bold=True, color="FFFFFF")
BODY_FONT = Font(name="Calibri", size=11)
BLUE_FONT = Font(name="Calibri", size=11, color="0000FF")
BASE_HEADERS = [
    "AP", "SPECIES NAME", "HOMOTYPIC SYNONYMS", "HETEROTYPIC SYNONYMS", "ACCEPTED INFRASPECIFICS",
    "OTHER NAMES", "GEOGRAPHY", "DOUBTFULLY PRESENT", "YEAR DESCRIBED", "JOURNAL", "JOURNAL AVAILABLE",
    "PROTOLOGUE NAME & URL", "PROTOLOGUE TEXT", "DESCRIPTION", "INFLORESCENCE", "ADDITIONAL DISTRIBUTION",
    "INATURALIST", "ECOLOGY", "ETYMOLOGY", "ADDITIONAL CREDITS", "NOTES", "PROPAGATION", "STORY",
    "ADDITIONAL REFERENCES", "HYBRIDS", "KEW LINK",
]
BASE_WIDTHS = {"A": 11, "B": 32.9, "C": 74.9, "D": 10, "E": 17.6, "F": 19.8, "G": 65.4, "H": 10.9,
               "I": 9.6, "J": 66.6, "K": 4.4, "L": 81.9, "M": 17.5, "N": 18.6, "O": 37.8, "P": 29.8,
               "Q": 57.6, "R": 33.5, "S": 29.6, "T": 24.2, "U": 45.4, "V": 80.9, "W": 23.6, "X": 90.5,
               "Y": 79.4, "Z": 67.8, "AA": 29.1}
WRAP_COLS = set("LMNOPQRSTUY")
CULTIVAR_HEADERS = ["CULTIVAR NAME", "CULTIVAR SPECIES", "ORIGIN", "ADDITIONAL CREDITS", "DESCRIPTION",
                    "VARIEGATED FORMS", "HYBRIDS", "NOTES", "STORY", "ADDITIONAL REFERENCES", "SLUG"]
HYBRID_HEADERS = ["AP", "HYBRID NAME", "SYNONYM", "PARENTAGE", "OVULE", "POLLEN", "HYBRIDIZER", "LINK",
                  "ADDITIONAL CREDITS", "ORIGIN", "VARIEGATED FORMS", "DESCRIPTION", "HYBRIDS", "HYBRID DUPES",
                  "NOMENCLATURE DEBATE", "NOTES", "STORY", "ADDITIONAL REFERENCES", "SLUG", "CLASS"]


def write_base(path: Path, rows: list) -> None:
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "SPECIES"
    for c, h in enumerate(BASE_HEADERS, 1):
        cell = ws.cell(1, c, h)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(vertical="center" if c >= 12 else "bottom",
                                   wrap_text=(12 <= c <= 21 or c in (25, 26)))
    ws["A1"] = '="AP "&ROUNDUP(AC1*100,1)&"%"'
    ws["AC1"] = "=AD1/COUNTA(B2:B31)"
    ws["AD1"] = '=COUNTIF(A2:A31,"Y")'
    ws.row_dimensions[1].height = 26.25
    for i, row in enumerate(rows, 2):
        for c, h in enumerate(BASE_HEADERS, 1):
            v = row.get(h, "")
            if h == "YEAR DESCRIBED":
                v = f"=left(RIGHT(J{i},5),4)"
            cell = ws.cell(i, c, v)
            cell.font = BLUE_FONT if h == "INATURALIST" else BODY_FONT
            col = get_column_letter(c)
            cell.alignment = Alignment(vertical="center" if c >= 12 else "bottom", wrap_text=col in WRAP_COLS)
        ws.row_dimensions[i].height = 26.25
    for col, w in BASE_WIDTHS.items():
        ws.column_dimensions[col].width = w
    ws.freeze_panes = "C2"
    ws.auto_filter.ref = f"A1:AV{max(len(rows) + 1, 2)}"

    wc = wb.create_sheet("CULTIVARS")
    wc.append(CULTIVAR_HEADERS)
    for col, w in {"A": 30.1, "B": 16.6, "C": 48.8, "D": 72.8, "E": 12.4, "F": 18, "G": 8.4, "J": 22.9}.items():
        wc.column_dimensions[col].width = w
    wh = wb.create_sheet("HYBRIDS")
    wh.append(HYBRID_HEADERS)
    for c, h in enumerate(HYBRID_HEADERS, 1):
        wh.cell(1, c).font = Font(bold=h not in ("ADDITIONAL CREDITS", "CLASS"))
    for col, w in {"B": 37.8, "C": 45.4, "E": 21.5, "F": 14.2, "H": 36.4, "I": 27.6}.items():
        wh.column_dimensions[col].width = w
    wr = wb.create_sheet("ROW BACKUPS")
    wr.append(["BACKUP DATE", "NOTE", "AP 0%"] + BASE_HEADERS[1:])
    wb.save(path)


def write_pages(xlsx: Path, csv_path: Path, rows: list) -> None:
    with csv_path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=PAGES_COLUMNS)
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in PAGES_COLUMNS})
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "PAGES"
    ws.append(PAGES_COLUMNS)
    fill = PatternFill("solid", fgColor="E8EFE6")
    for c in range(1, len(PAGES_COLUMNS) + 1):
        ws.cell(1, c).font = Font(bold=True)
        ws.cell(1, c).fill = fill
    for r in rows:
        ws.append([r.get(k, "") for k in PAGES_COLUMNS])
    widths = {"A": 28, "B": 28, "C": 26, "D": 40, "E": 40, "F": 70, "G": 40, "H": 60, "I": 24, "J": 40,
              "K": 60, "L": 70, "M": 70, "N": 50, "O": 30, "P": 50, "Q": 80, "R": 80, "S": 30, "T": 8}
    for col, w in widths.items():
        ws.column_dimensions[col].width = w
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(vertical="top", wrap_text=True)
    ws.freeze_panes = "B2"
    sc = wb.create_sheet("SCHEMA")
    for r in SCHEMA_ROWS:
        sc.append(list(r))
    sc.column_dimensions["A"].width = 26
    sc.column_dimensions["B"].width = 110
    sc["A1"].font = Font(bold=True); sc["B1"].font = Font(bold=True)
    wb.save(xlsx)


# ---------------------------------------------------------------- main

def read_csv(path: Path) -> list:
    if not path.exists():
        return []
    with path.open(encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("genus")
    ap.add_argument("--geocode", action="store_true", help="refresh the iNaturalist places cache (network)")
    args = ap.parse_args()
    genus, g = args.genus, args.genus.lower()

    research = ROOT / "research" / g
    base_dir = ROOT / "data" / "species-base"
    names = json.loads((base_dir / f"{genus}-names.json").read_text(encoding="utf-8"))
    accepted = {a["name"]: a for a in names["accepted"]}
    pages = [parse_page(p) for p in sorted((research / "pages").glob("*.md")) if p.name != "README.md"]
    by_name = {species_from_title(p.get("TITLE", "")): p for p in pages}
    missing = sorted(set(accepted) - set(by_name))
    if missing:
        print("no page draft for:", ", ".join(missing))

    obs_all = read_csv(research / "data" / f"{g}-inat-observations.csv")
    gbif_all = read_csv(research / "data" / f"{g}-gbif-occurrences.csv")
    scans = read_csv(research / "data" / "protologue-scans.csv")
    bib = json.loads((research / "bibliography.json").read_text(encoding="utf-8")).get("entries", []) \
        if (research / "bibliography.json").exists() else []
    places_cache = research / "data" / f"{g}-inat-places.csv"
    places = refresh_places([r for r in obs_all if r.get("taxon_rank") != "genus"], places_cache) \
        if args.geocode else load_places(places_cache)
    if not places:
        print("no places cache: the INATURALIST column falls back to iNaturalist's place_guess text "
              "(run with --geocode to reverse-geocode the observations)")

    # ---- the pages workbook: keep the existing row order, append new species by year then name
    prev = [r["SPECIES NAME"] for r in read_csv(base_dir / f"{genus}-pages.csv")]
    order = [n for n in prev if n in by_name] + sorted(
        (n for n in by_name if n not in prev), key=lambda n: (accepted.get(n, {}).get("year") or 9999, n))
    page_rows = []
    for name in order:
        p = by_name[name]
        row = {"SPECIES NAME": name, "FIELDS STILL OPEN": open_fields(p), "WORDS": p["_words"]}
        for k in PAGES_COLUMNS:
            if k in p:
                row[k] = p[k]
        page_rows.append(row)
    write_pages(base_dir / f"{genus}-pages.xlsx", base_dir / f"{genus}-pages.csv", page_rows)
    print(f"pages: {len(page_rows)} species -> {base_dir / (genus + '-pages.xlsx')}")

    # ---- the base workbook (Drive layout), alphabetical like the Syngonium / Scindapsus sheets
    base_rows = []
    for name in sorted(by_name):
        p, a = by_name[name], accepted.get(name, {})
        epithet = name.split()[-1]
        het = p.get("HETEROTYPIC SYNONYMS", "")
        other = ""
        if het.upper().startswith("N/A.") or het.upper().startswith("N/A;"):
            other, het = het[4:].strip(), ""
        bib_hit = next((e for e in bib if any(f"{epithet} protologue" in c.lower() for c in e.get("concerns", []))), {})
        status = (bib_hit.get("status") or "").lower()
        has_scan = protologue_scan(scans, a.get("protologue", ""))
        held = has_scan or (status.startswith("held") and "⚠" not in p.get("PROTOLOGUE", ""))
        obs = [r for r in obs_all if r.get("species") == name]
        gbif = [r for r in gbif_all if r.get("species") == name or r.get("acceptedScientificName", "").startswith(name + " ")]
        journal = journal_string(a.get("protologue", ""))
        base_rows.append({
            "AP": "",
            "SPECIES NAME": name,
            "HOMOTYPIC SYNONYMS": na(p.get("HOMOTYPIC SYNONYMS", "")),
            "HETEROTYPIC SYNONYMS": na(het),
            "ACCEPTED INFRASPECIFICS": na(p.get("ACCEPTED INFRASPECIFICS", "")),
            "OTHER NAMES": other,
            "GEOGRAPHY": ", ".join(a.get("native", [])),
            "DOUBTFULLY PRESENT": ", ".join(a.get("other", [])),
            "JOURNAL": journal,
            "JOURNAL AVAILABLE": "Y" if held else "N",
            "PROTOLOGUE NAME & URL": protologue_name_and_url(p, bib_hit.get("source", "") or a.get("bhlLink", ""), journal),
            "PROTOLOGUE TEXT": protologue_text(p, has_scan),
            "DESCRIPTION": p.get("SPECIES DESCRIPTION", ""),
            "INFLORESCENCE": p.get("INFLORESCENCE", ""),
            "ADDITIONAL DISTRIBUTION": additional_distribution(gbif, a.get("native", [])),
            "INATURALIST": inaturalist_column(obs, places, a.get("native", [])),
            "ECOLOGY": p.get("ECOLOGY", ""),
            "ETYMOLOGY": p.get("ETYMOLOGY", ""),
            "ADDITIONAL CREDITS": "",
            "NOTES": notes_block(p),
            "PROPAGATION": "",
            "STORY": "",
            "ADDITIONAL REFERENCES": additional_references(p, name),
            "HYBRIDS": "",
            "KEW LINK": kew_link(a.get("powoUrl", "")),
        })
    write_base(base_dir / f"{genus}-base.xlsx", base_rows)
    print(f"base:  {len(base_rows)} species -> {base_dir / (genus + '-base.xlsx')}")


if __name__ == "__main__":
    main()
