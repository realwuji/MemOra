"""
Generic past-paper pipeline: PDF pages -> question images -> index.

It knows nothing about any one exam board. A format module (see tryplumi.py) says which
text lines are question headers, mark-scheme headers, stem headers, examiner's report headers
or section boundaries. This module turns those markers into regions on the page, renders each
region to an image WIDTH px wide, trims and spaces it according to the subject's style, and
writes the images and the index.

Output for a subject called <subject>:
  public/past-papers/<subject>/<num>.webp        the printed question (all its parts stitched)
  public/past-papers/<subject>/ms/<num>.webp     the mark scheme, when the PDFs carry one
  public/past-papers/<subject>/er/<file>.webp    the examiner's report for the whole question
  src/data/<subject>-past-papers.json            one object per question part

The layout matches public/past-papers/maths, so PastPaperQuestion renders both the same way.
"""

import json
import os

import numpy as np
import pymupdf
from PIL import Image

WIDTH = 1000  # px, the width every maths question image was made at
MARGIN_PT = 36  # left and right margin cut from the page, in points
PAD_PT = 6  # space kept above a region's first line, below its header

# How an image is finished. The maths pack was trimmed hard, because its answer space was the
# complaint there. Computer Science keeps the spacing the printed page has.
STYLE_TIGHT = {"long": 90, "keep": 36, "tail": 18, "pad_x": 0, "pad_y": 0, "gap": 0}
STYLE_SPACED = {"long": 260, "keep": 150, "tail": 40, "pad_x": 30, "pad_y": 26, "gap": 22}
WEBP_QUALITY = 88


def trim_blank(img, style):
    """Shrink blank bands longer than style['long'] to style['keep'] px; cut blank below the last line."""
    a = np.asarray(img.convert("RGB"))
    ink = (a.min(axis=2) < 200).any(axis=1)
    h = len(ink)
    mask = np.ones(h, bool)
    i = 0
    while i < h:
        if ink[i]:
            i += 1
            continue
        j = i
        while j < h and not ink[j]:
            j += 1
        run = j - i
        if j == h:
            if run > style["tail"]:
                mask[i + style["tail"] : h] = False
        elif i > 0 and run > style["long"]:
            mask[i + style["keep"] : j] = False
        i = j
    if mask.all():
        return img
    return Image.fromarray(a[mask])


def pad(img, style):
    """A white border around the image, so text does not sit on the edge of its card."""
    px, py = style["pad_x"], style["pad_y"]
    if not px and not py:
        return img
    out = Image.new("RGB", (img.width + 2 * px, img.height + 2 * py), (255, 255, 255))
    out.paste(img, (px, py))
    return out


def finish(img, style):
    return pad(trim_blank(img, style), style)


def read_pages(path, classify):
    """Every page of one PDF as {'h', 'footer', 'markers'}; markers are (y0, y1, kind, data)."""
    doc = pymupdf.open(path)
    pages = []
    for page in doc:
        footer = page.rect.height - 40
        lines = []
        for block in page.get_text("dict")["blocks"]:
            if block.get("type") != 0:
                continue
            for line in block["lines"]:
                text = "".join(span["text"] for span in line["spans"]).strip()
                if text:
                    lines.append((line["bbox"][1], line["bbox"][3], text))
        lines.sort()
        markers = []
        for y0, y1, text in lines:
            # The printed footer carries the site address; the cover's title line has no address.
            if "tryplumi.app" in text:
                footer = min(footer, y0)
                continue
            found = classify(text)
            if found:
                kind, data = found
                markers.append((y0, y1, kind, data))
        pages.append({"h": page.rect.height, "footer": footer, "markers": markers})
    return doc, pages


def regions_for(pages):
    """Pieces of the page each marker governs: [(kind, data, [(page index, y_top, y_bottom), ...])].

    A region runs from below its own header to the next marker (of any kind), so a question
    cut across a page break is followed onto the next page, and a boundary marker (examiner's
    report section, "Mark schemes", the copyright page) ends a region without starting one.
    """
    seq = []
    for pi, page in enumerate(pages):
        for y0, y1, kind, data in page["markers"]:
            seq.append((pi, y0, y1, kind, data))
    out = []
    for i, (pi, y0, y1, kind, data) in enumerate(seq):
        if kind not in ("q", "ms", "stem", "er"):
            continue
        sp, sy = pi, y1 + PAD_PT
        if i + 1 < len(seq):
            ep, ey = seq[i + 1][0], seq[i + 1][1] - PAD_PT
        else:
            ep, ey = len(pages) - 1, pages[-1]["footer"] - PAD_PT
        pieces = []
        if sp == ep:
            if ey - sy > 4:
                pieces.append((sp, sy, ey))
        else:
            if pages[sp]["footer"] - sy > 4:
                pieces.append((sp, sy, pages[sp]["footer"]))
            for q in range(sp + 1, ep):
                pieces.append((q, PAD_PT, pages[q]["footer"]))
            if ey - PAD_PT > 4:
                pieces.append((ep, PAD_PT, ey))
        out.append((kind, data, pieces))
    return out


