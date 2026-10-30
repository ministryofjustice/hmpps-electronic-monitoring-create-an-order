import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'
import { convertZodErrorToValidationError } from '../../../utils/validation/errors'
import {
  NO_RESPONSIBLE_ADULT_REQUIRED,
  shouldAskResponsibleAdultQuestion,
} from '../../../utils/order/responsibleAdultQuestion'
import { convertBooleanToEnum } from '../../../utils/values'
import continueDeviceWearer from '../continueDeviceWearer'
import DeviceWearerAnswersService from '../deviceWearerAnswersService'
import { firstUnansweredPage } from '../deviceWearerPages'
import AdultAtInstallationFormModel, {
  AdultAtInstallationFormInput,
  AdultAtInstallationFormValidator,
} from './formModel'
import AdultAtInstallationViewModel from './viewModel'

export default class AdultAtInstallationController {
  constructor(
    private readonly deviceWearerAnswersService: DeviceWearerAnswersService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const disabled = !res.locals.isOrderEditable
    // Orders that cannot be edited show what was submitted, not unsubmitted answers
    const getSaved = async () =>
      disabled ? order.deviceWearer : this.deviceWearerAnswersService.getDeviceWearer(order)

    if (!shouldAskResponsibleAdultQuestion(order)) {
      // Not submitted here, so a GET has no side effects
      // Route as if already submitted, which always sends "no responsible adult required" for these orders
      const submittedOrder = { ...order, deviceWearer: { ...order.deviceWearer, ...NO_RESPONSIBLE_ADULT_REQUIRED } }
      res.redirect(
        firstUnansweredPage(await getSaved(), order) ??
          this.taskListService.getNextPage('DEVICE_WEARER', submittedOrder),
      )
      return
    }

    const [submitted] = req.flash('formData') as unknown as AdultAtInstallationFormInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const adultAtTimeOfInstallation =
      submitted?.adultAtTimeOfInstallation ??
      convertBooleanToEnum((await getSaved()).adultAtTimeOfInstallation, '', 'true', 'false')

    res.render(
      'pages/order/about-the-device-wearer/adult-at-installation',
      AdultAtInstallationViewModel.construct(adultAtTimeOfInstallation, disabled, errors),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    // Checked first, so orders that cannot be edited are never saved or submitted
    if (!res.locals.isOrderEditable) {
      res.redirect(res.locals.orderSummaryUri ?? paths.ORDER.SUMMARY.replace(':orderId', order.id))
      return
    }

    const currentPath = paths.ABOUT_THE_DEVICE_WEARER.ADULT_AT_INSTALLATION.replace(':orderId', order.id)

    if (!shouldAskResponsibleAdultQuestion(order)) {
      await continueDeviceWearer(req, res, this.deviceWearerAnswersService, this.taskListService, currentPath)
      return
    }

    const formData = AdultAtInstallationFormModel.parse(req.body)

    const validation = AdultAtInstallationFormValidator.safeParse(formData)
    if (!validation.success) {
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(validation.error))
      res.redirect(currentPath)
      return
    }

    await this.deviceWearerAnswersService.saveAdultAtInstallation(order, validation.data)

    await continueDeviceWearer(req, res, this.deviceWearerAnswersService, this.taskListService, currentPath)
  }
}
