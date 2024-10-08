import AuditService from '../../services/auditService'
import ContactDetailsController from './contactDetailsController'
import ContactDetailsService from '../../services/contactDetailsService'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import { OrderStatusEnum } from '../../models/Order'
import RestClient from '../../data/restClient'
import { createMockOrder, createMockRequest, createMockResponse } from '../testutils/utils'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/contactDetailsService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

describe('ContactDetailsController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockContactDetailsService: jest.Mocked<ContactDetailsService>
  let contactDetailsController: ContactDetailsController

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
    mockContactDetailsService = new ContactDetailsService(mockRestClient) as jest.Mocked<ContactDetailsService>
    contactDetailsController = new ContactDetailsController(mockAuditService, mockContactDetailsService)
  })

  describe('get', () => {
    it('should render the form using the saved contact details data', async () => {
      // Given
      const mockOrder = createMockOrder(OrderStatusEnum.Enum.IN_PROGRESS)
      const req = createMockRequest(mockOrder)
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      // When
      await contactDetailsController.get(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/contact-information/contact-details',
        expect.objectContaining({
          contactNumber: {
            value: '01234567890',
          },
        }),
      )
    })

    it('should render the form using submitted data when there are validation errors', async () => {
      // Given
      const mockOrder = createMockOrder(OrderStatusEnum.Enum.IN_PROGRESS)
      const req = createMockRequest(mockOrder)
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest
        .fn()
        .mockReturnValueOnce([{ error: 'Phone number is in an incorrect format', field: 'contactNumber' }])
        .mockReturnValueOnce([
          {
            contactNumber: 'abc',
          },
        ])

      // When
      await contactDetailsController.get(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/contact-information/contact-details',
        expect.objectContaining({
          contactNumber: { value: 'abc', error: { text: 'Phone number is in an incorrect format' } },
        }),
      )
    })
  })

  describe('post', () => {
    it('should persist data and redirect to the form when the user submits invalid values', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn()
      req.body = {
        action: 'continue',
        contactNumber: 'abc',
      }
      mockContactDetailsService.updateContactDetails.mockResolvedValue([
        { error: 'Phone number is in an incorrect format', field: 'contactNumber' },
      ])

      // When
      await contactDetailsController.post(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledTimes(2)
      expect(req.flash).toHaveBeenNthCalledWith(1, 'formData', {
        contactNumber: 'abc',
      })
      expect(req.flash).toHaveBeenNthCalledWith(2, 'validationErrors', [
        { error: 'Phone number is in an incorrect format', field: 'contactNumber' },
      ])
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/contact-details')
    })

    it('should save and redirect to the address details page if the user selects continue', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn()
      req.body = {
        action: 'continue',
        contactNumber: '01234567890',
      }
      mockContactDetailsService.updateContactDetails.mockResolvedValue({
        contactNumber: '01234567890',
      })

      // When
      await contactDetailsController.post(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/addresses')
    })

    it('should save and redirect to the order summary page if the user selects back', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn()
      req.body = {
        action: 'back',
        contactNumber: '01234567890',
      }
      mockContactDetailsService.updateContactDetails.mockResolvedValue({
        contactNumber: '01234567890',
      })

      // When
      await contactDetailsController.post(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/summary')
    })
  })
})
