import { useLayoutEffect } from 'react'

import { MOBILE_ART_PARTICLE_TRACKS } from './artBackgroundParticleTracks.js'

export { MOBILE_ART_PARTICLE_TRACKS, MOBILE_ART_PARTICLE_TRACKS as SIGNAL_TRACKS }

export const VERTICAL_ART_SRC = '/achtergrond-verticaal-minder-chaos.svg'

/** Set `true` to debug particle paths (mobile + desktop landings). */
export const PARTICLE_DEBUG = false

/** Seconds: totale intro; het laatste deeltje is dan op volle sterkte + beweging. */
export const PARTICLE_INTRO_RAMP_SEC = 5

/**
 * Per deeltje: hoelang zijn eigen zichtbaarheid lineair 0 → 1 loopt.
 * Startmomenten worden over (RAMP − EACH) verdeeld zodat alles binnen RAMP klaar is.
 */
export const PARTICLE_INTRO_EACH_SEC = 1.85

/** Linear factor 0 → 1 over {@link PARTICLE_INTRO_RAMP_SEC} seconds. */
export function particleIntroLinear(tWallSec) {
  const s = PARTICLE_INTRO_RAMP_SEC
  if (s <= 0) return 1
  return Math.min(1, Math.max(0, tWallSec / s))
}

function introStaggerEachAndMaxDelay() {
  const total = Math.max(0.01, PARTICLE_INTRO_RAMP_SEC)
  const each = Math.min(Math.max(0.2, PARTICLE_INTRO_EACH_SEC), total * 0.55)
  const maxDelay = Math.max(0, total - each)
  return { each, maxDelay }
}

/** Verspreid starttijden (niet op volgorde van index = rustiger dan lineair). */
function staggerDelaySec(index, count, maxDelay) {
  if (count <= 1 || maxDelay <= 0) return 0
  const u = ((index + 0.37) * 0.618033988749895) % 1
  return u * maxDelay
}

/** Zicht-factor 0→1 per index; niet alle deeltjes tegelijk. */
export function staggeredParticleIntro(tWallSec, index, count) {
  if (PARTICLE_DEBUG) return 1
  if (count <= 0) return 1
  if (count === 1) return particleIntroLinear(tWallSec)
  const { each, maxDelay } = introStaggerEachAndMaxDelay()
  const delay = staggerDelaySec(index, count, maxDelay)
  return Math.min(1, Math.max(0, (tWallSec - delay) / each))
}

/** Pad-tijd per deeltje: stil tot intro van dat deeltje vol is, daarna normale loop. */
export function staggeredParticlePathTime(tWallSec, index, count) {
  if (PARTICLE_DEBUG) return tWallSec
  if (count <= 0) return tWallSec
  if (count === 1) return particlePathTimeSec(tWallSec)
  const { each, maxDelay } = introStaggerEachAndMaxDelay()
  const delay = staggerDelaySec(index, count, maxDelay)
  const motionStart = delay + each
  return Math.max(0, tWallSec - motionStart)
}

/**
 * Tijd langs het pad: tijdens de intro-ramp bevroren (geen zichtbare beweging),
 * daarna vloeiend door zonder sprong (tWall − ramp).
 */
export function particlePathTimeSec(tWallSec) {
  if (PARTICLE_DEBUG) return tWallSec
  const ramp = PARTICLE_INTRO_RAMP_SEC
  return tWallSec < ramp ? 0 : tWallSec - ramp
}

function smoothstep01(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function cycleEdgeFade(u) {
  const fadeIn = 0.08
  const fadeOut = 0.92
  if (u < fadeIn) return smoothstep01(u / fadeIn)
  if (u > fadeOut) return smoothstep01((1 - u) / (1 - fadeOut))
  return 1
}

const TRANSFORM_Y0 = 420
const TRANSFORM_Y1 = 720

function transformBandStrength(y) {
  if (y < TRANSFORM_Y0 || y > TRANSFORM_Y1) return 0
  const m = (TRANSFORM_Y0 + TRANSFORM_Y1) / 2
  const half = (TRANSFORM_Y1 - TRANSFORM_Y0) / 2
  const d = 1 - Math.min(1, Math.abs(y - m) / half)
  return smoothstep01(d)
}

/**
 * Bolletjes volgen open paden uit de achtergrond-SVG (952×1330), strikt vooruit: boven → beneden.
 * @param {{ pathRefs: import('react').MutableRefObject<Array<SVGPathElement|null>>, circleRefs: import('react').MutableRefObject<Array<SVGCircleElement|null>>, pathLens: import('react').MutableRefObject<Array<number|undefined>>, svgIdsPrefix?: string }} opts
 */
export function useVerticalLandingParticles({ pathRefs, circleRefs, pathLens, svgIdsPrefix = 'ml' }) {
  useLayoutEffect(() => {
    if (!PARTICLE_DEBUG) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (reduce.matches) return undefined
    }

    const baseOpacity = {
      chaos: 0.46,
      mid: 0.52,
      structure: 0.44,
    }

    const trackCount = MOBILE_ART_PARTICLE_TRACKS.length

    let raf = 0
    let cancelled = false
    const t0 = performance.now()

    if (!PARTICLE_DEBUG) {
      MOBILE_ART_PARTICLE_TRACKS.forEach((_, i) => {
        const dot = circleRefs.current[i]
        if (dot) dot.style.opacity = '0'
      })
    }

    const tick = (now) => {
      if (cancelled) return
      const tWall = (now - t0) / 1000

      MOBILE_ART_PARTICLE_TRACKS.forEach((g, i) => {
        const pathEl = pathRefs.current[i]
        const dot = circleRefs.current[i]
        if (!pathEl || !dot) return
        let len = pathLens.current[i]
        if (len == null || len < 2) {
          len = pathEl.getTotalLength()
          pathLens.current[i] = len
        }
        if (len < 2) return

        const tPath = staggeredParticlePathTime(tWall, i, trackCount)
        const introDot = staggeredParticleIntro(tWall, i, trackCount)

        const dur = g.durationSec
        const del = g.delaySec
        let u = ((tPath + del) % dur) / dur
        if (u < 0) u += 1

        const dist = Math.min(Math.max(u * len, 0), len)
        const pt = pathEl.getPointAtLength(dist)
        dot.setAttribute('cx', String(pt.x))
        dot.setAttribute('cy', String(pt.y))

        if (PARTICLE_DEBUG) {
          dot.style.opacity = '1'
          dot.setAttribute('r', '6')
          dot.setAttribute('fill', i % 2 === 0 ? '#ff1744' : '#00e5ff')
          dot.removeAttribute('filter')
          return
        }

        const band = transformBandStrength(pt.y)
        const edge = cycleEdgeFade(u)
        const base = baseOpacity[g.zone] ?? 0.48
        const twinkle = 0.9 + 0.1 * Math.sin(tWall * 1.5 + i * 1.2)
        const opacity = Math.min(0.88, base * edge * (1 + 0.35 * band) * twinkle * introDot)
        dot.style.opacity = String(opacity)

        const r = g.r * (1 + 0.12 * band) * (0.96 + 0.06 * Math.sin(tWall * 1.1 + i * 1.05))
        dot.setAttribute('r', String(r))
        if (introDot < 0.02) dot.removeAttribute('filter')
        else dot.setAttribute('filter', `url(#${svgIdsPrefix}ParticleGlow)`)
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      pathLens.current = []
    }
  }, [pathRefs, circleRefs, pathLens, svgIdsPrefix])
}
