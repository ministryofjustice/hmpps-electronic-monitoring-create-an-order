import { Request, RequestHandler, Response } from 'express'
import paths from '../constants/paths'
import { AuditService } from '../services'
import { DeviceWearer } from '../models/DeviceWearer'
import { deserialiseDate } from '../utils/utils'
import { FormField } from '../interfaces/formData'

type DeviceWearerCheckAnswersViewModel = {
  aboutTheDeviceWearerUri: string
  orderSummaryUri: string
  nomisId: FormField
  pncId: FormField
  deliusId: FormField
  prisonNumber: FormField
  firstName: FormField
  lastName: FormField
  alias: FormField
  dateOfBirth_day: FormField
  dateOfBirth_month: FormField
  dateOfBirth_year: FormField
  dateOfBirth: FormField
  adultAtTimeOfInstallation: FormField
  sex: FormField
  gender: FormField
  disabilities: FormField
}

export default class DeviceWearerCheckAnswersController {
  constructor(private readonly auditService: AuditService) {}

  private createViewModelFromDeviceWearer(
    deviceWearer: DeviceWearer,
    orderId: string,
  ): DeviceWearerCheckAnswersViewModel {
    const [year, month, day] = deserialiseDate(deviceWearer.dateOfBirth || '')

    return {
      aboutTheDeviceWearerUri: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', orderId),
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
      disabilities: { values: (deviceWearer.disabilities || '').split(',') },
    }
  }

  private constructViewModel(deviceWearer: DeviceWearer, formAction: string): DeviceWearerCheckAnswersViewModel {
    return this.createViewModelFromDeviceWearer(deviceWearer, formAction)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearer } = req.order!

    const viewModel = this.constructViewModel(deviceWearer, orderId)

    res.render(`pages/order/about-the-device-wearer/check-your-answers`, viewModel)
  }
}
