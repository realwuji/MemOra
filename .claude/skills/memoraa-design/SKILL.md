---
name: memoraa-design
description: The Memoraa visual and interaction rules - the "server" terminal look, square corners, hairlines, glowing dots instead of gradients, the dot-grid backdrop and its four modes, the header menus, motion and accessibility rules. Use before changing any UI, CSS, background effect, header, card, button, menu, animation or theme.
---

# Designing for Memoraa

The full system is `DESIGN.md` at the repo root. Read the sections for what you are touching. This is the short version, in the order mistakes get made.

## The look in one line

A server that works for you: black and white, **square** hairline panels, small status LEDs, data moving quietly along a dot grid, console type for labels, a handwriting face only where a person is "writing".

## Never

- **Round a corner.** Nothing is rounded (one `!important` rule in `src/server.css`). Do not mix a circle into a square component. Only `.srv-led`, `.level-ring-core` and `.keep-round` are circular.
- **Add a gradient wash, a coloured glow or a drop shadow.** Emphasis is glowing dots (`--bg-lit`, a pinpoint with a faint bloom), a hairline, or the subject colour on an edge.
- **Draw a line or a bar across the backdrop.** Lines are the grid's own dots lit through a mask (see `.bg-dash`, `.bg-rack`). Everything sits on the 14px grid.
- **Hard-code a colour.** Use tokens. Colour carries meaning only (subject, readiness, state, diagram meaning).
- **Animate anything but `transform` and `opacity`** (the one morph in the header menu and the one mask sweep in focus mode are the exceptions, and they are justified in `DESIGN.md`). No blur on anything that moves. No stepped or delayed transitions except an LED blink.
- **Show a placeholder when you know the real value**, or invent a value you do not know (header menus read `useHeaderMenus`, which reads the same helpers as the dashboard).
- **Rename the stored keys, the Firebase project or the domain.** Memoraa is the display name; storage keys still say `memora`.

## Always

- Reuse `srv-led`, `srv-tag`, `srv-bar`, `srv-titlebar`, `SpineCard`, `MegaNav`, `SigilWordmark` before writing something new.
- Check **dark, cream and high contrast**, and **reduced motion** (every effect switches off; high contrast hides the backdrop and dot decorations).
- Make decorative things `aria-hidden`. Make everything keyboard-operable with a visible focus state.
- Keep the reading fonts working (OpenDyslexic, Atkinson Hyperlegible replace mono labels and the handwriting face).
- Know which CSS file wins: `server.css` is unlayered and loads first; lazy-chunk CSS (`notes.css`, `chapter-picker.css`) loads later. At equal specificity the later file wins, so put overrides at the end of the file that loads last.

## Before you open a UI PR

`npm run lint`, `npm test`, `npm run build`; look at the page in the browser in at least two themes; read the checklist in `DESIGN.md` section 15.
