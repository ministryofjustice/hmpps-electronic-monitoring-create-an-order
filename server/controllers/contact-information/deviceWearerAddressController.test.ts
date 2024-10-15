import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import DeviceWearerAddressService from '../../services/deviceWearerAddressService'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import DeviceWearerAddressController from './deviceWearerAddressController'
import { DeviceWearerAddressTypeEnum } from '../../models/DeviceWearerAddress'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/deviceWearerAddressService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const primaryAddress = {
  addressType: DeviceWearerAddressTypeEnum.Enum.PRIMARY,
  installationAddress: false,
  address: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    postcode: '',
  },
}

const primaryInstallationAddress = {
  addressType: DeviceWearerAddressTypeEnum.Enum.PRIMARY,
  installationAddress: true,
  address: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    postcode: '',
  },
}

const secondaryAddress = {
  addressType: DeviceWearerAddressTypeEnum.Enum.SECONDARY,
  installationAddress: false,
  address: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    postcode: '',
  },
}

const tertiaryAddress = {
  addressType: DeviceWearerAddressTypeEnum.Enum.TERTIARY,
  installationAddress: false,
  address: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    postcode: '',
  },
}

const installationAddress = {
  addressType: DeviceWearerAddressTypeEnum.Enum.INSTALLATION,
  installationAddress: false,
  address: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    postcode: '',
  },
}

const noFixedAbodeAddress = {
  addressType: DeviceWearerAddressTypeEnum.Enum.NO_FIXED_ABODE,
  installationAddress: false,
  address: null,
}

const orderWithAddresses = getMockOrder({
  deviceWearerAddresses: [primaryAddress, secondaryAddress, tertiaryAddress, installationAddress],
})

const orderWithNoAddresses = getMockOrder()

const orderWithNoFixedAbode = getMockOrder({
  deviceWearerAddresses: [noFixedAbodeAddress],
})

const orderWithPrimaryInstallationAddress = getMockOrder({
  deviceWearerAddresses: [primaryInstallationAddress, secondaryAddress, tertiaryAddress],
})

