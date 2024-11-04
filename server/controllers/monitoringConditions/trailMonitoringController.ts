import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import TrailMonitoringService from '../../services/trailMonitoringService'
import trailMonitoringViewModel from '../../models/view-models/trailMonitoring'
import TrailMonitoringFormDataModel from '../../models/form-data/trailMonitoring'
import TaskListService from '../../services/taskListService'

export default class TrailMonitoringController {
  constructor(
    private readonly auditService: AuditService,
    private readonly trailMonitoringService: TrailMonitoringService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { monitoringConditionsTrail, monitoringConditions } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = trailMonitoringViewModel.construct(
      monitoringConditionsTrail ?? {
        startDate: null,
        endDate: null,
      },
      errors as never,
      formData as never,
    )

    if (!monitoringConditions.trail) {
      res.redirect(paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', orderId))
    } else {
      res.render(`pages/order/monitoring-conditions/trail-monitoring`, viewModel)
    }
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = TrailMonitoringFormDataModel.parse(req.body)

    const updateMonitoringConditionsResult = await this.trailMonitoringService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(updateMonitoringConditionsResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateMonitoringConditionsResult)

      res.redirect(paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      res.redirect(this.taskListService.getNextPage('TRAIL', req.order!))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
