/**
 * Central mode profiles for orchestration/testing.
 * Keep this file dependency-free so it can be reused on server/client.
 */

export const MODE_CONFIG = {
  info: {
    goal: 'Beantwoord feitelijke/praktische vragen kort en duidelijk.',
    knowledgeFocus: ['practical', 'facts', 'steps'],
    preferredBlocks: ['contactCard', 'faq', 'pricing'],
    followUpStyle: 'Vraag alleen door als de vraag te vaag is voor een praktisch antwoord.',
  },
  explanation: {
    goal: 'Maak begrip: leg uit waarom/hoe, inclusief verschillen en oorzaken.',
    knowledgeFocus: ['concepts', 'causality', 'differences'],
    preferredBlocks: ['conceptExplanation', 'comparison', 'deepDive'],
    followUpStyle: 'Vraag 1 verduidelijking (doel of voorkennis) als dat helpt de uitleg te richten.',
  },
  fit: {
    goal: 'Help kiezen wat passend is in de context van de gebruiker (advies).',
    knowledgeFocus: ['context', 'tradeoffs', 'recommendations'],
    preferredBlocks: ['personaSummary', 'recommendedPath', 'whyThisFits'],
    followUpStyle: 'Stel 1-2 gerichte vragen als context ontbreekt om advies te onderbouwen.',
  },
  assessment: {
    goal: 'Doe een korte intake/scan en geef een diagnose-achtige samenvatting + volgende stap.',
    knowledgeFocus: ['intake', 'signals', 'diagnosis', 'next-steps'],
    preferredBlocks: ['assessmentIntro', 'diagnosticSummary', 'actionPlan'],
    followUpStyle: 'Vraag gestructureerd door (max 3) en wees expliciet over wat je nodig hebt.',
  },
}

export const MODES = /** @type {const} */ (['info', 'explanation', 'fit', 'assessment'])

