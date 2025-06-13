import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import CurfewAdditionalDetailsService from '../../services/curfewAdditionalDetailsService'
import CurfewAdditionalDetailsViewModel from '../../models/view-models/curfewAdditionalDetails'
import TaskListService from '../../services/taskListService'
import { CurfewAdditionalDetailsFormDataModel } from '../../models/form-data/curfewAdditionalDetails'

export default class CurfewAdditionalDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewAdditionalDetailsService: CurfewAdditionalDetailsService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { curfewConditions: model } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = CurfewAdditionalDetailsViewModel.construct(model, formData as never, errors as never)

    res.render(`pages/order/monitoring-conditions/curfew-additional-details`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = CurfewAdditionalDetailsFormDataModel.parse(req.body)

    const updateResult = await this.curfewAdditionalDetailsService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_ADDITIONAL_DETAILS.replace(':orderId', orderId))
      return
    }

    if (formData.action === 'continue') {
      res.redirect(this.taskListService.getNextPage('CURFEW_ADDITIONAL_DETAILS', req.order!))
      return
    }

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
