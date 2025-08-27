import { Request, RequestHandler, Response } from 'express'
import { AttachmentService, AuditService, OrderService } from '../../services'
import AttachmentType from '../../models/AttachmentType'
import paths from '../../constants/paths'
import TaskListService from '../../services/taskListService'
import { formatDateTime } from '../../utils/utils'
import createViewModel from '../../models/view-models/additionalDocumentsCheckAnswers'
import OrderChecklistService from '../../services/orderChecklistService'

export default class AttachmentsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
    private readonly attachmentService: AttachmentService,
    private readonly taskListService: TaskListService,
    private readonly checklistService: OrderChecklistService,
  ) {}

  uploadFile: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, fileType } = req.params
    const attachment = req.file as Express.Multer.File

    const error = await this.attachmentService.uploadAttachment({
      accessToken: res.locals.user.token,
      orderId,
      fileType: fileType.toUpperCase(),
      file: attachment,
    })

    if (error.userMessage != null) {
      res.render(`pages/order/attachments/edit`, {
        orderId,
        fileType: fileType.toLocaleLowerCase().replace('_', ' '),
        error: { text: error.userMessage },
      })
    } else {
      const currentPage = fileType.toUpperCase() === AttachmentType.LICENCE ? 'LICENCE_ATTACHMENT' : 'PHOTO_ATTACHMENT'
      res.redirect(this.taskListService.getNextPage(currentPage, req.order!))
      this.auditService.logAuditEvent({
        who: res.locals.user.username,
        correlationId: orderId,
        what: `Upload new attachment : ${attachment.filename}`,
      })
    }
  }

  uploadFileView: RequestHandler = async (req: Request, res: Response) => {
    const { fileType } = req.params
    const order = req.order!
    if (order.status === 'SUBMITTED') {
      res.redirect(`/order/${order.id}/attachments`)
    } else {
      res.render(`pages/order/attachments/edit`, {
        orderId: order.id,
        fileType: fileType.toLocaleLowerCase().replace('_', ' '),
      })
    }
  }

  downloadFile: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, fileType, filename } = req.params
    await this.attachmentService
      .downloadAttachment({ accessToken: res.locals.user.token, orderId, fileType: fileType.toUpperCase() })
      .then(data => {
        res.attachment(filename)
        data.pipe(res)
      })
    this.auditService.logAuditEvent({
      who: res.locals.user.username,
      correlationId: orderId,
      what: `Downloaded attachment : ${filename}`,
    })
  }

  confirmDeleteView: RequestHandler = async (req: Request, res: Response) => {
    const { fileType } = req.params
    const order = req.order!

    res.render('pages/order/attachments/delete-confirm', {
      orderId: order.id,
      fileType: fileType.toLocaleLowerCase().replace('_', ' '),
    })
  }

  deleteFile: RequestHandler = async (req: Request, res: Response) => {
    const { fileType } = req.params
    const order = req.order!
    const { action } = req.body

    if (action === 'continue') {
      const result = await this.attachmentService.deleteAttachment({
        orderId: order.id,
        accessToken: res.locals.user.token,
        fileType: fileType.toUpperCase(),
      })

      if (result.ok) {
        this.auditService.logAuditEvent({
          who: res.locals.user.username,
          correlationId: order.id,
          what: `Delete attachment : ${fileType}`,
        })
      } else {
        req.flash('attachmentDeletionErrors', result.error)
      }
    }
    res.redirect(paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id))
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const error = req.flash('attachmentDeletionErrors')

    const answers = createViewModel(order, res.locals.content)
    this.checklistService.updateChecklist(`${order.id}-${order.versionId}`, 'ADDITIONAL_DOCUMENTS')
    res.render(`pages/order/attachments/view`, {
      answers,
      error: error && error.length > 0 ? error[0] : undefined,
      submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
      orderId: order.id,
    })
  }
}
