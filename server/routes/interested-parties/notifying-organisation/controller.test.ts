import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'
import UpdateInterestedPartiesService from '../interestedPartiesService'
import SentencingActService from '../../sentencing-act-selection/SentencingActService'
import NotifingOrganisationController from './controller'

describe('NotifingOrganisationController', () => {
  const store = {} as jest.Mocked<InterestedPartiesStoreService>
  const interestedPartiesService = {
    update: jest.fn(),
  } as unknown as jest.Mocked<UpdateInterestedPartiesService>
  const sentencingActService = {
    setSentencingActFlag: jest.fn(),
  } as unknown as jest.Mocked<SentencingActService>
  const controller = new NotifingOrganisationController(store, interestedPartiesService, sentencingActService)

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

  it('sets the new rules for a new prison order without showing the sentencing act page', async () => {
    const order = getMockOrder()
    const req = createMockRequest({
      order,
      body: {
        notifyingOrganisation: 'PRISON',
        prison: 'ALTCOURSE_PRISON',
        notifyingOrganisationEmail: 'prison@example.com',
      },
      flash: jest.fn(),
    })
    req.session.newOrderIdsForSentencingAct = [order.id]
    const res = createMockResponse()
    res.locals.user.cohort = { cohort: 'PRISON' } as never

    await controller.update(req, res, jest.fn())

    expect(sentencingActService.setSentencingActFlag).toHaveBeenCalledWith({
      accessToken: 'fakeUserToken',
      orderId: order.id,
      isSentencingAct: true,
    })
    expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/summary`)
  })

  it('sets new rules for a newly created service request order', async () => {
    const order = getMockOrder({ type: 'REINSTALL_DEVICE' })
    const req = createMockRequest({
      order,
      body: {
        notifyingOrganisation: 'PRISON',
        prison: 'ALTCOURSE_PRISON',
        notifyingOrganisationEmail: 'prison@example.com',
      },
      flash: jest.fn(),
    })
    req.session.newOrderIdsForSentencingAct = [order.id]
    const res = createMockResponse()
    res.locals.user.cohort = { cohort: 'PRISON' } as never

    await controller.update(req, res, jest.fn())

    expect(sentencingActService.setSentencingActFlag).toHaveBeenCalledWith({
      accessToken: 'fakeUserToken',
      orderId: order.id,
      isSentencingAct: true,
    })
    expect(req.session.newOrderIdsForSentencingAct).not.toContain(order.id)
  })

  it.each([true, false, undefined])('does not change a variation rule flag (%s)', async isSentencingAct => {
    const order = getMockOrder({
      type: 'VARIATION',
      isSentencingAct,
    })
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

    expect(sentencingActService.setSentencingActFlag).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/summary`)
  })
})
