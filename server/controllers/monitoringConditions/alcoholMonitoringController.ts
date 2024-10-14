// Remove this eslint config once this controller is implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { AlcoholMonitoring } from '../../models/AlcoholMonitoring'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { AddressField, DateField, TextField } from '../../models/view-models/utils'
import { AlcoholMonitoringService, AuditService } from '../../services'
import { deserialiseDate, getError, serialiseDate } from '../../utils/utils'

const alcoholMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  monitoringType: z.string().optional(),
  'startDate-day': z.string(),
  'startDate-month': z.string(),
  'startDate-year': z.string(),
  'endDate-day': z.string(),
  'endDate-month': z.string(),
  'endDate-year': z.string(),
  installationLocation: z.string().optional(),
  agreedAddressLine1: z.string(),
  agreedAddressLine2: z.string(),
  agreedAddressLine3: z.string(),
  agreedAddressLine4: z.string(),
  agreedAddressPostcode: z.string(),
  probationName: z.string(),
  prisonName: z.string(),
})

type AlcoholMonitoringFormData = z.infer<typeof alcoholMonitoringFormDataModel>

type AlcoholMonitoringViewModel = {
  monitoringType: TextField
  startDate: DateField
  endDate: DateField
  installationLocation: TextField
  agreedAddress: AddressField
  probationName: TextField
  prisonName: TextField
}

export default class AlcoholMonitoringController {
  constructor(
    private readonly auditService: AuditService,
    private readonly alcoholMonitoringService: AlcoholMonitoringService,
  ) {}

  private constructViewModel(
    alcoholMonitoring: AlcoholMonitoring | undefined,
    validationErrors: ValidationResult,
    formData: [AlcoholMonitoringFormData],
  ): AlcoholMonitoringViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors)
    }

    return this.createViewModelFromAlcoholMonitoring(alcoholMonitoring)
  }

  private createViewModelFromAlcoholMonitoring(alcoholMonitoring?: AlcoholMonitoring): AlcoholMonitoringViewModel {
    const [startDateYear, startDateMonth, startDateDay] = deserialiseDate(alcoholMonitoring?.startDate)
    const [endDateYear, endDateMonth, endDateDay] = deserialiseDate(alcoholMonitoring?.endDate)

    return {
      monitoringType: { value: alcoholMonitoring?.monitoringType ?? '' },
      startDate: { value: { day: startDateDay, month: startDateMonth, year: startDateYear } },
      endDate: { value: { day: endDateDay, month: endDateMonth, year: endDateYear } },
      installationLocation: { value: alcoholMonitoring?.installationLocation ?? '' },
      agreedAddress: {
        value: {
          line1: alcoholMonitoring?.agreedAddressLine1 ?? '',
          line2: alcoholMonitoring?.agreedAddressLine2 ?? '',
          line3: alcoholMonitoring?.agreedAddressLine3 ?? '',
          line4: alcoholMonitoring?.agreedAddressLine4 ?? '',
          postcode: alcoholMonitoring?.agreedAddressPostcode ?? '',
        },
      },
      probationName: { value: alcoholMonitoring?.probationName ?? '' },
      prisonName: { value: alcoholMonitoring?.prisonName ?? '' },
    }
  }

  private createViewModelFromFormData(
    formData: AlcoholMonitoringFormData,
    validationErrors: ValidationResult,
  ): AlcoholMonitoringViewModel {
    return {
      monitoringType: { value: formData.monitoringType ?? '', error: getError(validationErrors, 'monitoringType') },
      startDate: {
        value: {
          day: formData['startDate-day'],
          month: formData['startDate-month'],
          year: formData['startDate-year'],
        },
        error: getError(validationErrors, 'startDate'),
      },
      endDate: {
        value: {
          day: formData['endDate-day'],
          month: formData['endDate-month'],
          year: formData['endDate-year'],
        },
        error: getError(validationErrors, 'endDate'),
      },
      installationLocation: {
        value: formData.installationLocation ?? '',
        error: getError(validationErrors, 'installationLocation'),
      },
      agreedAddress: {
        value: {
          line1: formData.agreedAddressLine1 ?? '',
          line2: formData.agreedAddressLine2 ?? '',
          line3: formData.agreedAddressLine3 ?? '',
          line4: formData.agreedAddressLine4 ?? '',
          postcode: formData.agreedAddressPostcode ?? '',
        },
        error: getError(validationErrors, 'agreedAddress'),
      },
      probationName: { value: formData.probationName ?? '', error: getError(validationErrors, 'probationName') },
      prisonName: { value: formData.prisonName ?? '', error: getError(validationErrors, 'prisonName') },
    }
  }

  createApiModelFromFormData(formData: AlcoholMonitoringFormData): AlcoholMonitoring {
    return {
      monitoringType: formData.monitoringType ?? null,
      startDate: serialiseDate(formData['startDate-year'], formData['startDate-month'], formData['startDate-day']),
      endDate: serialiseDate(formData['endDate-year'], formData['endDate-month'], formData['endDate-day']),
      installationLocation: formData.installationLocation ?? null,
      agreedAddressLine1: formData.agreedAddressLine1 || null,
      agreedAddressLine2: formData.agreedAddressLine2 || null,
      agreedAddressLine3: formData.agreedAddressLine3 || null,
      agreedAddressLine4: formData.agreedAddressLine4 || null,
      agreedAddressPostcode: formData.agreedAddressPostcode || null,
      probationName: formData.probationName || null,
      prisonName: formData.prisonName || null,
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { monitoringConditionsAlcohol } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(monitoringConditionsAlcohol, errors as never, formData as never)

    res.render(`pages/order/monitoring-conditions/alcohol-monitoring`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = alcoholMonitoringFormDataModel.parse(req.body)

    const updateResult = await this.alcoholMonitoringService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: this.createApiModelFromFormData(formData),
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', orderId))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
