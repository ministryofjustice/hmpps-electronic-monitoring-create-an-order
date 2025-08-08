import RestClient from '../../data/restClient'
import AttachmentService from '../../services/attachmentService'
import AttachmentPhotoQuestionController from './attachmentHavePhotoController'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { HavePhotoModelService } from '../../models/view-models/havePhoto'
import { ValidationError } from '../../models/Validation'
import TaskListService from '../../services/taskListService'
import OrderService from '../../services/orderService'
import { getMockOrder } from '../../../test/mocks/mockOrder'

jest.mock('../../services/attachmentService')
jest.mock('../../data/restClient')
jest.mock('../../services/orderService')

describe('attachment have photo controller', () => {
  let mockAttachmentService: jest.Mocked<AttachmentService>
  let mockModelService: jest.Mocked<HavePhotoModelService>
  let mockRestClient: jest.Mocked<RestClient>
  let mockTaskListService: jest.Mocked<TaskListService>
  let mockOrderService: jest.Mocked<OrderService>

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockAttachmentService = new AttachmentService(mockRestClient) as jest.Mocked<AttachmentService>
    mockModelService = new HavePhotoModelService() as jest.Mocked<HavePhotoModelService>
    mockTaskListService = new TaskListService() as jest.Mocked<TaskListService>
    mockOrderService = new OrderService(mockRestClient) as jest.Mocked<OrderService>
  })

  describe('when we call view', () => {
    it('renders the view', () => {
      const req = createMockRequest({
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const controller = new AttachmentPhotoQuestionController(
        mockAttachmentService,
        mockTaskListService,
        mockOrderService,
        mockModelService,
      )

      controller.view(req, res, jest.fn())

      expect(res.render).toHaveBeenCalledWith('pages/order/attachments/photo-question', expect.anything())
    })
  })
  describe('when we call update', () => {
    it('redirects and sets request values when there is an error', async () => {
      const validationErrors: ValidationError[] = [{ error: 'test error', field: 'havePhoto' }]
      mockAttachmentService.havePhoto.mockResolvedValue(validationErrors)
      const req = createMockRequest({
        flash: jest.fn(),
        body: {
          action: 'continue',
        },
        params: {
          orderId: '1234',
        },
      })
      const res = createMockResponse()
      const controller = new AttachmentPhotoQuestionController(
        mockAttachmentService,
        mockTaskListService,
        mockOrderService,
        mockModelService,
      )

      await controller.update(req, res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith('/order/1234/attachments/have-photo')
      expect(req.flash).toHaveBeenNthCalledWith(1, 'formData', { action: 'continue', havePhoto: null })
      expect(req.flash).toHaveBeenNthCalledWith(2, 'validationErrors', [{ error: 'test error', field: 'havePhoto' }])
    })

    it('redirects to summary if the action is back', async () => {
      const req = createMockRequest({
        body: {
          action: 'back',
          havePhoto: 'yes',
        },
        params: {
          orderId: '1234',
        },
      })
      const res = createMockResponse()
      const controller = new AttachmentPhotoQuestionController(
        mockAttachmentService,
        mockTaskListService,
        mockOrderService,
        mockModelService,
      )

      await controller.update(req, res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith('/order/1234/summary')
    })

    it('redirects to next page if action is continue', async () => {
      const req = createMockRequest({
        body: {
          action: 'continue',
          havePhoto: 'yes',
        },
        params: {
          orderId: '1234',
        },
      })
      const res = createMockResponse()
      mockOrderService.getOrder.mockResolvedValue(
        getMockOrder({ id: req.order!.id, orderParameters: { havePhoto: true } }),
      )

      const controller = new AttachmentPhotoQuestionController(
        mockAttachmentService,
        mockTaskListService,
        mockOrderService,
        mockModelService,
      )

      await controller.update(req, res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith(`/order/${req.order?.id}/attachments/photo_Id`)
    })
  })
})
