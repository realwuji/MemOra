"""
Step 1 of tagging the Computer Science questions by chapter: read the text off every question
image, so the rules in tag_topics.py have something to search.

The questions are page images (see examconversion.md), so there is no text to search. This reads
each public/past-papers/computer-science/<num>.webp with Apple's Vision text recognition (macOS)
and writes one JSON file: { "<num>": "the text of the image", ... }.

Why Apple Vision: it ships with macOS, so there is nothing to install system-wide. Use the
"fast" mode: on the machine this was written on, "accurate" returned nothing for these images
and "fast" read the printed text well. It does not need to be perfect; the tagging rules look
for keywords, not for whole sentences.

Requirements (a throwaway virtualenv is fine):
    pip install ocrmac pillow

Run from the repo root:
    python3 scripts/pastpapers/ocr_questions.py <out.json>

It is resumable: if <out.json> already exists, rows already in it are skipped.
"""
import json
import pathlib
import sys
import tempfile
from multiprocessing import Pool

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
IMAGES = ROOT / "public" / "past-papers" / "computer-science"


def read_text(num):
    from ocrmac import ocrmac  # imported here so each worker process loads its own copy

    with tempfile.TemporaryDirectory() as tmp:
        png = pathlib.Path(tmp) / "q.png"
        Image.open(IMAGES / f"{num}.webp").convert("RGB").save(png)
        lines = ocrmac.OCR(str(png), recognition_level="fast", language_preference=["en-US"]).recognize()
    return num, " ".join(line[0] for line in lines)


def main():
    out = pathlib.Path(sys.argv[1])
    rows = json.loads(
        __import__("subprocess")
        .run(
            ["node", "-e", "import('./src/data/computer-science-past-papers.js').then(m=>console.log(JSON.stringify(m.default.map(r=>r.num))))"],
            capture_output=True,
            text=True,
            check=True,
            cwd=ROOT,
        )
        .stdout
    )
    done = json.loads(out.read_text()) if out.exists() else {}
    todo = [n for n in rows if n not in done]
    print(f"{len(rows)} questions, {len(done)} already read, {len(todo)} to go", flush=True)
    with Pool(4) as pool:
        for i, (num, text) in enumerate(pool.imap_unordered(read_text, todo, chunksize=4), 1):
            done[num] = text
            if i % 50 == 0:
                out.write_text(json.dumps(done))
                print(f"  {i}/{len(todo)}", flush=True)
    out.write_text(json.dumps(done))
    empty = [n for n, t in done.items() if len(t.strip()) < 15]
    print(f"done: {len(done)} read, {len(empty)} with almost no text: {empty[:20]}")


if __name__ == "__main__":
    main()
