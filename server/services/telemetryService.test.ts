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
    const properties = { outcome: 'success' as const, orderType: 'REQUEST' as const, durationMs: 120 }
    telemetryService.trackEvent('order_submission_attempt', properties)

    expect(defaultClient.trackEvent).toHaveBeenCalledWith({
      name: 'order_submission_attempt',
      properties,
    })
  })

  it('logs errors thrown by the Application Insights SDK', () => {
    const sdkError = new Error('Telemetry unavailable')
    jest.mocked(defaultClient.trackEvent).mockImplementationOnce(() => {
      throw sdkError
    })
    const warn = jest.spyOn(logger, 'warn').mockImplementation(() => logger)

    expect(() =>
      telemetryService.trackEvent('order_submission_attempt', {
        outcome: 'success',
        orderType: 'REQUEST',
        durationMs: 120,
      }),
    ).not.toThrow()

    expect(warn).toHaveBeenCalledWith(
      { err: sdkError, event: 'order_submission_attempt' },
      'Failed to record event with the Application Insights SDK',
    )
  })
})
