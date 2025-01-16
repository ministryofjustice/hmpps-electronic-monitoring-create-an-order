// https://github.com/ministryofjustice/hmpps-electronic-monitoring-create-an-order-api/blob/main/src/test/kotlin/uk/gov/justice/digital/hmpps/hmppselectronicmonitoringcreateanorderapi/integration/wiremock/HmppsDocumentManagementApiMockServer.kt

import assert from 'assert'
import jsonDiff from 'json-diff'
import { getMatchingRequests, stubFor } from './wiremock'

type DocumentStubOptions = {
  scenario?: {
    name: string
    requiredState: string
    nextState: string
  }
  id: string
  httpStatus: number
  response: Record<string, unknown>
}

const stubUploadDocument = (options: DocumentStubOptions) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/hmpps/documents/CEMO_ATTACHMENT/${options.id}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: options?.response ? JSON.stringify(options?.response, null, 2) : '',
    },
  })

const stubGetDocument = (options: DocumentStubOptions) => {
  if (options.scenario) {
    return stubFor({
      scenarioName: options.scenario.name,
      requiredScenarioState: options.scenario.requiredState,
      newScenarioState: options.scenario.nextState,
      request: {
        method: 'GET',
        urlPattern: `/hmpps/documents/${options.id}/file`,
      },
      response: {
        status: options.httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: options?.response ? JSON.stringify(options?.response, null, 2) : '',
      },
    })
  }

  return stubFor({
    request: {
      method: 'GET',
      urlPattern: `/hmpps/documents/${options.id}/file`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: options?.response ? JSON.stringify(options?.response, null, 2) : '',
    },
  })
}

const stubDeleteDocument = (options: DocumentStubOptions) =>
  stubFor({
    request: {
      method: 'DELETE',
      urlPattern: `/hmpps/documents/${options.id}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: options?.response ? JSON.stringify(options?.response, null, 2) : '',
    },
  })

type MultipartFileData = {
  name?: string
  filename?: string
  contentType?: string
  contents?: string
}

const toFileData = (raw: string) => {
  const parts = raw.split('\r\n').slice(1, -1)

  const data: MultipartFileData = {}
  const attrs = parts[0].split(';')
  attrs.shift()
  attrs.forEach((item: string) => {
    const kv = item.trim().split('=')
    const key = kv[0].trim()
    const value = (kv[1] || '').replace(/"/g, '')
    if (value !== '') {
      data[key as keyof MultipartFileData] = value
    }
  })
  data.contentType = (parts[1].split('Content-Type:')[1] || '').trim()
  data.contents = parts[parts.length - 1]

  return data
}

const toMultipartData = (contents: string, boundary: string) => {
  const parts = contents.split(boundary).slice(1, -1)
  const files = parts.map((part: string) => toFileData(part)).filter((file: MultipartFileData) => file.name === 'file')

  return files
}

type RequestHeaders = {
  ['Content-Type']: string
}

type VerifyStubbedRequestParams = {
  uri: string
  body?: unknown
  fileContents?: string
}

const stubRequestReceived = (options: VerifyStubbedRequestParams) =>
  getMatchingRequests({ urlPath: options.uri })
    .then(response => {
      if (response?.body.requests && Array.isArray(response?.body.requests)) {
        return response.body.requests.map((request: Record<string, unknown>) => {
          if (options.fileContents) {
            const boundary = (request.headers as RequestHeaders)['Content-Type' as keyof RequestHeaders].split(
              'boundary=',
            )[1]
            const content = toMultipartData(request.body as string, boundary)
            return content
          }

          try {
            return JSON.parse(request.body as string)
          } catch {
            return request.body
          }
        })
      }
      return []
    })
    .then(requests => {
      if (requests.length === 0) {
        throw new Error(`No stub requests were found for the url <${options.uri}>`)
      }

      if (requests.length > 1) {
        throw new Error(`More than 1 stub request was received for the url <${options.uri}>`)
      }

      const expected = options.body || options.fileContents
      const diffResult = jsonDiff.diff(expected, requests[0], { sort: true })

      const message = `
Expected:
${JSON.stringify(expected, null, 2)}

But received:
${JSON.stringify(requests[0], null, 2)}

Difference:
${jsonDiff.diffString(expected, requests[0], { color: false })}

`

      assert.strictEqual(undefined, diffResult, message)

      return true
    })

type VerifyUploadDocumentRequestParams = {
  id: string
  body?: unknown
  fileContents?: string
}

const verifyUploadDocumentRequestReceived = (options: VerifyUploadDocumentRequestParams) =>
  stubRequestReceived({
    ...options,
    uri: `/hmpps/documents/CEMO_ATTACHMENT/${options.id}`,
  })

const verifyGetDocumentRequestReceived = (options: VerifyUploadDocumentRequestParams) =>
  stubRequestReceived({
    ...options,
    uri: `/hmpps/documents/${options.id}/file`,
  })

const verifyDeleteDocumentRequestReceived = (options: VerifyUploadDocumentRequestParams) =>
  stubRequestReceived({
    ...options,
    uri: `/hmpps/documents/${options.id}`,
  })

export default {
  stubRequestReceived,
  stubUploadDocument,
  stubGetDocument,
  stubDeleteDocument,
  verifyUploadDocumentRequestReceived,
  verifyGetDocumentRequestReceived,
  verifyDeleteDocumentRequestReceived,
}
