import RestClient from '../data/restClient'
import { Disability } from '../models/DeviceWearer'
import DeviceWearerService, { UpdateIdentityNumbersRequest } from './deviceWearerService'

jest.mock('../data/restClient')

const mockApiResponse = {
  nomisId: null,
  pncId: null,
  deliusId: null,
  prisonNumber: null,
  homeOfficeReferenceNumber: null,
  complianceAndEnforcementPersonReference: null,
  courtCaseReferenceNumber: null,
  firstName: null,
  lastName: null,
  alias: null,
  dateOfBirth: null,
  adultAtTimeOfInstallation: null,
  sex: null,
  gender: null,
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
            day: '01',
            month: '4',
            year: '1996',
            minutes: '00',
            hours: '00',
          },
          language: '',
          interpreterRequired: 'false',
          adultAtTimeOfInstallation: 'true',
          sex: 'MALE',
          gender: 'Male',
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
          sex: 'MALE',
          gender: 'Male',
          disabilities: 'MOBILITY,LEARNING_UNDERSTANDING_CONCENTRATING',
          otherDisability: '',
        },
        path: '/api/orders/mockUid/device-wearer',
        token: 'mockToken',
      })
    })
  })

  describe('updateIdentityNumbers', () => {
    it('should return validation errors if no identity numbers are provided', async () => {
      mockRestClient.put.mockResolvedValue(mockApiResponse)
      const service = new DeviceWearerService(mockRestClient)
      const updateIdentityNumbersRequestInput = {
        accessToken: 'token',
        orderId: '123',
        data: {
          identityNumbers: [],
          nomisId: '',
          pncId: '',
          deliusId: '',
          prisonNumber: '',
          homeOfficeReferenceNumber: '',
          complianceAndEnforcementPersonReference: '',
          courtCaseReferenceNumber: '',
        },
      }

      const result = await service.updateIdentityNumbers(updateIdentityNumbersRequestInput)

      expect(result).toEqual([
        {
          field: 'identityNumbers',
          error: 'Select all identity numbers that you have for the device wearer',
        },
      ])
      expect(mockRestClient.put).not.toHaveBeenCalled()
    })

    it('should return validation errors if a checkbox is selected but input is empty', async () => {
      const service = new DeviceWearerService(mockRestClient)
      const updateIdentityNumbersRequestInput = {
        accessToken: 'token',
        orderId: '123',
        data: {
          identityNumbers: ['NOMIS', 'DELIUS'],
          nomisId: '',
          deliusId: '',
        },
      } as unknown as UpdateIdentityNumbersRequest

      const result = await service.updateIdentityNumbers(updateIdentityNumbersRequestInput)

      expect(result).toEqual([
        { field: 'nomisId', error: 'Enter NOMIS ID' },
        { field: 'deliusId', error: 'Enter NDelius ID' },
      ])
      expect(mockRestClient.put).not.toHaveBeenCalled()
    })

    it('should transform data and call the API on success', async () => {
      const service = new DeviceWearerService(mockRestClient)
      mockRestClient.put.mockResolvedValue(mockApiResponse)

      const updateIdentityNumbersRequestInput = {
        accessToken: 'token',
        orderId: '123',
        data: {
          identityNumbers: ['NOMIS', 'COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE'],
          nomisId: 'A123',
          complianceAndEnforcementPersonReference: 'CEPR-1',
        },
      } as unknown as UpdateIdentityNumbersRequest

      await service.updateIdentityNumbers(updateIdentityNumbersRequestInput)

      expect(mockRestClient.put).toHaveBeenCalledWith({
        path: '/api/orders/123/device-wearer/identity-numbers',
        token: 'token',
        data: expect.objectContaining({
          identityNumbers: ['NOMIS', 'COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE'],
          nomisId: 'A123',
          complianceAndEnforcementPersonReference: 'CEPR-1',
        }),
      })
    })
  })
})
