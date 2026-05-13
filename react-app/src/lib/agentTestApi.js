export async function runAgentTest({ message }, { signal } = {}) {
  const resp = await fetch('/api/agent-test', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message }),
    signal,
  })

  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    const msg = data?.detail || data?.error || 'agent_test_failed'
    throw new Error(typeof msg === 'string' ? msg : 'agent_test_failed')
  }
  return data
}

