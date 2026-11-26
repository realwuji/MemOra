"""Trim the printed answer space out of the maths past paper question images.
Long blank bands inside a question shrink to a short gap and the blank below the last line goes,
so the answer pad is the only working space. Updates the heights in src/data/maths-past-papers.js."""
import json, re, sys
import numpy as np
from PIL import Image
ROOT = 'public/past-papers/maths/'
DATA = 'src/data/maths-past-papers.js'
LONG, KEEP, TAIL = 90, 36, 18
src = open(DATA, encoding='utf8').read()
head = src[: src.index('export default ') + 15]
data = json.loads(src[len(head):])
saved = 0
for row in data['rows']:
    num = row[0]
    im = Image.open(f'{ROOT}{num}.webp').convert('RGB')
    a = np.asarray(im)
    ink = (a.min(axis=2) < 200).any(axis=1)
    h = len(ink)
    keep = np.ones(h, bool)
    i = 0
    while i < h:
        if ink[i]:
            i += 1
            continue
        j = i
        while j < h and not ink[j]:
            j += 1
        run = j - i
        if j == h:  # trailing blank
            if run > TAIL:
                keep[i + TAIL : h] = False
        elif i > 0 and run > LONG:
            keep[i + KEEP : j] = False
        i = j
    if keep.all():
        continue
    out = Image.fromarray(a[keep])
    out.save(f'{ROOT}{num}.webp', 'WEBP', quality=88, method=6)
    saved += h - out.height
    row[5] = out.height
open(DATA, 'w', encoding='utf8').write(head + json.dumps(data, separators=(',', ':')))
print('rows', len(data['rows']), 'pixels removed', saved)
