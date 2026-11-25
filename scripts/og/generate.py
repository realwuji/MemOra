"""
Generates one Open Graph / Twitter share image (1200x630 PNG) for every route
in src/lib/seo.js, into public/og/<slug>.png.

Each image is built from that page's own metadata (heading and description,
read live from seo.js, so images cannot drift from the copy) and drawn in the
server design language: a dense dot grid, plus the same background mode the
page itself shows, so a link to the sign-in page looks like the sign-in page
and a link to the privacy policy looks like the footer's log lines:

    packets  data packets streaming along rows
    rack     rack units with status LEDs down the edges
    bus      packets running down vertical lines
    log      terminal log lines in the margins

All text is outlined from the real fonts (Bricolage Grotesque for the heading
and copy, JetBrains Mono for labels), so the PNGs do not depend on any font
being installed.

Requirements:
    - Node (reads the page data from seo.js)
    - python3 with fonttools and brotli:   pip install fonttools brotli
    - rsvg-convert (librsvg):              brew install librsvg
    - npm install has been run (the fonts come from node_modules)

Run from the repo root:   python3 scripts/og/generate.py
Layout is deterministic: the same inputs always produce the same images.
"""
import json
import pathlib
import random
import re
import subprocess
import sys
import tempfile

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
FONT_DIR = ROOT / "node_modules" / "@fontsource-variable"
BRICOLAGE = FONT_DIR / "bricolage-grotesque" / "files" / "bricolage-grotesque-latin-wght-normal.woff2"
MONO = FONT_DIR / "jetbrains-mono" / "files" / "jetbrains-mono-latin-wght-normal.woff2"
OUT_DIR = ROOT / "public" / "og"
WORDMARK = ROOT / "public" / "brand" / "memoraa-wordmark-white.svg"

W, H = 1200, 630
CELL = 14
BG = "#0a0a0a"
FG = "#ffffff"
MUTED = "#a3a3a3"
LINE = "#4a4a4a"
SUBJECTS = ["Maths", "Economics", "Computer Science"]

# The image is drawn as a console window on the server: a bordered panel with a
# title bar (status LEDs, the route as a path, the domain), the same shape as
# the windows in the dashboard. Text lives in fixed zones inside it.
PANEL = (40, 36, 1120, 558)  # x, y, w, h
BAR_H = 46
TEXT_TOP, TEXT_BOTTOM = 178, 488  # the zone the heading and copy must fit in
DOMAIN = "memoraa.web.app"

# Which background mode each route shows (matches the page's own backdrop).
MODE = {
    "/": "packets",
    "/signin": "packets",
    "/404": "packets",
    "/how-it-works": "bus",
    "/community": "bus",
    "/friends": "bus",
    "/dashboard": "rack",
    "/progress": "rack",
    "/profile": "rack",
    "/start": "rack",
    "/study": "rack",
    "/mock": "rack",
    "/flashcards": "rack",
    "/mistakes": "log",
    "/privacy": "log",
    "/terms": "log",
    "/contact": "log",
}
# Pages whose chips are the three subjects; every other page gets a section chip.
SUBJECT_PAGES = {"/", "/how-it-works", "/flashcards", "/progress", "/start", "/study", "/dashboard"}


def slug_of(path):
    return "home" if path == "/" else path.strip("/")


# --------------------------------------------------------------------- fonts
def instance(path, wght):
    return instantiateVariableFont(TTFont(path), {"wght": wght}, inplace=False)


F_HEAD = instance(BRICOLAGE, 800)
F_BODY = instance(BRICOLAGE, 500)
F_MONO = instance(MONO, 600)


def advance(font, ch):
    cmap = font.getBestCmap()
    gn = cmap.get(ord(ch)) or cmap.get(ord("?"))
    return font["hmtx"][gn][0], gn


def measure(font, text, size, track):
    upm = font["head"].unitsPerEm
    s = size / upm
    return sum((advance(font, c)[0] + track * upm) * s for c in text)


def text_path(font, text, size, x, y, track=0.0):
    """Outlined text. Returns the SVG path data; y is the baseline."""
    upm = font["head"].unitsPerEm
    s = size / upm
    gs = font.getGlyphSet()
    cx = x
    parts = []
    for ch in text:
        adv, gn = advance(font, ch)
        if ch != " ":
            pen = SVGPathPen(gs)
            gs[gn].draw(TransformPen(pen, (s, 0, 0, -s, cx, y)))
            parts.append(pen.getCommands())
        cx += (adv + track * upm) * s
    return " ".join(p for p in parts if p)


