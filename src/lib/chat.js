/*
  Kept so existing imports keep working. The AI layer now lives in src/lib/ai/ (one client, one place
  for keys, timeouts and errors, plus the features). New code should import from '@/lib/ai'.
*/
export { aiConfigured as chatConfigured, generateFlashcards } from '@/lib/ai'
