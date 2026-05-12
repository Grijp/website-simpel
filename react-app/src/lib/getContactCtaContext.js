function hasAny(text, terms) {
  return terms.some((t) => text.includes(t))
}

/**
 * Lightweight, production-safe heuristic for CTA context copy.
 * We avoid echoing the user message; we only pick a fitting, calm rationale.
 */
export function getContactCtaContext(userMessage) {
  const raw = typeof userMessage === 'string' ? userMessage : ''
  const msg = raw.trim().toLowerCase()
  if (!msg) return 'Je kunt direct contact opnemen of een vrijblijvende kennismaking plannen.'

  const isContactDetails = hasAny(msg, ['contactgegevens', 'contact gegevens', 'email', 'e-mail', 'mail', 'telefoon', 'tel', 'nummer', 'bereiken'])
  if (isContactDetails) return 'Je kunt direct contact opnemen of een korte kennismaking plannen.'

  const isAppointment = hasAny(msg, ['afspraak', 'inplannen', 'boeken', 'booking', 'kennismaking', 'kennismaken', 'call', 'gesprek'])
  if (isAppointment) return 'Een korte kennismaking is een simpele manier om je vraag goed scherp te krijgen.'

  const isSpar = hasAny(msg, ['sparren', 'meedenken', 'overleggen', 'even bellen', 'kort bellen', 'samen kijken'])
  if (isSpar) return 'Een korte call is de snelste manier om je situatie samen te verkennen.'

  const isFit = hasAny(msg, ['wat past', 'passend', 'welke', 'beste', 'aanraden', 'advies', 'mogelijkheden', 'opties'])
  if (isFit) return 'In een korte call kunnen we bekijken wat het best aansluit op jouw situatie.'

  return 'Een korte call is een handige manier om je vraag samen door te nemen.'
}

