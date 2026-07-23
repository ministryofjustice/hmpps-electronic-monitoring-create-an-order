import assert from 'assert'
import { SuperAgentRequest } from 'superagent'
import { v4 as uuidv4 } from 'uuid'
import jsonDiff from 'json-diff'
import { Client as PostgresqlClient } from 'pg'
import { Order } from '../../server/models/Order'
import { getMatchingRequests, stubFor } from './wiremock'
import { DeviceWearer } from '../../server/models/DeviceWearer'
import { DeviceWearerResponsibleAdult as ResponsibleAdult } from '../../server/models/DeviceWearerResponsibleAdult'
import { OrderParameters } from '../../server/models/OrderParametersModel'
import mockApiOrder from '../utils/data/ApiOrder'

const ping = (httpStatus = 200) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/cemo/health',
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
    },
  })

type ListOrdersStubOptions = {
  httpStatus: number
  orders?: object[]
}

const defaultListOrdersOptions: ListOrdersStubOptions = {
  httpStatus: 200,
  orders: [
    {
      id: uuidv4(),
      versionId: uuidv4(),
      status: 'IN_PROGRESS',
      type: 'REQUEST',
      firstName: 'test',
      lastName: 'tester',
      notifyingOrganisation: 'PRISON',
      lastUpdatedBy: 'CEMO.USER',
      lastUpdatedDateTime: '2024-03-10T11:30:00.000Z',
    },
    {
      id: uuidv4(),
      versionId: uuidv4(),
      status: 'ERROR',
      type: 'REQUEST',
      firstName: 'Failed',
      lastName: 'request',
      notifyingOrganisation: 'PRISON',
      lastUpdatedBy: 'CEMO.USER',
      lastUpdatedDateTime: '2024-03-10T11:30:00.000Z',
    },
    {
      id: uuidv4(),
      versionId: uuidv4(),
      status: 'IN_PROGRESS',
      type: 'VARIATION',
      firstName: 'vari',
      lastName: 'ation',
      notifyingOrganisation: 'PRISON',
      lastUpdatedBy: 'CEMO.USER',
      lastUpdatedDateTime: '2024-03-10T11:30:00.000Z',
    },
  ],
}

const listOrders = (options: ListOrdersStubOptions = defaultListOrdersOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: '/cemo/api/orders',
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.orders : null,
    },
  })

const searchOrders = (options: ListOrdersStubOptions = defaultListOrdersOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: '/cemo/api/orders/search',
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.orders : null,
    },
  })

type GetVersionsStubOptions = {
  httpStatus: number
  orderId: string
  versions?: object[]
}

const defaultGetVersionsOptions = {
  httpStatus: 200,
  orderId: uuidv4(),
}

const getVersionInformation = (options: GetVersionsStubOptions = defaultGetVersionsOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/cemo/api/orders/${options.orderId}/versions`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.versions : null,
    },
  })

type GetOrderStubOptions = {
  httpStatus: number
  id?: string
  status?: string
  type?: string
  order?: Partial<Order>
}

const defaultGetOrderOptions = {
  httpStatus: 200,
  id: uuidv4(),
  status: 'IN_PROGRESS',
  type: 'REQUEST',
}

const getOrder = (options: GetOrderStubOptions = defaultGetOrderOptions): SuperAgentRequest => {
  const stubOptions = { ...defaultGetOrderOptions, ...options }

  return stubFor({
    request: {
      method: 'GET',
      urlPattern: `/cemo/api/orders/${stubOptions.id}`,
    },
    response: {
      status: stubOptions.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        stubOptions.httpStatus === 200
          ? {
              ...mockApiOrder(),
              id: stubOptions.id,
              status: stubOptions.status,
              type: stubOptions.type,
              ...(stubOptions.order ? stubOptions.order : {}),
            }
          : null,
    },
  })
}

type GetVersionStubOptions = GetOrderStubOptions & {
  versionId: string
}

const defaultGetVersionOptions = {
  ...defaultGetOrderOptions,
  versionId: uuidv4(),
}

const getSpecificVersion = (options: GetVersionStubOptions = defaultGetVersionOptions): SuperAgentRequest => {
  const stubOptions = { ...defaultGetOrderOptions, ...options }

  return stubFor({
    request: {
      method: 'GET',
      urlPattern: `/cemo/api/orders/${stubOptions.id}/versions/${stubOptions.versionId}`,
    },
    response: {
      status: stubOptions.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        stubOptions.httpStatus === 200
          ? {
              ...mockApiOrder(),
              id: stubOptions.id,
              status: stubOptions.status,
              type: stubOptions.type,
              ...(stubOptions.order ? stubOptions.order : {}),
            }
          : null,
    },
  })
}

type CreateOrderStubOptions = {
  httpStatus: number
  id?: string
  status?: string
}

const defaultCreateOrderOptions = {
  httpStatus: 200,
  id: uuidv4(),
  status: 'IN_PROGRESS',
}

const createOrder = (options: CreateOrderStubOptions = defaultCreateOrderOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/cemo/api/orders`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              ...mockApiOrder(),
              id: options.id,
              status: options.status,
            }
          : null,
    },
  })

