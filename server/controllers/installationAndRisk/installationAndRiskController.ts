// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { InstallationAndRisk } from '../../models/InstallationAndRisk'
import { ValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import InstallationAndRiskService from '../../services/installationAndRiskService'

const installationAndRiskFormDataModel = z.object({
  action: z.string().default('continue'),
})

type InstallationAndRiskFormData = z.infer<typeof installationAndRiskFormDataModel>

type InstallationAndRiskViewModel = NonNullable<unknown>

export default class InstallationAndRiskController {
  constructor(
    private readonly auditService: AuditService,
    private readonly deviceWearerService: InstallationAndRiskService,
  ) {}

  private constructViewModel(
    installationAndRisk: InstallationAndRisk,
    validationErrors: ValidationResult,
    formData: [InstallationAndRiskFormData],
    formAction: string,
  ): InstallationAndRiskViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors, formAction)
    }

    return this.createViewModelFromInstallationAndRisk(installationAndRisk, formAction)
  }

  private createViewModelFromInstallationAndRisk(
    installationAndRisk: InstallationAndRisk,
    orderId: string,
  ): InstallationAndRiskViewModel {
    return {}
  }

  private createViewModelFromFormData(
    formData: InstallationAndRiskFormData,
    validationErrors: ValidationResult,
    orderId: string,
  ): InstallationAndRiskViewModel {
    return {}
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearer } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(deviceWearer, errors as never, formData as never, orderId)

    res.render(`pages/order/installation-and-risk/index`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = installationAndRiskFormDataModel.parse(req.body)

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
