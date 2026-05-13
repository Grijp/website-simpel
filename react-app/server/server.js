import 'dotenv/config'
import express from 'express'
import { performance } from 'node:perf_hooks'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { analyzePrompt } from './promptAnalysis.js'
import { safeParseAgentResponse } from '../shared/pageConfigSchema.js'
import { MODE_CONFIG } from '../shared/modeConfig.js'
import { safeParseAgentTestResponse } from '../shared/agentTestSchema.js'
import { safeParseAnalyzeModeResponse } from '../shared/analyzeModeSchema.js'
import {
  AnalysisOutputSchema,
  FlowModelOutputSchema,
  StageBlockSchema,
  safeParseFlowResponse,
} from '../shared/flowSchema.js'

const app = express()

app.use(express.json({ limit: '1mb' }))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

if (process.env.DEBUG_STATIC === '1') {
  app.get('/api/debug-static', (_req, res) => {
    const distDir = path.resolve(__dirname, '..', 'dist')
    const distExists = fs.existsSync(distDir)
    const shouldServeStatic = process.env.SERVE_STATIC !== '0' && distExists
    res.json({
      distDir,
      distExists,
      shouldServeStatic,
      nodeEnv: process.env.NODE_ENV ?? null,
      serveStaticEnv: process.env.SERVE_STATIC ?? null,
    })
  })
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body ?? {}
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'message is required' })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not set on server' })
    }

    const { default: OpenAI } = await import('openai')
    const client = new OpenAI({ apiKey })

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content:
            'Je bent een behulpzame Nederlandse chatbot. Antwoord kort, duidelijk en vriendelijk.',
        },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    })

    const text = completion.choices?.[0]?.message?.content ?? ''
    return res.json({ text })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Chat error:', err)

    const status = Number(err?.status || err?.response?.status || 500)
    const detail =
      err?.error?.message ||
      err?.message ||
      err?.response?.data?.error?.message ||
      'Unknown error'

    return res.status(Number.isFinite(status) ? status : 500).json({
      error: 'chat_failed',
      detail,
    })
  }
})

function includesAny(haystack, needles) {
  return needles.some((n) => haystack.includes(n))
}

function detectKnowledgeDomain(t) {
  if (includesAny(t, ['prijs', 'prijzen', 'kosten', 'tarief', 'pricing'])) return 'pricing'
  if (includesAny(t, ['contact', 'afspraak', 'boeken', 'bookings', 'call'])) return 'contact'
  if (includesAny(t, ['workshop', 'leren', 'training', 'programma'])) return 'training'
  if (includesAny(t, ['prompt', 'chat', 'model', 'llm', 'openai'])) return 'ai_usage'
  return 'general'
}

function chooseMode(message) {
  const t = String(message ?? '').trim().toLowerCase()

  const wantsAssessment = includesAny(t, [
    'assessment',
    'diagnose',
    'scan',
    'inschatting',
    'beoordeel',
    'analyseer',
    'audit',
    'check',
  ])

  if (wantsAssessment) {
    return {
      mode: 'assessment',
      reason: 'Je vraagt expliciet om een scan/assessment/diagnose/inschatting. Dat vraagt om intake-achtige vragen en een samenvatting.',
    }
  }

  const explanationCue = includesAny(t, ['waarom', 'hoe werkt', 'hoe komt', 'verschil', 'oorzaak', 'uitleg', 'leg uit'])
  const adviceCue = includesAny(t, [
    'wat past',
    'is dit geschikt',
    'welke optie',
    'wat raad je',
    'aanbevelen',
    'moet ik',
    'zouden wij',
    'wat is beter voor',
  ])
  const hasContext = includesAny(t, ['ik ', 'wij ', 'ons ', 'mijn ', 'team', 'bedrijf', 'klant', 'situatie'])

  // Fit only if it is truly an advice question + some context.
  if (adviceCue && hasContext) {
    return {
      mode: 'fit',
      reason: 'Je stelt een adviesvraag (“wat past/raad je aan…”) in combinatie met context over jou/jullie situatie. Dat vraagt om fit/redenering.',
    }
  }

  if (explanationCue) {
    return {
      mode: 'explanation',
      reason: 'Je vraagt om begrip/uitleg (waarom/hoe/verschil/oorzaak). Daarom is explanation het meest passend.',
    }
  }

  return {
    mode: 'info',
    reason: 'Dit lijkt vooral een praktische of feitelijke vraag zonder duidelijke uitleg- of advies-intentie. Daarom kies ik info.',
  }
}

function needsFollowUp(mode, message) {
  const t = String(message ?? '').trim()
  if (t.length < 12) return true
  if (mode === 'fit' && t.length < 40) return true
  if (mode === 'assessment' && t.length < 40) return true
  return false
}

function suggestNextMode({ mode, needsFollowUp: nf }) {
  if (mode === 'fit' && nf) return 'assessment'
  if (mode === 'info' && nf) return 'explanation'
  return null
}

