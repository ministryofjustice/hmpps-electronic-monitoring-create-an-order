import assert from 'assert'
import jsonDiff from 'json-diff'
import { getMatchingRequests, stubFor } from './wiremock'

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



export default {
  stubFMSCreateDeviceWearer,
  stubFMSCreateMonitoringOrder,
  stubFmsUploadAttachment,
}
