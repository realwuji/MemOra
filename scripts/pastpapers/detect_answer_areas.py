"""
Finds where a student writes on a question image, so the app can let them TYPE there (in the
handwriting font) as well as write on the pad below.

A question image is a printed page. Its answer areas are:
  1. empty cells of a table (a truth table, a trace table, a database table to complete) and
     empty boxes drawn with ruled lines;
  2. answer lines: a row of dots ".........." or a solid rule that the answer is written on.

How it works (OpenCV, no machine learning):
  - threshold the page to ink / paper;
  - find the long horizontal and vertical ruled lines by morphological opening with a long
    thin kernel, which keeps lines and removes text;
  - the regions the ruled lines enclose are the cells; a cell is an answer area when it is empty
    (almost no ink inside it) and a sensible size (not a sliver, not the whole table);
  - dotted or solid answer lines: close the dots into a line, keep long thin horizontal ones that are
    not part of the table grid, and make the area just above each (the answer sits on the line).

Output: src/data/<subject>-answer-areas.js, { "<num>": [[x, y, w, h, kind], ...] } where the numbers
are per mille of the image's own width (x, w) and height (y, h), so they are independent of the size
the image is shown at, and kind is 0 for a cell or box and 1 for a line. Questions with no area are
left out.

This is detection, not understanding. It finds ruled boxes and lines, so it will miss an answer area
that is only white space, and may offer an empty cell the question did not mean as an answer. That is
harmless: a typing field in the wrong place is simply not used. It never changes the image. The
overlay is optional (the pad is still there) and typed text is only kept for the browser session.

Requirements (a throwaway virtualenv): pip install opencv-python-headless numpy pillow
Run from the repo root:
    python3 scripts/pastpapers/detect_answer_areas.py computer-science [--only 25] [--debug out_dir]
"""
import argparse
import json
import pathlib
import subprocess
import sys

import cv2
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[2]


def ink_mask(gray):
    # dark pixels on a mostly white page
    _, ink = cv2.threshold(gray, 170, 255, cv2.THRESH_BINARY_INV)
    return ink


def ruled_lines(ink, min_len):
    """Long horizontal and vertical lines, as one mask plus the two separately."""
    h_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (min_len, 1))
    v_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, min_len))
    hor = cv2.morphologyEx(ink, cv2.MORPH_OPEN, h_kernel)
    ver = cv2.morphologyEx(ink, cv2.MORPH_OPEN, v_kernel)
    # thicken a little so a line broken by anti-aliasing closes the cells it bounds
    grow = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    return cv2.dilate(cv2.bitwise_or(hor, ver), grow), hor, ver


def cells(grid, ink, W, H):
    """Empty rectangular cells bounded by ruled lines."""
    inv = cv2.bitwise_not(grid)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(inv, connectivity=4)
    found = []
    for i in range(1, n):
        x, y, w, h, area = stats[i]
        if w < 34 or h < 22:
            continue  # a sliver or a speck
        if x <= 1 or y <= 1 or x + w >= W - 1 or y + h >= H - 1:
            continue  # touches the page edge: that is the paper, not a cell
        if w > W * 0.92 and h > H * 0.6:
            continue  # the whole page
        if area < w * h * 0.8:
            continue  # not rectangular (an L shaped gap, or a letter counter)
        inside = ink[y + 3 : y + h - 3, x + 3 : x + w - 3]
        if inside.size == 0:
            continue
        if np.count_nonzero(inside) > 25:
            continue  # has a printed value or header in it (even one digit): not an answer
        found.append((x, y, w, h, 0))
    return found


