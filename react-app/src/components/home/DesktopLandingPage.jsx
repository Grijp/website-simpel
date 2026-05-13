import { useEffect, useRef, useState } from 'react'
import SiteHeader from '../SiteHeader.jsx'
import FitCheckModal from '../FitCheckModal.jsx'
import { MobileStickyCta } from './HomeSections.jsx'
import './DesktopLandingPage.css'
import { PARTICLE_DEBUG, VERTICAL_ART_SRC } from './verticalLandingParticles.js'
import { DESKTOP_ART_PARTICLE_TRACKS, ART_BG_VIEWBOX, useDesktopSceneParticles } from './desktopSceneParticles.js'

export default function DesktopLandingPage() {
  const [fitOpen, setFitOpen] = useState(false)
  const pathRefs = useRef([])
  const circleRefs = useRef([])
  const pathLens = useRef([])

  useDesktopSceneParticles({ pathRefs, circleRefs, pathLens })

  const particleFillForZone = (zone) => {
    if (PARTICLE_DEBUG) return undefined
    if (zone === 'chaos') return 'url(#dlLinePaintChaos)'
    if (zone === 'structure') return 'url(#dlLinePaintStructure)'
    return 'url(#dlLinePaintMid)'
  }

  useEffect(() => {
    document.body.classList.add('homeDesktopLanding')
    return () => document.body.classList.remove('homeDesktopLanding')
  }, [])

  return (
    <div className="dlScene">
      <div className="dlScene__bg" aria-hidden="true">
        <div className="dlScene__base" />
        <div className="dlScene__wash" />
        <img
          className="dlScene__art"
          src={VERTICAL_ART_SRC}
          alt=""
          width={952}
          height={1330}
          decoding="async"
          draggable={false}
        />
        <div className="dlScene__logoMark" aria-hidden="true">
          <img className="dlScene__logoMarkImg" src="/logo-desktop-chaos-structure.svg" alt="" width={330} height={350} decoding="async" draggable={false} />
          <div className="dlScene__logoMarkBloom dlScene__logoMarkBloom--warm" />
          <div className="dlScene__logoMarkBloom dlScene__logoMarkBloom--cool" />
        </div>
        <div className="dlScene__artHueWrap" aria-hidden="true">
          <div className="dlScene__artHueHalf dlScene__artHueHalf--chaos" />
          <div className="dlScene__artHueHalf dlScene__artHueHalf--structure" />
        </div>
        <div className="dlScene__haze" />
        <div className="dlScene__vignette" />

        <svg
          className={`dlScene__particles${PARTICLE_DEBUG ? ' dlScene__particles--debug' : ''}`}
          viewBox={ART_BG_VIEWBOX}
          preserveAspectRatio="xMidYMid slice"
          width="100%"
          height="100%"
          aria-hidden="true"
        >
          {!PARTICLE_DEBUG && (
            <defs>
              <linearGradient id="dlLinePaintChaos" x1="0" y1="540" x2="720" y2="540" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F0ABFC" />
                <stop offset="0.55" stopColor="#C084FC" />
                <stop offset="1" stopColor="#6D28D9" />
              </linearGradient>
              <linearGradient id="dlLinePaintMid" x1="560" y1="540" x2="1360" y2="540" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E9D5FF" />
                <stop offset="0.45" stopColor="#A855F7" />
                <stop offset="0.55" stopColor="#38BDF8" />
                <stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
              <linearGradient id="dlLinePaintStructure" x1="1200" y1="540" x2="1920" y2="540" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7DD3FC" />
                <stop offset="0.45" stopColor="#38BDF8" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
              <filter id="dlSceneParticleGlow" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="g" />
                <feMerge>
                  <feMergeNode in="g" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          )}
          {DESKTOP_ART_PARTICLE_TRACKS.map((g, i) => (
            <path
              key={g.id}
              d={g.d}
              className="dlScene__particleGuide"
              ref={(el) => {
                pathRefs.current[i] = el
              }}
            />
          ))}
          {DESKTOP_ART_PARTICLE_TRACKS.map((g, i) => (
            <circle
              key={`${g.id}-dot`}
              ref={(el) => {
                circleRefs.current[i] = el
              }}
              className="dlScene__particleDot"
              fill={particleFillForZone(g.zone)}
              r={PARTICLE_DEBUG ? 6 : g.r}
              cx={g.startCx}
              cy={g.startCy}
              filter={PARTICLE_DEBUG ? 'none' : 'url(#dlSceneParticleGlow)'}
            />
          ))}
        </svg>
      </div>

      <div className="dlScene__body">
        <div className="dlScene__shell">
          <header className="dlScene__header">
            <SiteHeader hidePlanCta />
          </header>

          <main className="dlScene__main">
            <div className="dlScene__zones">
              <section className="dlZone dlZone--chaos" aria-labelledby="dl-hero-title">
                <div className="dlFocusField dlFocusField--chaos">
                  <div className="dlFocusField__veil" aria-hidden="true" />
                  <div className="dlFocusField__glow" aria-hidden="true" />
                  <div className="dlFocusInner dlFocusInner--chaos">
                    <p className="dlEyebrow">AI als verlengstuk van jouw denken</p>
                    <h1 id="dl-hero-title" className="dlTitle">
                      Werk met AI zonder <span className="dlTitle__accent">jezelf</span> te verliezen.
                    </h1>
                    <p className="dlLead">
                      Een praktische training voor mensen die denken, schrijven en beslissen.
                    </p>
                    <div className="dlCta">
                      <button className="dlBtnPrimary" type="button" onClick={() => setFitOpen(true)}>
                        Start de training <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="dlZone dlZone--convergence" aria-hidden="true">
                <div className="dlConvergenceOrb" />
                <div className="dlConvergenceRing" />
              </div>

              <section className="dlZone dlZone--structure" aria-labelledby="dl-workshop-title">
                <h2 id="dl-workshop-title" className="dlSrOnly">
                  Workshop en verdiepingstraject
                </h2>
                <div className="dlFocusField dlFocusField--structure">
                  <div className="dlFocusField__veil" aria-hidden="true" />
                  <div className="dlFocusField__glow" aria-hidden="true" />
                  <div className="dlFocusInner dlFocusInner--workshop">
                    <div className="dlWorkBlock">
                      <p className="dlKicker">Praktische workshop (3 uur)</p>
                      <p className="dlWorkLead">Je begint met een taak die op je to-do lijst staat.</p>
                      <p className="dlWorkSub">Daarna leer je:</p>
                      <ul className="dlList">
                        <li>hoe je richting geeft</li>
                        <li>hoe kleine nuances output veranderen</li>
                        <li>en hoe je steeds dichter komt bij wat je eigenlijk bedoelt</li>
                      </ul>
                    </div>

                    <div className="dlSoftRule" aria-hidden="true" />

                    <div className="dlWorkBlock">
                      <p className="dlKicker dlKicker--structure">Het vervolg: verdiepingstraject</p>
                      <p className="dlWorkLead">
                        Na de workshop zet je inzicht om in <strong>direct resultaat</strong>.
                      </p>
                      <p className="dlWorkSub">4 weken lang:</p>
                      <ul className="dlList">
                        <li>korte 1-op-1 sessies</li>
                        <li>echte taken</li>
                        <li>direct toepassen</li>
                        <li>inzichten verzamelen voor een gezamenlijke groepssessie</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>

          <div className="dlScene__bottomWrap">
            <div className="dlScene__bottomCta">
              <div className="dlScene__bottomCtaRail" aria-hidden="true" />
              <div className="dlScene__bottomCtaMid">
                <MobileStickyCta />
              </div>
              <div className="dlScene__bottomCtaRail" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <FitCheckModal isOpen={fitOpen} onClose={() => setFitOpen(false)} />
    </div>
  )
}
