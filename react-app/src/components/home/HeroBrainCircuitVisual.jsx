import logoSvg from '/logo uitgebreid 2.svg?raw'

export default function HeroBrainCircuitVisual({ className = '' }) {
  // Base SVG stays the source of truth (no overlay vectors).
  return (
    <span className={`heroBrainCircuit ${className}`.trim()} aria-hidden="true">
      {/* eslint-disable-next-line react/no-danger */}
      <span className="heroBrainCircuitSvg" dangerouslySetInnerHTML={{ __html: logoSvg }} />
    </span>
  )
}

