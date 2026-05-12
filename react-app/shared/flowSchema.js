import { z } from 'zod'

/**
 * AI website flow schemas (analysis -> mode-layer -> placement -> stage blocks)
 * Frontend renders ONLY from a fixed component registry.
 */

export const FlowModeSchema = z.enum(['info', 'uitleg', 'assessment'])

export const LayoutPrioritySchema = z.enum(['primary', 'secondary']).default('primary')
export const LayoutSizeSchema = z.enum(['sm', 'md', 'lg']).default('md')
export const LayoutWidthSchema = z.enum(['content', 'wide', 'full']).default('wide')

export const LayoutSchema = z
  .object({
    priority: LayoutPrioritySchema,
    size: LayoutSizeSchema,
    width: LayoutWidthSchema,
  })
  .strict()

export const AnalysisOutputSchema = z
  .object({
    mode: FlowModeSchema,
    reason: z.string().min(1).max(600),
    intents: z.array(z.string().min(1).max(40)).max(6).default([]),
    suggestedComponents: z.array(z.string().min(1).max(40)).max(8).default([]),
  })
  .strict()

// Component payloads (safe, predefined)
export const ContactCardBlockSchema = z
  .object({
    type: z.literal('contactCard'),
    layout: LayoutSchema.default({ priority: 'primary', size: 'lg', width: 'wide' }),
    props: z
      .object({
        name: z.string().min(1).max(80),
        email: z.string().min(1).max(120),
        phone: z.string().min(1).max(40),
        companyName: z.string().min(1).max(80).default('PrinciplesAI'),
        logoSrc: z.string().min(1).max(200).default('/logo.svg'),
        ctaHref: z.string().min(1).max(200).default('/contact'),
        ctaLabel: z.string().min(1).max(60).default('Plan een 30 min call'),
        ctaContextText: z.string().min(1).max(220),
      })
      .strict(),
  })
  .strict()

export const ExplanationBlockSchema = z
  .object({
    type: z.literal('explanationBlock'),
    layout: LayoutSchema.default({ priority: 'primary', size: 'lg', width: 'wide' }),
    props: z
      .object({
        title: z.string().min(1).max(80).default('Uitleg'),
        body: z.string().min(1).max(1400),
      })
      .strict(),
  })
  .strict()

export const AssessmentPromptSchema = z
  .object({
    type: z.literal('assessmentPrompt'),
    layout: LayoutSchema.default({ priority: 'primary', size: 'lg', width: 'full' }),
    props: z
      .object({
        title: z.string().min(1).max(80).default('Korte intake'),
        questions: z.array(z.string().min(1).max(220)).min(2).max(6),
      })
      .strict(),
  })
  .strict()

export const VisualPlaceholderBlockSchema = z
  .object({
    type: z.literal('visualPlaceholderBlock'),
    layout: LayoutSchema.default({ priority: 'secondary', size: 'md', width: 'wide' }),
    props: z
      .object({
        title: z.string().min(1).max(80).default('Visual'),
        caption: z.string().min(1).max(220).default('Visual placeholder (diagram/visual komt later).'),
      })
      .strict(),
  })
  .strict()

export const StageBlockSchema = z.discriminatedUnion('type', [
  ContactCardBlockSchema,
  ExplanationBlockSchema,
  AssessmentPromptSchema,
  VisualPlaceholderBlockSchema,
])

export const StageConfigSchema = z
  .object({
    pageState: z.enum(['default', 'focused_contact', 'focused_explanation', 'focused_assessment']).default('default'),
    shell: z
      .object({
        hero: z.enum(['show', 'compact', 'hide']).default('show'),
      })
      .strict()
      .default({ hero: 'show' }),
    zones: z
      .object({
        below_input: z.array(StageBlockSchema).max(6).default([]),
        main_center: z.array(StageBlockSchema).max(6).default([]),
        support_below: z.array(StageBlockSchema).max(6).default([]),
        bottom_cta: z.array(StageBlockSchema).max(4).default([]),
      })
      .strict()
      .default({ below_input: [], main_center: [], support_below: [], bottom_cta: [] }),
  })
  .strict()

export const FlowModelOutputSchema = z
  .object({
    analysis: AnalysisOutputSchema,
    shell: z
      .object({
        hero: z.enum(['show', 'compact', 'hide']).default('show'),
      })
      .strict()
      .default({ hero: 'show' }),
    blocks: z.array(StageBlockSchema).max(6).default([]),
  })
  .strict()

export const FlowResponseSchema = z
  .object({
    analysis: AnalysisOutputSchema,
    stage: StageConfigSchema,
  })
  .strict()

export function safeParseFlowResponse(payload) {
  return FlowResponseSchema.safeParse(payload)
}

