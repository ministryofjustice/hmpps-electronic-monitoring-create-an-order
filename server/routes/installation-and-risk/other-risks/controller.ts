import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { isValidationResult, ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import DetailsOfInstallationService from '../details-of-installation/service'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import OtherRisksFormModel, { OtherRisksFormValidator } from './formModel'
import OtherRisksViewModel from './viewModel'

export default class OtherRisksController {
  constructor(
    private readonly riskAtInstallationStoreService: RiskAtInstallationStoreService,
    private readonly detailsOfInstallationService: DetailsOfInstallationService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { hasOtherRisks, riskDetails } = await this.riskAtInstallationStoreService.getRiskAtInstallation(req.order!)
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
      req.flash('validationErrors', convertZodErrorToValidationError(validation.error))
      res.redirect(otherRisksPath)
      return
    }

    const { hasOtherRisks, riskDetails } = validation.data
    await this.riskAtInstallationStoreService.updateField(order, 'hasOtherRisks', hasOtherRisks)
    await this.riskAtInstallationStoreService.updateField(
      order,
      'riskDetails',
      hasOtherRisks === 'YES' ? riskDetails : '',
    )

    const saved = await this.riskAtInstallationStoreService.getRiskAtInstallation(order)

    const result = await this.detailsOfInstallationService.updateDetailsOfInstallation({
      accessToken: res.locals.user.token,
      orderId: order.id,
      data: {
        possibleRisk: saved.possibleRisk,
        riskCategory: saved.riskCategory,
        riskDetails: saved.riskDetails,
        genderRiskDetails: saved.genderRiskDetails,
      },
    })

    if (isValidationResult(result)) {
      req.flash('validationErrors', result)
      res.redirect(otherRisksPath)
    } else {
      res.redirect(this.taskListService.getNextPage('DETAILS_OF_INSTALLATION', order))
    }
  }
}
