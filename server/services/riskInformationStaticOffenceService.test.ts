import RestClient from '../data/restClient'
import FeatureFlags from '../utils/featureFlags'
import RiskInformationStaticOffenceService from './riskInformationStaticOffenceService'

jest.mock('../data/restClient')

describe('RiskInformationStaticOffenceService', () => {
  let apiClient: jest.Mocked<RestClient>
  let service: RiskInformationStaticOffenceService

  beforeEach(() => {
    apiClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    service = new RiskInformationStaticOffenceService(apiClient)
    jest.spyOn(FeatureFlags.getInstance(), 'get').mockImplementation(flag => flag === 'OFFENCE_FLOW_ENABLED')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('persists the fixed offence for a non-Family court without a date', async () => {
    await service.initialise({
      orderId: 'order-id',
      accessToken: 'token',
      notifyingOrganisation: 'CIVIL_COUNTY_COURT',
    })

    expect(apiClient.put).toHaveBeenCalledWith({
      path: '/api/orders/order-id/offence',
      token: 'token',
      data: {
        offences: ['VIOLENCE_AGAINST_THE_PERSON'],
        offenceType: 'VIOLENCE_AGAINST_THE_PERSON',
      },
    })
  })

  it.each(['FAMILY_COURT', 'HOME_OFFICE', 'PRISON'] as const)(
    'does not persist an offence for %s',
    async organisation => {
      await service.initialise({
        orderId: 'order-id',
        accessToken: 'token',
        notifyingOrganisation: organisation,
      })

      expect(apiClient.put).not.toHaveBeenCalled()
    },
  )

  it('does not persist an offence when the new flow is disabled', async () => {
    jest.spyOn(FeatureFlags.getInstance(), 'get').mockReturnValue(false)

    await service.initialise({
      orderId: 'order-id',
      accessToken: 'token',
      notifyingOrganisation: 'CROWN_COURT',
    })

    expect(apiClient.put).not.toHaveBeenCalled()
  })
})
