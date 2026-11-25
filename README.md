# Memoraa

**A mood-aware study companion, built for every mind.**

EduTech hackathon entry for the theme _"Build for every mind, for those who learn
differently."_ Most revision apps only care what you study. Memoraa also cares
**how you are doing**. It checks your mood before and during every study session
and shapes the session around it: a motivational line tuned to your goal, real
practice content, a mid-session check-in, and a nudge to take a break when you
are struggling.

Stack: **Vite + React 19 (JSX) + Tailwind v4 + Framer Motion + React Router v7**.
All state persists to `localStorage`, so the demo runs with no backend. Ships as
a static site to **Firebase Hosting** (memoraa.web.app).

---

## The core idea: a mood-aware session

The study session (`/study`) is the heart of the app:

1. **Mood check-in.** Great, Okay, or Struggling.
2. **Goal-referenced encouragement.** The message is keyed to your onboarding
   goal and current mood (for example, aiming for top grades and feeling okay:
   _"Steady wins the A*. A focused session now compounds fast."_).
3. **Focus block with real content.** A running timer plus AI-generated revision
   material chosen by technique: flashcards, MCQs with instant feedback, exam
   questions with mark schemes, essay plans, application cases, diagram revision and a diagram bank.
4. **Mid-session check-in.** Rate the stretch 1 to 5. A low score offers a timed
   **break** (wellbeing first); a good score keeps you going.
5. **Wrap up.** Rate the difficulty, and the session is saved to your recent
   activity.

## What else is in the app

| Area                     | What it does                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| **Onboarding wizard**    | Name, year, goal, course type, exam-board spec, and subjects     |
| **Dashboard**            | Exam countdown, prioritised subject pillars, tools, technique picker, knowledge decay |
| **Flashcard maker**      | Study AI-built decks or create, save, and delete your own        |
| **Mock exams**           | Timed, board-specific papers with randomised questions and mark schemes |
| **Community**            | Post a win or a question and cheer others on                     |
| **Friends**              | Add friends, view leaderboards, compare progress                 |
| **Progress**             | Per-subject trend sparklines, mistake analysis, XP tracking      |
| **Profile + auth**       | Sign up, log in, log out, all on-device                          |

## Adapting for how people learn

The landing page names who the app is built for (dyslexia, low vision, blind,
deaf or hard of hearing, ADHD, motor and mobility) and the whole UI is built to
be inclusive:

- **Two themes, black and cream:** a sun/moon toggle at the top right swaps them
  with a circular reveal out of the button. High-contrast is kept for low-vision
  users in Settings > Appearance. Accent colour is independent of theme.
- **Semantic design tokens only**, so colour and contrast stay consistent.
- **Accessible by default:** keyboard navigation, focus states, `aria` labels,
  and `prefers-reduced-motion` respected app-wide via `MotionConfig`.
- A friendly mascot (Sparky) and the spinning wheel brand mark set a calm,
  encouraging tone.

---

## Run it

```bash
git clone https://github.com/DedStrke/MemOra.git
cd MemOra
npm install
npm run dev        # http://localhost:5173
```

| Command           | What it does                       |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Local dev server with hot reload   |
| `npm run build`   | Production build into `dist/`      |
| `npm run preview` | Preview the production build       |
| `npm run lint`    | Lint the codebase (oxlint)         |
| `npm run deploy`  | Build and deploy to Firebase Hosting |

Deploys itself: a push to `main` triggers `.github/workflows/deploy.yml`
(present but disabled - deploy is now manual via `npm run deploy` to Firebase).
The GitHub Pages workflow is left in place for recoverability.

Live URL: https://memoraa.web.app

## Project structure

