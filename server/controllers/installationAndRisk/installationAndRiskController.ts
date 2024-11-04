import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { InstallationAndRisk } from '../../models/InstallationAndRisk'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { MultipleChoiceField, TextField } from '../../models/view-models/utils'
import { AuditService } from '../../services'
import InstallationAndRiskService from '../../services/installationAndRiskService'
import { getError } from '../../utils/utils'
import TaskListService from '../../services/taskListService'

const installationAndRiskFormDataModel = z.object({
  action: z.string().default('continue'),
  riskOfSeriousHarm: z.string().optional(),
  riskOfSelfHarm: z.string().optional(),
  riskCategory: z.array(z.string()).optional(),
  riskDetails: z.string(),
  mappaLevel: z.string().optional(),
  mappaCaseType: z.string().optional(),
})

type InstallationAndRiskFormData = z.infer<typeof installationAndRiskFormDataModel>

type InstallationAndRiskViewModel = {
  riskOfSeriousHarm: TextField
  riskOfSelfHarm: TextField
  riskCategory: MultipleChoiceField
  riskDetails: TextField
  mappaLevel: TextField
  mappaCaseType: TextField
}

export default class InstallationAndRiskController {
  constructor(
    private readonly auditService: AuditService,
    private readonly installationAndRiskService: InstallationAndRiskService,
    private readonly taskListService: TaskListService,
  ) {}

  private constructViewModel(
    installationAndRisk: InstallationAndRisk | null,
    validationErrors: ValidationResult,
    formData: [InstallationAndRiskFormData],
  ): InstallationAndRiskViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors)
    }

    return this.createViewModelFromInstallationAndRisk(installationAndRisk)
  }

  private createViewModelFromInstallationAndRisk(
    installationAndRisk: InstallationAndRisk | null,
  ): InstallationAndRiskViewModel {
    return {
      riskOfSeriousHarm: { value: installationAndRisk?.riskOfSeriousHarm ?? '' },
      riskOfSelfHarm: { value: installationAndRisk?.riskOfSelfHarm ?? '' },
      riskCategory: { values: installationAndRisk?.riskCategory ?? [] },
      riskDetails: { value: installationAndRisk?.riskDetails ?? '' },
      mappaLevel: { value: installationAndRisk?.mappaLevel ?? '' },
      mappaCaseType: { value: installationAndRisk?.mappaCaseType ?? '' },
    }
  }

  private createViewModelFromFormData(
    formData: InstallationAndRiskFormData,
    errors: ValidationResult,
  ): InstallationAndRiskViewModel {
    return {
      riskOfSeriousHarm: { value: formData.riskOfSeriousHarm ?? '', error: getError(errors, 'riskOfSeriousHarm') },
      riskOfSelfHarm: { value: formData.riskOfSelfHarm ?? '', error: getError(errors, 'riskOfSelfHarm') },
      riskCategory: { values: formData.riskCategory ?? [], error: getError(errors, 'riskCategory') },
      riskDetails: { value: formData.riskDetails ?? '', error: getError(errors, 'riskDetails') },
      mappaLevel: { value: formData.mappaLevel ?? '', error: getError(errors, 'mappaLevel') },
      mappaCaseType: { value: formData.mappaCaseType ?? '', error: getError(errors, 'mappaCaseType') },
    }
  }

  private createApiModelFromFormData(formData: InstallationAndRiskFormData): InstallationAndRisk {
    return {
      riskOfSeriousHarm: formData.riskOfSeriousHarm ?? null,
      riskOfSelfHarm: formData.riskOfSelfHarm ?? null,
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
    const viewModel = this.constructViewModel(installationAndRisk, errors as never, formData as never)

    res.render(`pages/order/installation-and-risk/index`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = installationAndRiskFormDataModel.parse(req.body)

    const updateResult = await this.installationAndRiskService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: this.createApiModelFromFormData(formData),
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.INSTALLATION_AND_RISK.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      res.redirect(this.taskListService.getNextPage('INSTALLATION_AND_RISK', req.order!))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
