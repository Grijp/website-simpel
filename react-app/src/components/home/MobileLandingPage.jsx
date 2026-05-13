import { useEffect, useRef, useState } from 'react'
import SiteHeader from '../SiteHeader.jsx'
import FitCheckModal from '../FitCheckModal.jsx'
import { MobileStickyCta } from './HomeSections.jsx'
import './MobileLandingPage.css'
import {
  MOBILE_ART_PARTICLE_TRACKS,
  PARTICLE_DEBUG,
  VERTICAL_ART_SRC,
  useVerticalLandingParticles,
} from './verticalLandingParticles.js'

export default function MobileLandingPage() {
  const [fitOpen, setFitOpen] = useState(false)
  const pathRefs = useRef([])
  const circleRefs = useRef([])
  const pathLens = useRef([])

  useVerticalLandingParticles({ pathRefs, circleRefs, pathLens })

  useEffect(() => {
    document.body.classList.add('homeMobileLanding')
    return () => document.body.classList.remove('homeMobileLanding')
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
              <linearGradient id="mlLinePaint" x1="476" y1="0" x2="476" y2="1330" gradientUnits="userSpaceOnUse">
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
          {MOBILE_ART_PARTICLE_TRACKS.map((g, i) => (
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
          {MOBILE_ART_PARTICLE_TRACKS.map((g, i) => (
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
