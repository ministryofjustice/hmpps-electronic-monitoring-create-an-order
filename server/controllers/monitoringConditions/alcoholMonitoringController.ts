import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { DateField, TextField } from '../../models/view-models/utils'
import { AlcoholMonitoringService, AuditService } from '../../services'
import { deserialiseDate, getError, serialiseDate } from '../../utils/utils'
import { Address, AddressTypeEnum } from '../../models/Address'
import { AlcoholMonitoring, AlcoholMonitoringType, InstallationLocationType } from '../../models/AlcoholMonitoring'

const alcoholMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  monitoringType: z.string().nullable().default(null),
  'startDate-day': z.string(),
  'startDate-month': z.string(),
  'startDate-year': z.string(),
  'endDate-day': z.string(),
  'endDate-month': z.string(),
  'endDate-year': z.string(),
  installationLocation: z.string().nullable().default(null),
  prisonName: z.string().nullable().default(null),
  probationOfficeName: z.string().nullable().default(null),
})

type AddressViews = {
  primaryAddressView: string
  secondaryAddressView: string
  tertiaryAddressView: string
  installationAddressView: string
}

type AlcoholMonitoringFormData = z.infer<typeof alcoholMonitoringFormDataModel>

type AlcoholMonitoringViewModel = {
  monitoringType: TextField
  startDate: DateField
  endDate: DateField
  installationLocation: TextField
  prisonName: TextField
  probationOfficeName: TextField
  primaryAddressView: TextField
  secondaryAddressView: TextField
  tertiaryAddressView: TextField
  installationAddressView: TextField
}

export default class AlcoholMonitoringController {
  constructor(
    private readonly auditService: AuditService,
    private readonly alcoholMonitoringService: AlcoholMonitoringService,
  ) {}

  createApiModelFromFormData(formData: AlcoholMonitoringFormData): AlcoholMonitoring {
    return {
      monitoringType: (formData.monitoringType as AlcoholMonitoringType) ?? null,
      startDate: serialiseDate(formData['startDate-year'], formData['startDate-month'], formData['startDate-day']),
      endDate: serialiseDate(formData['endDate-year'], formData['endDate-month'], formData['endDate-day']),
      installationLocation: (formData.installationLocation as InstallationLocationType) ?? null,
      probationOfficeName: formData.probationOfficeName || null,
      prisonName: formData.prisonName || null,
    }
  }

  private createViewModelFromAlcoholMonitoring(
    monitoringConditionsAlcohol: AlcoholMonitoring,
    addressViews: AddressViews,
  ): AlcoholMonitoringViewModel {
    const [startDateYear, startDateMonth, startDateDay] = deserialiseDate(monitoringConditionsAlcohol?.startDate)
    const [endDateYear, endDateMonth, endDateDay] = deserialiseDate(monitoringConditionsAlcohol?.endDate)

    return {
      monitoringType: { value: monitoringConditionsAlcohol?.monitoringType ?? '' },
      startDate: { value: { day: startDateDay, month: startDateMonth, year: startDateYear } },
      endDate: { value: { day: endDateDay, month: endDateMonth, year: endDateYear } },
      installationLocation: { value: monitoringConditionsAlcohol?.installationLocation ?? '' },
      probationOfficeName: { value: monitoringConditionsAlcohol?.probationOfficeName ?? '' },
      prisonName: { value: monitoringConditionsAlcohol?.prisonName ?? '' },
      primaryAddressView: { value: addressViews.primaryAddressView },
      secondaryAddressView: { value: addressViews.secondaryAddressView },
      tertiaryAddressView: { value: addressViews.tertiaryAddressView },
      installationAddressView: { value: addressViews.installationAddressView },
    }
  }

  private createViewModelFromFormData(
    formData: AlcoholMonitoringFormData,
    addressViews: AddressViews,
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
        value: { day: formData['endDate-day'], month: formData['endDate-month'], year: formData['endDate-year'] },
        error: getError(validationErrors, 'endDate'),
      },
      installationLocation: {
        value: formData.installationLocation ?? '',
        error: getError(validationErrors, 'installationLocation'),
      },
      probationOfficeName: {
        value: formData.probationOfficeName ?? '',
        error: getError(validationErrors, 'probationOfficeName'),
      },
      prisonName: { value: formData.prisonName ?? '', error: getError(validationErrors, 'prisonName') },
      primaryAddressView: { value: addressViews.primaryAddressView },
      secondaryAddressView: { value: addressViews.secondaryAddressView },
      tertiaryAddressView: { value: addressViews.tertiaryAddressView },
      installationAddressView: { value: addressViews.installationAddressView },
    }
  }

  private createAddressView(address: Address) {
    return `${address.addressLine1}, ${address.addressLine2}, ${address.postcode}`
  }

  private getAddressViews(addresses: Address[]): AddressViews {
    const primaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.PRIMARY)
    const secondaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.SECONDARY)
    const tertiaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.TERTIARY)
    const installationAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.INSTALLATION)

    const addressViews = {
      primaryAddressView: primaryAddress ? this.createAddressView(primaryAddress) : '',
      secondaryAddressView: secondaryAddress ? this.createAddressView(secondaryAddress) : '',
      tertiaryAddressView: tertiaryAddress ? this.createAddressView(tertiaryAddress) : '',
      installationAddressView: installationAddress ? this.createAddressView(installationAddress) : '',
    }

    return addressViews
  }

  private constructViewModel(
    monitoringConditionsAlcohol: AlcoholMonitoring,
    addresses: Address[],
    validationErrors: ValidationResult,
    formData: [AlcoholMonitoringFormData],
  ): AlcoholMonitoringViewModel {
    const addressViews = this.getAddressViews(addresses)

    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], addressViews, validationErrors)
    }

    return this.createViewModelFromAlcoholMonitoring(monitoringConditionsAlcohol, addressViews)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { monitoringConditionsAlcohol, addresses } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(
      monitoringConditionsAlcohol ?? {
        monitoringType: null,
        startDate: null,
        endDate: null,
        installationLocation: null,
        prisonName: null,
        probationOfficeName: null,
      },
      addresses,
      errors as never,
      formData as never,
    )

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
    } else if (formData.action === 'continue') {
      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', orderId))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
