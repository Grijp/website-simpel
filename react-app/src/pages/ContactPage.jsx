import { ValidationError, useForm } from '@formspree/react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { BOOKING_URL } from '../lib/booking.js'

export default function ContactPage() {
  const [state, handleSubmit] = useForm('mnjlblqn')

  return (
    <div className="container">
      <div className="lpShell">
        <SiteHeader />

        <main className="lpMain">
          <h1 className="lpH1">Je gebruikt AI. Maar het kan beter.</h1>
          <div className="lpH2">Kijk waar je winst laat liggen.</div>

          <section className="contactPrimary" aria-label="Plan een gesprek">
            <a className="lpCtaDark contactPlanBtn" href={BOOKING_URL} target="_blank" rel="noreferrer">
              <span>Kijk in 30 minuten wat er beter kan</span>
              <span className="lpArrow" aria-hidden="true">
                ›
              </span>
            </a>
          </section>

          <section className="contactSecondary" aria-label="Contactformulier">
            <div className="contactTitle">Liever eerst iets vragen?</div>
            <div className="contactDesc" />

            {state.succeeded ? (
              <div className="contactSuccess" role="status" aria-live="polite">
                Bericht ontvangen. Dankjewel—ik kom er snel bij je op terug.
              </div>
            ) : (
              <form className="contactForm" onSubmit={handleSubmit} noValidate>
                <div className="contactField">
                  <label className="contactLabel" htmlFor="name">
                    Je naam
                  </label>
                  <input
                    className="contactControl"
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Je naam"
                    required
                    disabled={state.submitting}
                  />
                  <ValidationError prefix="Je naam" field="name" errors={state.errors} />
                </div>

                <div className="contactField">
                  <label className="contactLabel" htmlFor="email">
                    E-mail
                  </label>
                  <input
                    className="contactControl"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="naam@bedrijf.nl"
                    required
                    disabled={state.submitting}
                  />
                  <ValidationError prefix="E-mail" field="email" errors={state.errors} />
                </div>

                <div className="contactField">
                  <label className="contactLabel" htmlFor="message">
                    Wat wil je scherper krijgen?
                  </label>
                  <textarea
                    className="contactControl contactTextarea"
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Wat wil je scherper krijgen?"
                    required
                    disabled={state.submitting}
                  />
                  <ValidationError prefix="Bericht" field="message" errors={state.errors} />
                </div>

                <div className="contactActions">
                  <button className="btn btn-secondary contactSubmit" type="submit" disabled={state.submitting}>
                    {state.submitting ? 'Versturen…' : 'Stel je vraag'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}

