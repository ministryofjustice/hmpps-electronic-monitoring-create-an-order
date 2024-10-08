// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { CurfewDayOfRelease } from '../../models/CurfewDayOfRelease'
import { ValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import CurfewDayOfReleaseService from '../../services/curfewDayOfReleaseService'

const curfewDayOfReleaseFormDataModel = z.object({
  action: z.string().default('continue'),
})

type CurfewDayOfReleaseFormData = z.infer<typeof curfewDayOfReleaseFormDataModel>

type CurfewDayOfReleaseViewModel = NonNullable<unknown>

export default class CurfewDayOfReleaseController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewDayOfReleaseService: CurfewDayOfReleaseService,
  ) {}

  private constructViewModel(
    curfewDayOfRelease: CurfewDayOfRelease,
    validationErrors: ValidationResult,
    formData: [CurfewDayOfReleaseFormData],
    formAction: string,
  ): CurfewDayOfReleaseViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors, formAction)
    }

    return this.createViewModelFromCurfewDayOfRelease(curfewDayOfRelease, formAction)
  }

  private createViewModelFromCurfewDayOfRelease(
    curfewDayOfRelease: CurfewDayOfRelease,
    orderId: string,
  ): CurfewDayOfReleaseViewModel {
    return {}
  }

  private createViewModelFromFormData(
    formData: CurfewDayOfReleaseFormData,
    validationErrors: ValidationResult,
    orderId: string,
  ): CurfewDayOfReleaseViewModel {
    return {}
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearer } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(deviceWearer, errors as never, formData as never, orderId)

    res.render(`pages/order/monitoring-conditions/curfew-day-of-release`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = curfewDayOfReleaseFormDataModel.parse(req.body)

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
