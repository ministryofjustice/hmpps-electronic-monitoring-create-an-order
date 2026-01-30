import RestClient from '../../data/restClient'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import AuditService from '../../services/auditService'
import TaskListService from '../../services/taskListService'
import InterestedPartiesController from './interestedPartiesController'
import InterestedPartiesService from '../../services/interestedPartiesService'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/interestedPartiesService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const createMockOrder = getMockOrder({
  interestedParties: {
    notifyingOrganisation: 'MAGISTRATES_COURT',
    notifyingOrganisationName: 'CITY_OF_WESTMINSTER_MAGISTRATES_COURT_INTERNATIONAL_OFFICE',
    notifyingOrganisationEmail: 'test@test.com',
    responsibleOfficerName: 'John Smith',
    responsibleOfficerPhoneNumber: '01234567890',
    responsibleOrganisation: 'PROBATION',
    responsibleOrganisationRegion: 'GREATER_MANCHESTER',
    responsibleOrganisationEmail: 'test2@test.com',
  },
})

describe('InterestedPartiesController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockInterestedPartiesService: jest.Mocked<InterestedPartiesService>
  let interestedPartiesController: InterestedPartiesController
  const taskListService = {
    getNextCheckYourAnswersPage: jest.fn(),
    getNextPage: jest.fn(),
  } as unknown as jest.Mocked<TaskListService>

  beforeEach(() => {
    mockAuditClient = new HmppsAuditClient({
      queueUrl: '',
      enabled: true,
      region: '',
      serviceName: '',
    }) as jest.Mocked<HmppsAuditClient>
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    mockInterestedPartiesService = new InterestedPartiesService(mockRestClient) as jest.Mocked<InterestedPartiesService>
    interestedPartiesController = new InterestedPartiesController(
      mockAuditService,
      mockInterestedPartiesService,
      taskListService,
    )

    jest.useFakeTimers()
    jest.setSystemTime(new Date('2020-01-01'))
    jest.clearAllMocks()
  })

  describe('viewInterestedParties', () => {
    it('should render the form when there are no saved interested parties details', async () => {
      // Given
      const req = createMockRequest({ order: getMockOrder(), flash: jest.fn().mockReturnValue([]) })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await interestedPartiesController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/contact-information/interested-parties',
        expect.objectContaining({
          notifyingOrganisation: {
            value: '',
          },
          notifyingOrganisationName: {
            value: '',
          },
          notifyingOrganisationEmail: {
            value: '',
          },
          responsibleOfficerName: {
            value: '',
          },
          responsibleOfficerPhoneNumber: {
            value: '',
          },
          responsibleOrganisation: {
            value: '',
          },
          responsibleOrganisationRegion: {
            value: '',
          },
          responsibleOrganisationEmail: {
            value: '',
          },
          errorSummary: null,
        }),
      )
    })

    it('should render the form using saved interested parties data', async () => {
      // Given
      const req = createMockRequest({ order: createMockOrder, flash: jest.fn().mockReturnValue([]) })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await interestedPartiesController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/contact-information/interested-parties',
        expect.objectContaining({
          notifyingOrganisation: {
            value: 'MAGISTRATES_COURT',
          },
          notifyingOrganisationName: {
            value: 'CITY_OF_WESTMINSTER_MAGISTRATES_COURT_INTERNATIONAL_OFFICE',
          },
          notifyingOrganisationEmail: {
            value: 'test@test.com',
          },
          responsibleOfficerName: {
            value: 'John Smith',
          },
          responsibleOfficerPhoneNumber: {
            value: '01234567890',
          },
          responsibleOrganisation: {
            value: 'PROBATION',
          },
          responsibleOrganisationRegion: {
            value: 'GREATER_MANCHESTER',
          },
          responsibleOrganisationEmail: {
            value: 'test2@test.com',
          },
          errorSummary: null,
        }),
      )
    })
  })

  describe('updateInterestedParties', () => {
    it('should save and redirect to the contact information check your answers page', async () => {
      // Given
      const order = getMockOrder()
      const req = createMockRequest({
        order,
        body: {
          action: 'continue',
          notifyingOrganisation: 'YOUTH_COURT',
          youthCourt: 'PENRITH_YOUTH_COURT',
          notifyingOrganisationEmail: 'test@test.com',
          responsibleOfficerName: 'John Smith',
          responsibleOfficerPhoneNumber: '01234567890',
          responsibleOrganisation: 'PROBATION',
          policeArea: 'GREATER_MANCHESTER',
          responsibleOrganisationEmail: 'test2@test.com',
          crownCourt: '',
          civilCountyCourt: '',
          familyCourt: '',
          magistratesCourt: '',
          militaryCourt: '',
          prison: '',
          youthCustodyServiceRegion: '',
          yjsRegion: '',
          responsibleOrgProbationRegion: '',
        },
        params: {
          orderId: order.id,
        },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockInterestedPartiesService.update.mockResolvedValue({
        ...order.deviceWearer,
        notifyingOrganisation: 'YOUTH_COURT',
        notifyingOrganisationName: 'PENRITH_YOUTH_COURT',
        notifyingOrganisationEmail: 'test@test.com',
        responsibleOfficerName: 'John Smith',
        responsibleOfficerPhoneNumber: '01234567890',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationRegion: 'GREATER_MANCHESTER',
        responsibleOrganisationEmail: 'test2@test.com',
      })

      taskListService.getNextPage = jest
        .fn()
        .mockReturnValue(`/order/${order.id}/contact-information/check-your-answers`)

      // When
      await interestedPartiesController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()

      expect(mockInterestedPartiesService.update).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: order.id,
          data: expect.objectContaining({
            notifyingOrganisation: 'YOUTH_COURT',
            youthCourt: 'PENRITH_YOUTH_COURT',
            notifyingOrganisationEmail: 'test@test.com',
            responsibleOfficerName: 'John Smith',
            responsibleOfficerPhoneNumber: '01234567890',
            responsibleOrganisation: 'PROBATION',
            policeArea: 'GREATER_MANCHESTER',
            responsibleOrganisationEmail: 'test2@test.com',
          }),
        }),
      )

      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/contact-information/check-your-answers`)
    })
  })
})