app.post('/api/agent-test', (req, res) => {
  try {
    const { message } = req.body ?? {}
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'message is required' })
    }

    const { mode, reason } = chooseMode(message)
    const domain = detectKnowledgeDomain(message.toLowerCase())
    const profile = MODE_CONFIG[mode] || MODE_CONFIG.info

    const nf = needsFollowUp(mode, message)

    const payload = {
      mode,
      reason,
      knowledgeDomain: domain,
      blocks: profile.preferredBlocks,
      needsFollowUp: nf,
      suggestedNextMode: suggestNextMode({ mode, needsFollowUp: nf }),
    }

    const checked = safeParseAgentTestResponse(payload)
    if (!checked.success) {
      return res.status(500).json({ error: 'invalid_agent_test_server_payload', detail: checked.error.issues })
    }

    return res.json(checked.data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Agent test error:', err)
    return res.status(500).json({ error: 'agent_test_failed', detail: err?.message || 'Unknown error' })
  }
})

const ANALYZE_MODE_SYSTEM = `
Je bent een classificatie-model op een website die trainingen/workshops in taalmodellen (LLMs) aanbiedt.
De gebruiker typt een vraag of beschrijft een situatie.

Jouw taak:
- Geef GEEN inhoudelijk antwoord.
- Classificeer alleen naar de juiste modus: info | uitleg | assessment.
- Geef een korte reden waarom je deze modus kiest.
- Detecteer daarnaast intent voor contact/afspraak en geef UI-blokken terug.

Regels:
1) info:
   - praktische/feitelijke websitevragen: prijs, duur, aanbod, planning, contact, workshopinfo.
2) uitleg:
   - inhoudelijke/verdiepende/contextuele vragen: waarom/hoe/verschil/oorzaak/uitleg.
   - persoonlijke context kan uitleg relevanter maken, maar is NIET automatisch assessment.
3) assessment:
   - ALLEEN als user expliciet vraagt om beoordeling/inschatting/scan/diagnose/assessment
     of een oordeel over niveau/fase/behoefte.
   - assessment mag niet te snel gekozen worden.

Output:
Je output MOET geldige JSON zijn met exact dit schema:
{
  "mode": "info" | "uitleg" | "assessment",
  "reason": "string",
  "blocks": [
    { "type": "contactCard", "variant": "default" }
  ]
}

Intent regel (belangrijk):
- Als de user vraagt naar contact opnemen, afspraak maken/boeken/inplannen, bellen, mailen, kennismaken,
  of "hoe kan ik jullie bereiken?", dan MOET je mode="info" kiezen en minimaal één block teruggeven:
  { "type": "contactCard", "variant": "default" }.
`.trim()

app.post('/api/analyze-mode', async (req, res) => {
  try {
    const { message } = req.body ?? {}
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'message is required' })
    }

    // Hard override so this UI-test is 100% reliable (no model drift).
    const lower = message.toLowerCase()
    const contactIntent =
      /\b(contact|afspraak|afspreken|inplannen|boeken|booking|kennismak|kennismaking|bellen|bel|telefoon|mail|email|e-mail|bereiken|sparren|meedenken|overleggen|wat\s+past|passend|advies|aanraden)\b/.test(
        lower,
      )
    if (contactIntent) {
      return res.json({
        mode: 'info',
        reason: 'De user zoekt contact of wil kort afstemmen; toon de contactkaart.',
        blocks: [
          {
            type: 'contactCard',
            variant: 'default',
            name: 'Mathijs van der Grijp',
            email: 'mathijs@principlesai.nl',
            phone: '0610277261',
            companyName: 'PrinciplesAI',
            logoSrc: '/logo.svg',
            ctaHref: '/contact',
            ctaLabel: 'Plan een 30 min call',
            ctaContextText: getContactCtaContext(message),
          },
        ],
      })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not set on server' })
    }

    const { default: OpenAI } = await import('openai')
    const client = new OpenAI({ apiKey })

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_ANALYSIS_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: ANALYZE_MODE_SYSTEM },
        { role: 'user', content: message },
      ],
    })

    const raw = completion.choices?.[0]?.message?.content ?? ''
    const parsed = parseJsonLoose(raw)
    const checked = safeParseAnalyzeModeResponse(parsed)
    if (!checked.success) {
      return res.status(502).json({
        error: 'invalid_analyze_mode_json',
        detail: checked.error?.issues?.slice(0, 6) || 'Model response was not valid JSON in expected schema.',
      })
    }

    return res.json(checked.data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Analyze mode error:', err)
    const status = Number(err?.status || err?.response?.status || 500)
    const detail =
      err?.error?.message ||
      err?.message ||
      err?.response?.data?.error?.message ||
      'Unknown error'
    return res.status(Number.isFinite(status) ? status : 500).json({
      error: 'analyze_mode_failed',
      detail,
    })
  }
})

