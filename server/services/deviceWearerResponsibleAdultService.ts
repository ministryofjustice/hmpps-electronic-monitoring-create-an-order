import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerResponsibleAdultModel, { DeviceWearerResponsibleAdult } from '../models/DeviceWearerResponsibleAdult'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type UpdateDeviceWearerResponsibleAdultRequestInput = AuthenticatedRequestInput & {
  orderId: string
  data: {
    relationship: string
    fullName: string
    contactNumber: string | null
  }
}

export default class DeviceWearerResponsibleAdultService {
  constructor(private readonly apiClient: RestClient) {}

  async updateDeviceWearerResponsibleAdult(
    input: UpdateDeviceWearerResponsibleAdultRequestInput,
  ): Promise<DeviceWearerResponsibleAdult | ValidationResult> {
    try {
      const { data } = input

      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/device-wearer-responsible-adult`,
        data,
        token: input.accessToken,
      })

      return DeviceWearerResponsibleAdultModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
