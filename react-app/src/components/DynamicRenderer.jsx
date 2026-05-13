import ContactCard from './ContactCard.jsx'
import ExplanationBlock from './ExplanationBlock.jsx'
import AssessmentPrompt from './AssessmentPrompt.jsx'
import VisualPlaceholderBlock from './VisualPlaceholderBlock.jsx'

/**
 * DynamicRenderer
 * - Renders a safe, fixed set of components from a list of component configs.
 * - No free JSX/HTML. No eval. Unknown types are ignored.
 */
export default function DynamicRenderer({ components }) {
  const list = Array.isArray(components) ? components : []
  if (!list.length) return null

  return (
    <section className="componentStage" aria-label="Dynamische componenten">
      {list.map((c, idx) => {
        if (!c || typeof c !== 'object') return null

        const priority = c?.layout?.priority || 'primary'
        const size = c?.layout?.size || 'md'
        const width = c?.layout?.width || 'wide'
        const itemClass = `stageItem pri-${priority} size-${size} w-${width}`

        if (c.type === 'contactCard') {
          return (
            <div key={idx} className={itemClass}>
              <ContactCard
                variant={c.variant}
                name={c.name}
                email={c.email}
                phone={c.phone}
                companyName={c.companyName}
                logoSrc={c.logoSrc}
                ctaHref={c.ctaHref}
                ctaLabel={c.ctaLabel}
                ctaContextText={c.ctaContextText}
              />
            </div>
          )
        }

        if (c.type === 'explanationBlock') {
          return (
            <div key={idx} className={itemClass}>
              <ExplanationBlock title={c.title} body={c.body} />
            </div>
          )
        }

        if (c.type === 'assessmentPrompt') {
          return (
            <div key={idx} className={itemClass}>
              <AssessmentPrompt title={c.title} questions={c.questions} />
            </div>
          )
        }

        if (c.type === 'visualPlaceholderBlock') {
          return (
            <div key={idx} className={itemClass}>
              <VisualPlaceholderBlock title={c.title} caption={c.caption} />
            </div>
          )
        }

        return null
      })}
    </section>
  )
}

