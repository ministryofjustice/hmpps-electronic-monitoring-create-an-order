// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { TrailMonitoring } from '../../models/TrailMonitoring'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { FormField, TextField } from '../../models/view-models/utils'
import { AuditService } from '../../services'
import TrailMonitoringService from '../../services/trailMonitoringService'
import { deserialiseDate, getError, serialiseDate } from '../../utils/utils'
import nextPage, { getSelectedMonitoringTypes } from './nextPage'

const trailMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  'startDate-day': z.string(),
  'startDate-month': z.string(),
  'startDate-year': z.string(),
  'endDate-day': z.string(),
  'endDate-month': z.string(),
  'endDate-year': z.string(),
})

type TrailMonitoringFormData = z.infer<typeof trailMonitoringFormDataModel>

type TrailMonitoringViewModel = {
  startDate?: FormField
  startDateDay: TextField
  startDateMonth: TextField
  startDateYear: TextField
  endDate?: FormField
  endDateDay?: TextField
  endDateMonth?: TextField
  endDateYear?: TextField
}

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
    const [startDateYear, startDateMonth, startDateDay] = deserialiseDate(trailMonitoring?.startDate)
    const [endDateYear, endDateMonth, endDateDay] = deserialiseDate(trailMonitoring?.endDate)

    return {
      startDateDay: { value: startDateDay },
      startDateMonth: { value: startDateMonth },
      startDateYear: { value: startDateYear },
      endDateDay: { value: endDateDay },
      endDateMonth: { value: endDateMonth },
      endDateYear: { value: endDateYear },
    }
  }

  private createViewModelFromFormData(
    formData: TrailMonitoringFormData,
    validationErrors: ValidationResult,
    orderId: string,
  ): TrailMonitoringViewModel {
    return {
      startDate: { error: getError(validationErrors, 'startDate') },
      startDateDay: { value: formData['startDate-day'] ?? '' },
      startDateMonth: { value: formData['startDate-month'] ?? '' },
      startDateYear: { value: formData['startDate-year'] ?? '' },
      endDate: { error: getError(validationErrors, 'endDate') },
      endDateDay: { value: formData['endDate-day'] ?? '' },
      endDateMonth: { value: formData['endDate-month'] ?? '' },
      endDateYear: { value: formData['endDate-year'] ?? '' },
    }
  }

  createApiModelFromFormData(formData: TrailMonitoringFormData): TrailMonitoring {
    return {
      startDate: serialiseDate(formData['startDate-year'], formData['startDate-month'], formData['startDate-day']),
      endDate: serialiseDate(formData['endDate-year'], formData['endDate-month'], formData['endDate-day']),
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { monitoringConditionsTrail, monitoringConditions } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(
      monitoringConditionsTrail ?? {
        startDate: null,
        endDate: null,
      },
      errors as never,
      formData as never,
      orderId,
    )

    if (!monitoringConditions.trail) {
      res.redirect(paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', orderId))
    } else {
      res.render(`pages/order/monitoring-conditions/trail-monitoring`, viewModel)
    }
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { monitoringConditions } = req.order!
    const formData = trailMonitoringFormDataModel.parse(req.body)

    const updateMonitoringConditionsResult = await this.trailMonitoringService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: this.createApiModelFromFormData(formData),
    })

    if (isValidationResult(updateMonitoringConditionsResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateMonitoringConditionsResult)

      res.redirect(paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      res.redirect(paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', orderId))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
