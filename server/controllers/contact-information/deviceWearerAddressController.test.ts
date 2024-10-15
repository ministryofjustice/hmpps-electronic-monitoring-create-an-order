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
  address: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    postCode: '',
  },
}

const secondaryAddress = {
  addressType: DeviceWearerAddressTypeEnum.Enum.SECONDARY,
  address: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    postCode: '',
  },
}

const tertiaryAddress = {
  addressType: DeviceWearerAddressTypeEnum.Enum.TERTIARY,
  address: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    postCode: '',
  },
}

const installationAddress = {
  addressType: DeviceWearerAddressTypeEnum.Enum.INSTALLATION,
  address: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    postCode: '',
  },
}

const noFixedAbodeAddress = {
  addressType: DeviceWearerAddressTypeEnum.Enum.NO_FIXED_ABODE,
  address: null,
}

const orderWithAddresses = getMockOrder({
  deviceWearerAddresses: [primaryAddress, secondaryAddress, tertiaryAddress, installationAddress],
})

const orderWithNoAddresses = getMockOrder()

const orderWithNoFixedAbode = getMockOrder({
  deviceWearerAddresses: [noFixedAbodeAddress],
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
          action: 'contine',
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
})
