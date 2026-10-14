import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import RiskBehaviourFormModel, { RiskBehaviourFormValidator } from './formModel'
import RiskBehaviourViewModel from './viewModel'

export default class RiskBehaviourController {
  constructor(private readonly riskAtInstallationStoreService: RiskAtInstallationStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { possibleRisk } = await this.riskAtInstallationStoreService.getRiskAtInstallation(req.order!)
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render(
      'pages/order/installation-and-risk/risk-behaviour',
      RiskBehaviourViewModel.construct(possibleRisk, errors),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { possibleRisk } = RiskBehaviourFormModel.parse(req.body)

    const validation = RiskBehaviourFormValidator.safeParse({ possibleRisk })
    if (!validation.success) {
      req.flash('validationErrors', convertZodErrorToValidationError(validation.error))
      res.redirect(paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR.replace(':orderId', order.id))
      return
    }

    await this.riskAtInstallationStoreService.updateField(order, 'possibleRisk', possibleRisk)

    res.redirect(paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', order.id))
  }
}
