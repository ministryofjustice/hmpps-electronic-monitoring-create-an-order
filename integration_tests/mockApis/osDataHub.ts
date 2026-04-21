import { stubFor } from './wiremock'

type CreateStubOptions = {
  httpStatus: number
  body: string
  postcode: string
}

const stubOSDataHubPostcode = (options: CreateStubOptions) =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: '/osDataHub/search/places/v1/postcode',
      queryParameters: {
        postcode: { equalTo: options.postcode },
        dataset: { equalTo: 'DPA' },
      },
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.body,
    },
  })

type CreateUPRNStubOptions = {
  httpStatus: number
  body: string
  uprn: string
}

const stubOSDataHubUPRN = (options: CreateUPRNStubOptions) =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: '/osDataHub/search/places/v1/uprn',
      queryParameters: {
        uprn: { equalTo: options.uprn },
      },
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.body,
    },
  })

export default { stubOSDataHubPostcode, stubOSDataHubUPRN }
