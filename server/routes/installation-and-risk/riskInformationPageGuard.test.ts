import { getMockOrder } from '../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import FeatureFlags from '../../utils/featureFlags'
import createRiskInformationPageGuard from './riskInformationPageGuard'

describe('createRiskInformationPageGuard', () => {
  beforeEach(() => {
    jest.spyOn(FeatureFlags.getInstance(), 'get').mockImplementation(flag => flag === 'OFFENCE_FLOW_ENABLED')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('allows a standard organisation to access offence entry', () => {
    const order = getMockOrder()
    const req = createMockRequest({ order })
    const res = createMockResponse()
    const next = jest.fn()

    createRiskInformationPageGuard('OFFENCE')(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it.each(['CIVIL_COUNTY_COURT', 'FAMILY_COURT'] as const)(
    'redirects %s away from offence entry',
    notifyingOrganisation => {
      const order = getMockOrder({
        interestedParties: {
          ...getMockOrder().interestedParties!,
          notifyingOrganisation,
        },
      })
      const req = createMockRequest({ order })
      const res = createMockResponse()
      const next = jest.fn()

      createRiskInformationPageGuard('OFFENCE')(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/installation-and-risk/details-of-installation`)
    },
  )

  it.each(['OFFENCE_LIST', 'DAPO'] as const)('redirects away from obsolete %s pages', page => {
    const order = getMockOrder()
    const req = createMockRequest({ order })
    const res = createMockResponse()
    const next = jest.fn()

    createRiskInformationPageGuard(page)(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/installation-and-risk/details-of-installation`)
  })

  it('preserves existing routes when the new flow is disabled', () => {
    jest.spyOn(FeatureFlags.getInstance(), 'get').mockReturnValue(false)
    const req = createMockRequest({ order: getMockOrder() })
    const res = createMockResponse()
    const next = jest.fn()

    createRiskInformationPageGuard('DAPO')(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })
})