def wrap(font, text, size, max_w, track):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if measure(font, trial, size, track) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def block_height(t_size, n_title, d_size, n_desc):
    return (n_title - 1) * t_size * 1.04 + t_size * 0.8 + t_size * 0.3 + 22 + d_size * 0.85 + (n_desc - 1) * d_size * 1.42 + d_size * 0.25


def fit_block(title, desc, max_w=1000, zone=TEXT_BOTTOM - TEXT_TOP):
    """Largest heading size whose heading + copy fit the text zone."""
    d_size = 26
    d_lines = fit_desc(desc, d_size, 900, 3)[1]
    for size in (92, 84, 76, 68, 60, 54, 48, 44):
        t_lines = wrap(F_HEAD, title, size, max_w, -0.02)
        if len(t_lines) <= 3 and block_height(size, len(t_lines), d_size, len(d_lines)) <= zone:
            return size, t_lines, d_size, d_lines
    t_lines = wrap(F_HEAD, title, 44, max_w, -0.02)[:3]
    return 44, t_lines, d_size, d_lines


def fit_desc(text, size=27, max_w=930, max_lines=3):
    lines = wrap(F_BODY, text, size, max_w, 0.0)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        while measure(F_BODY, lines[-1] + "…", size, 0.0) > max_w and " " in lines[-1]:
            lines[-1] = lines[-1].rsplit(" ", 1)[0]
        lines[-1] += "…"
    return size, lines