def render(doc, pieces, page_w, gap=0):
    """Stitch the pieces into one image, WIDTH px wide, with `gap` px of white between them."""
    if not pieces:
        return None
    scale = WIDTH / (page_w - 2 * MARGIN_PT)
    parts = []
    for pi, top, bottom in pieces:
        clip = pymupdf.Rect(MARGIN_PT, top, page_w - MARGIN_PT, bottom)
        pix = doc[pi].get_pixmap(matrix=pymupdf.Matrix(scale, scale), clip=clip, alpha=False)
        parts.append(Image.frombytes("RGB", (pix.width, pix.height), pix.samples))
    height = sum(p.height for p in parts) + gap * (len(parts) - 1)
    out = Image.new("RGB", (WIDTH, height), (255, 255, 255))
    y = 0
    for p in parts:
        out.paste(p, (0, y))
        y += p.height + gap
    return out


def convert_file(path, classify, gap=0):
    """Turn one PDF into three dicts: questions, mark schemes and examiner's reports.

    questions: {id: {'meta', 'img'}}  every part, with the stem that opens its question placed above it
    marks:     {id: {'meta', 'img'}}  the mark scheme of each part
    reports:   {(set, paper, qn): {'meta', 'img'}}  the examiner's report for a whole question
    """
    doc, pages = read_pages(path, classify)
    page_w = doc[0].rect.width
    regs = regions_for(pages)
    stems, questions, marks, reports = {}, {}, {}, {}
    for kind, data, pieces in regs:
        if kind == "stem":
            stems.setdefault(data["stem_key"], []).extend(pieces)
    for kind, data, pieces in regs:
        if kind == "q":
            entry = questions.setdefault(data["id"], {"meta": data, "pieces": [], "stem": None})
            # "(answer continued)" headers reuse the id, so their pieces follow the first part's.
            if entry["stem"] is None and data.get("stem_key") in stems:
                entry["stem"] = data["stem_key"]
            entry["pieces"].extend(pieces)
        elif kind == "ms":
            entry = marks.setdefault(data["id"], {"meta": data, "pieces": []})
            entry["pieces"].extend(pieces)
        elif kind == "er":
            reports.setdefault(data["stem_key"], {"meta": data, "pieces": []})["pieces"].extend(pieces)
    result_q = {}
    for qid, entry in questions.items():
        pieces = list(stems.get(entry["stem"], [])) if entry["stem"] else []
        pieces += entry["pieces"]
        result_q[qid] = {"meta": entry["meta"], "img": render(doc, pieces, page_w, gap)}
    result_m = {mid: {"meta": e["meta"], "img": render(doc, e["pieces"], page_w, gap)} for mid, e in marks.items()}
    result_r = {k: {"meta": e["meta"], "img": render(doc, e["pieces"], page_w, gap)} for k, e in reports.items()}
    doc.close()
    return result_q, result_m, result_r


def report_name(key):
    """(set, paper, question) -> a file name, e.g. ('June 2024', 'AS Paper 1', 5) -> june-2024-as-paper-1-q5."""
    s, p, q = key
    slug = lambda t: t.lower().replace(" ", "-")  # noqa: E731
    return f"{slug(s)}-{slug(p)}-q{q}"


def write_subject(subject_dir, index_path, rows_by_num, marks_by_num, reports_by_key, style):
    """Write the images and the index.

    rows_by_num:    {num: row}, where row has an 'img' and a 'stem_key' (set, paper, question)
    marks_by_num:   {num: PIL image} mark schemes
    reports_by_key: {(set, paper, question): PIL image} examiner's reports
    """
    os.makedirs(os.path.join(subject_dir, "ms"), exist_ok=True)
    os.makedirs(os.path.join(subject_dir, "er"), exist_ok=True)
    written_reports = {}
    rows = []
    for num in sorted(rows_by_num, key=lambda n: (len(n), n)):
        row = rows_by_num[num]
        key = row.pop("stem_key")
        img = finish(row.pop("img"), style)
        row["h"] = img.height
        img.save(os.path.join(subject_dir, f"{num}.webp"), "WEBP", quality=WEBP_QUALITY, method=6)
        row["msH"] = 0
        ms = marks_by_num.get(num)
        if ms is not None:
            ms = finish(ms, style)
            ms.save(os.path.join(subject_dir, "ms", f"{num}.webp"), "WEBP", quality=WEBP_QUALITY, method=6)
            row["msH"] = ms.height
        row["erH"] = 0
        row["erFile"] = None
        report = reports_by_key.get(key)
        if report is not None:
            if key not in written_reports:
                rep = finish(report, style)
                name = report_name(key)
                rep.save(os.path.join(subject_dir, "er", f"{name}.webp"), "WEBP", quality=WEBP_QUALITY, method=6)
                written_reports[key] = (name, rep.height)
            row["erFile"], row["erH"] = written_reports[key]
        rows.append(row)
    # A JS module, not JSON: the build reads the packs with Node, which needs an import attribute for JSON.
    body = json.dumps(rows, ensure_ascii=False, separators=(",", ":"))
    with open(index_path, "w", encoding="utf8") as f:
        f.write("/*
  The index of this subject's question-bank pack, made by scripts/pastpapers/convert.py.
*/
export default " + body + "
")
    return rows
