import { Request, RequestHandler, Response } from 'express'
import { AttachmentService, AuditService, OrderService } from '../../services'
import AttachmentType from '../../models/AttachmentType'
import paths from '../../constants/paths'
import TaskListService from '../../services/taskListService'
import { createAnswer } from '../../utils/checkYourAnswers'
import { Attachment } from '../../models/Attachment'
import { formatDateTime } from '../../utils/utils'
import { Order } from '../../models/Order'

export default class AttachmentsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
    private readonly attachmentService: AttachmentService,
    private readonly taskListService: TaskListService,
  ) {}

  uploadFile: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, fileType } = req.params
    const attachment = req.file as Express.Multer.File
    if (attachment === undefined && fileType.toUpperCase() === AttachmentType.PHOTO_ID) {
      res.redirect(this.taskListService.getNextPage('PHOTO_ATTACHMENT', req.order!))
      return
    }
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
    const licence = order.additionalDocuments.find(doc => doc.fileType === AttachmentType.LICENCE)
    const photo = order.additionalDocuments.find(doc => doc.fileType === AttachmentType.PHOTO_ID)
    const error = req.flash('attachmentDeletionErrors')

    const answers = [
      this.createAttachmentAnswer(
        licence,
        res.locals.content?.pages.uploadLicense.questions.file.text || '',
        paths.ATTACHMENT.FILE_VIEW.replace(':fileType(photo_Id|licence)', 'licence').replace(':orderId', order.id),
        order,
      ),
      this.createAttachmentAnswer(
        photo,
        res.locals.content?.pages.uploadPhotoId.questions.file.text || '',
        paths.ATTACHMENT.FILE_VIEW.replace(':fileType(photo_Id|licence)', 'photo_Id').replace(':orderId', order.id),
        order,
      ),
    ]

    res.render(`pages/order/attachments/view`, {
      answers,
      error: error && error.length > 0 ? error[0] : undefined,
      submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
    })
  }

  private createAttachmentAnswer(attachment: Attachment | undefined, text: string, uri: string, order: Order) {
    return createAnswer(text, this.createFileNameLink(attachment, order.id), uri, {
      valueType: 'html',
      ignoreActions: order.status === 'SUBMITTED',
    })
  }

  private createFileNameLink(attachment: Attachment | undefined, orderId: string) {
    if (!attachment) {
      return ''
    }
    const { fileName, fileType } = attachment
    const fileTypeString = fileType === AttachmentType.LICENCE ? 'licence' : 'photo_Id'
    return `<a href="/order/${orderId}/attachments/${fileTypeString}/${fileName}" class="govuk-link">${fileName}</a>`
  }
}
