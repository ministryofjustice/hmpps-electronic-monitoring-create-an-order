import { defaultClient } from 'applicationinsights'
import logger from '../../logger'
import type { OrderType } from '../models/Order'

type OrderSubmissionAttemptEvent =
  | {
      outcome: 'success'
      orderType: OrderType
      durationMs: number
    }
  | {
      outcome: 'blocked'
      reason: 'already_submitted' | 'incomplete' | 'ineligible_monitoring_conditions'
      orderType: OrderType
      durationMs: number
    }
  | {
      outcome: 'failure'
      reason: 'error_status' | 'unexpected_error'
      orderType: OrderType
      durationMs: number
    }
  | {
      outcome: 'partial_success'
      reason: 'attachments_to_serco_failed'
      orderType: OrderType
      durationMs: number
    }

export type TelemetryEvents = {
  order_submission_attempt: OrderSubmissionAttemptEvent
  attachment_upload_failure: {
    attachmentType: 'LICENCE' | 'PHOTO_ID'
    reason: 'system_error'
  }
}

export interface TelemetryService {
  trackEvent<K extends keyof TelemetryEvents>(name: K, properties: TelemetryEvents[K]): void
}

export default class ApplicationInsightsTelemetryService implements TelemetryService {
  trackEvent<K extends keyof TelemetryEvents>(name: K, properties: TelemetryEvents[K]): void {
    try {
      defaultClient?.trackEvent({ name, properties })
    } catch (error) {
      logger.warn({ err: error, event: name }, 'Failed to record event with the Application Insights SDK')
    }
  }
}
