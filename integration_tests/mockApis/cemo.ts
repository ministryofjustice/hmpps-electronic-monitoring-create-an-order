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
                  firstName: null,
                  lastName: null,
                  preferredName: null,
                  gender: null,
                  dateOfBirth: null,
                },
                deviceWearerContactDetails: {
                  contactNumber: null,
                },
              },
              {
                id: uuidv4(),
                status: 'IN_PROGRESS',
                deviceWearer: {
                  firstName: null,
                  lastName: null,
                  preferredName: null,
                  gender: null,
                  dateOfBirth: null,
                },
                deviceWearerContactDetails: {
                  contactNumber: null,
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
                firstName: null,
                lastName: null,
                preferredName: null,
                gender: null,
                dateOfBirth: null,
              },
              deviceWearerContactDetails: {
                contactNumber: null,
              },
            }
          : null,
    },
  })

export default {
  stubCemoGetOrder: getOrder,
  stubCemoPing: ping,
  stubCemoListOrders: listOrders,
}
