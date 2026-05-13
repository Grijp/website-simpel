import { useEffect, useMemo, useState } from 'react'
import { BOOKING_URL, FIT_CHECK_FORM_URL } from '../lib/booking.js'

const STEPS = [
  {
    id: 'frequency',
    title: 'Hoe vaak gebruik je AI in je werk?',
    options: ['Dagelijks', 'Paar keer per week', 'Af en toe', 'Nauwelijks'],
  },
  {
    id: 'usage',
    title: 'Hoe gebruik je het meestal?',
    options: [
      'Ik stel een vraag en gebruik het antwoord',
      'Ik laat tekst herschrijven / verbeteren',
      'Ik probeer verschillende prompts',
      'Ik doe maar wat / weet niet goed wat werkt',
    ],
  },
  {
    id: 'recognition',
    title: 'Wat herken je het meest?',
    options: [
      'Het is vaak ‘oké’, maar niet echt goed',
      'Ik weet niet hoe ik moet bijsturen',
      'Ik begin vaak opnieuw',
      'Het kost me meer tijd dan verwacht',
    ],
  },
  {
    id: 'promptStyle',
    title: 'Welke lijkt het meest op hoe jij werkt?',
    options: [
      '“Schrijf een tekst over X”',
      '“Kun je dit verbeteren?”',
      '“Geef 5 ideeën voor…”',
      'Iets uitgebreider met context',
      'Ik probeer van alles door elkaar',
    ],
  },
  {
    id: 'example',
    title: 'Wil je een voorbeeld delen van hoe jij AI gebruikt?',
    subtitle: 'Dan kijken we er kort naar in de intake (optioneel)',
    isText: true,
  },
]

const TOTAL_STEPS = STEPS.length

function buildSummary(answers) {
  return [
    answers.frequency ? `Gebruik: ${answers.frequency}` : null,
    answers.usage ? `Manier: ${answers.usage}` : null,
    answers.recognition ? `Herkenning: ${answers.recognition}` : null,
    answers.promptStyle ? `Promptstijl: ${answers.promptStyle}` : null,
    answers.example ? `Voorbeeld: ${answers.example}` : null,
  ].filter(Boolean)
}

export default function FitCheckModal({ isOpen, onClose }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [example, setExample] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [bookingPopupBlocked, setBookingPopupBlocked] = useState(false)
  const isResult = stepIndex >= TOTAL_STEPS
  const current = STEPS[stepIndex]

  useEffect(() => {
    if (!isOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    setStepIndex(0)
    setAnswers({})
    setExample('')
    setIsSending(false)
    setBookingPopupBlocked(false)
  }, [isOpen])

  const summary = useMemo(() => buildSummary(answers), [answers])

  if (!isOpen) return null

  function chooseOption(value) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }))
    window.setTimeout(() => setStepIndex((prev) => prev + 1), 140)
  }

  function submitExample(event) {
    event.preventDefault()
    setAnswers((prev) => ({ ...prev, example: example.trim() }))
    setStepIndex(TOTAL_STEPS)
  }

  async function sendAnswersBeforeBooking() {
    const completeAnswers = { ...answers, example: example.trim() || answers.example || '' }
    const lines = buildSummary(completeAnswers)
    const formData = new FormData()

    formData.append('_subject', 'Fit-check antwoorden voor intake')
    formData.append('source', 'Fit-check workshoppagina')
    formData.append('frequency', completeAnswers.frequency || '')
    formData.append('usage', completeAnswers.usage || '')
    formData.append('recognition', completeAnswers.recognition || '')
    formData.append('promptStyle', completeAnswers.promptStyle || '')
    formData.append('example', completeAnswers.example || '')
    formData.append('summary', lines.join('\n'))
    formData.append('createdAt', new Date().toISOString())

    const response = await fetch(FIT_CHECK_FORM_URL, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })

    if (!response.ok) {
      throw new Error('fit_check_submit_failed')
    }
  }

  /**
   * Open booking in the same synchronous turn as the click, then send answers in the background.
   * Opening only after `await fetch` is often blocked as a pop-up.
   */
  async function openBooking() {
    const bookingWindow = window.open(BOOKING_URL, '_blank', 'noopener,noreferrer')
    if (!bookingWindow) {
      setBookingPopupBlocked(true)
    }
    setIsSending(true)
    try {
      await sendAnswersBeforeBooking()
    } catch {
      // Intake-antwoorden zijn optioneel; agenda staat al open als de pop-up niet geblokkeerd was.
    } finally {
      setIsSending(false)
      if (bookingWindow) {
        onClose()
      }
    }
  }

  return (
    <div className="fitOverlay" role="presentation" onMouseDown={onClose}>
      <section
        className="fitModal"
        role="dialog"
        aria-modal="true"
        aria-label="Fit-check"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="fitClose" type="button" onClick={onClose} aria-label="Sluit fit-check">
          ×
        </button>

        {!isResult ? (
          <>
            <div className="fitMeta">
              <span>
                {stepIndex + 1}/{TOTAL_STEPS}
              </span>
              <span>max 30 sec</span>
            </div>
            <div className="fitProgress" aria-hidden="true">
              <div className="fitProgressBar" style={{ width: `${((stepIndex + 1) / TOTAL_STEPS) * 100}%` }} />
            </div>

            <div className="fitStep" key={current.id}>
              <h2 className="fitTitle">{current.title}</h2>
              {current.subtitle ? <p className="fitSubtitle">{current.subtitle}</p> : null}

              {current.isText ? (
                <form className="fitForm" onSubmit={submitExample}>
                  <textarea
                    className="fitTextarea"
                    value={example}
                    onChange={(event) => setExample(event.target.value)}
                    placeholder="Bijv. een prompt die je vaak gebruikt..."
                    rows={5}
                    autoFocus
                  />
                  <button className="fitPrimary" type="submit">
                    Verder
                  </button>
                </form>
              ) : (
                <div className="fitOptions">
                  {current.options.map((option) => (
                    <button key={option} className="fitOption" type="button" onClick={() => chooseOption(option)}>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="fitResult">
            <div className="fitMeta">
              <span>Klaar</span>
              <span>persoonlijke intake</span>
            </div>
            <h2 className="fitTitle">Dit is waar je nu zit</h2>
            <p className="fitResultText">
              Je gebruikt AI al, maar vooral als antwoordmachine.
              <br />
              Je mist nog een manier om gericht bij te sturen.
              <br />
              <br />
              Dat is precies waar deze workshop over gaat: werken in iteraties → van ‘oké’ naar scherp en bruikbaar.
            </p>

            {summary.length ? (
              <div className="fitSummary" aria-label="Samenvatting">
                {summary.map((line) => (
                  <div key={line} className="fitSummaryLine">
                    {line}
                  </div>
                ))}
              </div>
            ) : null}

            <button className="fitPrimary fitResultCta" type="button" onClick={openBooking} disabled={isSending}>
              {isSending ? 'ANTWOORDEN WORDEN MEEGESTUURD...' : 'PLAN EEN KORTE INTAKE'}
            </button>
            <div className="fitCtaNote">
              Opent de Outlook-agenda in een nieuw tabblad (15 min, geen salesdruk).
            </div>
            {bookingPopupBlocked ? (
              <p className="fitBookingFallback">
                Je browser blokkeerde het nieuwe tabblad.{' '}
                <a
                  className="fitBookingFallbackLink"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    void sendAnswersBeforeBooking()
                  }}
                >
                  Open de agenda hier
                </a>{' '}
                — je antwoorden sturen we alsnog mee.
              </p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  )
}

