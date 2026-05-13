export async function analyzeMode({ message }, { signal } = {}) {
  const resp = await fetch('/api/analyze-mode', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message }),
    signal,
  })

  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    const msg = data?.detail || data?.error || 'analyze_mode_failed'
    throw new Error(typeof msg === 'string' ? msg : 'analyze_mode_failed')
  }
  return data
}

