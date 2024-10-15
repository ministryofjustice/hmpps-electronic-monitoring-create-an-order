// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { CurfewConditions } from '../../models/CurfewConditions'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { DateField, MultipleChoiceField } from '../../models/view-models/utils'
import { AuditService } from '../../services'
import CurfewConditionsService from '../../services/curfewConditionsService'
import { deserialiseDate, getError, serialiseDate } from '../../utils/utils'

const curfewConditionsFormDataModel = z.object({
  action: z.string().default('continue'),
  addresses: z.array(z.string()).optional(),
  'startDate-day': z.string(),
  'startDate-month': z.string(),
  'startDate-year': z.string(),
  'endDate-day': z.string(),
  'endDate-month': z.string(),
  'endDate-year': z.string(),
})

type CurfewConditionsFormData = z.infer<typeof curfewConditionsFormDataModel>

type CurfewConditionsViewModel = {
  addresses: MultipleChoiceField
  startDate: DateField
  endDate: DateField
}

export default class CurfewConditionsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewConditionsService: CurfewConditionsService,
  ) {}

  private constructViewModel(
    curfewConditions: CurfewConditions | undefined,
    validationErrors: ValidationResult,
    formData: [CurfewConditionsFormData],
  ): CurfewConditionsViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors)
    }

    return this.createViewModelFromCurfewConditions(curfewConditions)
  }

  private createViewModelFromCurfewConditions(
    curfewConditions: CurfewConditions | undefined,
  ): CurfewConditionsViewModel {
    const [startDateYear, startDateMonth, startDateDay] = deserialiseDate(curfewConditions?.startDate)
    const [endDateYear, endDateMonth, endDateDay] = deserialiseDate(curfewConditions?.endDate)

    return {
      addresses: { values: curfewConditions?.addresses ?? [] },
      startDate: { value: { day: startDateDay, month: startDateMonth, year: startDateYear } },
      endDate: { value: { day: endDateDay, month: endDateMonth, year: endDateYear } },
    }
  }

  private createViewModelFromFormData(
    formData: CurfewConditionsFormData,
    validationErrors: ValidationResult,
  ): CurfewConditionsViewModel {
    return {
      addresses: { values: formData.addresses ?? [], error: getError(validationErrors, 'addresses') },
      startDate: {
        value: { day: formData['startDate-day'], month: formData['startDate-month'], year: formData['startDate-year'] },
        error: getError(validationErrors, 'startDate'),
      },
      endDate: {
        value: { day: formData['endDate-day'], month: formData['endDate-month'], year: formData['endDate-year'] },
        error: getError(validationErrors, 'endDate'),
      },
    }
  }

  private createApiModelFromFormData(formData: CurfewConditionsFormData): CurfewConditions {
    return {
      startDate: serialiseDate(formData['startDate-year'], formData['startDate-month'], formData['startDate-day']),
      endDate: serialiseDate(formData['endDate-year'], formData['endDate-month'], formData['endDate-day']),
      addresses: formData.addresses ?? [],
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { monitoringConditionsCurfewConditions: model } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(model, errors as never, formData as never)

    res.render(`pages/order/monitoring-conditions/curfew-conditions`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = curfewConditionsFormDataModel.parse(req.body)

    const updateResult = await this.curfewConditionsService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: this.createApiModelFromFormData(formData),
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', orderId))
    } else {
      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', orderId))
    }
  }
}
