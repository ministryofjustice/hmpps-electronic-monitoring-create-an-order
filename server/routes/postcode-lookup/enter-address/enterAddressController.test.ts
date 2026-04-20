import EnterAddressController from './controller'
import { AddressTypeEnum } from '../../../models/Address'
import { createDeviceWearer, getMockOrder } from '../../../../test/mocks/mockOrder'
import RestClient from '../../../data/restClient'
import HmppsAuditClient from '../../../data/hmppsAuditClient'
import AuditService from '../../../services/auditService'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import AddressService from '../../../services/addressService'

jest.mock('../../../services/orderService')
jest.mock('../../../services/addressService')
jest.mock('../../../data/hmppsAuditClient')
jest.mock('../../../data/restClient')

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
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let enterAddressController: EnterAddressController
  let mockAddressService: jest.Mocked<AddressService>

  beforeEach(() => {
    mockAuditClient = new HmppsAuditClient({
      queueUrl: '',
      enabled: true,
      region: '',
      serviceName: '',
    }) as jest.Mocked<HmppsAuditClient>
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>

    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    mockAddressService = new AddressService(mockRestClient) as jest.Mocked<AddressService>
    enterAddressController = new EnterAddressController(mockAuditService, mockAddressService)
  })

  describe('getEnterAddress', () => {
    it.each([
      ['Primary', 'primary', true],
      ['Installation', 'installation', false],
    ])('it should render the %s address form with the correct address', async (_: string, param: string) => {
      // Given
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
      expect(res.render).toHaveBeenCalledWith('pages/order/postcode-lookup/enter-address', {
        addressLine1: {
          value: '',
        },
        addressLine2: {
          value: '',
        },
        addressLine3: {
          value: '',
        },
        addressLine4: {
          value: '',
        },
        addressType: {
          value: param,
        },
        errorSummary: null,
        postcode: {
          value: '',
        },
      })
    })

    it('should render the form using submitted data when there are validation errors', async () => {
      // Given
      const req = createMockRequest({
        order: mockOrder,
        params: {
          orderId: mockOrder.id,
          addressType: 'primary',
        },
        flash: jest
          .fn()
          .mockReturnValueOnce([
            { error: 'Address line 1 is required', field: 'addressLine1' },
            { error: 'Address line 2 is required', field: 'addressLine2' },
            { error: 'Postcode is required', field: 'postcode' },
          ])
          .mockReturnValueOnce([
            {
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
          ]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await enterAddressController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/postcode-lookup/enter-address', {
        addressType: {
          value: 'primary',
        },
        addressLine1: {
          value: '',
          error: {
            text: 'Address line 1 is required',
          },
        },
        addressLine2: {
          value: '',
          error: {
            text: 'Address line 2 is required',
          },
        },
        addressLine3: {
          value: '',
          error: undefined,
        },
        addressLine4: {
          value: '',
          error: undefined,
        },
        errorSummary: {
          errorList: [
            {
              href: '#addressLine1',
              text: 'Address line 1 is required',
            },
            {
              href: '#addressLine2',
              text: 'Address line 2 is required',
            },
            {
              href: '#postcode',
              text: 'Postcode is required',
            },
          ],
          titleText: 'There is a problem',
        },
        postcode: {
          value: '',
          error: {
            text: 'Postcode is required',
          },
        },
      })
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

    it('should save and redirect to the find-address page if the user selects back', async () => {
      // Given
      const req = createMockRequest({
        order: mockOrder,
        body: {
          action: 'back',
          addressLine1: 'a',
          addressLine2: 'b',
          addressLine3: 'c',
          addressLine4: 'd',
          postcode: 'e',
        },
        flash: jest.fn(),
        params: {
          orderId: mockOrder.id,
          addressType: 'primary',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockAddressService.updateAddress.mockResolvedValue({
        addressType: 'PRIMARY',
        addressLine1: 'a',
        addressLine2: 'b',
        addressLine3: 'c',
        addressLine4: 'd',
        postcode: 'e',
      })

      // When
      await enterAddressController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/find-address/primary`)
    })
  })
})
