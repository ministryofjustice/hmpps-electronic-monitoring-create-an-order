import { stubFor } from './wiremock'

type CreateStubOptions = {
  httpStatus: number
  body: Record<string, unknown>
  searchId: string
}

const stubGetPersonByPrisonNumber = (options: CreateStubOptions) =>
  cy.then(() => {
    return stubFor({
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
  })

const stubGetPersonByCrn = (options: CreateStubOptions) =>
  cy.then(() =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/cpr/person/probation/${options.searchId}`,
      },
      response: {
        status: options.httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: options.body,
      },
    }),
  )

export { stubGetPersonByPrisonNumber, stubGetPersonByCrn }
