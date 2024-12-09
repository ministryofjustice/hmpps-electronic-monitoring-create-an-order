import RestClient from '../data/restClient'
import AttachmentService from './attachmentService'

jest.mock('../data/restClient')

describe('Attachment service', () => {
  let mockRestClient: jest.Mocked<RestClient>

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
  })

  describe('uploadAttachment', () => {
    it('returns an error when the user does not provide a file for upload', async () => {
      const attachmentService = new AttachmentService(mockRestClient)
      const uploadAttachmentRequestInput = {
        accessToken: 'mockToken',
        orderId: 'mockUid',
        fileType: 'LICENCE',
        file: undefined,
      }

      const response = await attachmentService.uploadAttachment(uploadAttachmentRequestInput)

      expect(mockRestClient.post).not.toHaveBeenCalled()
      expect(response).toEqual({
        status: 400,
        userMessage: 'No file uploaded.',
        developerMessage: 'User did not upload a file.',
      })
    })
  })
})
