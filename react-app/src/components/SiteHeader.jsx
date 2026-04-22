import { Link, useLocation } from 'react-router-dom'

import logoSvg from '/logo.svg?raw'

export default function SiteHeader() {
  const { pathname } = useLocation()

  return (
    <header className="lpHeader">
      <Link className="lpBrand lpHomeLink" to="/" aria-label="Ga naar home">
        <span className="lpMark" aria-hidden="true">
          <span
            className="lpMarkSvg"
            // `logo.svg` uses `currentColor`, so CSS can control it.
            dangerouslySetInnerHTML={{ __html: logoSvg }}
          />
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
    </header>
  )
}