type GetOrderWithAttachmentStubOptions = {
  httpStatus: number
  id?: string
  status?: string
  attachments?: Attachment
  orderParameters?: OrderParameters
  fmsResultDate?: string
}
type Attachment = {
  id?: string
  orderId?: string
  fileType?: string
  fileName?: string
}

const getOrderWithAttachments = (
  options: GetOrderWithAttachmentStubOptions = defaultGetOrderOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/cemo/api/orders/${options.id}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              ...mockApiOrder(),
              id: options.id,
              status: options.status,
              additionalDocuments: options.attachments,
              orderParameters: options.orderParameters,
              fmsResultDate: options.fmsResultDate,
            }
          : null,
    },
  })

type GetVersionWithAttachmentStubOptions = GetOrderWithAttachmentStubOptions & {
  versionId: string
}

const getVersionWithAttachments = (
  options: GetVersionWithAttachmentStubOptions = defaultGetVersionOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/cemo/api/orders/${options.id}/versions/${options.versionId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              ...mockApiOrder(),
              id: options.id,
              status: options.status,
              additionalDocuments: options.attachments,
              orderParameters: options.orderParameters,
              fmsResultDate: options.fmsResultDate,
            }
          : null,
    },
  })

type SubmitOrderStubOptions = {
  httpStatus: number
  method?: string
  id?: string
  subPath?: string
  response: Record<string, unknown>
}

const submitOrder = (options: SubmitOrderStubOptions) =>
  stubFor({
    request: {
      method: options.method || 'PUT',
      urlPattern: `/cemo/api/orders/${options.id}${options.subPath ?? '/'}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.response,
    },
  })

const stubCemoRequest = (options: SubmitOrderStubOptions) =>
  stubFor({
    request: {
      method: options.method || 'GET',
      urlPattern: `/cemo/api/${options.subPath ?? '/'}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.response,
    },
  })
type DeleteOrderStubOptions = {
  httpStatus: number
  id: string
  error: string
  subPath?: string
}

const deleteOrder = (options: DeleteOrderStubOptions) =>
  stubFor({
    request: {
      method: 'DELETE',
      urlPattern: `/cemo/api/orders/${options.id}${options.subPath ?? ''}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {}
          : { status: options.httpStatus, userMessage: options.error, developerMessage: '' },
    },
  })

type CreateVariationStubOptions = {
  httpStatus: number
  originalId: string
  variationId: string
}

const defaultCreateVariationOptions = {
  httpStatus: 200,
  originalId: uuidv4(),
  variationId: uuidv4(),
}
const createVariation = (options: CreateVariationStubOptions = defaultCreateVariationOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/cemo/api/orders/${options.originalId}/copy-as-variation`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              ...mockApiOrder(),
              type: 'VARIATION',
              id: options.variationId,
            }
          : null,
    },
  })

