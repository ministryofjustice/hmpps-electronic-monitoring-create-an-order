import { getMockOrder } from '../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../test/mocks/mockExpress'
import HmppsAuditClient from '../data/hmppsAuditClient'
import RestClient from '../data/restClient'
import { OrderStatusEnum } from '../models/Order'
import AuditService from '../services/auditService'
import OrderService from '../services/orderService'
import OrderController from './orderController'
import TaskListService from '../services/taskListService'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../data/hmppsAuditClient')
jest.mock('../data/restClient')

describe('OrderController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockOrderService: jest.Mocked<OrderService>
  let orderController: OrderController
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
    mockOrderService = new OrderService(mockRestClient) as jest.Mocked<OrderService>
    orderController = new OrderController(mockAuditService, mockOrderService, taskListService)
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
  })

  describe('create', () => {
    it('should create an order and redirect to view the order', async () => {
      // Given
      const mockOrder = getMockOrder()
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      mockOrderService.createOrder.mockResolvedValue(mockOrder)

      // When
      await orderController.create(req, res, next)

      // Then
      expect(mockOrderService.createOrder).toHaveBeenCalledWith({ accessToken: 'fakeUserToken' })
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/summary`)
    })
  })

  describe('confirmDelete', () => {
    it('should render a confirmation page for a draft order', async () => {
      // Given
      const mockOrder = getMockOrder()
      const req = createMockRequest({ order: mockOrder })
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      // When
      await orderController.confirmDelete(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/delete-confirm', {
        order: mockOrder,
      })
    })

    it('should redirect to a failed page for a submitted order', async () => {
      // Given
      const mockOrder = getMockOrder({ status: OrderStatusEnum.Enum.SUBMITTED })
      const req = createMockRequest({ order: mockOrder })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await orderController.confirmDelete(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/order/delete/failed`)
    })
  })

  describe('delete', () => {
    it('should delete the order and redirect to a success page for a draft order', async () => {
      // Given
      const mockOrder = getMockOrder()
      const req = createMockRequest({ order: mockOrder })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await orderController.delete(req, res, next)

      // Then
      expect(mockOrderService.deleteOrder).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        orderId: mockOrder.id,
      })
      expect(res.redirect).toHaveBeenCalledWith('/order/delete/success')
    })

    it('should not delete the order and reditect to a failed page for a submitted order', async () => {
      // Given
      const mockOrder = getMockOrder({ status: OrderStatusEnum.Enum.SUBMITTED })
      const req = createMockRequest({ order: mockOrder })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await orderController.delete(req, res, next)

      // Then
      expect(mockOrderService.deleteOrder).toHaveBeenCalledTimes(0)
      expect(res.redirect).toHaveBeenCalledWith('/order/delete/failed')
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
      expect(res.render).toHaveBeenCalledWith('pages/order/submit-success', { orderId: '123456789' })
    })
  })
})
