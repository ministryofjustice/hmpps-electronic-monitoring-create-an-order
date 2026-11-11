import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import { convertZodErrorToValidationError } from '../../../utils/validation/errors'
import CheckRiskFormModel, { CheckRiskFormValidator, CheckRiskInput } from './formModel'
import CheckRiskViewModel from './viewModel'
import RiskAtInstallationService from '../riskAtInstallationService'

export default class CheckRiskController {
  constructor(private readonly riskAtInstallationService: RiskAtInstallationService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const [submitted] = req.flash('formData') as unknown as CheckRiskInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render(
      'pages/order/installation-and-risk/check-risk',
      CheckRiskViewModel.construct(req.order!, errors, submitted?.checkRisk),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = CheckRiskFormModel.parse(req.body)

    const validation = CheckRiskFormValidator.safeParse(formData)
    if (!validation.success) {
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(validation.error))
      res.redirect(paths.INSTALLATION_AND_RISK.CHECK_RISK.replace(':orderId', order.id))
      return
    }

    await this.riskAtInstallationService.saveRiskCheck(order, { riskCheck: validation.data.checkRisk })

    const nextPath =
      validation.data.checkRisk === 'YES'
        ? paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR
        : paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS

    res.redirect(nextPath.replace(':orderId', order.id))
  }
}