function getContactCtaContext(userMessage) {
  const raw = typeof userMessage === 'string' ? userMessage : ''
  const msg = raw.trim().toLowerCase()
  if (!msg) return 'Je kunt direct contact opnemen of een vrijblijvende kennismaking plannen.'

  const hasAny = (terms) => terms.some((t) => msg.includes(t))

  if (hasAny(['contactgegevens', 'contact gegevens', 'email', 'e-mail', 'mail', 'telefoon', 'tel', 'nummer', 'bereiken'])) {
    return 'Je kunt direct contact opnemen of een korte kennismaking plannen.'
  }
  if (hasAny(['afspraak', 'inplannen', 'boeken', 'booking', 'kennismaking', 'kennismaken', 'call', 'gesprek'])) {
    return 'Een korte kennismaking is een simpele manier om je vraag goed scherp te krijgen.'
  }
  if (hasAny(['sparren', 'meedenken', 'overleggen', 'even bellen', 'kort bellen', 'samen kijken'])) {
    return 'Een korte call is de snelste manier om je situatie samen te verkennen.'
  }
  if (hasAny(['wat past', 'passend', 'welke', 'beste', 'aanraden', 'advies', 'mogelijkheden', 'opties'])) {
    return 'In een korte call kunnen we bekijken wat het best aansluit op jouw situatie.'
  }
  return 'Een korte call is een handige manier om je vraag samen door te nemen.'
}

function placementEngine(blocks) {
  const list = Array.isArray(blocks) ? blocks.filter(Boolean) : []
  const weight = (b) => {
    const p = b?.layout?.priority
    const w = b?.layout?.width
    const s = b?.layout?.size
    const pw = p === 'primary' ? 100 : 10
    const ww = w === 'full' ? 6 : w === 'wide' ? 4 : 2
    const sw = s === 'lg' ? 3 : s === 'md' ? 2 : 1
    return pw + ww + sw
  }
  return list.sort((a, b) => weight(b) - weight(a))
}

function hardenContactCard(block, userMessage) {
  const b = block && typeof block === 'object' ? block : null
  if (!b || b.type !== 'contactCard') return b
  const ctx =
    typeof b?.props?.ctaContextText === 'string' && b.props.ctaContextText.trim()
      ? b.props.ctaContextText.trim()
      : getContactCtaContext(userMessage)

  return {
    ...b,
    props: {
      name: 'Mathijs van der Grijp',
      email: 'mathijs@principlesai.nl',
      phone: '0610277261',
      companyName: 'PrinciplesAI',
      logoSrc: '/logo.svg',
      ctaHref: '/contact',
      ctaLabel: 'Plan een 30 min call',
      ctaContextText: ctx,
    },
  }
}

function normalizeLayout(layout) {
  const p = String(layout?.priority ?? '').toLowerCase()
  const s = String(layout?.size ?? '').toLowerCase()
  const w = String(layout?.width ?? '').toLowerCase()
  return {
    priority: p === 'secondary' ? 'secondary' : 'primary',
    size: s === 'sm' || s === 'md' || s === 'lg' ? s : 'md',
    width: w === 'content' || w === 'wide' || w === 'full' ? w : 'wide',
  }
}

function sanitizeStageBlocks(blocks) {
  const list = Array.isArray(blocks) ? blocks : []
  return list
    .filter((b) => b && typeof b === 'object' && typeof b.type === 'string')
    .map((b) => ({
      ...b,
      layout: normalizeLayout(b.layout),
      props: b.props && typeof b.props === 'object' ? b.props : {},
    }))
}

function defaultZones() {
  return { below_input: [], main_center: [], support_below: [], bottom_cta: [] }
}

function buildZonesFromPlacement({ blocks, placement }) {
  const byType = new Map(blocks.map((b) => [b.type, b]))
  const zones = defaultZones()
  const used = new Set()

  const sortedPlacements = [...placement.placements].sort((a, b) => a.order - b.order)
  for (const p of sortedPlacements) {
    const base = byType.get(p.type)
    if (!base || used.has(p.type)) continue
    used.add(p.type)
    const placedBlock = {
      ...base,
      layout: {
        ...base.layout,
        priority: p.priority,
        width: p.width,
      },
    }
    zones[p.zone].push(placedBlock)
  }

  for (const b of blocks) {
    if (used.has(b.type)) continue
    zones.support_below.push(b)
  }

  return { pageState: placement.pageState, shell: placement.shell, zones }
}

function fallbackZonePlacement(mode, blocks) {
  const zones = defaultZones()
  const sorted = placementEngine(blocks)
  if (mode === 'info') {
    zones.below_input = sorted.slice(0, 1)
    zones.support_below = sorted.slice(1)
    return { pageState: 'focused_contact', shell: { hero: 'hide' }, zones }
  }
  if (mode === 'uitleg') {
    zones.main_center = sorted.slice(0, 1)
    zones.support_below = sorted.slice(1)
    return { pageState: 'focused_explanation', shell: { hero: 'compact' }, zones }
  }
  zones.main_center = sorted.slice(0, 1)
  zones.support_below = sorted.slice(1)
  return { pageState: 'focused_assessment', shell: { hero: 'hide' }, zones }
}

