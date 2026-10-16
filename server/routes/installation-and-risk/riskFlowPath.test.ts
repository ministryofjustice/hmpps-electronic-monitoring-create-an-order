import paths from '../../constants/paths'
import FeatureFlags from '../../utils/featureFlags'
import riskFlowPath from './riskFlowPath'

describe('riskFlowPath', () => {
  const target = paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS
  const fallback = '/fallback'

  afterEach(() => jest.restoreAllMocks())

  describe('when the risk information flow is enabled', () => {
    beforeEach(() => jest.spyOn(FeatureFlags.getInstance(), 'get').mockReturnValue(true))

    it('returns the target path for the order', () => {
      expect(riskFlowPath(target, fallback, 'order-1')).toBe(target.replace(':orderId', 'order-1'))
    })

    it('keeps the order id placeholder when no order id is given', () => {
      expect(riskFlowPath(target, fallback)).toBe(target)
    })
  })

  describe('when the risk information flow is disabled', () => {
    beforeEach(() => jest.spyOn(FeatureFlags.getInstance(), 'get').mockReturnValue(false))

    it('returns the fallback path', () => {
      expect(riskFlowPath(target, fallback, 'order-1')).toBe(fallback)
    })
  })
})
