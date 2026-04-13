import { Link } from 'react-router-dom'

export default function LearnPage() {
  return (
    <div className="container">
      <div className="kicker">Even uit je sleur...</div>

      <div className="hero-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div>
          <div className="h1">
            Leer werken met taalmodellen
            <br />
            zoals ze echt werken
          </div>
          <div className="sublead">
            Een training van een dagdeel waarin je ontdekt hoe je AI niet als tool, maar als denkruimte kunt gebruiken.
          </div>

          <div className="rule" />

          <div className="steps">
            <div className="step">
              <h3>1. Ruwe gedachte droppen</h3>
              <p>(Chaotische, eigen input.)</p>
            </div>
            <div className="arrow" aria-hidden="true">
              →
            </div>
            <div className="step">
              <h3>2. Strategisch spiegelen</h3>
              <p>(Gerichte, kritische vragen.)</p>
            </div>
            <div className="arrow" aria-hidden="true">
              →
            </div>
            <div className="step">
              <h3>3. Kristallisatie &amp; Concreet resultaat</h3>
              <p>(Formuleer een haarscherpe conclusie.)</p>
            </div>
          </div>

          <div className="bullets">
            <div className="bullet">
              <span className="icon">≡</span>
              <span>Gebruik ruwe input als startpunt</span>
            </div>
            <div className="bullet">
              <span className="icon">◔</span>
              <span>Begrijp welk woord wat</span>
            </div>
            <div className="bullet">
              <span className="icon">⇄</span>
              <span>Stuur gericht, tik 1 ding aan tegelijk</span>
            </div>
          </div>

          <div className="h2">Voor wie al met AI werkt, maar voelt: ‘Zit er niet meer in?’</div>

          <div className="cta-wrap">
            <button className="btn btn-primary btn-wide" onClick={() => alert('Placeholder: inschrijven flow')}>
              [ IK ZEG ‘JA’ EN SCHRIJF ME IN ]
            </button>
            <Link className="linkish" to="/">
              Beschikbare data &amp; prijzen
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

