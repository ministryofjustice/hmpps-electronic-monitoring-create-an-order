import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerModel, { DeviceWearer } from '../models/DeviceWearer'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { serialiseDate } from '../utils/utils'

type UpdateDeviceWearerRequestInput = AuthenticatedRequestInput & {
  orderId: string
  data: {
    nomisId: string
    pncId: string
    deliusId: string
    prisonNumber: string
    firstName: string
    lastName: string
    alias: string
    'dateOfBirth-day': string
    'dateOfBirth-month': string
    'dateOfBirth-year': string
    adultAtTimeOfInstallation: string
    sex: string
    gender: string
    disabilities: Array<string>
  }
}

export default class DeviceWearerService {
  constructor(private readonly apiClient: RestClient) {}

  async updateDeviceWearer(input: UpdateDeviceWearerRequestInput): Promise<DeviceWearer | ValidationResult> {
    try {
      const {
        'dateOfBirth-day': dobDay,
        'dateOfBirth-month': dobMonth,
        'dateOfBirth-year': dobYear,
        disabilities,
        ...data
      } = input.data

      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/device-wearer`,
        data: {
          ...data,
          dateOfBirth: serialiseDate(dobYear, dobMonth, dobDay),
          disabilities: disabilities.join(','),
        },
        token: input.accessToken,
      })

      return DeviceWearerModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
