import { Request, RequestHandler, Response } from 'express'
import z from 'zod'
import paths from '../../constants/paths'
import { AuditService } from '../../services'
import DeviceWearerService from '../../services/deviceWearerService'
import { getErrorsViewModel } from '../../utils/utils'
import { isValidationResult } from '../../models/Validation'
import TaskListService from '../../services/taskListService'

const FormDataModel = z.object({
  action: z.string().default('continue'),
  noFixedAbode: z.string().default(''),
})

export default class NoFixedAbodeController {
  constructor(
    private readonly auditService: AuditService,
    private readonly deviceWearerService: DeviceWearerService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const {
      deviceWearer: { noFixedAbode },
    } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    res.render('pages/order/contact-information/no-fixed-abode', {
      noFixedAbode: String(noFixedAbode),
      ...(formData.length > 0 ? (formData[0] as never) : {}),
      errors: getErrorsViewModel(errors as never),
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = FormDataModel.parse(req.body)

    const result = await this.deviceWearerService.updateNoFixedAbode({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)
      res.redirect(paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', orderId))
    } else if (action === 'continue') {
      res.redirect(
        this.taskListService.getNextPage('NO_FIXED_ABODE', {
          ...req.order!,
          deviceWearer: {
            ...req.order!.deviceWearer,
            noFixedAbode: result.noFixedAbode,
          },
        }),
      )
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