describe('DeviceWearerAddressController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockDeviceWearerAddressService: jest.Mocked<DeviceWearerAddressService>
  let deviceWearerAddressController: DeviceWearerAddressController

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
    mockDeviceWearerAddressService = new DeviceWearerAddressService(
      mockRestClient,
    ) as jest.Mocked<DeviceWearerAddressService>
    deviceWearerAddressController = new DeviceWearerAddressController(mockAuditService, mockDeviceWearerAddressService)
  })

  describe('getFixedAbode', () => {
    it('should render the fixed-abode view without either option selected', async () => {
      // Given
      const req = createMockRequest({
        order: orderWithNoAddresses,
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await deviceWearerAddressController.getFixedAbode(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/fixed-abode', {
        fixedAbode: 'null',
        errors: {},
      })
    })

    it('should render the fixed-abode view with the "yes" option selected', async () => {
      // Given
      const req = createMockRequest({
        order: orderWithAddresses,
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await deviceWearerAddressController.getFixedAbode(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/fixed-abode', {
        fixedAbode: 'true',
        errors: {},
      })
    })

    it('should render the fixed-abode view with the "no" option selected', async () => {
      // Given
      const req = createMockRequest({
        order: orderWithNoFixedAbode,
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await deviceWearerAddressController.getFixedAbode(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/fixed-abode', {
        fixedAbode: 'false',
        errors: {},
      })
    })

    it('should render the fixed-abode view with errors if no option was selected on form submission', async () => {
      // Given
      const req = createMockRequest({
        order: orderWithNoAddresses,
        flash: jest
          .fn()
          .mockReturnValueOnce([
            { error: 'You must indicate whether the device wearer has a fixed abode', field: 'fixedAbode' },
          ]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await deviceWearerAddressController.getFixedAbode(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/fixed-abode', {
        fixedAbode: 'null',
        errors: {
          fixedAbode: {
            text: 'You must indicate whether the device wearer has a fixed abode',
          },
        },
      })
    })
  })

  describe('postFixedAbode', () => {
    it('should redirect to the primary address page if the user selects yes', async () => {
      // Given
      const req = createMockRequest({
        body: {
          action: 'continue',
          fixedAbode: 'true',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await deviceWearerAddressController.postFixedAbode(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/addresses/primary')
    })

    it('should redirect to the installation address page if the user selects no', async () => {
      // Given
      const req = createMockRequest({
        body: {
          action: 'continue',
          fixedAbode: 'false',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await deviceWearerAddressController.postFixedAbode(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/addresses/installation')
    })

    it('should redirect to the summary page if the user selects back', async () => {
      const req = createMockRequest({
        body: {
          action: 'back',
          fixedAbode: 'false',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await deviceWearerAddressController.postFixedAbode(req, res, next)

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

      // When
      await deviceWearerAddressController.postFixedAbode(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { error: 'You must indicate whether the device wearer has a fixed abode', field: 'fixedAbode' },
      ])
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/addresses')
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
          order: orderWithAddresses,
          flash: jest.fn().mockReturnValue([]),
          params: {
            orderId: '123456789',
            addressType: param,
          },
        })
        const res = createMockResponse()
        const next = jest.fn()

        // When
        await deviceWearerAddressController.getAddress(req, res, next)

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/address', {
          ...expected.address,
          addressType: param,
          hasAnotherAddress,
          installationAddress: false,
          errors: {},
        })
      },
    )

    it('should render the form using submitted data when there are validaiton errors', async () => {
      // Given
      const req = createMockRequest({
        order: orderWithAddresses,
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
      await deviceWearerAddressController.getAddress(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/address', {
        addressType: 'primary',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        postcode: '',
        hasAnotherAddress: true,
        installationAddress: false,
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
        order: orderWithAddresses,
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

      mockDeviceWearerAddressService.updateAddress.mockResolvedValue([
        { error: 'Address line 1 is required', field: 'addressLine1' },
        { error: 'Address line 2 is required', field: 'addressLine2' },
        { error: 'Postcode is required', field: 'postcode' },
      ])

      // When
      await deviceWearerAddressController.postAddress(req, res, next)

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
        order: orderWithAddresses,
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

      mockDeviceWearerAddressService.updateAddress.mockResolvedValue({
        addressType: 'PRIMARY',
        installationAddress: false,
        address: {
          addressLine1: 'a',
          addressLine2: 'b',
          addressLine3: 'c',
          addressLine4: 'd',
          postcode: 'e',
        },
      })

      // When
      await deviceWearerAddressController.postAddress(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/summary')
    })

    it.each([
      ['Primary', 'primary', '/order/123456789/contact-information/addresses/secondary'],
      ['Secondary', 'secondary', '/order/123456789/contact-information/addresses/tertiary'],
    ])(
      'should go to the correct location if the user indicates they have another address',
      async (_: string, param: string, expectedLocation: string) => {
        // Given
        const req = createMockRequest({
          order: orderWithAddresses,
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

        mockDeviceWearerAddressService.updateAddress.mockResolvedValue({
          addressType: 'PRIMARY',
          installationAddress: false,
          address: {
            addressLine1: 'a',
            addressLine2: 'b',
            addressLine3: 'c',
            addressLine4: 'd',
            postcode: 'e',
          },
        })

        // When
        await deviceWearerAddressController.postAddress(req, res, next)

        // Then
        expect(req.flash).not.toHaveBeenCalled()
        expect(res.redirect).toHaveBeenCalledWith(expectedLocation)
      },
    )

    it.each([
      ['Primary', 'primary', '/order/123456789/contact-information/notifying-organisation'],
      ['Secondary', 'secondary', '/order/123456789/contact-information/notifying-organisation'],
      ['Tertiary', 'tertiary', '/order/123456789/contact-information/notifying-organisation'],
      ['Installation', 'installation', '/order/123456789/contact-information/notifying-organisation'],
    ])(
      'should go to the notifying organisation page if the user indicates they do not have another address or no more addresses can be added',
      async (_: string, param: string, expectedLocation: string) => {
        // Given
        const req = createMockRequest({
          order: orderWithPrimaryInstallationAddress,
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

        mockDeviceWearerAddressService.updateAddress.mockResolvedValue({
          addressType: 'PRIMARY',
          installationAddress: true,
          address: {
            addressLine1: 'a',
            addressLine2: 'b',
            addressLine3: 'c',
            addressLine4: 'd',
            postcode: 'e',
          },
        })

        // When
        await deviceWearerAddressController.postAddress(req, res, next)

        // Then
        expect(req.flash).not.toHaveBeenCalled()
        expect(res.redirect).toHaveBeenCalledWith(expectedLocation)
      },
    )

    it.each([
      ['Primary', 'primary', '/order/123456789/contact-information/addresses/installation'],
      ['Secondary', 'secondary', '/order/123456789/contact-information/addresses/installation'],
      ['Tertiary', 'tertiary', '/order/123456789/contact-information/addresses/installation'],
    ])(
      'should go to the installation address page if the primary address is not the installation address and the user indicates they have no additional addresses',
      async (_: string, param: string, expectedLocation: string) => {
        // Given
        const req = createMockRequest({
          order: orderWithAddresses,
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

        mockDeviceWearerAddressService.updateAddress.mockResolvedValue({
          addressType: 'PRIMARY',
          installationAddress: false,
          address: {
            addressLine1: 'a',
            addressLine2: 'b',
            addressLine3: 'c',
            addressLine4: 'd',
            postcode: 'e',
          },
        })

        // When
        await deviceWearerAddressController.postAddress(req, res, next)

        // Then
        expect(req.flash).not.toHaveBeenCalled()
        expect(res.redirect).toHaveBeenCalledWith(expectedLocation)
      },
    )
  })
})
