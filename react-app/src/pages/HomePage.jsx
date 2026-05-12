import { useEffect, useState } from 'react'
import FitCheckModal from '../components/FitCheckModal.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import HomeBackground from '../components/home/HomeBackground.jsx'
import MobileLandingPage from '../components/home/MobileLandingPage.jsx'
import {
  HomeClaritySection,
  HomeFinalCta,
  HomeHero,
  HomeOfferSection,
  HomeStatementSection,
  MobileStickyCta,
} from '../components/home/HomeSections.jsx'
import { heroTimelineSteps, homeFeaturePillars, offers } from '../components/home/homeContent.js'

const MOBILE_LANDING_MQ = '(max-width: 520px)'

function getMobileLanding() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(MOBILE_LANDING_MQ).matches
}

export default function HomePage() {
  const [isFitCheckOpen, setIsFitCheckOpen] = useState(false)
  const [heroClarity, setHeroClarity] = useState(0)
  const [isMobileLanding, setIsMobileLanding] = useState(getMobileLanding)

  const heroVisualStyle = {
    '--hero-clarity': heroClarity,
    '--hero-opacity': 0.68 + heroClarity * 0.18,
    '--hero-blur': `${0.18 - heroClarity * 0.18}px`,
    '--hero-rotate': `${-7 + heroClarity * 2}deg`,
    '--hero-x': `${heroClarity * -0.35}rem`,
    '--hero-y': `${heroClarity * 0.25}rem`,
    '--hero-saturate': 1 + heroClarity * 0.08,
    '--hero-halo': 0.08 + heroClarity * 0.04,
  }

  useEffect(() => {
    document.body.classList.add('isHomeTheme')
    return () => {
      document.body.classList.remove('isHomeTheme')
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_LANDING_MQ)
    const sync = () => setIsMobileLanding(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (isMobileLanding) return

    let frameId = 0
    const updateHeroClarity = () => {
      frameId = 0
      setHeroClarity(Math.min(window.scrollY / 280, 1))
    }

    const onScroll = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateHeroClarity)
    }

    updateHeroClarity()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [isMobileLanding])

  if (isMobileLanding) {
    return <MobileLandingPage />
  }

  return (
    <div className="homeScene" style={heroVisualStyle}>
      <HomeBackground scene="full" />

      <div className="container homePage">
        <div className="lpShell">
          <SiteHeader />

          <main className="lpMain homeMain">
            <HomeHero onOpenFitCheck={() => setIsFitCheckOpen(true)} timelineSteps={heroTimelineSteps} />
            <HomeClaritySection pillars={homeFeaturePillars} />
            <HomeOfferSection offers={offers} />
            <HomeStatementSection />
            <HomeFinalCta />
          </main>
        </div>
      </div>

      <MobileStickyCta />
      <FitCheckModal isOpen={isFitCheckOpen} onClose={() => setIsFitCheckOpen(false)} />
    </div>
  )
}
