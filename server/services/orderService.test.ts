import { v4 as uuidv4 } from 'uuid'
import OrderService from './orderService'
import RestClient from '../data/restClient'
import { SanitisedError } from '../sanitisedError'

jest.mock('../data/restClient')

const mockNewOrder = {
  id: uuidv4(),
  status: 'IN_PROGRESS',
}

const mock404Error: SanitisedError = {
  message: 'Not Found',
  name: 'NotFoundError',
  stack: '',
  status: 404,
}

describe('Order Service', () => {
  let mockRestClient: jest.Mocked<RestClient>

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
  })

  describe('createOrder', () => {
    it('should post to the api and return a valid order object', async () => {
      mockRestClient.get.mockResolvedValue(mockNewOrder)

      const orderService = new OrderService(mockRestClient)
      const order = await orderService.createOrder('')

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: '/api/CreateForm',
        query: {
          title: 'MyNewForm',
        },
        token: '',
      })
      expect(order).toEqual(mockNewOrder)
    })

    it('should throw an error if the api returns an invalid object', async () => {
      expect.assertions(1)

      mockRestClient.get.mockResolvedValue({
        ...mockNewOrder,
        status: 'INVALID_STATUS',
      })

      try {
        const orderService = new OrderService(mockRestClient)
        await orderService.createOrder('')
      } catch (e) {
        expect((e as Error).name).toEqual('ZodError')
      }
    })

    it('should propagate errors from the api', async () => {
      mockRestClient.get.mockRejectedValue(mock404Error)

      try {
        const orderService = new OrderService(mockRestClient)
        await orderService.createOrder('')
      } catch (e) {
        expect((e as SanitisedError).status).toEqual(404)
        expect((e as SanitisedError).message).toEqual('Not Found')
      }
    })
  })
})
