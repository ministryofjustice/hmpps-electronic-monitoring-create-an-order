import EnterAddressController from './controller'
import { AddressTypeEnum } from '../../../models/Address'
import { createDeviceWearer, getMockOrder } from '../../../../test/mocks/mockOrder'
import RestClient from '../../../data/restClient'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import AddressService from '../../../services/addressService'
import PostcodeService from '../postcodeService'
import ViewModel from './viewModel'

jest.mock('../../../services/orderService')
jest.mock('../../../services/addressService')
jest.mock('../../../data/restClient')
jest.mock('../postcodeService')

const primaryAddress = {
  addressType: AddressTypeEnum.Enum.PRIMARY,
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  addressLine4: '',
  postcode: '',
}

const installationAddress = {
  addressType: AddressTypeEnum.Enum.INSTALLATION,
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  addressLine4: '',
  postcode: '',
}

const mockOrder = getMockOrder({
  deviceWearer: createDeviceWearer({ noFixedAbode: false }),
  addresses: [primaryAddress, installationAddress],
})

describe('EnterAddressController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let enterAddressController: EnterAddressController
  let mockAddressService: jest.Mocked<AddressService>
  let mockPostcodeService: jest.Mocked<PostcodeService>

  beforeEach(() => {
    jest.restoreAllMocks()
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>

    mockAddressService = new AddressService(mockRestClient) as jest.Mocked<AddressService>
    mockPostcodeService = {
      buildUrl: jest.fn(),
    } as unknown as jest.Mocked<PostcodeService>
    enterAddressController = new EnterAddressController(mockAddressService, mockPostcodeService)
  })

  describe('getEnterAddress', () => {
    it.each([
      ['Primary', 'primary'],
      ['Installation', 'installation'],
    ])('it should construct and render the %s address view model', async (_: string, param: string) => {
      // Given
      const mockViewModel = { addressType: { value: param } }
      jest.spyOn(ViewModel, 'construct').mockReturnValue(mockViewModel as never)

      const req = createMockRequest({
        order: mockOrder,
        flash: jest.fn().mockReturnValue([]),
        params: {
          orderId: mockOrder.id,
          addressType: param,
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await enterAddressController.view(req, res, next)

      // Then
      expect(ViewModel.construct).toHaveBeenCalledWith(
        param,
        mockOrder.addresses,
        undefined,
        res.locals.content,
        [],
        false,
      )
      expect(res.render).toHaveBeenCalledWith('pages/order/postcode-lookup/enter-address', mockViewModel)
    })

    it('should pass validation errors and submitted form data to the view model', async () => {
      // Given
      const mockViewModel = { addressType: { value: 'primary' } }
      jest.spyOn(ViewModel, 'construct').mockReturnValue(mockViewModel as never)

      const errors = [
        { error: 'Address line 1 is required', field: 'addressLine1' },
        { error: 'Address line 2 is required', field: 'addressLine2' },
        { error: 'Postcode is required', field: 'postcode' },
      ]
      const formData = {
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        postcode: '',
      }

      const req = createMockRequest({
        order: mockOrder,
        params: {
          orderId: mockOrder.id,
          addressType: 'primary',
        },
        flash: jest.fn().mockReturnValueOnce(errors).mockReturnValueOnce([formData]).mockReturnValueOnce([true]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await enterAddressController.view(req, res, next)

      // Then
      expect(ViewModel.construct).toHaveBeenCalledWith(
        'primary',
        mockOrder.addresses,
        formData,
        res.locals.content,
        errors,
        true,
      )
      expect(res.render).toHaveBeenCalledWith('pages/order/postcode-lookup/enter-address', mockViewModel)
    })
  })

  describe('postEnterAddress', () => {
    it('should persist data and redirect to the form when the user submits invalid data', async () => {
      // Given
      const req = createMockRequest({
        order: mockOrder,
        body: {
          action: 'continue',
          addressLine1: '',
          addressLine2: '',
          addressLine3: 'c',
          addressLine4: 'd',
          postcode: '',
        },
        flash: jest.fn(),
        params: {
          orderId: mockOrder.id,
          addressType: 'primary',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockAddressService.updateAddress.mockResolvedValue([
        { error: 'Address line 1 is required', field: 'addressLine1' },
        { error: 'Address line 2 is required', field: 'addressLine2' },
        { error: 'Postcode is required', field: 'postcode' },
      ])

      // When
      await enterAddressController.update(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledTimes(2)
      expect(req.flash).toHaveBeenNthCalledWith(1, 'formData', {
        addressLine1: '',
        addressLine2: '',
        addressLine3: 'c',
        addressLine4: 'd',
        postcode: '',
      })
      expect(req.flash).toHaveBeenNthCalledWith(2, 'validationErrors', [
        { error: 'Address line 1 is required', field: 'addressLine1' },
        { error: 'Address line 2 is required', field: 'addressLine2' },
        { error: 'Postcode is required', field: 'postcode' },
      ])
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/enter-address/primary`)
    })
  })
})
