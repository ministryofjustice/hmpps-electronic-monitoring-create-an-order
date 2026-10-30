import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'
import { convertZodErrorToValidationError } from '../../../utils/validation/errors'
import continueDeviceWearer from '../continueDeviceWearer'
import DeviceWearerAnswersService from '../deviceWearerAnswersService'
import {
  DeviceWearerDetailsFormData,
  DeviceWearerDetailsFormDataParser,
  DeviceWearerDetailsFormDataValidator,
} from './formModel'
import viewModel from './viewModel'

export default class DeviceWearerDetailsController {
  constructor(
    private readonly deviceWearerAnswersService: DeviceWearerAnswersService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const formData = req.flash('formData') as unknown as DeviceWearerDetailsFormData[]

    // Orders that can no longer be edited show what was sent, not any unsent answers from this journey
    const answers = res.locals.isOrderEditable
      ? await this.deviceWearerAnswersService.getDeviceWearer(order)
      : order.deviceWearer

    res.render(
      'pages/order/about-the-device-wearer/device-wearer-details',
      viewModel.construct(answers, formData[0], errors),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    if (!res.locals.isOrderEditable) {
      res.redirect(res.locals.orderSummaryUri ?? paths.ORDER.SUMMARY.replace(':orderId', order.id))
      return
    }

    const currentPath = paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS.replace(':orderId', order.id)
    const formData = DeviceWearerDetailsFormDataParser.parse(req.body)

    const result = DeviceWearerDetailsFormDataValidator.safeParse(formData)
    if (!result.success) {
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(result.error))
      res.redirect(currentPath)
      return
    }

    await this.deviceWearerAnswersService.saveDeviceWearerDetails(order, result.data)

    await continueDeviceWearer(req, res, this.deviceWearerAnswersService, this.taskListService, currentPath)
  }
}
