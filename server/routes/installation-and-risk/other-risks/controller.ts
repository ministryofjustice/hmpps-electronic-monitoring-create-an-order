import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { isValidationResult, ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'
import { createGovukErrorSummary } from '../../../utils/errors'
import DetailsOfInstallationService from '../details-of-installation/service'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'

export default class OtherRisksController {
  constructor(
    private readonly riskAtInstallationStoreService: RiskAtInstallationStoreService,
    private readonly detailsOfInstallationService: DetailsOfInstallationService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render('pages/WIP', {
      pageName: 'Other risks',
      errorSummary: createGovukErrorSummary(errors),
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const riskAtInstallation = await this.riskAtInstallationStoreService.getRiskAtInstallation(order)

    const result = await this.detailsOfInstallationService.updateDetailsOfInstallation({
      accessToken: res.locals.user.token,
      orderId: order.id,
      data: riskAtInstallation,
    })

    if (isValidationResult(result)) {
      req.flash('validationErrors', result)
      res.redirect(paths.INSTALLATION_AND_RISK.OTHER_RISKS.replace(':orderId', order.id))
    } else {
      res.redirect(this.taskListService.getNextPage('DETAILS_OF_INSTALLATION', order))
    }
  }
}
