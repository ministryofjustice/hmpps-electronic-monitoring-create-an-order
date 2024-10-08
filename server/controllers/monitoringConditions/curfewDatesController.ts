// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { CurfewDates } from '../../models/CurfewDates'
import { ValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import CurfewDatesService from '../../services/curfewDatesService'

const curfewDatesFormDataModel = z.object({
  action: z.string().default('continue'),
})

type CurfewDatesFormData = z.infer<typeof curfewDatesFormDataModel>

type CurfewDatesViewModel = NonNullable<unknown>

export default class CurfewDatesController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewDatesService: CurfewDatesService,
  ) {}

  private constructViewModel(
    curfewDates: CurfewDates,
    validationErrors: ValidationResult,
    formData: [CurfewDatesFormData],
    formAction: string,
  ): CurfewDatesViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors, formAction)
    }

    return this.createViewModelFromCurfewDates(curfewDates, formAction)
  }

  private createViewModelFromCurfewDates(curfewDates: CurfewDates, orderId: string): CurfewDatesViewModel {
    return {}
  }

  private createViewModelFromFormData(
    formData: CurfewDatesFormData,
    validationErrors: ValidationResult,
    orderId: string,
  ): CurfewDatesViewModel {
    return {}
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearer } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(deviceWearer, errors as never, formData as never, orderId)

    res.render(`pages/order/monitoring-conditions/curfew-dates`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = curfewDatesFormDataModel.parse(req.body)

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
