import { Request, RequestHandler, Response } from 'express'
import { AttachmentService } from '../../services'
import { isValidationResult } from '../../models/Validation'
import paths from '../../constants/paths'
import { HavePhotoFormDataModel, HavePhotoModelService } from '../../models/view-models/havePhoto'

export default class AttachmentPhotoQuestionController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly modelService: HavePhotoModelService = new HavePhotoModelService(),
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const model = this.modelService.buildHavePhotoModel(req)
    res.render('pages/order/attachments/photo-question', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = HavePhotoFormDataModel.parse(req.body)

    const result = await this.attachmentService.havePhoto({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })
    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)
      res.redirect(paths.ATTACHMENT.PHOTO_QUESTION.replace(':orderId', orderId))
    }
  }
}
