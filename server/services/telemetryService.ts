import { defaultClient } from 'applicationinsights'
import logger from '../../logger'

export type TelemetryEvents = {
  order_submission_attempt: {
    outcome: 'success' | 'failure'
    failureReason?: 'already_submitted' | 'incomplete' | 'error_status' | 'partial_success'
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
