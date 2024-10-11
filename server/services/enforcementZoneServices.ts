import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import ErrorResponseModel, { ErrorResponse } from '../models/ErrorResponse'
import { SanitisedError } from '../sanitisedError'
import { serialiseDate } from '../utils/utils'

type UpdateZoneRequestInpput = AuthenticatedRequestInput & {
  orderId: string
  zoneId: number
  description: string
  duration: string
  endDay: string
  endMonth: string
  endYear: string
  startDay: string
  startMonth: string
  startYear: string
  zoneType: string | null
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
      await this.apiClient.put({
        path: `/api/orders/${input.orderId}/enforcementZone`,
        data: {
          description: input.description,
          duration: input.duration,
          zoneType: input.zoneType,
          zoneId: input.zoneId,
          orderId: input.orderId,
          startDate: serialiseDate(input.startYear, input.startMonth, input.startDay),
          endDate: serialiseDate(input.endYear, input.endMonth, input.endDay),
        },
        token: input.accessToken,
      })
      return null
    } catch (e) {
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
