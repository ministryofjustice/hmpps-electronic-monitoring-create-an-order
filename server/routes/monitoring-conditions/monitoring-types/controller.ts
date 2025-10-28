import { RequestHandler, Request, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import paths from '../../../constants/paths'
import MonitoringTypesFormDataModel from './formModel'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import { MonitoringConditionsUpdateService } from '../../../services'
import TaskListService from '../../../services/taskListService'

export default class MonitoringTypesController {
  constructor(
    private readonly store: MonitoringConditionsStoreService,
    private readonly monitoringConditionsService: MonitoringConditionsUpdateService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const data = await this.store.getMonitoringConditions(order)

    const model = constructModel(data, errors, order)
    res.render('pages/order/monitoring-conditions/order-type-description/monitoring-types', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const formData = MonitoringTypesFormDataModel.parse(req.body)

    const { action, ...monitoringTypeValues } = formData
    if (Object.values(monitoringTypeValues).every(item => item === false)) {
      req.flash('validationErrors', [
        { error: validationErrors.monitoringConditions.monitoringTypeRequired, field: 'monitoringTypes' },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPES.replace(':orderId', order.id))
      return
    }

    await this.store.updateMonitoringType(order, monitoringTypeValues)

    const data = await this.store.getMonitoringConditions(order)
    const updateMonitoringConditionsResult = await this.monitoringConditionsService.updateMonitoringConditions({
      data,
      accessToken: res.locals.user.token,
      orderId: order.id,
    })
    res.redirect(
      this.taskListService.getNextPage('MONITORING_CONDITIONS', {
        ...req.order!,
        monitoringConditions: updateMonitoringConditionsResult,
      }),
    )
  }
}
