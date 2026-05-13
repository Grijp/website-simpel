import { z } from 'zod'

export const ModeSchema = z.enum(['info', 'explanation', 'fit', 'assessment'])

export const AgentTestResponseSchema = z
  .object({
    mode: ModeSchema,
    reason: z.string().min(1).max(800),
    knowledgeDomain: z.string().min(1).max(60),
    blocks: z.array(z.string().min(1).max(40)).min(1).max(12),
    needsFollowUp: z.boolean(),
    suggestedNextMode: ModeSchema.nullable(),
  })
  .strict()

export function safeParseAgentTestResponse(payload) {
  return AgentTestResponseSchema.safeParse(payload)
}

