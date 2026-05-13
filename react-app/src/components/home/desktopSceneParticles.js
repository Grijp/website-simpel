import { useLayoutEffect } from 'react'

import { DESKTOP_ART_PARTICLE_TRACKS } from './artBackgroundParticleTracks.js'
import { PARTICLE_DEBUG, staggeredParticleIntro, staggeredParticlePathTime } from './verticalLandingParticles.js'

// Legacy names: some files / HMR may still import DESKTOP_PARTICLE_TRACKS or DESKTOP_SCENE_VIEWBOX.
export {
  ART_BG_VIEWBOX,
  DESKTOP_ART_PARTICLE_TRACKS,
  DESKTOP_ART_PARTICLE_TRACKS as DESKTOP_PARTICLE_TRACKS,
  ART_BG_VIEWBOX as DESKTOP_SCENE_VIEWBOX,
} from './artBackgroundParticleTracks.js'

function smoothstep01(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function cycleEdgeFade(u) {
  const fadeIn = 0.05
  const fadeOut = 0.94
  if (u < fadeIn) return smoothstep01(u / fadeIn)
  if (u > fadeOut) return smoothstep01((1 - u) / (1 - fadeOut))
  return 1
}

/**
 * @param {{ pathRefs: import('react').MutableRefObject<Array<SVGPathElement|null>>, circleRefs: import('react').MutableRefObject<Array<SVGCircleElement|null>>, pathLens: import('react').MutableRefObject<Array<number|undefined>> }} opts
 */
export function useDesktopSceneParticles({ pathRefs, circleRefs, pathLens }) {
  useLayoutEffect(() => {
    if (!PARTICLE_DEBUG) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (reduce.matches) return undefined
    }

    const baseOpacity = {
      chaos: 0.52,
      mid: 0.46,
      structure: 0.5,
    }

    const trackCount = DESKTOP_ART_PARTICLE_TRACKS.length

    let raf = 0
    let cancelled = false
    const t0 = performance.now()

    if (!PARTICLE_DEBUG) {
      DESKTOP_ART_PARTICLE_TRACKS.forEach((_, i) => {
        const dot = circleRefs.current[i]
        if (dot) dot.style.opacity = '0'
      })
    }

    const tick = (now) => {
      if (cancelled) return
      const tWall = (now - t0) / 1000

      DESKTOP_ART_PARTICLE_TRACKS.forEach((g, i) => {
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

        const edge = cycleEdgeFade(u)
        const base = baseOpacity[g.zone] ?? 0.48
        const breathe = 0.88 + 0.12 * Math.sin(tWall * 1.05 + i * 0.95)
        const opacity = Math.min(0.9, base * edge * breathe * introDot)
        dot.style.opacity = String(opacity)

        const r = g.r * (0.94 + 0.1 * Math.sin(tWall * 0.8 + i * 0.75))
        dot.setAttribute('r', String(r))
        if (introDot < 0.02) dot.removeAttribute('filter')
        else dot.setAttribute('filter', 'url(#dlSceneParticleGlow)')
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      pathLens.current = []
    }
  }, [pathRefs, circleRefs, pathLens])
}
