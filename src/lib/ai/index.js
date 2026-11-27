import { createAI } from './client'
import * as features from './features'

/*
  The app-wide AI entry point. Usage:

    import { ai, aiConfigured, generateFlashcards, markAnswer, explainMistake } from '@/lib/ai'
    if (aiConfigured()) { const cards = await generateFlashcards('Supply and demand', 8) }

  See client.js for configuration and error codes, features.js for what can be asked.
*/
export const ai = createAI({ env: import.meta.env })

export const aiConfigured = () => ai.configured()
export const generateFlashcards = (topic, count) => features.generateFlashcards(ai, topic, count)
export const markAnswer = (input) => features.markAnswer(ai, input)
export const explainMistake = (input) => features.explainMistake(ai, input)

// Friendly text for an error code from any feature (keeps every screen's wording the same).
export const aiErrorText = (code) =>
  code === 'quota'
    ? 'The AI has hit its usage limit for now. Try again later.'
    : code === 'no-key'
      ? 'AI is not set up in this build yet.'
      : code === 'timeout' || code === 'network'
        ? 'Could not reach the AI. Check your connection and try again.'
        : 'The AI could not do that just now. Please try again in a moment.'
