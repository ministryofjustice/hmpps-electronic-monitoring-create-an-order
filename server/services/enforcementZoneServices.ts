import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import ErrorResponseModel, { ErrorResponse } from '../models/ErrorResponse'
import { SanitisedError } from '../sanitisedError'
import {EnforcementZoneFormData,EnforcementZoneFormDataValidator} from '../models/form-data/enforcementZone'
import { ZodError } from 'zod'
import { convertZodErrorToValidationError } from '../utils/errors'

type UpdateZoneRequestInpput = AuthenticatedRequestInput & {
  orderId: string
  data: EnforcementZoneFormData
}

type UploadZoneAttachmentRequestInpput = AuthenticatedRequestInput & {
  orderId: string
  file: Express.Multer.File
  zoneId: number
}

export default class EnforcementZoneService {
  constructor(private readonly apiClient: RestClient) {}

  async updateZone(input: UpdateZoneRequestInpput): Promise<ValidationResult | null> {
    try {
      const requestBody = EnforcementZoneFormDataValidator.parse(input.data)  
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
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }

  async uploadZoneAttachment(input: UploadZoneAttachmentRequestInpput): Promise<ErrorResponse> {
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