type UploadAttachmentStubOptions = {
  httpStatus: number
  id?: string
  type?: string
}

const defaultUploadAttachmentOptions = {
  httpStatus: 200,
  id: uuidv4(),
  type: 'LICENCE',
}
const uploadAttachment = (options: UploadAttachmentStubOptions = defaultUploadAttachmentOptions) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/cemo/api/orders/${options.id}/document-type/${options.type}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? {} : { status: 400, userMessage: 'Mock Error', developerMessage: '' },
    },
  })

const deleteAttachment = (options: UploadAttachmentStubOptions = defaultUploadAttachmentOptions) =>
  stubFor({
    request: {
      method: 'DELETE',
      urlPattern: `/cemo/api/orders/${options.id}/document-type/${options.type}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? {} : { status: 400, userMessage: 'Mock Error', developerMessage: '' },
    },
  })

type ValidationErrors = Array<{
  error: string
  field: string
}>

type UpdateContactDetailsOptions = {
  httpStatus: number
  id?: string
  errors: ValidationErrors
}

const defaultUpdateContactDetailsOptions = {
  httpStatus: 200,
  id: uuidv4(),
  errors: [],
}

const updateContactDetails = (options: UpdateContactDetailsOptions = defaultUpdateContactDetailsOptions) =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/cemo/api/orders/${options.id}/contact-details`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? { contactNumber: '01234567890' } : options.errors,
    },
  })

type ApiDeviceWearer = Omit<DeviceWearer, 'disabilities'> & {
  disabilities?: string | null
}

type PutDeviceWearerStubOptions = {
  httpStatus: number
  id: string
  status: string
  deviceWearer?: ApiDeviceWearer
}

const defaultPutDeviceWearerOptions = {
  httpStatus: 200,
  id: uuidv4(),
  status: 'IN_PROGRESS',
  deviceWearer: {
    nomisId: null,
    pncId: null,
    deliusId: null,
    prisonNumber: null,
    homeOfficeReferenceNumber: null,
    complianceAndEnforcementPersonReference: null,
    courtCaseReferenceNumber: null,
    firstName: null,
    middleName: null,
    lastName: null,
    alias: null,
    dateOfBirth: null,
    adultAtTimeOfInstallation: null,
    sex: null,
    gender: null,
    disabilities: null,
    noFixedAbode: null,
    interpreterRequired: null,
  },
}

const putDeviceWearer = (options: PutDeviceWearerStubOptions = defaultPutDeviceWearerOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/cemo/api/orders/${options.id}/device-wearer`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              ...defaultPutDeviceWearerOptions.deviceWearer,
              ...options.deviceWearer,
            }
          : null,
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

const getStubbedRequest = (url: string, asBase64?: boolean, method?: string) =>
  getMatchingRequests({ urlPath: `/cemo/api${url}`, method }).then(response => {
    if (response?.body.requests && Array.isArray(response?.body.requests)) {
      return response.body.requests.map((request: Record<string, unknown>) => {
        if (asBase64) {
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

type PutResponsibleAdultStubOptions = {
  httpStatus: number
  id: string
  status: string
  responsibleAdult?: ResponsibleAdult
}

const defaultPutResponsibleAdultOptions = {
  httpStatus: 200,
  id: uuidv4(),
  status: 'IN_PROGRESS',
  responsibleAdult: {
    relationship: null,
    otherRelationshipDetails: null,
    fullName: null,
    contactNumber: null,
  },
}

const putResponsibleAdult = (
  options: PutResponsibleAdultStubOptions = defaultPutResponsibleAdultOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/cemo/api/orders/${options.id}/device-wearer-responsible-adult`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              ...defaultPutResponsibleAdultOptions.responsibleAdult,
              ...options.responsibleAdult,
            }
          : null,
    },
  })

type VerifyStubbedRequestParams = {
  uri: string
  method?: string
  body?: unknown
  fileContents?: string
}