async function callJsonModel({ client, model, system, user, temperature = 0.2 }) {
  const completion = await client.chat.completions.create({
    model,
    temperature,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  })
  const raw = completion.choices?.[0]?.message?.content ?? ''
  return parseJsonLoose(raw)
}

const FLOW_ONE_CALL_SYSTEM = `
Je bent een Nederlandse orchestrator voor een website die trainingen/workshops in taalmodellen (LLMs) aanbiedt.

Belangrijk:
- Genereer GEEN code, GEEN JSX, GEEN HTML.
- Output MOET geldige JSON zijn, en alleen velden uit het schema.
- Gebruik alleen deze component types: contactCard, explanationBlock, assessmentPrompt, visualPlaceholderBlock.
- Geen vrije CSS/pixels/posities. Alleen layout tokens in layout.{priority,size,width}.
- Gebruik maximaal 4 blocks.

Je taak in ÉÉN output:
1) Analyse:
  - bepaal mode: info | uitleg | assessment
  - geef reason (1–2 zinnen)
  - geef intents (0–6 tokens)
  - geef suggestedComponents (0–8 type strings)
2) Content:
  - geef blocks[] met type + layout tokens + props
3) Shell:
  - kies hero: show | compact | hide (alleen intentie; frontend voert uit)

Mode regels:
- info: praktische/feitelijke vragen (contact, workshopinfo, prijzen, duur, planning).
- uitleg: inhoudelijke/verdiepende/contextuele vragen (waarom/hoe/verschil/oorzaak/uitleg).
- assessment: ALLEEN bij expliciet verzoek om beoordeling/inschatting/scan/diagnose/niveau.
- Persoonlijke context alleen is NIET automatisch assessment.

ContactCard regels:
- Als de user contact/afspraak/bellen/mailen/kennismaken vraagt: voeg een contactCard toe.
- ctaContextText moet semantisch passen (niet kopiëren).
- Je MAG GEEN email/telefoon/naam/bedrijf/logo verzinnen; zet placeholder strings, de server hardt deze waarden af.

Verplichte props per block:
- contactCard.props: { "name": "...", "email": "...", "phone": "...", "companyName": "...", "logoSrc": "/logo.svg", "ctaHref": "/contact", "ctaLabel": "Plan een 30 min call", "ctaContextText": "..." }
- explanationBlock.props: { "title": "Uitleg", "body": "..." }
- assessmentPrompt.props: { "title": "Korte intake", "questions": ["...", "..."] }
- visualPlaceholderBlock.props: { "title": "Visual", "caption": "..." }

Output schema (exact):
{
  "analysis": {
    "mode": "info" | "uitleg" | "assessment",
    "reason": "string",
    "intents": ["..."],
    "suggestedComponents": ["..."]
  },
  "shell": { "hero": "show" | "compact" | "hide" },
  "blocks": [
    {
      "type": "contactCard" | "explanationBlock" | "assessmentPrompt" | "visualPlaceholderBlock",
      "layout": { "priority": "primary"|"secondary", "size": "sm"|"md"|"lg", "width": "content"|"wide"|"full" },
      "props": { }
    }
  ]
}
`.trim()

function pageStateForMode(mode) {
  if (mode === 'info') return 'focused_contact'
  if (mode === 'uitleg') return 'focused_explanation'
  if (mode === 'assessment') return 'focused_assessment'
  return 'default'
}

function heuristicAnalysis(message) {
  const lower = String(message ?? '').toLowerCase()
  const isAssessment = /\b(assessment|diagnose|scan|inschatting|beoordeel|audit)\b/.test(lower)
  if (isAssessment) {
    return {
      mode: 'assessment',
      reason: 'Fallback analyse (heuristic): expliciet assessment/scan/diagnose verzoek.',
      intents: ['assessment_request'],
      suggestedComponents: ['assessmentPrompt'],
    }
  }

  const isContact = /\b(contact|afspraak|boeken|inplannen|bellen|mail|email|e-mail|kennismak)\b/.test(lower)
  if (isContact) {
    return {
      mode: 'info',
      reason: 'Fallback analyse (heuristic): praktische contact/afspraak vraag.',
      intents: ['contact'],
      suggestedComponents: ['contactCard'],
    }
  }

  const isExplain = /\b(waarom|hoe|verschil|oorzaak|leg uit|uitleg)\b/.test(lower)
  if (isExplain) {
    return {
      mode: 'uitleg',
      reason: 'Fallback analyse (heuristic): inhoudelijke uitleg-vraag.',
      intents: ['explanation'],
      suggestedComponents: ['explanationBlock', 'visualPlaceholderBlock'],
    }
  }

  return {
    mode: 'info',
    reason: 'Fallback analyse (heuristic): algemene praktische vraag.',
    intents: [],
    suggestedComponents: ['explanationBlock'],
  }
}

