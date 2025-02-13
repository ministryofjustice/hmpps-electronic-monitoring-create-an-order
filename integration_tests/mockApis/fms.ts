import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

import assert from 'assert'
import jsonDiff from 'json-diff'
import { getMatchingRequests, stubFor } from './wiremock'
import config from './config'

type CreateStubOptions = {
  httpStatus: number
  response: Record<string, unknown>
}

const stubFMSCreateDeviceWearer = (options: CreateStubOptions) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/fms/x_seem_cemo/device_wearer/createDW',
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options?.response || '',
    },
  })

const stubFMSCreateMonitoringOrder = (options: CreateStubOptions) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/fms/x_seem_cemo/monitoring_order/createMO',
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options?.response || '',
    },
  })

const stubFMSUpdateMonitoringOrder = (options: CreateStubOptions) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/fms/x_seem_cemo/monitoring_order/updateMO',
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options?.response || '',
    },
  })

type FmsAttachmentResponse = {
  status: number
  result: Record<string, string>
}

type UploadAttachmentStubOptions = {
  httpStatus: number
  fileName: string
  deviceWearerId: string
  response: FmsAttachmentResponse
}

const stubFmsUploadAttachment = (options: UploadAttachmentStubOptions) =>
  stubFor({
    request: {
      method: 'POST',
      urlPath: `/fms/now/v1/attachment_csm/file`,
      queryParameters: {
        table_name: {
          equalTo: 'x_serg2_ems_csm_sr_mo_new',
        },
        table_sys_id: {
          equalTo: options.deviceWearerId,
        },
        file_name: {
          equalTo: options.fileName,
        },
      },
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.response || '',
    },
  })

type VerifyStubbedRequestParams = {
  index: number
  responseRecordFilename?: string
  uri: string
  body?: unknown
  fileContents?: string
}

const stubFMSVerifyRequestReceived = (options: VerifyStubbedRequestParams) =>
  getMatchingRequests({ urlPath: options.uri })
    .then(response => {
      if (response?.body.requests && Array.isArray(response?.body.requests)) {
        return response.body.requests.map((request: Record<string, unknown>) => {
          if (options.fileContents) {
            return request.bodyAsBase64
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
      if (config.verify_fms_requests) {
        if (requests.length === 0) {
          throw new Error(`No stub requests were found for the url <${options.uri}>`)
        }

        const requestIndex = options.index || 0
        if (requests.length <= requestIndex) {
          throw new Error(
            `Expected at least ${requestIndex} stub requests for the url <${options.uri}> but only received ${requests.length}`,
          )
        }

        const expected = options.body || options.fileContents
        const request = requests[requestIndex]
        const diffResult = jsonDiff.diff(expected, request, { sort: true })

        const message = `
  Expected:
  ${JSON.stringify(expected, null, 2)}

  But received:
  ${JSON.stringify(request, null, 2)}

  Difference:
  ${jsonDiff.diffString(expected, request, { color: false })}

  `

        assert.strictEqual(undefined, diffResult, message)
      }

      if (options.responseRecordFilename) {
        const filename = `./integration_tests/requests/${options.responseRecordFilename}${options.uri}.json`
        mkdirSync(dirname(filename), { recursive: true })
        writeFileSync(filename, JSON.stringify(options.body || options.fileContents, null, 2), 'utf8')
      }

      return true
    })

type VerifyStubbedFMSRequestParams = {
  index?: number
  responseRecordFilename?: string
  body?: unknown
  fileContents?: string
}

const verifyFMSCreateDeviceWearerRequestReceived = (options: VerifyStubbedFMSRequestParams) =>
  stubFMSVerifyRequestReceived({
    index: 0,
    ...options,
    uri: '/fms/x_seem_cemo/device_wearer/createDW',
  })

const verifyFMSCreateMonitoringOrderRequestReceived = (options: VerifyStubbedFMSRequestParams) =>
  stubFMSVerifyRequestReceived({
    index: 0,
    ...options,
    uri: '/fms/x_seem_cemo/monitoring_order/createMO',
  })

const verifyFMSUpdateMonitoringOrderRequestReceived = (options: VerifyStubbedFMSRequestParams) =>
  stubFMSVerifyRequestReceived({
    index: 0,
    ...options,
    uri: '/fms/x_seem_cemo/monitoring_order/updateMO',
  })

const verifyFMSAttachmentRequestReceived = (options: VerifyStubbedFMSRequestParams) =>
  stubFMSVerifyRequestReceived({
    index: 0,
    ...options,
    uri: '/fms/now/v1/attachment_csm/file',
  })

export default {
  stubFMSCreateDeviceWearer,
  stubFMSCreateMonitoringOrder,
  stubFMSUpdateMonitoringOrder,
  stubFmsUploadAttachment,
  verifyFMSCreateDeviceWearerRequestReceived,
  verifyFMSCreateMonitoringOrderRequestReceived,
  verifyFMSUpdateMonitoringOrderRequestReceived,
  verifyFMSAttachmentRequestReceived,
}