```
src/
├── main.jsx                     # Entry: Router + AppProvider + fonts + CSS
├── App.jsx                      # Routes + app-wide reduced-motion + cursor glow
├── index.css                    # Tailwind + design tokens + 3 runtime themes
├── context/
│   └── AppProvider.jsx          # THE STORE: auth, theme, decks, posts, profile
├── lib/
│   ├── motion.js                # Shared Framer Motion variants
│   ├── fonts.js                 # Self-hosted fonts (no CDN)
│   ├── auth.js                  # localStorage auth helpers
│   ├── sessions.js              # Study session persistence
│   ├── attempts.js              # Attempt tracking
│   ├── gaps.js                  # Knowledge gap analysis
│   ├── mistakes.js              # Mistake tracking
│   ├── xp.js                    # XP and levelling
│   ├── pace.js                  # Pacing analytics
│   ├── daily.js                 # Daily rewards/quotes
│   ├── techniques.js            # Revision technique definitions
│   ├── seo.js                   # SEO metadata helpers
│   ├── slug.js                  # URL slug utilities
│   ├── spotify.js               # Spotify integration
│   ├── friends.js               # Friends/leaderboard logic
│   ├── chat.js                  # Community chat
│   ├── blobStore.js             # IndexedDB blob storage
│   ├── avatar.js                # Avatar generation
│   ├── image.js                 # Image handling
│   ├── imagePos.js              # Image positioning
│   ├── profanity.js             # Content filtering
│   └── safety.js                # Safety utilities
├── constants/
│   ├── content.js               # ALL copy + option definitions
│   ├── packs.js                 # Subjects for the app: light packs now, full content on demand
│   ├── pack-*.js                # One assembled pack per subject (maths, economics, computer-science)
│   ├── library.js               # Every pack at once, for scripts only (the app never imports it)
│   ├── subjects/                # Per-subject revision content (Maths, Econ, CS)
│   │   ├── maths-*.js
│   │   ├── econ-*.js
│   │   └── cs-*.js
│   ├── diagram-*.js             # Interactive diagram definitions
│   ├── econ-diagrams.js         # Economics diagram cards
│   ├── econ-essay-*.js          # Economics essay bank, answers, annotations
│   ├── econ-mcq-*.js            # Economics MCQ questions
│   ├── econ-exam-*.js           # Economics exam questions
│   ├── maths-notes-*.js         # Maths notes and MCQs
│   ├── maths-exams-*.js         # Maths exam questions
│   ├── assessments.js           # Assessment definitions
│   ├── mascots.js               # Mascot definitions
│   ├── quotes.js                # Daily quotes
│   └── notes-merge.js           # Note merging utilities
├── hooks/
│   └── useMe.js                 # Current user hook
├── components/
│   ├── layout/                  # AppBar, AppLayout, ThemeSwitcher, Footer, LegalLayout, ScrollToTop, Seo
│   ├── dashboard/               # CountdownCard, SubjectPillars, KnowledgeDecay, AssessmentsCard, CloseGaps, DailyQuote, DailyReward, HeroBanner, PaceVerdict, WeekChart
│   ├── diagrams/                # Interactive diagrams (Maths, Economics, CS)
│   │   ├── index.jsx
│   │   ├── primitives.jsx
│   │   ├── maths.jsx
│   │   ├── mathsExtra.jsx
│   │   ├── economics.jsx
│   │   ├── economicsExtra.jsx
│   │   ├── economicsGaps.jsx
│   │   ├── econGeometry.js
│   │   ├── computerScience.jsx
│   │   └── computerScienceExtra.jsx
│   ├── econ/                    # Economics-specific components
│   ├── friends/                 # FriendCard, LeaderboardList
│   └── ui/                      # Reusable UI kit:
│       # Button, Section, Icon, Mascot, WheelLogo, FlipCard,
│       # RevisionRunner, Sparkline, ProgressBar, OptionCard,
│       # Marquee, CursorGlow, FocusMusic, SpeakButton, SketchPad,
│       # ImageAdjust, AccentPicker, Avatar, BandBar, Banner,
│       # Breadcrumbs, Buddy, Chip, EssayPlanner, EyeMark, LevelUp,
│       # MascotPicker, NeuronField, Pfp, ReadinessRing, SilkField,
│       # StudyTimer, SubjectPicker, Toast, Wordmark, AtmosphereBackground,
│       # AnswerInput, ChapterBar
├── pages/
│   ├── dev/
│   │   └── DiagramGallery.jsx   # Dev-only diagram preview
│   ├── Landing.jsx
│   ├── HowItWorks.jsx
│   ├── SignIn.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── Start.jsx
│   ├── StudySession.jsx
│   ├── MockExam.jsx
│   ├── Flashcards.jsx
│   ├── Progress.jsx
│   ├── Performance.jsx          # Mistakes/XP analysis (route: /mistakes)
│   ├── Community.jsx
│   ├── Friends.jsx
│   ├── Privacy.jsx
│   ├── Terms.jsx
│   ├── Contact.jsx
│   └── NotFound.jsx
```

## Design

The look is a server: monochrome panels, status LEDs, data packets moving along a
dot grid, console type. The full design system, with the shared classes, motion and
performance rules and a do and don't list, is in [`DESIGN.md`](./DESIGN.md). Read it
before changing any UI.

## Conventions

- **Colours:** never hard-code hex. Use semantic token utilities (`bg-page`,
  `text-fg`, `bg-surface`, `border-line`, `bg-brand`, `text-brand-strong`,
  `bg-flash-soft`, and so on). Add tokens in `src/index.css`.
- **Copy** lives in `src/constants/content.js`; **revision content** in
  `pack-<subject>.js` (read through `packs.js`); **demo data** is generated inline.
- **Animations:** import variants from `src/lib/motion.js`.
- **Imports:** use the `@/` alias for anything under `src/`.
- **Components:** one per file, `PascalCase.jsx`, default export named like the
  file. Reuse the `ui` kit before creating new markup.

## Adding a revision subject

Each subject is its own module, `src/constants/pack-<id>.js`, whose default export
is the assembled pack: `id`, `name`, `topics`, `groups` (the chapter outline),
`flashcards`, `mcq` and `examQuestions`, plus `notes` and anything else it has.

1. Create `src/constants/pack-<id>.js` (copy `pack-maths.js` as the shape; run the
   export through `dedupeContent` from `pack-dedupe.js`).
2. Add it to `REVISION` in `src/constants/library.js` and a loader to
   `src/constants/pack-loaders.js`.
3. Run `npm run dev` or `npm run build`: `scripts/generate-pack-manifest.mjs`
   rewrites `src/constants/pack-manifest.js` (outline and counts) and fails if
   step 2 was missed.

The app reads subjects through `src/constants/packs.js`, never `library.js`:
`getPackByName()` gives the light pack (outline and counts, available at once),
and `loadPack()` / `usePack()` fetch a subject's full content, which is its own
chunk. A page that only lists chapters or shows counts must not need the
content; one that shows questions or notes must load it. Importing `library.js`
from the app puts every subject (about 2.7MB) in the first download of the page.
The flashcard maker, study session, and progress page pick it up automatically.

## Working with AI coding assistants

This repo is standardised so any AI model or tool follows the same rules.
[`AGENTS.md`](./AGENTS.md) is the single source of truth (the cross-tool
[agents.md](https://agents.md) convention read by Cursor, GitHub Copilot, OpenAI
Codex, Gemini CLI, Aider, Zed, and more). `CLAUDE.md` and
`.github/copilot-instructions.md` are thin pointers to it, so edit the rules in
`AGENTS.md` only. If you add a page, token, or convention, update `AGENTS.md` to
match.