function coerceBlocks(rawBlocks, userMessage) {
  const arr = Array.isArray(rawBlocks) ? rawBlocks : []
  const coerced = []

  for (const b of arr) {
    if (!b || typeof b !== 'object') continue
    const type = b.type
    const layout = normalizeLayout(b.layout)
    const props = b.props && typeof b.props === 'object' ? b.props : {}

    if (type === 'contactCard') {
      coerced.push({
        type,
        layout,
        props: {
          name: String(props.name || '—'),
          email: String(props.email || '—'),
          phone: String(props.phone || '—'),
          companyName: String(props.companyName || 'PrinciplesAI'),
          logoSrc: String(props.logoSrc || '/logo.svg'),
          ctaHref: String(props.ctaHref || '/contact'),
          ctaLabel: String(props.ctaLabel || 'Plan een 30 min call'),
          ctaContextText: String(props.ctaContextText || getContactCtaContext(userMessage)),
        },
      })
      continue
    }

    if (type === 'explanationBlock') {
      const body = typeof props.body === 'string' ? props.body.trim() : ''
      if (!body) continue
      coerced.push({
        type,
        layout,
        props: {
          title: typeof props.title === 'string' && props.title.trim() ? props.title.trim() : 'Uitleg',
          body,
        },
      })
      continue
    }

    if (type === 'assessmentPrompt') {
      const qs = Array.isArray(props.questions) ? props.questions.filter((q) => typeof q === 'string' && q.trim()) : []
      const questions = qs.length >= 2 ? qs.slice(0, 6) : [
        'Wat is het doel van het assessment (besluit, leerpad, risico’s)?',
        'Wie gebruikt LLMs nu en in welke processen?',
        'Welke data/systemen spelen mee (gevoeligheid/beleid)?',
      ]
      coerced.push({
        type,
        layout,
        props: {
          title: typeof props.title === 'string' && props.title.trim() ? props.title.trim() : 'Korte intake',
          questions,
        },
      })
      continue
    }

    if (type === 'visualPlaceholderBlock') {
      coerced.push({
        type,
        layout,
        props: {
          title: typeof props.title === 'string' && props.title.trim() ? props.title.trim() : 'Visual',
          caption:
            typeof props.caption === 'string' && props.caption.trim()
              ? props.caption.trim()
              : 'Visual placeholder (diagram/visual komt later).',
        },
      })
      continue
    }
  }

  // Keep only blocks that validate.
  return coerced.filter((b) => StageBlockSchema.safeParse(b).success).slice(0, 6)
}

function zonesFromBlocks(mode, blocks, shellHero) {
  const zones = defaultZones()
  const sorted = placementEngine(blocks)
  const primary = sorted.filter((b) => (b?.layout?.priority || 'primary') === 'primary')
  const secondary = sorted.filter((b) => (b?.layout?.priority || 'primary') !== 'primary')

  if (mode === 'info') {
    zones.below_input = primary.slice(0, 1)
    zones.support_below = [...primary.slice(1), ...secondary]
  } else if (mode === 'uitleg') {
    zones.main_center = primary.slice(0, 1)
    zones.support_below = [...primary.slice(1), ...secondary]
  } else {
    zones.main_center = primary.slice(0, 1)
    zones.support_below = [...primary.slice(1), ...secondary]
  }

  return {
    pageState: pageStateForMode(mode),
    shell: { hero: shellHero || (mode === 'uitleg' ? 'compact' : 'hide') },
    zones,
  }
}
function modeSystemPrompt(mode) {
  if (mode === 'info') {
    return `
Je bent een info-mode content generator voor een trainingswebsite over taalmodellen.
Genereer ALLEEN JSON (geen markdown) voor blocks (max 4) met props.
Toegestane types: contactCard, explanationBlock, assessmentPrompt, visualPlaceholderBlock.
Gebruik veilige layout tokens (priority/size/width) per block.

Als de vraag over contact/afspraak/bellen/mailen/kennismaken gaat:
- Maak een contactCard block met props (name,email,phone,companyName,logoSrc,ctaHref,ctaLabel,ctaContextText).
- ctaContextText moet semantisch passen (niet kopiëren uit de input).

Output schema:
{ "blocks": [ { "type": "...", "layout": { "priority": "...", "size": "...", "width": "..." }, "props": { ... } } ] }
`.trim()
  }
  if (mode === 'uitleg') {
    return `
Je bent een uitleg-mode content generator voor een trainingswebsite over taalmodellen.
Genereer ALLEEN JSON (geen markdown) met blocks (max 4).
Toegestane types: explanationBlock, visualPlaceholderBlock, contactCard.
Gebruik veilige layout tokens.

Maak meestal:
- explanationBlock (primary, lg, wide) met een heldere titel en body (max 1200 chars).
- optioneel visualPlaceholderBlock (secondary, md, wide) met titel + caption.

Output schema:
{ "blocks": [ ... ] }
`.trim()
  }
  return `
Je bent een assessment-mode content generator voor een trainingswebsite over taalmodellen.
Genereer ALLEEN JSON (geen markdown) met blocks (max 4).
Toegestane types: assessmentPrompt, contactCard.
Gebruik veilige layout tokens.

Maak:
- assessmentPrompt (primary, lg, full) met 3-6 korte intakevragen.
- optioneel contactCard secondary.

Output schema:
{ "blocks": [ ... ] }
`.trim()
}

