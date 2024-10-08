// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { AlcoholMonitoring } from '../../models/AlcoholMonitoring'
import { ValidationResult } from '../../models/Validation'
import { AlcoholMonitoringService, AuditService } from '../../services'

const alcoholMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
})

type AlcoholMonitoringFormData = z.infer<typeof alcoholMonitoringFormDataModel>

type AlcoholMonitoringViewModel = NonNullable<unknown>

export default class AlcoholMonitoringController {
  constructor(
    private readonly auditService: AuditService,
    private readonly alcoholMonitoringService: AlcoholMonitoringService,
  ) {}

  private constructViewModel(
    alcoholMonitoring: AlcoholMonitoring,
    validationErrors: ValidationResult,
    formData: [AlcoholMonitoringFormData],
    formAction: string,
  ): AlcoholMonitoringViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors, formAction)
    }

    return this.createViewModelFromAlcoholMonitoring(alcoholMonitoring, formAction)
  }

  private createViewModelFromAlcoholMonitoring(
    alcoholMonitoring: AlcoholMonitoring,
    orderId: string,
  ): AlcoholMonitoringViewModel {
    return {}
  }

  private createViewModelFromFormData(
    formData: AlcoholMonitoringFormData,
    validationErrors: ValidationResult,
    orderId: string,
  ): AlcoholMonitoringViewModel {
    return {}
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearer } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(deviceWearer, errors as never, formData as never, orderId)

    res.render(`pages/order/monitoring-conditions/alcohol-monitoring`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = alcoholMonitoringFormDataModel.parse(req.body)

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
