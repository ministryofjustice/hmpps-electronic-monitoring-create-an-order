import { Request } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { createInterestedParties, createMonitoringConditions, getMockOrder } from '../../../../test/mocks/mockOrder'
import { Order } from '../../../models/Order'
import TaskListService from '../../../services/taskListService'
import AttachmentService from '../service'
import NewDocumentController from './controller'

jest.mock('../service')

const pastDatedProbationVariation = (overrides: Partial<Order> = {}) =>
  getMockOrder({
    type: 'VARIATION',
    interestedParties: createInterestedParties({ notifyingOrganisation: 'PROBATION' }),
    monitoringConditions: createMonitoringConditions({ startDate: '2020-01-01T00:00:00.000Z' }),
    ...overrides,
  })

describe('NewDocumentController', () => {
  let attachmentService: jest.Mocked<AttachmentService>
  let controller: NewDocumentController
  let order: Order

  const requestWith = (body: Record<string, unknown>, flash: unknown[][] = [[], []]): Request => {
    const req = createMockRequest({ order, body, params: { orderId: order.id } })
    req.flash = jest.fn()
    flash.forEach(value => (req.flash as jest.Mock).mockReturnValueOnce(value))
    return req
  }

  beforeEach(() => {
    jest.clearAllMocks()
    attachmentService = new AttachmentService(null as never) as jest.Mocked<AttachmentService>
    attachmentService.updateFileRequired.mockResolvedValue({})
    controller = new NewDocumentController(attachmentService, new TaskListService())
    order = pastDatedProbationVariation()
  })

  describe('view', () => {
    it('asks whether a new document is needed', async () => {
      order = pastDatedProbationVariation({ orderParameters: { haveLicence: false } })
      const req = requestWith({})
      const res = createMockResponse(order)

      await controller.view(req, res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/attachments/file-required',
        expect.objectContaining({
          title: 'Check if you need to upload a new document',
          question: { text: 'Do you need to upload a new document?' },
          fileRequired: { value: 'no' },
          errorSummary: null,
        }),
      )
    })

    it('shows the submitted answer and validation errors', async () => {
      const req = requestWith({}, [
        [{ field: 'fileRequired', error: 'Select Yes if you need to upload a new document' }],
        [{ fileRequired: '' }],
      ])
      const res = createMockResponse(order)

      await controller.view(req, res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/attachments/file-required',
        expect.objectContaining({
          fileRequired: { value: '', error: { text: 'Select Yes if you need to upload a new document' } },
          errorSummary: expect.objectContaining({
            errorList: [{ href: '#fileRequired', text: 'Select Yes if you need to upload a new document' }],
          }),
        }),
      )
    })
  })

  describe('update', () => {
    it('asks the user to answer when no option is selected', async () => {
      const req = requestWith({ action: 'continue' })
      const res = createMockResponse(order)

      await controller.update(req, res, jest.fn())

      expect(attachmentService.updateFileRequired).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { field: 'fileRequired', error: 'Select Yes if you need to upload a new document' },
      ])
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/attachments/new-document`)
    })

    it('records that a new document is needed and goes to the licence upload', async () => {
      const req = requestWith({ action: 'continue', fileRequired: 'yes' })
      const res = createMockResponse(order)

      await controller.update(req, res, jest.fn())

      expect(attachmentService.updateFileRequired).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        orderId: order.id,
        data: expect.objectContaining({ fileRequired: 'yes', fileType: 'LICENCE' }),
      })
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/attachments/licence`)
    })

    it('records that no new document is needed and skips the licence upload', async () => {
      order = pastDatedProbationVariation({ orderParameters: { havePhoto: false } })
      const req = requestWith({ action: 'continue', fileRequired: 'no' })
      const res = createMockResponse(order)

      await controller.update(req, res, jest.fn())

      expect(attachmentService.updateFileRequired).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ fileRequired: 'no', fileType: 'LICENCE' }) }),
      )
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/attachments`)
    })

    it('returns to the order summary when saving as draft', async () => {
      const req = requestWith({ action: 'back', fileRequired: 'yes' })
      const res = createMockResponse(order)

      await controller.update(req, res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/summary`)
    })

    it('shows errors returned when saving the answer', async () => {
      const apiErrors = [{ field: 'fileRequired', error: 'Something went wrong' }]
      attachmentService.updateFileRequired.mockResolvedValue(apiErrors)
      const req = requestWith({ action: 'continue', fileRequired: 'yes' })
      const res = createMockResponse(order)

      await controller.update(req, res, jest.fn())

      expect(req.flash).toHaveBeenCalledWith('validationErrors', apiErrors)
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/attachments/new-document`)
    })
  })
})
