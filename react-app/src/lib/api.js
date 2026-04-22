export async function analyzePrompt(text, { signal } = {}) {
  const resp = await fetch('/api/prompt-analysis', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text }),
    signal,
  })

  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    const msg = data?.detail || data?.error || 'analysis_failed'
    throw new Error(msg)
  }
  return data
}

