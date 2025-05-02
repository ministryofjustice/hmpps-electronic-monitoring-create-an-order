import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import MonitoringConditionsService from '../../services/monitoringConditionsService'
import TaskListService from '../../services/taskListService'
import { MonitoringConditionsFormDataParser } from '../../models/form-data/monitoringConditions'
import createViewModel from '../../models/view-models/monitoringConditions'

export default class MonitoringConditionsController {
  constructor(
    private readonly monitoringConditionsService: MonitoringConditionsService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { monitoringConditions } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    res.render(
      `pages/order/monitoring-conditions/index`,
      createViewModel(
        monitoringConditions,
        formData.length > 0 ? (formData[0] as never) : ({} as never),
        errors as never,
      ),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = MonitoringConditionsFormDataParser.parse(req.body)

    const updateMonitoringConditionsResult = await this.monitoringConditionsService.updateMonitoringConditions({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(updateMonitoringConditionsResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateMonitoringConditionsResult)
      res.redirect(paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      res.redirect(
        this.taskListService.getNextPage('MONITORING_CONDITIONS', {
          ...req.order!,
          monitoringConditions: updateMonitoringConditionsResult,
        }),
      )
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
