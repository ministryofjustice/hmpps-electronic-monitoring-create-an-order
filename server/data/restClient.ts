import { Readable } from 'stream'

import { HttpAgent, HttpsAgent } from 'agentkeepalive'
import superagent from 'superagent'

import logger from '../../logger'
import type { ApiConfig } from '../config'
import type { SanitisedError, UnsanitisedError } from '../sanitisedError'
import sanitiseError from '../sanitisedError'

interface Request {
  path: string
  query?: object | string
  headers?: Record<string, string>
  responseType?: string
  raw?: boolean
  token: string
  retryOnErr?: boolean
  redactErrorDetails?: boolean
}

interface RequestWithBody extends Request {
  data?: Record<string, unknown> | unknown[]
  retry?: boolean
}

interface StreamRequest {
  path?: string
  headers?: Record<string, string>
  errorLogger?: (e: UnsanitisedError) => void
  token: string
}

interface PostMultiPartRequest extends Request {
  metadata?: Record<string, unknown>
  retry?: boolean
  fileToUpload: Express.Multer.File
}

export default class RestClient {
  agent: HttpAgent

  constructor(
    private readonly name: string,
    private readonly config: ApiConfig,
  ) {
    this.agent = config.url.startsWith('https') ? new HttpsAgent(config.agent) : new HttpAgent(config.agent)
  }

  private apiUrl() {
    return this.config.url
  }

  private timeoutConfig() {
    return this.config.timeout
  }

  private logError(
    error: UnsanitisedError,
    path: string | undefined,
    method: string,
    redactErrorDetails = false,
  ): SanitisedError {
    const sanitisedError = sanitiseError(error)
    logger.warn(
      {
        err: redactErrorDetails ? undefined : sanitisedError,
        api: this.name,
        method,
        path: path ? new URL(path, this.apiUrl()).pathname : undefined,
        status: sanitisedError.status,
        code: !redactErrorDetails && 'code' in error ? error.code : undefined,
        errorCode: redactErrorDetails ? undefined : sanitisedError.data?.errorCode,
      },
      `Error calling ${this.name}`,
    )
    return sanitisedError
  }

