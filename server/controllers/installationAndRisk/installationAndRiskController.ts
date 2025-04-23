import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { InstallationAndRisk } from '../../models/InstallationAndRisk'
import { isValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import InstallationAndRiskService from '../../services/installationAndRiskService'
import TaskListService from '../../services/taskListService'
import InstallationAndRiskFormDataModel, {
  InstallationAndRiskFormData,
} from '../../models/form-data/installationAndRisk'
import installationAndRiskViewModel from '../../models/view-models/installationAndRisk'

export default class InstallationAndRiskController {
  constructor(
    private readonly auditService: AuditService,
    private readonly installationAndRiskService: InstallationAndRiskService,
    private readonly taskListService: TaskListService,
  ) {}

  private createApiModelFromFormData(formData: InstallationAndRiskFormData): InstallationAndRisk {
    return {
      offence: formData.offence ?? null,
      riskCategory: formData.riskCategory ?? null,
      riskDetails: formData.riskDetails ?? null,
      mappaLevel: formData.mappaLevel ?? null,
      mappaCaseType: formData.mappaCaseType ?? null,
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { installationAndRisk } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = installationAndRiskViewModel.construct(installationAndRisk, errors as never, formData as never)

    res.render(`pages/order/installation-and-risk/index`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = InstallationAndRiskFormDataModel.parse(req.body)

    const updateResult = await this.installationAndRiskService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: this.createApiModelFromFormData(formData),
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      res.redirect(this.taskListService.getNextPage('INSTALLATION_AND_RISK', req.order!))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
