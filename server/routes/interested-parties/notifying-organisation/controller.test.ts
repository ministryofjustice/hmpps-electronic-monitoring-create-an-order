import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'
import UpdateInterestedPartiesService from '../interestedPartiesService'
import NotifingOrganisationController from './controller'

describe('NotifingOrganisationController', () => {
  const store = {} as jest.Mocked<InterestedPartiesStoreService>
  const interestedPartiesService = {
    update: jest.fn(),
  } as unknown as jest.Mocked<UpdateInterestedPartiesService>
  const controller = new NotifingOrganisationController(store, interestedPartiesService)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('persists a non-Family court', async () => {
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
  })

  it('persists a Prison organisation and routes to the summary', async () => {
    const order = getMockOrder({ isSentencingAct: true })
    const req = createMockRequest({
      order,
      body: {
        notifyingOrganisation: 'PRISON',
        prison: 'ALTCOURSE_PRISON',
        notifyingOrganisationEmail: 'prison@example.com',
      },
      flash: jest.fn(),
    })
    const res = createMockResponse()
    res.locals.user.cohort = { cohort: 'PRISON' } as never

    await controller.update(req, res, jest.fn())

    expect(interestedPartiesService.update).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/summary`)
  })
})
