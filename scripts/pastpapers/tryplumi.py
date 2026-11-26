"""
Format module for the question-bank PDFs from tryplumi.app (OCR A-Level Computer Science).

Each page of these PDFs is printed question images, with one text line above each part:

    1050 – June 2017 – Paper 2 – Q2(e) – 6 marks                 question part (also "(answer continued)")
    Mark scheme – 1050 – June 2017 – Paper 2 – Q2(e) – 6 marks    its mark scheme
    For 1052–1056 – June 2017 – Paper 2 – start of question 3     the stem that opens question 3
    150–151 – Examiner's report – June 2024 – Paper 1 – question 5   the examiner's report for question 5
    Mark schemes                                                     a section boundary
    OCR is part of Cambridge …                                       the copyright page, a boundary

The en dash is read as the replacement character (�) by the PDF text layer, so the separators
are matched by "any single non-word character". Summary lines such as "378 marks" do not match.

To adapt another PDF source, write a classify(text) that returns (kind, data) or None, where kind
is "q", "ms", "stem", "er" or "boundary", and data carries an "id" (q, ms) or a "stem_key"
((set, paper, question number) for q, stem and er).
"""

import re

_SEP = r"\s+\S\s+"
_CONT = r"(?P<cont>\s*\((?:answer )?continued\))?"
_PART = (
    r"(?P<id>\d{1,4})" + _SEP + r"(?P<set>[A-Za-z]+ \d{4})" + _SEP + r"(?P<paper>(?:AS )?Paper \d)"
    + _SEP + r"(?P<q>Q\d+[\w()]*)" + _SEP + r"(?P<marks>\d+)\s+marks?" + _CONT + r"\s*$"
)
QUESTION = re.compile(r"^" + _PART)
MARK_SCHEME = re.compile(r"^Mark scheme" + _SEP + _PART)
STEM = re.compile(
    r"^For\s+[\d\s\W]+?" + _SEP + r"(?P<set>[A-Za-z]+ \d{4})" + _SEP + r"(?P<paper>(?:AS )?Paper \d)"
    + _SEP + r"start of question (?P<qn>\d+)" + _CONT + r"\s*$"
)
REPORT = re.compile(
    r"^\d{1,4}(?:\W+\d{1,4})?" + _SEP + r"Examiner.s report" + _SEP + r"(?P<set>[A-Za-z]+ \d{4})" + _SEP
    + r"(?P<paper>(?:AS )?Paper \d)" + _SEP + r"question (?P<qn>\d+)\s*$"
)
BOUNDARY = re.compile(r"^(Mark schemes|.*Examiner.s report.*|OCR is part of Cambridge.*)$")


def classify(text):
    m = QUESTION.match(text)
    if m:
        return "q", {
            "id": m["id"],
            "set": m["set"],
            "paper": m["paper"],
            "q": m["q"][1:],
            "marks": int(m["marks"]),
            "continued": bool(m["cont"]),
            "stem_key": (m["set"], m["paper"], int(re.match(r"\d+", m["q"][1:])[0])),
        }
    m = MARK_SCHEME.match(text)
    if m:
        return "ms", {"id": m["id"], "set": m["set"], "paper": m["paper"], "q": m["q"][1:], "marks": int(m["marks"])}
    m = STEM.match(text)
    if m:
        return "stem", {"stem_key": (m["set"], m["paper"], int(m["qn"]))}
    m = REPORT.match(text)
    if m:
        return "er", {"stem_key": (m["set"], m["paper"], int(m["qn"]))}
    if BOUNDARY.match(text):
        return "boundary", {}
    return None
