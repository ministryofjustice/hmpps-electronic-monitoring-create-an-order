import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import CurfewConditionsService from '../../services/curfewConditionsService'
import CurfewConditionsFormDataModel from '../../models/form-data/curfewConditions'
import CurfewConditionsViewModel from '../../models/view-models/curfewConditions'
import TaskListService from '../../services/taskListService'

export default class CurfewConditionsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewConditionsService: CurfewConditionsService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { curfewConditions: model } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = CurfewConditionsViewModel.construct(model, errors as never, formData as never)

    res.render(`pages/order/monitoring-conditions/curfew-conditions`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = CurfewConditionsFormDataModel.parse(req.body)

    const updateResult = await this.curfewConditionsService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', orderId))
    } else {
      res.redirect(this.taskListService.getNextPage('CURFEW_CONDITIONS', req.order!))
    }
  }
}