app.post('/api/flow', async (req, res) => {
  try {
    const traceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
    const t0 = performance.now()
    const mark = {}
    const lap = (key) => {
      mark[key] = Math.round(performance.now() - t0)
    }

    const debugEnabled = String(req.headers['x-debug-flow'] || '') === '1'

    const { message } = req.body ?? {}
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'message is required' })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not set on server' })
    }

    const { default: OpenAI } = await import('openai')
    const client = new OpenAI({ apiKey })
    const model = process.env.OPENAI_FLOW_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini'

    // Single model call: analysis + blocks + shell intent
    lap('before_model')
    const raw = await callJsonModel({
      client,
      model,
      system: FLOW_ONE_CALL_SYSTEM,
      user: message,
      temperature: 0.2,
    })
    lap('after_model')

    const modelChecked = FlowModelOutputSchema.safeParse(raw)
    let analysis = null
    let blocks = []
    let shellHero = 'show'

    if (modelChecked.success) {
      analysis = modelChecked.data.analysis
      shellHero = modelChecked.data.shell?.hero || 'show'
      blocks = coerceBlocks(modelChecked.data.blocks, message)
    } else {
      const maybeAnalysis = AnalysisOutputSchema.safeParse(raw?.analysis)
      analysis = maybeAnalysis.success ? maybeAnalysis.data : heuristicAnalysis(message)
      shellHero =
        raw?.shell?.hero === 'hide' || raw?.shell?.hero === 'compact' || raw?.shell?.hero === 'show'
          ? raw.shell.hero
          : analysis.mode === 'uitleg'
            ? 'compact'
            : 'hide'
      blocks = coerceBlocks(raw?.blocks, message)
    }
    lap('after_parse')

    // Ensure we always have a sensible minimal block set by mode/intents
    const wantsContact = (analysis.intents || []).includes('contact') || /contact|afspraak|bellen|mail|email|kennismak/i.test(message)
    if (wantsContact && !blocks.some((b) => b?.type === 'contactCard')) {
      blocks.unshift({
        type: 'contactCard',
        layout: { priority: 'primary', size: 'lg', width: 'wide' },
        props: {
          name: '—',
          email: '—',
          phone: '—',
          companyName: 'PrinciplesAI',
          logoSrc: '/logo.svg',
          ctaHref: '/contact',
          ctaLabel: 'Plan een 30 min call',
          ctaContextText: getContactCtaContext(message),
        },
      })
    }

    // Harden identity-sensitive blocks (model may not invent personal/company data).
    blocks = blocks.map((b) => hardenContactCard(b, message))
    lap('after_harden')

    // Validate blocks quickly; if invalid, fall back to safe server-side blocks.
    const blocksOk = Array.isArray(blocks) && blocks.every((b) => StageBlockSchema.safeParse(b).success)
    if (!blocksOk) {
      const mode = analysis.mode
      if (mode === 'assessment') {
        blocks = [
          {
            type: 'assessmentPrompt',
            layout: { priority: 'primary', size: 'lg', width: 'full' },
            props: {
              title: 'Korte intake',
              questions: [
                'Wat is het doel van het assessment (besluit, leerpad, risico’s)?',
                'Wie gebruikt LLMs nu en in welke processen?',
                'Welke data/systemen spelen mee (gevoeligheid/beleid)?',
                'Wat wil je over 4–6 weken concreet anders kunnen?',
              ],
            },
          },
        ]
      } else if (mode === 'uitleg') {
        blocks = [
          {
            type: 'explanationBlock',
            layout: { priority: 'primary', size: 'lg', width: 'wide' },
            props: {
              title: 'Uitleg',
              body: 'Ik kan dit uitleggen in een paar heldere stappen. Stel je vraag zo concreet mogelijk (waar loop je vast, welke context, welk doel).',
            },
          },
          {
            type: 'visualPlaceholderBlock',
            layout: { priority: 'secondary', size: 'md', width: 'wide' },
            props: { title: 'Visual', caption: 'Hier kan later een diagram / visual komen.' },
          },
        ]
      } else {
        blocks = [
          {
            type: 'contactCard',
            layout: { priority: 'primary', size: 'lg', width: 'wide' },
            props: {
              name: 'Mathijs van der Grijp',
              email: 'mathijs@principlesai.nl',
              phone: '0610277261',
              companyName: 'PrinciplesAI',
              logoSrc: '/logo.svg',
              ctaHref: '/contact',
              ctaLabel: 'Plan een 30 min call',
              ctaContextText: getContactCtaContext(message),
            },
          },
        ]
      }
    }
    lap('after_validate')

    const mode = analysis.mode
    const stage = zonesFromBlocks(mode, blocks, shellHero)
    lap('after_place')

    const response = { analysis, stage }
    const checked = safeParseFlowResponse(response)
    if (!checked.success) {
      return res.status(502).json({
        error: 'invalid_flow_payload',
        detail: checked.error.issues?.slice(0, 8),
      })
    }

    const totalMs = Math.round(performance.now() - t0)
    res.setHeader(
      'Server-Timing',
      [
        `total;dur=${totalMs}`,
        `model;dur=${(mark.after_model ?? totalMs) - (mark.before_model ?? 0)}`,
        `parse;dur=${(mark.after_parse ?? totalMs) - (mark.after_model ?? 0)}`,
        `harden;dur=${(mark.after_harden ?? totalMs) - (mark.after_parse ?? 0)}`,
        `validate;dur=${(mark.after_validate ?? totalMs) - (mark.after_harden ?? 0)}`,
        `place;dur=${(mark.after_place ?? totalMs) - (mark.after_validate ?? 0)}`,
      ].join(', '),
    )
    res.setHeader('x-flow-trace-id', traceId)

    if (debugEnabled) {
      return res.json({
        ...checked.data,
        debug: {
          traceId,
          ms: { ...mark, total: totalMs },
        },
      })
    }

    return res.json(checked.data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Flow error:', err)
    const status = Number(err?.status || err?.response?.status || 500)
    const detail =
      err?.error?.message ||
      err?.message ||
      err?.response?.data?.error?.message ||
      'Unknown error'
    return res.status(Number.isFinite(status) ? status : 500).json({
      error: 'flow_failed',
      detail,
    })
  }
})

