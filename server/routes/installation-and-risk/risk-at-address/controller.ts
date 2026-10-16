import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import RiskAtAddressFormModel, { RiskAtAddressFormValidator } from './formModel'
import RiskAtAddressViewModel from './viewModel'

export default class RiskAtAddressController {
  constructor(private readonly riskAtInstallationStoreService: RiskAtInstallationStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { riskCategory } = await this.riskAtInstallationStoreService.getRiskAtInstallation(req.order!)
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render(
      'pages/order/installation-and-risk/risk-at-address',
      RiskAtAddressViewModel.construct(
        riskCategory,
        res.locals.content!.reference.riskCategories,
        !res.locals.isOrderEditable,
        errors,
      ),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { riskCategory } = RiskAtAddressFormModel.parse(req.body)

    const validation = RiskAtAddressFormValidator.safeParse({ riskCategory })
    if (!validation.success) {
      req.flash('validationErrors', convertZodErrorToValidationError(validation.error))
      res.redirect(paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', order.id))
      return
    }

    await this.riskAtInstallationStoreService.updateField(order, 'riskCategory', riskCategory)

    res.redirect(paths.INSTALLATION_AND_RISK.OTHER_RISKS.replace(':orderId', order.id))
  }
}
