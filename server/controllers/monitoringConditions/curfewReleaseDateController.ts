import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import CurfewReleaseDateService from '../../services/curfewReleaseDateService'
import CurfewReleaseDateFormDataModel from '../../models/form-data/curfewReleaseDate'
import curfewReleaseDateViewModel from '../../models/view-models/curfewReleaseDate'
import TaskListService from '../../services/taskListService'
import FeatureFlags from '../../utils/featureFlags'

export default class CurfewReleaseDateController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewReleaseDateService: CurfewReleaseDateService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { curfewReleaseDateConditions: model, addresses } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = curfewReleaseDateViewModel.construct(model, addresses, errors as never, formData as never)

    res.render(`pages/order/monitoring-conditions/curfew-release-date`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = CurfewReleaseDateFormDataModel.parse(req.body)

    const updateResult = await this.curfewReleaseDateService.update({
      accessToken: res.locals.user.token,
      order,
      data: formData,
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', [formData])
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id))
      return
    }

    if (formData.action === 'continue') {
      if (FeatureFlags.getInstance().get('LIST_MONITORING_CONDITION_FLOW_ENABLED')) {
        res.redirect(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id))
        return
      }

      res.redirect(this.taskListService.getNextPage('CURFEW_RELEASE_DATE', req.order!))
      return
    }

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
  }
}