const AGENT_SYSTEM = `
Je bent een Nederlandse assistent die een website kan besturen via een veilige JSON-config.

Belangrijk:
- Genereer GEEN code, GEEN JSX, GEEN HTML.
- Geef ALLEEN geldige JSON terug volgens het schema.
- Geef alleen velden die in het schema staan.
- Gebruik alleen de toegestane block types:
  callout, checklist, actions,
  contactCard, conceptExplanation, recommendedPath, assessmentIntro, diagnosticSummary,
  faq, comparison, personaSummary, cta.
- Actions mogen alleen: kind=navigate (interne routes) of kind=external (externe links).

Interne routes die toegestaan zijn:
- /
- /leren
- /contact

Doel:
- Geef een korte reply (vriendelijk, clarity-first).
- Geef daarnaast pageConfig blocks die de pagina helpen sturen (max 6 blocks).
- Extract een simpel profiel uit de user message (profile: role/goal/context/constraints).
- Geef followUpQuestions (0-6) als je nog info mist.
- Geef diagnosis (samenvatting + signalen/risico’s/assumpties + confidence 1-5) als dat past.
- Geef recommendedPath: book_call | contact_form | learn | explore | unknown.

Modes:
- info: informatief, kort, praktisch
- explanation: leg uit waarom iets werkt (maar nog steeds compact)
- fit: stel 1-2 gerichte vragen om te beoordelen of dit past
- assessment: maak een korte inschatting + volgende stap

Output format:
Je response MOET geldige JSON zijn met exact dit top-level schema:
{
  "mode": "info" | "explanation" | "fit" | "assessment",
  "reply": string,
  "followUpQuestions": string[],
  "profile": { "role": string|null, "goal": string|null, "context": string|null, "constraints": string[] },
  "diagnosis": { "summary": string|null, "signals": string[], "risks": string[], "assumptions": string[], "confidence": number|null },
  "recommendedPath": "book_call" | "contact_form" | "learn" | "explore" | "unknown",
  "pageConfig": { "blocks": PageBlock[] }
}

Voorbeeld (kort):
{
  "mode": "info",
  "reply": "Korte uitleg in het Nederlands.",
  "followUpQuestions": [],
  "profile": { "role": null, "goal": null, "context": null, "constraints": [] },
  "diagnosis": { "summary": null, "signals": [], "risks": [], "assumptions": [], "confidence": null },
  "recommendedPath": "unknown",
  "pageConfig": { "blocks": [] }
}
`.trim()

function parseJsonLoose(maybeJsonText) {
  if (typeof maybeJsonText !== 'string') return null
  const raw = maybeJsonText.trim()
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1))
      } catch {
        return null
      }
    }
    return null
  }
}

