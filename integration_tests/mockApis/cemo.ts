import { SuperAgentRequest } from 'superagent'
import { v4 as uuidv4 } from 'uuid'
import { Order } from '../../server/models/Order'
import { getMatchingRequests, stubFor } from './wiremock'
import { DeviceWearer } from '../../server/models/DeviceWearer'
import { DeviceWearerResponsibleAdult as ResponsibleAdult } from '../../server/models/DeviceWearerResponsibleAdult'

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

export const mockApiOrder = (status = 'IN_PROGRESS') => ({
  id: uuidv4(),
  status,
  deviceWearer: {
    nomisId: null,
    pncId: null,
    deliusId: null,
    prisonNumber: null,
    firstName: null,
    lastName: null,
    alias: null,
    dateOfBirth: null,
    adultAtTimeOfInstallation: null,
    sex: null,
    gender: null,
    disabilities: null,
  },
  enforcementZoneConditions: [],
  deviceWearerAddresses: [],
  deviceWearerContactDetails: {
    contactNumber: null,
  },
  additionalDocuments: [],
  monitoringConditions: {
    orderType: null,
    acquisitiveCrime: null,
    dapol: null,
    curfew: null,
    exclusionZone: null,
    trail: null,
    mandatoryAttendance: null,
    alcohol: null,
    devicesRequired: null,
  },
  trailMonitoring: {
    startDate: null,
    endDate: null,
  },
})

const listOrders = (httpStatus = 200): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/cemo/api/orders',
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        httpStatus === 200
          ? [
              mockApiOrder('SUBMITTED'),
              {
                ...mockApiOrder(),
                deviceWearer: {
                  nomisId: null,
                  pncId: null,
                  deliusId: null,
                  prisonNumber: null,
                  firstName: 'test',
                  lastName: 'tester',
                  alias: null,
                  dateOfBirth: null,
                  adultAtTimeOfInstallation: null,
                  sex: null,
                  gender: null,
                  disabilities: null,
                },
              },
            ]
          : null,
    },
  })

type GetOrderStubOptions = {
  httpStatus: number
  id?: string
  status?: string
  order?: Partial<Order>
}

const defaultGetOrderOptions = {
  httpStatus: 200,
  id: uuidv4(),
  status: 'IN_PROGRESS',
}

const getOrder = (options: GetOrderStubOptions = defaultGetOrderOptions): SuperAgentRequest =>
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
              ...(options.order ? options.order : {}),
            }
          : null,
    },
  })

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
            }
          : null,
    },
  })

type SubmitOrderStubOptions = {
  httpStatus: number
  id: string
  subPath?: string
  response: Record<string, unknown>
}

const submitOrder = (options: SubmitOrderStubOptions) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/cemo/api/order/${options.id}${options.subPath ?? '/'}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.response,
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

type ValidationErrors = Array<{
  erorr: string
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
    firstName: null,
    lastName: null,
    alias: null,
    dateOfBirth: null,
    adultAtTimeOfInstallation: null,
    sex: null,
    gender: null,
    disabilities: null,
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

const getStubbedRequest = (url: string) =>
  getMatchingRequests({ urlPath: `/cemo/api${url}` }).then(res => {
    if (res?.body.requests && Array.isArray(res?.body.requests)) {
      return res.body.requests.map((req: Record<string, unknown>) => {
        try {
          return JSON.parse(req.body as string)
        } catch {
          return {}
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

const verifyPutResponsibleAdultRequest = (responsibleAdult: ResponsibleAdult): SuperAgentRequest =>
  getMatchingRequests(responsibleAdult)

export default {
  stubCemoCreateOrder: createOrder,
  stubCemoGetOrder: getOrder,
  stubCemoPing: ping,
  stubCemoListOrders: listOrders,
  stubCemoGetOrderWithAttachments: getOrderWithAttachments,
  stubCemoPutContactDetails: updateContactDetails,
  stubCemoPutDeviceWearer: putDeviceWearer,
  stubCemoSubmitOrder: submitOrder,
  stubCemoUpdateContactDetails: updateContactDetails,
  stubCemoPutResponsibleAdult: putResponsibleAdult,
  verifyCemoPutResponsibleAdultRequest: verifyPutResponsibleAdultRequest,
  stubUploadAttachment: uploadAttachment,
  getStubbedRequest,
}
