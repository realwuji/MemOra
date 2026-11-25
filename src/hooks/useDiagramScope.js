import { useState } from 'react'

/*
  Micro, Macro or All, for the diagram bank and for diagram revision. It is held for
  the visit only: coming back to either screen starts on All again, so the last
  half you looked at never hides the rest without you choosing it.
*/
export default function useDiagramScope() {
  return useState('All')
}
