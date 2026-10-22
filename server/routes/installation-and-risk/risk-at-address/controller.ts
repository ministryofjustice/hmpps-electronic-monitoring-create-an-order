import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'
import { convertZodErrorToValidationError } from '../../../utils/validation/errors'
import continueRiskAtInstallation from '../continueRiskAtInstallation'
import RiskAtInstallationService from '../riskAtInstallationService'
import RiskAtAddressFormModel, { RiskAtAddressFormInput, RiskAtAddressFormValidator } from './formModel'
import RiskAtAddressViewModel from './viewModel'

export default class RiskAtAddressController {
  constructor(
    private readonly riskAtInstallationService: RiskAtInstallationService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const [submitted] = req.flash('formData') as unknown as RiskAtAddressFormInput[]
    const { riskCategory } = submitted ?? (await this.riskAtInstallationService.getRiskAtInstallation(req.order!))
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
    const riskAtAddressPath = paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', order.id)
    const formData = RiskAtAddressFormModel.parse(req.body)

    const validation = RiskAtAddressFormValidator.safeParse(formData)
    if (!validation.success) {
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(validation.error))
      res.redirect(riskAtAddressPath)
      return
    }

    await this.riskAtInstallationService.saveRiskAtAddress(order, validation.data)

    await continueRiskAtInstallation(req, res, this.riskAtInstallationService, this.taskListService, riskAtAddressPath)
  }
}
