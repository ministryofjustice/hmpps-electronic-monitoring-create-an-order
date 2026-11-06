import { defaultClient } from 'applicationinsights'
import logger from '../../logger'
import ApplicationInsightsTelemetryService from './telemetryService'

jest.mock('applicationinsights', () => ({
  defaultClient: { trackEvent: jest.fn() },
}))

describe('ApplicationInsightsTelemetryService', () => {
  const telemetryService = new ApplicationInsightsTelemetryService()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('sends a typed event to Application Insights', () => {
    telemetryService.trackEvent('order_submission_attempt', { outcome: 'success' })

    expect(defaultClient.trackEvent).toHaveBeenCalledWith({
      name: 'order_submission_attempt',
      properties: { outcome: 'success' },
    })
  })

  it('logs and suppresses errors thrown by the Application Insights SDK', () => {
    const error = new Error('Telemetry unavailable')
    jest.mocked(defaultClient.trackEvent).mockImplementationOnce(() => {
      throw error
    })
    const warn = jest.spyOn(logger, 'warn').mockImplementation(() => logger)

    expect(() => telemetryService.trackEvent('order_submission_attempt', { outcome: 'failure' })).not.toThrow()
    expect(warn).toHaveBeenCalledWith(
      { err: error, event: 'order_submission_attempt' },
      'Failed to record event with the Application Insights SDK',
    )
  })
})
