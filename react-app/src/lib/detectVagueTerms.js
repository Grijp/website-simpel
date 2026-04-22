import { VAGUE_TERMS } from './vagueTerms.js'

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function patternToRegExp(pattern) {
  if (pattern instanceof RegExp) return pattern
  const escaped = escapeRegExp(pattern.trim())
  // Word-ish boundary on both sides. For multi-word phrases, spaces are kept literal.
  // This is intentionally simple & fast; we can later replace with a tokenizer if needed.
  return new RegExp(`\\b${escaped}\\b`, 'gi')
}

/**
 * @typedef {'low'|'medium'|'high'} Severity
 *
 * @typedef Detection
 * @property {string} id
 * @property {string} label
 * @property {Severity} severity
 * @property {string} matchText
 * @property {number} start
 * @property {number} end
 * @property {string} why
 * @property {string} suggestion
 */

/**
 * Detect words/phrases with lots of interpretatieruimte.
 * Rule-based: instant feedback, no extra LLM call.
 *
 * @param {string} text
 * @returns {Detection[]}
 */
export function detectVagueTerms(text) {
  const input = String(text ?? '')
  if (!input.trim()) return []

  /** @type {Detection[]} */
  const out = []
  const seen = new Set()

  for (const term of VAGUE_TERMS) {
    for (const p of term.patterns) {
      const re = patternToRegExp(p)
      re.lastIndex = 0

      let m
      while ((m = re.exec(input)) !== null) {
        const matchText = m[0]
        const start = m.index
        const end = start + matchText.length
        const key = `${term.id}:${start}:${end}`
        if (seen.has(key)) continue
        seen.add(key)

        out.push({
          id: term.id,
          label: term.label,
          severity: term.severity,
          matchText,
          start,
          end,
          why: term.why,
          suggestion: term.suggestion,
        })
      }
    }
  }

  out.sort((a, b) => a.start - b.start || a.end - b.end)
  return out
}

