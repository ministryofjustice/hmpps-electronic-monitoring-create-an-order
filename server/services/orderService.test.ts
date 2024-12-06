import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../integration_tests/mockApis/cemo'
import { getMockOrder } from '../../test/mocks/mockOrder'
import RestClient from '../data/restClient'
import { SanitisedError } from '../sanitisedError'
import OrderService from './orderService'

jest.mock('../data/restClient')

const mockId = uuidv4()

const mockApiResponse = { ...mockApiOrder(), id: mockId }

const mockNewOrder = getMockOrder({ id: mockId })

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
    it('should post a create order request to the api', async () => {
      mockRestClient.post.mockResolvedValue(mockApiResponse)

      const orderService = new OrderService(mockRestClient)
      const order = await orderService.createOrder({ accessToken: '', data: { type: 'REQUEST' } })

      expect(mockRestClient.post).toHaveBeenCalledWith({
        path: '/api/orders',
        token: '',
        data: {
          type: 'REQUEST',
        },
      })
      expect(order).toEqual(mockNewOrder)
    })

    it('should post a create variation request to the api', async () => {
      mockRestClient.post.mockResolvedValue(mockApiResponse)

      const orderService = new OrderService(mockRestClient)
      const order = await orderService.createOrder({ accessToken: '', data: { type: 'VARIATION' } })

      expect(mockRestClient.post).toHaveBeenCalledWith({
        path: '/api/orders',
        token: '',
        data: {
          type: 'VARIATION',
        },
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
        await orderService.createOrder({ accessToken: '', data: { type: 'REQUEST' } })
      } catch (e) {
        expect((e as Error).name).toEqual('ZodError')
      }
    })

    it('should propagate errors from the api', async () => {
      mockRestClient.post.mockRejectedValue(mock404Error)

      try {
        const orderService = new OrderService(mockRestClient)
        await orderService.createOrder({ accessToken: '', data: { type: 'REQUEST' } })
      } catch (e) {
        expect((e as SanitisedError).status).toEqual(404)
        expect((e as SanitisedError).message).toEqual('Not Found')
      }
    })
  })

  describe('getOrder', () => {
    it('should get the order from the api and return a valid order object', async () => {
      mockRestClient.get.mockResolvedValue(mockApiResponse)

      const orderService = new OrderService(mockRestClient)
      const order = await orderService.getOrder({ accessToken: 'token', orderId: '123456789' })

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: '/api/orders/123456789',
        token: 'token',
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
        await orderService.getOrder({ accessToken: '', orderId: '123456789' })
      } catch (e) {
        expect((e as Error).name).toEqual('ZodError')
      }
    })

    it('should propagate errors from the api', async () => {
      mockRestClient.get.mockRejectedValue(mock404Error)

      try {
        const orderService = new OrderService(mockRestClient)
        await orderService.getOrder({ accessToken: '', orderId: '123456789' })
      } catch (e) {
        expect((e as SanitisedError).status).toEqual(404)
        expect((e as SanitisedError).message).toEqual('Not Found')
      }
    })
  })
})