const stubCemoVerifyRequestReceived = (options: VerifyStubbedRequestParams) =>
  getStubbedRequest(options.uri, !!options.fileContents, options.method).then(requests => {
    if (requests.length === 0) {
      throw new Error(`No stub requests were found for the url <${options.uri}>`)
    }

    if (requests.length > 1) {
      throw new Error(`More than 1 stub request was received for the url <${options.uri}>`)
    }

    const expected = options.body === undefined ? options.fileContents : options.body
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

const tables = [
  'contact_details',
  'curfew_timetable',

  'mandatory_attendance',
  'alcohol_monitoring',
  'curfew',
  'curfew_release_date',
  'curfew_timetable',
  'dapo',
  'details_of_installation',
  'additional_documents',
  'monitoring_conditions',
  'mappa',
  'installation_and_risk',
  'installation_appointment',
  'installation_location',
  'enforcement_zone',
  'trail_monitoring',
  'interested_parties',
  'responsible_adult',
  'offence',
  'offence_additional_details',
  'order_parameters',
  'probation_delivery_unit',
  'variation_details',
  'device_wearer',
  'address',
  'order_version',
  'orders',
]

const emptyNextTable = async (client: PostgresqlClient): Promise<boolean> => {
  const table = tables.shift()
  if (table) {
    await client.query(`DELETE FROM ${table}`)

    await emptyNextTable(client)
  }

  return true
}

const resetDB = async () => {
  const client = new PostgresqlClient({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
  })

  await client.connect()
  await emptyNextTable(client)
  await client.end()

  return true
}

type UpdateOrderOwnerStubOptions = {
  httpStatus: number
  id?: string
  status?: string
  order?: Partial<Order>
}

const defaultUpdateOrderOwnerOptions = {
  httpStatus: 200,
  id: uuidv4(),
  status: 'IN_PROGRESS',
}

const updateOrderOwner = (options: UpdateOrderOwnerStubOptions = defaultUpdateOrderOwnerOptions): SuperAgentRequest => {
  const stubOptions = { ...defaultUpdateOrderOwnerOptions, ...options }

  return stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/cemo/api/orders/${stubOptions.id}/update-order-owner`,
    },
    response: {
      status: stubOptions.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        stubOptions.httpStatus === 200
          ? {
              ...mockApiOrder(),
              id: stubOptions.id,
              status: stubOptions.status,
              ...(stubOptions.order ? stubOptions.order : {}),
            }
          : null,
    },
  })
}

type SetSentencingActStubOptions = {
  httpStatus: number
  id: string
}

const defaultSetSentencingActStubOptions = {
  httpStatus: 200,
  id: uuidv4(),
}

const setSentencingAct = (options: SetSentencingActStubOptions = defaultSetSentencingActStubOptions) => {
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/cemo/api/orders/${options.id}/sentencing-act`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })
}

export default {
  stubCemoCreateOrder: createOrder,
  stubCemoCreateVariation: createVariation,
  stubCemoGetOrder: getOrder,
  stubCemoGetVersion: getSpecificVersion,
  stubCemoPing: ping,
  stubCemoListOrders: listOrders,
  stubCemoSearchOrders: searchOrders,
  stubCemoGetVersions: getVersionInformation,
  stubCemoGetOrderWithAttachments: getOrderWithAttachments,
  stubCemoGetVersionWithAttachments: getVersionWithAttachments,
  stubCemoPutContactDetails: updateContactDetails,
  stubCemoPutDeviceWearer: putDeviceWearer,
  stubCemoSubmitOrder: submitOrder,
  stubCemoUpdateContactDetails: updateContactDetails,
  stubCemoPutResponsibleAdult: putResponsibleAdult,
  stubCemoSetSentencingAct: setSentencingAct,
  stubUploadAttachment: uploadAttachment,
  stubDeleteAttachment: deleteAttachment,
  stubCemoUpdateOrderOwner: updateOrderOwner,
  getStubbedRequest,
  stubCemoVerifyRequestReceived,
  stubDeleteOrder: deleteOrder,
  resetDB,
  stubCemoRequest,
}
