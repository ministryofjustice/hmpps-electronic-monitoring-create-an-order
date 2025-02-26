import { z } from 'zod'

export const YesNoUnknownEnum = z.enum(['YES', 'NO', 'UNKNOWN'])

export type YesNoUnknown = z.infer<typeof YesNoUnknownEnum>
