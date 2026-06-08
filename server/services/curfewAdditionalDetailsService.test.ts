import RestClient from '../data/restClient'
import CurfewAdditionalDetailsService from './curfewAdditionalDetailsService'

jest.mock('../data/restClient')

const mockApiResponse = {
  startDate: null,
  endDate: null,
  curfewAddress: null,
  curfewAdditionalDetails: null,
}

describe('Curfew additional details service', () => {
  let mockRestClient: jest.Mocked<RestClient>

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
  })

  describe('updateCurfewAdditionalDetails', () => {
    it('should send curfew additional details to API when user selects yes', async () => {
      mockRestClient.put.mockResolvedValue(mockApiResponse)
      const curfewAdditionalDetailsService = new CurfewAdditionalDetailsService(mockRestClient)
      const updateCurfewAdditionalDetailsRequestInput = {
        accessToken: 'mockToken',
        orderId: 'mockUid',
        data: {
          action: 'continue',
          details: 'yes',
          curfewAdditionalDetails: 'some additional details',
        },
      }

      await curfewAdditionalDetailsService.update(updateCurfewAdditionalDetailsRequestInput)

      expect(mockRestClient.put).toHaveBeenCalledWith({
        data: { curfewAdditionalDetails: 'some additional details' },
        path: '/api/orders/mockUid/monitoring-conditions-curfew-additional-details',
        token: 'mockToken',
      })
    })

    it('should clear curfew additional details when user selects no', async () => {
      mockRestClient.put.mockResolvedValue(mockApiResponse)
      const curfewAdditionalDetailsService = new CurfewAdditionalDetailsService(mockRestClient)
      const updateCurfewAdditionalDetailsRequestInput = {
        accessToken: 'mockToken',
        orderId: 'mockUid',
        data: {
          action: 'continue',
          details: 'no',
          curfewAdditionalDetails: 'some details from the last time user put yes',
        },
      }

      await curfewAdditionalDetailsService.update(updateCurfewAdditionalDetailsRequestInput)

      expect(mockRestClient.put).toHaveBeenCalledWith({
        data: { curfewAdditionalDetails: '' },
        path: '/api/orders/mockUid/monitoring-conditions-curfew-additional-details',
        token: 'mockToken',
      })
    })
  })
})
