import { Request, RequestHandler, Response } from 'express'
import AttachmentService from '../service'
import { ValidationResult, isValidationResult } from '../../../models/Validation'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'
import TaskListService, { PAGES } from '../../../services/taskListService'
import AttachmentType from '../../../models/AttachmentType'
import { FileRequiredFormData, FileRequiredFormDataModel } from '../fileRequiredFormModel'
import constructModel from './viewModel'

export default class NewDocumentController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const formData = req.flash('formData') as unknown as FileRequiredFormData[]
    const model = constructModel(req.order!, errors, formData[0], res)
    res.render('pages/order/attachments/file-required', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = { ...FileRequiredFormDataModel.parse(req.body), fileType: AttachmentType.LICENCE }

    const result = await this.attachmentService.updateFileRequired({
      accessToken: res.locals.user.token,
      orderId: order.id,
      data: formData,
      requiredMessage: validationErrors.attachments.newDocumentRequired,
    })
    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)
      res.redirect(paths.ATTACHMENT.NEW_DOCUMENT.replace(':orderId', order.id))
      return
    }

    if (formData.action === 'back') {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
      return
    }

    order.orderParameters = { ...order.orderParameters, haveLicence: formData.fileRequired === 'yes' }
    res.redirect(this.taskListService.getNextPage(PAGES.newDocument, order))
  }
}
