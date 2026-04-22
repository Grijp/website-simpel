import { z } from 'zod'

/**
 * Shared schema for safe structured UI output.
 * The model may ONLY emit config that matches this schema.
 * Rendering is done via a component registry on the client.
 */

export const AiModeSchema = z.enum(['info', 'explanation', 'fit', 'assessment'])

export const ActionSchema = z
  .object({
    label: z.string().min(1).max(60),
    kind: z.enum(['navigate', 'external']),
    to: z.string().min(1),
    tone: z.enum(['primary', 'secondary']).default('secondary'),
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

export const AgentResponseSchema = z
  .object({
    mode: AiModeSchema.default('info'),
    reply: z.string().min(1).max(1200),
    pageConfig: PageConfigSchema.default({ blocks: [] }),
    profile: ProfileSchema.default({ role: null, goal: null, context: null, constraints: [] }),
  })
  .strict()

export function safeParseAgentResponse(payload) {
  return AgentResponseSchema.safeParse(payload)
}

