export async function runFlow({ message, debug = false }, { signal } = {}) {
  const resp = await fetch('/api/flow', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(debug ? { 'x-debug-flow': '1' } : {}) },
    body: JSON.stringify({ message }),
    signal,
  })

  const meta = {
    serverTiming: resp.headers.get('server-timing') || '',
    traceId: resp.headers.get('x-flow-trace-id') || '',
  }

  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    const msg = data?.detail || data?.error || 'flow_failed'
    throw new Error(typeof msg === 'string' ? msg : 'flow_failed')
  }
  return { data, meta }
}

