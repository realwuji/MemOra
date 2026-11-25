import { StreamLanguage } from '@codemirror/language'

/*
  Syntax highlighting for OCR pseudocode in the editor. The keyword lists come
  from OCR's own definition, the "Pseudocode Guide" for H046/H446.
*/
export const PSEUDOCODE_KEYWORDS = []
export const PSEUDOCODE_BUILTINS = []

const keywords = new Set(PSEUDOCODE_KEYWORDS)

export const pseudocodeLanguage = StreamLanguage.define({
  name: 'pseudocode',
  token(stream) {
    if (stream.eatSpace()) return null
    if (stream.match('//')) {
      stream.skipToEnd()
      return 'comment'
    }
    if (stream.match(/^"(?:[^"\\]|\\.)*"?/)) return 'string'
    if (stream.match(/^\d+(?:\.\d+)?/)) return 'number'
    if (stream.match(/^[A-Za-z_][A-Za-z0-9_]*/)) return keywords.has(stream.current()) ? 'keyword' : null
    stream.next()
    return null
  },
})
