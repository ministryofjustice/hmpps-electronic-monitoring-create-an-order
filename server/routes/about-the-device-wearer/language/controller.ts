import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'
import { convertZodErrorToValidationError } from '../../../utils/validation/errors'
import continueDeviceWearer from '../continueDeviceWearer'
import DeviceWearerAnswersService from '../deviceWearerAnswersService'
import LanguageFormModel, { LanguageFormInput, LanguageFormValidator } from './formModel'
import LanguageViewModel from './viewModel'

export default class LanguageController {
  constructor(
    private readonly deviceWearerAnswersService: DeviceWearerAnswersService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const [submitted] = req.flash('formData') as unknown as LanguageFormInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const disabled = !res.locals.isOrderEditable
    // Orders that cannot be edited show what was submitted, not unsubmitted answers
    const answers =
      submitted ?? (disabled ? order.deviceWearer : await this.deviceWearerAnswersService.getDeviceWearer(order))

    res.render(
      'pages/order/about-the-device-wearer/language',
      LanguageViewModel.construct(answers, res.locals.content!.pages.deviceWearer.languagePage, disabled, errors),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    if (!res.locals.isOrderEditable) {
      res.redirect(res.locals.orderSummaryUri ?? paths.ORDER.SUMMARY.replace(':orderId', order.id))
      return
    }

    const currentPath = paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', order.id)
    const formData = LanguageFormModel.parse(req.body)

    const validation = LanguageFormValidator.safeParse(formData)
    if (!validation.success) {
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(validation.error))
      res.redirect(currentPath)
      return
    }

    await this.deviceWearerAnswersService.saveLanguage(order, validation.data)

    await continueDeviceWearer(req, res, this.deviceWearerAnswersService, this.taskListService, currentPath)
  }
}