  async get<Response = unknown>({
    path,
    query = {},
    headers = {},
    responseType = '',
    raw = false,
    token,
    redactErrorDetails = false,
  }: Request): Promise<Response> {
    logger.info(`${this.name} GET: ${this.apiUrl()}${path}`)
    try {
      const result = await superagent
        .get(`${this.apiUrl()}${path}`)
        .query(query)
        .agent(this.agent)
        .retry(2, (err, res) => {
          if (err && !redactErrorDetails)
            logger.info(`Retry handler found ${this.name} API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as Response) : result.body
    } catch (error) {
      throw this.logError(error as UnsanitisedError, path, 'GET', redactErrorDetails)
    }
  }

  async getWithoutBearer<Response = unknown>({
    path,
    query = {},
    headers = {},
    responseType = '',
    raw = false,
    retryOnErr = false,
    redactErrorDetails = false,
  }: Omit<Request, 'token'>): Promise<Response> {
    logger.info(`${this.name} GET: ${this.apiUrl()}${path}`)
    try {
      const result = await superagent
        .get(`${this.apiUrl()}${path}`)
        .query(query)
        .agent(this.agent)
        .retry(2, (err, res) => {
          if (err && !redactErrorDetails)
            logger.info(`Retry handler found ${this.name} API error with ${err.code} ${err.message}`)
          if (retryOnErr) {
            if (res && res.status === 500) {
              logger.info(`Retrying ${this.name} due to 500 Internal Server Error`)
              return true
            }

            if (res && res.status === 429) {
              logger.info(`Retrying ${this.name} due to 429 Rate Limit`)
              return true
            }

            if (res && res.status >= 400 && res.status < 500) {
              return false
            }
          }
          return undefined
        })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as Response) : result.body
    } catch (error) {
      throw this.logError(error as UnsanitisedError, path, 'GET', redactErrorDetails)
    }
  }

  async getRawResponse({
    path,
    query = {},
    headers = {},
    responseType = '',
    token,
    redactErrorDetails = false,
  }: Request): Promise<string> {
    logger.info(`${this.name} GET: ${this.apiUrl()}${path}`)
    try {
      const result = await superagent
        .get(`${this.apiUrl()}${path}`)
        .query(query)
        .agent(this.agent)
        .retry(2, (err, res) => {
          if (err && !redactErrorDetails)
            logger.info(`Retry handler found ${this.name} API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())
      return result.text
    } catch (error) {
      throw this.logError(error as UnsanitisedError, path, 'GET', redactErrorDetails)
    }
  }

  private async requestWithBody<Response = unknown>(
    method: 'patch' | 'post' | 'put',
    {
      path,
      query = {},
      headers = {},
      responseType = '',
      data = {},
      raw = false,
      token,
      retry = false,
      redactErrorDetails = false,
    }: RequestWithBody,
  ): Promise<Response> {
    logger.info(`${this.name} ${method.toUpperCase()}: ${path}`)
    try {
      const result = await superagent[method](`${this.apiUrl()}${path}`)
        .query(query)
        .send(data)
        .agent(this.agent)
        .retry(2, (err, res) => {
          if (retry === false) {
            return false
          }
          if (err && !redactErrorDetails) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as Response) : result.body
    } catch (error) {
      throw this.logError(error as UnsanitisedError, path, method.toUpperCase(), redactErrorDetails)
    }
  }

  async postMultiPart<Response = unknown>({
    path,
    query = {},
    headers = {},

    responseType = '',
    metadata = {},
    raw = false,
    token,
    retry = false,
    fileToUpload,
    redactErrorDetails = false,
  }: PostMultiPartRequest): Promise<Response> {
    logger.info(`${this.name} POST: ${path}`)
    try {
      const request = superagent
        .post(`${this.apiUrl()}${path}`)
        .query(query)
        .attach('file', fileToUpload.buffer, {
          filename: fileToUpload.originalname,
          contentType: fileToUpload.mimetype,
        })
        .field('metadata', JSON.stringify(metadata), { contentType: 'application/json' })
        .agent(this.agent)
        .retry(2, (err, res) => {
          if (retry === false) {
            return false
          }
          if (err && !redactErrorDetails) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      const result = await request
      return raw ? (result as Response) : result.body
    } catch (error) {
      throw this.logError(error as UnsanitisedError, path, 'POST', redactErrorDetails)
    }
  }

  async patch<Response = unknown>(request: RequestWithBody): Promise<Response> {
    return this.requestWithBody('patch', request)
  }

  async post<Response = unknown>(request: RequestWithBody): Promise<Response> {
    return this.requestWithBody('post', request)
  }

  async put<Response = unknown>(request: RequestWithBody): Promise<Response> {
    return this.requestWithBody('put', request)
  }

  async delete<Response = unknown>({
    path,
    query = {},
    headers = {},
    responseType = '',
    raw = false,
    token,
    redactErrorDetails = false,
  }: Request): Promise<Response> {
    logger.info(`${this.name} DELETE: ${path}`)
    try {
      const result = await superagent
        .delete(`${this.apiUrl()}${path}`)
        .query(query)
        .agent(this.agent)
        .retry(2, (err, res) => {
          if (err && !redactErrorDetails)
            logger.info(`Retry handler found ${this.name} API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? (result as Response) : result.body
    } catch (error) {
      throw this.logError(error as UnsanitisedError, path, 'DELETE', redactErrorDetails)
    }
  }

  async stream({ path = undefined, headers = {}, token }: StreamRequest): Promise<Readable> {
    logger.info(`${this.name} streaming: ${path}`)
    return new Promise((resolve, reject) => {
      superagent
        .get(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .auth(token, { type: 'bearer' })
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found ${this.name} API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .responseType('stream')
        .timeout(this.timeoutConfig())
        .set(headers)
        .end((error, response) => {
          if (error) {
            this.logError(error, path, 'GET')
            reject(error)
          } else if (response) {
            const s = new Readable()
            // eslint-disable-next-line no-underscore-dangle
            s._read = () => {}
            s.push(response.body)
            s.push(null)
            resolve(s)
          }
        })
    })
  }
}
