import { Link, useLocation } from 'react-router-dom'
import logoUrl from '/logo.svg'

export default function SiteHeader() {
  const { pathname } = useLocation()

  return (
    <header className="lpHeader">
      <Link className="lpBrand lpHomeLink" to="/" aria-label="Ga naar home">
        <span className="lpMark" aria-hidden="true">
          <img className="lpMarkImg" src={logoUrl} alt="" />
        </span>
        <span className="lpBrandText">PRINCIPLESAI</span>
      </Link>

      <nav className="lpNav" aria-label="Navigatie">
        <Link to="/" className={`lpTab lpNavLink ${pathname === '/' ? 'isActive' : ''}`}>
          HOME
        </Link>
        <Link to="/contact" className={`lpTab lpNavLink ${pathname === '/contact' ? 'isActive' : ''}`}>
          CONTACT
        </Link>
      </nav>

      <Link className="lpHeaderCta" to="/contact">
        Plan gesprek
      </Link>
    </header>
  )
}

