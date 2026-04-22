import OpenAI from 'openai'

// Keep this prompt strict: analyze only, no rewriting.
export const PROMPT_ANALYSIS_SYSTEM = `
Je bent een analytische assistent. Je taak is om een user prompt te beoordelen op vaagheid/abstractie/ontbrekende specificiteit.

Regels:
- Herschrijf de prompt NIET.
- Geef alleen analyse en feedback.
- Wees behulpzaam en vriendelijk (niet streng).
- Antwoorden moeten kort en concreet zijn.
- Identificeer alleen woorden/frases die letterlijk in de prompt staan (exacte substring).

Je output MOET geldige JSON zijn en exact dit schema volgen:
{
  "score": number (1-10, waarbij 1 = heel vaag, 10 = heel specifiek),
  "items": [
    {
      "text": string,            // woord of korte frase uit de prompt
      "reason": string,          // waarom interpretatiegevoelig
      "suggestion": string       // hoe de user dit specifieker maakt
    }
  ],
  "general_feedback": string | null
}

Extra:
- Maximaal 8 items.
- Als er geen duidelijke issues zijn: score hoog en items = [].
`.trim()

function parseJsonLoose(maybeJsonText) {
  if (typeof maybeJsonText !== 'string') return null
  const raw = maybeJsonText.trim()
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    // Try to extract first JSON object.
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

function isValidAnalysis(obj) {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.score !== 'number' || !Number.isFinite(obj.score)) return false
  if (!Array.isArray(obj.items)) return false
  if (!('general_feedback' in obj)) return false
  for (const it of obj.items) {
    if (!it || typeof it !== 'object') return false
    if (typeof it.text !== 'string' || it.text.trim().length === 0) return false
    if (typeof it.reason !== 'string') return false
    if (typeof it.suggestion !== 'string') return false
  }
  if (obj.general_feedback !== null && typeof obj.general_feedback !== 'string') return false
  return true
}

/**
 * LLM-based semantic analysis (no rewriting).
 * Uses a structured JSON response approach; falls back to parsing if needed.
 */
export async function analyzePrompt({ apiKey, model, prompt }) {
  const client = new OpenAI({ apiKey })

  // Prefer Responses API with JSON mode if available; fallback to chat.completions.
  try {
    const resp = await client.responses.create({
      model,
      input: [
        { role: 'system', content: [{ type: 'text', text: PROMPT_ANALYSIS_SYSTEM }] },
        { role: 'user', content: [{ type: 'text', text: prompt }] },
      ],
      // JSON-only output. If the model refuses, we'll handle it below.
      response_format: { type: 'json_object' },
    })

    const text = resp.output_text
    const parsed = parseJsonLoose(text)
    if (isValidAnalysis(parsed)) return parsed
  } catch {
    // Ignore and fall back.
  }

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: PROMPT_ANALYSIS_SYSTEM },
      { role: 'user', content: prompt },
    ],
  })

  const content = completion.choices?.[0]?.message?.content ?? ''
  const parsed = parseJsonLoose(content)
  if (!isValidAnalysis(parsed)) {
    const err = new Error('invalid_analysis_json')
    err.status = 502
    err.detail = 'Model response was not valid JSON in expected schema.'
    throw err
  }
  return parsed
}

