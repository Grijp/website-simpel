import logoSvg from '/logo-hero.svg?raw'

/**
 * Originele logo.svg als kern, met een lichte visuele uitbreiding (split-brain idee):
 * subtiele organische lijnen links en dunne signaallijnen + dots rechts — zelfde viewBox als het logo.
 */
export default function HomeSplitBrainLogo({ className = '' }) {
  return (
    <span className={`splitBrainLogoCore ${className}`.trim()} dangerouslySetInnerHTML={{ __html: logoSvg }} />
  )
}
