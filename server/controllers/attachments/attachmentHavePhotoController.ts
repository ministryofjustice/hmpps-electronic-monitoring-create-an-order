import { Request, RequestHandler, Response } from 'express'
import { AttachmentService, OrderService } from '../../services'
import { isValidationResult } from '../../models/Validation'
import paths from '../../constants/paths'

import { HavePhotoFormDataModel, HavePhotoModelService } from '../../models/view-models/havePhoto'
import TaskListService from '../../services/taskListService'

export default class AttachmentHavePhotoController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly taskListService: TaskListService,
    private readonly orderService: OrderService,
    private readonly modelService: HavePhotoModelService = new HavePhotoModelService(),
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const model = this.modelService.buildHavePhotoModel(req)
    res.render('pages/order/attachments/have-photo', model)
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
      res.redirect(paths.ATTACHMENT.HAVE_PHOTO.replace(':orderId', orderId))
    } else if (formData.action === 'back') {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    } else {
      // get updated order so we can check if we want to show the photo upload page or not
      const order = await this.orderService.getOrder({ accessToken: res.locals.user.token, orderId })
      const nextPage = this.taskListService.getNextPage('ATTACHMENTS_HAVE_PHOTO', order)
      res.redirect(nextPage)
    }
  }
}
