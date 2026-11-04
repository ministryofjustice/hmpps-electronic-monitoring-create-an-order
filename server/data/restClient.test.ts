import nock from 'nock'
import bunyan from 'bunyan'

import logger from '../../logger'
import { AgentConfig } from '../config'
import RestClient from './restClient'

const restClient = new RestClient('api-name', {
  url: 'http://localhost:8080/api',
  timeout: {
    response: 1000,
    deadline: 1000,
  },
  agent: new AgentConfig(1000),
})

describe.each(['get', 'patch', 'post', 'put', 'delete'] as const)('Method: %s', method => {
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => null)
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('should return response body', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      [method]('/api/test')
      .reply(200, { success: true })

    const result = await restClient[method]({
      path: '/test',
      token: 'token-1',
    })

    expect(nock.isDone()).toBe(true)

    expect(result).toStrictEqual({
      success: true,
    })
  })

  it('should return raw response body', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      [method]('/api/test')
      .reply(200, { success: true })

    const result = await restClient[method]({
      path: '/test',
      headers: { header1: 'headerValue1' },
      raw: true,
      token: 'token-1',
    })

    expect(nock.isDone()).toBe(true)

    expect(result).toMatchObject({
      req: { method: method.toUpperCase() },
      status: 200,
      text: '{"success":true}',
    })
  })

  if (method === 'get' || method === 'delete') {
    it('should retry by default', async () => {
      nock('http://localhost:8080', {
        reqheaders: { authorization: 'Bearer token-1' },
      })
        [method]('/api/test')
        .reply(500)
        [method]('/api/test')
        .reply(500)
        [method]('/api/test')
        .reply(500)

      await expect(
        restClient[method]({
          path: '/test',
          headers: { header1: 'headerValue1' },
          token: 'token-1',
        }),
      ).rejects.toThrow('Internal Server Error')

      expect(nock.isDone()).toBe(true)
    })
  } else {
    it('should not retry by default', async () => {
      nock('http://localhost:8080', {
        reqheaders: { authorization: 'Bearer token-1' },
      })
        [method]('/api/test')
        .reply(500)

      await expect(
        restClient[method]({
          path: '/test',
          headers: { header1: 'headerValue1' },
          token: 'token-1',
        }),
      ).rejects.toThrow('Internal Server Error')

      expect(nock.isDone()).toBe(true)
    })

    it('should retry if configured to do so', async () => {
      nock('http://localhost:8080', {
        reqheaders: { authorization: 'Bearer token-1' },
      })
        [method]('/api/test')
        .reply(500)
        [method]('/api/test')
        .reply(500)
        [method]('/api/test')
        .reply(500)

      await expect(
        restClient[method]({
          path: '/test',
          headers: { header1: 'headerValue1' },
          retry: true,
          token: 'token-1',
        }),
      ).rejects.toThrow('Internal Server Error')

      expect(nock.isDone()).toBe(true)
    })
  }

  it('can recover through retries', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      [method]('/api/test')
      .reply(500)
      [method]('/api/test')
      .reply(500)
      [method]('/api/test')
      .reply(200, { success: true })

    const result = await restClient[method]({
      path: '/test',
      headers: { header1: 'headerValue1' },
      retry: true,
      token: 'token-1',
    })

    expect(result).toStrictEqual({ success: true })
    expect(nock.isDone()).toBe(true)
  })

  it('should FAIL FAST and NOT retry on 400 Bad Request client errors', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      [method]('/api/test')
      .reply(
        400,
        { errorCode: 'ORDER_INVALID', privateValue: 'private-response-body' },
        {
          'x-private-header': 'private-response-header',
        },
      )

    await expect(
      restClient[method]({
        path: '/test',
        retry: true,
        token: 'token-1',
        retryOnErr: true,
      }),
    ).rejects.toThrow('Bad Request')

    expect(nock.isDone()).toBe(true)

    expect(warnSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        api: 'api-name',
        method: method.toUpperCase(),
        path: '/test',
        status: 400,
        errorCode: 'ORDER_INVALID',
        err: expect.any(Error),
      }),
      'Error calling api-name',
    )
    const fields = warnSpy.mock.calls[warnSpy.mock.calls.length - 1][0]
    const loggedFields = { ...fields, err: bunyan.stdSerializers.err(fields.err) }
    expect(JSON.stringify(loggedFields)).not.toContain('private-response-body')
    expect(JSON.stringify(loggedFields)).not.toContain('private-response-header')
  })

  it('should explicitly retry on 429 Too Many Requests', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      [method]('/api/test')
      .reply(429)
      [method]('/api/test')
      .reply(429)
      [method]('/api/test')
      .reply(200, { success: true })

    const result = await restClient[method]({
      path: '/test',
      retry: true,
      token: 'token-1',
      retryOnErr: true,
    })

    expect(result).toStrictEqual({ success: true })
    expect(nock.isDone()).toBe(true)
  })

  it('should explicitly retry on 500', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      [method]('/api/test')
      .reply(500)
      [method]('/api/test')
      .reply(500)
      [method]('/api/test')
      .reply(200, { success: true })

    const result = await restClient[method]({
      path: '/test',
      retry: true,
      token: 'token-1',
      retryOnErr: true,
    })

    expect(result).toStrictEqual({ success: true })
    expect(nock.isDone()).toBe(true)
  })
})
