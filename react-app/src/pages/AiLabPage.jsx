import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import DynamicStage from '../components/DynamicStage.jsx'
import { runFlow } from '../lib/flowApi.js'

export default function AiLabPage() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('programma')
  const [flow, setFlow] = useState(null)
  const [currentMode, setCurrentMode] = useState('info')
  const [debug, setDebug] = useState(null)
  const [clientTiming, setClientTiming] = useState(null)
  const [serverMeta, setServerMeta] = useState(null)

  const heroMode = flow?.stage?.shell?.hero || 'show'

  const canSend = useMemo(() => value.trim().length > 0 && !isLoading, [value, isLoading])

  async function onSubmit(e) {
    e.preventDefault()
    const text = value.trim()
    if (!text || isLoading) return

    setError('')
    setIsLoading(true)
    setClientTiming(null)
    setServerMeta(null)
    setMessages((prev) => [...prev, { role: 'user', text }])

    try {
      const t0 = performance.now()
      const { data, meta } = await runFlow({ message: text, debug: true })
      const t1 = performance.now()

      setServerMeta(meta)
      setFlow(data)
      setDebug(data?.debug || null)
      const a = data?.analysis
      setMessages((prev) => [...prev, { role: 'assistant', text: a?.reason ? `Mode: ${a.mode}. ${a.reason}` : 'OK.' }])
      if (a?.mode) setCurrentMode(a.mode)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const t2 = performance.now()
          setClientTiming({
            fetchMs: Math.round(t1 - t0),
            renderMs: Math.round(t2 - t1),
            totalMs: Math.round(t2 - t0),
          })
        })
      })
    } catch (_err) {
      setError(
        typeof _err?.message === 'string' && _err.message !== 'request_failed'
          ? _err.message
          : 'Er ging iets mis. Start de backend en check je API key.',
      )
    } finally {
      setIsLoading(false)
      setValue('')
    }
  }

  return (
    <div className="container">
      <div className="lpShell">
        <SiteHeader />

        <main className="lpMain">
          {heroMode !== 'hide' ? (
            <>
              <h1 className="lpH1">AI lab.</h1>
              {heroMode === 'show' ? <div className="lpH2">Experimentele flow (LLM).</div> : null}
            </>
          ) : null}

          <form className="lpCommand" onSubmit={onSubmit}>
            <span className="lpPrompt" aria-hidden="true">
              &gt;
            </span>
            <label className="srOnly" htmlFor="question">
              Typ een commando of vraag
            </label>
            <input
              id="question"
              className="lpInput"
              placeholder="Typ bijv. ‘contact’ of een inhoudelijke vraag..."
              value={value}
              onChange={(ev) => setValue(ev.target.value)}
              autoComplete="off"
              inputMode="text"
            />
            <button className="srOnly" type="submit" disabled={!canSend}>
              Verstuur
            </button>
          </form>

          <div className="lpTabs" role="tablist" aria-label="AI mode (read-only)">
            <button type="button" role="tab" aria-selected={currentMode === 'info'} className={`lpTab ${currentMode === 'info' ? 'isActive' : ''}`}>
              INFO
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={currentMode === 'uitleg'}
              className={`lpTab ${currentMode === 'uitleg' ? 'isActive' : ''}`}
            >
              UITLEG
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={currentMode === 'assessment'}
              className={`lpTab ${currentMode === 'assessment' ? 'isActive' : ''}`}
            >
              ASSESSMENT
            </button>
          </div>

          <div className="lpTabs" role="tablist" aria-label="Categorie">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'programma'}
              className={`lpTab ${activeTab === 'programma' ? 'isActive' : ''}`}
              onClick={() => {
                setActiveTab('programma')
                setValue('programma ')
              }}
            >
              PROGRAMMA
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'methode'}
              className={`lpTab ${activeTab === 'methode' ? 'isActive' : ''}`}
              onClick={() => {
                setActiveTab('methode')
                setValue('methode ')
              }}
            >
              METHODE
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'wie'}
              className={`lpTab ${activeTab === 'wie' ? 'isActive' : ''}`}
              onClick={() => {
                setActiveTab('wie')
                setValue('wie ')
              }}
            >
              WIE
            </button>
          </div>

          {heroMode === 'show' ? <div className="lpHint">Experimenteel: gebruikt `/api/flow`.</div> : null}

          {(error || messages.length > 0) && (
            <div className="lpChat" aria-live="polite">
              {error && <div className="chatError">{error}</div>}
              {messages.slice(-2).map((m, idx) => (
                <div key={idx} className={`chatMsg ${m.role === 'user' ? 'chatUser' : 'chatBot'}`}>
                  {m.text}
                </div>
              ))}
            </div>
          )}

          <DynamicStage stage={flow?.stage} isLoading={isLoading} />

          {debug ? (
            <details className="flowDebug">
              <summary>Debug timings</summary>
              <pre className="flowDebugPre">{JSON.stringify({ serverMeta, serverDebug: debug, clientTiming }, null, 2)}</pre>
            </details>
          ) : null}
        </main>

        <footer className="lpFooter">
          <button className="lpCtaDark" type="button" onClick={() => navigate('/leren')}>
            <span>JA, IK WIL HET ÉCHT LEREN GEBRUIKEN</span>
            <span className="lpArrow" aria-hidden="true">
              ›
            </span>
          </button>
        </footer>

        <SiteFooter />
      </div>
    </div>
  )
}

