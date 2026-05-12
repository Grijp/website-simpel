import { Link } from 'react-router-dom'
import HeroBrainCircuitVisual from './HeroBrainCircuitVisual.jsx'

function FeatureIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true }
  switch (name) {
    case 'brain':
      return (
        <svg {...common}>
          <path
            d="M12 4c-1.2 0-2.3.4-3.2 1.1-.6-.4-1.3-.6-2.1-.6-2 0-3.6 1.6-3.6 3.6 0 .3 0 .6.1.9-1 .6-1.7 1.7-1.7 3 0 1.2.6 2.2 1.5 2.8-.1.3-.1.6-.1.9 0 2 1.6 3.6 3.6 3.6.8 0 1.5-.2 2.1-.6.9.7 2 1.1 3.2 1.1s2.3-.4 3.2-1.1c.6.4 1.3.6 2.1.6 2 0 3.6-1.6 3.6-3.6 0-.3 0-.6-.1-.9.9-.6 1.5-1.6 1.5-2.8 0-1.3-.7-2.4-1.7-3 .1-.3.1-.6.1-.9 0-2-1.6-3.6-3.6-3.6-.8 0-1.5.2-2.1.6-.9-.7-2-1.1-3.2-1.1Z"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
          <path d="M9 10h.01M15 10h.01M10 14c.8.6 1.8.9 2.9.7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      )
    case 'target':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.35" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </svg>
      )
    case 'sliders':
      return (
        <svg {...common}>
          <path d="M4 7h16M8 7v5M16 12v5M4 17h16" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
          <circle cx="8" cy="7" r="2" fill="currentColor" />
          <circle cx="16" cy="12" r="2" fill="currentColor" />
        </svg>
      )
    case 'spark':
      return (
        <svg {...common}>
          <path
            d="M12 3l1.2 4.2L17 8.5l-3.8 1.3L12 14l-1.2-4.2L7 8.5l3.8-1.3L12 3Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path d="M18 14l.5 1.8 1.8.5-1.8.5-.5 1.8-.5-1.8-1.8-.5 1.8-.5.5-1.8Z" fill="currentColor" opacity=".85" />
        </svg>
      )
    default:
      return null
  }
}

