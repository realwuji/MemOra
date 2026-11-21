/*
  Audio reactivity: lets the server background follow the music.

  WHAT IS POSSIBLE, AND WHAT IS NOT. The music player is Spotify's embedded
  iFrame player: a separate web app on another origin, with DRM-protected
  audio. A page cannot read that audio (Web Audio cannot tap a cross-origin
  iframe or an encrypted stream), and Spotify's own beat/audio-analysis API is
  closed to new apps. The embed only reports play, pause and the playback
  position. So there is no way to "just read the beat" from the player.

  What does work is listening to the sound the browser is already making, with
  the user's explicit permission:

    - 'tab'  : getDisplayMedia on this tab, audio only. The browser asks the
               user to share the tab and tick "Share tab audio". This captures
               exactly what is playing, including the embed, with no echo or
               room noise.
    - 'mic'  : the microphone, which hears the speakers. Works for anything,
               but picks up the room too.

  Either way the audio is analysed in this browser tab (a Web Audio
  AnalyserNode) and discarded. It is never recorded, stored or sent anywhere.
  Nothing starts without a click, and nothing runs unless sync is on.

  WHAT IT PRODUCES, every animation frame while running:
    level    overall loudness, 0..1
    bass     30-160 Hz, 0..1
    mid      160-2000 Hz, 0..1
    treble   2000-9000 Hz, 0..1
    beat     1 on a detected kick, then decays toward 0
    spectrum SPECTRUM_BINS values, 0..1, log-spaced from 40 Hz to 12 kHz (low
             notes on the left, high on the right). This is what draws the
             equalizer bars in the background.

  Each band is normalised against its own recent peak, so quiet and loud tracks
  behave alike. A beat is a jump in bass energy over its running average, with
  a minimum gap so it cannot fire faster than about 6 times a second.
*/

const frameListeners = new Set()
const stateListeners = new Set()

let state = { source: null, error: null, playing: false }
let ctx = null
let stream = null
let analyser = null
let raf = 0

export const SPECTRUM_BINS = 64
const ZERO = { level: 0, bass: 0, mid: 0, treble: 0, beat: 0, spectrum: new Array(SPECTRUM_BINS).fill(0) }

const emitState = () => stateListeners.forEach((fn) => fn(state))
const setState = (patch) => {
  state = { ...state, ...patch }
  emitState()
}

export const getAudioState = () => state
export function subscribeAudioState(fn) {
  stateListeners.add(fn)
  return () => stateListeners.delete(fn)
}
export function onAudioFrame(fn) {
  frameListeners.add(fn)
  return () => frameListeners.delete(fn)
}

// The player reports play/pause here (see FocusMusic). Kept in the state so UI
// can say "playing - turn sync on to follow the beat".
export function setMusicPlaying(playing) {
  if (state.playing !== playing) setState({ playing })
}

export function pushFrame(frame) {
  frameListeners.forEach((fn) => fn(frame))
}

function teardown() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  stream?.getTracks().forEach((t) => t.stop())
  stream = null
  analyser = null
  if (ctx) ctx.close().catch(() => {})
  ctx = null
}

export function stopAudio() {
  teardown()
  setState({ source: null, error: null })
  pushFrame(ZERO)
}

