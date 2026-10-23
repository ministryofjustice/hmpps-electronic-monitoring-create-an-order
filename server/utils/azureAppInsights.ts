import { defaultClient, getCorrelationContext, setup, TelemetryClient } from 'applicationinsights'
import { RequestHandler } from 'express'
import type { ApplicationInfo } from '../applicationInfo'

export function initialiseAppInsights(applicationInfo?: ApplicationInfo): void {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    const configuration = setup().setAutoCollectConsole(true, false).setInternalLogging(false, true)
    if (applicationInfo) buildAppInsightsClient(applicationInfo)
    configuration.start()
  }
}

export function buildAppInsightsClient(
  { applicationName, buildNumber }: ApplicationInfo,
  overrideName?: string,
): TelemetryClient | null {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    defaultClient.context.tags['ai.cloud.role'] = overrideName || applicationName
    defaultClient.context.tags['ai.application.ver'] = buildNumber

    return defaultClient
  }
  return null
}

// nicking opid for easy trace
export function appInsightsMiddleware(): RequestHandler {
  return (req, res, next) => {
    const operationId = getCorrelationContext()?.operation.id
    if (operationId) {
      res.locals.operationId = operationId
      res.setHeader('X-Operation-ID', operationId)
    }
    next()
  }
}
// explicit 500 handler
export function reportException(error: Error, properties: Record<string, unknown>): void {
  defaultClient?.trackException({ exception: error, properties })
}
