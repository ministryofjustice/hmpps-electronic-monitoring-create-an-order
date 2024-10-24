import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import ContactDetailsService from '../../services/contactDetailsService'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import ContactDetailsController from './contactDetailsController'

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
      const mockOrder = getMockOrder({ deviceWearerContactDetails: { contactNumber: '01234567890' } })
      const req = createMockRequest({ order: mockOrder })
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      // When
      await contactDetailsController.view(req, res, next)

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
      const mockOrder = getMockOrder({ deviceWearerContactDetails: { contactNumber: '01234567890' } })
      const req = createMockRequest({ order: mockOrder })
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
      await contactDetailsController.view(req, res, next)

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
      await contactDetailsController.update(req, res, next)

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
      await contactDetailsController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/no-fixed-abode')
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
      await contactDetailsController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/summary')
    })
  })
})
