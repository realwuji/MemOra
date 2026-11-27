/*
  The header menus (components/layout/MegaNav.jsx). Plain data, so a route is renamed in one place.

  Every `to` is a route that exists today (see App.jsx). Copy is plain and true: no invented numbers,
  no claims the product does not make. No em dashes (house style).

  Shape of a menu:
    { id, label, path, columns: [{ title, links: [{ label, to, desc? }] }], cards: [{ title, desc, to, art }] }
  `path` is the fake terminal path shown in the panel's title bar (~/memoraa/<path>).
  `art` names a small dot animation drawn for the card (MenuArt.jsx): 'packets' | 'rack' | 'bus' | 'log',
  the same four effects as the page backdrop.
*/

// Links that sit in the bar on their own, with no menu.
export const APP_PLAIN = [{ label: 'Dashboard', to: '/dashboard' }]

export const APP_MENUS = [
  {
    id: 'study',
    label: 'Study',
    path: 'study',
    columns: [
      {
        title: 'Subjects',
        links: [
          { label: 'Maths', to: '/start/maths', desc: 'Edexcel. Pure, Statistics and Mechanics' },
          { label: 'Economics', to: '/start/economics', desc: 'Edexcel. Themes 1 to 4' },
          { label: 'Computer Science', to: '/start/computer-science', desc: 'OCR. Components 1 and 2' },
        ],
      },
      {
        title: 'Methods',
        links: [
          { label: 'Notes', to: '/start', desc: 'Read the topic properly' },
          { label: 'Flashcards', to: '/flashcards', desc: 'Make a deck or revise one' },
          { label: 'Exam questions', to: '/start', desc: 'Real questions with mark schemes' },
          { label: 'Multiple choice', to: '/start', desc: 'Quick checks, marked for you' },
        ],
      },
    ],
    cards: [
      {
        title: 'Exam questions',
        desc: 'Real questions in paper order, with the mark scheme and examiner\'s report under each.',
        to: '/start',
        art: 'rack',
      },
    ],
  },
  {
    id: 'track',
    label: 'Track',
    path: 'track',
    columns: [
      {
        title: 'Your numbers',
        links: [
          { label: 'Progress', to: '/progress', desc: 'Readiness, chapter by chapter' },
          { label: 'Mistakes', to: '/mistakes', desc: 'Questions to have another go at' },
          { label: 'Settings', to: '/profile', desc: 'Subjects, exam dates and accessibility' },
        ],
      },
    ],
    cards: [
      {
        title: 'Close your gaps',
        desc: 'The chapters and questions that need a second look, in one place.',
        to: '/mistakes',
        art: 'log',
      },
    ],
  },
  {
    id: 'together',
    label: 'Together',
    path: 'together',
    columns: [
      {
        title: 'Revise with others',
        links: [
          { label: 'Community', to: '/community', desc: 'Ask, answer and share' },
          { label: 'Friends', to: '/friends', desc: 'Add friends and compare weeks' },
          { label: 'Teachers', to: '/teachers', desc: 'Groups and classes' },
        ],
      },
    ],
    cards: [
      {
        title: 'Friends',
        desc: 'See who is really revising this week.',
        to: '/friends',
        art: 'bus',
      },
    ],
  },
]

/*
  The public pages' menu: only routes that exist for someone who is not signed in. Static, because there
  is no personal state to show before an account exists.
*/
export const MARKETING_MENUS = [
  {
    id: 'about',
    label: 'More',
    path: 'more',
    columns: [
      {
        title: 'Memoraa',
        links: [
          { label: 'How it works', to: '/how-it-works', desc: 'What it does and why it is built this way' },
          { label: 'Sign in', to: '/signin', desc: 'Pick your revision up where you left it' },
        ],
      },
      {
        title: 'Help and legal',
        links: [
          { label: 'Contact', to: '/contact', desc: 'A question, or something wrong' },
          { label: 'Privacy', to: '/privacy', desc: 'What is stored, and where' },
          { label: 'Terms', to: '/terms', desc: 'The rules of using it' },
        ],
      },
    ],
    cards: [
      {
        title: 'Free to try',
        desc: 'No account needed. Sign in to keep your progress on any device.',
        to: '/signin',
        art: 'packets',
      },
    ],
  },
]
