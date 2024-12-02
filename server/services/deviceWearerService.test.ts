import RestClient from '../data/restClient'
import { Disability } from '../models/DeviceWearer'
import DeviceWearerService from './deviceWearerService'

jest.mock('../data/restClient')

const mockApiResponse = {
  nomisId: null,
  pncId: null,
  deliusId: null,
  prisonNumber: null,
  homeOfficeReferenceNumber: null,
  firstName: null,
  lastName: null,
  alias: null,
  dateOfBirth: null,
  adultAtTimeOfInstallation: null,
  sex: null,
  gender: null,
  otherGender: null,
  disabilities: null,
  noFixedAbode: null,
  language: null,
  interpreterRequired: null,
}

describe('Device wearer service', () => {
  let mockRestClient: jest.Mocked<RestClient>

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
  })

  describe('updateDeviceWearer', () => {
    it('should send device wearer disabilities to API as a string', async () => {
      mockRestClient.put.mockResolvedValue(mockApiResponse)
      const deviceWearerService = new DeviceWearerService(mockRestClient)
      const updateDeviceWearerRequestInput = {
        accessToken: 'mockToken',
        orderId: 'mockUid',
        data: {
          firstName: 'First names',
          lastName: 'Surname',
          alias: '',
          dateOfBirth: {
            day: '1',
            month: '4',
            year: '1996',
          },
          language: '',
          interpreterRequired: 'false',
          adultAtTimeOfInstallation: 'true',
          sex: 'male',
          gender: 'male',
          otherGender: '',
          disabilities: ['MOBILITY', 'LEARNING_UNDERSTANDING_CONCENTRATING'] as Array<Disability>,
          otherDisability: '',
        },
      }

      await deviceWearerService.updateDeviceWearer(updateDeviceWearerRequestInput)

      expect(mockRestClient.put).toHaveBeenCalledWith({
        data: {
          firstName: 'First names',
          lastName: 'Surname',
          alias: '',
          dateOfBirth: '1996-04-01T00:00:00.000Z',
          interpreterRequired: false,
          language: '',
          adultAtTimeOfInstallation: true,
          sex: 'male',
          gender: 'male',
          otherGender: '',
          disabilities: 'MOBILITY,LEARNING_UNDERSTANDING_CONCENTRATING',
          otherDisability: '',
        },
        path: '/api/orders/mockUid/device-wearer',
        token: 'mockToken',
      })
    })
  })
})
