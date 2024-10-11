import { Request, RequestHandler, Response } from 'express'
import z from 'zod'
import paths from '../constants/paths'
import { DeviceWearer } from '../models/DeviceWearer'
import { isValidationResult, ValidationResult } from '../models/Validation'
import { MultipleChoiceField, TextField } from '../models/view-models/utils'
import { AuditService, DeviceWearerService } from '../services'
import { deserialiseDate, getError } from '../utils/utils'

// Basic validation of user submitted form data
const DeviceWearerFormDataModel = z.object({
  action: z.string(),
  nomisId: z.string(),
  pncId: z.string(),
  deliusId: z.string(),
  prisonNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  alias: z.string(),
  'dateOfBirth-day': z.string(),
  'dateOfBirth-month': z.string(),
  'dateOfBirth-year': z.string(),
  adultAtTimeOfInstallation: z.string().default(''),
  sex: z.string().default(''),
  gender: z.string().default(''),
  disabilities: z
    .union([z.string(), z.array(z.string()).default([])])
    .transform(val => (Array.isArray(val) ? val : [val])),
})

type DeviceWearerFormData = z.infer<typeof DeviceWearerFormDataModel>

type DeviceWearerViewModel = {
  formActionUri: string
  orderSummaryUri: string
  nomisId: TextField
  pncId: TextField
  deliusId: TextField
  prisonNumber: TextField
  firstName: TextField
  lastName: TextField
  alias: TextField
  dateOfBirth_day: TextField
  dateOfBirth_month: TextField
  dateOfBirth_year: TextField
  dateOfBirth: TextField
  adultAtTimeOfInstallation: TextField
  sex: TextField
  gender: TextField
  disabilities: MultipleChoiceField
}

export default class DeviceWearerController {
  constructor(
    private readonly auditService: AuditService,
    private readonly deviceWearerService: DeviceWearerService,
  ) {}

  private createViewModelFromFormData(
    formData: DeviceWearerFormData,
    validationErrors: ValidationResult,
    orderId: string,
  ): DeviceWearerViewModel {
    return {
      formActionUri: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', orderId),
      orderSummaryUri: paths.ORDER.SUMMARY.replace(':orderId', orderId),
      nomisId: { value: formData.nomisId, error: getError(validationErrors, 'nomisId') },
      pncId: { value: formData.pncId, error: getError(validationErrors, 'pncId') },
      deliusId: { value: formData.deliusId, error: getError(validationErrors, 'deliusId') },
      prisonNumber: { value: formData.prisonNumber, error: getError(validationErrors, 'prisonNumber') },
      firstName: { value: formData.firstName, error: getError(validationErrors, 'firstName') },
      lastName: { value: formData.lastName, error: getError(validationErrors, 'lastName') },
      alias: { value: formData.alias, error: getError(validationErrors, 'alias') },
      dateOfBirth_day: { value: formData['dateOfBirth-day'] },
      dateOfBirth_month: { value: formData['dateOfBirth-month'] },
      dateOfBirth_year: { value: formData['dateOfBirth-year'] },
      dateOfBirth: { value: '', error: getError(validationErrors, 'dateOfBirth') },
      adultAtTimeOfInstallation: {
        value: formData.adultAtTimeOfInstallation || '',
        error: getError(validationErrors, 'adultAtTimeOfInstallation'),
      },
      sex: { value: formData.sex || '', error: getError(validationErrors, 'sex') },
      gender: { value: formData.gender || '', error: getError(validationErrors, 'gender') },
      disabilities: { values: formData.disabilities || '', error: getError(validationErrors, 'disabilities') },
    }
  }

  private createViewModelFromDeviceWearer(deviceWearer: DeviceWearer, orderId: string): DeviceWearerViewModel {
    const [year, month, day] = deserialiseDate(deviceWearer.dateOfBirth || '')

    return {
      formActionUri: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', orderId),
      orderSummaryUri: paths.ORDER.SUMMARY.replace(':orderId', orderId),
      nomisId: { value: deviceWearer.nomisId || '' },
      pncId: { value: deviceWearer.pncId || '' },
      deliusId: { value: deviceWearer.deliusId || '' },
      prisonNumber: { value: deviceWearer.prisonNumber || '' },
      firstName: { value: deviceWearer.firstName || '' },
      lastName: { value: deviceWearer.lastName || '' },
      alias: { value: deviceWearer.alias || '' },
      dateOfBirth_day: { value: day },
      dateOfBirth_month: { value: month },
      dateOfBirth_year: { value: year },
      dateOfBirth: {
        value: '',
      },
      adultAtTimeOfInstallation: { value: String(deviceWearer.adultAtTimeOfInstallation) },
      sex: { value: deviceWearer.sex || '' },
      gender: { value: deviceWearer.gender || '' },
      disabilities: { values: deviceWearer.disabilities ?? [] },
    }
  }

  private constructViewModel(
    deviceWearer: DeviceWearer,
    validationErrors: ValidationResult,
    formData: [DeviceWearerFormData],
    orderId: string,
  ): DeviceWearerViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors, orderId)
    }

    return this.createViewModelFromDeviceWearer(deviceWearer, orderId)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearer } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(deviceWearer, errors as never, formData as never, orderId)

    res.render(`pages/order/about-the-device-wearer/device-wearer`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = DeviceWearerFormDataModel.parse(req.body)

    const updateDeviceWearerResult = await this.deviceWearerService.updateDeviceWearer({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(updateDeviceWearerResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateDeviceWearerResult)

      res.redirect(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', orderId))
    } else if (action === 'continue') {
      if (updateDeviceWearerResult.adultAtTimeOfInstallation) {
        res.redirect(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_OFFICER.replace(':orderId', orderId))
      } else {
        res.redirect(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', orderId))
      }
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
