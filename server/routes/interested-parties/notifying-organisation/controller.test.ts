import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import RiskInformationService from '../../../services/riskInformationService'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'
import UpdateInterestedPartiesService from '../interestedPartiesService'
import NotifingOrganisationController from './controller'

describe('NotifingOrganisationController', () => {
  const store = {} as jest.Mocked<InterestedPartiesStoreService>
  const interestedPartiesService = {
    update: jest.fn(),
  } as unknown as jest.Mocked<UpdateInterestedPartiesService>
  const riskInformationService = {
    initialise: jest.fn(),
  } as unknown as jest.Mocked<RiskInformationService>

  const controller = new NotifingOrganisationController(store, interestedPartiesService, riskInformationService)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initialises risk information after persisting a non-Family court', async () => {
    const order = getMockOrder()
    const req = createMockRequest({
      order,
      body: {
        notifyingOrganisation: 'CIVIL_COUNTY_COURT',
        civilCountyCourt: 'ABERYSTWYTH_COUNTY_AND_CIVIL_COURT',
        notifyingOrganisationEmail: 'court@example.com',
      },
      flash: jest.fn(),
    })
    const res = createMockResponse()

    await controller.update(req, res, jest.fn())

    expect(interestedPartiesService.update).toHaveBeenCalled()
    expect(riskInformationService.initialise).toHaveBeenCalledWith({
      accessToken: 'fakeUserToken',
      orderId: order.id,
      notifyingOrganisation: 'CIVIL_COUNTY_COURT',
    })
  })

  it('does not persist data when notifying organisation validation fails', async () => {
    const req = createMockRequest({
      order: getMockOrder(),
      body: {
        notifyingOrganisationEmail: null,
      },
      flash: jest.fn(),
    })
    const res = createMockResponse()

    await controller.update(req, res, jest.fn())

    expect(interestedPartiesService.update).not.toHaveBeenCalled()
    expect(riskInformationService.initialise).not.toHaveBeenCalled()
  })
})
