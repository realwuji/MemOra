"""
Convert a folder of past-paper PDFs into the app's question images and index.

    python scripts/pastpapers/convert.py computer-science "C:/Users/mudas/Downloads"

Steps (see docs in examconversion.md at the repo root):
  1. find every OCR Computer Science PDF in the folder (names contain "OCR-A-Level-Computer-Science")
  2. read each one with the format module (tryplumi.py) and cut its question parts and mark schemes
  3. keep the first copy of each question id (several downloads repeat the same questions)
  4. write public/past-papers/<subject>/ and src/data/<subject>-past-papers.json

Subjects are profiles below: the source name, the format module and where the output goes.
"""

import glob
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import pipeline  # noqa: E402
import tryplumi  # noqa: E402

REPO = os.path.abspath(os.path.join(HERE, "..", ".."))

PROFILES = {
    "computer-science": {
        "glob": "OCR-A-Level-Computer-Science-*.pdf",
        "classify": tryplumi.classify,
        "style": pipeline.STYLE_SPACED,
        "gap": pipeline.STYLE_SPACED["gap"],
        "out_images": os.path.join(REPO, "public", "past-papers", "computer-science"),
        "out_index": os.path.join(REPO, "src", "data", "computer-science-past-papers.js"),
    },
}


def main(subject, folder):
    profile = PROFILES[subject]
    files = sorted(glob.glob(os.path.join(folder, profile["glob"])))
    questions, marks, reports = {}, {}, {}
    for path in files:
        q, m, r = pipeline.convert_file(path, profile["classify"], profile["gap"])
        new = 0
        for qid, entry in q.items():
            if qid not in questions and entry["img"] is not None:
                questions[qid] = entry
                new += 1
        for mid, entry in m.items():
            if mid not in marks and entry["img"] is not None:
                marks[mid] = entry
        for key, entry in r.items():
            if key not in reports and entry["img"] is not None:
                reports[key] = entry
        print(f"{os.path.basename(path)}: {len(q)} parts, {new} new")

    rows = {}
    for qid, entry in questions.items():
        meta = entry["meta"]
        rows[qid] = {
            "num": qid,
            "set": meta["set"],
            "paper": meta["paper"],
            "q": meta["q"],
            "marks": meta["marks"],
            "stem_key": meta["stem_key"],
            "img": entry["img"],
        }
    mark_images = {mid: entry["img"] for mid, entry in marks.items() if mid in rows}
    report_images = {key: entry["img"] for key, entry in reports.items()}
    written = pipeline.write_subject(
        profile["out_images"], profile["out_index"], rows, mark_images, report_images, profile["style"]
    )
    with_report = sum(1 for r in written if r["erFile"])
    print(f"wrote {len(written)} questions, {len(mark_images)} mark schemes, {len(report_images)} examiner's reports ({with_report} parts)")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
