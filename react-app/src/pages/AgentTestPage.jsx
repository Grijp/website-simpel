import { useMemo, useState } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { runAgentTest } from '../lib/agentTestApi.js'

export default function AgentTestPage() {
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
      const data = await runAgentTest({ message })
      setResult(data)
    } catch (err) {
      setResult(null)
      setError(err?.message || 'Test mislukt')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="lpShell">
        <SiteHeader />

        <main className="lpMain">
          <h1 className="lpH1">Mode sandbox.</h1>
          <div className="lpH2">Test mode keuze en orchestration.</div>

          <form className="sandbox" onSubmit={onSubmit}>
            <label className="srOnly" htmlFor="sandboxInput">
              Input
            </label>
            <textarea
              id="sandboxInput"
              className="sandboxInput"
              rows={4}
              placeholder="Plak of typ een user vraag…"
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
            <pre className="sandboxOut" aria-label="Analyse output">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <div className="lpHint">Output verschijnt hier als JSON.</div>
          )}
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}

