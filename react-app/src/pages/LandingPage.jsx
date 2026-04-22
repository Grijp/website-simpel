import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PromptClarityHelper from '../components/PromptClarityHelper.jsx'
import PromptSemanticHelper from '../components/PromptSemanticHelper.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import DynamicPage from '../components/DynamicPage.jsx'
import { runAgent } from '../lib/agentApi.js'

export default function LandingPage() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('programma')
  const [submitToken, setSubmitToken] = useState(0)
  const [pageConfig, setPageConfig] = useState(null)

  const canSend = useMemo(() => value.trim().length > 0 && !isLoading, [value, isLoading])

  async function onSubmit(e) {
    e.preventDefault()
    const text = value.trim()
    if (!text || isLoading) return

    setError('')
    setIsLoading(true)
    setSubmitToken((x) => x + 1)
    setMessages((prev) => [...prev, { role: 'user', text }])

    try {
      const data = await runAgent({ message: text, mode: 'info' })
      setMessages((prev) => [...prev, { role: 'assistant', text: data?.reply || '' }])
      setPageConfig(data?.pageConfig || null)
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
          <h1 className="lpH1">Jij gebruikt het.</h1>
          <div className="lpH2">Maar gebruikt het nog niet echt.</div>

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
              placeholder="Typ bijv. ‘programma’ of een werkdoel..."
              value={value}
              onChange={(ev) => setValue(ev.target.value)}
              autoComplete="off"
              inputMode="text"
            />
            <button className="srOnly" type="submit" disabled={!canSend}>
              Verstuur
            </button>
          </form>

          <PromptClarityHelper text={value} />
          <PromptSemanticHelper text={value} runOnSubmitToken={submitToken} />

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

          <div className="lpHint">Tik een commando om de website te besturen.</div>

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

          <DynamicPage pageConfig={pageConfig} />
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

