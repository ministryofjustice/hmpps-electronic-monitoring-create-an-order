// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { AttendanceMonitoring } from '../../models/AttendanceMonitoring'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { AddressField, FormField, TextField, TimeField } from '../../models/view-models/utils'
import { AuditService } from '../../services'
import AttendanceMonitoringService from '../../services/attendanceMonitoringService'
import { deserialiseDate, deserialiseTime, getError, serialiseDate, serialiseTime } from '../../utils/utils'
import nextPage, { getSelectedMonitoringTypes } from './nextPage'

const attendanceMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  'startDate-day': z.string(),
  'startDate-month': z.string(),
  'startDate-year': z.string(),
  'endDate-day': z.string(),
  'endDate-month': z.string(),
  'endDate-year': z.string(),
  purpose: z.string(),
  appointmentDay: z.string(),
  startTimeHours: z.string(),
  startTimeMinutes: z.string(),
  endTimeHours: z.string(),
  endTimeMinutes: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  addressLine4: z.string(),
  addressPostcode: z.string(),
  addAnother: z.string().default('false'),
})

type AttendanceMonitoringFormData = z.infer<typeof attendanceMonitoringFormDataModel>

type AttendanceMonitoringViewModel = {
  startDate?: FormField
  startDateDay: TextField
  startDateMonth: TextField
  startDateYear: TextField
  endDate?: FormField
  endDateDay?: TextField
  endDateMonth?: TextField
  endDateYear?: TextField
  purpose: TextField
  appointmentDay: TextField
  startTime: TimeField
  endTime: TimeField
  address: AddressField
}

export default class AttendanceMonitoringController {
  constructor(
    private readonly auditService: AuditService,
    private readonly attendanceMonitoringService: AttendanceMonitoringService,
  ) {}

  private createViewModelFromAttendanceMonitoring(
    attendanceMonitoring: AttendanceMonitoring,
  ): AttendanceMonitoringViewModel {
    const [startDateYear, startDateMonth, startDateDay] = deserialiseDate(attendanceMonitoring.startDate)
    const [endDateYear, endDateMonth, endDateDay] = deserialiseDate(attendanceMonitoring.endDate)

    const [startTimeHours, startTimeMinutes] = deserialiseTime(attendanceMonitoring.startTime)
    const [endTimeHours, endTimeMinutes] = deserialiseTime(attendanceMonitoring.endTime)

    return {
      startDateDay: { value: startDateDay },
      startDateMonth: { value: startDateMonth },
      startDateYear: { value: startDateYear },
      endDateDay: { value: endDateDay },
      endDateMonth: { value: endDateMonth },
      endDateYear: { value: endDateYear },
      purpose: { value: attendanceMonitoring.purpose ?? '' },
      appointmentDay: { value: attendanceMonitoring.appointmentDay ?? '' },
      startTime: { value: { hours: startTimeHours, minutes: startTimeMinutes } },
      endTime: { value: { hours: endTimeHours, minutes: endTimeMinutes } },
      address: {
        value: {
          line1: attendanceMonitoring.addressLine1 ?? '',
          line2: attendanceMonitoring.addressLine2 ?? '',
          line3: attendanceMonitoring.addressLine3 ?? '',
          line4: attendanceMonitoring.addressLine4 ?? '',
          postcode: attendanceMonitoring.postcode ?? '',
        },
      },
    }
  }

  private createViewModelFromFormData(
    formData: AttendanceMonitoringFormData,
    validationErrors: ValidationResult,
  ): AttendanceMonitoringViewModel {
    return {
      startDate: { error: getError(validationErrors, 'startDate') },
      startDateDay: { value: formData['startDate-day'] },
      startDateMonth: { value: formData['startDate-month'] },
      startDateYear: { value: formData['startDate-year'] },
      endDate: { error: getError(validationErrors, 'endDate') },
      endDateDay: { value: formData['endDate-day'] },
      endDateMonth: { value: formData['endDate-month'] },
      endDateYear: { value: formData['endDate-year'] },
      purpose: { value: formData.purpose, error: getError(validationErrors, 'purpose') },
      appointmentDay: { value: formData.appointmentDay, error: getError(validationErrors, 'appointmentDay') },
      startTime: {
        error: getError(validationErrors, 'startTime'),
        value: { hours: formData.startTimeHours, minutes: formData.startTimeMinutes },
      },
      endTime: {
        error: getError(validationErrors, 'endTime'),
        value: { hours: formData.endTimeHours, minutes: formData.endTimeMinutes },
      },
      address: {
        error: getError(validationErrors, 'address'),
        value: {
          line1: formData.addressLine1 ?? '',
          line2: formData.addressLine2 ?? '',
          line3: formData.addressLine3 ?? '',
          line4: formData.addressLine4 ?? '',
          postcode: formData.addressPostcode ?? '',
        },
      },
    }
  }

  createApiModelFromFormData(formData: AttendanceMonitoringFormData): AttendanceMonitoring {
    const startDate = serialiseDate(formData['startDate-year'], formData['startDate-month'], formData['startDate-day'])
    const endDate = serialiseDate(formData['endDate-year'], formData['endDate-month'], formData['endDate-day'])
    const startTime = serialiseTime(formData.startTimeHours, formData.startTimeMinutes)
    const endTime = serialiseTime(formData.endTimeHours, formData.endTimeMinutes)

    return {
      startDate,
      endDate,
      purpose: formData.purpose,
      appointmentDay: formData.appointmentDay,
      startTime,
      endTime,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      addressLine3: formData.addressLine3,
      addressLine4: formData.addressLine4,
      postcode: formData.addressPostcode,
    }
  }

  new: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    const viewModel = this.createViewModelFromFormData(formData as never, errors as never)
    res.render(`pages/order/monitoring-conditions/attendance-monitoring`, viewModel)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, conditionId } = req.params
    const { monitoringConditionsAttendance } = req.order!
    const condition = monitoringConditionsAttendance?.find(c => c.id === conditionId)
    if (!condition) {
      res.send(404)
      return
    }

    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.createViewModelFromAttendanceMonitoring(condition)
    res.render('pages/order/monitoring-conditions/attendance-monitoring', viewModel)
  }

  create: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { monitoringConditions } = req.order!
    const formData = attendanceMonitoringFormDataModel.parse(req.body)

    const updateResult = await this.attendanceMonitoringService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: this.createApiModelFromFormData(formData),
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      if (formData.addAnother === 'true') {
        res.redirect(paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', orderId))
      } else {
        res.redirect(
          nextPage(getSelectedMonitoringTypes(monitoringConditions), 'mandatoryAttendance').replace(
            ':orderId',
            orderId,
          ),
        )
      }
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = attendanceMonitoringFormDataModel.parse(req.body)

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
