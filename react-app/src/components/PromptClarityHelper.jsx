import { useMemo, useState } from 'react'
import { detectVagueTerms } from '../lib/detectVagueTerms.js'
import { useDebouncedValue } from '../lib/useDebouncedValue.js'

function severityLabel(sev) {
  if (sev === 'high') return 'hoog'
  if (sev === 'medium') return 'middel'
  return 'laag'
}

/**
 * Helper UI: intentionally lightweight and non-judgmental.
 * - Default view: suggestions list under the input.
 * - Optional view: "badges" (acts as a lightweight highlight alternative).
 */
export default function PromptClarityHelper({ text }) {
  const [view, setView] = useState('suggesties') // 'suggesties' | 'badges'
  const debounced = useDebouncedValue(text, 150)

  const detections = useMemo(() => detectVagueTerms(debounced), [debounced])

  if (!debounced?.trim()) return null

  return (
    <section className="clarity">
      <div className="clarityTop">
        <div className="clarityTitle">Prompt-check</div>
        <div className="clarityToggle" role="group" aria-label="Weergave">
          <button
            type="button"
            className={`clarityTbtn ${view === 'suggesties' ? 'isActive' : ''}`}
            onClick={() => setView('suggesties')}
          >
            Suggesties
          </button>
          <button
            type="button"
            className={`clarityTbtn ${view === 'badges' ? 'isActive' : ''}`}
            onClick={() => setView('badges')}
          >
            Markeringen
          </button>
        </div>
      </div>

      {detections.length === 0 ? (
        <div className="clarityEmpty">Ziet er al behoorlijk concreet uit.</div>
      ) : view === 'badges' ? (
        <div className="clarityBadges">
          {detections.map((d, idx) => (
            <button
              key={`${d.id}-${d.start}-${idx}`}
              type="button"
              className={`clarityBadge sev-${d.severity}`}
              title={`${d.matchText} — ${d.why} Suggestie: ${d.suggestion}`}
            >
              <span className="clarityBadgeWord">“{d.matchText}”</span>
              <span className="clarityBadgeSev">{severityLabel(d.severity)}</span>
            </button>
          ))}
        </div>
      ) : (
        <ul className="clarityList">
          {detections.map((d, idx) => (
            <li key={`${d.id}-${d.start}-${idx}`} className="clarityItem">
              <div className="clarityHead">
                <span className={`clarityPill sev-${d.severity}`}>
                  “{d.matchText}” • {severityLabel(d.severity)}
                </span>
              </div>
              <div className="clarityWhy">{d.why}</div>
              <div className="claritySuggest">{d.suggestion}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

