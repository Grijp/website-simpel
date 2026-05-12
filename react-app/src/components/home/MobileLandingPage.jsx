import { useEffect, useRef, useState } from 'react'
import SiteHeader from '../SiteHeader.jsx'
import FitCheckModal from '../FitCheckModal.jsx'
import { MobileStickyCta } from './HomeSections.jsx'
import './MobileLandingPage.css'

const VERTICAL_ART_SRC = '/achtergrond-verticaal-minder-chaos.svg'

/**
 * Set `true` to verify the particle SVG is mounted, sized, and above veil (bright dots, no fade, no filter).
 * Set back to `false` for production.
 */
const PARTICLE_DEBUG = false

/**
 * Same stroke `d` as the vertical background SVG (minder-chaos variant). Thirteen base paths × `SIGNAL_COPIES` staggered dots.
 * Lower `SIGNAL_COPIES` first if the scene feels too busy (easiest knob).
 */
const SIGNAL_COPIES = 2
const SIGNAL_SPEED = 5

const BASE_SIGNAL_TRACKS = [
  {
    id: 'sigChaosL',
    d: 'M237.744 -47.5C111.077 79.1667 111.077 190 237.744 285C364.41 380 348.577 443.333 190.244 475C31.9104 506.667 126.91 570 475.244 665',
    startCx: 237.744,
    startCy: -47.5,
    delaySec: -8,
    durationSec: 72,
    r: 2.75,
    zone: 'chaos',
  },
  {
    id: 'sigChaosR',
    d: 'M713.5 -47.5C840.167 79.1667 840.167 190 713.5 285C586.833 380 602.667 443.333 761 475C919.333 506.667 824.333 570 476 665',
    startCx: 713.5,
    startCy: -47.5,
    delaySec: -26,
    durationSec: 76,
    r: 2.65,
    zone: 'chaos',
  },
  {
    id: 'sigChaosWideL',
    d: 'M0 47.5C285 95 95 475 456 646',
    startCx: 0,
    startCy: 47.5,
    delaySec: -14,
    durationSec: 68,
    r: 2.55,
    zone: 'chaos',
  },
  {
    id: 'sigChaosWideR',
    d: 'M951.04 47.5C666.04 95 856.04 475 495.04 646',
    startCx: 951.04,
    startCy: 47.5,
    delaySec: -31,
    durationSec: 70,
    r: 2.55,
    zone: 'chaos',
  },
  {
    id: 'sigTowerL',
    d: 'M95.2 0C380.2 285 285.2 570 475.2 665',
    startCx: 95.2,
    startCy: 0,
    delaySec: -3,
    durationSec: 74,
    r: 2.5,
    zone: 'chaos',
  },
  {
    id: 'sigTowerR',
    d: 'M856 0C571 285 666 570 476 665',
    startCx: 856,
    startCy: 0,
    delaySec: -20,
    durationSec: 74,
    r: 2.5,
    zone: 'chaos',
  },
  {
    id: 'sigMidL',
    d: 'M333.14 95L304.64 142.5L361.64 190L314.14 237.5L380.64 285L342.64 332.5L399.64 380L371.14 427.5L428.14 475L409.14 522.5L456.64 570L447.14 617.5L475.64 665',
    startCx: 333.14,
    startCy: 95,
    delaySec: -4,
    durationSec: 64,
    r: 2.55,
    zone: 'mid',
  },
  {
    id: 'sigMidR',
    d: 'M618.5 95L647 142.5L590 190L637.5 237.5L571 285L609 332.5L552 380L580.5 427.5L523.5 475L542.5 522.5L495 570L504.5 617.5L476 665',
    startCx: 618.5,
    startCy: 95,
    delaySec: -18,
    durationSec: 66,
    r: 2.55,
    zone: 'mid',
  },
  {
    id: 'sigMidZigL2',
    d: 'M237.92 190L199.92 237.5L266.42 285L228.42 332.5L294.92 380L275.92 427.5L342.42 475L332.92 522.5L399.42 570L418.42 617.5L475.42 665',
    startCx: 237.92,
    startCy: 190,
    delaySec: -9,
    durationSec: 62,
    r: 2.45,
    zone: 'mid',
  },
  {
    id: 'sigMidZigR2',
    d: 'M713.5 190L751.5 237.5L685 285L723 332.5L656.5 380L675.5 427.5L609 475L618.5 522.5L552 570L533 617.5L476 665',
    startCx: 713.5,
    startCy: 190,
    delaySec: -24,
    durationSec: 62,
    r: 2.45,
    zone: 'mid',
  },
  {
    id: 'sigStruct',
    d: 'M476 665L483.6 997.5L514 1027.9V1216L571 1273H666',
    startCx: 476,
    startCy: 665,
    delaySec: -2,
    durationSec: 58,
    r: 2.45,
    zone: 'structure',
  },
  {
    id: 'sigStructL',
    d: 'M475.52 665L466.02 741L447.02 760V874H380.52L361.52 893V1064H266.52L247.52 1083V1235',
    startCx: 475.52,
    startCy: 665,
    delaySec: -11,
    durationSec: 60,
    r: 2.35,
    zone: 'structure',
  },
  {
    id: 'sigStructR',
    d: 'M476 665L485.5 741L504.5 760V874H571L590 893V1064H685L704 1083V1235',
    startCx: 476,
    startCy: 665,
    delaySec: -35,
    durationSec: 60,
    r: 2.35,
    zone: 'structure',
  },
]

