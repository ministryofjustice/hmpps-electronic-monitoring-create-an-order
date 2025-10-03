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
    it('should parse and send valid address to the API and return response', async () => {
      const mockOrderId = 'mockUid'
      const mockAccessToken = 'mockToken'
      const mockRequestData = {
        addressType: 'primary',
        addressLine1: 'Mock Address Line 1',
        addressLine2: 'Mock Address Line 2',
        addressLine3: 'Mock Address Line 3',
        addressLine4: '',
        postcode: 'SW1A 1AA',
        hasAnotherAddress: 'false',
      }
      const mockApiResponse: Address = {
        addressType: AddressTypeEnum.Enum.PRIMARY,
        addressLine1: 'Mock Address Line 1',
        addressLine2: 'Mock Address Line 2',
        addressLine3: 'Mock Address Line 3',
        addressLine4: '',
        postcode: 'SW1A 1AA',
      }

      mockRestClient.put.mockResolvedValue(mockApiResponse)

      const result = await addressService.updateAddress({
        orderId: mockOrderId,
        accessToken: mockAccessToken,
        data: mockRequestData,
      })
      const expectedApiPayload = {
        addressType: 'PRIMARY',
        addressLine1: 'Mock Address Line 1',
        addressLine2: 'Mock Address Line 2',
        addressLine3: 'Mock Address Line 3',
        addressLine4: '',
        postcode: 'SW1A 1AA',
        hasAnotherAddress: false,
      }

      expect(mockRestClient.put).toHaveBeenCalledTimes(1)
      expect(mockRestClient.put).toHaveBeenCalledWith({
        path: `/api/orders/${mockOrderId}/address`,
        data: expectedApiPayload,
        token: mockAccessToken,
      })

      expect(result).toEqual(mockApiResponse)
    })

    it('should correctly send the hasAnotherAddress: "true" to a boolean', async () => {
      const mockOrderId = 'mockUuid'
      const mockAccessToken = 'testmockToken'
      const mockRequestData = {
        addressType: 'secondary',
        addressLine1: 'Mock Secondary Address Line 1',
        addressLine2: 'Mock Secondary Address Line 2',
        addressLine3: 'Mock Secondary Address Line 3',
        addressLine4: '',
        postcode: 'SS2 2SS',
        hasAnotherAddress: 'true',
      }

      mockRestClient.put.mockResolvedValue({})

      await addressService.updateAddress({ orderId: mockOrderId, accessToken: mockAccessToken, data: mockRequestData })

      const expectedApiPayload = {
        addressType: 'SECONDARY',
        addressLine1: 'Mock Secondary Address Line 1',
        addressLine2: 'Mock Secondary Address Line 2',
        addressLine3: 'Mock Secondary Address Line 3',
        addressLine4: '',
        postcode: 'SS2 2SS',
        hasAnotherAddress: true,
      }

      expect(mockRestClient.put).toHaveBeenCalledWith({
        path: `/api/orders/${mockOrderId}/address`,
        data: expectedApiPayload,
        token: mockAccessToken,
      })
    })

    it('should return a validation error and not call the API if required data is missing', async () => {
      const mockInvalidInput = {
        addressType: 'primary',
        addressLine1: '123 Main St',
        addressLine2: '',
        addressLine3: 'Main City',
        addressLine4: '',
        postcode: 'Test',
        hasAnotherAddress: undefined,
        action: 'continue',
      }

      const result = await addressService.updateAddress({
        orderId: 'mockId',
        accessToken: 'mockToken',
        data: mockInvalidInput,
      })

      expect(mockRestClient.put).not.toHaveBeenCalled()

      expect(result).toEqual([
        {
          field: 'hasAnotherAddress',
          error: 'Select if electronic monitoring devices are required at another address',
        },
      ])
    })
  })
})
