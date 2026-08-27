import RestClient from '../../data/restClient'
import ContactDetailsService from '../../services/contactDetailsService'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import ContactDetailsController from './contactDetailsController'
import TaskListService from '../../services/taskListService'
import CorePersonRecordService from '../../routes/postcode-lookup/core-person-record/service'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/contactDetailsService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

describe('ContactDetailsController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockContactDetailsService: jest.Mocked<ContactDetailsService>
  let mockCorePersonRecordService: jest.Mocked<CorePersonRecordService>
  let contactDetailsController: ContactDetailsController
  const taskListService = {
    getNextCheckYourAnswersPage: jest.fn(),
    getNextPage: jest.fn(),
  } as unknown as jest.Mocked<TaskListService>

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockContactDetailsService = new ContactDetailsService(mockRestClient) as jest.Mocked<ContactDetailsService>
    mockCorePersonRecordService = {
      getOrganisationSearchId: jest.fn(),
    } as unknown as jest.Mocked<CorePersonRecordService>
    contactDetailsController = new ContactDetailsController(
      mockContactDetailsService,
      taskListService,
      mockCorePersonRecordService,
    )
  })

  describe('get', () => {
    it('should render the form when there are no saved contact details', async () => {
      // Given
      const mockOrder = getMockOrder({ contactDetails: null })
      const req = createMockRequest({ order: mockOrder, flash: jest.fn().mockReturnValue([]) })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await contactDetailsController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/contact-information/contact-details',
        expect.objectContaining({
          contactNumber: {
            value: '',
          },
        }),
      )
    })

    it('should render the form using the saved contact details data', async () => {
      // Given
      const mockOrder = getMockOrder({ contactDetails: { contactNumber: '01234567890', phoneNumberAvailable: true } })
      const req = createMockRequest({ order: mockOrder, flash: jest.fn().mockReturnValue([]) })
      const res = createMockResponse()
      const next = jest.fn()

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
      const mockOrder = getMockOrder({ contactDetails: { contactNumber: '01234567890', phoneNumberAvailable: true } })
      const req = createMockRequest({
        order: mockOrder,
        flash: jest
          .fn()
          .mockReturnValueOnce([{ error: 'Phone number is in an incorrect format', field: 'contactNumber' }])
          .mockReturnValueOnce([
            {
              contactNumber: 'abc',
            },
          ]),
      })
      const res = createMockResponse()
      const next = jest.fn()

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
      const mockOrder = getMockOrder()
      const req = createMockRequest({
        order: mockOrder,
        params: { orderId: mockOrder.id },
        body: {
          action: 'continue',
          contactNumber: 'abc',
        },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const next = jest.fn()
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
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/contact-information/contact-details`)
    })

    it('should save and redirect to the existing primary address confirmation page', async () => {
      // Given
      const mockOrder = getMockOrder({
        addresses: [
          {
            addressType: 'PRIMARY',
            addressLine1: '1 Washington Street',
            addressLine2: '',
            addressLine3: 'Worcester',
            addressLine4: '',
            postcode: 'WR1 1NL',
          },
        ],
      })
      const req = createMockRequest({
        order: mockOrder,
        params: { orderId: mockOrder.id },
        body: {
          action: 'continue',
          contactNumber: '01234567890',
        },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const next = jest.fn()
      mockContactDetailsService.updateContactDetails.mockResolvedValue({
        contactNumber: '01234567890',
        phoneNumberAvailable: true,
      })
      // When
      await contactDetailsController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/confirm-address/PRIMARY`)
    })

    it('should save and redirect to CPR address confirmation for a prison number', async () => {
      const mockOrder = getMockOrder({ addresses: [] })
      const req = createMockRequest({
        order: mockOrder,
        params: { orderId: mockOrder.id },
        body: { action: 'continue', contactNumber: '01234567890' },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      mockContactDetailsService.updateContactDetails.mockResolvedValue({
        contactNumber: '01234567890',
        phoneNumberAvailable: true,
      })
      mockCorePersonRecordService.getOrganisationSearchId.mockReturnValue('A1234BC')

      await contactDetailsController.update(req, res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith(
        `/order/${mockOrder.id}/confirm-address/PRIMARY?organisationSearchId=A1234BC`,
      )
    })

    it('should save and redirect to the fixed address page when no CPR identifier is available', async () => {
      const mockOrder = getMockOrder({ addresses: [] })
      const req = createMockRequest({
        order: mockOrder,
        body: { action: 'continue', contactNumber: '01234567890' },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      mockContactDetailsService.updateContactDetails.mockResolvedValue({
        contactNumber: '01234567890',
        phoneNumberAvailable: true,
      })
      mockCorePersonRecordService.getOrganisationSearchId.mockReturnValue(null)
      taskListService.getNextPage.mockReturnValue(`/order/${mockOrder.id}/contact-information/no-fixed-abode`)

      await contactDetailsController.update(req, res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/contact-information/no-fixed-abode`)
    })

    it('should save and redirect to the order summary page if the user selects back', async () => {
      // Given
      const mockOrder = getMockOrder()
      const req = createMockRequest({
        order: mockOrder,
        params: {
          orderId: mockOrder.id,
        },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const next = jest.fn()
      req.body = {
        action: 'back',
        contactNumber: '01234567890',
      }
      mockContactDetailsService.updateContactDetails.mockResolvedValue({
        contactNumber: '01234567890',
        phoneNumberAvailable: true,
      })

      // When
      await contactDetailsController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/summary`)
    })
  })
})
