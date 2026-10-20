import { randomUUID } from 'crypto'
import { createInterestedParties, getMockOrder } from '../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../test/mocks/mockExpress'
import RestClient from '../data/restClient'
import { OrderStatusEnum } from '../models/Order'
import ConfirmationPageViewModel from '../models/view-models/confirmationPage'
import OrderService from '../services/orderService'
import OrderController from './orderController'
import SectionService from '../services/sectionsService'
import { SanitisedError } from '../sanitisedError'
import FeatureFlags from '../utils/featureFlags'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../data/hmppsAuditClient')
jest.mock('../data/restClient')

describe('OrderController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockOrderService: jest.Mocked<OrderService>
  let orderController: OrderController
  let sectionService: jest.Mocked<SectionService>

  beforeEach(() => {
    jest.spyOn(FeatureFlags.getInstance(), 'get').mockReturnValue(false)
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockOrderService = new OrderService(mockRestClient) as jest.Mocked<OrderService>
    mockOrderService.getVersionInformations = jest.fn().mockResolvedValue([])
    sectionService = {
      getSectionsForOrder: jest.fn().mockReturnValue(Promise.resolve([])),
    } as unknown as jest.Mocked<SectionService>
    orderController = new OrderController(mockOrderService, sectionService)
    mockOrderService.amendOrder = jest.fn().mockResolvedValue({ order: getMockOrder(), outcome: 'ACCEPTED' })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('summary', () => {
    it('should render a summary of the order', async () => {
      // Given
      const mockOrder = getMockOrder()
      const req = createMockRequest({ order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      // When
      await orderController.summary(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/summary',
        expect.objectContaining({
          order: mockOrder,
        }),
      )
    })

    it('should render the summary when the sentencing act flag is missing', async () => {
      const mockOrder = getMockOrder({
        interestedParties: createInterestedParties({ notifyingOrganisation: 'PRISON' }),
      })
      const req = createMockRequest({ order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      await orderController.summary(req, res, next)
      expect(res.redirect).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith('pages/order/summary', expect.objectContaining({ order: mockOrder }))
    })

    it('should indicate when the order has been rejected', async () => {
      const mockOrder = getMockOrder({ status: 'REJECTED', canAmend: true })
      mockOrder.statusUpdates = [
        {
          id: randomUUID(),
          versionId: mockOrder.versionId,
          status: 'REJECTED',
          datetimeOfStatusChange: '2026-01-01T12:00:00Z',
          statusUpdateReasons: [],
        },
      ]
      const req = createMockRequest({ order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      await orderController.summary(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/summary',
        expect.objectContaining({
          isOrderRejected: true,
          canCreateOrderVersion: true,
          returnReasonsUrl: `/order/${mockOrder.id}/return-reasons`,
          timelineItems: expect.arrayContaining([
            expect.objectContaining({
              label: { text: 'Form returned' },
              datetime: { timestamp: '2026-01-01T12:00:00Z', type: 'datetime' },
              byline: { text: 'The Electronic Monitoring Service (EMS)' },
            }),
          ]),
        }),
      )
    })

    it('should block changes while the case is processing', async () => {
      const mockOrder = getMockOrder({ status: 'SUBMITTED' })
      const req = createMockRequest({ order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      req.flash = jest.fn().mockReturnValue([])

      await orderController.summary(req, res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/summary',
        expect.objectContaining({
          canCreateOrderVersion: false,
        }),
      )
    })

    it('should block changes to a submitted order with an open case', async () => {
      const order = getMockOrder({ status: 'SUBMITTED' })
      const req = createMockRequest({ order, flash: jest.fn().mockReturnValue([]) })
      const res = createMockResponse()

      await orderController.summary(req, res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/summary',
        expect.objectContaining({
          canCreateOrderVersion: false,
          orderChangeBlockedMessage:
            "You can't make changes to this form because it is being processed by EMS. Try again later.",
        }),
      )
    })
  })

  describe('create', () => {
    it('should create an order and redirect to notifying organisation', async () => {
      // Given
      const mockOrder = getMockOrder()
      const req = createMockRequest({
        body: {
          type: 'REQUEST',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()
      mockOrderService.createOrder.mockResolvedValue(mockOrder)

      // When
      await orderController.create(req, res, next)

      // Then
      expect(mockOrderService.createOrder).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        data: { type: 'REQUEST' },
      })
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/interest-parties/notifying-organisation`)
    })
  })

  describe('confirmEdit', () => {
    it('should render the confirm edit view', async () => {
      // Given
      const mockOrder = getMockOrder()
      const mockViewModel = ConfirmationPageViewModel.construct(mockOrder)
      const req = createMockRequest({ order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      // When
      await orderController.confirmEdit(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/edit-confirm',
        expect.objectContaining({
          ...mockViewModel,
        }),
      )
    })

    it('should redirect a submitted order with an open case to its summary', async () => {
      const order = getMockOrder({ status: 'SUBMITTED' })
      const req = createMockRequest({ order })
      const res = createMockResponse()

      await orderController.confirmEdit(req, res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/summary`)
      expect(res.render).not.toHaveBeenCalled()
    })

    it('should redirect to summary when the case is still processing', async () => {
      const mockOrder = getMockOrder({ status: 'SUBMITTED' })
      const req = createMockRequest({ order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()

      await orderController.confirmEdit(req, res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/summary`)
      expect(res.render).not.toHaveBeenCalled()
    })
  })

  describe('createVariation', () => {
    it('blocks a submitted order when the API says it cannot be amended', async () => {
      const orderId = randomUUID()
      const order = getMockOrder({ id: orderId, status: 'SUBMITTED', canAmend: false })
      const req = createMockRequest({ order, body: { action: 'continue' }, params: { orderId }, flash: jest.fn() })
      const res = createMockResponse()

      await orderController.createVariation(req, res, jest.fn())

      expect(mockOrderService.amendOrder).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${orderId}/summary`)
    })

    it('submits an accepted order without an action and follows the API outcome', async () => {
      const orderId = randomUUID()
      const order = getMockOrder({ id: orderId, status: 'SUBMITTED', canAmend: true })
      order.statusUpdates = [
        {
          id: randomUUID(),
          versionId: order.versionId,
          status: 'ACCEPTED',
          datetimeOfStatusChange: '2026-01-01T12:00:00Z',
          statusUpdateReasons: [],
        },
      ]
      const req = createMockRequest({ order, body: { action: 'continue' }, params: { orderId } })
      const res = createMockResponse()

      await orderController.createVariation(req, res, jest.fn())

      expect(mockOrderService.amendOrder).toHaveBeenCalledWith({
        orderId,
        accessToken: 'fakeUserToken',
      })
      expect(res.redirect).toHaveBeenCalledWith(`/order/${orderId}/summary`)
    })

    it('routes accepted submitted orders into the service-request flow when enabled', async () => {
      jest.spyOn(FeatureFlags.getInstance(), 'get').mockReturnValue(true)
      const orderId = randomUUID()
      const order = getMockOrder({ id: orderId, status: 'SUBMITTED', canAmend: true })
      order.statusUpdates = [
        {
          id: randomUUID(),
          versionId: order.versionId,
          status: 'ACCEPTED',
          datetimeOfStatusChange: '2026-01-01T12:00:00Z',
          statusUpdateReasons: [],
        },
      ]
      const req = createMockRequest({ order, body: { action: 'continue' }, params: { orderId } })
      const res = createMockResponse()

      await orderController.createVariation(req, res, jest.fn())

      expect(mockOrderService.amendOrder).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${orderId}/is-address-change`)
    })

    it('uses the API outcome instead of an earlier rejected status observation', async () => {
      const orderId = randomUUID()
      const order = getMockOrder({ id: orderId, status: 'SUBMITTED', canAmend: true })
      order.statusUpdates = [
        {
          id: randomUUID(),
          versionId: order.versionId,
          status: 'REJECTED',
          datetimeOfStatusChange: '2026-01-01T12:00:00Z',
          statusUpdateReasons: [],
        },
      ]
      const req = createMockRequest({ order, body: { action: 'continue' }, params: { orderId } })
      const res = createMockResponse()
      mockOrderService.amendOrder.mockResolvedValue({ order, outcome: 'ACCEPTED' })

      await orderController.createVariation(req, res, jest.fn())

      expect(mockOrderService.amendOrder).toHaveBeenCalledWith({
        orderId,
        accessToken: 'fakeUserToken',
      })
      expect(res.redirect).toHaveBeenCalledWith(`/order/${orderId}/summary`)
    })

    it('routes a rejected response to notifying organisation for a rejected order', async () => {
      const orderId = randomUUID()
      const order = getMockOrder({ id: orderId, status: 'REJECTED', canAmend: true })
      const req = createMockRequest({ order, body: { action: 'continue' }, params: { orderId } })
      const res = createMockResponse()
      mockOrderService.amendOrder.mockResolvedValue({ order, outcome: 'REJECTED' })

      await orderController.createVariation(req, res, jest.fn())

      expect(mockOrderService.amendOrder).toHaveBeenCalledWith({
        orderId,
        accessToken: 'fakeUserToken',
      })
      expect(res.redirect).toHaveBeenCalledWith(`/order/${orderId}/interest-parties/notifying-organisation`)
    })

    it('returns to the summary when the backend rejects a stale status', async () => {
      const orderId = randomUUID()
      const order = getMockOrder({ id: orderId, status: 'SUBMITTED', canAmend: true })
      order.statusUpdates = [
        {
          id: randomUUID(),
          versionId: order.versionId,
          status: 'ACCEPTED',
          datetimeOfStatusChange: '2026-01-01T12:00:00Z',
          statusUpdateReasons: [],
        },
      ]
      const req = createMockRequest({ order, body: { action: 'continue' }, params: { orderId }, flash: jest.fn() })
      const res = createMockResponse()
      mockOrderService.amendOrder.mockRejectedValue({ status: 409 } as SanitisedError)

      await orderController.createVariation(req, res, jest.fn())

      expect(req.flash).toHaveBeenCalledWith(
        'submissionError',
        'The status of this form has changed. Check its current status before making changes.',
      )
      expect(res.redirect).toHaveBeenCalledWith(`/order/${orderId}/summary`)
    })
  })

  describe('confirmDelete', () => {
    it('should render a confirmation page for an order', async () => {
      // Given
      const mockOrder = getMockOrder()
      const req = createMockRequest({ order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await orderController.confirmDelete(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/delete-confirm', {
        order: mockOrder,
      })
    })
  })

  describe('delete', () => {
    it('should delete the order and redirect to a success page for a draft order', async () => {
      // Given
      const mockOrder = getMockOrder()
      const req = createMockRequest({ body: { action: 'continue' }, order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      const next = jest.fn()
      mockOrderService.deleteOrder.mockResolvedValue({ ok: true })

      // When
      await orderController.delete(req, res, next)

      // Then
      expect(mockOrderService.deleteOrder).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        orderId: mockOrder.id,
      })
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/delete/success')
    })

    it('should not delete the order and redirect to a failed page for a submitted order', async () => {
      // Given
      const mockOrder = getMockOrder({ status: OrderStatusEnum.Enum.SUBMITTED })
      const req = createMockRequest({ body: { action: 'continue' }, order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      const next = jest.fn()
      mockOrderService.deleteOrder.mockResolvedValue({
        ok: false,
        error: `Order with id ${mockOrder.id} cannot be deleted because it has already been submitted`,
      })

      // When
      await orderController.delete(req, res, next)

      // Then
      expect(mockOrderService.deleteOrder).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        orderId: mockOrder.id,
      })
      expect(req.flash).toHaveBeenCalledWith(
        'deletionErrors',
        `Order with id ${mockOrder.id} cannot be deleted because it has already been submitted`,
      )
      expect(res.redirect).toHaveBeenCalledWith('/order/delete/failed')
    })

    it('should not delete the order and redirect to a failed page for a submitted order', async () => {
      // Given
      const mockOrder = getMockOrder({ status: OrderStatusEnum.Enum.SUBMITTED })
      const req = createMockRequest({ body: { action: 'continue' }, order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      const next = jest.fn()
      mockOrderService.deleteOrder.mockResolvedValue({
        ok: false,
        error: `Order with id ${mockOrder.id} cannot be deleted because it is in an invalid state`,
      })

      // When
      await orderController.delete(req, res, next)

      // Then
      expect(mockOrderService.deleteOrder).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        orderId: mockOrder.id,
      })
      expect(req.flash).toHaveBeenCalledWith(
        'deletionErrors',
        `Order with id ${mockOrder.id} cannot be deleted because it is in an invalid state`,
      )
      expect(res.redirect).toHaveBeenCalledWith('/order/delete/failed')
    })

    it('should redirect to the summary pages if the user does not confirm the delete', async () => {
      // Given
      const mockOrder = getMockOrder({ status: OrderStatusEnum.Enum.SUBMITTED })
      const req = createMockRequest({ body: { action: 'back' }, order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await orderController.delete(req, res, next)

      // Then
      expect(mockOrderService.deleteOrder).not.toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/summary`)
    })
  })

  describe('deleteFailed', () => {
    it('should render the failed view', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      // When
      await orderController.deleteFailed(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/delete-failed', { errors: [] })
    })
  })

  describe('deleteSuccess', () => {
    it('should render the success view', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await orderController.deleteSuccess(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/delete-success')
    })
  })

  describe('submit', () => {
    it('should submit the order and redirect to a success page for a draft order', async () => {
      // Given
      const mockOrder = getMockOrder()
      const req = createMockRequest({
        order: mockOrder,
        params: {
          orderId: mockOrder.id,
        },
      })
      const res = createMockResponse()
      const next = jest.fn()
      mockOrderService.submitOrder.mockResolvedValue({
        submitted: true,
        data: mockOrder,
      })

      // When
      await orderController.submit(req, res, next)

      // Then
      expect(mockOrderService.submitOrder).toHaveBeenCalledWith({ accessToken: 'fakeUserToken', orderId: mockOrder.id })
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/submit/success`)
    })

    it('should not submit the order and redirect to a failed page for a submitted order', async () => {
      // Given
      const mockOrder = getMockOrder({ status: OrderStatusEnum.Enum.SUBMITTED })
      const req = createMockRequest({ order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      const next = jest.fn()
      mockOrderService.submitOrder.mockResolvedValue({
        submitted: false,
        error: 'This order has already been submitted',
        type: 'alreadySubmitted',
      })

      // When
      await orderController.submit(req, res, next)

      // Then
      expect(mockOrderService.submitOrder).toHaveBeenCalledWith({ accessToken: 'fakeUserToken', orderId: mockOrder.id })
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/summary`)
      expect(req.flash).toHaveBeenCalledWith('submissionError', 'This order has already been submitted')
    })

    it('should submit the order and redirect to a partial success page for a order failed submit attachments', async () => {
      // Given
      const mockOrder = getMockOrder({ status: OrderStatusEnum.Enum.ERROR })
      const req = createMockRequest({ order: mockOrder, flash: jest.fn() })
      const res = createMockResponse()
      const next = jest.fn()
      mockOrderService.submitOrder.mockResolvedValue({
        submitted: false,
        error: 'Error submit attachments to Serco',
        type: 'partialSuccess',
      })

      // When
      await orderController.submit(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/submit/partial-success`)
    })
  })

  describe('submitFailed', () => {
    it('should render the failed view', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      // When
      await orderController.submitFailed(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/submit-failed', { errors: [] })
    })
  })

  describe('submitSuccess', () => {
    it('should render the success view', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await orderController.submitSuccess(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/submit-success', {
        orderId: '123456789',
        isVariation: false,
      })
    })
  })

  describe('submitPartialSuccess', () => {
    it('should render the success view', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])
      // When
      await orderController.submitPartialSuccess(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/submit-partial-success', { errors: [] })
    })
  })
})
