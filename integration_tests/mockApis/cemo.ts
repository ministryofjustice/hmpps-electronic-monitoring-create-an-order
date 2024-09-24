import { SuperAgentRequest } from 'superagent'
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
                id: '8138066f-717d-40d7-bd46-9ed08c68364c',
                status: 'SUBMITTED',
              },
              {
                id: '8138066f-717d-40d7-bd46-9ed08c68364c',
                status: 'IN_PROGRESS',
              },
            ]
          : null,
    },
  })

export default {
  stubCemoPing: ping,
  stubCemoListOrders: listOrders,
}
