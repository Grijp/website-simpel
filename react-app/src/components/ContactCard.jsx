import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContactCtaContext } from '../lib/getContactCtaContext.js'

function Icon({ name }) {
  if (name === 'user') {
    return (
      <svg viewBox="0 0 24 24" className="ccIcon" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 12.2c2.6 0 4.7-2.1 4.7-4.7S14.6 2.8 12 2.8 7.3 4.9 7.3 7.5s2.1 4.7 4.7 4.7Zm0 2.3c-4 0-7.3 2.1-7.3 4.7 0 1 .8 1.8 1.8 1.8h11c1 0 1.8-.8 1.8-1.8 0-2.6-3.3-4.7-7.3-4.7Z"
        />
      </svg>
    )
  }
  if (name === 'mail') {
    return (
      <svg viewBox="0 0 24 24" className="ccIcon" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20 5.5H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2Zm0 3.1-8 5.3-8-5.3V7.5l8 5.3 8-5.3v1.1Z"
        />
      </svg>
    )
  }
  if (name === 'phone') {
    return (
      <svg viewBox="0 0 24 24" className="ccIcon" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6.6 10.2c1.2 2.3 3.1 4.1 5.4 5.4l1.8-1.8c.3-.3.7-.4 1.1-.3 1 .3 2 .4 3.1.4.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1 .1 2.1.4 3.1.1.4 0 .8-.3 1.1L6.6 10.2Z"
        />
      </svg>
    )
  }
  return null
}

export default function ContactCard({
  variant = 'default',
  name = 'Mathijs van der Grijp',
  email = 'mathijs@principlesai.nl',
  phone = '0610277261',
  ctaHref = '/contact',
  ctaLabel = 'Plan een 30 min call',
  ctaContextText,
  companyName = 'PrinciplesAI',
  logoSrc = '/logo.svg',
}) {
  const navigate = useNavigate()

  const contextText = useMemo(() => {
    if (typeof ctaContextText === 'string' && ctaContextText.trim()) return ctaContextText.trim()
    return getContactCtaContext('contact')
  }, [ctaContextText])

  const onCta = () => {
    if (typeof ctaHref !== 'string' || !ctaHref) return
    if (ctaHref.startsWith('/')) navigate(ctaHref)
    else window.open(ctaHref, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="cc" data-variant={variant} aria-label="Contactkaart">
      <div className="ccCard" role="group" aria-label="Visitekaartje">
        <div className="ccLeft" aria-label="Merk">
          <div className="ccLogoWrap" aria-hidden="true">
            <img className="ccLogo" src={logoSrc} alt="" />
          </div>
          <div className="ccBrand">{companyName}</div>
        </div>

        <div className="ccDivider" aria-hidden="true" />

        <div className="ccRight" aria-label="Contactgegevens">
          <div className="ccHeader">
            <span className="ccIconChip" aria-hidden="true">
              <Icon name="user" />
            </span>
            <div className="ccName">{name}</div>
          </div>

          <div className="ccInfo">
            <div className="ccInfoRow">
              <span className="ccIconChip" aria-hidden="true">
                <Icon name="mail" />
              </span>
              <div className="ccInfoText">
                <div className="ccLabel">Email</div>
                <a className="ccValue" href={`mailto:${email}`} title={email}>
                  {email}
                </a>
              </div>
            </div>

            <div className="ccInfoRow">
              <span className="ccIconChip" aria-hidden="true">
                <Icon name="phone" />
              </span>
              <div className="ccInfoText">
                <div className="ccLabel">Tel</div>
                <a className="ccValue" href={`tel:${phone}`} title={phone}>
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ccCta">
        <div className="ccCtaText">{contextText}</div>
        <button type="button" className="btn btn-primary" onClick={onCta}>
          {ctaLabel}
        </button>
      </div>
    </section>
  )
}

