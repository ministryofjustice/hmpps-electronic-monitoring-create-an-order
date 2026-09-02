import RestClient from '../../data/restClient'
import { SanitisedError } from '../../sanitisedError'

type HttpMethod = 'GET' | 'PUT' | 'POST'

export type RecordedRequest = {
  method: HttpMethod
  path: string
  body?: unknown
}

type StubbedResponse = { kind: 'success'; body: unknown } | { kind: 'failure'; status: number; data?: unknown }

/**
 * The single test double in an acceptance test: it stands in for the CEMO
 * API, which is the only thing outside this application's boundary.
 *
 * Deliberately NOT a simulated backend. It does two things only:
 *   1. records what we sent, so tests can assert on the outgoing request
 *   2. returns whatever response the scenario says the backend gave
 *
 * Backend behaviour (e.g. which fields are mandatory) is never re-implemented
 * here -- that belongs to the backend and to contract tests. A test must
 * explicitly declare how the API responds, otherwise it fails loudly.
 */
export default class FakeCemoApiClient extends RestClient {
  readonly requests: RecordedRequest[] = []

  private readonly responses = new Map<string, StubbedResponse>()

  constructor() {
    super('fakeCemoApi', { url: '', timeout: { response: 0, deadline: 0 }, agent: { timeout: 0 } })
  }

  stubResponse(method: HttpMethod, path: string, body: unknown): void {
    this.responses.set(`${method} ${path}`, { kind: 'success', body })
  }

  stubFailure(method: HttpMethod, path: string, status: number, data?: unknown): void {
    this.responses.set(`${method} ${path}`, { kind: 'failure', status, data })
  }

  requestsTo(method: HttpMethod, path: string): RecordedRequest[] {
    return this.requests.filter(request => request.method === method && request.path === path)
  }

  private respond<Response>(method: HttpMethod, path: string, body?: unknown): Response {
    this.requests.push({ method, path, body })

    const stubbed = this.responses.get(`${method} ${path}`)

    if (!stubbed) {
      throw new Error(
        `FakeCemoApiClient received an unstubbed request: ${method} ${path}. ` +
          `Declare what the API returns using stubResponse/stubFailure.`,
      )
    }

    if (stubbed.kind === 'failure') {
      const error = new Error(`Request failed with status code ${stubbed.status}`) as SanitisedError
      error.stack = ''
      error.status = stubbed.status
      error.data = stubbed.data as SanitisedError['data']
      throw error
    }

    return stubbed.body as Response
  }

  async get<Response = unknown>({ path }: { path: string }): Promise<Response> {
    return this.respond<Response>('GET', path)
  }

  async put<Response = unknown>({ path, data }: { path: string; data?: unknown }): Promise<Response> {
    return this.respond<Response>('PUT', path, data)
  }

  async post<Response = unknown>({ path, data }: { path: string; data?: unknown }): Promise<Response> {
    return this.respond<Response>('POST', path, data)
  }
}
