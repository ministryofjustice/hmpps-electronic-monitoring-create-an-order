// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { CurfewTimetable } from '../../models/CurfewTimetable'
import { ValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import CurfewTimetableService from '../../services/curfewTimetableService'

const curfewTimetableFormDataModel = z.object({
  action: z.string().default('continue'),
})

type CurfewTimetableFormData = z.infer<typeof curfewTimetableFormDataModel>

type CurfewTimetableViewModel = NonNullable<unknown>

export default class CurfewTimetableController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewTimetableService: CurfewTimetableService,
  ) {}

  private constructViewModel(
    curfewTimetable: CurfewTimetable,
    validationErrors: ValidationResult,
    formData: [CurfewTimetableFormData],
    formAction: string,
  ): CurfewTimetableViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors, formAction)
    }

    return this.createViewModelFromCurfewTimetable(curfewTimetable, formAction)
  }

  private createViewModelFromCurfewTimetable(
    curfewTimetable: CurfewTimetable,
    orderId: string,
  ): CurfewTimetableViewModel {
    return {}
  }

  private createViewModelFromFormData(
    formData: CurfewTimetableFormData,
    validationErrors: ValidationResult,
    orderId: string,
  ): CurfewTimetableViewModel {
    return {}
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearer } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(deviceWearer, errors as never, formData as never, orderId)

    res.render(`pages/order/monitoring-conditions/curfew-timetable`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = curfewTimetableFormDataModel.parse(req.body)

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
