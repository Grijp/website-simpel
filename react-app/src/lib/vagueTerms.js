// Rule-based first layer: fast, deterministic, easy to extend.
// Later we can add a second (LLM-based) layer without changing the UI contract.

/**
 * @typedef {'low'|'medium'|'high'} Severity
 *
 * @typedef VagueTerm
 * @property {string} id
 * @property {string} label
 * @property {Severity} severity
 * @property {(string|RegExp)[]} patterns
 * @property {string} why
 * @property {string} suggestion
 */

/** @type {VagueTerm[]} */
export const VAGUE_TERMS = [
  {
    id: 'strategie',
    label: 'strategie',
    severity: 'medium',
    patterns: ['strategie', 'strategisch'],
    why: '“Strategie” kan van alles betekenen: richting, keuzes, of een aanpak. Zonder context is het open voor interpretatie.',
    suggestion: 'Welke strategie precies? (bijv. pricing, marketing, product, hiring) + doel + tijdshorizon + constraints.',
  },
  {
    id: 'innovatie',
    label: 'innovatie',
    severity: 'medium',
    patterns: ['innovatie', 'innoveren'],
    why: '“Innovatie” zegt nog niet wat er nieuw moet zijn of waarom.',
    suggestion: 'Wat is er nieuw (proces/product/tech) + voor wie + welk probleem + gewenste impact (meetbaar)?',
  },
  {
    id: 'plan-van-aanpak',
    label: 'plan van aanpak',
    severity: 'low',
    patterns: ['plan van aanpak', 'aanpak', 'roadmap'],
    why: '“Plan van aanpak” is vaak te generiek: het mist scope en deliverables.',
    suggestion: 'Noem scope + deliverables + fasering + eigenaars + deadline + succescriteria.',
  },
  {
    id: 'optimalisatie',
    label: 'optimalisatie',
    severity: 'medium',
    patterns: ['optimalisatie', 'optimaliseren'],
    why: '“Optimaliseren” vraagt: wát optimaliseer je en welke trade-offs accepteer je?',
    suggestion: 'Wat is de metric (tijd/kosten/conversie/kwaliteit) + huidige baseline + target + trade-offs.',
  },
  {
    id: 'oplossing',
    label: 'oplossing',
    severity: 'low',
    patterns: ['oplossing', 'oplossen'],
    why: '“Oplossing” zonder probleemdefinitie leidt snel tot aannames.',
    suggestion: 'Omschrijf het probleem + context + voorbeelden + gewenste uitkomst.',
  },
  {
    id: 'verbeteren',
    label: 'verbeteren',
    severity: 'medium',
    patterns: ['verbeteren', 'verbetering', 'beter maken'],
    why: '“Verbeteren” is vaag zonder metric of criterium.',
    suggestion: 'Wat betekent “beter” hier? Kies 1 metric + baseline + target + deadline.',
  },
  {
    id: 'efficientie',
    label: 'efficiëntie',
    severity: 'medium',
    patterns: ['efficiëntie', 'efficientie', 'efficiënter', 'efficienter'],
    why: '“Efficiëntie” kan gaan over tijd, kosten, effort, of throughput.',
    suggestion: 'Welke efficiency (tijd/kosten/handmatige stappen) + huidige situatie + gewenste reductie (% of tijd).',
  },
  {
    id: 'waarde',
    label: 'waarde',
    severity: 'high',
    patterns: ['waarde', 'waardevol', 'meerwaarde'],
    why: '“Waarde” is heel interpretatiegevoelig: voor wie, en hoe meet je dat?',
    suggestion: 'Voor wie is het waardevol + welk effect + hoe meet je dit (KPI/indicator) + tijdspad.',
  },
  {
    id: 'schaalbaar',
    label: 'schaalbaar',
    severity: 'medium',
    patterns: ['schaalbaar', 'opschalen', 'scalable'],
    why: '“Schaalbaar” vraagt: schaal van wát (users, omzet, data) en waar zit de bottleneck?',
    suggestion: 'Wat moet schalen + target (bijv. 10k→100k users) + bottlenecks + budget/infra constraints.',
  },
  {
    id: 'framework',
    label: 'framework',
    severity: 'low',
    patterns: ['framework', 'raamwerk'],
    why: '“Framework” is breed: wil je een model, stappenplan, of beslisboom?',
    suggestion: 'Welk type (stappenplan/checklist/decision tree) + onderwerp + output format.',
  },
]

