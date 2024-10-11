import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../integration_tests/mockApis/cemo'
import { getMockOrder } from '../../test/mocks/mockOrder'
import RestClient from '../data/restClient'
import { SanitisedError } from '../sanitisedError'
import OrderSearchService from './orderSearchService'

jest.mock('../data/restClient')

const mockId = uuidv4()

const mockApiResponse = { ...mockApiOrder(), id: mockId }

const mockNewOrder = getMockOrder({ id: mockId })

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

  describe('searchOrders', () => {
    it('should get orders from the api', async () => {
      mockRestClient.get.mockResolvedValue([mockApiResponse])

      const orderService = new OrderSearchService(mockRestClient)
      const orders = await orderService.searchOrders({ accessToken: '', searchTerm: '' })

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: '/api/orders',
        token: '',
      })
      expect(orders).toEqual([mockNewOrder])
    })

    it('should throw an error if the api returns an invalid object', async () => {
      expect.assertions(1)

      mockRestClient.get.mockResolvedValue({
        ...mockNewOrder,
        status: 'INVALID_STATUS',
      })

      try {
        const orderService = new OrderSearchService(mockRestClient)
        await orderService.searchOrders({ accessToken: '', searchTerm: '' })
      } catch (e) {
        expect((e as Error).name).toEqual('ZodError')
      }
    })

    it('should propagate errors from the api', async () => {
      mockRestClient.get.mockRejectedValue(mock500Error)

      try {
        const orderService = new OrderSearchService(mockRestClient)
        await orderService.searchOrders({ accessToken: '', searchTerm: '' })
      } catch (e) {
        expect((e as SanitisedError).status).toEqual(500)
        expect((e as SanitisedError).message).toEqual('Internal Server Error')
      }
    })
  })
})
