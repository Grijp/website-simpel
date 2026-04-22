import { useEffect, useState } from 'react'

/**
 * Tiny debounce hook to keep UI snappy on every keystroke.
 * We debounce the *analysis*, not the input itself.
 */
export function useDebouncedValue(value, delayMs = 150) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])

  return debounced
}

