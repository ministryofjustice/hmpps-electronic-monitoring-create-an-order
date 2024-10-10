import { v4 as uuidv4 } from 'uuid'
import OrderService from './orderService'
import RestClient from '../data/restClient'
import { SanitisedError } from '../sanitisedError'
import { Order, OrderStatusEnum } from '../models/Order'

jest.mock('../data/restClient')

const mockId = uuidv4()

const mockApiResponse = {
  id: mockId,
  status: OrderStatusEnum.Enum.IN_PROGRESS,
  deviceWearer: {
    nomisId: null,
    pncId: null,
    deliusId: null,
    prisonNumber: null,
    firstName: null,
    lastName: null,
    alias: null,
    dateOfBirth: null,
    adultAtTimeOfInstallation: false,
    sex: null,
    gender: null,
    disabilities: null,
  },
  deviceWearerAddresses: [],
  deviceWearerContactDetails: {
    contactNumber: null,
  },
  additionalDocuments: [],
}

const mockNewOrder: Order = {
  id: mockId,
  status: OrderStatusEnum.Enum.IN_PROGRESS,
  deviceWearer: {
    nomisId: null,
    pncId: null,
    deliusId: null,
    prisonNumber: null,
    firstName: null,
    lastName: null,
    alias: null,
    dateOfBirth: null,
    adultAtTimeOfInstallation: false,
    sex: null,
    gender: null,
    disabilities: [],
  },
  deviceWearerAddresses: [],
  deviceWearerContactDetails: {
    contactNumber: '',
  },
  additionalDocuments: [],
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
      mockRestClient.post.mockResolvedValue(mockApiResponse)

      const orderService = new OrderService(mockRestClient)
      const order = await orderService.createOrder({ accessToken: '' })

      expect(mockRestClient.post).toHaveBeenCalledWith({
        path: '/api/orders',
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
        await orderService.createOrder({ accessToken: '' })
      } catch (e) {
        expect((e as Error).name).toEqual('ZodError')
      }
    })

    it('should propagate errors from the api', async () => {
      mockRestClient.post.mockRejectedValue(mock404Error)

      try {
        const orderService = new OrderService(mockRestClient)
        await orderService.createOrder({ accessToken: '' })
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
