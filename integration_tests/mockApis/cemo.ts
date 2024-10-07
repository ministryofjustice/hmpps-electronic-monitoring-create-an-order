import { SuperAgentRequest } from 'superagent'
import { v4 as uuidv4 } from 'uuid'
import { stubFor } from './wiremock'

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

const listOrders = (httpStatus = 200): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/cemo/api/ListForms',
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        httpStatus === 200
          ? [
              {
                id: uuidv4(),
                status: 'SUBMITTED',
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
                deviceWearerContactDetails: {
                  contactNumber: null,
                },
                additionalDocuments: [],
              },
              {
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
                deviceWearerContactDetails: {
                  contactNumber: null,
                },
                additionalDocuments: [],
              },
            ]
          : null,
    },
  })

type GetOrderStubOptions = {
  httpStatus: number
  id?: string
  status?: string
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
      urlPattern: `/cemo/api/GetForm\\?id=${options.id}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              id: options.id,
              status: options.status,
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
              deviceWearerContactDetails: {
                contactNumber: null,
              },
              additionalDocuments: [],
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
      urlPattern: `/cemo/api/GetForm\\?id=${options.id}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              id: options.id,
              status: options.status,
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
              deviceWearerContactDetails: {
                contactNumber: null,
              },
              additionalDocuments: options.attachments,
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
      urlPattern: `/cemo/api/order/${options.id}/document-type/${options.type}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? {} : { status: 400, userMessage: 'Mock Error', developerMessage: '' },
    },
  })

export default {
  stubCemoGetOrder: getOrder,
  stubCemoPing: ping,
  stubCemoListOrders: listOrders,
  stubCemoGetOrderWithAttachments: getOrderWithAttachments,
  stubUploadAttachment: uploadAttachment,
}