# ------------------------------------------------------------ drawing pieces
def lit(cx, cy, op=1.0, scale=1.0):
    """A lit grid dot: a pinpoint core with a short, faint bloom."""
    return (
        f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{5.2 * scale:.1f}" fill="url(#glow)" opacity="{op:.2f}"/>'
        f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{0.85 * scale:.2f}" fill="{FG}" opacity="{min(1, op + 0.1):.2f}"/>'
    )


def cell_centre(col, row):
    return col * CELL + CELL / 2, row * CELL + CELL / 2


def mode_packets(rng):
    out = []
    cols, rows = W // CELL, H // CELL
    for r in sorted(rng.sample(range(2, rows - 1), 15)):
        length = rng.randint(14, 30)
        head = rng.randint(length, cols - 2)
        direction = rng.choice((-1, 1))
        for j in range(length):
            col = head - direction * j
            if 0 <= col < cols:
                out.append(lit(*cell_centre(col, r), op=(1 - j / length) ** 1.5 * 0.95))
    return "".join(out)


def mode_bus(rng):
    out = []
    cols, rows = W // CELL, H // CELL
    for c in sorted(rng.sample(range(2, cols - 2), 17)):
        length = rng.randint(10, 24)
        head = rng.randint(length, rows - 2)
        direction = rng.choice((-1, 1))
        for j in range(length):
            row = head - direction * j
            if 0 <= row < rows:
                out.append(lit(*cell_centre(c, row), op=(1 - j / length) ** 1.5 * 0.95))
    return "".join(out)


def mode_rack(rng):
    """Two strips that are deliberately not mirror images (see atmosphere.css)."""
    out = []

    def strip(x0, width, unit, ear, leds, flip):
        g = []
        y = 0
        while y < H:
            g.append(f'<line x1="{x0}" x2="{x0 + width}" y1="{y + 0.5}" y2="{y + 0.5}" stroke="{FG}" stroke-opacity=".28"/>')
            for sy in (12, unit - 12):
                g.append(f'<circle cx="{ear}" cy="{y + sy}" r="2.2" fill="{FG}" fill-opacity=".26"/>')
            for lx in leds:
                if rng.random() < 0.42:
                    g.append(lit(lx, y + unit / 2, op=rng.choice((0.7, 0.9, 1.0)), scale=1.9))
            y += unit
        rail = (x0 + 28) if not flip else (x0 + width - 24)
        g.append(f'<line x1="{rail}" x2="{rail}" y1="0" y2="{H}" stroke="{FG}" stroke-opacity=".2"/>')
        return "".join(g)

    # The text is left-aligned, so all the hardware sits on the right: a wider
    # 56px-unit strip with a narrower 42px-unit strip against the edge. They are
    # different on purpose (as on the site) and fade out toward the text.
    px1 = PANEL[0] + PANEL[2]
    out.append(f'<g mask="url(#fadeR2)">{strip(px1 - 420, 270, 56, px1 - 408, [px1 - 370, px1 - 354, px1 - 338], False)}</g>')
    out.append(f'<g mask="url(#fadeR)">{strip(px1 - 150, 150, 42, px1 - 10, [px1 - 34, px1 - 50, px1 - 78, px1 - 94], True)}</g>')
    return "".join(out)


def mode_log(rng):
    """Log lines scrolling in the right margin only (the left holds the text)."""
    g = []
    for r in range(H // CELL):
        if rng.random() < 0.16:
            continue
        x = 8
        for _ in range(rng.randint(1, 3)):
            w = rng.choice((22, 34, 48, 66, 90, 120, 150))
            g.append(f'<rect x="{x}" y="{r * CELL + 5}" width="{w}" height="4" fill="{FG}" fill-opacity=".36"/>')
            x += w + rng.choice((10, 16, 24))
    return f'<g mask="url(#fadeLogR)" transform="translate({PANEL[0] + PANEL[2] - 400},0)">{"".join(g)}</g>'


MODES = {"packets": mode_packets, "bus": mode_bus, "rack": mode_rack, "log": mode_log}


def wordmark_inner():
    src = WORDMARK.read_text()
    vb = re.search(r'viewBox="([^"]+)"', src).group(1)
    body = src.split(">", 1)[1].rsplit("</svg>", 1)[0]
    body = re.sub(r"<title>.*?</title>", "", body, flags=re.S)
    return vb, body


def chip(x, y, label, font=F_MONO, size=20):
    w = measure(font, label, size, 0.0) + 44
    return (
        f'<rect x="{x}" y="{y}" width="{w:.1f}" height="46" rx="8" fill="none" stroke="{LINE}" stroke-width="1.5"/>'
        f'<path fill="{FG}" d="{text_path(font, label, size, x + 22, y + 30)}"/>',
        w,
    )


# ---------------------------------------------------------------- one image
def build_svg(path, meta):
    slug = slug_of(path)
    rng = random.Random(f"memoraa-og-{slug}")
    mode = MODE.get(path, "packets")
    px, py, pw, ph = PANEL

    title_text = meta.get("h1") or meta.get("title")
    t_size, t_lines, d_size, d_lines = fit_block(title_text, meta["description"])
    t_lh, d_lh = t_size * 1.04, d_size * 1.42
    block_h = block_height(t_size, len(t_lines), d_size, len(d_lines))
    top = TEXT_TOP + ((TEXT_BOTTOM - TEXT_TOP) - block_h) / 2

    parts = []
    # --- the window: outer page, panel, dot grid, mode graphics ------------
    parts.append(f'<rect width="{W}" height="{H}" fill="#050505"/>')
    parts.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="12" fill="{BG}" stroke="#3a3a3a" stroke-width="1.5"/>')
    parts.append(f'<g clip-path="url(#panel)"><rect x="{px}" y="{py}" width="{pw}" height="{ph}" fill="url(#grid)"/>')
    parts.append(MODES[mode](rng))
    # Calm zone: dims the grid and effects behind the text so it stays legible.
    parts.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" fill="url(#calm)"/>')
    # --- console title bar -------------------------------------------------
    parts.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{BAR_H}" fill="#ffffff" fill-opacity=".045"/>')
    parts.append(f'<line x1="{px}" x2="{px + pw}" y1="{py + BAR_H}" y2="{py + BAR_H}" stroke="#ffffff" stroke-opacity=".16"/>')
    for i in range(3):
        parts.append(lit(px + 30 + i * 22, py + BAR_H / 2, op=(1.0, 0.85, 0.6)[i], scale=2.3))
    path_label = f"~/memoraa/{slug}"
    parts.append(f'<path fill="{MUTED}" d="{text_path(F_MONO, path_label, 19, px + 100, py + BAR_H / 2 + 6.5)}"/>')
    dw = measure(F_MONO, DOMAIN, 19, 0.0)
    parts.append(f'<path fill="{MUTED}" d="{text_path(F_MONO, DOMAIN, 19, px + pw - 28 - dw, py + BAR_H / 2 + 6.5)}"/>')
    parts.append("</g>")

    # --- wordmark ------------------------------------------------------------
    vb, body = wordmark_inner()
    vbw, vbh = float(vb.split()[2]), float(vb.split()[3])
    ww = 300
    parts.append(f'<svg x="{px + 44}" y="{py + BAR_H + 30}" width="{ww}" height="{ww * vbh / vbw:.1f}" viewBox="{vb}">{body}</svg>')

    # --- heading + copy ------------------------------------------------------
    x0 = px + 44
    base = top + t_size * 0.8
    for line in t_lines:
        parts.append(f'<path fill="{FG}" d="{text_path(F_HEAD, line, t_size, x0, base, -0.02)}"/>')
        base += t_lh
    base = base - t_lh + t_size * 0.3 + 22 + d_size * 0.85
    for line in d_lines:
        parts.append(f'<path fill="{MUTED}" d="{text_path(F_BODY, line, d_size, x0, base)}"/>')
        base += d_lh

    # --- chips ---------------------------------------------------------------
    cx, cy = x0, py + ph - 46 - 30
    if path in SUBJECT_PAGES:
        labels = SUBJECTS
    else:
        crumb = (meta.get("crumbs") or [{}])[-1].get("label") or slug.replace("-", " ")
        labels = [crumb.upper() if len(crumb) < 18 else crumb]
    for lab in labels:
        svg, w = chip(cx, cy, lab, F_MONO, 20)
        parts.append(svg)
        cx += w + 14

    ccx, ccy = px + 340, py + 290
    defs = f"""<defs>
  <clipPath id="panel"><rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="12"/></clipPath>
  <pattern id="grid" width="{CELL}" height="{CELL}" patternUnits="userSpaceOnUse" x="{px}" y="{py}">
    <circle cx="{CELL / 2}" cy="{CELL / 2}" r="0.9" fill="{FG}" fill-opacity=".2"/>
  </pattern>
  <radialGradient id="glow">
    <stop offset="0" stop-color="{FG}" stop-opacity=".5"/>
    <stop offset=".22" stop-color="{FG}" stop-opacity=".26"/>
    <stop offset=".5" stop-color="{FG}" stop-opacity=".1"/>
    <stop offset=".78" stop-color="{FG}" stop-opacity=".03"/>
    <stop offset="1" stop-color="{FG}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="calm" gradientUnits="userSpaceOnUse" cx="{ccx}" cy="{ccy}" r="520" gradientTransform="translate({ccx} {ccy}) scale(1 .62) translate({-ccx} {-ccy})">
    <stop offset="0" stop-color="{BG}" stop-opacity=".92"/>
    <stop offset=".55" stop-color="{BG}" stop-opacity=".66"/>
    <stop offset="1" stop-color="{BG}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="fadeLg" x1="0" x2="1"><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
  <linearGradient id="fadeRg" x1="1" x2="0"><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
  <linearGradient id="logLg" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
  <linearGradient id="logRg" x1="1" x2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
  <mask id="fadeL" maskUnits="userSpaceOnUse" x="{px}" y="0" width="190" height="{H}"><rect x="{px}" width="190" height="{H}" fill="url(#fadeLg)"/></mask>
  <mask id="fadeR" maskUnits="userSpaceOnUse" x="{px + pw - 150}" y="0" width="150" height="{H}"><rect x="{px + pw - 150}" width="150" height="{H}" fill="url(#fadeRg)"/></mask>
  <mask id="fadeR2" maskUnits="userSpaceOnUse" x="{px + pw - 420}" y="0" width="270" height="{H}"><rect x="{px + pw - 420}" width="270" height="{H}" fill="url(#fadeRg)"/></mask>
  <mask id="fadeLogR" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="{H}"><rect width="400" height="{H}" fill="url(#logRg)"/></mask>
</defs>"""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">{defs}{"".join(parts)}</svg>'


def main():
    pages = json.loads(
        subprocess.run(
            ["node", str(ROOT / "scripts" / "og" / "dump-pages.mjs")],
            check=True,
            capture_output=True,
            text=True,
            cwd=ROOT,
        ).stdout
    )
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for path, meta in pages.items():
            svg = pathlib.Path(tmp) / "og.svg"
            svg.write_text(build_svg(path, meta))
            out = OUT_DIR / f"{slug_of(path)}.png"
            subprocess.run(["rsvg-convert", "-w", str(W), "-h", str(H), str(svg), "-o", str(out)], check=True)
            print(f"wrote public/og/{out.name}  ({MODE.get(path, 'packets')})")


if __name__ == "__main__":
    sys.exit(main())
