/*
  The one place Memoraa talks to a language model.

  Provider: Mistral (default model mistral-large-latest). Its chat API is OpenAI-compatible, so the
  request shape below also works against any compatible endpoint if the provider is ever swapped.
  Nothing else in the app should call fetch for a model; features live in ./features.js and go
  through this client, so keys, timeouts, error codes and the proxy option stay in one file.

  Configuration (Vite env, see .env.example):
    VITE_MISTRAL_API_KEY   the key. Without it every feature fails with 'no-key' and the UI says so.
    VITE_MISTRAL_MODEL     optional, defaults to mistral-large-latest.
    VITE_AI_PROXY_URL      optional. When set, requests go to this URL (a small backend that holds the
                           key and forwards to Mistral) and no key is sent from the browser. This is the
                           way to ship for real: a VITE_ key is bundled into the page and is public.

  Errors are Error objects with a short code in .message (the UI maps them to friendly text):
    'no-key' | 'no-input' | 'quota' | 'timeout' | 'network' | 'http-###' | 'bad-response' | 'empty'

  Privacy: callers pass only the text a feature needs (a topic, a question, an answer the student chose to
  send). Never pass a name, email, account or stored profile.
*/

export const MISTRAL_ENDPOINT = 'https://api.mistral.ai/v1/chat/completions'
export const DEFAULT_MODEL = 'mistral-large-latest'
const TIMEOUT_MS = 30000

export const readConfig = (env = {}) => ({
  key: env.VITE_MISTRAL_API_KEY || '',
  model: env.VITE_MISTRAL_MODEL || DEFAULT_MODEL,
  proxyUrl: env.VITE_AI_PROXY_URL || '',
})

// Models sometimes wrap JSON in a code fence even when told not to.
export const parseJSON = (text) => {
  const raw = String(text ?? '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error('bad-response')
  }
}

/*
  createAI({ env, fetch }) returns { configured, chatJSON }. The app uses the default instance from
  ./index.js; tests build their own with a fake fetch and env.
*/
export function createAI({ env = {}, fetchImpl } = {}) {
  const cfg = readConfig(env)
  const doFetch = fetchImpl || ((...a) => globalThis.fetch(...a))
  const configured = () => Boolean(cfg.key || cfg.proxyUrl)

  // Ask for a JSON object and return it parsed. `system` sets the role, `user` is the task.
  async function chatJSON({ system, user, temperature = 0.4, maxTokens = 1200 }) {
    if (!configured()) throw new Error('no-key')
    const headers = { 'Content-Type': 'application/json' }
    if (!cfg.proxyUrl) headers.Authorization = `Bearer ${cfg.key}`

    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS)
    let res
    try {
      res = await doFetch(cfg.proxyUrl || MISTRAL_ENDPOINT, {
        method: 'POST',
        headers,
        signal: ctl.signal,
        body: JSON.stringify({
          model: cfg.model,
          messages: [
            { role: 'system', content: `${system} Reply with valid JSON only, no prose.` },
            { role: 'user', content: user },
          ],
          response_format: { type: 'json_object' },
          temperature,
          max_tokens: maxTokens,
        }),
      })
    } catch (e) {
      throw new Error(e?.name === 'AbortError' ? 'timeout' : 'network')
    } finally {
      clearTimeout(timer)
    }
    if (!res.ok) throw new Error(res.status === 429 ? 'quota' : `http-${res.status}`)
    const data = await res.json().catch(() => null)
    return parseJSON(data?.choices?.[0]?.message?.content)
  }

  return { configured, chatJSON, model: cfg.model }
}
