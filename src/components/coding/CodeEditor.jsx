import { useEffect, useRef } from 'react'
import { Compartment, EditorState, StateEffect, StateField } from '@codemirror/state'
import { Decoration, EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab, temporarilySetTabFocusMode } from '@codemirror/commands'
import { HighlightStyle, bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { python } from '@codemirror/lang-python'
import { tags as t } from '@lezer/highlight'
import { pseudocodeLanguage } from '@/lib/coding/pseudocode/language'

/*
  The code editor (CodeMirror 6). Used for the free editor and for every coding
  question's answer.

    <CodeEditor value={code} onChange={setCode} language="python" onRun={run} />

  - language: 'python' | 'pseudocode' (OCR pseudocode, as defined in OCR's
    Pseudocode Guide for H046/H446, the notation the papers print).
  - examMode: the real exam is on paper, so this takes away what paper does not
    have: no brackets closed for you and no automatic indent after a line ends in
    a colon or a keyword. Selecting and typing work as normal.
  - traceLine / errorLine: a line to mark as "being executed" (the step-through)
    and a line to mark as the one that failed.
  - It is controlled from outside only when `value` changes to something other
    than what the editor already holds (a new question, a loaded snippet), so
    typing never fights the cursor.

  All colours come from the theme tokens, so it follows dark, cream and high
  contrast. Code is always set in the monospace face, in every reading font: a
  proportional face would break the indentation that Python's meaning depends on.
*/

const markLine = Decoration.line({ class: 'cm-trace-line' })
const failLine = Decoration.line({ class: 'cm-error-line' })
const setMarks = StateEffect.define()
const marks = StateField.define({
  create: () => Decoration.none,
  update(deco, tr) {
    for (const e of tr.effects) {
      if (e.is(setMarks)) {
        const { trace, error } = e.value
        const ranges = []
        const add = (n, d) => {
          if (n >= 1 && n <= tr.state.doc.lines) ranges.push(d.range(tr.state.doc.line(n).from))
        }
        if (error) add(error, failLine)
        if (trace && trace !== error) add(trace, markLine)
        return Decoration.set(ranges, true)
      }
    }
    return deco.map(tr.changes)
  },
  provide: (f) => EditorView.decorations.from(f),
})

// Tokens only; no hard-coded colours. Keywords carry weight, strings and numbers
// carry a study accent, so the meaning survives in high contrast.
const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword], color: 'var(--fg)', fontWeight: '700' },
  { tag: [t.string, t.special(t.string)], color: 'var(--quiz)' },
  { tag: [t.number, t.bool, t.null], color: 'var(--paper)' },
  { tag: [t.comment, t.lineComment], color: 'var(--muted)', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.definition(t.variableName)], color: 'var(--flash)' },
  { tag: [t.className, t.typeName], color: 'var(--flash)', fontWeight: '600' },
  { tag: [t.operator, t.punctuation, t.bracket], color: 'var(--muted)' },
  { tag: t.invalid, color: 'var(--danger)' },
])

const theme = EditorView.theme({
  '&': { color: 'var(--fg)', backgroundColor: 'transparent', fontSize: '0.92rem', height: '100%' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': { fontFamily: 'var(--font-mono-ui), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', lineHeight: '1.65', overflow: 'auto' },
  '.cm-content': { caretColor: 'var(--fg)', padding: '0.7rem 0' },
  '.cm-line': { padding: '0 0.9rem 0 0.4rem' },
  '.cm-gutters': { backgroundColor: 'transparent', color: 'var(--muted)', border: 'none', paddingLeft: '0.5rem' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 0.65rem 0 0.2rem', minWidth: '2rem', fontSize: '0.78rem' },
  '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--fg) 5%, transparent)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--fg)' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--fg)', borderLeftWidth: '2px' },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground': { backgroundColor: 'color-mix(in srgb, var(--brand) 26%, transparent)' },
  '.cm-matchingBracket': { backgroundColor: 'color-mix(in srgb, var(--fg) 14%, transparent)', outline: '1px solid var(--line)' },
  '.cm-nonmatchingBracket': { color: 'var(--danger)' },
  '.cm-trace-line': { backgroundColor: 'color-mix(in srgb, var(--brand) 18%, transparent)', boxShadow: 'inset 3px 0 0 var(--brand)' },
  '.cm-error-line': { backgroundColor: 'color-mix(in srgb, var(--danger) 16%, transparent)', boxShadow: 'inset 3px 0 0 var(--danger)' },
})

const languageExtension = (language) => (language === 'pseudocode' ? pseudocodeLanguage : python())

export default function CodeEditor({
  value,
  onChange,
  language = 'python',
  examMode = false,
  readOnly = false,
  traceLine = null,
  errorLine = null,
  onRun,
  ariaLabel = 'Code editor',
  className = '',
}) {
  const host = useRef(null)
  const view = useRef(null)
  const langSlot = useRef(new Compartment())
  const exam = useRef(new Compartment())
  const readonly = useRef(new Compartment())
  const callbacks = useRef({ onChange, onRun })
  callbacks.current = { onChange, onRun }

  // Everything that depends only on the exam-style switch.
  const examExtensions = (on) => (on ? [indentUnit.of('    ')] : [indentOnInput(), bracketMatching(), indentUnit.of('    ')])

  useEffect(() => {
    const state = EditorState.create({
      doc: value ?? '',
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        drawSelection(),
        marks,
        syntaxHighlighting(highlight),
        theme,
        langSlot.current.of(languageExtension(language)),
        exam.current.of(examExtensions(examMode)),
        readonly.current.of([EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)]),
        EditorView.contentAttributes.of({ 'aria-label': ariaLabel, spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off' }),
        keymap.of([
          { key: 'Mod-Enter', run: () => { callbacks.current.onRun?.(); return true } },
          { key: 'Escape', run: temporarilySetTabFocusMode },
          indentWithTab,
          ...historyKeymap,
          ...defaultKeymap,
        ]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) callbacks.current.onChange?.(u.state.doc.toString())
        }),
      ],
    })
    view.current = new EditorView({ state, parent: host.current })
    return () => {
      view.current?.destroy()
      view.current = null
    }
    // The editor is created once; props below are applied by their own effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // A new document from outside (a different question, a loaded snippet).
  useEffect(() => {
    const v = view.current
    if (!v) return
    const current = v.state.doc.toString()
    if ((value ?? '') !== current) v.dispatch({ changes: { from: 0, to: current.length, insert: value ?? '' } })
  }, [value])

  useEffect(() => {
    view.current?.dispatch({ effects: langSlot.current.reconfigure(languageExtension(language)) })
  }, [language])

  useEffect(() => {
    view.current?.dispatch({ effects: exam.current.reconfigure(examExtensions(examMode)) })
  }, [examMode])

  useEffect(() => {
    view.current?.dispatch({ effects: readonly.current.reconfigure([EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)]) })
  }, [readOnly])

  useEffect(() => {
    const v = view.current
    if (!v) return
    v.dispatch({ effects: setMarks.of({ trace: traceLine, error: errorLine }) })
    const line = traceLine || errorLine
    if (line && line >= 1 && line <= v.state.doc.lines) {
      v.dispatch({ effects: EditorView.scrollIntoView(v.state.doc.line(line).from, { y: 'nearest', yMargin: 40 }) })
    }
  }, [traceLine, errorLine])

  return <div ref={host} className={`code-editor ${className}`} />
}
