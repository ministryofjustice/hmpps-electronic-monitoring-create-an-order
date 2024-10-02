import { Readable } from 'stream'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import ErrorResponseModel, { ErrorResponse } from '../models/ErrorResponse'
import { SanitisedError } from '../sanitisedError'

type DownloadAttachmentRequestInpput = AuthenticatedRequestInput & {
  orderId: string
  fileType: string
}
type UploadAttachmentRequestInput = DownloadAttachmentRequestInpput & {
  file: Express.Multer.File
}
export default class AttachmentService {
  constructor(private readonly apiClient: RestClient) {}

  async uploadAttachment(input: UploadAttachmentRequestInput): Promise<ErrorResponse> {
    try {
      await this.apiClient.postMultiPart({
        path: `/api/order/${input.orderId}/document-type/${input.fileType}`,
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

  async downloadAttachment(input: DownloadAttachmentRequestInpput): Promise<Readable> {
    return this.apiClient.stream({
      path: `/api/order/${input.orderId}/document-type/${input.fileType}/raw`,
      token: input.accessToken,
    })
  }
}
