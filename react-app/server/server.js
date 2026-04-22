import 'dotenv/config'
import express from 'express'
import { analyzePrompt } from './promptAnalysis.js'
import { safeParseAgentResponse } from '../shared/pageConfigSchema.js'

const app = express()

app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

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

const AGENT_SYSTEM = `
Je bent een Nederlandse assistent die een website kan besturen via een veilige JSON-config.

Belangrijk:
- Genereer GEEN code, GEEN JSX, GEEN HTML.
- Geef ALLEEN geldige JSON terug volgens het schema.
- Gebruik alleen de toegestane block types: callout, checklist, actions.
- Actions mogen alleen: kind=navigate (interne routes) of kind=external (externe links).

Interne routes die toegestaan zijn:
- /
- /leren
- /contact

Doel:
- Geef een korte reply (vriendelijk, clarity-first).
- Geef daarnaast pageConfig blocks die de pagina helpen sturen (max 4 blocks).
- Extract een simpel profiel uit de user message (role/goal/context/constraints).

Modes:
- info: informatief, kort, praktisch
- explanation: leg uit waarom iets werkt (maar nog steeds compact)
- fit: stel 1-2 gerichte vragen om te beoordelen of dit past
- assessment: maak een korte inschatting + volgende stap
`.trim()

app.post('/api/agent', async (req, res) => {
  try {
    const { message, mode } = req.body ?? {}
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
    const parsed = (() => {
      try {
        return JSON.parse(raw)
      } catch {
        return null
      }
    })()

    const checked = safeParseAgentResponse(parsed)
    if (!checked.success) {
      return res.status(502).json({
        error: 'invalid_agent_json',
        detail: 'Model response was not valid JSON in expected schema.',
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
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`)
})

