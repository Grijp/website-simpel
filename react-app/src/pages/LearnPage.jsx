import { useState } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import FitCheckModal from '../components/FitCheckModal.jsx'

export default function LearnPage() {
  const [isFitCheckOpen, setIsFitCheckOpen] = useState(false)

  return (
    <div className="container">
      <div className="lpShell">
        <SiteHeader />

        <main className="ws2">
          <section className="ws2Hero" aria-labelledby="workshop-title">
            <div className="ws2Top">
              <div className="ws2Pill" aria-label="Workshop">
                WORKSHOP
              </div>
            </div>

            <h1 id="workshop-title" className="ws2H1">
              Waarom AI je nog niet echt helpt
            </h1>

            <p className="ws2Lead">Je stelt vragen. Je krijgt antwoorden. Maar daar stopt het.</p>
          </section>

          <div className="ws2Divider" aria-hidden="true" />

          <section className="ws2Section ws2ProcessSection" aria-labelledby="process-title">
            <h2 id="process-title" className="ws2H2">
              Zo los je dat op
            </h2>

            <div className="ws2FlowCard" aria-label="Input naar output proces">
              <div className="ws2FlowSteps">
                <div className="ws2Step">
                  <div className="ws2StepIcon" aria-hidden="true">
                    ✎
                  </div>
                  <div className="ws2StepTitle">Input</div>
                  <div className="ws2StepDesc">Je geeft input</div>
                </div>

                <div className="ws2Arrow" aria-hidden="true">
                  →
                </div>

                <div className="ws2Step">
                  <div className="ws2StepIcon" aria-hidden="true">
                    ✦
                  </div>
                  <div className="ws2StepTitle">Output</div>
                  <div className="ws2StepDesc">Je krijgt resultaat</div>
                </div>

                <div className="ws2Arrow" aria-hidden="true">
                  →
                </div>

                <div className="ws2Step">
                  <div className="ws2StepIcon" aria-hidden="true">
                    ≋
                  </div>
                  <div className="ws2StepTitle">Aanpassen</div>
                  <div className="ws2StepDesc">Je stuurt bij</div>
                </div>

                <div className="ws2Arrow" aria-hidden="true">
                  →
                </div>

                <div className="ws2Step">
                  <div className="ws2StepIcon" aria-hidden="true">
                    ↻
                  </div>
                  <div className="ws2StepTitle">Opnieuw</div>
                  <div className="ws2StepDesc">Je verfijnt verder</div>
                </div>
              </div>
            </div>

          </section>

          <section className="ws2OfferSection" aria-labelledby="offer-title">
            <h2 id="offer-title" className="ws2H2">
              Zo ziet dat er concreet uit
            </h2>

            <div className="ws2InfoGrid" aria-label="Workshop en vervolgtraject">
              <article className="ws2InfoCard">
                <h2>Praktische workshop (3 uur)</h2>
                <p>In één dagdeel werk je met je eigen taken en leer je hoe je AI direct toepast in je werk.</p>

                <h3>Wat je doet</h3>
                <ul>
                  <li>Korte introductie: wat AI is en hoe het werkt</li>
                  <li>Werken met je eigen taken</li>
                  <li>Oefenen met input → output → aanpassen → opnieuw</li>
                  <li>Direct resultaat zien</li>
                </ul>

                <h3>Wat je eruit haalt</h3>
                <ul>
                  <li>Je weet hoe je moet beginnen</li>
                  <li>Je weet hoe je moet bijsturen</li>
                  <li>Je krijgt sneller bruikbare output</li>
                </ul>
              </article>

              <article className="ws2InfoCard">
                <h2>Voor wie verder wil</h2>
                <h3>1-op-1 traject (4 weken)</h3>
                <p>Voor mensen die dit niet alleen willen begrijpen, maar echt willen toepassen in hun werk.</p>

                <h3>Hoe dat werkt</h3>
                <ul>
                  <li>4 weken</li>
                  <li>1 sessie per week online</li>
                  <li>Werken met jouw eigen werkproces</li>
                </ul>

                <h3>Waar we aan werken</h3>
                <ul>
                  <li>Hoe je AI structureel inzet</li>
                  <li>Waar je tijd verliest en waar winst zit</li>
                  <li>Hoe je sneller en met meer grip werkt</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="ws2CtaBlock" aria-label="Check of de workshop past">
            <p className="ws2CtaLead">
              Dit is geen theorie.
              <br />
              Je werkt met je eigen werk en ziet direct resultaat.
            </p>

            <button className="ws2Cta" type="button" onClick={() => setIsFitCheckOpen(true)}>
              <span>CHECK OF DIT BIJ MIJ PAST</span>
              <span className="ws2CtaArrow" aria-hidden="true">
                ›
              </span>
            </button>

            <p className="ws2CtaSub">Korte intake, geen sales.</p>

            <div className="ws2Trust" aria-label="Kenmerken">
              <span className="ws2Dot" aria-hidden="true" />
              Werkt met je eigen werk
              <span className="ws2Sep" aria-hidden="true">
                |
              </span>
              <span className="ws2Dot" aria-hidden="true" />
              Geen voorbereiding nodig
              <span className="ws2Sep" aria-hidden="true">
                |
              </span>
              <span className="ws2Dot" aria-hidden="true" />
              Direct toepasbaar
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>

      <FitCheckModal isOpen={isFitCheckOpen} onClose={() => setIsFitCheckOpen(false)} />
    </div>
  )
}

