import { Request, Response } from 'express'
import { execFile } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createServer } from 'node:https'
import { AddressInfo } from 'node:net'
import path from 'node:path'
import { promisify } from 'node:util'
import { gunzipSync } from 'node:zlib'
import { buildSync } from 'esbuild'
import { defaultClient, getCorrelationContext, setup } from 'applicationinsights'
import type { HttpInstrumentationConfig } from '@opentelemetry/instrumentation-http'
import { ApplicationInfo } from '../applicationInfo'
import { appInsightsMiddleware, initialiseAppInsights, reportException } from './azureAppInsights'

jest.mock('applicationinsights', () => ({
  defaultClient: { context: { tags: {} }, config: {}, trackException: jest.fn() },
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
    defaultClient.config.azureMonitorOpenTelemetryOptions = {}
  })

  afterEach(() => {
    jest.restoreAllMocks()
    if (originalConnectionString === undefined) delete process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
    else process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = originalConnectionString
  })

  it('sets the role and build before starting log and request collection', () => {
    jest.mocked(configuration.start).mockImplementationOnce(() => {
      const { resource } = defaultClient.config.azureMonitorOpenTelemetryOptions
      expect(resource?.attributes['service.name']).toBe('test-app')
      expect(resource?.attributes['service.version']).toBe('123')
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

  it.each([undefined, /^\/order\//])('preserves existing HTTP hooks and SDK naming for route %s', route => {
    const previousHook = jest.fn()
    const httpOptions: HttpInstrumentationConfig = { enabled: true, applyCustomAttributesOnSpan: previousHook }
    defaultClient.config.azureMonitorOpenTelemetryOptions = {
      instrumentationOptions: { http: httpOptions },
    }
    initialiseAppInsights(applicationInfo)
    const httpInstrumentation = defaultClient.config.azureMonitorOpenTelemetryOptions.instrumentationOptions
      ?.http as HttpInstrumentationConfig
    const hook = httpInstrumentation.applyCustomAttributesOnSpan
    if (!hook) throw new Error('HTTP span hook not configured')
    const span = { setAttribute: jest.fn(), updateName: jest.fn() }
    const req = { method: 'GET', route: { path: route } } as Request
    const res = {} as Response

    hook(span as unknown as Parameters<typeof hook>[0], req, res)

    expect(previousHook).toHaveBeenCalledWith(span, req, res)
    expect(span.setAttribute).not.toHaveBeenCalled()
    expect(span.updateName).not.toHaveBeenCalled()
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

it('correlates real request, Bunyan, exception and dependency telemetry in a separate process', async () => {
  type Envelope = {
    tags: Record<string, string>
    data: {
      baseType: string
      baseData: {
        id?: string
        name?: string
        url?: string
        data?: string
        message?: string
        exceptions?: { message: string }[]
      }
    }
  }
  const telemetry: Envelope[] = []
  const root = path.resolve(__dirname, '../..')
  const buildDirectory = mkdtempSync(path.join(root, '.telemetry-smoke-'))
  const traceId = '1234567890abcdef1234567890abcdef'
  let dependencyTraceparent: string | string[] | undefined
  const certificate = path.join(buildDirectory, 'collector.crt')
  const key = path.join(buildDirectory, 'collector.key')
  await promisify(execFile)('openssl', [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-days',
    '1',
    '-keyout',
    key,
    '-out',
    certificate,
    '-subj',
    '/CN=localhost',
    '-addext',
    'subjectAltName=IP:127.0.0.1',
  ])
  const collector = createServer({ key: readFileSync(key), cert: readFileSync(certificate) }, (req, res) => {
    if (req.url === '/dependency') {
      dependencyTraceparent = req.headers.traceparent
      res.end('ok')
      return
    }
    const chunks: Buffer[] = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => {
      const body = Buffer.concat(chunks)
      const decoded = req.headers['content-encoding'] === 'gzip' ? gunzipSync(body) : body
      const envelopes: Envelope[] = JSON.parse(decoded.toString())
      telemetry.push(...envelopes)
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ itemsReceived: envelopes.length, itemsAccepted: envelopes.length, errors: [] }))
    })
  })
  await new Promise<void>(resolve => {
    collector.listen(0, '127.0.0.1', resolve)
  })
  const endpoint = `https://127.0.0.1:${(collector.address() as AddressInfo).port}`

  try {
    buildSync({
      entryPoints: [
        'server/utils/initialiseAppInsights.ts',
        'server/utils/azureAppInsights.ts',
        'server/applicationInfo.ts',
        'server/config.ts',
        'logger.ts',
      ].map(filename => path.join(root, filename)),
      outbase: root,
      outdir: buildDirectory,
      platform: 'node',
      format: 'cjs',
      target: 'node20',
    })
    await promisify(execFile)(
      process.execPath,
      [
        '-e',
        `
      require(process.env.SMOKE_BUILD + '/server/utils/initialiseAppInsights.js')
      const express = require('express')
      const http = require('node:http')
      const https = require('node:https')
      const { context, trace } = require('@opentelemetry/api')
      const logger = require(process.env.SMOKE_BUILD + '/logger.js').default
      const { appInsightsMiddleware, reportException } = require(process.env.SMOKE_BUILD + '/server/utils/azureAppInsights.js')
      const { defaultClient } = require('applicationinsights')
      const get = (url, headers = {}) => new Promise((resolve, reject) => {
        const client = url.startsWith('https:') ? https : http
        client.get(url, { headers }, response => {
          response.resume()
          response.on('end', () => resolve(response.headers))
          response.on('error', reject)
        }).on('error', reject)
      })
      const run = async () => {
        const app = express()
        app.use(appInsightsMiddleware())
        const router = express.Router()
        app.use('/order/:orderId', router)
        router.get('/telemetry-smoke/:section', (req, res, next) => {
          get(process.env.SMOKE_ENDPOINT + '/dependency').then(() => {
            logger.warn({ operationId: res.locals.operationId }, 'telemetry-smoke-log')
            reportException(new Error('telemetry-smoke-exception'), { path: req.path })
            res.sendStatus(500)
          }).catch(next)
        })
        const server = app.listen(0, '127.0.0.1')
        await new Promise(resolve => server.once('listening', resolve))
        const parent = trace.setSpanContext(context.active(), {
          traceId: '${traceId}', spanId: '1234567890abcdef', traceFlags: 1, isRemote: true,
        })
        const headers = await context.with(parent, () =>
          get('http://127.0.0.1:' + server.address().port + '/order/test-order/telemetry-smoke/summary'))
        if (headers['x-operation-id'] !== '${traceId}') throw new Error('Missing request operation ID')
        await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
        await defaultClient.flush()
        await defaultClient.shutdown()
      }
      run().then(() => process.exit(0)).catch(error => {
        process.stderr.write(error.stack)
        process.exit(1)
      })
    `,
      ],
      {
        cwd: root,
        timeout: 30000,
        env: {
          ...process.env,
          NODE_ENV: 'test',
          BUILD_NUMBER: 'telemetry-test-build',
          NODE_OPTIONS: '',
          NODE_EXTRA_CA_CERTS: certificate,
          SMOKE_BUILD: buildDirectory,
          SMOKE_ENDPOINT: endpoint,
          APPLICATIONINSIGHTS_CONNECTION_STRING: `InstrumentationKey=00000000-0000-0000-0000-000000000001;IngestionEndpoint=${endpoint}`,
          APPLICATION_INSIGHTS_NO_STATSBEAT: 'true',
          APPLICATIONINSIGHTS_CONFIGURATION_CONTENT: JSON.stringify({
            enableSendLiveMetrics: false,
            enableAutoCollectPerformance: false,
            enableUseDiskRetryCaching: false,
            samplingPercentage: 100,
            samplingRatio: 1,
            tracesPerSecond: 0,
          }),
        },
      },
    )

    const request = telemetry.find(
      item => item.data.baseType === 'RequestData' && item.data.baseData.url?.endsWith('/telemetry-smoke/summary'),
    )
    const log = telemetry.find(
      item => item.data.baseType === 'MessageData' && item.data.baseData.message?.includes('telemetry-smoke-log'),
    )
    const exception = telemetry.find(
      item =>
        item.data.baseType === 'ExceptionData' &&
        item.data.baseData.exceptions?.some(error => error.message === 'telemetry-smoke-exception'),
    )
    const dependency = telemetry.find(
      item => item.data.baseType === 'RemoteDependencyData' && item.data.baseData.data?.endsWith('/dependency'),
    )

    for (const item of [request, log, exception, dependency]) {
      expect(item).toBeDefined()
      expect(item?.tags['ai.operation.id']).toBe(traceId)
      expect(item?.tags['ai.cloud.role']).toBe('hmpps-electronic-monitoring-create-an-order')
      expect(item?.tags['ai.application.ver']).toBe('telemetry-test-build')
    }
    expect(request?.data.baseData.name).toBe('GET /telemetry-smoke/:section')
    expect(request?.tags['ai.operation.name']).toBe('GET /telemetry-smoke/:section')
    expect(log?.tags['ai.operation.parentId']).toBe(request?.data.baseData.id)
    expect(exception?.tags['ai.operation.parentId']).toBe(request?.data.baseData.id)
    expect(dependency?.tags['ai.operation.parentId']).toBe(request?.data.baseData.id)
    expect(dependencyTraceparent).toBe(`00-${traceId}-${dependency?.data.baseData.id}-01`)
  } finally {
    collector.closeAllConnections()
    await new Promise<void>((resolve, reject) => {
      collector.close(error => (error ? reject(error) : resolve()))
    })
    rmSync(buildDirectory, { recursive: true, force: true })
  }
}, 40000)
