import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import CurfewReleaseDateService from '../../services/curfewReleaseDateService'
import CurfewReleaseDateFormDataModel from '../../models/form-data/curfewReleaseDate'
import curfewReleaseDateViewModel from '../../models/view-models/curfewReleaseDate'
import TaskListService from '../../services/taskListService'

export default class CurfewReleaseDateController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewReleaseDateService: CurfewReleaseDateService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { curfewReleaseDateConditions: model } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = curfewReleaseDateViewModel.construct(model, errors as never, formData as never)

    res.render(`pages/order/monitoring-conditions/curfew-release-date`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = CurfewReleaseDateFormDataModel.parse(req.body)

    const updateResult = await this.curfewReleaseDateService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', [formData])
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', orderId))
    } else {
      res.redirect(this.taskListService.getNextPage('CURFEW_RELEASE_DATE', req.order!))
    }
  }
}
