import { v4 as uuidv4 } from 'uuid'
import { getMockOrder } from '../../test/mocks/mockOrder'
import RestClient from '../data/restClient'
import { SanitisedError } from '../sanitisedError'
import OrderService from './orderService'
import { VersionInformation } from '../models/VersionInformation'
import mockApiOrder from '../../integration_tests/utils/data/ApiOrder'

jest.mock('../data/restClient')

const mockId = uuidv4()

const mockApiResponse = { ...mockApiOrder(), id: mockId, versionId: mockId }

const mockNewOrder = getMockOrder({ id: mockId, versionId: mockId })

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
      expect(mockRestClient.get).toHaveBeenCalledTimes(1)
      expect(order).toEqual(mockNewOrder)
    })

    it.each(['REQUEST', 'AMEND_ORIGINAL_REQUEST', 'VARIATION', 'REINSTALL_DEVICE'] as const)(
      'should resolve a legacy rejection from the nearest preceding %s version',
      async sourceType => {
        const legacyOrder = { ...mockApiResponse, type: 'REJECTED', status: 'REJECTED', canAmend: true }
        const version = (versionNumber: number, type: VersionInformation['type']): VersionInformation => ({
          orderId: mockId,
          versionId: versionNumber === 3 ? mockId : uuidv4(),
          versionNumber,
          type,
          status: 'SUBMITTED',
        })
        mockRestClient.get
          .mockResolvedValueOnce(legacyOrder)
          .mockResolvedValueOnce([
            version(0, 'REQUEST'),
            version(4, 'REQUEST'),
            version(2, 'REJECTED'),
            version(3, 'REJECTED'),
            version(1, sourceType),
          ])

        const orderService = new OrderService(mockRestClient)
        const order = await orderService.getOrder({ accessToken: 'token', orderId: mockId })

        expect(order.type).toBe('REJECTED')
        expect(order.amendmentSourceType).toBe(sourceType)
        expect(mockRestClient.get).toHaveBeenLastCalledWith({
          path: `/api/orders/${mockId}/versions`,
          token: 'token',
        })
      },
    )

    it('should not guess the source type when legacy history is unavailable', async () => {
      mockRestClient.get
        .mockResolvedValueOnce({ ...mockApiResponse, type: 'REJECTED', canAmend: true })
        .mockRejectedValueOnce(mock404Error)

      const orderService = new OrderService(mockRestClient)

      await expect(orderService.getOrder({ accessToken: 'token', orderId: mockId })).rejects.toThrow(
        'Unable to resolve amendment source type',
      )
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

  describe('amendOrder', () => {
    const mockAccessToken = 'ABC'
    const mockOrderId = '123456'

    it('should post without a body and parse the amendment response', async () => {
      const response = { order: mockApiResponse, outcome: 'ACCEPTED' }
      mockRestClient.post.mockResolvedValue(response)

      const orderService = new OrderService(mockRestClient)
      const amendment = await orderService.amendOrder({ accessToken: mockAccessToken, orderId: mockOrderId })

      expect(mockRestClient.post).toHaveBeenCalledWith({
        path: `/api/orders/${mockOrderId}/amend`,
        token: mockAccessToken,
      })
      expect(amendment).toEqual({ order: mockNewOrder, outcome: 'ACCEPTED' })
    })

    it('should propagate errors from the api', async () => {
      mockRestClient.post.mockRejectedValue(mock404Error)

      try {
        const orderService = new OrderService(mockRestClient)
        await orderService.amendOrder({
          accessToken: mockAccessToken,
          orderId: mockOrderId,
        })
      } catch (e) {
        expect((e as SanitisedError).status).toEqual(404)
        expect((e as SanitisedError).message).toEqual('Not Found')
      }
    })
  })

  describe('get versions', () => {
    const createVersionInformation = (override: Partial<VersionInformation> = {}): VersionInformation => {
      return {
        type: 'REQUEST',
        status: 'SUBMITTED',
        versionId: uuidv4(),
        versionNumber: 0,
        orderId: uuidv4(),
        submittedBy: 'John Doe',
        fmsResultDate: new Date().toISOString(),
        ...override,
      }
    }
    const mockAccessToken = 'ABC'
    const mockOrderId = '123456'

    it('should get versions from api', async () => {
      mockRestClient.get.mockResolvedValue([])
      const orderService = new OrderService(mockRestClient)

      await orderService.getVersionInformations({
        accessToken: mockAccessToken,
        orderId: mockOrderId,
      })

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: `/api/orders/${mockOrderId}/versions`,
        token: mockAccessToken,
      })
    })

    it('should return all versions', async () => {
      const versions = (['SUBMITTED', 'ERROR', 'IN_PROGRESS'] as const).map(status =>
        createVersionInformation({ status }),
      )
      mockRestClient.get.mockResolvedValue(versions)
      const orderService = new OrderService(mockRestClient)

      const results = await orderService.getVersionInformations({
        accessToken: mockAccessToken,
        orderId: mockOrderId,
      })

      expect(results.length).toBe(3)
      expect(results).toEqual([versions[0], versions[1], versions[2]])
    })
  })
})
