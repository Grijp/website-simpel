export default function SiteFooter() {
  return (
    <footer className="siteFooter" aria-label="Contactgegevens">
      <div className="siteFooterInner">
        <div className="siteFooterBlock">
          <div className="siteFooterLabel">CONTACT</div>
          <div className="siteFooterLine">
            <a className="siteFooterLink" href="tel:+31610277261">
              06 10277261
            </a>
            <span className="siteFooterSep" aria-hidden="true">
              ·
            </span>
            <a className="siteFooterLink" href="mailto:mathijs@principlesai.nl">
              mathijs@principlesai.nl
            </a>
            <span className="siteFooterSep" aria-hidden="true">
              ·
            </span>
            <a
              className="siteFooterLink"
              href="https://www.linkedin.com/in/mathijs-van-der-grijp-b6a34a119/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