function normalizeRecommendedPath(value) {
  const v = String(value ?? '').trim().toLowerCase()
  if (!v) return undefined
  if (['book_call', 'book', 'call', 'booking', 'afspraak', 'boeken', 'plan', 'plan_call'].includes(v)) return 'book_call'
  if (['contact_form', 'form', 'formulier', 'vraag', 'bericht', 'mail'].includes(v)) return 'contact_form'
  if (['learn', 'leren', 'workshop', 'programma'].includes(v)) return 'learn'
  if (['explore', 'verkennen', 'info', 'uitleg'].includes(v)) return 'explore'
  if (['unknown', 'onbekend'].includes(v)) return 'unknown'
  return undefined
}

function normalizeAgentPayload(obj) {
  if (!obj || typeof obj !== 'object') return obj

  // Common fallback keys (keep strictness, but avoid needless 502).
  if (typeof obj.reply !== 'string' && typeof obj.text === 'string') obj.reply = obj.text
  if (typeof obj.reply !== 'string' && typeof obj.message === 'string') obj.reply = obj.message

  // Ensure arrays/objects exist in the right shape (Zod still validates types/content).
  if (!Array.isArray(obj.followUpQuestions)) obj.followUpQuestions = []
  if (!obj.pageConfig || typeof obj.pageConfig !== 'object') obj.pageConfig = { blocks: [] }
  if (!Array.isArray(obj.pageConfig.blocks)) obj.pageConfig.blocks = []
  if (!obj.profile || typeof obj.profile !== 'object') obj.profile = {}
  if (!obj.diagnosis || typeof obj.diagnosis !== 'object') obj.diagnosis = {}

  const rp = normalizeRecommendedPath(obj.recommendedPath)
  if (rp) obj.recommendedPath = rp

  return obj
}

app.post('/api/agent', async (req, res) => {
  try {
    const { message, mode } = req.body ?? {}
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'message is required' })
    }

    // Temporary: keep wiring, but disable model behavior.
    // We return a valid structured response so the UI flow can be rebuilt safely.
    const dryRun = process.env.AGENT_DRY_RUN !== '0'
    if (dryRun) {
      const safeMode = typeof mode === 'string' ? mode : 'info'
      return res.json({
        mode: safeMode,
        reply: 'Agent staat tijdelijk uit. (We bouwen de logica opnieuw op.)',
        followUpQuestions: [],
        profile: { role: null, goal: null, context: null, constraints: [] },
        diagnosis: { summary: null, signals: [], risks: [], assumptions: [], confidence: null },
        recommendedPath: 'unknown',
        pageConfig: { blocks: [] },
      })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not set on server' })
    }

    const { default: OpenAI } = await import('openai')
    const client = new OpenAI({ apiKey })

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: AGENT_SYSTEM },
        {
          role: 'user',
          content: JSON.stringify({
            mode: typeof mode === 'string' ? mode : 'info',
            message,
          }),
        },
      ],
    })

    const raw = completion.choices?.[0]?.message?.content ?? ''
    const parsed = normalizeAgentPayload(parseJsonLoose(raw))

    const checked = safeParseAgentResponse(parsed)
    if (!checked.success) {
      return res.status(502).json({
        error: 'invalid_agent_json',
        detail: checked.error?.issues?.slice(0, 6) || 'Model response was not valid JSON in expected schema.',
      })
    }

    // Soft safety: cap blocks server-side as well.
    const safe = checked.data
    safe.pageConfig = safe.pageConfig || { blocks: [] }
    safe.pageConfig.blocks = Array.isArray(safe.pageConfig.blocks) ? safe.pageConfig.blocks.slice(0, 8) : []

    return res.json(safe)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Agent error:', err)

    const status = Number(err?.status || err?.response?.status || 500)
    const detail =
      err?.error?.message ||
      err?.message ||
      err?.response?.data?.error?.message ||
      'Unknown error'

    return res.status(Number.isFinite(status) ? status : 500).json({
      error: 'agent_failed',
      detail,
    })
  }
})

app.post('/api/prompt-analysis', async (req, res) => {
  try {
    const { text } = req.body ?? {}
    if (typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'text is required' })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not set on server' })
    }

    const model = process.env.OPENAI_ANALYSIS_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini'
    const analysis = await analyzePrompt({ apiKey, model, prompt: text })
    return res.json(analysis)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Prompt analysis error:', err)

    const status = Number(err?.status || err?.response?.status || 500)
    const detail = err?.detail || err?.message || 'Unknown error'

    return res.status(Number.isFinite(status) ? status : 500).json({
      error: 'analysis_failed',
      detail,
    })
  }
})

const port = Number(process.env.PORT || 3001)
const distDir = path.resolve(__dirname, '..', 'dist')
const distExists = fs.existsSync(distDir)
const shouldServeStatic = process.env.SERVE_STATIC !== '0' && distExists

if (shouldServeStatic) {
  app.use(express.static(distDir))

  // SPA fallback (but never hijack /api routes)
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})

