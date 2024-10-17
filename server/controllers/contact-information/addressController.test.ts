import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import AddressService from '../../services/addressService'
import DeviceWearerService from '../../services/deviceWearerService'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import AddressController from './addressController'
import { AddressTypeEnum } from '../../models/Address'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/addressService')
jest.mock('../../services/deviceWearerService')
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

const createMockOrder = (noFixedAbode: boolean | null) =>
  getMockOrder({
    addresses: [primaryAddress, secondaryAddress, tertiaryAddress, installationAddress],
    deviceWearer: {
      nomisId: null,
      pncId: null,
      deliusId: null,
      prisonNumber: null,
      firstName: null,
      lastName: null,
      alias: null,
      dateOfBirth: null,
      adultAtTimeOfInstallation: null,
      sex: null,
      gender: null,
      disabilities: [],
      noFixedAbode,
    },
  })

describe('AddressController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockAddressService: jest.Mocked<AddressService>
  let mockDeviceWearerService: jest.Mocked<DeviceWearerService>
  let addressController: AddressController

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
    mockDeviceWearerService = new DeviceWearerService(mockRestClient) as jest.Mocked<DeviceWearerService>
    addressController = new AddressController(mockAuditService, mockAddressService, mockDeviceWearerService)
  })

  describe('getNoFixedAbode', () => {
    it('should render the no-fixed-abode view with neither option selected', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(null),
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await addressController.getNoFixedAbode(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        noFixedAbode: 'null',
        errors: {},
      })
    })

    it('should render the fixed-abode view with the "yes" option selected', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(true),
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await addressController.getNoFixedAbode(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        noFixedAbode: 'true',
        errors: {},
      })
    })

    it('should render the fixed-abode view with the "no" option selected', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(false),
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await addressController.getNoFixedAbode(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        noFixedAbode: 'false',
        errors: {},
      })
    })

    it('should render the fixed-abode view with errors if neither option was selected on form submission', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(null),
        flash: jest
          .fn()
          .mockReturnValueOnce([
            { error: 'You must indicate whether the device wearer has a fixed abode', field: 'fixedAbode' },
          ])
          .mockReturnValue([
            {
              noFixedAbode: 'null',
            },
          ]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await addressController.getNoFixedAbode(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        noFixedAbode: 'null',
        errors: {
          fixedAbode: {
            text: 'You must indicate whether the device wearer has a fixed abode',
          },
        },
      })
    })
  })

  describe('postNoFixedAbode', () => {
    it('should redirect to the primary address page if the user selects "yes"', async () => {
      // Given
      const req = createMockRequest({
        body: {
          action: 'continue',
          noFixedAbode: 'false',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue({
        nomisId: null,
        pncId: null,
        deliusId: null,
        prisonNumber: null,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultAtTimeOfInstallation: null,
        sex: null,
        gender: null,
        disabilities: [],
        noFixedAbode: false
      })

      // When
      await addressController.postNoFixedAbode(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/addresses/primary')
    })

    it('should redirect to the notifying organisation form if the user selects "no"', async () => {
      // Given
      const req = createMockRequest({
        body: {
          action: 'continue',
          noFixedAbode: 'true',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue({
        nomisId: null,
        pncId: null,
        deliusId: null,
        prisonNumber: null,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultAtTimeOfInstallation: null,
        sex: null,
        gender: null,
        disabilities: [],
        noFixedAbode: true
      })

      // When
      await addressController.postNoFixedAbode(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/notifying-organisation')
    })

    it('should redirect to the summary page if the user selects back', async () => {
      const req = createMockRequest({
        body: {
          action: 'back',
          noFixedAbode: 'false',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue({
        nomisId: null,
        pncId: null,
        deliusId: null,
        prisonNumber: null,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultAtTimeOfInstallation: null,
        sex: null,
        gender: null,
        disabilities: [],
        noFixedAbode: false
      })

      // When
      await addressController.postNoFixedAbode(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/summary')
    })

    it('should redirect to the form if the user doesnt select an option', async () => {
      const req = createMockRequest({
        body: {
          action: 'continue',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()
      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue([
        { error: 'You must indicate whether the device wearer has a fixed abode', field: 'noFixedAbode' },
      ])

      // When
      await addressController.postNoFixedAbode(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { error: 'You must indicate whether the device wearer has a fixed abode', field: 'noFixedAbode' },
      ])
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/no-fixed-abode')
    })
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
          order: createMockOrder(null),
          flash: jest.fn().mockReturnValue([]),
          params: {
            orderId: '123456789',
            addressType: param,
          },
        })
        const res = createMockResponse()
        const next = jest.fn()

        // When
        await addressController.getAddress(req, res, next)

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/address', {
          ...expected,
          hasAnotherAddress,
          errors: {},
        })
      },
    )

    it('should render the form using submitted data when there are validaiton errors', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(null),
        params: {
          orderId: '123456789',
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
      await addressController.getAddress(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/address', {
        addressType: 'PRIMARY',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        postcode: '',
        hasAnotherAddress: true,
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
        order: createMockOrder(null),
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
          orderId: '123456789',
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
      await addressController.postAddress(req, res, next)

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
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/addresses/primary')
    })

    it('should save and redirect to the order summary page if the user selects back', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(null),
        body: {
          action: 'back',
          addressLine1: 'a',
          addressLine2: 'b',
          addressLine3: 'c',
          addressLine4: 'd',
          postCode: 'e',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
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
      await addressController.postAddress(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/summary')
    })

    it.each([
      ['Primary', 'primary', '/order/123456789/contact-information/addresses/secondary'],
      ['Secondary', 'secondary', '/order/123456789/contact-information/addresses/tertiary'],
    ])(
      'should go to the next address form if the user indicates they have another address',
      async (_: string, param: string, expectedLocation: string) => {
        // Given
        const req = createMockRequest({
          order: createMockOrder(null),
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
            orderId: '123456789',
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
        await addressController.postAddress(req, res, next)

        // Then
        expect(req.flash).not.toHaveBeenCalled()
        expect(res.redirect).toHaveBeenCalledWith(expectedLocation)
      },
    )

    it.each([
      ['Primary', 'primary', '/order/123456789/contact-information/notifying-organisation'],
      ['Secondary', 'secondary', '/order/123456789/contact-information/notifying-organisation'],
    ])(
      'should go to the notifying organisation page if the user indicates they do not have another address',
      async (_: string, param: string, expectedLocation: string) => {
        // Given
        const req = createMockRequest({
          order: createMockOrder(null),
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
            orderId: '123456789',
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
        await addressController.postAddress(req, res, next)

        // Then
        expect(req.flash).not.toHaveBeenCalled()
        expect(res.redirect).toHaveBeenCalledWith(expectedLocation)
      },
    )

    it('should go always go the notifying organisation page if the tertiary address is being filled in', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(null),
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
          orderId: '123456789',
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
      await addressController.postAddress(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/notifying-organisation')
    })
  })
})