def answer_lines(ink, text, W, H):
    """Dotted rows and long ruled lines that the answer is written on. `ink` here is the sensitive mask,
    so the pale grey ruled lines of an answer space are found as well as black ones. `text` is the
    strict ink mask, used to reject rows of text that merely look like a line."""
    # Take the printed text OUT first: only thin marks (a dot, a rule) are kept, so a label such as
    # "Data bus ........." leaves only its dots. The line then starts where the dots start (the answer goes
    # after the label, not over it) and its position is the dots', not the label letters'.
    n0, lab0, st0, _ = cv2.connectedComponentsWithStats(ink, connectivity=8)
    keep = np.zeros(n0, dtype=np.uint8)
    keep[1:] = (st0[1:, cv2.CC_STAT_HEIGHT] <= 5).astype(np.uint8)
    ink = (keep[lab0] * 255).astype(np.uint8)
    # join a row of dots into one line, then keep only long thin ones
    closed = cv2.morphologyEx(ink, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_RECT, (19, 1)))
    long_thin = cv2.morphologyEx(closed, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (int(W * 0.28), 1)))
    n, _, stats, _ = cv2.connectedComponentsWithStats(long_thin, connectivity=8)
    out = []
    for i in range(1, n):
        x, y, w, h, _ = stats[i]
        if h > 6:
            continue
        # tell a dotted row (mostly gaps) from a solid rule (dense)
        density = (ink[y : y + h, x : x + w] > 0).mean()
        solid = density > 0.8
        # a short solid line is a wire, an arrow or an underline; only a long one is an answer line
        if solid and w < W * 0.55:
            continue
        # An answer line has blank paper directly above it (that is where the answer goes) and below it.
        # A row of printed text, such as a monospace code listing, has ink on both sides.
        # (The left quarter is ignored too, because a printed label such as "Final path:" sits on the line, and
        # the right 8%, because the mark label such as [4] does. A text row has ink across the whole width.)
        x0, x1 = x + int(w * 0.25), x + int(w * 0.92)
        above = text[max(0, y - 16) : max(0, y - 3), x0:x1]
        below = text[y + h + 3 : y + h + 9, x0:x1]
        if (above.size and np.count_nonzero(above) > above.size * 0.004) or (below.size and np.count_nonzero(below) > below.size * 0.004):
            continue
        out.append((x, max(0, y - 36), w, 34, 1))
    # the same line can be found twice a pixel apart
    out.sort(key=lambda a: a[1])
    deduped = []
    for a in out:
        if deduped and abs(a[1] - deduped[-1][1]) < 8:
            continue
        deduped.append(a)
    return deduped


def overlaps(a, b):
    ax, ay, aw, ah = a[:4]
    bx, by, bw, bh = b[:4]
    return not (ax + aw <= bx or bx + bw <= ax or ay + ah <= by or by + bh <= ay)


def detect(path):
    img = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
    if img is None:
        return None
    H, W = img.shape
    ink = ink_mask(img)
    pale = (img < 238).astype(np.uint8) * 255  # pale grey rules are lighter than text
    # The grid is found on the sensitive mask, so a table with pale grey cell edges is still one table of
    # cells; `ink` (strict) is used to tell whether a cell has anything printed in it.
    grid, hor, ver = ruled_lines(pale, min_len=max(28, W // 30))
    cs = cells(grid, ink, W, H)
    ls = [l for l in answer_lines(pale, ink, W, H) if not any(overlaps(l, c) for c in cs)]
    areas = cs + ls
    per_mille = lambda a: [round(a[0] / W * 1000), round(a[1] / H * 1000), round(a[2] / W * 1000), round(a[3] / H * 1000), a[4]]
    return W, H, areas, [per_mille(a) for a in areas]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("subject", choices=["computer-science"])
    ap.add_argument("--only")
    ap.add_argument("--debug")
    args = ap.parse_args()

    rows = json.loads(
        subprocess.run(
            ["node", "-e", f"import('./src/data/{args.subject}-past-papers.js').then(m=>console.log(JSON.stringify(m.default.map(r=>r.num))))"],
            capture_output=True, text=True, check=True, cwd=ROOT,
        ).stdout
    )
    folder = ROOT / "public" / "past-papers" / args.subject
    dbg = pathlib.Path(args.debug) if args.debug else None
    if dbg:
        dbg.mkdir(parents=True, exist_ok=True)

    result, with_areas, total = {}, 0, 0
    for num in rows:
        if args.only and num != args.only:
            continue
        got = detect(folder / f"{num}.webp")
        if got is None:
            print(f"cannot read {num}.webp", file=sys.stderr)
            continue
        W, H, raw, norm = got
        total += 1
        if norm:
            result[num] = norm
            with_areas += 1
        if dbg and norm:
            im = cv2.imread(str(folder / f"{num}.webp"))
            for x, y, w, h, k in raw:
                cv2.rectangle(im, (x, y), (x + w, y + h), (0, 0, 200) if k == 0 else (200, 120, 0), 2)
            cv2.imwrite(str(dbg / f"{num}.png"), im)

    print(f"{total} images, {with_areas} with at least one answer area, {sum(len(v) for v in result.values())} areas")
    if not args.only:
        out = ROOT / "src" / "data" / f"{args.subject}-answer-areas.js"
        header = (
            "/*\n  Answer areas found in each question image (empty table cells and boxes, and answer lines), as\n"
            "  per mille of the image's width and height: { num: [[x, y, w, h, kind], ...] }, kind 0 = cell or box,\n"
            "  1 = line. Made by scripts/pastpapers/detect_answer_areas.py; see examconversion.md. The app lets a\n"
            "  student type in these places (components/ui/PastPaperQuestion.jsx).\n*/\n"
        )
        out.write_text(header + "export default " + json.dumps(result, separators=(",", ":")) + "\n")
        print(f"wrote {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
