// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { AttendanceMonitoring } from '../../models/AttendanceMonitoring'
import { ValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import AttendanceMonitoringService from '../../services/attendanceMonitoringService'

const attendanceMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
})

type AttendanceMonitoringFormData = z.infer<typeof attendanceMonitoringFormDataModel>

type AttendanceMonitoringViewModel = NonNullable<unknown>

export default class AttendanceMonitoringController {
  constructor(
    private readonly auditService: AuditService,
    private readonly attendanceMonitoringService: AttendanceMonitoringService,
  ) {}

  private constructViewModel(
    attendanceMonitoring: AttendanceMonitoring,
    validationErrors: ValidationResult,
    formData: [AttendanceMonitoringFormData],
    formAction: string,
  ): AttendanceMonitoringViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors, formAction)
    }

    return this.createViewModelFromAttendanceMonitoring(attendanceMonitoring, formAction)
  }

  private createViewModelFromAttendanceMonitoring(
    attendanceMonitoring: AttendanceMonitoring,
    orderId: string,
  ): AttendanceMonitoringViewModel {
    return {}
  }

  private createViewModelFromFormData(
    formData: AttendanceMonitoringFormData,
    validationErrors: ValidationResult,
    orderId: string,
  ): AttendanceMonitoringViewModel {
    return {}
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearer } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(deviceWearer, errors as never, formData as never, orderId)

    res.render(`pages/order/monitoring-conditions/attendance-monitoring`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = attendanceMonitoringFormDataModel.parse(req.body)

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
