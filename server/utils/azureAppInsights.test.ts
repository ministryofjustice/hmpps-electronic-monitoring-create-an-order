import { Request, Response } from 'express'
import { defaultClient, getCorrelationContext, setup } from 'applicationinsights'
import { ApplicationInfo } from '../applicationInfo'
import { appInsightsMiddleware, initialiseAppInsights, reportException } from './azureAppInsights'

jest.mock('applicationinsights', () => ({
  defaultClient: { context: { tags: {} }, trackException: jest.fn() },
  getCorrelationContext: jest.fn(),
  setup: jest.fn().mockReturnValue({
    setAutoCollectConsole: jest.fn().mockReturnThis(),
    setInternalLogging: jest.fn().mockReturnThis(),
    start: jest.fn(),
  }),
}))

const configuration = setup()
const originalConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
const applicationInfo: ApplicationInfo = {
  applicationName: 'test-app',
  buildNumber: '123',
  gitRef: 'abc123',
  gitShortHash: 'abc123',
  branchName: 'test',
  activeAgencies: [],
}

describe('Application Insights', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = 'test-connection-string'
    defaultClient.context.tags = {}
  })

  afterEach(() => {
    jest.restoreAllMocks()
    if (originalConnectionString === undefined) delete process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
    else process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = originalConnectionString
  })

  it('sets the role and build before starting log and request collection', () => {
    jest.mocked(configuration.start).mockImplementationOnce(() => {
      expect(defaultClient.context.tags['ai.cloud.role']).toBe('test-app')
      expect(defaultClient.context.tags['ai.application.ver']).toBe('123')
      return configuration
    })

    initialiseAppInsights(applicationInfo)

    expect(configuration.setAutoCollectConsole).toHaveBeenCalledWith(true, false)
    expect(configuration.setInternalLogging).toHaveBeenCalledWith(false, true)
    expect(configuration.start).toHaveBeenCalledTimes(1)
  })

  it('does not start collection without a connection string', () => {
    delete process.env.APPLICATIONINSIGHTS_CONNECTION_STRING

    initialiseAppInsights(applicationInfo)

    expect(setup).not.toHaveBeenCalled()
    expect(configuration.start).not.toHaveBeenCalled()
  })

  it('makes the operation ID available to logs and the browser response', () => {
    const operationId = '1234567890abcdef1234567890abcdef'
    jest
      .mocked(getCorrelationContext)
      .mockReturnValue({ operation: { id: operationId } } as ReturnType<typeof getCorrelationContext>)
    const req = {} as Request
    const res = { locals: {}, setHeader: jest.fn() } as unknown as Response
    const next = jest.fn()

    appInsightsMiddleware()(req, res, next)

    expect(res.locals.operationId).toBe(operationId)
    expect(res.setHeader).toHaveBeenCalledWith('X-Operation-ID', operationId)
    expect(next).toHaveBeenCalledWith()
  })

  it('reports handled exceptions with safe request context', () => {
    const error = new Error('Request failed')
    const properties = { method: 'POST', path: '/order/test/submit', status: 500 }

    reportException(error, properties)

    expect(defaultClient.trackException).toHaveBeenCalledWith({ exception: error, properties })
  })
})
