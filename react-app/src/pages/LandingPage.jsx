import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="container">
      <div className="kicker">Even uit je sleur...</div>

      <div className="hero-block">
        <div className="hero-grid">
          <div className="hero-text">
            <div className="bigline">Jij gebruikt het:</div>
            <div className="input-mock" aria-hidden="true">
              <span>Tik een vraag...</span>
              <span className="bolt">⚡</span>
            </div>

            <div style={{ height: 18 }} />

            <div className="bigline">Maar gebruikt het nog niet echt.</div>
            <div className="lead">Wat zie je nu over het hoofd?</div>

            <div className="mid-rail" aria-hidden="true">
              <span>Net goed genoeg</span>
              <span>Maar aan de oppervlakte</span>
              <span>Wat mis je hier?</span>
            </div>
          </div>

          <div className="card ui-card hero-visual" aria-hidden="true">
            <div className="ui-top">
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className="dot">✦</span>
                <span>AI Model</span>
              </div>
              <span className="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="ui-input">Tik een vraag...</div>
            <div className="ui-row" />
            <div className="ui-row" />
            <div className="ui-row" />
            <div className="wire" aria-hidden="true" />
          </div>
        </div>

        <div className="cta-center">
          <button className="btn btn-primary" onClick={() => navigate('/leren')}>
            JA, IK WIL HET ÉCHT LEREN GEBRUIKEN
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/leren')}>
            Kijk verder dan de oppervlakte
          </button>
        </div>
      </div>

      <div className="squares" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}

