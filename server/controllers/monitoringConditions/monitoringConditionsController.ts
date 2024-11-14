import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { MonitoringConditions } from '../../models/MonitoringConditions'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { DateField, MultipleChoiceField, TextField } from '../../models/view-models/utils'
import { AuditService } from '../../services'
import MonitoringConditionsService from '../../services/monitoringConditionsService'
import { deserialiseDate, getError, serialiseDate } from '../../utils/utils'
import TaskListService from '../../services/taskListService'

const monitoringConditionsFormDataModel = z.object({
  action: z.string().default('continue'),
  orderType: z.coerce.string(),
  monitoringRequired: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
  orderTypeDescription: z.coerce.string(),
  conditionType: z.coerce.string(),
  endDay: z.string().default(''),
  endMonth: z.string().default(''),
  endYear: z.string().default(''),
  startDay: z.string().default(''),
  startMonth: z.string().default(''),
  startYear: z.string().default(''),
})

type MonitoringConditionsFormData = z.infer<typeof monitoringConditionsFormDataModel>

type MonitoringConditionsViewModel = {
  orderType: TextField
  monitoringRequired: MultipleChoiceField
  orderTypeDescription: TextField
  conditionType: TextField
  startDate: DateField
  endDate: DateField
}

const monitoringTypes: (keyof MonitoringConditions)[] = [
  'curfew',
  'exclusionZone',
  'trail',
  'mandatoryAttendance',
  'alcohol',
]

export default class MonitoringConditionsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly monitoringConditionsService: MonitoringConditionsService,
    private readonly taskListService: TaskListService,
  ) {}

  private constructViewModel(
    monitoringConditions: MonitoringConditions,
    validationErrors: ValidationResult,
    formData: MonitoringConditionsFormData[],
  ): MonitoringConditionsViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors)
    }

    return this.createViewModelFromMonitoringConditions(monitoringConditions)
  }

  private getSelectedMonitoringTypes(monitoringConditions: MonitoringConditions): string[] {
    return monitoringTypes.reduce((acc: string[], val) => {
      if (monitoringConditions[val]) {
        acc.push(val)
      }
      return acc
    }, [])
  }

  private createViewModelFromMonitoringConditions(
    monitoringConditions: MonitoringConditions,
  ): MonitoringConditionsViewModel {
    const monitoringRequiredValues = this.getSelectedMonitoringTypes(monitoringConditions)

    const [startDateYear, startDateMonth, startDateDay] = deserialiseDate(monitoringConditions?.startDate)
    const [endDateYear, endDateMonth, endDateDay] = deserialiseDate(monitoringConditions?.endDate)
    return {
      orderType: { value: monitoringConditions.orderType ?? '' },
      monitoringRequired: {
        values: monitoringRequiredValues,
      },
      orderTypeDescription: { value: monitoringConditions.orderTypeDescription ?? '' },
      conditionType: { value: monitoringConditions.conditionType ?? '' },
      startDate: { value: { day: startDateDay, month: startDateMonth, year: startDateYear } },
      endDate: { value: { day: endDateDay, month: endDateMonth, year: endDateYear } },
    }
  }

  private createViewModelFromFormData(
    formData: MonitoringConditionsFormData,
    validationErrors: ValidationResult,
  ): MonitoringConditionsViewModel {
    return {
      orderType: { value: formData.orderType, error: getError(validationErrors, 'orderType') },
      monitoringRequired: {
        values: formData.monitoringRequired,
        error: getError(validationErrors, 'updateMonitoringConditionsDto'),
      },
      orderTypeDescription: {
        value: formData.orderTypeDescription,
        error: getError(validationErrors, 'orderTypeDescription'),
      },
      conditionType: { value: formData.conditionType, error: getError(validationErrors, 'conditionType') },
      startDate: {
        value: { day: formData.startDay, month: formData.startMonth, year: formData.startYear },
        error: getError(validationErrors, 'startDate'),
      },
      endDate: {
        value: { day: formData.endDay, month: formData.endMonth, year: formData.endYear },
        error: getError(validationErrors, 'endDate'),
      },
    }
  }

  createApiModelFromFormData(formData: MonitoringConditionsFormData): Omit<MonitoringConditions, 'isValid'> {
    return {
      orderType: formData.orderType === '' ? null : formData.orderType,
      curfew: formData.monitoringRequired.includes('curfew'),
      exclusionZone: formData.monitoringRequired.includes('exclusionZone'),
      trail: formData.monitoringRequired.includes('trail'),
      mandatoryAttendance: formData.monitoringRequired.includes('mandatoryAttendance'),
      alcohol: formData.monitoringRequired.includes('alcohol'),
      orderTypeDescription: formData.orderTypeDescription === '' ? null : formData.orderTypeDescription,
      conditionType: formData.conditionType === '' ? null : formData.conditionType,
      startDate: serialiseDate(formData.startYear, formData.startMonth, formData.startDay),
      endDate: serialiseDate(formData.endYear, formData.endMonth, formData.endDay),
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { monitoringConditions } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(monitoringConditions, errors as never, formData as never)

    res.render(`pages/order/monitoring-conditions/index`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = monitoringConditionsFormDataModel.parse(req.body)

    const updateMonitoringConditionsResult = await this.monitoringConditionsService.updateMonitoringConditions({
      accessToken: res.locals.user.token,
      orderId,
      data: this.createApiModelFromFormData(formData),
    })

    if (isValidationResult(updateMonitoringConditionsResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateMonitoringConditionsResult)
      res.redirect(paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      res.redirect(this.taskListService.getNextPage('MONITORING_CONDITIONS', req.order!))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
