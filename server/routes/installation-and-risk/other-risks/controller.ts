import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { isValidationResult, ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import RiskAtInstallationService from '../riskAtInstallationService'
import OtherRisksFormModel, { OtherRisksFormInput, OtherRisksFormValidator } from './formModel'
import OtherRisksViewModel from './viewModel'

export default class OtherRisksController {
  constructor(
    private readonly riskAtInstallationService: RiskAtInstallationService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const [submitted] = req.flash('formData') as unknown as OtherRisksFormInput[]
    const { hasOtherRisks, riskDetails } =
      submitted ?? (await this.riskAtInstallationService.getRiskAtInstallation(req.order!))
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render(
      'pages/order/installation-and-risk/other-risks',
      OtherRisksViewModel.construct(hasOtherRisks, riskDetails, !res.locals.isOrderEditable, errors),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const otherRisksPath = paths.INSTALLATION_AND_RISK.OTHER_RISKS.replace(':orderId', order.id)
    const formData = OtherRisksFormModel.parse(req.body)

    const validation = OtherRisksFormValidator.safeParse(formData)
    if (!validation.success) {
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(validation.error))
      res.redirect(otherRisksPath)
      return
    }

    await this.riskAtInstallationService.saveOtherRisks(order, validation.data)
    const result = await this.riskAtInstallationService.submit({ accessToken: res.locals.user.token, order })

    if (isValidationResult(result)) {
      req.flash('validationErrors', result)
      res.redirect(otherRisksPath)
    } else {
      res.redirect(this.taskListService.getNextPage('DETAILS_OF_INSTALLATION', order))
    }
  }
}
