import { Request, RequestHandler, Response } from 'express'
import AttachmentService from '../service'
import { ValidationResult, isValidationResult } from '../../../models/Validation'
import paths from '../../../constants/paths'
import TaskListService, { PAGES } from '../../../services/taskListService'
import AttachmentType from '../../../models/AttachmentType'
import { convertZodErrorToValidationError } from '../../../utils/validation/errors'
import NewDocumentFormModel, { NewDocumentFormData, NewDocumentFormValidator } from './formModel'
import constructModel from './viewModel'

export default class NewDocumentController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const formData = req.flash('formData') as unknown as NewDocumentFormData[]
    const model = constructModel(req.order!, errors, formData[0], res)
    res.render('pages/order/attachments/file-required', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = NewDocumentFormModel.parse(req.body)

    const validationResult = NewDocumentFormValidator.safeParse(formData)
    if (!validationResult.success) {
      this.redirectWithErrors(req, res, formData, convertZodErrorToValidationError(validationResult.error))
      return
    }

    const { fileRequired } = validationResult.data
    const result = await this.attachmentService.updateFileRequired({
      accessToken: res.locals.user.token,
      orderId: order.id,
      data: { fileRequired, fileType: AttachmentType.LICENCE },
    })
    if (isValidationResult(result)) {
      this.redirectWithErrors(req, res, formData, result)
      return
    }

    if (formData.action === 'back') {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
      return
    }

    order.orderParameters = { ...order.orderParameters, haveLicence: fileRequired === 'yes' }
    res.redirect(this.taskListService.getNextPage(PAGES.newDocument, order))
  }

  private redirectWithErrors(req: Request, res: Response, formData: NewDocumentFormData, errors: ValidationResult) {
    req.flash('formData', formData)
    req.flash('validationErrors', errors)
    res.redirect(paths.ATTACHMENT.NEW_DOCUMENT.replace(':orderId', req.order!.id))
  }
}
