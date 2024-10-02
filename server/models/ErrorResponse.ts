import { z } from 'zod'

const ErrorResponseModel = z.object({
  status: z.number().nullable(),
  userMessage: z.string().nullable(),
  developerMessage: z.string().nullable(),
})

export type ErrorResponse = z.infer<typeof ErrorResponseModel>

export default ErrorResponseModel
