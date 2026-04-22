export async function runAgent({ message, mode }, { signal } = {}) {
  const resp = await fetch('/api/agent', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message, mode }),
    signal,
  })

  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    const msg = data?.detail || data?.error || 'agent_failed'
    throw new Error(msg)
  }
  return data
}

