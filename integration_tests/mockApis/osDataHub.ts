import { stubFor } from './wiremock'

type CreateStubOptions = {
  httpStatus: number
  body: string
  postcode: string
}

const stubOSDataHub = (options: CreateStubOptions) =>
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

export default { stubOSDataHub }
