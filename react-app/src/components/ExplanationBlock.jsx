export default function ExplanationBlock({ title = 'Uitleg', body }) {
  if (typeof body !== 'string' || !body.trim()) return null
  return (
    <section className="eb" aria-label="Uitleg">
      <div className="ebTitle">{title}</div>
      <div className="ebBody">{body}</div>
    </section>
  )
}

