import z from 'zod'
import RestClient from '../../data/restClient'
import Up3SimulationError from './error'

export { default as Up3SimulationError } from './error'

export const inspectionSchema = z.object({
  orderId: z.string().uuid(),
  currentOrderVersionId: z.string().uuid(),
  currentOrderVersionNumber: z.number(),
  simulatedSubmissionVersionId: z.string().uuid().nullable(),
  simulatedSubmissionVersionNumber: z.number().nullable(),
  caseId: z.string().nullable(),
  caseState: z.string().nullable(),
  orderStatus: z.string(),
  isOwner: z.boolean(),
  canAmend: z.boolean(),
  canControlSubmission: z.boolean(),
  lastProcessedEventId: z.string().uuid().nullable(),
  capturedUserEmails: z.number(),
  capturedNoEmails: z.number(),
})

export const returnReceiptSchema = z.object({
  eventId: z.string().uuid(),
  orderId: z.string().uuid(),
  targetOrderVersionId: z.string().uuid(),
  simulatedSubmissionVersionId: z.string().uuid(),
  status: z.enum(['PENDING_PUBLICATION', 'QUEUED', 'PROCESSED', 'STALE_IGNORED', 'FAILED']),
  createdAt: z.string(),
  queuedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  publicationAttempts: z.number(),
  processingFailures: z.number(),
  nextPublicationAttemptAt: z.string().nullable(),
  failureStage: z.string().nullable(),
  errorCode: z.string().nullable(),
})

const creationSchema = z.object({
  creationRequestId: z.string().uuid(),
  createdOrderVersionId: z.string().uuid(),
  simulation: inspectionSchema,
  requestedState: z.string(),
  returnEventId: z.string().uuid().nullable(),
})

const creationReceiptSchema = z.object({
  creationRequestId: z.string().uuid(),
  status: z.string(),
  orderId: z.string().uuid().nullable(),
  createdOrderVersionId: z.string().uuid().nullable(),
  requestedState: z.string(),
  returnEventId: z.string().uuid().nullable(),
})

export type Inspection = z.infer<typeof inspectionSchema>
export type ReturnReceipt = z.infer<typeof returnReceiptSchema>
export type VersionCommand = {
  expectedCurrentOrderVersionId: string
  expectedSimulatedSubmissionVersionId: string
}
export type ReturnCommand = VersionCommand & {
  eventId: string
  datetimeOfStatusChange: string
  reasons: { section: string; details: string | null }[]
}
export type CreationCommand = {
  creationRequestId: string
  order: Record<string, unknown>
  state: 'DRAFT' | 'PROCESSING' | 'ACCEPTED' | 'RETURNED'
  reasons?: ReturnCommand['reasons']
}

export default class Up3SimulationService {
  private readonly basePath = '/api/dev/up3-simulation'

  constructor(private readonly apiClient: RestClient) {}

  private async request<T>(schema: z.ZodType<T>, token: string, operation: () => Promise<unknown>): Promise<T> {
    try {
      return schema.parse(await operation())
    } catch (error) {
      const failure = error as { status?: number; data?: { errorCode?: unknown; code?: unknown; errors?: unknown } }
      const code = failure.data?.errorCode ?? failure.data?.code
      const status = failure.status ?? 502
      const fields = Array.isArray(failure.data) ? failure.data : failure.data?.errors
      const fieldErrors = Array.isArray(fields)
        ? fields.flatMap(field => {
            const message = field && typeof field === 'object' ? (field.error ?? field.message) : undefined
            return typeof message === 'string' && !message.includes(token)
              ? [{ text: message.slice(0, 1000), href: '#main-content' }]
              : []
          })
        : []
      let safeCode = status === 400 ? 'UP3_SIMULATION_VALIDATION_FAILED' : 'UP3_SIMULATION_UNAVAILABLE'
      if (typeof code === 'string' && /^UP3_SIMULATION_[A-Z0-9_]+$/.test(code) && !code.includes(token)) safeCode = code
      throw new Up3SimulationError(safeCode, status, fieldErrors)
    }
  }

  availability(token: string) {
    return this.request(z.object({ available: z.boolean(), code: z.string() }), token, () =>
      this.apiClient.get({
        path: `${this.basePath}/availability`,
        token,
        redactErrorDetails: true,
      }),
    )
  }

  inspect(token: string, orderId: string) {
    return this.request(inspectionSchema, token, () =>
      this.apiClient.get({
        path: `${this.basePath}/orders/${orderId}`,
        token,
        redactErrorDetails: true,
      }),
    )
  }

  setState(token: string, orderId: string, command: VersionCommand & { state: 'PROCESSING' | 'ACCEPTED' }) {
    return this.request(inspectionSchema, token, () =>
      this.apiClient.put({
        path: `${this.basePath}/orders/${orderId}/state`,
        token,
        retry: false,
        data: command,
        redactErrorDetails: true,
      }),
    )
  }

  publishReturn(token: string, orderId: string, command: ReturnCommand) {
    return this.request(returnReceiptSchema, token, () =>
      this.apiClient.post({
        path: `${this.basePath}/orders/${orderId}/return`,
        token,
        retry: false,
        data: command,
        redactErrorDetails: true,
      }),
    )
  }

  returnStatus(token: string, orderId: string, eventId: string) {
    return this.request(returnReceiptSchema, token, () =>
      this.apiClient.get({
        path: `${this.basePath}/orders/${orderId}/returns/${eventId}`,
        token,
        redactErrorDetails: true,
      }),
    )
  }

  create(token: string, command: CreationCommand) {
    return this.request(creationSchema, token, () =>
      this.apiClient.post({
        path: `${this.basePath}/orders`,
        token,
        retry: false,
        data: command,
        redactErrorDetails: true,
      }),
    )
  }

  creationStatus(token: string, creationRequestId: string) {
    return this.request(creationReceiptSchema, token, () =>
      this.apiClient.get({
        path: `${this.basePath}/creations/${creationRequestId}`,
        token,
        redactErrorDetails: true,
      }),
    )
  }
}
