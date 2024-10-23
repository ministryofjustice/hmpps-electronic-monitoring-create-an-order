import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { MonitoringConditions } from '../../models/MonitoringConditions'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { MultipleChoiceField, TextField } from '../../models/view-models/utils'
import { AuditService } from '../../services'
import MonitoringConditionsService from '../../services/monitoringConditionsService'
import { getError } from '../../utils/utils'
import { getSelectedMonitoringTypes } from './nextPage'

const monitoringConditionsFormDataModel = z.object({
  action: z.string().default('continue'),
  acquisitiveCrime: z.union([z.string(), z.undefined()]).transform(value => {
    if (value === undefined) {
      return null
    }
    return value === 'true'
  }),
  dapol: z.union([z.string(), z.undefined()]).transform(value => {
    if (value === undefined) {
      return null
    }
    return value === 'true'
  }),
  orderType: z.coerce.string(),
  monitoringRequired: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
  devicesRequired: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
})

type MonitoringConditionsFormData = z.infer<typeof monitoringConditionsFormDataModel>

type MonitoringConditionsViewModel = {
  acquisitiveCrime: TextField
  dapol: TextField
  orderType: TextField
  monitoringRequired: MultipleChoiceField
  devicesRequired: MultipleChoiceField
}

export default class MonitoringConditionsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly monitoringConditionsService: MonitoringConditionsService,
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

  private createViewModelFromMonitoringConditions(
    monitoringConditions: MonitoringConditions,
  ): MonitoringConditionsViewModel {
    const monitoringRequiredValues = getSelectedMonitoringTypes(monitoringConditions)

    return {
      acquisitiveCrime: { value: String(monitoringConditions.acquisitiveCrime) },
      dapol: { value: String(monitoringConditions.dapol) },
      orderType: { value: monitoringConditions.orderType ?? '' },
      monitoringRequired: {
        values: monitoringRequiredValues,
      },
      devicesRequired: {
        values: monitoringConditions.devicesRequired ?? [],
      },
    }
  }

  private createViewModelFromFormData(
    formData: MonitoringConditionsFormData,
    validationErrors: ValidationResult,
  ): MonitoringConditionsViewModel {
    return {
      acquisitiveCrime: {
        value: String(formData.acquisitiveCrime),
        error: getError(validationErrors, 'acquisitiveCrime'),
      },
      dapol: {
        value: String(formData.dapol),
        error: getError(validationErrors, 'dapol'),
      },
      orderType: { value: formData.orderType, error: getError(validationErrors, 'orderType') },
      monitoringRequired: {
        values: formData.monitoringRequired,
        error: getError(validationErrors, 'updateMonitoringConditionsDto'),
      },
      devicesRequired: {
        values: formData.devicesRequired,
        error: getError(validationErrors, 'devicesRequired'),
      },
    }
  }

  createApiModelFromFormData(formData: MonitoringConditionsFormData): MonitoringConditions {
    return {
      acquisitiveCrime: formData.acquisitiveCrime === null ? null : Boolean(formData.acquisitiveCrime),
      dapol: formData.dapol === null ? null : Boolean(formData.dapol),
      orderType: formData.orderType === '' ? null : formData.orderType,
      curfew: formData.monitoringRequired.includes('curfew'),
      exclusionZone: formData.monitoringRequired.includes('exclusionZone'),
      trail: formData.monitoringRequired.includes('trail'),
      mandatoryAttendance: formData.monitoringRequired.includes('mandatoryAttendance'),
      alcohol: formData.monitoringRequired.includes('alcohol'),
      devicesRequired: formData.devicesRequired.length > 0 ? formData.devicesRequired : null,
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
      res.redirect(
        paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', orderId).replace(
          ':addressType(installation)',
          'installation',
        ),
      )
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
