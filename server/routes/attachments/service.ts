import { Readable } from 'stream'
import { ZodError } from 'zod'
import RestClient from '../../data/restClient'
import { AuthenticatedRequestInput } from '../../interfaces/request'
import ErrorResponseModel, { ErrorResponse } from '../../models/ErrorResponse'
import { SanitisedError } from '../../sanitisedError'
import Result from '../../interfaces/result'
import { validationErrors } from '../../constants/validationErrors'
import { convertBackendErrorToValidationError, convertZodErrorToValidationError } from '../../utils/errors'
import { FileRequiredFormData, FileRequiredFormDataValidator } from './fileRequiredFormModel'

type AttachmentRequestInput = AuthenticatedRequestInput & {
  orderId: string
  fileType: string
}
type UploadAttachmentRequestInput = AttachmentRequestInput & {
  file: Express.Multer.File | undefined
}
type FileRequiredFormInput = AuthenticatedRequestInput & {
  orderId: string
  data: FileRequiredFormData
}

export default class AttachmentService {
  constructor(private readonly apiClient: RestClient) {}

  async uploadAttachment(input: UploadAttachmentRequestInput): Promise<ErrorResponse> {
    if (input.file === undefined) {
      return {
        status: 400,
        userMessage: validationErrors.attachments.licenceRequired,
        developerMessage: 'User did not upload a file.',
      }
    }

    try {
      await this.apiClient.postMultiPart({
        path: `/api/orders/${input.orderId}/document-type/${input.fileType}`,
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

  async downloadAttachment(input: AttachmentRequestInput): Promise<Readable> {
    return this.apiClient.stream({
      path: `/api/orders/${input.orderId}/document-type/${input.fileType}/raw`,
      token: input.accessToken,
    })
  }

  async deleteAttachment(input: AttachmentRequestInput): Promise<Result<void, string>> {
    try {
      await this.apiClient.delete({
        path: `/api/orders/${input.orderId}/document-type/${input.fileType}`,
        token: input.accessToken,
      })

      return {
        ok: true,
      }
    } catch (e) {
      const sanitisedError = e as SanitisedError
      const apiError = ErrorResponseModel.parse(sanitisedError.data)
      if (apiError.status === 400) {
        return {
          ok: false,
          error: apiError.userMessage || '',
        }
      }

      throw e
    }
  }

  async updateFileRequired(input: FileRequiredFormInput) {
    try {
      const requestBody = FileRequiredFormDataValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/attachments/file-required`,
        data: requestBody,
        token: input.accessToken,
      })
      return result
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
}
