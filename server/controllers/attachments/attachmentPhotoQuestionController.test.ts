import RestClient from '../../data/restClient'
import AttachmentService from '../../services/attachmentService'
import AttachmentPhotoQuestionController from './attachmentPhotoQuestionController'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { HavePhotoModelService } from '../../models/view-models/havePhoto'

jest.mock('../../services/attachmentService')
jest.mock('../../data/restClient')

describe('attachment have photo controller', () => {
  describe('when we call view', () => {
    let mockAttachmentService: jest.Mocked<AttachmentService>
    let mockModelService: jest.Mocked<HavePhotoModelService>
    let mockRestClient: jest.Mocked<RestClient>

    it('renders the view with no formData', () => {
      mockRestClient = new RestClient('cemoApi', {
        url: '',
        timeout: { response: 0, deadline: 0 },
        agent: { timeout: 0 },
      }) as jest.Mocked<RestClient>
      mockAttachmentService = new AttachmentService(mockRestClient) as jest.Mocked<AttachmentService>
      mockModelService = new HavePhotoModelService() as jest.Mocked<HavePhotoModelService>
      const req = createMockRequest({
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()

      const controller = new AttachmentPhotoQuestionController(mockAttachmentService, mockModelService)

      controller.view(req, res, jest.fn())

      expect(res.render).toHaveBeenCalledWith('pages/order/attachments/photo-question', {
        errorSummary: null,
        havePhoto: { error: undefined },
      })
    })
  })
})
