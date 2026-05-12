export default function VisualPlaceholderBlock({
  title = 'Visual',
  caption = 'Visual placeholder (diagram/visual komt later).',
}) {
  return (
    <section className="vp" aria-label="Visual placeholder">
      <div className="vpTitle">{title}</div>
      <div className="vpFrame" role="img" aria-label={caption}>
        <div className="vpMark" aria-hidden="true" />
      </div>
      <div className="vpCaption">{caption}</div>
    </section>
  )
}

