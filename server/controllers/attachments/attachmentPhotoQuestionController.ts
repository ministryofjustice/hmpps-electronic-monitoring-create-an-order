import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { AttachmentService } from '../../services'
import { isValidationResult } from '../../models/Validation'
import paths from '../../constants/paths'
import { getError } from '../../utils/utils'
import { createGovukErrorSummary } from '../../utils/errors'

export default class AttachmentPhotoQuestionController {
  constructor(private readonly attachmentService: AttachmentService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const model = {
      havePhoto: {
        value: (formData[0] as any)?.havePhoto || null,
        error: getError(errors as any, 'havePhoto'),
      },
      errorSummary: createGovukErrorSummary(errors as any),
    }
    res.render('pages/order/attachments/photo-question', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = HavePhotoDataModel.parse(req.body)

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

const HavePhotoDataModel = z.object({
  action: z.string(),
  havePhoto: z.enum(['yes', 'no']).optional(),
})

export type HavePhotoFormData = z.infer<typeof HavePhotoDataModel>
