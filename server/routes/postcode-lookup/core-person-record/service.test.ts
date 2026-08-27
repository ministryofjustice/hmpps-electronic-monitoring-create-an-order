import RestClient from '../../../data/restClient'
import { createDeviceWearer, createInterestedParties, getMockOrder } from '../../../../test/mocks/mockOrder'
import CorePersonRecordService from './service'

jest.mock('../../../data/restClient')

describe('CorePersonRecordService', () => {
  const apiClient = new RestClient('cemoApi', {
    url: '',
    timeout: { response: 0, deadline: 0 },
    agent: { timeout: 0 },
  }) as jest.Mocked<RestClient>
  const service = new CorePersonRecordService(apiClient)

  beforeEach(() => jest.resetAllMocks())

  it('gets CPR details with addresses for an order and identifier', async () => {
    const response = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfBirth: '1980-01-01T00:00:00Z',
      organisationSearchId: 'A1234BC',
      addresses: [
        {
          addressType: 'PRIMARY',
          addressLine1: '1 Washington Street',
          addressLine2: '',
          addressLine3: 'Worcester',
          addressLine4: '',
          postcode: 'WR1 1NL',
        },
      ],
    }
    apiClient.get.mockResolvedValue(response)

    await expect(
      service.getPersonDetails({ accessToken: 'token', orderId: 'order-id', organisationSearchId: 'A1234BC' }),
    ).resolves.toEqual(response)
    expect(apiClient.get).toHaveBeenCalledWith({
      path: '/api/orders/order-id/device-wearer-details',
      query: { organisationSearchId: 'A1234BC' },
      token: 'token',
    })
  })

  it('uses the prison number for prison orders', () => {
    const order = getMockOrder({
      deviceWearer: createDeviceWearer({ prisonNumber: 'A1234BC' }),
      interestedParties: createInterestedParties({ notifyingOrganisation: 'PRISON' }),
    })

    expect(service.getOrganisationSearchId(order)).toBe('A1234BC')
  })

  it('uses the delius ID for probation orders', () => {
    const order = getMockOrder({
      deviceWearer: createDeviceWearer({ deliusId: 'X123456' }),
      interestedParties: createInterestedParties({ notifyingOrganisation: 'PROBATION' }),
    })

    expect(service.getOrganisationSearchId(order)).toBe('X123456')
  })

  it('does not return an identifier for unsupported notifying organisations', () => {
    const order = getMockOrder({
      deviceWearer: createDeviceWearer({ prisonNumber: 'A1234BC' }),
      interestedParties: createInterestedParties({ notifyingOrganisation: 'HOME_OFFICE' }),
    })

    expect(service.getOrganisationSearchId(order)).toBeNull()
  })
})
