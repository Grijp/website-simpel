import { z } from 'zod'

export const AnalyzeModeSchema = z.enum(['info', 'uitleg', 'assessment'])

export const AnalyzeModeBlockSchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.literal('contactCard'),
      variant: z.enum(['default']).default('default'),
      name: z.string().min(1).max(80).optional(),
      email: z.string().min(1).max(120).optional(),
      phone: z.string().min(1).max(40).optional(),
      companyName: z.string().min(1).max(80).optional(),
      logoSrc: z.string().min(1).max(200).optional(),
      ctaHref: z.string().min(1).max(200).optional(),
      ctaLabel: z.string().min(1).max(60).optional(),
      ctaContextText: z.string().min(1).max(220).optional(),
    })
    .strict(),
])

export const AnalyzeModeResponseSchema = z
  .object({
    mode: AnalyzeModeSchema,
    reason: z.string().min(1).max(600),
    blocks: z.array(AnalyzeModeBlockSchema).max(4).default([]),
  })
  .strict()

export function safeParseAnalyzeModeResponse(payload) {
  return AnalyzeModeResponseSchema.safeParse(payload)
}

