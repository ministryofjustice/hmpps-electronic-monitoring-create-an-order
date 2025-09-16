import RestClient from '../data/restClient'
import AddressService from './addressService'
import { Address, AddressTypeEnum } from '../models/Address'

jest.mock('../data/restClient')

describe('AddressService', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let addressService: AddressService

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    addressService = new AddressService(mockRestClient)
    jest.clearAllMocks()
  })

  describe('updateAddress', () => {
    it('should call  API with the correct data and return parsed Address on success', async () => {
      const mockOrderId = 'mockUid'
      const mockAccessToken = 'mockToken'
      const mockRequestData = {
        addressType: 'PRIMARY',
        addressLine1: 'Mock Address Line 1',
        addressLine2: 'Mock Address Line 2',
        postcode: 'SW1A 1AA',
        hasAnotherAddress: false,
      }
      const mockApiResponse: Address = {
        addressType: AddressTypeEnum.Enum.PRIMARY,
        addressLine1: 'Mock Address Line 1',
        addressLine2: 'Mock Address Line 2',
        addressLine3: '',
        addressLine4: '',
        postcode: 'SW1A 1AA',
      }

      mockRestClient.put.mockResolvedValue(mockApiResponse)

      const result = await addressService.updateAddress({
        orderId: mockOrderId,
        accessToken: mockAccessToken,
        data: mockRequestData,
      })

      expect(mockRestClient.put).toHaveBeenCalledTimes(1)
      expect(mockRestClient.put).toHaveBeenCalledWith({
        path: `/api/orders/${mockOrderId}/address`,
        data: mockRequestData,
        token: mockAccessToken,
      })

      expect(result).toEqual(mockApiResponse)
    })

    it('should correctly send the "hasAnotherAddress: true" flag to the API', async () => {
      const mockOrderId = 'mockUuid'
      const mockAccessToken = 'testmockToken'
      const mockRequestData = {
        addressType: 'SECONDARY',
        addressLine1: 'Mock Secondary Address Line 1',
        addressLine2: 'Mock Secondary Address Line 2',
        postcode: 'SS2 2SS',
        hasAnotherAddress: true,
      }

      const mockApiResponse: Address = {
        addressType: AddressTypeEnum.Enum.SECONDARY,
        addressLine1: 'Mock Secondary Address Line 1',
        addressLine2: 'Mock Secondary Address Line 2',
        addressLine3: '',
        addressLine4: '',
        postcode: 'SS2 2SS',
      }
      mockRestClient.put.mockResolvedValue(mockApiResponse)

      await addressService.updateAddress({ orderId: mockOrderId, accessToken: mockAccessToken, data: mockRequestData })

      expect(mockRestClient.put).toHaveBeenCalledWith({
        path: `/api/orders/${mockOrderId}/address`,
        data: mockRequestData,
        token: mockAccessToken,
      })
    })
  })
})
