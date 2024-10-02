import { Request, RequestHandler, Response } from 'express'
import z from 'zod'
import { AuditService, DeviceWearerService } from '../services'
import paths from '../constants/paths'
import { isValidationResult, ValidationResult } from '../models/Validation'
import { DeviceWearer } from '../models/DeviceWearer'
import { calculateAge, deserialiseDate, getError } from '../utils/utils'
import { FormField } from '../interfaces/formData'

// Basic validation of user submitted form data
const DeviceWearerFormDataModel = z.object({
  action: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  alias: z.string(),
  gender: z.string().default(''),
  'dateOfBirth-day': z.string(),
  'dateOfBirth-month': z.string(),
  'dateOfBirth-year': z.string(),
})

type DeviceWearerFormData = z.infer<typeof DeviceWearerFormDataModel>

type DeviceWearerViewModel = {
  formActionUri: string
  orderSummaryUri: string
  firstName: FormField
  lastName: FormField
  alias: FormField
  gender: FormField
  dateOfBirth_day: FormField
  dateOfBirth_month: FormField
  dateOfBirth_year: FormField
  dateOfBirth: FormField
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
      firstName: { value: formData.firstName, error: getError(validationErrors, 'firstName') },
      lastName: { value: formData.lastName, error: getError(validationErrors, 'lastName') },
      alias: { value: formData.alias, error: getError(validationErrors, 'alias') },
      gender: { value: formData.gender || '', error: getError(validationErrors, 'gender') },
      dateOfBirth_day: { value: formData['dateOfBirth-day'] },
      dateOfBirth_month: { value: formData['dateOfBirth-month'] },
      dateOfBirth_year: { value: formData['dateOfBirth-year'] },
      dateOfBirth: { value: '', error: getError(validationErrors, 'dateOfBirth') },
    }
  }

  private createViewModelFromDeviceWearer(deviceWearer: DeviceWearer, orderId: string): DeviceWearerViewModel {
    const [year, month, day] = deserialiseDate(deviceWearer.dateOfBirth || '')

    return {
      formActionUri: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', orderId),
      orderSummaryUri: paths.ORDER.SUMMARY.replace(':orderId', orderId),
      firstName: { value: deviceWearer.firstName || '' },
      lastName: { value: deviceWearer.lastName || '' },
      alias: { value: deviceWearer.alias || '' },
      gender: { value: deviceWearer.gender || '' },
      dateOfBirth_day: { value: day },
      dateOfBirth_month: { value: month },
      dateOfBirth_year: { value: year },
      dateOfBirth: {
        value: '',
      },
    }
  }

  private constructViewModel(
    deviceWearer: DeviceWearer,
    validationErrors: ValidationResult,
    formData: [DeviceWearerFormData],
    formAction: string,
  ): DeviceWearerViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors, formAction)
    }

    return this.createViewModelFromDeviceWearer(deviceWearer, formAction)
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
      const dob = updateDeviceWearerResult.dateOfBirth
      const age = calculateAge(dob || '')

      if (!Number.isNaN(dob) && age < 18) {
        res.redirect(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', orderId))
      } else {
        res.redirect(paths.ABOUT_THE_DEVICE_WEARER.CONTACT_DETAILS.replace(':orderId', orderId))
      }
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
