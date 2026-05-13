import { useEffect } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import { BOOKING_URL } from '../lib/booking.js'
import './ContactConvergence.css'

const AMBIENT_DOTS = [
  { top: '14%', left: '11%', delay: '-4s', variant: '' },
  { top: '22%', left: '84%', delay: '-12s', variant: ' contactConv__dot--c' },
  { top: '38%', left: '6%', delay: '-2s', variant: ' contactConv__dot--c' },
  { top: '48%', left: '92%', delay: '-18s', variant: '' },
  { top: '68%', left: '14%', delay: '-8s', variant: '' },
  { top: '76%', left: '78%', delay: '-22s', variant: ' contactConv__dot--c' },
  { top: '88%', left: '22%', delay: '-14s', variant: ' contactConv__dot--c' },
  { top: '10%', left: '48%', delay: '-6s', variant: '' },
]

export default function ContactPage() {
  useEffect(() => {
    document.body.classList.add('isContactConvergence')
    return () => document.body.classList.remove('isContactConvergence')
  }, [])

  return (
    <div className="contactConv">
      <div className="contactConv__bg" aria-hidden="true" />
      <div className="contactConv__wash" aria-hidden="true" />

      <svg
        className="contactConv__flows"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="contactConvFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(192, 132, 252, 0.5)" />
            <stop offset="55%" stopColor="rgba(124, 58, 237, 0.25)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0.35)" />
          </linearGradient>
        </defs>
        <path
          stroke="url(#contactConvFlowGrad)"
          d="M -8 38 C 18 22 38 52 52 44 S 88 28 112 36"
        />
        <path stroke="url(#contactConvFlowGrad)" d="M -6 62 C 24 78 44 48 58 56 S 92 72 108 58" />
        <path stroke="url(#contactConvFlowGrad)" d="M 108 24 C 82 18 62 42 48 36 S 12 22 -8 30" />
      </svg>

      <div className="contactConv__dots" aria-hidden="true">
        {AMBIENT_DOTS.map((d, i) => (
          <span
            key={i}
            className={`contactConv__dot${d.variant}`}
            style={{
              top: d.top,
              left: d.left,
              animationDelay: d.delay,
              animationDuration: `${32 + (i % 5) * 7}s`,
            }}
          />
        ))}
      </div>

      <div className="contactConv__vignette" aria-hidden="true" />

      <div className="contactConv__header">
        <SiteHeader hidePlanCta />
      </div>

      <main className="contactConv__main" id="contact-main">
        <article className="contactConvCard" aria-labelledby="contact-name-heading">
          <p className="contactConvCard__brand">PrinciplesAI</p>
          <h1 id="contact-name-heading" className="contactConvCard__name">
            Mathijs van der Grijp
          </h1>
          <div className="contactConvCard__meta">
            <a href="tel:+31610277261">06 10277261</a>
            <a href="mailto:mathijs@principlesai.nl">Mathijs@principlesai.nl</a>
          </div>
          <a className="contactConvCard__cta" href={BOOKING_URL} target="_blank" rel="noreferrer">
            Plan een gesprek
            <span className="contactConvCard__ctaArrow" aria-hidden="true">
              →
            </span>
          </a>
        </article>
      </main>
    </div>
  )
}
