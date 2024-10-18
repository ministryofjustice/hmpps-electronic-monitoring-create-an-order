import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { SrvRecord } from 'dns'
import paths from '../../constants/paths'
import { AlcoholMonitoring } from '../../models/AlcoholMonitoring'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { AddressField, DateField, TextField } from '../../models/view-models/utils'
import { AlcoholMonitoringService, AuditService } from '../../services'
import { deserialiseDate, getError, serialiseDate } from '../../utils/utils'
import { Address, AddressTypeEnum } from '../../models/Address'

const alcoholMonitoringFormDataModel = z.object({
  action: z.string().default('continue'),
  monitoringType: z.string().default(''),
  'startDate-day': z.string(),
  'startDate-month': z.string(),
  'startDate-year': z.string(),
  'endDate-day': z.string(),
  'endDate-month': z.string(),
  'endDate-year': z.string(),
  installationAddressType: z.string().default(''),
  prisonName: z.string(),
  probationOfficeName: z.string(),
})

type AddressSummaries = {
  primaryAddressSummary: string
  secondaryAddressSummary: string
  tertiaryAddressSummary: string
  installationAddressSummary: string
}

type AlcoholMonitoringFormData = z.infer<typeof alcoholMonitoringFormDataModel>

type AlcoholMonitoringViewModel = {
  monitoringType: TextField
  startDate: DateField
  endDate: DateField
  installationAddressType: TextField
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

  private constructViewModel(
    monitoringConditionsAlcohol: AlcoholMonitoring,
    addresses: Address[],
    validationErrors: ValidationResult,
    formData: [AlcoholMonitoringFormData],
  ): AlcoholMonitoringViewModel {
    const primaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.PRIMARY)
    const secondaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.SECONDARY)
    const tertiaryAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.TERTIARY)
    const installationAddress = addresses?.find(address => address.addressType === AddressTypeEnum.Enum.INSTALLATION)

    const addressSummaries = {
      primaryAddressSummary: primaryAddress ? this.createAddressView(primaryAddress) : '',
      secondaryAddressSummary: secondaryAddress ? this.createAddressView(secondaryAddress) : '',
      tertiaryAddressSummary: tertiaryAddress ? this.createAddressView(tertiaryAddress) : '',
      installationAddressSummary: installationAddress ? this.createAddressView(installationAddress) : '',
    }

    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormDataAndAddresses(formData[0], addressSummaries, validationErrors)
    }

    return this.createViewModelFromAlcoholMonitoringAndAddresses(monitoringConditionsAlcohol, addressSummaries)
  }

  private createAddressView(address: Address) {
    return `${address.addressLine1}, ${address.addressLine2}, ${address.postcode}`
  }

  private createViewModelFromAlcoholMonitoringAndAddresses(
    monitoringConditionsAlcohol: AlcoholMonitoring,
    addressViews: AddressSummaries,
  ): AlcoholMonitoringViewModel {
    const [startDateYear, startDateMonth, startDateDay] = deserialiseDate(monitoringConditionsAlcohol?.startDate)
    const [endDateYear, endDateMonth, endDateDay] = deserialiseDate(monitoringConditionsAlcohol?.endDate)

    return {
      monitoringType: { value: monitoringConditionsAlcohol?.monitoringType ?? '' },
      startDate: { value: { day: startDateDay, month: startDateMonth, year: startDateYear } },
      endDate: { value: { day: endDateDay, month: endDateMonth, year: endDateYear } },
      installationAddressType: { value: monitoringConditionsAlcohol?.installationAddressType ?? '' },
      probationOfficeName: { value: monitoringConditionsAlcohol?.probationOfficeName ?? '' },
      prisonName: { value: monitoringConditionsAlcohol?.prisonName ?? '' },
      primaryAddressView: { value: addressViews.primaryAddressSummary },
      secondaryAddressView: { value: addressViews.secondaryAddressSummary },
      tertiaryAddressView: { value: addressViews.tertiaryAddressSummary },
      installationAddressView: { value: addressViews.installationAddressSummary },
    }
  }

  private createViewModelFromFormDataAndAddresses(
    formData: AlcoholMonitoringFormData,
    addressViews: AddressSummaries,
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
      installationAddressType: {
        value: formData.installationAddressType ?? '',
        error: getError(validationErrors, 'installationAddressType'),
      },
      probationOfficeName: {
        value: formData.probationOfficeName ?? '',
        error: getError(validationErrors, 'probationOfficeName'),
      },
      prisonName: { value: formData.prisonName ?? '', error: getError(validationErrors, 'prisonName') },
      primaryAddressView: { value: addressViews.primaryAddressSummary },
      secondaryAddressView: { value: addressViews.secondaryAddressSummary },
      tertiaryAddressView: { value: addressViews.tertiaryAddressSummary },
      installationAddressView: { value: addressViews.installationAddressSummary },
    }
  }

  createApiModelFromFormData(formData: AlcoholMonitoringFormData): AlcoholMonitoring {
    return {
      monitoringType: formData.monitoringType ?? null,
      startDate: serialiseDate(formData['startDate-year'], formData['startDate-month'], formData['startDate-day']),
      endDate: serialiseDate(formData['endDate-year'], formData['endDate-month'], formData['endDate-day']),
      installationAddressType: formData.installationAddressType ?? null,
      probationOfficeName: formData.probationOfficeName || null,
      prisonName: formData.prisonName || null,
    }
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
        installationAddressType: null,
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
