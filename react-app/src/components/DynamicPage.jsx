import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DynamicPage({ pageConfig }) {
  const navigate = useNavigate()

  const blocks = useMemo(() => {
    const arr = pageConfig?.blocks
    return Array.isArray(arr) ? arr : []
  }, [pageConfig])

  if (!blocks.length) return null

  return (
    <section className="dyn" aria-label="Aanbevolen stappen">
      {blocks.map((b, idx) => {
        if (!b || typeof b !== 'object') return null

        if (b.type === 'callout') {
          return (
            <div key={idx} className="dynBlock dynCallout">
              <div className="dynTitle">{b.title}</div>
              <div className="dynBody">{b.body}</div>
            </div>
          )
        }

        if (b.type === 'checklist') {
          return (
            <div key={idx} className="dynBlock">
              {b.title ? <div className="dynTitle">{b.title}</div> : null}
              <ul className="dynList">
                {(b.items || []).map((it, j) => (
                  <li key={j} className="dynItem">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          )
        }

        if (b.type === 'actions') {
          return (
            <div key={idx} className="dynBlock">
              {b.title ? <div className="dynTitle">{b.title}</div> : null}
              <div className="dynActions">
                {(b.actions || []).map((a, j) => {
                  const tone = a.tone === 'primary' ? 'btn-primary' : 'btn-secondary'

                  if (a.kind === 'navigate') {
                    return (
                      <button
                        key={j}
                        type="button"
                        className={`btn ${tone}`}
                        onClick={() => navigate(a.to)}
                      >
                        {a.label}
                      </button>
                    )
                  }

                  return (
                    <a
                      key={j}
                      className={`btn ${tone}`}
                      href={a.to}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {a.label}
                    </a>
                  )
                })}
              </div>
            </div>
          )
        }

        return null
      })}
    </section>
  )
}

