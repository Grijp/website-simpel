import { useMemo, useState } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import DynamicRenderer from '../components/DynamicRenderer.jsx'
import { analyzeMode } from '../lib/analyzeModeApi.js'

export default function AnalyzeModePage() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const canRun = useMemo(() => value.trim().length > 0 && !isLoading, [value, isLoading])

  async function onSubmit(e) {
    e.preventDefault()
    const message = value.trim()
    if (!message || isLoading) return

    setIsLoading(true)
    setError('')
    try {
      const data = await analyzeMode({ message })
      setResult(data)
    } catch (err) {
      setResult(null)
      setError(err?.message || 'Analyse mislukt')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="lpShell">
        <SiteHeader />

        <main className="lpMain">
          <h1 className="lpH1">Mode analyse.</h1>
          <div className="lpH2">Classificeer input → info / uitleg / assessment.</div>
          {result?.blocks?.length ? <DynamicRenderer components={result.blocks} /> : null}

          <form className="sandbox" onSubmit={onSubmit}>
            <label className="srOnly" htmlFor="modeInput">
              Input
            </label>
            <textarea
              id="modeInput"
              className="sandboxInput"
              rows={4}
              placeholder="Typ een user vraag of situatie…"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <div className="sandboxActions">
              <button className="btn btn-secondary" type="submit" disabled={!canRun}>
                {isLoading ? 'Analyseren…' : 'Analyseer'}
              </button>
            </div>
          </form>

          {error ? <div className="chatError">{error}</div> : null}

          {result ? (
            <>
              <div className="modeOut" aria-label="Mode output">
                <div className="modeRow">
                  <div className="modeLabel">Mode</div>
                  <div className="modeValue">{result.mode}</div>
                </div>
                <div className="modeRow">
                  <div className="modeLabel">Reden</div>
                  <div className="modeReason">{result.reason}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="lpHint">Nog geen blocks. Typ een vraag en klik Analyseer.</div>
          )}
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}

