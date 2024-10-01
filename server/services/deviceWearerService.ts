import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerModel, { DeviceWearer } from '../models/DeviceWearer'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { serialiseDate } from '../utils/utils'

type UpdateDeviceWearerRequestInput = AuthenticatedRequestInput & {
  orderId: string
  data: {
    firstName: string
    lastName: string
    alias: string
    gender: string | null
    'dateOfBirth-day': string
    'dateOfBirth-month': string
    'dateOfBirth-year': string
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
        ...data
      } = input.data

      const result = await this.apiClient.post({
        path: `/api/order/${input.orderId}/device-wearer`,
        data: {
          ...data,
          dateOfBirth: serialiseDate(dobYear, dobMonth, dobDay),
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
