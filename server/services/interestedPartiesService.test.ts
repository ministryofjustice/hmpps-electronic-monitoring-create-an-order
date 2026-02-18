import RestClient from '../data/restClient'
import InterestedPartiesService from './interestedPartiesService'
import { NotifyingOrganisationEnum } from '../models/NotifyingOrganisation'
import { ResponsibleOrganisationEnum } from '../models/ResponsibleOrganisation'

jest.mock('../data/restClient')

describe('Interested parties service', () => {
  let mockRestClient: jest.Mocked<RestClient>

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
  })

  describe('update', () => {
    it('should map prison and probation data correctly', async () => {
      const service = new InterestedPartiesService(mockRestClient)
      const mockApiResponse = {
        notifyingOrganisation: 'PRISON',
        notifyingOrganisationName: 'FELTHAM_PRISON',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationRegion: 'NORTH_EAST',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOfficerName: 'name',
        responsibleOfficerPhoneNumber: '0123456789',
      }
      mockRestClient.put.mockResolvedValue(mockApiResponse)

      const mockRequestData = {
        notifyingOrganisation: NotifyingOrganisationEnum.Enum.PRISON,
        prison: 'FELTHAM_PRISON',
        responsibleOrganisation: ResponsibleOrganisationEnum.Enum.PROBATION,
        responsibleOrgProbationRegion: 'NORTH_EAST',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOfficerName: 'name',
        responsibleOfficerPhoneNumber: '0123456789',
        civilCountyCourt: '',
        crownCourt: '',
        familyCourt: '',
        magistratesCourt: '',
        militaryCourt: '',
        youthCourt: '',
        youthCustodyServiceRegion: '',
        policeArea: '',
        yjsRegion: '',
      }

      const result = await service.update({
        orderId: '123',
        accessToken: 'mockToken',
        data: mockRequestData,
      })

      expect(mockRestClient.put).toHaveBeenCalledWith({
        path: '/api/orders/123/interested-parties',
        token: 'mockToken',
        data: {
          notifyingOrganisation: 'PRISON',
          notifyingOrganisationName: 'FELTHAM_PRISON',
          responsibleOrganisation: 'PROBATION',
          responsibleOrganisationRegion: 'NORTH_EAST',
          notifyingOrganisationEmail: 'notifying@organisation',
          responsibleOrganisationEmail: 'responsible@organisation',
          responsibleOfficerName: 'name',
          responsibleOfficerPhoneNumber: '0123456789',
        },
      })

      expect(result).toEqual(mockApiResponse)
    })

    it('should correctly map COURTS and POLICE selections', async () => {
      const service = new InterestedPartiesService(mockRestClient)
      const mockApiResponse = {
        notifyingOrganisation: 'CROWN_COURT',
        notifyingOrganisationName: 'BRISTOL_CROWN_COURT',
        responsibleOrganisation: 'POLICE',
        responsibleOrganisationRegion: 'CHESHIRE',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOfficerName: 'name',
        responsibleOfficerPhoneNumber: '0123456789',
      }
      mockRestClient.put.mockResolvedValue(mockApiResponse)

      const mockRequestData = {
        notifyingOrganisation: NotifyingOrganisationEnum.Enum.CROWN_COURT,
        crownCourt: 'BRISTOL_CROWN_COURT',
        responsibleOrganisation: ResponsibleOrganisationEnum.Enum.POLICE,
        policeArea: 'CHESHIRE',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOfficerName: 'name',
        responsibleOfficerPhoneNumber: '0123456789',
        prison: '',
        civilCountyCourt: '',
        familyCourt: '',
        magistratesCourt: '',
        militaryCourt: '',
        youthCourt: '',
        youthCustodyServiceRegion: '',
        responsibleOrgProbationRegion: '',
        yjsRegion: '',
      }

      const result = await service.update({
        orderId: '123',
        accessToken: 'mockToken',
        data: mockRequestData,
      })

      expect(mockRestClient.put).toHaveBeenCalledWith({
        path: '/api/orders/123/interested-parties',
        token: 'mockToken',
        data: {
          notifyingOrganisation: 'CROWN_COURT',
          notifyingOrganisationName: 'BRISTOL_CROWN_COURT',
          responsibleOrganisation: 'POLICE',
          responsibleOrganisationRegion: 'CHESHIRE',
          notifyingOrganisationEmail: 'notifying@organisation',
          responsibleOrganisationEmail: 'responsible@organisation',
          responsibleOfficerName: 'name',
          responsibleOfficerPhoneNumber: '0123456789',
        },
      })

      expect(result).toEqual(mockApiResponse)
    })

    it('should correctly map YCS and YJS selections', async () => {
      const service = new InterestedPartiesService(mockRestClient)
      const mockApiResponse = {
        notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
        notifyingOrganisationName: 'MIDLANDS',
        responsibleOrganisation: 'YJS',
        responsibleOrganisationRegion: 'YORKSHIRE_AND_HUMBERSIDE',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOfficerName: 'name',
        responsibleOfficerPhoneNumber: '0123456789',
      }
      mockRestClient.put.mockResolvedValue(mockApiResponse)

      const mockRequestData = {
        notifyingOrganisation: NotifyingOrganisationEnum.Enum.YOUTH_CUSTODY_SERVICE,
        youthCustodyServiceRegion: 'MIDLANDS',
        responsibleOrganisation: ResponsibleOrganisationEnum.Enum.YJS,
        yjsRegion: 'YORKSHIRE_AND_HUMBERSIDE',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOfficerName: 'name',
        responsibleOfficerPhoneNumber: '0123456789',
        prison: '',
        civilCountyCourt: '',
        crownCourt: '',
        familyCourt: '',
        magistratesCourt: '',
        militaryCourt: '',
        youthCourt: '',
        responsibleOrgProbationRegion: '',
        policeArea: '',
      }

      const result = await service.update({
        orderId: '123',
        accessToken: 'mockToken',
        data: mockRequestData,
      })

      expect(mockRestClient.put).toHaveBeenCalledWith({
        path: '/api/orders/123/interested-parties',
        token: 'mockToken',
        data: expect.objectContaining({
          notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
          notifyingOrganisationName: 'MIDLANDS',
          responsibleOrganisation: 'YJS',
          responsibleOrganisationRegion: 'YORKSHIRE_AND_HUMBERSIDE',
        }),
      })

      expect(result).toEqual(mockApiResponse)
    })
  })
})
