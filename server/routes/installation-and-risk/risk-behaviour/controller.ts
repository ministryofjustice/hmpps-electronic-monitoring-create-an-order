import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import RiskAtInstallationService from '../riskAtInstallationService'
import RiskBehaviourFormModel, { RiskBehaviourFormValidator } from './formModel'
import RiskBehaviourViewModel from './viewModel'

export default class RiskBehaviourController {
  constructor(private readonly riskAtInstallationService: RiskAtInstallationService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { possibleRisk, genderRiskDetails } = await this.riskAtInstallationService.getRiskAtInstallation(req.order!)
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render(
      'pages/order/installation-and-risk/risk-behaviour',
      RiskBehaviourViewModel.construct(
        possibleRisk,
        genderRiskDetails,
        res.locals.content!.reference.possibleRisks,
        !res.locals.isOrderEditable,
        errors,
      ),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const riskBehaviourPath = paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR.replace(':orderId', order.id)
    const formData = RiskBehaviourFormModel.parse(req.body)

    const validation = RiskBehaviourFormValidator.safeParse(formData)
    if (!validation.success) {
      req.flash('validationErrors', convertZodErrorToValidationError(validation.error))
      res.redirect(riskBehaviourPath)
      return
    }

    await this.riskAtInstallationService.saveRiskBehaviour(order, validation.data)

    res.redirect(paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', order.id))
  }
}
