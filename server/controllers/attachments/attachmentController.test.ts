import type { NextFunction, Request, Response } from 'express'
import { Readable } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AttachmentType from '../../models/AttachmentType'
import { OrderStatusEnum } from '../../models/Order'
import AttachmentService from '../../services/attachmentService'
import AuditService from '../../services/auditService'
import OrderService from '../../services/orderService'
import AttachmentController from './attachmentController'
import { createMockRequest } from '../../../test/mocks/mockExpress'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../services/attachmentService')
jest.mock('../../data/restClient')

const mockId = uuidv4()

describe('AttachmentController', () => {
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockOrderService: jest.Mocked<OrderService>
  let mockAttachmentService: jest.Mocked<AttachmentService>
  let controller: AttachmentController
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    mockAuditClient = new HmppsAuditClient({
      queueUrl: '',
      enabled: true,
      region: '',
      serviceName: '',
    }) as jest.Mocked<HmppsAuditClient>
    const mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockOrderService = new OrderService(mockRestClient) as jest.Mocked<OrderService>
    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    mockAttachmentService = new AttachmentService(mockRestClient) as jest.Mocked<AttachmentService>
    controller = new AttachmentController(mockAuditService, mockOrderService, mockAttachmentService)

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      params: {
        orderId: mockId,
      },
      order: getMockOrder({ id: mockId }),
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'auth',
      },
      flash: jest.fn(),
    }

    // @ts-expect-error stubbing res.render
    res = {
      locals: {
        user: {
          username: 'fakeUserName',
          token: 'fakeUserToken',
          authSource: 'nomis',
          userId: 'fakeId',
          name: 'fake user',
          displayName: 'fuser',
          userRoles: ['fakeRole'],
          staffId: 123,
        },
        editable: false,
        orderId: mockId,
      },
      redirect: jest.fn(),
      render: jest.fn(),
      set: jest.fn(),
      send: jest.fn(),
      attachment: jest.fn(),
      on: jest.fn(),
      write: jest.fn(),
      off: jest.fn(),
      end: jest.fn(),
      once: jest.fn(),
      emit: jest.fn(),
    }

    next = jest.fn()
  })

  describe('view attachment summary', () => {
    it('should render a view with file names', async () => {
      req.order?.additionalDocuments.push({
        id: '',
        fileName: 'mockLicenceFile.jpeg',
        fileType: AttachmentType.LICENCE,
      })
      req.order?.additionalDocuments.push({
        id: '',
        fileName: 'mockPhotoFile.jpeg',
        fileType: AttachmentType.PHOTO_ID,
      })
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/attachments/view',
        expect.objectContaining({
          licenceFileName: 'mockLicenceFile.jpeg',
          photoFileName: 'mockPhotoFile.jpeg',
        }),
      )
    })
  })

  describe('view upload file page', () => {
    it('order is submitted, redirect to summary page', async () => {
      req.order!.status = OrderStatusEnum.Enum.SUBMITTED
      req.params.fileType = 'licence'
      await controller.uploadFileView(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${req.order?.id}/attachments`)
    })

    it('order is not submitted, render to upload page page', async () => {
      req.params.fileType = 'licence'
      await controller.uploadFileView(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/attachments/edit',
        expect.objectContaining({
          fileType: 'licence',
        }),
      )
    })
  })

  describe('upload', () => {
    it('Service return error, redirect to edit page with error', async () => {
      req.file = {
        filename: '',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: new Readable(),
        destination: '',
        fieldname: '',
        path: '',
        buffer: Buffer.from(''),
      }
      mockAttachmentService.uploadAttachment = jest
        .fn()
        .mockReturnValueOnce({ status: null, userMessage: 'Mock Error', developerMessage: null })

      req.params.fileType = 'licence'
      await controller.uploadFile(req, res, next)
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/attachments/edit',
        expect.objectContaining({
          fileType: 'licence',
          error: { text: 'Mock Error' },
        }),
      )
    })

    it('Upload successful, log audit redirect to attachment sumary page', async () => {
      req.file = {
        filename: 'mockfile.jpeg',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: new Readable(),
        destination: '',
        fieldname: '',
        path: '',
        buffer: Buffer.from(''),
      }
      mockAttachmentService.uploadAttachment = jest
        .fn()
        .mockReturnValueOnce({ status: null, userMessage: null, developerMessage: null })

      req.params.fileType = 'licence'
      await controller.uploadFile(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(`/order/${req.order?.id}/attachments`)
      expect(mockAuditService.logAuditEvent).toHaveBeenCalledWith({
        who: 'fakeUserName',
        correlationId: req.order?.id,
        what: 'Upload new attachment : mockfile.jpeg',
      })
    })
  })

  describe('download', () => {
    it('download file and log audit', async () => {
      req.params.filename = 'licence.jpeg'
      mockAttachmentService.downloadAttachment.mockResolvedValue(Readable.from('image'))

      req.params.fileType = 'licence'
      await controller.downloadFile(req, res, next)

      expect(res.attachment).toHaveBeenCalledWith('licence.jpeg')
      expect(mockAuditService.logAuditEvent).toHaveBeenCalledWith({
        who: 'fakeUserName',
        correlationId: req.order?.id,
        what: 'Downloaded attachment : licence.jpeg',
      })
    })
  })

  describe('deletion process', () => {
    describe('confirmDeleteLicence', () => {
      it('renders a confirmation page where the user is asked to confirm the request for deletion of their licence', async () => {
        req.params.fileType = 'licence'
        controller.confirmDeleteView(req, res, next)

        expect(res.render).toHaveBeenCalledWith(
          'pages/order/attachments/delete-confirm',
          expect.objectContaining({
            fileType: 'licence',
          }),
        )
      })
    })

    describe('deleteLicence', () => {
      it('deletes the licence and redirects back to attachments page', async () => {
        const mockOrder = getMockOrder()
        req = createMockRequest({ body: { action: 'continue' }, order: mockOrder, flash: jest.fn() })
        mockAttachmentService.deleteAttachment.mockResolvedValue({ ok: true })
        req.params.fileType = 'licence'
        await controller.deleteFile(req, res, next)

        expect(mockAttachmentService.deleteAttachment).toHaveBeenCalledWith({
          accessToken: 'fakeUserToken',
          orderId: mockOrder.id,
          fileType: 'LICENCE',
        })
        expect(mockAuditService.logAuditEvent).toHaveBeenCalledWith({
          who: 'fakeUserName',
          correlationId: req.order?.id,
          what: 'Delete attachment : licence',
        })
        expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/attachments`)
      })
    })

    it('should redirect to the attachments page if the user does not confirm the delete', async () => {
      const mockOrder = getMockOrder()
      req = createMockRequest({ body: { action: 'back' }, order: mockOrder, flash: jest.fn() })
      req.params.fileType = 'licence'
      await controller.deleteFile(req, res, next)

      expect(mockAttachmentService.deleteAttachment).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/attachments`)
    })

    it('shows an error when it fails to delete the attachment', async () => {
      const mockOrder = getMockOrder()
      req = createMockRequest({ body: { action: 'continue' }, order: mockOrder, flash: jest.fn() })
      mockAttachmentService.deleteAttachment.mockResolvedValue({ ok: false, error: 'mock error message' })
      req.params.fileType = 'licence'
      await controller.deleteFile(req, res, next)

      expect(mockAttachmentService.deleteAttachment).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        orderId: mockOrder.id,
        fileType: 'LICENCE',
      })
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/attachments`)
      expect(req.flash).toHaveBeenNthCalledWith(1, 'attachmentDeletionErrors', 'mock error message')
    })
  })
})
