# DESIGN.md - the Memoora design system

Read this before you touch any UI. It describes how Memoora looks and moves, why
it is built that way, and what to do and not do when you add to it.

- `AGENTS.md` is the contributor guide (structure, commands, golden rules).
  This file is the design companion to it. If the two ever disagree about a rule,
  `AGENTS.md` wins and this file should be fixed.
- `README.md` is the product tour.

Everything here describes code that exists in this repo. File names are given so
you can check any claim yourself.

---

## 1. The idea

Memoora looks like a server that is working for you. Black and white, hairline
panels, small status lights, data moving quietly along a dot grid, console
type for labels. The metaphor is used as a **design language**, not as a gimmick:

| Server thing            | Where it shows up                                                      |
| ----------------------- | ---------------------------------------------------------------------- |
| Rack unit / window      | Every card and panel: tight corners, hairline border, console title bar |
| Status LED              | Tags, subject cards, the theme toggle, the hero title bar               |
| Data packet             | Bright streaks travelling along rows and columns of the background grid |
| Load meter              | Progress bars and the chapter map: a row of cells, not a smooth fill    |
| Terminal prompt         | The wordmark `> memoora`, the dashboard greeting, `//` comment labels   |
| Log lines               | The background in the footer and legal pages                            |
| Addressing a memory cell | The cursor: the row and column under the pointer light up              |

If an addition does not fit this metaphor, ask whether it needs to exist.

### The seven principles

1. **Monochrome first.** The brand is white on black (dark theme) and black on
   cream (cream theme). Colour is rare and always **means something** (see
   section 4).
2. **Hairlines, not shadows.** Depth comes from 1px borders and a faint top edge
   highlight. No soft drop shadows, no glossy gradients.
3. **Tight corners.** Panels use one radius, `--srv-r` (0.6rem). Pills are for
   buttons and avatars only.
4. **Console labels.** Small uppercase text is monospace. Body copy and headings
   stay in the reading fonts.
5. **Light is a pinpoint with a faint bloom.** A lit dot or LED is a tiny bright
   core with a short, soft falloff. Never a solid white disc, never a big glow.
6. **Motion is mechanical but smooth.** Things blink, sweep and run along grid
   lines. Nothing bounces, wobbles or lags on purpose.
7. **Every effect is optional.** Everything decorative switches off for reduced
   motion and high contrast, and never carries information on its own.

---

## 2. Where things live

| File | What it owns |
| ---- | ------------ |
| `src/index.css` | Theme tokens (`:root`, `[data-theme=...]`, accents), base styles, the older component styles |
| `src/server.css` | **The server design language.** Panels, LEDs, tags, segmented bars, subject cards, hero, diagrams, giant footer mark, theme-switch mask. Imported in `src/main.jsx` after `index.css` |
| `src/components/ui/atmosphere.css` + `AtmosphereBackground.jsx` | The dot-grid backdrop, its four modes, the cursor, the audio-reactive rules |
| `src/components/ui/sigil.css` + `SigilWordmark.jsx` | The wordmark look and its type effects |
| `src/components/ui/notes.css` | Study-note content: callouts, tables, diagram frames inside notes |
| `src/components/diagrams/primitives.jsx` | `Figure` (the diagram frame and title bar) and the shared diagram parts |
| `src/lib/themeTransition.js` | The theme-switch reveal |
| `src/lib/audioReactive.js` | Optional audio analysis that drives the background |
| `scripts/og/` | Generator for the per-page share images |
| `public/brand/` | Logo files (outlined SVG, no font needed) |
| `public/og/` | Generated share images, one per route |

### Two cascade facts you must know

1. **`src/server.css` is deliberately not inside a cascade layer.** Unlayered
   rules beat Tailwind's layered utilities, so `.card`'s radius wins over
   `rounded-3xl` without `!important`. That is the point: the shape of a panel is
   decided in one place. Utilities that use the important flag (the footer's
   `!rounded-none`) still win, as intended.
