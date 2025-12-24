import { Request, RequestHandler, Response } from 'express'
import { FileRequiredFormData, FileRequiredFormDataModel } from '../fileRequiredFormModel'
import AttachmentService from '../../../services/attachmentService'
import { ValidationResult, isValidationResult } from '../../../models/Validation'
import paths from '../../../constants/paths'
import TaskListService, { PAGES } from '../../../services/taskListService'
import contructModel from './viewModel'
import AttachmentType from '../../../models/AttachmentType'

export default class HaveGrantOfBailController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const formData = req.flash('formData') as unknown as FileRequiredFormData[]
    const model = contructModel(req.order!, errors as never, formData[0] as never, res)
    res.render('pages/order/attachments/file-required', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = FileRequiredFormDataModel.parse(req.body)

    const result = await this.attachmentService.updateFileRequired({
      accessToken: res.locals.user.token,
      orderId: order.id,
      fileType: AttachmentType.GRANT_OF_BAIL,
      data: formData,
    })
    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)
      res.redirect(paths.ATTACHMENT.HAVE_GRANT_OF_BAIL.replace(':orderId', order.id))
    } else if (formData.action === 'back') {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    } else {
      if (!order.orderParameters) {
        order.orderParameters = {}
      }
      order.orderParameters.haveCourtOrder = formData.fileRequired === 'yes'
      const nextPage = this.taskListService.getNextPage(PAGES.haveGrantOfBail, order)
      res.redirect(nextPage)
    }
  }
}
