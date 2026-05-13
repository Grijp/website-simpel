import DynamicRenderer from './DynamicRenderer.jsx'

function StageSkeleton() {
  return (
    <section className="stage" aria-label="Dynamische stage (laden)">
      <div className="stageZone zone-main_center">
        <div className="componentStage">
          <div className="stageSkelCard" />
          <div className="stageSkelLine" />
          <div className="stageSkelLine short" />
        </div>
      </div>
    </section>
  )
}

export default function DynamicStage({ stage, isLoading = false }) {
  if (isLoading) return <StageSkeleton />
  const zones = stage?.zones
  if (!zones || typeof zones !== 'object') return null

  const order = ['below_input', 'main_center', 'support_below', 'bottom_cta']

  return (
    <section className="stage" aria-label="Dynamische stage" data-page-state={stage?.pageState || 'default'}>
      {order.map((zone) => {
        const blocks = zones?.[zone]
        if (!Array.isArray(blocks) || blocks.length === 0) return null

        const components = blocks.map((b) => ({
          type: b.type,
          layout: b.layout,
          ...(b.props || {}),
        }))

        return (
          <div key={zone} className={`stageZone zone-${zone}`} aria-label={zone}>
            <DynamicRenderer components={components} />
          </div>
        )
      })}
    </section>
  )
}

