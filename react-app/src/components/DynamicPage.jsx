import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ContactCard from './ContactCard.jsx'

export default function DynamicPage({ pageConfig, mode, profile, diagnosis, recommendedPath }) {
  const navigate = useNavigate()

  const blocks = useMemo(() => {
    const arr = pageConfig?.blocks
    return Array.isArray(arr) ? arr : []
  }, [pageConfig])

  if (!blocks.length) return null

  return (
    <section className="dyn" aria-label="Aanbevolen stappen" data-mode={mode || 'info'}>
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

        if (b.type === 'contactCard') {
          return (
            <ContactCard
              key={idx}
              variant={b.variant || 'default'}
              name={b.name}
              email={b.email}
              phone={b.phone}
              companyName={b.companyName}
              logoSrc={b.logoSrc}
              ctaHref={b.ctaHref}
              ctaLabel={b.ctaLabel}
              ctaContextText={b.ctaContextText}
            />
          )
        }

        if (b.type === 'conceptExplanation') {
          return (
            <div key={idx} className="dynBlock">
              <div className="dynTitle">{b.title}</div>
              <div className="dynBody">
                <strong>{b.concept}</strong>
                <div style={{ height: 6 }} />
                <div>{b.explanation}</div>
              </div>
              {Array.isArray(b.bullets) && b.bullets.length ? (
                <ul className="dynList">
                  {b.bullets.map((it, j) => (
                    <li key={j} className="dynItem">
                      {it}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )
        }

        if (b.type === 'recommendedPath') {
          return (
            <div key={idx} className="dynBlock">
              <div className="dynTitle">{b.title || 'Aanbevolen route'}</div>
              <div className="dynBody">{b.why}</div>
              <div className="dynActions">
                {(b.actions || []).map((a, j) => {
                  const tone = a.tone === 'primary' ? 'btn-primary' : 'btn-secondary'
                  if (a.kind === 'navigate') {
                    return (
                      <button key={j} type="button" className={`btn ${tone}`} onClick={() => navigate(a.to)}>
                        {a.label}
                      </button>
                    )
                  }
                  return (
                    <a key={j} className={`btn ${tone}`} href={a.to} target="_blank" rel="noopener noreferrer">
                      {a.label}
                    </a>
                  )
                })}
              </div>
            </div>
          )
        }

        if (b.type === 'assessmentIntro') {
          return (
            <div key={idx} className="dynBlock">
              <div className="dynTitle">{b.title || 'Korte intake'}</div>
              <ul className="dynList">
                {(b.questions || []).map((it, j) => (
                  <li key={j} className="dynItem">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          )
        }

        if (b.type === 'diagnosticSummary') {
          return (
            <div key={idx} className="dynBlock">
              <div className="dynTitle">{b.title || 'Samenvatting'}</div>
              <div className="dynBody">{b.summary}</div>
              {Array.isArray(b.signals) && b.signals.length ? (
                <ul className="dynList">
                  {b.signals.map((it, j) => (
                    <li key={j} className="dynItem">
                      {it}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )
        }

        if (b.type === 'faq') {
          return (
            <div key={idx} className="dynBlock">
              <div className="dynTitle">{b.title || 'FAQ'}</div>
              <div className="dynFaq">
                {(b.items || []).map((it, j) => (
                  <div key={j} className="dynFaqItem">
                    <div className="dynFaqQ">{it.q}</div>
                    <div className="dynFaqA">{it.a}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        if (b.type === 'comparison') {
          return (
            <div key={idx} className="dynBlock">
              <div className="dynTitle">{b.title}</div>
              <div className="dynTable">
                <div className="dynTableHead">
                  <div />
                  <div>{b.leftTitle}</div>
                  <div>{b.rightTitle}</div>
                </div>
                {(b.rows || []).map((r, j) => (
                  <div key={j} className="dynTableRow">
                    <div className="dynTableLabel">{r.label}</div>
                    <div>{r.left}</div>
                    <div>{r.right}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        if (b.type === 'personaSummary') {
          return (
            <div key={idx} className="dynBlock">
              <div className="dynTitle">{b.title || 'Past dit bij jou?'}</div>
              <ul className="dynList">
                {(b.bullets || []).map((it, j) => (
                  <li key={j} className="dynItem">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          )
        }

        if (b.type === 'cta') {
          const a = b.action
          const tone = a?.tone === 'primary' ? 'btn-primary' : 'btn-secondary'
          return (
            <div key={idx} className="dynBlock">
              <div className="dynTitle">{b.title}</div>
              {b.body ? <div className="dynBody">{b.body}</div> : null}
              <div className="dynActions">
                {a?.kind === 'navigate' ? (
                  <button type="button" className={`btn ${tone}`} onClick={() => navigate(a.to)}>
                    {a.label}
                  </button>
                ) : (
                  <a className={`btn ${tone}`} href={a?.to} target="_blank" rel="noopener noreferrer">
                    {a?.label}
                  </a>
                )}
              </div>
              {b.note ? <div className="dynNote">{b.note}</div> : null}
            </div>
          )
        }

        return null
      })}
    </section>
  )
}

