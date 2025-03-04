import { Request, RequestHandler, Response } from 'express'
import { AuditService } from '../../services'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import DeviceWearerResponsibleAdultService from '../../services/deviceWearerResponsibleAdultService'
import TaskListService from '../../services/taskListService'
import DeviceWearerResponsibleAdultFormDataModel from '../../models/form-data/responsibleAdult'
import responsibleAdultViewModel from '../../models/view-models/responsibleAdult'

export default class DeviceWearerResponsibleAdultController {
  constructor(
    private readonly auditService: AuditService,
    private readonly deviceWearerResponsibleAdultService: DeviceWearerResponsibleAdultService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { deviceWearerResponsibleAdult } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = responsibleAdultViewModel.construct(
      deviceWearerResponsibleAdult,
      formData[0] as never,
      errors as never,
    )

    res.render(`pages/order/about-the-device-wearer/responsible-adult-details`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = DeviceWearerResponsibleAdultFormDataModel.parse(req.body)

    const updateDeviceWearerResult = await this.deviceWearerResponsibleAdultService.updateDeviceWearerResponsibleAdult({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(updateDeviceWearerResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateDeviceWearerResult)

      res.redirect(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', orderId))
    } else if (action === 'continue') {
      res.redirect(this.taskListService.getNextPage('RESPONSIBLE_ADULT', req.order!))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