export async function startAudio(kind) {
  teardown()
  setState({ error: null })

  try {
    if (kind === 'tab') {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // required by the API; dropped right below, we only want the sound
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        preferCurrentTab: true,
        selfBrowserSurface: 'include',
        systemAudio: 'include',
      })
      if (stream.getAudioTracks().length === 0) {
        teardown()
        setState({ source: null, error: 'No audio was shared. Choose this tab again and tick "Share tab audio".' })
        return
      }
      stream.getVideoTracks().forEach((t) => t.stop())
    } else {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
    }
  } catch (e) {
    teardown()
    const denied = e && (e.name === 'NotAllowedError' || e.name === 'SecurityError')
    setState({
      source: null,
      error: denied ? 'Permission was not given, so nothing is being listened to.' : 'Could not start listening on this device.',
    })
    return
  }

  const track = stream.getAudioTracks()[0]
  track.addEventListener('ended', stopAudio)

  const AudioCtx = window.AudioContext || window.webkitAudioContext
  ctx = new AudioCtx()
  analyser = ctx.createAnalyser()
  analyser.fftSize = 2048 // finer low-frequency resolution for the spectrum
  analyser.smoothingTimeConstant = 0.55
  // Analysis only: the source is NOT connected to ctx.destination, so nothing
  // is played back (that would double the music or cause feedback).
  ctx.createMediaStreamSource(stream).connect(analyser)

  const bins = new Uint8Array(analyser.frequencyBinCount)
  const hzPerBin = ctx.sampleRate / analyser.fftSize
  const range = (lo, hi) => [Math.max(1, Math.round(lo / hzPerBin)), Math.min(bins.length - 1, Math.round(hi / hzPerBin))]
  const bassR = range(30, 160)
  const midR = range(160, 2000)
  const trebR = range(2000, 9000)
  const mean = ([a, b]) => {
    let sum = 0
    for (let i = a; i <= b; i += 1) sum += bins[i]
    return sum / ((b - a + 1) * 255)
  }

  // Spectrum: SPECTRUM_BINS log-spaced bands from 40 Hz to 12 kHz. Each band
  // averages the FFT bins that fall inside it (at least one), is scaled against
  // one shared running peak so the shape of the music is kept, then smoothed
  // per band with a fast attack and slow release so the bars rise quickly and
  // fall like a real level meter.
  const specRanges = Array.from({ length: SPECTRUM_BINS }, (_, i) => {
    const lo = 40 * Math.pow(12000 / 40, i / SPECTRUM_BINS)
    const hi = 40 * Math.pow(12000 / 40, (i + 1) / SPECTRUM_BINS)
    const a = Math.min(bins.length - 2, Math.max(1, Math.round(lo / hzPerBin)))
    return [a, Math.min(bins.length - 1, Math.max(a, Math.round(hi / hzPerBin)))]
  })
  const spec = new Array(SPECTRUM_BINS).fill(0)
  let specPeak = 0.2

  // Per-band running peak, so each band is scaled to 0..1 against its own
  // recent maximum, and a slow average of bass for beat detection.
  const peak = { bass: 0.2, mid: 0.2, treble: 0.2 }
  let level = 0
  let bassAvg = 0
  let beat = 0
  let lastBeat = 0

  setState({ source: kind, error: null })

  const loop = (now) => {
    if (!analyser) return
    analyser.getByteFrequencyData(bins)

    const raw = { bass: mean(bassR), mid: mean(midR), treble: mean(trebR) }
    const out = {}
    for (const k of ['bass', 'mid', 'treble']) {
      peak[k] = Math.max(raw[k], peak[k] * 0.995, 0.05)
      out[k] = Math.min(1, raw[k] / peak[k])
    }

    const loud = (raw.bass * 1.2 + raw.mid + raw.treble * 0.6) / 2.8
    level += (loud - level) * (loud > level ? 0.5 : 0.12) // quick attack, slower release

    bassAvg = bassAvg * 0.95 + out.bass * 0.05
    if (out.bass > bassAvg * 1.3 && out.bass > 0.3 && now - lastBeat > 160) {
      beat = 1
      lastBeat = now
    }
    beat *= 0.87

    let frameMax = 0
    const rawSpec = specRanges.map((r) => {
      const v = mean(r)
      if (v > frameMax) frameMax = v
      return v
    })
    specPeak = Math.max(frameMax, specPeak * 0.994, 0.08)
    for (let i = 0; i < SPECTRUM_BINS; i += 1) {
      const v = Math.pow(Math.min(1, rawSpec[i] / specPeak), 0.9)
      spec[i] += (v - spec[i]) * (v > spec[i] ? 0.6 : 0.13)
    }

    pushFrame({
      level: Math.min(1, level * 2.2),
      bass: out.bass,
      mid: out.mid,
      treble: out.treble,
      beat,
      spectrum: spec.slice(),
    })
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
}

// Development only: lets a test drive the background with synthetic frames, so
// the visuals can be checked without microphone or tab-capture permission.
if (import.meta.env.DEV) {
  window.__audioReactive = { pushFrame, setActive: (on) => setState({ source: on ? 'test' : null }) }
}
