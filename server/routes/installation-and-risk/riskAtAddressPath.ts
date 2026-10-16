import paths from '../../constants/paths'
import FeatureFlags from '../../utils/featureFlags'

const riskAtAddressPath = (fallbackPath: string, orderId: string = ':orderId'): string =>
  FeatureFlags.getInstance().get('RISK_INFORMATION_FLOW_ENABLED')
    ? paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', orderId)
    : fallbackPath

export default riskAtAddressPath
