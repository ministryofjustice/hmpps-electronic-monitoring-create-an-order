import { Request, RequestHandler, Response } from 'express'
import { AttachmentService, AuditService, OrderService } from '../../services'
import AttachmentType from '../../models/AttachmentType'
import paths from '../../constants/paths'

export default class AttachmentsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
    private readonly attachmentService: AttachmentService,
  ) {}

  licence: RequestHandler = async (req: Request, res: Response) => {
    await this.uploadView(req, res, 'licence')
  }

  async uploadView(req: Request, res: Response, fileType: string) {
    const order = req.order!
    if (order.status === 'SUBMITTED') {
      res.redirect(`/order/${order.id}/attachments`)
    } else {
      res.render(`pages/order/attachments/edit`, { orderId: order.id, fileType })
    }
  }

  async upload(req: Request, res: Response, fileType: AttachmentType) {
    const { orderId } = req.params

    const attachment = req.file as Express.Multer.File
    const error = await this.attachmentService.uploadAttachment({
      accessToken: res.locals.user.token,
      orderId,
      fileType,
      file: attachment,
    })

    if (error.userMessage != null) {
      res.render(`pages/order/attachments/edit`, {
        orderId,
        fileType: fileType.toLocaleLowerCase(),
        error: { text: error.userMessage },
      })
    } else {
      res.redirect(`/order/${orderId}/attachments`)
    }
    this.auditService.logAuditEvent({
      who: res.locals.user.username,
      correlationId: orderId,
      what: `Upload new attachment : ${attachment.filename}`,
    })
  }

  async download(req: Request, res: Response, fileType: AttachmentType) {
    const { orderId, filename } = req.params
    await this.attachmentService
      .downloadAttachment({ accessToken: res.locals.user.token, orderId, fileType })
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

  async confirmDeleteView(req: Request, res: Response, fileType: string) {
    const order = req.order!

    res.render('pages/order/attachments/delete-confirm', { orderId: order.id, fileType })
  }

  async delete(req: Request, res: Response, fileType: AttachmentType) {
    const order = req.order!
    const { action } = req.body

    if (action === 'continue') {
      const result = await this.attachmentService.deleteAttachment({
        orderId: order.id,
        accessToken: res.locals.user.token,
        fileType,
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

  deleteLicence: RequestHandler = async (req: Request, res: Response) => {
    await this.delete(req, res, AttachmentType.LICENCE)
  }

  deletePhotoId: RequestHandler = async (req: Request, res: Response) => {
    await this.delete(req, res, AttachmentType.PHOTO_ID)
  }

  confirmDeleteLicence: RequestHandler = async (req: Request, res: Response) => {
    await this.confirmDeleteView(req, res, 'licence')
  }

  confirmDeletePhotoId: RequestHandler = async (req: Request, res: Response) => {
    await this.confirmDeleteView(req, res, 'photo id')
  }

  downloadLicence: RequestHandler = async (req: Request, res: Response) => {
    await this.download(req, res, AttachmentType.LICENCE)
  }

  uploadLicence: RequestHandler = async (req: Request, res: Response) => {
    await this.upload(req, res, AttachmentType.LICENCE)
  }

  photo: RequestHandler = async (req: Request, res: Response) => {
    await this.uploadView(req, res, 'photo id')
  }

  uploadPhoto: RequestHandler = async (req: Request, res: Response) => {
    await this.upload(req, res, AttachmentType.PHOTO_ID)
  }

  downloadPhoto: RequestHandler = async (req: Request, res: Response) => {
    await this.download(req, res, AttachmentType.PHOTO_ID)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const licence = order.additionalDocuments.find(doc => doc.fileType === AttachmentType.LICENCE)
    const photo = order.additionalDocuments.find(doc => doc.fileType === AttachmentType.PHOTO_ID)
    const error = req.flash('attachmentDeletionErrors')

    res.render(`pages/order/attachments/view`, {
      order: { id: order.id, status: order.status },
      licenceFileName: licence?.fileName,
      photoFileName: photo?.fileName,
      error: error && error.length > 0 ? error[0] : undefined,
    })
  }
}
