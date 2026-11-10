import z from 'zod'

export const MAX_ORDER_JSON_BYTES = 64 * 1024

export const reasonSchema = z
  .object({
    section: z.string().trim().min(1, 'Enter a section').max(255, 'Section must be 255 characters or fewer'),
    details: z.string().trim().max(10000, 'Details must be 10,000 characters or fewer').default(''),
  })
  .superRefine((reason, context) => {
    if (reason.section === 'other' && !reason.details) {
      context.addIssue({ code: 'custom', path: ['details'], message: 'Enter details for other' })
    }
  })

export const reasonsSchema = z.array(reasonSchema).min(1, 'Enter at least one return reason').max(50)
export const versionSchema = z.object({
  expectedCurrentOrderVersionId: z.string().uuid('Refresh the page to load the current version'),
  expectedSimulatedSubmissionVersionId: z.string().uuid('Refresh the page to load the simulated submission'),
})
export const stateSchema = versionSchema.extend({ state: z.enum(['PROCESSING', 'ACCEPTED']) })
export const returnSchema = versionSchema.extend({
  eventId: z.string().uuid(),
  reasons: reasonsSchema,
})

export const creationSchema = z
  .object({
    creationRequestId: z.string().uuid(),
    state: z.enum(['DRAFT', 'PROCESSING', 'ACCEPTED', 'RETURNED']),
    orderJson: z
      .string()
      .superRefine((value, context) => {
        if (Buffer.byteLength(value, 'utf8') > MAX_ORDER_JSON_BYTES) {
          context.addIssue({ code: 'custom', message: 'Order JSON must be 64 KiB or smaller' })
        }
      })
      .transform((value, context): Record<string, unknown> => {
        try {
          const order = JSON.parse(value)
          if (
            order &&
            typeof order === 'object' &&
            !Array.isArray(order) &&
            order.deviceWearer &&
            typeof order.deviceWearer === 'object' &&
            !Array.isArray(order.deviceWearer)
          ) {
            return order
          }
          context.addIssue({ code: 'custom', message: 'Enter a full OrderDto object including deviceWearer' })
        } catch {
          context.addIssue({ code: 'custom', message: 'Enter valid JSON' })
        }
        return z.NEVER
      }),
    reasons: z.array(reasonSchema).max(50).default([]),
  })
  .superRefine((form, context) => {
    if (form.state === 'RETURNED' && !form.reasons.length) {
      context.addIssue({ code: 'custom', path: ['reasons'], message: 'Enter at least one return reason' })
    }
    if (form.state !== 'RETURNED' && form.reasons.length) {
      context.addIssue({ code: 'custom', path: ['reasons'], message: 'Return reasons require the returned state' })
    }
  })
