import { stubFor } from './wiremock'

type CreateStubOptions = {
  httpStatus: number
  body: string
  searchId: string
}

const stubGetPersonByPrisonNumber = (options: CreateStubOptions) =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/cpr/person/prison/${options.searchId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.body,
    },
  })

const stubGetPersonByCrn = (options: CreateStubOptions) =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/person/probation//${options.searchId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.body,
    },
  })

export { stubGetPersonByPrisonNumber, stubGetPersonByCrn }
