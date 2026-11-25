import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import Section from '@/components/ui/Section'
import { useApp } from '@/context/AppProvider'
import { isOwner } from '@/constants/owner'
import { TEACHERS, isTeacher, teacherEmail } from '@/constants/teachers'

/*
  Teacher portal (/teachers). Not linked from the landing page or any menu: teachers are given the
  address. They sign in with their name and the password they were given, and land on a page that
  lists everything a student sees, subject by subject, as links. It is for looking through the
  content, so nothing on it changes anything.
*/
const SUBJECTS = [
  {
    name: 'Economics',
    slug: 'economics',
    note: 'Edexcel 9EC0',
    items: [
      ['Notes', 'notes', 'The full notes for every chapter, with diagrams'],
      ['Diagram bank', 'diagram-bank', 'Every diagram, drawn step by step, with what shifts each curve'],
      ['Essay plans', 'essay-plans', 'All exam questions, each with a plan and its diagrams'],
      ['Application', 'application', 'Real cases for every topic'],
      ['Flashcards', 'flashcards', 'Prompts and answers by chapter'],
      ['Exam questions', 'exam-questions', 'Questions with mark schemes'],
      ['MCQ', 'mcq', 'Multiple choice by chapter'],
    ],
  },
  {
    name: 'Maths',
    slug: 'maths',
    note: 'Edexcel 9MA0',
    items: [
      ['Notes', 'notes', 'Worked notes for every chapter'],
      ['Past papers', 'past-papers', 'Every paper from 2018 to 2025 and the mock sets, timed or untimed, with mark schemes and examiner reports'],
      ['Exam questions', 'exam-questions', 'The same questions filed by chapter'],
      ['Formula flashcards', 'flashcards', 'Every formula to memorise'],
    ],
  },
  {
    name: 'Computer Science',
    slug: 'computer-science',
    note: 'OCR H446',
    items: [
      ['Notes', 'notes', 'Notes for every chapter'],
      ['Flashcards', 'flashcards', 'Prompts and answers by chapter'],
      ['Exam questions', 'exam-questions', 'Questions with mark schemes'],
      ['MCQ', 'mcq', 'Multiple choice by chapter'],
    ],
  },
]

function Login() {
  const { signIn } = useApp()
  const [who, setWho] = useState(TEACHERS[0].key)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn({ email: teacherEmail(who), password })
    } catch (err) {
      setError(err.message || 'That password does not match.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="font-mono text-xs uppercase tracking-wide text-muted">// Teacher portal</p>
      <h1 className="mt-1 text-3xl font-semibold text-fg">Sign in</h1>
      <p className="readable mt-2 text-sm text-muted">Choose your name and enter the password you were given.</p>
      <form onSubmit={submit} className="card mt-6 space-y-4 p-5">
        <div>
          <span className="mb-2 block text-sm font-semibold text-fg">Name</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Teacher">
            {TEACHERS.map((t) => (
              <Chip key={t.key} selected={who === t.key} onClick={() => setWho(t.key)}>
                {t.name}
              </Chip>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-fg">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-fg outline-none transition-colors focus:border-brand"
          />
        </label>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={busy || !password}>
          {busy ? 'Signing in' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}

function Hub({ name }) {
  const { signOut } = useApp()
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">// Teacher portal</p>
          <h1 className="mt-1 text-3xl font-semibold text-fg">Welcome, {name}</h1>
          <p className="readable mt-2 text-sm text-muted">
            Everything a student sees, by subject. Open any link to look through it. Looking around does not change anything.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>

      <div className="mt-8 space-y-8">
        {SUBJECTS.map((s) => (
          <section key={s.slug}>
            <div className="flex items-baseline gap-3 border-b border-line pb-2">
              <h2 className="text-xl font-semibold text-fg">{s.name}</h2>
              <span className="font-mono text-xs text-muted">{s.note}</span>
            </div>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {s.items.map(([label, slug, desc]) => (
                <li key={slug}>
                  <Link to={`/study/${s.slug}/${slug}`} className="card card-lift block h-full p-4 transition-colors hover:border-brand">
                    <p className="font-semibold text-fg">{label}</p>
                    <p className="mt-1 text-sm text-muted">{desc}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

export default function Teachers() {
  const { account } = useApp()

  // keep this page out of search results
  useEffect(() => {
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex, nofollow'
    document.head.appendChild(m)
    return () => m.remove()
  }, [])

  const allowed = account && (isTeacher(account.email) || isOwner(account.email))
  return (
    <Section width="default" className="pt-10 pb-28">
      {allowed ? <Hub name={account.name} /> : <Login />}
    </Section>
  )
}
