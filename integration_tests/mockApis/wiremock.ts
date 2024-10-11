import superagent, { Response } from 'superagent'

const url = 'http://localhost:9091/__admin'

const stubFor = (mapping: Record<string, unknown>) => superagent.post(`${url}/mappings`).send(mapping)

const getMatchingRequests = (body: string | object) => superagent.post(`${url}/requests/find`).send(body)

const resetStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

export { getMatchingRequests, resetStubs, stubFor }
