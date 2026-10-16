import FeatureFlags from '../../utils/featureFlags'

const riskFlowPath = (targetPath: string, fallbackPath: string, orderId: string = ':orderId'): string =>
  FeatureFlags.getInstance().get('RISK_INFORMATION_FLOW_ENABLED')
    ? targetPath.replace(':orderId', orderId)
    : fallbackPath

export default riskFlowPath
