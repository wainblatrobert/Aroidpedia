#!/usr/bin/env python3
"""Give a new genus book the layout of a live one, without touching either's values.

    python scripts/match-sheet-layout.py --ref <live book id> --target <new book id>          # report
    python scripts/match-sheet-layout.py --ref <live book id> --target <new book id> --apply  # write

Why (owner, 2026-09-29): the Cyrtosperma book, built in the cloud from an xlsx, turned out
to be missing parts once it reached the laptop (no ROW BACKUPS, CULTIVARS/HYBRIDS headers
added later). A book built from a workbook carries only what the workbook knew; the live
books carry what the owner has set by hand since. This compares the two and copies the
reference's layout onto the target:

  spreadsheet  time zone and locale
  tabs         a reference tab the target lacks is added at the same position, with the
               reference's header row (row 1) and nothing below it
  per tab      column count (not for tabs over 100 columns: ROW BACKUPS' width is a
               leftover of the pre-sheet_backup append drift), column widths, frozen rows
               and columns, row heights (header and body), the basic filter's column span
  per column   the header cell's format, and the body format the reference uses on most
               of its rows, applied to every body row of the target
  links        a column whose reference cells link to their own URL text (KEW LINK) gets
               the same link on each target cell that holds a URL

It never writes a value into an existing tab, and it only reads the reference. Header
text differences are reported, not fixed. Dry run by default.
"""
from __future__ import annotations

import argparse
import copy
import json
import sys
from collections import Counter
from pathlib import Path

DEFAULT_KEY = Path.home() / ".gcp" / "aroidpedia-sheets.json"
MAX_SCAN_ROWS = 700      # body rows read from the reference to find each column's usual format
WIDE_TAB = 100           # tabs wider than this keep their own column count


def col(i: int) -> str:
    s, i = "", i + 1
    while i:
        i, r = divmod(i - 1, 26)
        s = chr(65 + r) + s
    return s


def strip_cell_specific(fmt: dict) -> dict:
    """A cell's format without what belongs to that cell alone (its link)."""
    f = copy.deepcopy(fmt or {})
    tf = f.get("textFormat")
    if tf:
        tf.pop("link", None)
        if not tf:
            f.pop("textFormat")
    return f


def read_book(sh, scan_rows: int) -> dict:
    meta = sh.fetch_sheet_metadata(params={"fields": "properties(timeZone,locale),sheets(properties,basicFilter)"})
    tabs = []
    for s in meta["sheets"]:
        p = s["properties"]
        gp = p["gridProperties"]
        ncols = min(gp["columnCount"], 60)
        last = min(gp["rowCount"], scan_rows + 1)
        rng = f"'{p['title']}'!A1:{col(ncols - 1)}{last}"
        g = sh.fetch_sheet_metadata(params={
            "includeGridData": "true", "ranges": [rng],
            "fields": "sheets(data(columnMetadata(pixelSize),rowMetadata(pixelSize),"
                      "rowData/values(userEnteredValue,userEnteredFormat)))"})
        d = g["sheets"][0]["data"][0]
        rows = [r.get("values", []) for r in d.get("rowData", [])]
        tabs.append({
            "title": p["title"], "index": p["index"], "sheetId": p["sheetId"], "grid": gp,
            "widths": [c.get("pixelSize") for c in d.get("columnMetadata", [])][:gp["columnCount"]],
            "heights": [r.get("pixelSize") for r in d.get("rowMetadata", [])],
            "rows": rows, "ncols": ncols,
            "filter": s.get("basicFilter", {}).get("range"),
        })
    return {"props": meta["properties"], "tabs": tabs}


def cell(rows, r, c):
    return rows[r][c] if r < len(rows) and c < len(rows[r]) else {}


def text(v: dict) -> str:
    uv = v.get("userEnteredValue", {})
    return str(next(iter(uv.values()))) if uv else ""


def body_formats(tab: dict) -> list:
    """Per column: the reference's most common body format, cell-specific parts removed."""
    out = []
    for c in range(tab["ncols"]):
        cnt = Counter(json.dumps(strip_cell_specific(cell(tab["rows"], r, c).get("userEnteredFormat")), sort_keys=True)
                      for r in range(1, len(tab["rows"])))
        out.append(json.loads(cnt.most_common(1)[0][0]) if cnt else {})
    return out


def link_columns(tab: dict) -> set:
    """Columns whose non-empty body cells mostly link to their own URL text."""
    hits = set()
    for c in range(tab["ncols"]):
        vals = [cell(tab["rows"], r, c) for r in range(1, len(tab["rows"]))]
        urls = [v for v in vals if text(v).startswith("http")]
        linked = [v for v in urls if v.get("userEnteredFormat", {}).get("textFormat", {}).get("link", {}).get("uri") == text(v)]
        if urls and len(linked) >= 0.9 * len(urls):
            hits.add(c)
    return hits


