import { useEffect, useMemo, useRef, useState } from 'react'
import { analyzePrompt } from '../lib/api.js'
import { useDebouncedValue } from '../lib/useDebouncedValue.js'

function clampScore(score) {
  const n = Number(score)
  if (!Number.isFinite(n)) return null
  return Math.max(1, Math.min(10, Math.round(n)))
}

export default function PromptSemanticHelper({ text, runOnSubmitToken }) {
  const [enabled, setEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const lastAnalyzed = useRef('')

  // Debounce to minimize calls; only when enabled.
  const debounced = useDebouncedValue(text, 700)

  const canAnalyze = useMemo(() => (text ?? '').trim().length >= 8, [text])

  async function runAnalysis(input) {
    const trimmed = String(input ?? '').trim()
    if (!trimmed) return

    // Avoid repeated calls for same string.
    if (trimmed === lastAnalyzed.current) return
    lastAnalyzed.current = trimmed

    setIsLoading(true)
    setError('')
    try {
      const data = await analyzePrompt(trimmed)
      setResult({
        score: clampScore(data?.score),
        items: Array.isArray(data?.items) ? data.items : [],
        general_feedback: data?.general_feedback ?? null,
      })
    } catch (e) {
      setError(e?.message || 'Analyse mislukt')
    } finally {
      setIsLoading(false)
    }
  }

  // Live analysis (optional).
  useEffect(() => {
    if (!enabled) return
    if (!canAnalyze) return
    runAnalysis(debounced)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, debounced, canAnalyze])

  // Run on submit signal (token increments).
  useEffect(() => {
    if (!runOnSubmitToken) return
    if (!canAnalyze) return
    runAnalysis(text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runOnSubmitToken])

  if (!String(text ?? '').trim()) return null

  return (
    <section className="semantic">
      <div className="semanticTop">
        <div className="semanticTitle">Semantische check</div>
        <div className="semanticControls">
          <label className="semanticToggle">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <span>Live</span>
          </label>
          <button
            type="button"
            className="semanticBtn"
            onClick={() => runAnalysis(text)}
            disabled={!canAnalyze || isLoading}
          >
            {isLoading ? 'Analyseren…' : 'Analyseer'}
          </button>
        </div>
      </div>

      {error && <div className="chatError">{error}</div>}

      {!error && result && (
        <div className="semanticBody">
          <div className="semanticScore">
            <span className="semanticScoreLabel">Specificiteit</span>
            <span className="semanticScoreValue">{result.score ?? '—'}/10</span>
          </div>

          {result.general_feedback && <div className="semanticGeneral">{result.general_feedback}</div>}

          {result.items?.length ? (
            <ul className="semanticList">
              {result.items.slice(0, 8).map((it, idx) => (
                <li key={idx} className="semanticItem">
                  <div className="semanticWord">“{it.text}”</div>
                  <div className="semanticReason">{it.reason}</div>
                  <div className="semanticSuggest">{it.suggestion}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="semanticEmpty">Geen duidelijke vage termen gevonden.</div>
          )}
        </div>
      )}
    </section>
  )
}