export function HomeHero({ onOpenFitCheck, timelineSteps = [] }) {
  return (
    <section className="homeHero" aria-labelledby="home-title">
      <div className="homeHeroStack">
        <div className="homeHeroDesktop">
          <div className="homeHeroMainCol">
            <div className="homeHeroCopy">
              <p className="homeEyebrow">AI ALS VERLENGSTUK VAN JOUW DENKEN</p>

              <h1 id="home-title" className="homeHeroTitle">
                Werk met AI zonder <span className="homeHeroAccent">jezelf</span> te verliezen.
              </h1>

              <p className="homeHeroSub">
                Een praktische training voor mensen die <strong>denken</strong>, <strong>schrijven</strong> en{' '}
                <strong>beslissen</strong>.
              </p>
            </div>

            <div className="homeCtaBlock">
              <button className="homePrimaryCta lpCtaDark" type="button" onClick={onOpenFitCheck}>
                <span>Start de training</span>
                <span className="lpArrow" aria-hidden="true">
                  →
                </span>
              </button>

              <Link className="homeSecondaryLink homeTalkLink homeTalkLink--calendar" to="/contact">
                <span className="homeCalendarIcon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 3.5v4M16 3.5v4M3.5 10h17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
                Plan een gesprek
              </Link>
            </div>
          </div>

          <div className="homeHeroGraphicWrap">
            <HeroBrainCircuitVisual className="homeHeroGraphicVisual" />
          </div>
        </div>

        {timelineSteps.length > 0 ? (
          <ol className="homeHeroTimeline" aria-label="Aanpak in stappen">
            {timelineSteps.map((step, i) => (
              <li className="homeHeroTimelineItem" key={step.line}>
                <span className="homeHeroTimelineDot">{i + 1}</span>
                <span className="homeHeroTimelineLabel">{step.label}</span>
                <span className="homeHeroTimelineLine">{step.line}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      <div className="homeHeroWave" aria-hidden="true">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="homeHeroWaveSvg">
          <path
            className="homeHeroWaveFill"
            d="M0,55 C240,5 480,5 720,38 C960,72 1200,72 1440,42 L1440,100 L0,100 Z"
          />
        </svg>
      </div>
    </section>
  )
}

export function HomeClaritySection({ pillars = [] }) {
  return (
    <section className="homeTrainingSection homeFeaturesLight" aria-labelledby="home-training-title">
      <div className="homeFeaturesInner">
        <header className="homeFeaturesHeader">
          <p className="homeTrainingLabel homeFeaturesKicker">GEEN THEORIE.</p>
          <h2 id="home-training-title" className="homeFeaturesTitle">
            Je werkt met je{' '}
            <span className="homeFeaturesEm">
              eigen taken.
              <svg className="homeFeaturesScribble" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M4,10 C40,2 90,2 130,6 C160,8 188,10 196,6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
        </header>

        <div className="homeWorkshop" aria-label="Praktische workshop">
          <p className="homeWorkshopLabel">PRAKTISCHE WORKSHOP (3 UUR)</p>
          <p className="homeWorkshopLead">Je begint met een taak die op je to-do lijst staat.</p>
          <p className="homeWorkshopKicker">Daarna leer je:</p>
          <ul className="homeWorkshopList">
            <li>hoe je richting geeft</li>
            <li>hoe kleine nuances output veranderen</li>
            <li>en hoe je steeds dichter komt bij wat je eigenlijk bedoelt</li>
          </ul>
        </div>

        <ul className="homeFeatureGrid">
          {pillars.map((item) => (
            <li className="homeFeatureCard" key={item.title}>
              <div className="homeFeatureIconWrap">
                <FeatureIcon name={item.icon} />
              </div>
              <h3 className="homeFeatureCardTitle">{item.title}</h3>
              <p className="homeFeatureCardDesc">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function HomeProcessSection({ activeProcessStep, onSelectStep, processSteps }) {
  return (
    <section className="homeProcessSection" aria-labelledby="home-process-title">
      <h2 id="home-process-title" className="homeProcessTitle">
        Van denken naar doen. In 3 stappen.
      </h2>

      <div className="homeProcessAccordion">
        {processSteps.map((step, index) => {
          const isOpen = activeProcessStep === index
          return (
            <article className={`homeProcessItem${isOpen ? ' isOpen' : ''}`} key={step.title}>
              <button
                className="homeProcessButton"
                type="button"
                aria-expanded={isOpen}
                onClick={() => onSelectStep(index)}
              >
                <span>{index + 1}</span>
                {step.title}
              </button>
              <p>{step.text}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export function HomeOfferSection({ offers }) {
  return (
    <section className="homeOfferSection" aria-labelledby="home-offer-title">
      <h2 id="home-offer-title">Verdiep met 1-op-1.</h2>
      <div className="homeOfferProgression">
        <HomeOfferStage label="VERDIEP" title="1-op-1 traject" icon="⊙" items={offers.personal} isFollowUp />
        <p className="homeOfferEndState">Een nieuwe manier van werken</p>
      </div>
    </section>
  )
}

function HomeOfferStage({ label, title, icon, items, isFollowUp = false }) {
  return (
    <article className={`homeOfferStage${isFollowUp ? ' isFollowUp' : ''}`}>
      <span className="homeOfferStageLabel">{label}</span>
      <div className="homeOfferCard">
        <span className="homeOfferIcon" aria-hidden="true">
          {icon}
        </span>
        <div className="homeOfferCardText">
          <h3>{title}</h3>
          <div className="homeOfferFlowText">
            {items.map((item, index) => (
              <span className={index === 2 ? 'isHighlight' : index === 3 ? 'isMeta' : ''} key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export function HomeStatementSection() {
  return (
    <section className="homeStatementSection" aria-label="PrinciplesAI statement">
      <p>
        <span>Het is geen AI die het werk doet.</span>
        <br />
        <strong>Het is AI die je helpt beter te denken.</strong>
      </p>
    </section>
  )
}

export function HomeFinalCta() {
  return (
    <section className="homeFinalCtaSection" aria-labelledby="home-final-cta-title">
      <div className="homeFinalCtaCard">
        <div className="homeFinalCtaRow">
          <span className="homeFinalCtaGlyph" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3v18M8 8c2-1 4-1 6 0M8 16c2 1 4 1 6 0"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path d="M6 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".5" />
            </svg>
          </span>
          <h2 id="home-final-cta-title" className="homeFinalCtaHeading">
            Klaar om <em>meer uit jezelf</em> te halen met AI?
          </h2>
        </div>
        <Link className="homeFinalCtaButton" to="/contact">
          Plan een gesprek <span className="homeFinalCtaBtnArrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

export function MobileStickyCta() {
  return (
    <div className="mobileStickyCta" aria-label="Plan een gesprek">
      <div className="mobileStickyText">
        <span className="mobileStickyIcon" aria-hidden="true">
          □
        </span>
        <span>
          Klaar om <strong>meer uit jezelf</strong>
          <br />
          te halen met AI?
        </span>
      </div>

      <Link className="mobileStickyButton" to="/contact">
        Plan een gesprek <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