const SIGNAL_TRACKS = BASE_SIGNAL_TRACKS.flatMap((g, idx) => {
  const dur = Math.max(5.5, g.durationSec / SIGNAL_SPEED)
  return Array.from({ length: SIGNAL_COPIES }, (_, k) => ({
    ...g,
    id: `${g.id}__${k}`,
    durationSec: dur,
    delaySec: g.delaySec - k * dur * 0.82 - idx * 0.06,
    r: g.r * 1.08,
  }))
})

/** Mid / convergence: middle third of *time* advances less arc → linger near transformation. */
function warpProgressForSlowMid(u) {
  if (u < 1 / 3) return (u / (1 / 3)) * 0.29
  if (u < 2 / 3) return 0.29 + ((u - 1 / 3) / (1 / 3)) * 0.2
  return 0.49 + ((u - 2 / 3) / (1 / 3)) * 0.51
}

/** Chaos: stay on path; tiny oscillation in *progress* only (not screen-space drift). */
function chaosPathRatio(u, tSec, trackIndex) {
  const wobble = 0.016 * Math.sin(u * Math.PI * 6 + tSec * 0.38 + trackIndex * 1.7)
  return Math.min(1, Math.max(0, u + wobble))
}

function smoothstep01(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/** Soft fade at cycle start/end so motion feels subconscious. */
function cycleEdgeFade(u) {
  const fadeIn = 0.11
  const fadeOut = 0.86
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

export default function MobileLandingPage() {
  const [fitOpen, setFitOpen] = useState(false)
  const pathRefs = useRef([])
  const circleRefs = useRef([])
  const pathLens = useRef([])

  useEffect(() => {
    document.body.classList.add('homeMobileLanding')
    return () => document.body.classList.remove('homeMobileLanding')
  }, [])

  /** rAF path sampling: whole-page loop; debug mode skips fade / warp / reduced-motion / filter. */
  useEffect(() => {
    if (!PARTICLE_DEBUG) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (reduce.matches) return undefined
    }

    const baseOpacity = {
      chaos: 0.44,
      mid: 0.5,
      structure: 0.4,
    }

    let raf = 0
    let cancelled = false
    const t0 = performance.now()

    const tick = (now) => {
      if (cancelled) return
      const t = (now - t0) / 1000
      SIGNAL_TRACKS.forEach((g, i) => {
        const pathEl = pathRefs.current[i]
        const dot = circleRefs.current[i]
        if (!pathEl || !dot) return
        let len = pathLens.current[i]
        if (len == null || len < 2) {
          len = pathEl.getTotalLength()
          pathLens.current[i] = len
        }
        if (len < 2) return
        const dur = g.durationSec
        const del = g.delaySec
        let u = ((t + del) % dur) / dur
        if (u < 0) u += 1

        let s = u
        if (!PARTICLE_DEBUG) {
          if (g.zone === 'chaos') s = chaosPathRatio(u, t, i)
          else if (g.zone === 'mid') s = warpProgressForSlowMid(u)
          // structure: linear u — calm, directed along the authored polyline
        }

        const dist = Math.min(Math.max(s * len, 0), len)
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
        const base = baseOpacity[g.zone] ?? 0.45
        const twinkle = 0.9 + 0.1 * Math.sin(t * 1.6 + i * 1.4)
        const opacity = Math.min(0.88, base * edge * (1 + 0.45 * band) * twinkle)
        dot.style.opacity = String(opacity)

        const r = g.r * (1 + 0.18 * band) * (0.96 + 0.06 * Math.sin(t * 1.2 + i * 1.1))
        dot.setAttribute('r', String(r))
        dot.setAttribute('filter', 'url(#mlParticleGlow)')
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      pathLens.current = []
    }
  }, [])

  return (
    <div className="mobileScene">
      <div className="mobileScene__bg" aria-hidden="true">
        <div className="mobileScene__base" />
        <img className="mobileScene__art" src={VERTICAL_ART_SRC} alt="" width={952} height={1330} decoding="async" draggable={false} />
        <div className="mobileScene__clarityVeil" />
        <svg
          className={`mobileScene__particles${PARTICLE_DEBUG ? ' mobileScene__particles--debug' : ''}`}
          viewBox="0 0 952 1330"
          preserveAspectRatio="xMidYMid slice"
          width="100%"
          height="100%"
          aria-hidden="true"
        >
          {!PARTICLE_DEBUG && (
            <defs>
              {/* Same stop palette as `achtergrond verticaal.svg` line strokes (e.g. paint0 / paint30). */}
              <linearGradient id="mlLinePaint" x1="0" y1="0" x2="0" y2="1330" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F43F5E" />
                <stop offset="0.3" stopColor="#D946EF" />
                <stop offset="0.5" stopColor="#A855F7" />
                <stop offset="0.7" stopColor="#3B82F6" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
              <filter id="mlParticleGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="glowWide" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="glowCore" />
                <feMerge>
                  <feMergeNode in="glowWide" />
                  <feMergeNode in="glowCore" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          )}
          {SIGNAL_TRACKS.map((g, i) => (
            <path
              key={g.id}
              id={g.id}
              d={g.d}
              className="mobileScene__particleGuide"
              ref={(el) => {
                pathRefs.current[i] = el
              }}
            />
          ))}
          {SIGNAL_TRACKS.map((g, i) => (
            <circle
              key={`${g.id}-dot`}
              ref={(el) => {
                circleRefs.current[i] = el
              }}
              className="mobileScene__particleDot"
              fill={PARTICLE_DEBUG ? undefined : 'url(#mlLinePaint)'}
              r={PARTICLE_DEBUG ? 6 : g.r}
              cx={g.startCx}
              cy={g.startCy}
              filter={PARTICLE_DEBUG ? 'none' : 'url(#mlParticleGlow)'}
            />
          ))}
        </svg>
      </div>

      <div className="mobileScene__body">
        <div className="mobileScene__shell">
          <SiteHeader />

          <main className="mobileScene__main">
            <section className="mobileHero" aria-labelledby="ml-hero-title">
              <div className="mobileHero__textPlate">
                <h1 id="ml-hero-title" className="mobileHero__title">
                  Werk met AI zonder <span className="mobileHero__accent">jezelf</span> te verliezen.
                </h1>
                <p className="mobileHero__sub">
                  Een praktische training voor mensen die denken, schrijven en beslissen.
                </p>
              </div>

              <div className="mobileHero__cta">
                <button className="mobileHero__btnPrimary" type="button" onClick={() => setFitOpen(true)}>
                  Start de training <span aria-hidden="true">→</span>
                </button>
              </div>
            </section>

            <section className="mobileClarity" aria-labelledby="ml-workshop-title">
              <h2 id="ml-workshop-title" className="mobileClarity__sr">
                Workshop en verdiepingstraject
              </h2>
              <div className="mobileClarity__textPlate">
                <p className="mobileClarity__label">PRAKTISCHE WORKSHOP (3 UUR)</p>
                <p className="mobileClarity__lead">Je begint met een taak die op je to-do lijst staat.</p>
                <p className="mobileClarity__kicker">Daarna leer je:</p>
                <ul className="mobileClarity__list">
                  <li>hoe je richting geeft</li>
                  <li>hoe kleine nuances output veranderen</li>
                  <li>en hoe je steeds dichter komt bij wat je eigenlijk bedoelt</li>
                </ul>

                <div className="mobileClarity__divider" aria-hidden="true" />

                <p className="mobileClarity__followLabel">Het vervolg: verdiepingstraject</p>
                <p className="mobileClarity__followIntro">
                  Na de workshop, zet inzicht om in <strong>direct resultaat</strong>.
                </p>
                <p className="mobileClarity__followKicker">4 weken lang:</p>
                <ul className="mobileClarity__list mobileClarity__list--follow">
                  <li>Inclusief korte 1-op-1 sessies.</li>
                  <li>Werk met echte taken, onmiddellijke toepassing.</li>
                  <li>
                    Van inzicht naar <strong>nieuwe gewoontes</strong>.
                  </li>
                  <li>Inzichten worden onderdeel van je werkwijze.</li>
                  <li>Sluit af met een gezamenlijke groepssessie.</li>
                </ul>

                <span className="mobileClarity__plateAccent" aria-hidden="true">
                  ✦
                </span>
              </div>
            </section>
          </main>
        </div>
      </div>

      <MobileStickyCta />
      <FitCheckModal isOpen={fitOpen} onClose={() => setFitOpen(false)} />
    </div>
  )
}
