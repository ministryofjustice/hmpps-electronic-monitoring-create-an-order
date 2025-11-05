import { ZodError } from 'zod'
import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'
import { ValidationResult } from '../../../models/Validation'
import ErrorResponseModel, { ErrorResponse } from '../../../models/ErrorResponse'
import { SanitisedError } from '../../../sanitisedError'
import { convertZodErrorToValidationError, convertBackendErrorToValidationError } from '../../../utils/errors'
import { EnforcementZoneAddToListFormData, EnforcementZoneAddToListFormDataModel } from './formModel'

type UpdateZoneRequestInput = AuthenticatedRequestInput & {
  orderId: string
  data: EnforcementZoneAddToListFormData
}

type UploadZoneAttachmentRequestInput = AuthenticatedRequestInput & {
  orderId: string
  file: Express.Multer.File
  zoneId: number
}

export default class Service {
  constructor(private readonly apiClient: RestClient) {}

  async updateZone(input: UpdateZoneRequestInput): Promise<ValidationResult | null> {
    try {
      const requestBody = EnforcementZoneAddToListFormDataModel.parse(input.data)
      await this.apiClient.put({
        path: `/api/orders/${input.orderId}/enforcementZone`,
        data: requestBody,
        token: input.accessToken,
      })
      return null
    } catch (e) {
      if (e instanceof ZodError) {
        return convertZodErrorToValidationError(e)
      }

      const sanitisedError = e as SanitisedError
      if (sanitisedError.status === 400) {
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }

  async uploadZoneAttachment(input: UploadZoneAttachmentRequestInput): Promise<ErrorResponse> {
    try {
      await this.apiClient.postMultiPart({
        path: `/api/orders/${input.orderId}/enforcementZone/${input.zoneId}/attachment`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        fileToUpload: input.file,
        token: input.accessToken,
      })
      return { status: null, userMessage: null, developerMessage: null }
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ErrorResponseModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
