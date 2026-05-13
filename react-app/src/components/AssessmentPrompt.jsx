export default function AssessmentPrompt({ title = 'Korte intake', questions }) {
  const qs = Array.isArray(questions) ? questions : []
  if (!qs.length) return null

  return (
    <section className="ap" aria-label="Assessment">
      <div className="apTitle">{title}</div>
      <ul className="apList">
        {qs.map((q, idx) => (
          <li key={idx} className="apItem">
            {q}
          </li>
        ))}
      </ul>
    </section>
  )
}

