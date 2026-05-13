import { useEffect, useState } from 'react'
import DesktopLandingPage from '../components/home/DesktopLandingPage.jsx'
import MobileLandingPage from '../components/home/MobileLandingPage.jsx'

const MOBILE_LANDING_MQ = '(max-width: 520px)'

function getMobileLanding() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(MOBILE_LANDING_MQ).matches
}

export default function HomePage() {
  const [isMobileLanding, setIsMobileLanding] = useState(getMobileLanding)

  useEffect(() => {
    document.body.classList.add('isHomeTheme')
    return () => document.body.classList.remove('isHomeTheme')
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_LANDING_MQ)
    const sync = () => setIsMobileLanding(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  if (isMobileLanding) {
    return <MobileLandingPage />
  }

  return <DesktopLandingPage />
}
