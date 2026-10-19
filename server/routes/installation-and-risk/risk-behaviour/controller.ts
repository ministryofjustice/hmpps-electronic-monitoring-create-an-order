import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import { RISK_TO_GENDER } from '../riskCodes'
import RiskBehaviourFormModel, { RiskBehaviourFormValidator } from './formModel'
import RiskBehaviourViewModel from './viewModel'

export default class RiskBehaviourController {
  constructor(private readonly riskAtInstallationStoreService: RiskAtInstallationStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { possibleRisk, genderRiskDetails } = await this.riskAtInstallationStoreService.getRiskAtInstallation(
      req.order!,
    )
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
    const formData = RiskBehaviourFormModel.parse(req.body)

    const validation = RiskBehaviourFormValidator.safeParse(formData)
    if (!validation.success) {
      req.flash('validationErrors', convertZodErrorToValidationError(validation.error))
      res.redirect(paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR.replace(':orderId', order.id))
      return
    }

    const { possibleRisk, genderRiskDetails } = validation.data
    await this.riskAtInstallationStoreService.updateField(order, 'possibleRisk', possibleRisk)
    await this.riskAtInstallationStoreService.updateField(
      order,
      'genderRiskDetails',
      possibleRisk.includes(RISK_TO_GENDER) ? genderRiskDetails : '',
    )

    res.redirect(paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', order.id))
  }
}
