import { v4 as uuidv4 } from 'uuid'
import { getMockOrder } from '../../test/mocks/mockOrder'
import RestClient from '../data/restClient'
import { SanitisedError } from '../sanitisedError'
import OrderSearchService from './orderSearchService'
import mockApiOrder from '../../integration_tests/utils/data/ApiOrder'
import { OrderListInformation } from '../models/OrderListInformation'

jest.mock('../data/restClient')

const mockId = uuidv4()

const mockApiResponse = { ...mockApiOrder(), id: mockId, versionId: mockId }

const mockNewOrder = getMockOrder({ id: mockId, versionId: mockId })

const mock500Error: SanitisedError = {
  message: 'Internal Server Error',
  name: 'InternalServerError',
  stack: '',
  status: 500,
}

describe('Order Search Service', () => {
  let mockRestClient: jest.Mocked<RestClient>

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
  })

  describe('listOrders', () => {
    it('should get a page of orders from the api', async () => {
      const mockReturnValue: OrderListInformation = {
        id: mockApiResponse.id,
        versionId: mockApiResponse.versionId,
        status: mockApiResponse.status,
        type: mockApiResponse.type,
        firstName: mockApiResponse.deviceWearer.firstName,
        lastName: mockApiResponse.deviceWearer.lastName,
        notifyingOrganisation: mockApiResponse.interestedParties?.notifyingOrganisation,
      }
      mockRestClient.get.mockResolvedValue({
        content: [mockReturnValue],
        totalElements: 21,
        totalPages: 3,
        number: 1,
        size: 10,
      })
      const orderService = new OrderSearchService(mockRestClient)
      const orders = await orderService.listOrders({ accessToken: '' }, 'MY_ORDERS', 1, 10)
      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: '/api/orders',
        token: '',
        query: { view: 'MY_ORDERS', page: 1, size: 10 },
      })
      const { id, status, type, versionId } = mockNewOrder
      const { firstName, lastName, notifyingOrganisation } = mockReturnValue
      expect([{ id, status, type, versionId, firstName, lastName, notifyingOrganisation }]).toEqual(
        expect.objectContaining(orders.content),
      )
      expect(orders.totalElements).toBe(21)
      expect(orders.totalPages).toBe(3)
      expect(orders.number).toBe(1)
      expect(orders.size).toBe(10)
    })

    it('should throw an error if the api returns an invalid object', async () => {
      expect.assertions(1)

      mockRestClient.get.mockResolvedValue({
        content: [{ ...mockNewOrder, status: 'INVALID_STATUS' }],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 10,
      })

      try {
        const orderService = new OrderSearchService(mockRestClient)
        await orderService.listOrders({ accessToken: '' }, 'MY_ORDERS')
      } catch (e) {
        expect((e as Error).name).toEqual('ZodError')
      }
    })

    it('should propagate errors from the api', async () => {
      mockRestClient.get.mockRejectedValue(mock500Error)

      try {
        const orderService = new OrderSearchService(mockRestClient)
        await orderService.listOrders({ accessToken: '' }, 'MY_ORDERS')
      } catch (e) {
        expect((e as SanitisedError).status).toEqual(500)
        expect((e as SanitisedError).message).toEqual('Internal Server Error')
      }
    })
  })
})
