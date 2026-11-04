import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'
import { convertZodErrorToValidationError } from '../../../utils/validation/errors'
import continueRiskAtInstallation from '../continueRiskAtInstallation'
import RiskAtInstallationService from '../riskAtInstallationService'
import RiskBehaviourFormModel, { RiskBehaviourFormInput, RiskBehaviourFormValidator } from './formModel'
import RiskBehaviourViewModel from './viewModel'

export default class RiskBehaviourController {
  constructor(
    private readonly riskAtInstallationService: RiskAtInstallationService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const [submitted] = req.flash('formData') as unknown as RiskBehaviourFormInput[]
    const { possibleRisk, genderRiskDetails } =
      submitted ?? (await this.riskAtInstallationService.getRiskAtInstallation(req.order!))
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
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(validation.error))
      res.redirect(riskBehaviourPath)
      return
    }

    await this.riskAtInstallationService.saveRiskBehaviour(order, validation.data)

    await continueRiskAtInstallation(req, res, this.riskAtInstallationService, this.taskListService, riskBehaviourPath)
  }
}
