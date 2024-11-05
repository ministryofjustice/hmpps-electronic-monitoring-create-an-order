import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import AddressService from '../../services/addressService'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import AddressController from './addressController'
import { AddressTypeEnum } from '../../models/Address'
import TaskListService from '../../services/taskListService'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/addressService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const primaryAddress = {
  addressType: AddressTypeEnum.Enum.PRIMARY,
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  addressLine4: '',
  postcode: '',
}

const secondaryAddress = {
  addressType: AddressTypeEnum.Enum.SECONDARY,
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  addressLine4: '',
  postcode: '',
}

const tertiaryAddress = {
  addressType: AddressTypeEnum.Enum.TERTIARY,
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
  addresses: [primaryAddress, secondaryAddress, tertiaryAddress, installationAddress],
})

describe('AddressController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockAddressService: jest.Mocked<AddressService>
  let addressController: AddressController
  const taskListService = new TaskListService()

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
    addressController = new AddressController(mockAuditService, mockAddressService, taskListService)
  })

  describe('getAddress', () => {
    it.each([
      ['Primary', 'primary', primaryAddress, true],
      ['Secondary', 'secondary', secondaryAddress, true],
      ['Tertiary', 'tertiary', tertiaryAddress, false],
      ['Installation', 'installation', installationAddress, false],
    ])(
      'it should render the %s address form with the correct address',
      async (_: string, param: string, expected, hasAnotherAddress: boolean) => {
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
        await addressController.view(req, res, next)

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/address', {
          ...expected,
          hasAnotherAddress: String(hasAnotherAddress),
          errors: {},
        })
      },
    )

    it('should render the form using submitted data when there are validaiton errors', async () => {
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
      await addressController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/address', {
        addressType: 'PRIMARY',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        postcode: '',
        hasAnotherAddress: 'true',
        errors: {
          addressLine1: {
            text: 'Address line 1 is required',
          },
          addressLine2: {
            text: 'Address line 2 is required',
          },
          postcode: {
            text: 'Postcode is required',
          },
        },
      })
    })
  })

  describe('postAddress', () => {
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
      await addressController.update(req, res, next)

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
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/contact-information/addresses/primary`)
    })

    it('should save and redirect to the order summary page if the user selects back', async () => {
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
      await addressController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/summary`)
    })

    it.each([
      ['Primary', 'primary', `/order/${mockOrder.id}/contact-information/addresses/secondary`],
      ['Secondary', 'secondary', `/order/${mockOrder.id}/contact-information/addresses/tertiary`],
    ])(
      'should go to the next address form if the user indicates they have another address',
      async (_: string, param: string, expectedLocation: string) => {
        // Given
        const req = createMockRequest({
          order: mockOrder,
          body: {
            action: 'continue',
            addressLine1: 'a',
            addressLine2: 'b',
            addressLine3: 'c',
            addressLine4: 'd',
            postcode: 'e',
            hasAnotherAddress: 'true',
          },
          flash: jest.fn(),
          params: {
            orderId: mockOrder.id,
            addressType: param,
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
        await addressController.update(req, res, next)

        // Then
        expect(req.flash).not.toHaveBeenCalled()
        expect(res.redirect).toHaveBeenCalledWith(expectedLocation)
      },
    )

    it.each([
      ['Primary', 'primary', `/order/${mockOrder.id}/contact-information/interested-parties`],
      ['Secondary', 'secondary', `/order/${mockOrder.id}/contact-information/interested-parties`],
    ])(
      'should go to the notifying organisation page if the user indicates they do not have another address',
      async (_: string, param: string, expectedLocation: string) => {
        // Given
        const req = createMockRequest({
          order: mockOrder,
          body: {
            action: 'continue',
            addressLine1: 'a',
            addressLine2: 'b',
            addressLine3: 'c',
            addressLine4: 'd',
            postcode: 'e',
            hasAnotherAddress: 'false',
          },
          flash: jest.fn(),
          params: {
            orderId: mockOrder.id,
            addressType: param,
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
        await addressController.update(req, res, next)

        // Then
        expect(req.flash).not.toHaveBeenCalled()
        expect(res.redirect).toHaveBeenCalledWith(expectedLocation)
      },
    )

    it('should go always go the notifying organisation page if the tertiary address is being filled in', async () => {
      // Given
      const req = createMockRequest({
        order: mockOrder,
        body: {
          action: 'continue',
          addressLine1: 'a',
          addressLine2: 'b',
          addressLine3: 'c',
          addressLine4: 'd',
          postcode: 'e',
          hasAnotherAddress: 'false',
        },
        flash: jest.fn(),
        params: {
          orderId: mockOrder.id,
          addressType: 'tertiary',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockAddressService.updateAddress.mockResolvedValue({
        addressType: 'TERTIARY',
        addressLine1: 'a',
        addressLine2: 'b',
        addressLine3: 'c',
        addressLine4: 'd',
        postcode: 'e',
      })

      // When
      await addressController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/contact-information/interested-parties`)
    })
  })
})