def mode(values):
    vals = [v for v in values if v]
    return Counter(vals).most_common(1)[0][0] if vals else None


def plan(ref: dict, tgt: dict) -> tuple:
    reqs, notes, new_tabs = [], [], []
    rp, tp = ref["props"], tgt["props"]
    changes = {k: rp[k] for k in ("timeZone", "locale") if rp.get(k) != tp.get(k)}
    if changes:
        notes.append(f"spreadsheet: {', '.join(f'{k} {tp.get(k)} -> {v}' for k, v in changes.items())}")
        reqs.append({"updateSpreadsheetProperties": {"properties": changes, "fields": ",".join(changes)}})
    tmap = {t["title"]: t for t in tgt["tabs"]}
    for rt in ref["tabs"]:
        if rt["title"] not in tmap:
            header = [text(v) for v in (rt["rows"][0] if rt["rows"] else [])]
            notes.append(f"{rt['title']}: missing, added at position {rt['index'] + 1} with the header row "
                         f"({len([h for h in header if h])} columns)")
            new_tabs.append((rt, header))
    return reqs, notes, new_tabs


def layout_requests(rt: dict, tt: dict, notes: list) -> list:
    sid, reqs = tt["sheetId"], []
    title = rt["title"]
    rgp, tgp = rt["grid"], tt["grid"]
    # header text: report only
    rh = [text(v) for v in (rt["rows"][0] if rt["rows"] else [])]
    th = [text(v) for v in (tt["rows"][0] if tt["rows"] else [])]
    diffs = [f"{col(i)} '{a}' vs '{b}'" for i, (a, b) in enumerate(zip(rh + [""] * 60, th + [""] * 60))
             if (a or b) and a != b and not (a.startswith("=") or a.startswith("AP "))]
    if diffs:
        notes.append(f"{title}: header text differs (left as is): {'; '.join(diffs[:8])}")
    # grid size and frozen panes
    props, fields = {}, []
    ncols = tgp["columnCount"]
    if rgp["columnCount"] <= WIDE_TAB and rgp["columnCount"] > tgp["columnCount"]:
        ncols = rgp["columnCount"]
        props["columnCount"] = ncols
        fields.append("gridProperties.columnCount")
    for k in ("frozenRowCount", "frozenColumnCount"):
        if rgp.get(k, 0) != tgp.get(k, 0):
            props[k] = rgp.get(k, 0)
            fields.append(f"gridProperties.{k}")
    if props:
        notes.append(f"{title}: grid {props}")
        reqs.append({"updateSheetProperties": {"properties": {"sheetId": sid, "gridProperties": props},
                                               "fields": ",".join(fields)}})
    # column widths
    changed = 0
    for i, w in enumerate(rt["widths"][:ncols]):
        tw = tt["widths"][i] if i < len(tt["widths"]) else None
        if w and w != tw:
            changed += 1
            reqs.append({"updateDimensionProperties": {
                "range": {"sheetId": sid, "dimension": "COLUMNS", "startIndex": i, "endIndex": i + 1},
                "properties": {"pixelSize": w}, "fields": "pixelSize"}})
    if changed:
        notes.append(f"{title}: {changed} column widths")
    # row heights: header and body
    rows_total = tgp["rowCount"]
    h1, hb = (rt["heights"][0] if rt["heights"] else None), mode(rt["heights"][1:])
    for start, end, h in ((0, 1, h1), (1, rows_total, hb)):
        if h:
            reqs.append({"updateDimensionProperties": {
                "range": {"sheetId": sid, "dimension": "ROWS", "startIndex": start, "endIndex": end},
                "properties": {"pixelSize": h}, "fields": "pixelSize"}})
    # formats: header cell by cell, body column by column
    header_cells = [{"userEnteredFormat": strip_cell_specific(cell(rt["rows"], 0, c).get("userEnteredFormat"))}
                    for c in range(min(rt["ncols"], ncols))]
    reqs.append({"updateCells": {"rows": [{"values": header_cells}], "fields": "userEnteredFormat",
                                 "start": {"sheetId": sid, "rowIndex": 0, "columnIndex": 0}}})
    bf = body_formats(rt)
    for c, f in enumerate(bf[:ncols]):
        reqs.append({"repeatCell": {
            "range": {"sheetId": sid, "startRowIndex": 1, "endRowIndex": rows_total,
                      "startColumnIndex": c, "endColumnIndex": c + 1},
            "cell": {"userEnteredFormat": f}, "fields": "userEnteredFormat"}})
    tb = body_formats(tt)
    fdiff = [col(c) for c in range(min(len(bf), len(tb), ncols)) if bf[c] != tb[c]]
    hdiff = [col(c) for c in range(len(header_cells))
             if header_cells[c]["userEnteredFormat"] != strip_cell_specific(cell(tt["rows"], 0, c).get("userEnteredFormat"))]
    if hdiff:
        notes.append(f"{title}: header format {', '.join(hdiff)}")
    if fdiff:
        notes.append(f"{title}: body format {', '.join(fdiff)}")
    # self-links (KEW LINK)
    for c in sorted(link_columns(rt)):
        n = 0
        for r in range(1, len(tt["rows"])):
            v = text(cell(tt["rows"], r, c))
            have = cell(tt["rows"], r, c).get("userEnteredFormat", {}).get("textFormat", {}).get("link", {}).get("uri")
            if v.startswith("http") and have != v:
                n += 1
                fmt = dict(bf[c])
                fmt["textFormat"] = dict(fmt.get("textFormat", {}), link={"uri": v})
                reqs.append({"updateCells": {"rows": [{"values": [{"userEnteredFormat": fmt}]}],
                                             "fields": "userEnteredFormat",
                                             "start": {"sheetId": sid, "rowIndex": r, "columnIndex": c}}})
        if n:
            notes.append(f"{title}: column {col(c)} ({rh[c] if c < len(rh) else ''}) links on {n} URL cells")
    # basic filter: the reference's column span over the target's used rows
    if rt["filter"]:
        used = max((r + 1 for r, row in enumerate(tt["rows"]) if any(text(v) for v in row)), default=1)
        rng = {"sheetId": sid, "startRowIndex": 0, "endRowIndex": used,
               "startColumnIndex": rt["filter"].get("startColumnIndex", 0),
               "endColumnIndex": min(rt["filter"].get("endColumnIndex", ncols), ncols)}
        cur = tt["filter"]
        if not cur or {k: cur.get(k, 0) for k in rng if k != "sheetId"} != {k: v for k, v in rng.items() if k != "sheetId"}:
            notes.append(f"{title}: basic filter {col(rng['startColumnIndex'])}1:{col(rng['endColumnIndex'] - 1)}{used}")
        reqs.append({"setBasicFilter": {"filter": {"range": rng}}})
    return reqs


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--ref", required=True, help="live book to copy the layout from (read only)")
    ap.add_argument("--target", required=True, help="book to change")
    ap.add_argument("--key", type=Path, default=DEFAULT_KEY)
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()
    if a.ref == a.target:
        sys.exit("--ref and --target are the same book")

    import gspread
    gc = gspread.service_account(filename=str(a.key))
    ref_sh, tgt_sh = gc.open_by_key(a.ref), gc.open_by_key(a.target)
    print(f"reference: {ref_sh.title} ({a.ref}), read only")
    print(f"target:    {tgt_sh.title} ({a.target})")
    ref = read_book(ref_sh, MAX_SCAN_ROWS)
    tgt = read_book(tgt_sh, 10_000)
    reqs, notes, new_tabs = plan(ref, tgt)

    if a.apply and new_tabs:
        for rt, header in sorted(new_tabs, key=lambda t: t[0]["index"]):
            ws = tgt_sh.add_worksheet(title=rt["title"], rows=rt["grid"]["rowCount"],
                                      cols=min(rt["grid"]["columnCount"], WIDE_TAB), index=rt["index"])
            ws.update(range_name="A1", values=[header], value_input_option="RAW")
        tgt = read_book(tgt_sh, 10_000)
    tmap = {t["title"]: t for t in tgt["tabs"]}
    for rt in ref["tabs"]:
        tt = tmap.get(rt["title"])
        if tt is None:   # dry run with a missing tab: describe against an empty tab
            continue
        reqs += layout_requests(rt, tt, notes)
    extra = [t["title"] for t in tgt["tabs"] if t["title"] not in {r["title"] for r in ref["tabs"]}]
    if extra:
        notes.append(f"target tabs the reference lacks (left as is): {extra}")
    for n in notes:
        print("  -", n)
    if not a.apply:
        print(f"dry run: {len(reqs)} requests not sent (--apply to write)")
        return
    for i in range(0, len(reqs), 400):
        tgt_sh.batch_update({"requests": reqs[i:i + 400]})
    print(f"applied {len(reqs)} requests")


if __name__ == "__main__":
    main()