2. **`notes.css` loads later than `server.css`** (it ships with the notes
   chunk). If a note style is not taking effect from `server.css`, put it in
   `notes.css` instead of fighting specificity. The callouts already live there.

---

## 3. Brand

### Name

The product is **Memoora** (two o's). Use it in all display text, metadata and
docs.

**Do not rename these**, even though they still say "memora". Changing them
would wipe saved user data or break deploys:

- `localStorage` and IndexedDB keys (`memora:v1`, `memora:music`, ...)
- the Firebase project and the live domain (`memoraa.web.app`)
- the GitHub repo and npm package name
- the OAuth `state` value `memora-music`

### The wordmark

`> memoora` followed by a blinking block cursor, set in JetBrains Mono
ExtraBold. The `>` prompt is a quieter tone of the same colour.

Use the component, never hand-typed text:

```jsx
<SigilWordmark />                        // static, cursor blinks (footers, sign-in)
<SigilWordmark animate />                // header size, with the type effects
<SigilWordmark size="hero" animate />    // landing hero
<SigilWordmark size="giant" animate />   // full-width footer mark
```

The animated version has four effects (all in `SigilWordmark.jsx`):

- **boot:** the prompt appears, then each letter types in, decoding through random
  glyphs as it lands
- **hover:** the letter under the pointer scrambles and glitch-slices, then
  settles
- **idle:** every few seconds a random letter glitches on its own
- **cursor:** goes solid while the wordmark is hovered

Rules:

- It renders as one image labelled "Memoora" (`role="img"` + `aria-label`), so
  scrambled glyphs are never read aloud or copied. Keep that.
- Letters sit in fixed-width cells so scrambling never shifts the layout.
- **No hover glow.** A text-shadow on the giant footer mark was clipped into a
  visible rectangle by the footer's `overflow`. Hover is scramble and glitch only.
- Do not recolour it. It takes `text-brand`, which is already white on dark and
  black on cream.

### Logo files (`public/brand/`)

| File | Use |
| ---- | --- |
| `memoora-wordmark-white.svg` | On dark backgrounds |
| `memoora-wordmark-black.svg` | On light backgrounds |
| `memoora-wordmark-white-on-black.svg`, `...-black-on-white.svg` | When a solid background is needed (previews, embeds) |
| `memoora-monogram-white.svg`, `...-black.svg` | Small spaces: the `>` prompt plus cursor |

All are outlined paths, so they render the same everywhere with no font
installed. Do not stretch, outline, add effects, recolour, or put them on busy
imagery. The favicon, touch icon and `og-memora.png` use the same mark.

### The retired sigil

The old angular icon (`SigilMark.jsx`) is **retired from the product UI**. The
component and the dev brand sheet still exist for reference. Do not add the sigil
back to headers, heroes or the favicon.

### Voice

- No em dashes anywhere in copy or docs (house rule, see `AGENTS.md`). Use a
  hyphen or rewrite the sentence.
- Copy lives in `src/constants/content.js`, not in JSX.

---

## 4. Colour

Never hard-code colours. Use the semantic tokens (`bg-page`, `bg-surface`,
`text-fg`, `text-muted`, `border-line`, `bg-brand`, and so on) so every theme
recolours correctly. The tokens are defined in `src/index.css`.

### Themes

| Token | Dark ("black") | Cream |
| ----- | -------------- | ----- |
| `--page` | `#0a0a0a` | `#faf3e2` |
| `--surface` | `#121212` | `#fffaef` |
| `--fg` | `#f5f5f5` | `#3b3427` |
| `--muted` | `#a3a3a3` | `#6d634d` |
| `--brand` | `#f5f5f5` | `#1a1a1a` |
| `--on-brand` | `#0a0a0a` | `#ffffff` |

Cream is the dyslexia-friendly default (never pure black on pure white). High
contrast is an accessibility setting, not a style, and is separate from the toggle.

### The brand accent

The default accent is **Mono** (`data-accent="mono"`, which needs no override).
The other accent options (sky, teal, green and so on) still exist for people who
choose them. Anything you build must still look right in Mono.

### When colour is allowed

Colour carries meaning only:

- **Subject identity** (`subjectColor()` in `content.js`): Maths, Economics,
  Computer Science each have one colour, used for the left edge and LED of that
  subject's cards. Nowhere else.
- **Readiness ramp** (`--r0` to `--r4`): how ready a chapter is.
- **State**: danger, warning, success.
- **Diagram meaning**: address / data / control, supply / demand, and similar.

Do not add colour for decoration, and do not reuse a meaning-colour for
something else. The ones to avoid reintroducing: blue as a brand colour, and the
violet and cyan sparkle that used to run through buttons.

---

## 5. Typography

| Role | Font | Notes |
| ---- | ---- | ----- |
| Headings | Bricolage Grotesque (`--font-head`) | |
| Body | Instrument Sans (`--app-font`) | |
| Console labels, tags, prompt, wordmark | JetBrains Mono (`--font-mono-ui`) | Bundled locally via `@fontsource-variable/jetbrains-mono` |

- Anything with Tailwind's `uppercase` becomes a monospace console label
  automatically (`.uppercase` in `server.css`). Do not set a font on it yourself.
- **The two reading fonts opt out.** When a person switches on OpenDyslexic or
  Atkinson Hyperlegible, `[data-font='dyslexic']` and `[data-font='hyperlegible']`
  restore the reading font on console labels, chips and diagram axes. A monospace
  face works against the reason they turned it on. Keep that opt-out on anything
  new you set in monospace.
- Do not set long text in monospace. It is for labels and short strings.

---

## 6. Components (the cookbook)

Reuse these. If you need a variation, extend the shared style in `server.css`
instead of writing a one-off.

### Panel

`.card` (and `.glass`, `.glass-strong`) get the shared radius and hairline border
from `server.css`. Use `<SpineCard color={...}>` for a panel that belongs to one
subject: coloured left edge, corner LED, dot-matrix texture, and a data packet
that runs along the top edge on hover. It is pure CSS.

```jsx
<SpineCard color={subjectColor(name)} className="p-5 pl-6">...</SpineCard>
```

Do not add `rounded-2xl` / `rounded-3xl` to panels expecting it to apply; the
shared radius overrides it.

### Status LED

```jsx
<i aria-hidden="true" className="srv-led" />
```

A 4px dot that blinks unevenly. Colour it with `--led` (it defaults to the text
colour). Vary the rhythm with `--led-t` (period) and `--led-d` (delay) so
neighbours do not blink together. Always `aria-hidden`: it is decoration.

### Tag

A square, hairline, monospace label with an LED. Colour comes from `--tag`.

```jsx
<span className="srv-tag" style={{ '--tag': 'var(--r2-shaky)' }}>
  <i aria-hidden="true" className="srv-led" />
  Shaky
</span>
```

### Segmented bar

`ProgressBar` renders `.srv-bar` / `.srv-bar-fill`, a row of cells. The dashboard
XP bar (`.xp-bar`) and the chapter map (`.spec-map-*`) share the look. Do not
write a new smooth `rounded-full` progress bar.

### Chip

`<Chip>` is a square-cornered monospace option button (`.srv-chip`). Use it for
any selectable pill. The pill shape is no longer used for chips.

### Console title bar

```jsx
<div className="srv-titlebar">
  <span className="leds" aria-hidden="true"><i className="srv-led" /><i className="srv-led" /><i className="srv-led" /></span>
  <span className="path">~/memoora/dashboard</span>
</div>
```

Used on the dashboard hero and on every diagram frame. Always `aria-hidden` or
decorative text only.

### Buttons

`<Button>` keeps the charged-button chrome (a current behind a glass cover that
sweeps on hover) with a monospace label. The sweep colours come from tokens, so it
is neutral in Mono. Do not add coloured gradients to buttons.

### Note callouts (study content)

Content builders output plain markup that `notes.css` styles. Keep the structure:

```html
<div class="defn"><strong>Clock speed</strong>The number of clock cycles per second.</div>
```

The `<strong>` is the **header row** (LED plus label) and the text sits beneath
it. Do not put the label inline with the text; that was the cramped chip this
replaced. The same shape is used for `.worked`, `.det` and `.exam-tip`.

### Diagrams

All subject diagrams are inline SVG wrapped in `Figure`
(`components/diagrams/primitives.jsx`). `Figure` adds the console title bar, the
dot-grid frame, and the `// WHAT THIS DIAGRAM SHOWS` caption. Shared CSS gives
boxes small square corners and hairline strokes.

- Build diagrams from the primitives (`Box`, `Arrow`, `Curve`, `Axes`, ...).
- **Diagram text stays in the reading font.** The labels are hand-placed in a
  400x300 box, and a wider monospace face would risk collisions. Only axis and
  value labels (short strings) are monospace.
- Keep colour meaningful (see section 4). Do not recolour a diagram to "match".
- Diagrams intentionally draw slightly outside the viewBox in places (the Laffer
  curve control point). Do not add `overflow: hidden` to the figure or SVG.

### Giant footer wordmark

`<SigilWordmark size="giant" animate />` inside `.srv-giant`, which clips it below
the baseline and fades it out at the bottom edge. Do not put a glow or
`text-shadow` on it.

---

## 7. The background system

`AtmosphereBackground` is a fixed layer behind the page. It is mounted by the
marketing pages and by `AppLayout` (the signed-in app).

### The grid

A dot grid, one dot every **14px**. The cell size exists in two places that must
stay equal: `--bg-cell` in `atmosphere.css` and `const CELL = 14` in
`AtmosphereBackground.jsx`. Change both or neither.

### Four modes

The backdrop changes character as you scroll so the effect matches the content.
Tag a section with `data-bg` and the matching mode takes over when that section
crosses the middle of the screen:

| `data-bg` | Effect | Use it for |
| --------- | ------ | ---------- |
| `packets` | Data packets streaming along rows, plus blinking dots | Heroes, "doing work" |
| `rack`    | Rack units with status LEDs down both edges | Dashboards, status, features |
| `bus`     | Packets running down vertical lines | Flows, step-by-step explanations |
| `log`     | Terminal log lines in the margins | Footers, FAQ, legal |

```jsx
<section data-bg="rack">...</section>
```

Pages with no tagged section use the default. `AppLayout` sets
`<AtmosphereBackground defaultMode="rack" />`. Only the active mode runs; the
others are hidden with their animations paused.

**To add a mode:** add a `.bg-mode.m-<name>` block in `AtmosphereBackground.jsx`,
its rules in `atmosphere.css`, register the name where the active class is chosen,
and add a row to the table above.

### The alignment trick (do not break it)

Lit things (packets, the cursor) are not separate dot patterns. A lit element is a
**clip window** that moves, with a **bright copy of the grid inside it moving the
opposite way** by the same amount. The two cancel, so the lit dots are exactly the
page grid's own dots. If you give a lit element its own pattern or a different
tile size, the dots will no longer line up and it will look doubled.

- Both transforms must use identical timing, or they drift apart.
- Round offsets to whole pixels so they cancel exactly.

### The cursor

No glow circle. The pointer addresses the grid: its row and column light up and one
cell is selected where they cross. It snaps to cells and eases between them (190ms).
It stays hidden until the first pointer move so it never sits behind the hero text.

### Blinks must be irregular

Real status lights do not blink in a pattern. Keep it that way:

- Layers use tile sizes that share no common factor (see the blink layers).
- Each layer has its own pattern (double-blink, single pulse, burst, mostly-on).
- Durations and delays are all different and none is a multiple of another.
- The two rack strips are **not mirror images**: different unit heights, LED
  positions and patterns.
- `steps(1, end)` is correct here (hard on/off) and is the only place `steps()`
  belongs. See section 8.

### The calm zone

`.bg-calm` dims the grid and effects behind the middle of the page so body copy
stays legible and the edges keep the full effect. Do not remove it, and do not
place important small text over a bright effect without it.

### Glow

Lit dots use `--bg-lit`: a pinpoint core and a faint bloom reaching 4.4px. The
`.srv-led` halo is two faint box-shadows. If you add a new lit thing, copy these;
do not use a solid disc or a large radius.

---

## 8. Motion rules

These exist because each one was a real problem in this project.

**Do**

- Animate **`transform` and `opacity` only.** They run on the compositor and hold
  60fps.
- Make theme-level motion **continuous**. Use smooth easing from the first frame.
- Pause what is not visible (inactive background modes are paused and hidden).
- Provide a reduced-motion version of every animation.

**Do not**

- **No blur filters or backdrop blur on anything that moves or sits under motion.**
  A blurred, scaled video and a blend-mode sweep were what made the original
  landing page lag. The header bar (`.glass-bar`) deliberately has no backdrop
  blur because it would re-blur on every scroll frame.
- **No WebGL per card.** The old silk shader ran one GL context per subject card.
- **No stepped or delayed animation for transitions.** An earlier theme-switch grew
  its dots in stepped jumps with staggered delays and read as the animation
  stuttering. `steps()` is for LED on/off only.
- **No bouncing, overshoot or springy lag** on the server effects. The one
  exception is the theme toggle cap, which glides with a small overshoot.
- **Do not put two animations on one element's transform.** Split into an outer
  and inner element (the wordmark letters do this).
- **No infinite animation on large numbers of elements** unless it is opacity-only
  and paused when hidden.

### Page changes

Navigation always opens the new page at the top, **instantly**, before paint
(`ScrollToTop.jsx`). The global `html { scroll-behavior: smooth }` otherwise turns
the reset into a visible slide. That component briefly sets the behaviour to
`auto` for the jump. Smooth scrolling stays right for in-page jumps (notes
sections, back to top).

---

## 9. The theme switch

`src/lib/themeTransition.js` (logic) and the `::view-transition-new(root)` block
in `src/server.css` (mask). It spreads from the toggle button as a rippled ring,
and the new theme comes on through four dot lattices.

How it is built (read this before changing it):

- The new page is shown through one mask of **five layers**: a radial fade centred
  on the button (`--srv-x`, `--srv-y`, driven by `--srv-reach`), **intersected**
  with the **union** of four dot lattices. `mask-composite: intersect, add, add,
  add, add` (each value describes how that layer combines with the ones below).
- The four lattice pitches are 14, 23, 37 and 53px. They share no common factor,
  so dots land at scattered-looking positions. The three sparse ones stay small;
  the dense 14px grid grows to cover everything.
- The edge is a clip-path polygon whose radius is modulated by two sine waves of
  angle, with a random phase per switch.
- The animated values (`--srv-a` to `--srv-d`, `--srv-reach`) are registered with
  `@property` so JavaScript can animate them. `--srv-x` and `--srv-y` are plain
  inherited properties set once on `<html>`.
- It must **end fully opaque**: the dense lattice radius must finish above 9.9px
  (half the 14px tile's diagonal) and the fade must finish past the farthest corner.
- Everything eases continuously. Do not add `steps()` or start delays.

It depends on the View Transitions API and falls back to an instant switch with
reduced motion or no support. The browser refuses view transitions in a hidden
document, so it cannot be tested in a backgrounded tab or a hidden preview pane.
Test it in a normal visible window.

---

## 10. Music sync (audio reactivity)

Opt-in control in the music panel: **Sync the server**.

**What is and is not possible.** The player is Spotify's embedded iFrame: another
origin, DRM-protected audio. A page cannot read that audio, and Spotify's
audio-analysis API is closed to new apps. So the background cannot read the beat
from Spotify directly. `src/lib/audioReactive.js` instead listens to sound the
browser is already making, with explicit permission:

- **This tab** (`getDisplayMedia`, audio only): exact audio, no room noise
- **Microphone**: hears the speakers; also hears the room

Rules:

- **Privacy.** Audio is analysed in the tab (an `AnalyserNode`) and discarded.
  Never record, store, upload or log it. The source is never connected to the
  speakers (that would double the music or cause feedback).
- **Opt-in only.** Nothing starts without a click. Do not auto-start it.
- It publishes `level`, `bass`, `mid`, `treble` (0 to 1), `beat` (1 on a kick,
  then decaying) and `spectrum` (64 log-spaced bands from 40 Hz to 12 kHz) every
  frame. `AtmosphereBackground` writes the scalars as `--au-*` custom properties on
  **its own element only** (so only that subtree is restyled), and `atmosphere.css`
  reads them under `.reactive`. The spectrum drives the equalizer bars directly.
- Effects, in order of prominence: the **equalizer** (below), the grid flashing on
  the beat, rack LEDs and blinkers following the bands, and packets speeding up
  with loudness. The ambient grid is deliberately dimmer while sync is on so the
  music has something to rise out of.
- The beat flash is capped at about two thirds strength, and every one of these
  effects is disabled for reduced motion.
- In development, `window.__audioReactive.pushFrame(...)` and `setActive(true)`
  drive the background with synthetic frames so you can test without permissions.
  It is stripped from production builds.

### The equalizer

When sync is on, a row of dot-built bars rises from the bottom edge, with a fainter
mirror from the top, so the music reads as a wave across the whole page. Low notes
are on the left and high notes on the right, and a slow ripple rolls across the bars
(stronger when it is loud) so the row keeps moving between hits.

Rules for anyone touching it (`AtmosphereBackground.jsx`, `.bg-spectrum` in
`atmosphere.css`):

- **Bars are whole grid cells.** Heights are `rows * CELL` px, so every bar is a
  stack of complete dots. Never scale a bar with `transform: scaleY`; it would
  stretch the dots into ovals.
- **Stay on the grid.** There is a bar every second grid column (`left = i * CELL * 2`)
  and the bottom row is offset by `innerHeight % CELL`, so the dots land exactly on
  the background's dots. If you change the bar spacing, keep it a multiple of `CELL`.
- **It is the one place a stronger lit dot is allowed** (`--bg-lit-strong`), because
  while sync is on the music is the main event. Everywhere else, keep the faint
  bloom from section 7.
- It sits above the calm zone so it is never dimmed, and below the page content.
- It is hidden unless the background has the `reactive` class, and hidden for
  reduced motion.
- Height changes use a 70ms linear transition for smoothness. Keep it short: a
  longer one makes the bars lag behind the music.

---

## 11. Share images (Open Graph)

One 1200x630 image per route in `public/og/<slug>.png`, drawn as a console window
(title bar, wordmark, the page's own heading and description, a chip row) with the
background mode that matches the page. `seo.js` (`ogImageFor`), `Seo.jsx` and the
prerender point each route at its own image.

Regenerate after changing a page's title, heading or description:

```bash
npm run og
```

Requirements: Node, `python3` with `fonttools` and `brotli` (`pip install
fonttools brotli`), and `rsvg-convert` (`brew install librsvg`). The PNGs are
committed, so a normal build needs none of this.

- The generator reads copy straight from `src/lib/seo.js`, so images cannot drift
  from the site text.
- All text is outlined from the real fonts, so the PNGs do not depend on installed
  fonts.
- **Adding a route:** add it to `PAGES` in `seo.js`, add its mode to `MODE` in
  `scripts/og/generate.py`, run `npm run og`, and commit the new PNG.
- Layout is deterministic: the same inputs give the same images, so diffs are clean.

---

## 12. Accessibility and compatibility (non-negotiable)

- Works in **every theme**: dark, cream and high contrast. Decorative layers
  (`.atmosphere`, the dot textures, scanlines, LEDs) are hidden in high contrast.
- **Reduced motion** switches off the wordmark effects, the cursor, packets,
  blinkers, the beat flash, the card sweep and the theme-switch animation.
- Decorative elements are `aria-hidden`. The wordmark is one labelled image.
- Never rely on colour or light alone. A status shown by an LED colour also has
  text (the tag label).
- Everything interactive is keyboard-operable with a visible focus state.
- The reading fonts (dyslexia, hyperlegible) must still work on anything new.
- Text needs real contrast against the **calm zone**, not against the bare grid.

---

## 13. Product scope

The product covers **Maths, Economics and Computer Science only**
(`SUBJECT_CATALOG` in `content.js`). The Biology, Chemistry, Physics, Psychology
and Sociology packs were removed. Do not reintroduce a subject without real content
behind every study mode. A subject with nothing behind it is worse than none.
Saved subjects outside the catalog are kept and can be removed from the picker.

---

## 14. Do and don't

| Do | Don't |
| -- | ----- |
| Use `server.css` classes (`srv-led`, `srv-tag`, `srv-bar`, `srv-titlebar`) | Write a new one-off rounded, shadowed card |
| Use semantic tokens | Hard-code a colour, or bring back blue as a brand colour |
| Keep colour meaningful (subject, readiness, state, diagram meaning) | Add colour for decoration |
| Use `SigilWordmark` | Type the name in a heading font, or recolour or stretch the logo |
| Keep the wordmark as one labelled image | Let scrambled glyphs be read aloud |
| Animate transform and opacity | Add blur filters, backdrop blur or a blend-mode sweep under motion |
| Make transitions continuous | Use `steps()` or delays outside LED blinks |
| Tag sections with `data-bg` to pick a background mode | Hard-code a different backdrop per page |
| Keep lit dots as a pinpoint with a faint bloom | Use a solid white disc or a big glow |
| Keep the rack strips and blinks irregular and asymmetric | Mirror them or put them on a regular beat |
| Keep the lit-window and counter-window in step | Give a lit element its own pattern |
| Leave diagram text in the reading font | Set whole diagrams in monospace |
| Put the callout label in its own header row | Put the label inline with the text |
| Keep audio sync opt-in, local and unrecorded | Auto-start the microphone, or send audio anywhere |
| Build equalizer bars from whole grid cells on the grid | Scale bars with `scaleY`, or let them drift off the dot grid |
| Run `npm run og` after changing page copy | Hand-edit the PNGs in `public/og/` |
| Check dark, cream and high contrast, with and without reduced motion | Test only in one theme |
| Leave storage keys, the Firebase project and the domain as they are | Rename them to match the brand |

---

## 15. Before you open a UI pull request

- [ ] Looks right in dark, cream and high contrast
- [ ] No hard-coded colours; any new colour carries a meaning
- [ ] Reuses a shared class or component, or extends `server.css`
- [ ] Only `transform` and `opacity` animate; nothing blurred moves
- [ ] Reduced motion is handled
- [ ] New decorative elements are `aria-hidden`; text has real contrast
- [ ] If copy changed on a routed page: `npm run og` run, PNGs committed
- [ ] `npm run lint` is clean and `npm run build` passes
- [ ] No em dashes in copy
- [ ] If you changed anything in section 7 or 9, you re-read the rules there
  (the alignment trick and the mask composite are easy to break quietly)

---

## 16. Why things are the way they are

A short history, so nobody undoes a fix by accident.

- **The blue brand and the sigil icon were retired** for a monochrome identity
  and a type-led wordmark. The old open-ring "o" read as a "c"; the wordmark is now
  the terminal prompt.
- **The video backdrop was replaced** by the CSS dot grid. The blurred, scaled
  video plus a blend-mode sweep and grain repainted the whole viewport every frame.
- **The silk shader and the round cursor glow were removed.** One WebGL context
  per card was expensive, and a literal circle glow did not fit the server idea.
  The cursor now addresses grid cells.
- **Glows were made smaller and fainter.** A solid core with a thin ring read as a
  white ball. A pinpoint with a short bloom reads as light.
- **The theme switch was rebuilt twice.** Top-to-bottom was replaced by a ring from
  the button (the button is the source of the change), and stepped, delayed dot
  growth was replaced by continuous growth because the steps read as lag.
- **Page changes jump to the top instantly** because the global smooth scrolling
  made every navigation slide.
- **Audio sync is opt-in capture** because the music source cannot be read directly.
- **The hover glow on the giant footer wordmark was removed** because it was clipped
  into a visible rectangle.
