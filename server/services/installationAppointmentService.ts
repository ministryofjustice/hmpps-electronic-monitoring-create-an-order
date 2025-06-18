import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import InstallationAppointmentModel, { InstallationAppointment } from '../models/InstallationAppointment'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertZodErrorToValidationError } from '../utils/errors'
import {
  InstallationAppointmentFormData,
  InstallationAppointmentFormDataValidator,
} from '../models/form-data/installationAppointment'

type UpdateInstallationAppointmentInput = AuthenticatedRequestInput & {
  orderId: string
  data: InstallationAppointmentFormData
}

export default class InstallationAppointmentService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: UpdateInstallationAppointmentInput): Promise<InstallationAppointment | ValidationResult> {
    try {
      const requestBody = InstallationAppointmentFormDataValidator.parse(input.data)

      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/installation-appointment`,
        data: requestBody,
        token: input.accessToken,
      })
      return InstallationAppointmentModel.parse(result)
    } catch (e) {
      if (e instanceof ZodError) {
        return convertZodErrorToValidationError(e)
      }
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
