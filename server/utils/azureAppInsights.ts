import { defaultClient, getCorrelationContext, setup, TelemetryClient } from 'applicationinsights'
import type { HttpInstrumentationConfig } from '@opentelemetry/instrumentation-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { Request, RequestHandler } from 'express'
import type { ApplicationInfo } from '../applicationInfo'

export function initialiseAppInsights(applicationInfo?: ApplicationInfo): void {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    const configuration = setup().setAutoCollectConsole(true, false).setInternalLogging(false, true)
    const options = defaultClient.config.azureMonitorOpenTelemetryOptions
    const httpOptions: HttpInstrumentationConfig = options?.instrumentationOptions?.http || {}
    const httpInstrumentation: HttpInstrumentationConfig = {
      enabled: true,
      ...httpOptions,
      applyCustomAttributesOnSpan(span, request, response) {
        httpOptions.applyCustomAttributesOnSpan?.(span, request, response)
        const route = (request as Request).route?.path
        if (typeof route === 'string') {
          span.setAttribute('http.route', route)
          span.updateName(`${request.method} ${route}`)
        }
      },
    }
    defaultClient.config.azureMonitorOpenTelemetryOptions = {
      ...options,
      instrumentationOptions: {
        ...options?.instrumentationOptions,
        http: httpInstrumentation,
      },
    }
    if (applicationInfo) buildAppInsightsClient(applicationInfo)
    configuration.start()
  }
}

export function buildAppInsightsClient(
  { applicationName, buildNumber }: ApplicationInfo,
  overrideName?: string,
): TelemetryClient | null {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    const telemetryOptions = defaultClient.config.azureMonitorOpenTelemetryOptions
    const identity = resourceFromAttributes({
      'service.name': overrideName || applicationName,
      'service.version': buildNumber,
    })

    defaultClient.config.azureMonitorOpenTelemetryOptions = {
      ...telemetryOptions,
      resource: telemetryOptions?.resource?.merge(identity) ?? identity,
    }

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
