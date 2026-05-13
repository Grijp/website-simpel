import { z } from 'zod'

/**
 * Shared schema for safe structured UI output.
 * The model may ONLY emit config that matches this schema.
 * Rendering is done via a component registry on the client.
 */

export const AiModeSchema = z.enum(['info', 'explanation', 'fit', 'assessment'])

export const RecommendedPathSchema = z.enum([
  'book_call',
  'contact_form',
  'learn',
  'explore',
  'unknown',
])

export const ActionSchema = z
  .object({
    label: z.string().min(1).max(60),
    kind: z.enum(['navigate', 'external']),
    to: z.string().min(1),
    tone: z.enum(['primary', 'secondary']).default('secondary'),
  })
  .strict()

const FaqItemSchema = z
  .object({
    q: z.string().min(1).max(140),
    a: z.string().min(1).max(600),
  })
  .strict()

const ComparisonRowSchema = z
  .object({
    label: z.string().min(1).max(80),
    left: z.string().min(1).max(180),
    right: z.string().min(1).max(180),
  })
  .strict()

export const PageBlockSchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.literal('callout'),
      title: z.string().min(1).max(80),
      body: z.string().min(1).max(600),
    })
    .strict(),
  z
    .object({
      type: z.literal('checklist'),
      title: z.string().min(1).max(80).optional(),
      items: z.array(z.string().min(1).max(120)).min(1).max(8),
    })
    .strict(),
  z
    .object({
      type: z.literal('actions'),
      title: z.string().min(1).max(80).optional(),
      actions: z.array(ActionSchema).min(1).max(3),
    })
    .strict(),
  z
    .object({
      type: z.literal('contactCard'),
      title: z.string().min(1).max(80).default('Contact'),
      body: z.string().min(1).max(420).optional(),
      actions: z.array(ActionSchema).min(1).max(3).optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal('conceptExplanation'),
      title: z.string().min(1).max(80),
      concept: z.string().min(1).max(80),
      explanation: z.string().min(1).max(900),
      bullets: z.array(z.string().min(1).max(140)).max(6).optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal('recommendedPath'),
      title: z.string().min(1).max(80).default('Aanbevolen route'),
      path: RecommendedPathSchema,
      why: z.string().min(1).max(700),
      actions: z.array(ActionSchema).min(1).max(3),
    })
    .strict(),
  z
    .object({
      type: z.literal('assessmentIntro'),
      title: z.string().min(1).max(80).default('Korte intake'),
      questions: z.array(z.string().min(1).max(180)).min(1).max(6),
    })
    .strict(),
  z
    .object({
      type: z.literal('diagnosticSummary'),
      title: z.string().min(1).max(80).default('Samenvatting'),
      summary: z.string().min(1).max(700),
      signals: z.array(z.string().min(1).max(160)).max(6).optional(),
      confidence: z.number().min(1).max(5).optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal('faq'),
      title: z.string().min(1).max(80).default('FAQ'),
      items: z.array(FaqItemSchema).min(1).max(6),
    })
    .strict(),
  z
    .object({
      type: z.literal('comparison'),
      title: z.string().min(1).max(80),
      leftTitle: z.string().min(1).max(60),
      rightTitle: z.string().min(1).max(60),
      rows: z.array(ComparisonRowSchema).min(1).max(8),
    })
    .strict(),
  z
    .object({
      type: z.literal('personaSummary'),
      title: z.string().min(1).max(80).default('Past dit bij jou?'),
      bullets: z.array(z.string().min(1).max(160)).min(1).max(8),
    })
    .strict(),
  z
    .object({
      type: z.literal('cta'),
      title: z.string().min(1).max(80),
      body: z.string().min(1).max(420).optional(),
      action: ActionSchema,
      note: z.string().min(1).max(160).optional(),
    })
    .strict(),
])

export const PageConfigSchema = z
  .object({
    blocks: z.array(PageBlockSchema).max(8).default([]),
  })
  .strict()

export const ProfileSchema = z
  .object({
    role: z.string().max(80).nullable().default(null),
    goal: z.string().max(160).nullable().default(null),
    context: z.string().max(240).nullable().default(null),
    constraints: z.array(z.string().max(120)).max(6).default([]),
  })
  .strict()

export const DiagnosisSchema = z
  .object({
    summary: z.string().max(700).nullable().default(null),
    signals: z.array(z.string().max(160)).max(6).default([]),
    risks: z.array(z.string().max(160)).max(6).default([]),
    assumptions: z.array(z.string().max(160)).max(6).default([]),
    confidence: z.number().min(1).max(5).nullable().default(null),
  })
  .strict()

export const AgentResponseSchema = z
  .object({
    mode: AiModeSchema.default('info'),
    reply: z.string().min(1).max(1200),
    followUpQuestions: z.array(z.string().min(1).max(180)).max(6).default([]),
    pageConfig: PageConfigSchema.default({ blocks: [] }),
    profile: ProfileSchema.default({ role: null, goal: null, context: null, constraints: [] }),
    diagnosis: DiagnosisSchema.default({
      summary: null,
      signals: [],
      risks: [],
      assumptions: [],
      confidence: null,
    }),
    recommendedPath: RecommendedPathSchema.default('unknown'),
  })
  .strict()

export function safeParseAgentResponse(payload) {
  return AgentResponseSchema.safeParse(payload)
}

