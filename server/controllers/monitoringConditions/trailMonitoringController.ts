// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { TrailMonitoring } from '../../models/TrailMonitoring'
import { ValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import TrailMonitoringService from '../../services/trailMonitoringService'

const trailMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
})

type TrailMonitoringFormData = z.infer<typeof trailMonitoringFormDataModel>

type TrailMonitoringViewModel = NonNullable<unknown>

export default class TrailMonitoringController {
  constructor(
    private readonly auditService: AuditService,
    private readonly trailMonitoringService: TrailMonitoringService,
  ) {}

  private constructViewModel(
    trailMonitoring: TrailMonitoring,
    validationErrors: ValidationResult,
    formData: [TrailMonitoringFormData],
    formAction: string,
  ): TrailMonitoringViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors, formAction)
    }

    return this.createViewModelFromTrailMonitoring(trailMonitoring, formAction)
  }

  private createViewModelFromTrailMonitoring(
    trailMonitoring: TrailMonitoring,
    orderId: string,
  ): TrailMonitoringViewModel {
    return {}
  }

  private createViewModelFromFormData(
    formData: TrailMonitoringFormData,
    validationErrors: ValidationResult,
    orderId: string,
  ): TrailMonitoringViewModel {
    return {}
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearer } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(deviceWearer, errors as never, formData as never, orderId)

    res.render(`pages/order/monitoring-conditions/trail-monitoring`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = trailMonitoringFormDataModel.parse(req.body)

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
