// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { MonitoringConditions } from '../../models/MonitoringConditions'
import { ValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import MonitoringConditionsService from '../../services/monitoringConditionsService'

const monitoringConditionsFormDataModel = z.object({
  action: z.string().default('continue'),
})

type MonitoringConditionsFormData = z.infer<typeof monitoringConditionsFormDataModel>

type MonitoringConditionsViewModel = NonNullable<unknown>

export default class MonitoringConditionsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly deviceWearerService: MonitoringConditionsService,
  ) {}

  private constructViewModel(
    monitoringConditions: MonitoringConditions,
    validationErrors: ValidationResult,
    formData: [MonitoringConditionsFormData],
    formAction: string,
  ): MonitoringConditionsViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors, formAction)
    }

    return this.createViewModelFromMonitoringConditions(monitoringConditions, formAction)
  }

  private createViewModelFromMonitoringConditions(
    monitoringConditions: MonitoringConditions,
    orderId: string,
  ): MonitoringConditionsViewModel {
    return {}
  }

  private createViewModelFromFormData(
    formData: MonitoringConditionsFormData,
    validationErrors: ValidationResult,
    orderId: string,
  ): MonitoringConditionsViewModel {
    return {}
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearer } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(deviceWearer, errors as never, formData as never, orderId)

    res.render(`pages/order/monitoring-conditions/index`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = monitoringConditionsFormDataModel.parse(req.body)

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
